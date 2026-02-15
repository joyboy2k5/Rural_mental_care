import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Landing
  'welcome.title': {
    en: 'Your Mental Health Matters',
    te: 'మీ మానసిక ఆరోగ్యం ముఖ్యం',
    hi: 'आपका मानसिक स्वास्थ्य मायने रखता है',
  },
  'welcome.subtitle': {
    en: 'Compassionate, culturally sensitive mental health support in your language',
    te: 'మీ భాషలో సానుభూతిపూర్వక, సాంస్కృతికంగా సున్నితమైన మానసిక ఆరోగ్య మద్దతు',
    hi: 'आपकी भाषा में दयालु, सांस्कृतिक रूप से संवेदनशील मानसिक स्वास्थ्य सहायता',
  },
  'nav.patient': {
    en: 'Patient Login',
    te: 'రోగి లాగిన్',
    hi: 'रोगी लॉगिन',
  },
  'nav.healthworker': {
    en: 'Healthcare Worker',
    te: 'ఆరోగ్య కార్యకర్త',
    hi: 'स्वास्थ्य कार्यकर्ता',
  },
  'nav.emergency': {
    en: 'Emergency Triage',
    te: 'అత్యవసర ట్రయాజ్',
    hi: 'आपातकालीन ट्राइएज',
  },
  'nav.getStarted': {
    en: 'Get Started',
    te: 'ప్రారంభించండి',
    hi: 'शुरू करें',
  },
  // Sidebar - Patient
  'sidebar.triage': { en: 'Triage Chat', te: 'ట్రయాజ్ చాట్', hi: 'ट्राइएज चैट' },
  'sidebar.dashboard': { en: 'Dashboard', te: 'డాష్‌బోర్డ్', hi: 'डैशबोर्ड' },
  'sidebar.records': { en: 'My Health Records', te: 'నా ఆరోగ్య రికార్డులు', hi: 'मेरे स्वास्थ्य रिकॉर्ड' },
  'sidebar.sessions': { en: 'Counseling Sessions', te: 'కౌన్సెలింగ్ సెషన్లు', hi: 'परामर्श सत्र' },
  'sidebar.resources': { en: 'Resources', te: 'వనరులు', hi: 'संसाधन' },
  'sidebar.settings': { en: 'Settings', te: 'సెట్టింగ్‌లు', hi: 'सेटिंग्स' },
  // Sidebar - Healthcare Worker
  'sidebar.queue': { en: 'Active Triage Queue', te: 'ట్రయాజ్ క్యూ', hi: 'ट्राइएज कतार' },
  'sidebar.patients': { en: 'Patient Management', te: 'రోగి నిర్వహణ', hi: 'रोगी प्रबंधन' },
  'sidebar.analytics': { en: 'Analytics & Reports', te: 'విశ్లేషణలు', hi: 'विश्लेषण' },
  'sidebar.resourceLib': { en: 'Resource Library', te: 'వనరుల గ్రంథాలయం', hi: 'संसाधन पुस्तकालय' },
  // Chat
  'chat.placeholder': { en: 'Type your message...', te: 'మీ సందేశాన్ని టైప్ చేయండి...', hi: 'अपना संदेश टाइप करें...' },
  'chat.send': { en: 'Send', te: 'పంపండి', hi: 'भेजें' },
  'chat.welcome': {
    en: 'Hello! I\'m here to help you. How are you feeling today?',
    te: 'నమస్కారం! మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మీరు ఈ రోజు ఎలా ఫీల్ అవుతున్నారు?',
    hi: 'नमस्ते! मैं आपकी मदद के लिए यहाँ हूँ। आज आप कैसा महसूस कर रहे हैं?',
  },
  'chat.severity': { en: 'Severity Level', te: 'తీవ్రత స్థాయి', hi: 'गंभीरता स्तर' },
  // Dashboard
  'dashboard.triageHistory': { en: 'Triage History', te: 'ట్రయాజ్ చరిత్ర', hi: 'ट्राइएज इतिहास' },
  'dashboard.upcoming': { en: 'Upcoming Sessions', te: 'రాబోయే సెషన్లు', hi: 'आगामी सत्र' },
  'dashboard.healthTip': { en: 'Health Tip of the Day', te: 'ఈ రోజు ఆరోగ్య చిట్కా', hi: 'आज का स्वास्थ्य सुझाव' },
  'dashboard.emergency': { en: 'Emergency Contact', te: 'అత్యవసర సంప్రదింపు', hi: 'आपातकालीन संपर्क' },
  'dashboard.resources': { en: 'Mental Health Resources', te: 'మానసిక ఆరోగ్య వనరులు', hi: 'मानसिक स्वास्थ्य संसाधन' },
  // Queue
  'queue.title': { en: 'Active Triage Queue', te: 'సక్రియ ట్రయాజ్ క్యూ', hi: 'सक्रिय ट्राइएज कतार' },
  'queue.approve': { en: 'Approve', te: 'ఆమోదించు', hi: 'स्वीकृत करें' },
  'queue.override': { en: 'Override', te: 'భర్తీ చేయు', hi: 'ओवरराइड करें' },
  'queue.schedule': { en: 'Schedule', te: 'షెడ్యూల్', hi: 'शेड्यूल करें' },
  // SOS
  'sos.button': { en: 'SOS Emergency', te: 'SOS అత్యవసరం', hi: 'SOS आपातकाल' },
  'sos.confirm': { en: 'Are you sure? This will alert emergency services.', te: 'మీరు ఖచ్చితంగా చెప్పగలరా? ఇది అత్యవసర సేవలను అప్రమత్తం చేస్తుంది.', hi: 'क्या आप सुनिश्चित हैं? यह आपातकालीन सेवाओं को सचेत करेगा।' },
  // Common
  'common.logout': { en: 'Logout', te: 'లాగ్ అవుట్', hi: 'लॉग आउट' },
  'common.back': { en: 'Back', te: 'వెనుకకు', hi: 'वापस' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
