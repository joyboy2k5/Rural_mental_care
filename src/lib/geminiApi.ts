import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set. Gemini API will not work.');
}

const client = new GoogleGenerativeAI(apiKey || '');

export type Severity = 'low' | 'medium' | 'high' | 'critical';

interface GeminiResponse {
  text: string;
  severity: Severity;
}

const severityKeywords = {
  critical: ['suicid', 'die', 'end my life', 'harm myself', 'self harm', 'kill myself'],
  high: ['severe', 'unbearable', 'cant cope', 'breakdown', 'emergency'],
  medium: ['anxious', 'worried', 'stressed', 'depressed', 'sleep', 'overwhelm'],
};

const extractSeverity = (text: string): Severity => {
  const lower = text.toLowerCase();
  
  for (const keyword of severityKeywords.critical) {
    if (lower.includes(keyword)) return 'critical';
  }
  
  for (const keyword of severityKeywords.high) {
    if (lower.includes(keyword)) return 'high';
  }
  
  for (const keyword of severityKeywords.medium) {
    if (lower.includes(keyword)) return 'medium';
  }
  
  return 'low';
};

export const getGeminiResponse = async (
  userMessage: string,
  conversationHistory: Array<{ role: string; text: string }> = []
): Promise<GeminiResponse> => {
  if (!apiKey) {
    // Fallback response if API key is not set
    return {
      text: 'I appreciate you sharing, but the AI service is not properly configured. Please ensure VITE_GEMINI_API_KEY is set.',
      severity: extractSeverity(userMessage),
    };
  }

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are a compassionate mental health triage assistant for rural mental health care. 
Your role is to:
1. Listen empathetically to patients' mental health concerns
2. Provide supportive responses in the user's language
3. Assess severity and risk factors
4. Recommend appropriate care resources
5. Be culturally sensitive and aware of rural context

Keep responses concise (2-3 sentences), warm, and non-judgmental. 
Never provide medical diagnosis, but always encourage professional help for serious concerns.`;

    const messages = conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.text }],
    }));

    messages.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const chat = model.startChat({
      history: messages.slice(0, -1),
    });

    const result = await chat.sendMessage(messages[messages.length - 1].parts[0].text);
    const responseText = result.response.text();

    const severity = extractSeverity(userMessage);

    return {
      text: responseText,
      severity,
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback response on error
    return {
      text: 'I apologize, but I encountered an issue. Please try again, or reach out to a mental health professional if you need immediate support.',
      severity: extractSeverity(userMessage),
    };
  }
};

export const detectLanguage = (text: string): string => {
  // Simple language detection based on script
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
  if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi
  return 'en'; // English
};
