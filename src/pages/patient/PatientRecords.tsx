import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp, MessageCircle } from 'lucide-react';

/* ── Shared data contract ──────────────────────────────────────── */
export interface HealthRecord {
  id: string;               // Date.now().toString()
  date: string;             // ISO date string "YYYY-MM-DD"
  severity: 'low' | 'medium' | 'high' | 'critical';
  notes: string;            // First AI response text, trimmed to 150 chars
  actions: string[];        // Extracted action items from AI response
  chatSummary?: string;     // Full user message that triggered this record
}

const STORAGE_KEY = 'manovaidya_records';

const PatientRecords = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Part 3 — Read records from localStorage
  const [records, setRecords] = useState<HealthRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Live-update if records change in the same session (e.g. user is chatting in another tab)
  useEffect(() => {
    const handler = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setRecords(stored ? JSON.parse(stored) : []);
      } catch { }
    };
    window.addEventListener('manovaidya_records_updated', handler);
    return () => window.removeEventListener('manovaidya_records_updated', handler);
  }, []);

  // Part 6 — Export records as plain text download
  const handleExport = () => {
    if (records.length === 0) {
      window.alert('No records to export yet.');
      return;
    }

    let content = 'ManoVaidya — My Health Records\n';
    content += `Exported: ${new Date().toISOString().split('T')[0]}\n`;
    content += '=====================================\n\n';

    records.forEach(r => {
      content += `Date: ${r.date}\n`;
      content += `Severity: ${r.severity.toUpperCase()}\n`;
      content += `Notes: ${r.notes}\n`;
      if (r.actions.length > 0) {
        content += 'Recommended Actions:\n';
        r.actions.forEach(a => { content += `  • ${a}\n`; });
      }
      if (r.chatSummary) {
        content += `User Message: ${r.chatSummary}\n`;
      }
      content += '-------------------------------------\n\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manovaidya-records-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Part 5 — Severity to height mapping for chart
  const severityHeight = (sev: string): number => {
    switch (sev) {
      case 'critical': return 100;
      case 'high': return 75;
      case 'medium': return 50;
      default: return 25;
    }
  };

  const severityColor = (sev: string): string => {
    switch (sev) {
      case 'critical': return 'bg-destructive/60';
      case 'high': return 'bg-destructive/60';
      case 'medium': return 'bg-soft-gold/60';
      default: return 'bg-healing-green/60';
    }
  };

  // Latest 6 records for chart (reversed so newest is on right)
  const chartRecords = records.slice(0, 6).reverse();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.records')}</h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" /> {t('records.exportPdf')}
        </button>
      </div>

      {/* Severity trend — only show when records exist */}
      {records.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">{t('records.severityTrend')}</h2>
          </div>
          <div className="flex items-end gap-4 h-24">
            {chartRecords.map((r, i) => {
              const h = severityHeight(r.severity);
              return (
                <motion.div
                  key={r.id || i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className={`flex-1 rounded-t-lg ${severityColor(r.severity)}`}
                />
              );
            })}
          </div>
          <div className="flex gap-4 mt-2">
            {chartRecords.map((r, i) => (
              <span key={r.id || i} className="flex-1 text-center text-xs text-muted-foreground">{r.date.slice(5)}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Records list or empty state */}
      {records.length === 0 ? (
        /* Part 4 — Empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 flex flex-col items-center justify-center text-center"
        >
          <MessageCircle className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t('records.empty.title')}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">{t('records.empty.desc')}</p>
          <button
            onClick={() => navigate('/patient/triage')}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t('records.empty.cta')}
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {records.map((r, i) => (
            <motion.div
              key={r.id || i}
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
                  {t('records.severity.' + r.severity)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{r.notes}</p>
              {r.actions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">{t('records.recommended')}</p>
                  {r.actions.map((a, j) => (
                    <p key={j} className="text-xs text-muted-foreground">• {a}</p>
                  ))}
                </div>
              )}
              {r.chatSummary && (
                <p className="text-xs text-muted-foreground/70 mt-2 italic">"{r.chatSummary}"</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
