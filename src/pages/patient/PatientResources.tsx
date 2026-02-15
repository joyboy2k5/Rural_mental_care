import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { BookOpen, Headphones, Video, FileText, Sprout, Briefcase, Users, Wallet, HeartPulse, UserCircle } from 'lucide-react';

const categories = [
  { icon: Sprout, label: 'Farming Stress', count: 12 },
  { icon: Briefcase, label: 'Migration Anxiety', count: 8 },
  { icon: Users, label: 'Family Pressure', count: 15 },
  { icon: Wallet, label: 'Financial Anxiety', count: 10 },
  { icon: HeartPulse, label: 'Health Concerns', count: 7 },
  { icon: UserCircle, label: "Women's Mental Health", count: 9 },
];

const PatientResources = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.resources')}</h1>

      {/* Format filters */}
      <div className="flex gap-3">
        {[
          { icon: FileText, label: 'Articles' },
          { icon: Headphones, label: 'Audio' },
          { icon: Video, label: 'Video' },
        ].map((f) => (
          <button
            key={f.label}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
          >
            <f.icon className="w-4 h-4" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card hover-lift p-5 text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <cat.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{cat.label}</h3>
            <p className="text-xs text-muted-foreground">{cat.count} resources</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PatientResources;
