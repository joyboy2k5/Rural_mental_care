import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { motion } from 'framer-motion';

const PatientSettings = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.settings')}</h1>

      <div className="max-w-lg space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Language Preference</h2>
          <LanguageSelector />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Accessibility</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Large Text</span>
              <input type="checkbox" className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">High Contrast</span>
              <input type="checkbox" className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reduce Animations</span>
              <input type="checkbox" className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h2 className="font-semibold text-foreground mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Session Reminders</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Health Tips</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientSettings;
