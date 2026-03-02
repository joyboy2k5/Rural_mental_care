import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Maximize2, Minimize2, AlertCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SeverityMeter from '@/components/SeverityMeter';
import CulturalContextBadge from '@/components/CulturalContextBadge';
import {
  streamOllamaResponse,
  getAvailableModel,
  checkOllamaAvailability,
  extractSeverity,
  type Severity,
} from '@/lib/ollamaApi';
import type { HealthRecord } from '@/pages/patient/PatientRecords';

/* ── Types ──────────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  idioms?: string[];
  timestamp: Date;
  error?: boolean;
}

/* ── Constants ──────────────────────────────────────────────────── */
const idiomMap: Record<string, string> = {
  'heart feels heavy': '💔 Heart feels heavy',
  'mind is crowded': '🧠 Mind is crowded',
  'గుండె బరువుగా': '💔 Heart feels heavy',
  'మనసు నిండిపోయింది': '🧠 Mind is crowded',
  'दिल भारी है': '💔 Heart feels heavy',
  'दिमाग भरा हुआ': '🧠 Mind is crowded',
};

/* ── Component ──────────────────────────────────────────────────── */
const TriageChatInterface = () => {
  const { t, language } = useLanguage();

  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [severity, setSeverity] = useState<Severity>('low');
  const [apiError, setApiError] = useState(false);

  // Ollama state
  const [ollamaModel, setOllamaModel] = useState<string>('llama3.2');
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);

  // Voice/Live state
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Refs - these are the SOURCE OF TRUTH for async callbacks
  const messagesEnd = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamingMsgIdRef = useRef<string | null>(null);

  // These refs are set DIRECTLY and SYNCHRONOUSLY - never through useEffect
  const isLiveModeRef = useRef(false);
  const languageRef = useRef(language);
  const ollamaModelRef = useRef(ollamaModel);
  const messagesRef = useRef(messages);
  const isStreamingRef = useRef(false);

  // Keep language ref in sync
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { ollamaModelRef.current = ollamaModel; }, [ollamaModel]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { isStreamingRef.current = isStreaming; }, [isStreaming]);

  // ── Init ────────────────────────────────────────────────────────
  useEffect(() => {
    setMessages([{
      id: '1',
      role: 'ai',
      text: t('chat.welcome'),
      timestamp: new Date(),
    }]);
  }, [language]);

  useEffect(() => {
    getAvailableModel().then(model => {
      setOllamaModel(model);
      ollamaModelRef.current = model;
    });
    checkOllamaAvailability().then(ok => setOllamaAvailable(ok));
  }, []);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────
  const detectIdioms = (text: string): string[] => {
    const found: string[] = [];
    Object.entries(idiomMap).forEach(([idiom, label]) => {
      if (text.toLowerCase().includes(idiom.toLowerCase())) found.push(label);
    });
    return found;
  };

  const getBCP47 = (lang?: string): string => {
    const l = lang || languageRef.current;
    return l === 'te' ? 'te-IN' : l === 'hi' ? 'hi-IN' : 'en-IN';
  };

  const getAIFallback = (text: string): { text: string; severity: Severity } => {
    const lower = text.toLowerCase();
    if (lower.includes('suicid') || lower.includes('end my life'))
      return { text: 'I hear you. Please call KIRAN: 1800-599-0019 immediately. You are not alone.', severity: 'critical' };
    if (lower.includes('anxious') || lower.includes('sleep') || lower.includes('చింత') || lower.includes('चिंता'))
      return { text: "I understand you're struggling. Can you tell me more about when this started?", severity: 'medium' };
    if (lower.includes('stress') || lower.includes('ఒత్తిడి') || lower.includes('तनाव'))
      return { text: "Stress is real and heavy. Let's talk about what's weighing on you most.", severity: 'medium' };
    return { text: "Thank you for sharing. I'm here to listen. How have you been feeling lately?", severity: 'low' };
  };

  // ── Save health record to localStorage ────────────────────────────
  const saveRecord = (userMessage: string, aiResponse: string, sev: Severity) => {
    // Only save medium, high, or critical severity
    if (sev === 'low') return;

    try {
      // Clean markdown from AI response for notes
      const cleanText = aiResponse
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .trim();

      const notes = cleanText.length > 150
        ? cleanText.slice(0, 150) + '...'
        : cleanText;

      // Extract action items
      const actionWords = ['practice', 'try', 'consider', 'call', 'reach', 'speak', 'contact', 'schedule', 'continue', 'avoid', 'talk'];
      const bulletRegex = /^\s*[-•*\d.]+\s+(.+)/gm;
      let actions: string[] = [];

      // First try to extract bullet/numbered items
      let match;
      while ((match = bulletRegex.exec(cleanText)) !== null) {
        if (match[1]?.trim()) actions.push(match[1].trim());
      }

      // If no bullets found, use heuristic on sentences
      if (actions.length === 0) {
        const sentences = cleanText.split(/[.!?]\s+|\n/).filter(s => s.trim().length > 5);
        actions = sentences.filter(s =>
          actionWords.some(w => s.toLowerCase().includes(w))
        );
      }

      // Limit to 3 actions, each trimmed to 60 chars
      actions = actions.slice(0, 3).map(a => {
        const trimmed = a.trim();
        return trimmed.length > 60 ? trimmed.slice(0, 60) + '...' : trimmed;
      });

      const record: HealthRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        severity: sev,
        notes,
        actions,
        chatSummary: userMessage.trim().length > 80
          ? userMessage.trim().slice(0, 80) + '...'
          : userMessage.trim(),
      };

      // Read existing, prepend new, cap at 50
      let existing: HealthRecord[] = [];
      try {
        const stored = localStorage.getItem('manovaidya_records');
        if (stored) existing = JSON.parse(stored);
      } catch { }

      const updated = [record, ...existing].slice(0, 50);
      localStorage.setItem('manovaidya_records', JSON.stringify(updated));
      window.dispatchEvent(new Event('manovaidya_records_updated'));
      console.log('[RECORDS] Saved record with severity:', sev);
    } catch (e) {
      console.error('[RECORDS] Failed to save record:', e);
    }
  };

  // ── TTS: speakText ───────────────────────────────────────────────
  // This function reads from refs only — safe to call from any async context
  const speakText = useCallback((text: string) => {
    console.log('[TTS] speakText called, text length:', text.length, 'isLiveMode:', isLiveModeRef.current);

    const synth = window.speechSynthesis;

    const doSpeak = () => {
      // Strip markdown symbols that sound bad when read aloud
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\n+/g, '. ')
        .trim();

      if (!cleanText) {
        console.warn('[TTS] Empty text after cleaning, skipping');
        return;
      }

      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = getBCP47();
      utter.rate = 0.88;
      utter.pitch = 1.05;
      utter.volume = 1.0;

      // Pick a voice that matches the language if available
      const voices = synth.getVoices();
      console.log('[TTS] Available voices:', voices.length);
      const langCode = getBCP47().split('-')[0]; // 'en', 'te', 'hi'
      const matchingVoice = voices.find(v => v.lang.startsWith(langCode))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0];
      if (matchingVoice) {
        utter.voice = matchingVoice;
        console.log('[TTS] Using voice:', matchingVoice.name, matchingVoice.lang);
      }

      utter.onstart = () => {
        console.log('[TTS] Speech started');
        setIsSpeaking(true);
      };

      utter.onend = () => {
        console.log('[TTS] Speech ended, isLiveMode:', isLiveModeRef.current);
        setIsSpeaking(false);
        // Auto-restart listening after AI finishes speaking (live mode loop)
        if (isLiveModeRef.current) {
          setTimeout(() => {
            console.log('[TTS→STT] Restarting listening after speech');
            startListening();
          }, 400);
        }
      };

      utter.onerror = (e) => {
        console.error('[TTS] SpeechSynthesisUtterance error:', e.error, e);
        setIsSpeaking(false);
      };

      console.log('[TTS] Calling synth.speak()');
      synth.speak(utter);
    };

    // Cancel any ongoing speech first, then wait 1 tick before speaking
    // This prevents Chrome's silent drop when cancel() and speak() happen in same call stack
    synth.cancel();
    setTimeout(() => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        doSpeak();
      } else {
        console.log('[TTS] Waiting for voices to load...');
        // Voices not loaded yet — wait for the event
        const onVoicesReady = () => {
          console.log('[TTS] Voices loaded, speaking now');
          synth.onvoiceschanged = null;
          doSpeak();
        };
        synth.onvoiceschanged = onVoicesReady;
        // Hard fallback: try after 800ms regardless
        setTimeout(() => {
          if (!isSpeaking) {
            synth.onvoiceschanged = null;
            doSpeak();
          }
        }, 800);
      }
    }, 80); // 80ms gap after cancel() — critical for Chrome
  }, []); // no deps — reads everything from refs

  // ── STT: startListening ──────────────────────────────────────────
  // Also reads from refs — safe to call from TTS onend callback
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }

    // Don't start if already listening or streaming
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { }
    }

    const recognition = new SR();
    recognition.lang = getBCP47();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('[STT] Listening started');
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results as any[]);
      const transcript = results.map((r: any) => r[0].transcript).join('');
      setInput(transcript);

      if ((event.results as any)[event.results.length - 1].isFinal && transcript.trim()) {
        console.log('[STT] Final transcript:', transcript);
        recognition.stop();
        // Small delay to let React process the input state update
        setTimeout(() => sendMessage(transcript), 150);
      }
    };

    recognition.onerror = (e: any) => {
      console.error('[STT] Error:', e.error);
      setIsListening(false);
      // 'no-speech' is not a fatal error in live mode — just restart
      if (isLiveModeRef.current && e.error === 'no-speech') {
        setTimeout(() => startListening(), 500);
      }
    };

    recognition.onend = () => {
      console.log('[STT] Listening ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error('[STT] Failed to start recognition:', e);
      setIsListening(false);
    }
  }, []); // no deps — reads everything from refs

  // ── Toggle Live Mode ─────────────────────────────────────────────
  const toggleLiveMode = useCallback(() => {
    if (isLiveModeRef.current) {
      // ── Turn OFF ──
      console.log('[LIVE] Turning OFF live mode');
      isLiveModeRef.current = false;  // set ref FIRST, synchronously
      setIsLiveMode(false);
      try { recognitionRef.current?.stop(); } catch { }
      window.speechSynthesis.cancel();
      setIsListening(false);
      setIsSpeaking(false);
    } else {
      // ── Turn ON ──
      console.log('[LIVE] Turning ON live mode');
      isLiveModeRef.current = true;  // set ref FIRST, synchronously
      setIsLiveMode(true);

      // CHROME AUDIO UNLOCK: Must speak audible text synchronously within
      // the click handler. Empty string or volume=0 does NOT work.
      // We speak a very short real word at very low (but non-zero) volume.
      const unlock = new SpeechSynthesisUtterance('.');
      unlock.volume = 0.01;  // barely audible but non-zero — this is what Chrome needs
      unlock.rate = 10;
      unlock.onend = () => {
        // After unlock completes, start listening
        console.log('[LIVE] Audio unlocked, starting STT');
        startListening();
      };
      window.speechSynthesis.speak(unlock);
    }
  }, [startListening]);

  // ── Send Message ─────────────────────────────────────────────────
  const sendMessage = useCallback(async (overrideText?: string) => {
    const messageText = (overrideText !== undefined ? overrideText : input).trim();
    if (!messageText) return;
    if (isStreamingRef.current) {
      console.log('[SEND] Blocked — already streaming');
      return;
    }

    console.log('[SEND] Sending:', messageText);

    const idioms = detectIdioms(messageText);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      idioms: idioms.length > 0 ? idioms : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    isStreamingRef.current = true;
    setApiError(false);

    // Build history from ref (not stale state)
    const history = messagesRef.current
      .filter(m => m.id !== '1')
      .map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }));

    const aiMsgId = (Date.now() + 1).toString();
    streamingMsgIdRef.current = aiMsgId;
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: '', timestamp: new Date() }]);

    await streamOllamaResponse(
      messageText,
      history,
      ollamaModelRef.current,  // read from ref, not state
      // onToken — stream text into message bubble
      (token) => {
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, text: m.text + token } : m)
        );
      },
      // onComplete
      (fullText, newSeverity) => {
        console.log('[SEND] Stream complete. Length:', fullText.length, 'isLiveMode:', isLiveModeRef.current);
        setSeverity(newSeverity);
        setIsStreaming(false);
        isStreamingRef.current = false;
        streamingMsgIdRef.current = null;

        // Save health record for non-trivial conversations
        saveRecord(messageText, fullText, newSeverity);

        if (isLiveModeRef.current) {
          console.log('[SEND] Live mode active — calling speakText');
          speakText(fullText);
        }
      },
      // onError
      () => {
        console.error('[SEND] Ollama error — using fallback');
        setIsStreaming(false);
        isStreamingRef.current = false;
        setApiError(true);
        streamingMsgIdRef.current = null;
        const fallback = getAIFallback(messageText);
        setSeverity(fallback.severity);
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, text: fallback.text, error: true } : m)
        );

        // Save health record for fallback too
        saveRecord(messageText, fallback.text, fallback.severity);

        if (isLiveModeRef.current) {
          speakText(fallback.text);
        }
      }
    );
  }, [input, speakText, startListening]);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch { }
    setIsListening(false);
  }, []);

  // ── JSX ──────────────────────────────────────────────────────────
  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-display text-xl font-semibold text-foreground">{t('sidebar.triage')}</h2>
          {ollamaAvailable === true && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-healing-green/15 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-healing-green animate-pulse" />
              <span className="text-xs font-medium text-healing-green">Local AI Active</span>
            </div>
          )}
          {ollamaAvailable === false && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-soft-gold/15 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 text-soft-gold" />
              <span className="text-xs font-medium text-soft-gold">Fallback Mode</span>
            </div>
          )}
          {apiError && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-md">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-700" />
              <span className="text-xs text-yellow-700">Using fallback</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SeverityMeter severity={severity} />
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : `${msg.error ? 'border border-yellow-400 bg-yellow-50' : 'glass-card'} text-foreground rounded-bl-md`
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                  {msg.id === streamingMsgIdRef.current && isStreaming && (
                    <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                  )}
                </p>
                {msg.idioms && msg.idioms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {msg.idioms.map((idiom, i) => (
                      <CulturalContextBadge key={i} label={idiom} />
                    ))}
                  </div>
                )}
                <span className="text-xs opacity-60 mt-1 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEnd} />
      </div>

      {/* Quick chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {[t('chat.chip.anxious'), t('chat.chip.sleep'), t('chat.chip.family'), t('chat.chip.stress')].map(chip => (
          <button
            key={chip}
            onClick={() => setInput(chip)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* LIVE Button */}
      <div className="flex justify-center py-3">
        <button
          onClick={toggleLiveMode}
          className={`
            relative flex flex-col items-center justify-center gap-1.5
            w-20 h-20 rounded-full font-bold text-white
            shadow-2xl transition-all duration-300 transform select-none
            ${isLiveMode
              ? 'bg-gradient-to-br from-destructive to-red-700 scale-110'
              : 'bg-gradient-to-br from-primary to-secondary hover:scale-105'}
          `}
          aria-label={isLiveMode ? 'Stop live mode' : 'Start live mode'}
        >
          {isLiveMode && (
            <>
              <span className="absolute inset-0 rounded-full bg-destructive/25 animate-ping" />
              <span className="absolute inset-[-6px] rounded-full border-2 border-destructive/40 animate-pulse" />
            </>
          )}
          {isListening ? (
            <div className="flex items-end gap-0.5 h-6 z-10">
              {[8, 16, 24, 16, 8].map((h, i) => (
                <div key={i} className="w-1 bg-white rounded-full voice-wave"
                  style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : isSpeaking ? (
            <Volume2 className="w-8 h-8 z-10" />
          ) : (
            <Mic className="w-8 h-8 z-10" />
          )}
          <span className="text-[10px] font-bold tracking-wider z-10">
            {isListening ? 'MIC ON' : isSpeaking ? 'TALKING' : isLiveMode ? 'LIVE' : 'LIVE'}
          </span>
        </button>
      </div>

      {/* Live status strip */}
      {isLiveMode && (
        <div className="flex justify-center mb-2">
          <div className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 transition-colors ${isListening ? 'bg-healing-green/20 text-healing-green' :
            isSpeaking ? 'bg-primary/20 text-primary' :
              isStreaming ? 'bg-soft-gold/20 text-soft-gold' :
                'bg-muted text-muted-foreground'
            }`}>
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-healing-green animate-pulse' :
              isSpeaking ? 'bg-primary animate-pulse' :
                isStreaming ? 'bg-soft-gold animate-pulse' :
                  'bg-muted-foreground'
              }`} />
            {isListening ? '🎤 Listening… speak now' :
              isSpeaking ? '🔊 ManoVaidya is speaking…' :
                isStreaming ? '⚡ Thinking…' :
                  '🎙 Live mode — waiting'}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 glass-card p-2 rounded-xl">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isLiveMode || isStreaming}
            className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-destructive text-white animate-pulse' : 'hover:bg-muted text-muted-foreground'
              } disabled:opacity-30`}
            title="Tap to dictate once"
          >
            <Mic className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={t('chat.placeholder')}
            rows={2}
            className="flex-1 resize-none bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriageChatInterface;
