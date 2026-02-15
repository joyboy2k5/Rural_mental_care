import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp } from 'lucide-react';

const records = [
  { date: '2026-02-14', severity: 'medium', notes: 'Work-related stress and insomnia. Recommended breathing exercises.', actions: ['Practice deep breathing', 'Regular sleep schedule'] },
  { date: '2026-02-10', severity: 'low', notes: 'General wellness check. Patient in good spirits.', actions: ['Continue daily walks'] },
  { date: '2026-02-05', severity: 'high', notes: 'Family pressure causing anxiety. Referred to counselor.', actions: ['Scheduled counseling session', 'Emergency contact updated'] },
];

const PatientRecords = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.records')}</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* Severity trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">Severity Trend</h2>
        </div>
        <div className="flex items-end gap-4 h-24">
          {records.map((r, i) => {
            const h = r.severity === 'low' ? 30 : r.severity === 'medium' ? 55 : 85;
            return (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`flex-1 rounded-t-lg ${
                  r.severity === 'low' ? 'bg-healing-green/60' :
                  r.severity === 'medium' ? 'bg-soft-gold/60' : 'bg-destructive/60'
                }`}
              />
            );
          })}
        </div>
        <div className="flex gap-4 mt-2">
          {records.map((r, i) => (
            <span key={i} className="flex-1 text-center text-xs text-muted-foreground">{r.date.slice(5)}</span>
          ))}
        </div>
      </motion.div>

      {/* Records list */}
      <div className="space-y-4">
        {records.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card hover-lift p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{r.date}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize severity-bg-${r.severity} severity-${r.severity}`}>
                {r.severity}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{r.notes}</p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">Recommended actions:</p>
              {r.actions.map((a, j) => (
                <p key={j} className="text-xs text-muted-foreground">• {a}</p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PatientRecords;
