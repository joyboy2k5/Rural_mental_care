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
  'common.back': { en: 'Back', te: 'వెనుకకు', hi: 'वापस' },

  // Settings page
  'settings.title': { en: 'Settings', te: 'సెట్టింగ్లు', hi: 'सेटिंग्स' },
  'settings.subtitle': { en: 'Customize your ManoVaidya experience to suit your needs.', te: 'మీ అవసరాలకు తగినట్లు ManoVaidya అనుభవాన్ని మలచుకోండి.', hi: 'अपनी ज़रूरत के हिसाब से ManoVaidya का अनुभव सजाएं।' },
  'settings.language': { en: 'Language Preference', te: 'భాష ఎంపిక', hi: 'भाषा की प्राथमिकता' },
  'settings.accessibility': { en: 'Accessibility', te: 'సౌకర్యాలు', hi: 'सुगमता' },
  'settings.textSize': { en: 'Text Size', te: 'వచన పరిమాణం', hi: 'शब्दों का आकार' },
  'settings.textSize.small': { en: 'Small', te: 'చిన్న', hi: 'छोटा' },
  'settings.textSize.default': { en: 'Default', te: 'సాధారణ', hi: 'सामान्य' },
  'settings.textSize.medium': { en: 'Medium', te: 'మధ్యస్థం', hi: 'मध्यम' },
  'settings.textSize.large': { en: 'Large', te: 'పెద్ద', hi: 'बड़ा' },
  'settings.textSize.xlarge': { en: 'Extra Large', te: 'మరింత పెద్ద', hi: 'बहुत बड़ा' },
  'settings.contrast': { en: 'Contrast Theme', te: 'రంగు తీవ్రత', hi: 'रंग की तीव्रता' },
  'settings.contrast.default': { en: 'Default', te: 'సాధారణ', hi: 'सामान्य' },
  'settings.contrast.high': { en: 'High Contrast', te: 'అధిక కాంట్రాస్ట్', hi: 'ज़्यादा कंट्रास्ट' },
  'settings.contrast.dark': { en: 'Dark Mode', te: 'డార్క్ మోడ్', hi: 'डार्क मोड' },
  'settings.spacing': { en: 'Text Spacing (Line Height)', te: 'వచన అంతరం (పంక్తి ఎత్తు)', hi: 'शब्दों के बीच जगह (लाइन ऊँचाई)' },
  'settings.spacing.compact': { en: 'Compact', te: 'సంక్షిప్తం', hi: 'सँकरा' },
  'settings.spacing.normal': { en: 'Normal', te: 'సాధారణ', hi: 'सामान्य' },
  'settings.spacing.relaxed': { en: 'Relaxed', te: 'విస్తారం', hi: 'खुला' },
  'settings.reduceMotion': { en: 'Reduce Animations', te: 'యానిమేషన్లను తగ్గించు', hi: 'एनीमेशन कम करें' },
  'settings.reduceMotion.desc': { en: 'Disables all non-essential motion', te: 'అనవసరమైన కదలికలన్నీ ఆపుతుంది', hi: 'ज़रूरी नहीं एनीमेशन बंद करता है' },
  'settings.animSpeed': { en: 'Animation Speed', te: 'యానిమేషన్ వేగం', hi: 'एनीमेशन की गति' },
  'settings.animSpeed.slow': { en: '0.25x (Slow)', te: '0.25x (నెమ్మది)', hi: '0.25x (धीमा)' },
  'settings.animSpeed.fast': { en: '2x (Fast)', te: '2x (వేగం)', hi: '2x (तेज़)' },
  'settings.notifications': { en: 'Notifications', te: 'నోటిఫికేషన్లు', hi: 'सूचनाएँ' },
  'settings.sessionReminders': { en: 'Session Reminders', te: 'సెషన్ రిమైండర్లు', hi: 'सत्र की याद दिलाना' },
  'settings.healthTips': { en: 'Health Tips', te: 'ఆరోగ్య చిట్కాలు', hi: 'स्वास्थ्य के सुझाव' },
  'settings.emergencyAlerts': { en: 'Emergency Alerts', te: 'అత్యవసర హెచ్చరికలు', hi: 'आपातकालीन अलर्ट' },
  'settings.emergencyAlerts.desc': { en: 'Cannot be disabled for safety', te: 'భద్రత కోసం ఆపలేరు', hi: 'सुरक्षा के लिए बंद नहीं हो सकता' },
  'settings.quietHours': { en: 'Quiet Hours', te: 'నిశ్శబ్ద సమయం', hi: 'शांत समय' },
  'settings.quietHours.desc': { en: 'Mute all non-emergency notifications during these hours.', te: 'ఈ సమయంలో అత్యవసరం కాని నోటిఫికేషన్లన్నీ ఆపబడతాయి.', hi: 'इस समय के दौरान ज़रूरी नहीं सूचनाएं बंद रहेंगी।' },
  'settings.quietHours.from': { en: 'FROM', te: 'నుండి', hi: 'से' },
  'settings.quietHours.to': { en: 'TO', te: 'వరకు', hi: 'तक' },
  'settings.preview': { en: 'Live Preview', te: 'తక్షణ ముందుచూపు', hi: 'सजीव पूर्वावलोकन' },
  'settings.preview.title': { en: 'Wellness Journey', te: 'ఆరోగ్య ప్రయాణం', hi: 'स्वास्थ्य की राह' },
  'settings.preview.body': { en: 'This preview updates in real-time. Adjust your preferences to find the perfect reading experience tailored for you.', te: 'ఈ ముందుచూపు తక్షణంగా మారుతుంది. మీకు నచ్చిన చదివే అనుభవాన్ని కనుగొనడానికి మీ ఇష్టాలను మలచుకోండి.', hi: 'यह पूर्वावलोकन तुरंत बदलता है। आपके लिए सही पढ़ने का अनुभव पाने के लिए अपनी पसंद चुनें।' },
  'settings.preview.button': { en: 'Continue', te: 'కొనసాగించు', hi: 'जारी रखें' },
  'settings.reset': { en: 'Reset All Settings', te: 'అన్ని సెట్టింగులను రీసెట్ చేయి', hi: 'सभी सेटिंग्स रीसेट करें' },

  // Records page
  'records.severityTrend': { en: 'Severity Trend', te: 'తీవ్రత ధోరణి', hi: 'गंभीरता का रुझान' },
  'records.exportPdf': { en: 'Export PDF', te: 'PDF డౌన్లోడ్ చేయి', hi: 'PDF निकालें' },
  'records.recommended': { en: 'Recommended actions:', te: 'సూచించిన చర్యలు:', hi: 'सुझाए गए कदम:' },
  'records.severity.low': { en: 'Low', te: 'తక్కువ', hi: 'कम' },
  'records.severity.medium': { en: 'Medium', te: 'మధ్యస్థం', hi: 'मध्यम' },
  'records.severity.high': { en: 'High', te: 'అధికం', hi: 'ज़्यादा' },
  'records.severity.critical': { en: 'Critical', te: 'విపత్కరం', hi: 'गंभीर' },

  // Dashboard hardcoded strings
  'dashboard.noSessions': { en: 'No upcoming sessions', te: 'రాబోయే సెషన్లు లేవు', hi: 'कोई आगामी सत्र नहीं है' },
  'dashboard.bookSession': { en: 'Book a session →', te: 'సెషన్ బుక్ చేయండి →', hi: 'एक सत्र बुक करें →' },
  'dashboard.kiran': { en: 'KIRAN Mental Health Helpline', te: 'కిరణ్ మానసిక ఆరోగ్య హెల్ప్లైన్', hi: 'किरण मानसिक स्वास्थ्य हेल्पलाइन' },
  'dashboard.kiranDesc': { en: '24/7 • Free • Confidential', te: '24/7 • ఉచితం • రహస్యం', hi: '24/7 • मुफ़्त • गोपनीय' },

  // Dashboard triage history data (localised summaries)
  'triage.summary.1': { en: 'Work-related stress, sleep difficulty', te: 'పని ఒత్తిడి, నిద్ర సమస్య', hi: 'काम का तनाव, नींद की तकलीफ' },
  'triage.summary.2': { en: 'General wellbeing check', te: 'సాధారణ ఆరోగ్య తనిఖీ', hi: 'सामान्य स्वास्थ्य जाँच' },
  'triage.summary.3': { en: 'Family pressure, anxiety symptoms', te: 'కుటుంబ ఒత్తిడి, ఆందోళన లక్షణాలు', hi: 'परिवार का दबाव, बेचैनी के लक्षण' },

  // Dashboard resources list
  'resource.farming': { en: 'Farming Stress Management', te: 'వ్యవసాయ ఒత్తిడి నిర్వహణ', hi: 'खेती के तनाव को संभालना' },
  'resource.migration': { en: 'Coping with Migration Anxiety', te: 'వలసపోవడం వల్ల వచ్చే ఆందోళనను ఎదుర్కోవడం', hi: 'प्रवास की चिंता से उबरना' },
  'resource.family': { en: 'Family Relationship Support', te: 'కుటుంబ సంబంధ మద్దతు', hi: 'पारिवारिक रिश्तों में सहारा' },
  'resource.financial': { en: 'Financial Stress Resources', te: 'ఆర్థిక ఒత్తిడి వనరులు', hi: 'आर्थिक तनाव के संसाधन' },

  // Records page hardcoded notes
  'record.notes.1': { en: 'Work-related stress and insomnia. Recommended breathing exercises.', te: 'పని ఒత్తిడి మరియు నిద్రలేమి. శ్వాస వ్యాయామాలు సూచించారు.', hi: 'काम का तनाव और नींद न आना। साँस लेने के व्यायाम सुझाए गए।' },
  'record.notes.2': { en: 'General wellness check. Patient in good spirits.', te: 'సాధారణ ఆరోగ్య తనిఖీ. రోగి మంచి స్థితిలో ఉన్నారు.', hi: 'सामान्य स्वास्थ्य जाँच। मरीज़ अच्छे मूड में हैं।' },
  'record.notes.3': { en: 'Family pressure causing anxiety. Referred to counselor.', te: 'కుటుంబ ఒత్తిడి వల్ల ఆందోళన. కౌన్సెలర్కు పంపారు.', hi: 'परिवार के दबाव से बेचैनी। परामर्शदाता के पास भेजा गया।' },
  'record.action.breathe': { en: 'Practice deep breathing', te: 'లోతైన శ్వాస వ్యాయామం చేయండి', hi: 'गहरी साँसें लेने का अभ्यास करें' },
  'record.action.sleep': { en: 'Regular sleep schedule', te: 'క్రమబద్ధమైన నిద్ర సమయం', hi: 'नियमित नींद का समय रखें' },
  'record.action.walk': { en: 'Continue daily walks', te: 'రోజువారీ నడకలు కొనసాగించండి', hi: 'रोज़ाना की सैर जारी रखें' },
  'record.action.counseling': { en: 'Scheduled counseling session', te: 'కౌన్సెలింగ్ సెషన్ నిర్ణయించారు', hi: 'परामर्श सत्र तय किया' },
  'record.action.emergency': { en: 'Emergency contact updated', te: 'అత్యవసర సంప్రదింపు నవీకరించారు', hi: 'आपातकालीन संपर्क अपडेट किया' },

  // Sessions / Counseling page
  'sessions.scheduleTitle': { en: 'Schedule a Counseling Session', te: 'కౌన్సెలింగ్ సెషన్ బుక్ చేసుకోండి', hi: 'परामर्श सत्र बुक करें' },
  'sessions.scheduleSubtitle': { en: 'Book a secure and confidential session', te: 'సురక్షితమైన, రహస్యమైన సెషన్ను బుక్ చేసుకోండి', hi: 'एक सुरक्षित और गोपनीय सत्र बुक करें' },
  'sessions.step.counselor': { en: 'Counselor', te: 'కౌన్సెలర్', hi: 'परामर्शदाता' },
  'sessions.step.datetime': { en: 'Date & Time', te: 'తేదీ & సమయం', hi: 'तारीख और समय' },
  'sessions.step.details': { en: 'Details', te: 'వివరాలు', hi: 'विवरण' },
  'sessions.chooseCounselor': { en: 'Choose Your Counselor', te: 'మీ కౌన్సెలర్ను ఎంచుకోండి', hi: 'अपना परामर्शदाता चुनें' },
  'sessions.bookingWith': { en: 'Booking with', te: 'బుకింగ్:', hi: 'बुकिंग:' },
  'sessions.available': { en: 'Available', te: 'అందుబాటులో', hi: 'उपलब्ध' },
  'sessions.busy': { en: 'Busy', te: 'బిజీగా ఉన్నారు', hi: 'व्यस्त हैं' },
  'sessions.bookNow': { en: 'Book Now →', te: 'ఇప్పుడే బుక్ చేయండి →', hi: 'अभी बुक करें →' },
  'sessions.unavailable': { en: 'Currently Unavailable', te: 'ప్రస్తుతం అందుబాటులో లేరు', hi: 'अभी उपलब्ध नहीं हैं' },
  'sessions.selectDate': { en: 'Select Date', te: 'తేదీ ఎంచుకోండి', hi: 'तारीख चुनें' },
  'sessions.availableTimes': { en: 'Available Times', te: 'అందుబాటు సమయాలు', hi: 'उपलब्ध समय' },
  'sessions.bookingSummary': { en: 'Booking Summary', te: 'బుకింగ్ సారాంశం', hi: 'बुकिंग का सारांश' },
  'sessions.completeSelection': { en: 'Complete your selection to proceed', te: 'కొనసాగడానికి మీ ఎంపిక పూర్తి చేయండి', hi: 'आगे बढ़ने के लिए चयन पूरा करें' },
  'sessions.confirmDateTime': { en: 'Confirm Date & Time →', te: 'తేదీ & సమయం ధృవీకరించండి →', hi: 'तारीख और समय पक्का करें →' },
  'sessions.backToCounselors': { en: 'Back to Counselors', te: 'కౌన్సెలర్ల దగ్గరికి తిరిగి వెళ్ళండి', hi: 'परामर्शदाताओं पर वापस जाएं' },
  'sessions.sessionType': { en: 'Session Type', te: 'సెషన్ రకం', hi: 'सत्र का प्रकार' },
  'sessions.type.video': { en: 'Video Call', te: 'వీడియో కాల్', hi: 'वीडियो कॉल' },
  'sessions.type.phone': { en: 'Phone Call', te: 'ఫోన్ కాల్', hi: 'फ़ोन कॉल' },
  'sessions.type.chat': { en: 'Text Chat', te: 'టెక్స్ట్ చాట్', hi: 'टेक्स्ट चैट' },
  'sessions.reason': { en: 'Reason for Visit', te: 'సందర్శన కారణం', hi: 'मिलने का कारण' },
  'sessions.reason.placeholder': { en: 'Select a reason', te: 'కారణం ఎంచుకోండి', hi: 'कारण चुनें' },
  'sessions.reason.anxiety': { en: 'Anxiety or Stress', te: 'ఆందోళన లేదా ఒత్తిడి', hi: 'चिंता या तनाव' },
  'sessions.reason.depression': { en: 'Depression', te: 'నిరాశ', hi: 'उदासी (डिप्रेशन)' },
  'sessions.reason.family': { en: 'Family Issues', te: 'కుటుంబ సమస్యలు', hi: 'परिवार की समस्याएं' },
  'sessions.reason.financial': { en: 'Work/Financial Stress', te: 'పని/ఆర్థిక ఒత్తిడి', hi: 'काम/पैसों का तनाव' },
  'sessions.reason.sleep': { en: 'Sleep Problems', te: 'నిద్ర సమస్యలు', hi: 'नींद की तकलीफ' },
  'sessions.reason.relationship': { en: 'Relationship Issues', te: 'సంబంధ సమస్యలు', hi: 'रिश्तों की परेशानी' },
  'sessions.reason.grief': { en: 'Grief or Loss', te: 'దుఃఖం లేదా నష్టం', hi: 'दुःख या बिछड़ना' },
  'sessions.reason.other': { en: 'Other', te: 'ఇతరత్రా', hi: 'अन्य' },
  'sessions.notes': { en: 'Additional Notes', te: 'అదనపు వివరాలు', hi: 'अतिरिक्त जानकारी' },
  'sessions.notes.optional': { en: '(Optional)', te: '(ఐచ్ఛికం)', hi: '(ज़रूरी नहीं)' },
  'sessions.notes.placeholder': { en: "Is there anything specific you'd like to discuss?", te: 'మీరు ప్రత్యేకంగా చర్చించాలనుకున్నది ఏమైనా ఉందా?', hi: 'क्या कोई खास बात है जो आप बात करना चाहते हैं?' },
  'sessions.confirmBooking': { en: 'Confirm Booking →', te: 'బుకింగ్ ధృవీకరించండి →', hi: 'बुकिंग पक्का करें →' },
  'sessions.backToDateTime': { en: 'Back to Date & Time', te: 'తేదీ & సమయానికి తిరిగి వెళ్ళండి', hi: 'तारीख और समय पर वापस जाएं' },
  'sessions.confirmed': { en: 'Booking Confirmed!', te: 'బుకింగ్ ధృవీకరించబడింది!', hi: 'बुकिंग पक्की हो गई!' },
  'sessions.confirmedDesc': { en: 'Your session has been confirmed.', te: 'మీ సెషన్ ధృవీకరించబడింది.', hi: 'आपका सत्र तय हो गया है।' },
  'sessions.returnDashboard': { en: 'Return to Dashboard', te: 'డాష్బోర్డ్కు తిరిగి వెళ్ళండి', hi: 'डैशबोर्ड पर वापस जाएं' },
  'sessions.viewBookings': { en: 'View My Bookings', te: 'నా బుకింగులు చూడండి', hi: 'मेरी बुकिंग देखें' },
  'sessions.myBookings': { en: 'My Bookings', te: 'నా బుకింగులు', hi: 'मेरी बुकिंग' },
  'sessions.bookAnother': { en: '← Book Another Session', te: '← మరో సెషన్ బుక్ చేయండి', hi: '← दूसरा सत्र बुक करें' },

  // Resources page
  'resources.title': { en: 'Resources', te: 'వనరులు', hi: 'संसाधन' },
  'resources.tab.articles': { en: 'Articles', te: 'వ్యాసాలు', hi: 'लेख' },
  'resources.tab.audio': { en: 'Audio', te: 'శ్రవణం', hi: 'ऑडियो' },
  'resources.tab.video': { en: 'Video', te: 'వీడియో', hi: 'वीडियो' },
  'resources.search': { en: 'Search resources...', te: 'వనరులు వెతకండి...', hi: 'संसाधन खोजें...' },
  'resources.back': { en: '← Back to Resources', te: '← వనరులకు తిరిగి వెళ్ళండి', hi: '← संसाधनों पर वापस जाएं' },
  'resources.readArticle': { en: 'Read Article', te: 'వ్యాసం చదవండి', hi: 'लेख पढ़ें' },
  'resources.playAudio': { en: 'Play Audio', te: 'ఆడియో వినండి', hi: 'ऑडियो सुनें' },
  'resources.watchVideo': { en: 'Watch Video', te: 'వీడియో చూడండి', hi: 'वीडियो देखें' },
  'resources.comingSoon': { en: 'Coming Soon', te: 'త్వరలో వస్తుంది', hi: 'जल्द आ रहा है' },
  'resources.minRead': { en: 'min read', te: 'నిమి. చదవడం', hi: 'मिनट पढ़ना' },
  'resources.min': { en: 'min', te: 'నిమి.', hi: 'मिनट' },
  'resources.count': { en: 'resources', te: 'వనరులు', hi: 'संसाधन' },
  'resources.noResults': { en: 'No resources found for your search.', te: 'మీ శోధనకు వనరులు కనుగొనబడలేదు.', hi: 'आपकी खोज के लिए कोई संसाधन नहीं मिला।' },

  // Category names
  'category.farmingStress': { en: 'Farming Stress', te: 'వ్యవసాయ ఒత్తిడి', hi: 'खेती का तनाव' },
  'category.migrationAnxiety': { en: 'Migration Anxiety', te: 'వలస ఆందోళన', hi: 'प्रवास की चिंता' },
  'category.familyPressure': { en: 'Family Pressure', te: 'కుటుంబ ఒత్తిడి', hi: 'परिवार का दबाव' },
  'category.financialAnxiety': { en: 'Financial Anxiety', te: 'ఆర్థిక ఆందోళన', hi: 'पैसों की चिंता' },
  'category.healthConcerns': { en: 'Health Concerns', te: 'ఆరోగ్య ఆందోళనలు', hi: 'स्वास्थ्य की चिंताएं' },
  'category.womensMentalHealth': { en: "Women's Mental Health", te: 'మహిళల మానసిక ఆరోగ్యం', hi: 'महिलाओं का मानसिक स्वास्थ्य' },

  // HW pages
  'hw.dashboard': { en: 'Dashboard', te: 'డాష్బోర్డ్', hi: 'डैशबोर्ड' },
  'hw.activePatients': { en: 'Active Patients', te: 'క్రియాశీల రోగులు', hi: 'सक्रिय मरीज़' },
  'hw.criticalCases': { en: 'Critical Cases', te: 'విపత్కర కేసులు', hi: 'गंभीर मामले' },
  'hw.avgResponse': { en: 'Avg Response Time', te: 'సగటు ప్రతిస్పందన సమయం', hi: 'औसत प्रतिक्रिया समय' },
  'hw.resolvedToday': { en: 'Resolved Today', te: 'ఈ రోజు పరిష్కరించబడింది', hi: 'आज सुलझाए गए' },
  'hw.recentActivity': { en: 'Recent Triage Activity', te: 'ఇటీవలి ట్రయాజ్ కార్యకలాపం', hi: 'हाल की ट्राइएज गतिविधि' },
  'hw.commonThemes': { en: 'Common Themes Today', te: 'ఈ రోజు సాధారణ ఇతివృత్తాలు', hi: 'आज के सामान्य विषय' },
  'hw.originalText': { en: 'Original', te: 'అసలు వచనం', hi: 'मूल पाठ' },
  'hw.translation': { en: 'English Translation', te: 'ఆంగ్ల అనువాదం', hi: 'अंग्रेज़ी अनुवाद' },
  'hw.aiRecommendation': { en: 'AI Recommendation', te: 'AI సిఫారసు', hi: 'AI की सलाह' },
  'hw.emergency': { en: 'Emergency', te: 'అత్యవసరం', hi: 'आपातकाल' },

  // Chat quick chips
  'chat.chip.anxious': { en: "I feel anxious", te: "నాకు ఆందోళనగా ఉంది", hi: "मुझे घबराहट हो रही है" },
  'chat.chip.sleep': { en: "I can't sleep", te: "నిద్ర రావడం లేదు", hi: "नींद नहीं आती" },
  'chat.chip.family': { en: "Family problems", te: "కుటుంబ సమస్యలు", hi: "घर की परेशानी" },
  'chat.chip.stress': { en: "Work stress", te: "పని ఒత్తిడి", hi: "काम का बोझ" },
  'chat.quickPlaceholder': { en: 'Quick message...', te: 'త్వరగా సందేశం...', hi: 'जल्दी संदेश...' },

  // Records empty state
  'records.empty.title': { en: 'No Records Yet', te: 'రికార్డులు లేవు', hi: 'अभी कोई रिकॉर्ड नहीं' },
  'records.empty.desc': { en: 'Your health records will appear here after your triage chat sessions.', te: 'మీ ట్రయాజ్ చాట్ సెషన్ల తర్వాత మీ ఆరోగ్య రికార్డులు ఇక్కడ కనిపిస్తాయి.', hi: 'आपके ट्राइएज चैट सत्रों के बाद आपके स्वास्थ्य रिकॉर्ड यहाँ दिखाई देंगे।' },
  'records.empty.cta': { en: 'Start Triage Chat →', te: 'ట్రయాజ్ చాట్ ప్రారంభించండి →', hi: 'ट्राइएज चैट शुरू करें →' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    const entry = translations[key];
    if (!entry) {
      console.warn(`[i18n] Missing translation key: "${key}"`);
      return key;
    }
    return entry[language] || entry['en'] || key;
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
