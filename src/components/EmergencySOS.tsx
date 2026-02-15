import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const EmergencySOS = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <motion.button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-destructive px-5 py-3 text-destructive-foreground font-semibold shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 0 0 hsl(0 72% 51% / 0.4)', '0 0 0 12px hsl(0 72% 51% / 0)', '0 0 0 0 hsl(0 72% 51% / 0)'] }}
        transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
      >
        <AlertTriangle className="w-5 h-5" />
        {t('sos.button')}
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-foreground mb-6">{t('sos.confirm')}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 rounded-lg bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <a
                  href="tel:112"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  <Phone className="w-4 h-4" />
                  Call 112
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencySOS;
