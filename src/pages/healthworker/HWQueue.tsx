import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X, Calendar, AlertTriangle, Filter } from 'lucide-react';
import CulturalContextBadge from '@/components/CulturalContextBadge';

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface QueueItem {
  id: string;
  name: string;
  age: number;
  language: string;
  village: string;
  severity: Severity;
  originalText: string;
  translation: string;
  idioms: string[];
  aiRecommendation: string;
  time: string;
}

const queueData: QueueItem[] = [
  { id: '1', name: 'Suresh M.', age: 42, language: 'Telugu', village: 'Warangal', severity: 'critical', originalText: 'నాకు బ్రతకాలని అనిపించడం లేదు', translation: 'I don\'t feel like living', idioms: ['💔 Heart feels heavy'], aiRecommendation: 'Immediate intervention needed', time: '2 min ago' },
  { id: '2', name: 'Ramesh K.', age: 35, language: 'Hindi', village: 'Nizamabad', severity: 'high', originalText: 'दिमाग भरा हुआ है, खेती में सब बर्बाद हो गया', translation: 'Mind is crowded, everything in farming is ruined', idioms: ['🧠 Mind is crowded'], aiRecommendation: 'Schedule counseling within 24 hours', time: '8 min ago' },
  { id: '3', name: 'Lakshmi D.', age: 28, language: 'Telugu', village: 'Karimnagar', severity: 'medium', originalText: 'అత్తగారి ఇంట్లో చాలా ఒత్తిడి', translation: 'A lot of pressure at in-laws house', idioms: [], aiRecommendation: 'Schedule follow-up within 48 hours', time: '15 min ago' },
  { id: '4', name: 'Pradeep V.', age: 50, language: 'Hindi', village: 'Adilabad', severity: 'low', originalText: 'थोड़ा तनाव है काम का', translation: 'Slight work stress', idioms: [], aiRecommendation: 'Share self-help resources', time: '22 min ago' },
];

const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const HWQueue = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Severity | 'all'>('all');

  const filtered = queueData
    .filter(item => filter === 'all' || item.severity === filter)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">{t('queue.title')}</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass-card hover-lift p-5 ${item.severity === 'critical' ? 'border-l-4 border-l-destructive' : ''}`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="text-xs text-muted-foreground">{item.age}y • {item.language}</span>
                  <span className="text-xs text-muted-foreground">{item.village}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize severity-bg-${item.severity} severity-${item.severity}`}>
                    {item.severity}
                  </span>
                </div>

                {/* Original + translation */}
                <div className="grid md:grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Original ({item.language})</p>
                    <p className="text-sm text-foreground">{item.originalText}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">English Translation</p>
                    <p className="text-sm text-foreground">{item.translation}</p>
                  </div>
                </div>

                {item.idioms.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {item.idioms.map((idiom, j) => <CulturalContextBadge key={j} label={idiom} />)}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">AI Recommendation:</span> {item.aiRecommendation} • {item.time}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-healing-green/20 text-healing-green text-xs font-medium hover:bg-healing-green/30 transition-colors">
                  <Check className="w-3.5 h-3.5" /> {t('queue.approve')}
                </button>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-soft-gold/20 text-soft-gold text-xs font-medium hover:bg-soft-gold/30 transition-colors">
                  <Calendar className="w-3.5 h-3.5" /> {t('queue.schedule')}
                </button>
                {item.severity === 'critical' && (
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-destructive/20 text-destructive text-xs font-medium hover:bg-destructive/30 transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" /> Emergency
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HWQueue;
