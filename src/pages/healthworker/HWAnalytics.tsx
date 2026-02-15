import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, PieChart, Globe, Clock } from 'lucide-react';

const HWAnalytics = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.analytics')}</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Language breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-sky-blue" />
            <h2 className="font-display text-lg font-semibold text-foreground">Language Usage</h2>
          </div>
          <div className="space-y-3">
            {[
              { lang: 'Telugu', pct: 55, color: 'bg-primary' },
              { lang: 'Hindi', pct: 35, color: 'bg-secondary' },
              { lang: 'English', pct: 10, color: 'bg-accent' },
            ].map((l) => (
              <div key={l.lang}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{l.lang}</span>
                  <span className="text-muted-foreground">{l.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${l.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full ${l.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Severity distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Severity Distribution</h2>
          </div>
          <div className="flex items-end gap-3 h-32">
            {[
              { label: 'Low', value: 40, color: 'bg-healing-green' },
              { label: 'Medium', value: 30, color: 'bg-soft-gold' },
              { label: 'High', value: 20, color: 'bg-terracotta' },
              { label: 'Critical', value: 10, color: 'bg-destructive' },
            ].map((s, i) => (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${s.value * 2.5}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`w-full rounded-t-lg ${s.color}/70`}
                />
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-xs font-semibold text-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Common idioms */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-soft-gold" />
            <h2 className="font-display text-lg font-semibold text-foreground">Common Local Idioms</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { text: 'గుండె బరువుగా', size: 'text-lg' },
              { text: 'दिमाग भरा हुआ', size: 'text-base' },
              { text: 'మనసు నిండిపోయింది', size: 'text-sm' },
              { text: 'नींद नहीं आती', size: 'text-base' },
              { text: 'ఒత్తిడి', size: 'text-lg' },
              { text: 'चिंता', size: 'text-sm' },
              { text: 'ఆందోళన', size: 'text-base' },
            ].map((w) => (
              <span key={w.text} className={`${w.size} font-medium text-primary/80 px-2 py-1`}>{w.text}</span>
            ))}
          </div>
        </motion.div>

        {/* Response time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-healing-green" />
            <h2 className="font-display text-lg font-semibold text-foreground">Response Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Avg Response', value: '4.2 min' },
              { label: 'Critical Response', value: '1.5 min' },
              { label: 'Cases Today', value: '24' },
              { label: 'Resolution Rate', value: '87%' },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-lg font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HWAnalytics;
