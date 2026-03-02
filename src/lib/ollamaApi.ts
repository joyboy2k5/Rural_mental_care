export type Severity = 'low' | 'medium' | 'high' | 'critical';

const OLLAMA_BASE = import.meta.env.DEV ? '/ollama' : 'http://127.0.0.1:11434';

// Detect available model on startup
export const getAvailableModel = async (): Promise<string> => {
    try {
        const res = await fetch(`${OLLAMA_BASE}/api/tags`);
        const data = await res.json();
        if (data.models && data.models.length > 0) {
            // Find a model that is likely a text generation model (not an embedding model)
            const chatModel = data.models.find((m: any) => !m.name.includes('embed'));
            if (chatModel) return chatModel.name;
            return data.models[0].name;
        }
    } catch {
        // Ollama not available
    }
    return 'llama3.2'; // fallback
};

// Check if Ollama is reachable
export const checkOllamaAvailability = async (): Promise<boolean> => {
    try {
        const res = await fetch(`${OLLAMA_BASE}/api/tags`);
        return res.ok;
    } catch {
        return false;
    }
};

const severityKeywords = {
    critical: ['suicid', 'die', 'end my life', 'harm myself', 'kill myself', 'జీవితం వద్దు', 'मर जाना'],
    high: ['severe', 'unbearable', 'cant cope', 'breakdown', 'బాగా లేదు', 'बहुत बुरा'],
    medium: ['anxious', 'worried', 'stressed', 'depressed', 'sleep', 'overwhelm', 'ఆందోళన', 'చింత', 'तनाव', 'चिंता'],
};

export const extractSeverity = (text: string): Severity => {
    const lower = text.toLowerCase();
    for (const kw of severityKeywords.critical) if (lower.includes(kw)) return 'critical';
    for (const kw of severityKeywords.high) if (lower.includes(kw)) return 'high';
    for (const kw of severityKeywords.medium) if (lower.includes(kw)) return 'medium';
    return 'low';
};

const SYSTEM_PROMPT = `You are ManoVaidya, a compassionate, culturally-sensitive mental health triage assistant for rural India. You speak warmly like a trusted local health worker (Asha worker). Your responses must be:
- Empathetic, warm, never clinical or robotic
- Concise: 2-3 short sentences maximum
- In the SAME LANGUAGE the user writes in (Telugu, Hindi, or English)
- Never give medical diagnoses
- Always validate feelings before offering suggestions
- For critical/suicidal statements: immediately provide KIRAN helpline: 1800-599-0019
- Cultural idioms like "heart feels heavy" or "గుండె బరువుగా ఉంది" or "दिल भारी है" should be understood and responded to naturally`;

export const streamOllamaResponse = async (
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    modelName: string,
    onToken: (token: string) => void,
    onComplete: (fullText: string, severity: Severity) => void,
    onError: () => void
) => {
    try {
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: modelName, messages, stream: true }),
        });

        if (!response.ok || !response.body) throw new Error('Ollama unavailable');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(Boolean);
            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.message?.content) {
                        const token = json.message.content;
                        fullText += token;
                        onToken(token);
                    }
                } catch {
                    // skip malformed JSON chunks
                }
            }
        }

        onComplete(fullText, extractSeverity(userMessage));
    } catch (err) {
        console.error('Ollama stream error:', err);
        onError();
    }
};
