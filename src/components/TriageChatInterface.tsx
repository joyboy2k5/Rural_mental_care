import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SeverityMeter from '@/components/SeverityMeter';
import CulturalContextBadge from '@/components/CulturalContextBadge';
import { getGeminiResponse, type Severity } from '@/lib/geminiApi';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  translation?: string;
  idioms?: string[];
  timestamp: Date;
  error?: boolean;
}

const quickChips: Record<string, string[]> = {
  en: ['I feel anxious', 'I can\'t sleep', 'Family problems', 'Work stress'],
  te: ['ఆందోళనగా ఉంది', 'నిద్ర రావడం లేదు', 'కుటుంబ సమస్యలు', 'పని ఒత్తిడి'],
  hi: ['मुझे चिंता हो रही है', 'नींद नहीं आती', 'परिवार की समस्या', 'काम का तनाव'],
};

const idiomMap: Record<string, string> = {
  'heart feels heavy': '💔 Heart feels heavy',
  'mind is crowded': '🧠 Mind is crowded',
  'గుండె బరువుగా': '💔 Heart feels heavy',
  'మనసు నిండిపోయింది': '🧠 Mind is crowded',
  'दिल भारी है': '💔 Heart feels heavy',
  'दिमाग भरा हुआ': '🧠 Mind is crowded',
};

export type Severity = 'low' | 'medium' | 'high' | 'critical';

const TriageChatInterface = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [compactInput, setCompactInput] = useState('');
  const [severity, setSeverity] = useState<Severity>('low');
  const [apiError, setApiError] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'ai',
        text: t('chat.welcome'),
        timestamp: new Date(),
      }]);
    }
  }, [language]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const detectIdioms = (text: string): string[] => {
    const found: string[] = [];
    Object.entries(idiomMap).forEach(([idiom, label]) => {
      if (text.toLowerCase().includes(idiom.toLowerCase())) found.push(label);
    });
    return found;
  };

  const getAIResponse = (userText: string): { text: string; severity: Severity } => {
    const lower = userText.toLowerCase();
    if (lower.includes('suicid') || lower.includes('die') || lower.includes('end my life')) {
      return { text: 'I hear you, and I want you to know you\'re not alone. Please reach out to a crisis helpline immediately. Your life matters. Would you like me to connect you with emergency services?', severity: 'critical' };
    }
    if (lower.includes('anxious') || lower.includes('ఆందోళన') || lower.includes('चिंता') || lower.includes('can\'t sleep') || lower.includes('నిద్ర') || lower.includes('नींद')) {
      return { text: 'I understand you\'re going through a difficult time. Anxiety and sleep issues are common, and there are effective ways to manage them. Can you tell me more about when these feelings started?', severity: 'medium' };
    }
    if (lower.includes('stress') || lower.includes('ఒత్తిడి') || lower.includes('तनाव')) {
      return { text: 'Stress can feel overwhelming, especially with work and family responsibilities. Let\'s talk about what\'s causing the most pressure. Are there specific situations that trigger this stress?', severity: 'medium' };
    }
    return { text: 'Thank you for sharing. I\'m here to listen and help. Could you tell me more about how you\'ve been feeling lately?', severity: 'low' };
  };

  const sendMessage = async (overrideText?: string) => {
    const messageText = overrideText !== undefined ? overrideText : input;
    if (!messageText.trim()) return;

    const idioms = detectIdioms(messageText);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      idioms: idioms.length > 0 ? idioms : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (overrideText === undefined) setInput('');
    else setCompactInput('');
    setIsTyping(true);
    setApiError(false);

    try {
      // Prepare conversation history for Gemini
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        text: msg.text,
      }));

      // Get response from Gemini API
      const response = await getGeminiResponse(messageText, conversationHistory);
      setSeverity(response.severity);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setApiError(true);

      // Fallback to basic response
      const fallbackResponse = getAIResponse(messageText);
      setSeverity(fallbackResponse.severity);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: fallbackResponse.text,
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-semibold text-foreground">{t('sidebar.triage')}</h2>
          {apiError && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-md">
              <AlertCircle className="w-4 h-4 text-yellow-700 dark:text-yellow-200" />
              <span className="text-xs text-yellow-700 dark:text-yellow-200">Using fallback responses</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SeverityMeter severity={severity} />
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
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
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : `${msg.error ? 'border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'glass-card'} text-foreground rounded-bl-md`
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
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

        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Quick chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {quickChips[language]?.map((chip) => (
          <button
            key={chip}
            onClick={() => setInput(chip)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 glass-card p-2 rounded-xl">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-destructive text-destructive-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            {isRecording ? (
              <div className="relative">
                <MicOff className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive pulse-ring" />
              </div>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={
              t('chat.placeholder') ||
              "Describe how you're feeling — e.g., \"I can't sleep and feel hopeless.\" (Shift+Enter for new line)"
            }
            aria-label={t('chat.inputAria') || 'Type your message here'}
            rows={2}
            className="flex-1 resize-none bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Floating quick input (bottom-right) */}
      <div className="fixed right-6 bottom-6 z-40 flex flex-col items-end gap-2">
        <div className="w-80 bg-background glass-card p-2 rounded-lg shadow-md flex items-center gap-2">
          <input
            value={compactInput}
            onChange={(e) => setCompactInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(compactInput);
              }
            }}
            placeholder={t('chat.quickPlaceholder') || 'Quick message...'}
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
          />
          <button
            onClick={() => sendMessage(compactInput)}
            disabled={!compactInput.trim()}
            className="p-2 rounded bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriageChatInterface;
