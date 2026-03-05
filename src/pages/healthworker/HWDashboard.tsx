import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

// 1. We change 'value' to 'target', 'decimals', and 'suffix' so the counter knows how to format the numbers
const statsConfig = [
  { icon: Users, label: 'Active Patients', tKey: 'hw.activePatients', target: 24, decimals: 0, suffix: '', color: 'text-primary' },
  { icon: AlertTriangle, label: 'Critical Cases', tKey: 'hw.criticalCases', target: 3, decimals: 0, suffix: '', color: 'text-destructive' },
  { icon: Clock, label: 'Avg Response Time', tKey: 'hw.avgResponse', target: 4.2, decimals: 1, suffix: ' min', color: 'text-soft-gold' },
  { icon: TrendingUp, label: 'Resolved Today', tKey: 'hw.resolvedToday', target: 18, decimals: 0, suffix: '', color: 'text-healing-green' },
];

// 2. Create a custom component to handle the number animation
const AnimatedCounter = ({ target, decimals = 0, suffix = '' }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals) + suffix);

  useEffect(() => {
    // Animate from 0 to the target number over 2 seconds
    const controls = animate(count, target, {
      duration: 2,
      ease: "easeOut"
    });
    return controls.stop; // Cleanup animation on unmount
  }, [count, target]);

  return <motion.span>{rounded}</motion.span>;
};

const HWDashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.dashboard')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card hover-lift p-5"
          >
            <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
            <p className="text-2xl font-bold text-foreground">
              {/* 3. Insert the AnimatedCounter component here */}
              <AnimatedCounter target={s.target} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="text-xs text-muted-foreground">{t(s.tKey)}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">{t('hw.recentActivity')}</h2>
          <div className="space-y-3">
            {['Ramesh K. - High severity (farming stress)', 'Lakshmi D. - Medium (family pressure)', 'Suresh M. - Critical (suicidal ideation)'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2.5 h-2.5 rounded-full ${i === 2 ? 'bg-destructive pulse-ring' : i === 0 ? 'bg-soft-gold' : 'bg-healing-green'}`} />
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">{t('hw.commonThemes')}</h2>
          <div className="flex flex-wrap gap-2">
            {['Farming Stress', 'Sleep Issues', 'Family Pressure', 'Financial Worry', 'Loneliness', 'Migration'].map((theme) => (
              <span key={theme} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{theme}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HWDashboard;