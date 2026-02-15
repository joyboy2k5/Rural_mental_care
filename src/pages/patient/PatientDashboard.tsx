import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, Calendar, Lightbulb, Phone, BookOpen } from 'lucide-react';

const healthTips: Record<string, string> = {
  en: 'Take a 10-minute walk in nature today. Fresh air and movement can help calm your mind.',
  te: 'ఈ రోజు ప్రకృతిలో 10 నిమిషాల నడక చేయండి. స్వచ్ఛమైన గాలి మీ మనస్సును ప్రశాంతపరచగలదు.',
  hi: 'आज प्रकृति में 10 मिनट की सैर करें। ताजी हवा आपके मन को शांत कर सकती है।',
};

const triageHistory = [
  { date: '2026-02-14', severity: 'medium', summary: 'Work-related stress, sleep difficulty' },
  { date: '2026-02-10', severity: 'low', summary: 'General wellbeing check' },
  { date: '2026-02-05', severity: 'high', summary: 'Family pressure, anxiety symptoms' },
];

const resources = [
  'Farming Stress Management',
  'Coping with Migration Anxiety',
  'Family Relationship Support',
  'Financial Stress Resources',
];

const PatientDashboard = () => {
  const { t, language } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-foreground"
      >
        {t('sidebar.dashboard')}
      </motion.h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Triage History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card hover-lift p-5 md:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">{t('dashboard.triageHistory')}</h2>
          </div>
          <div className="space-y-3">
            {triageHistory.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-3 h-3 rounded-full ${
                  item.severity === 'low' ? 'bg-healing-green' :
                  item.severity === 'medium' ? 'bg-soft-gold' : 'bg-destructive'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.summary}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                  `severity-bg-${item.severity} severity-${item.severity}`
                }`}>
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card hover-lift p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-secondary" />
            <h2 className="font-display text-lg font-semibold text-foreground">{t('dashboard.upcoming')}</h2>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">No upcoming sessions</p>
            <button className="mt-3 text-sm font-medium text-primary hover:underline">
              Book a session →
            </button>
          </div>
        </motion.div>

        {/* Health Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card hover-lift p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-soft-gold" />
            <h2 className="font-display text-lg font-semibold text-foreground">{t('dashboard.healthTip')}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{healthTips[language]}</p>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card hover-lift p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-destructive" />
            <h2 className="font-display text-lg font-semibold text-foreground">{t('dashboard.emergency')}</h2>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">KIRAN Mental Health Helpline</p>
            <a href="tel:18005990019" className="text-primary font-semibold text-lg block">1800-599-0019</a>
            <p className="text-xs text-muted-foreground">24/7 • Free • Confidential</p>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card hover-lift p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-sage" />
            <h2 className="font-display text-lg font-semibold text-foreground">{t('dashboard.resources')}</h2>
          </div>
          <div className="space-y-2">
            {resources.map((r) => (
              <button key={r} className="block w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                → {r}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
