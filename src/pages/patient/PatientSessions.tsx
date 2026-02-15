import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Calendar, Video, Phone, MessageCircle, Star } from 'lucide-react';

const counselors = [
  { name: 'Dr. Priya Sharma', languages: ['English', 'Hindi'], specialization: 'Family Issues', rating: 4.8, available: true },
  { name: 'Dr. Lakshmi Reddy', languages: ['English', 'Telugu'], specialization: 'Work Stress', rating: 4.9, available: true },
  { name: 'Dr. Arun Kumar', languages: ['English', 'Hindi', 'Telugu'], specialization: 'Financial Anxiety', rating: 4.7, available: false },
];

const PatientSessions = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.sessions')}</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {counselors.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card hover-lift p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.specialization}</p>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${c.available ? 'bg-healing-green' : 'bg-muted-foreground'}`} />
            </div>
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-3.5 h-3.5 text-soft-gold fill-soft-gold" />
              <span className="text-xs font-medium text-foreground">{c.rating}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {c.languages.map((l) => (
                <span key={l} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{l}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                <Video className="w-3.5 h-3.5" /> Video
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                <Phone className="w-3.5 h-3.5" /> Audio
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-accent transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> Chat
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PatientSessions;
