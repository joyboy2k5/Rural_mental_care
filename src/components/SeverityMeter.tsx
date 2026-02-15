import { motion } from 'framer-motion';

const severityConfig = {
  low: { color: 'hsl(145, 50%, 45%)', label: 'Low', pct: 25 },
  medium: { color: 'hsl(38, 70%, 55%)', label: 'Medium', pct: 50 },
  high: { color: 'hsl(25, 80%, 50%)', label: 'High', pct: 75 },
  critical: { color: 'hsl(0, 72%, 51%)', label: 'Critical', pct: 100 },
};

interface Props {
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const SeverityMeter = ({ severity }: Props) => {
  const config = severityConfig[severity];
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (config.pct / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
        <motion.circle
          cx="22" cy="22" r="18"
          fill="none"
          stroke={config.color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <span className="text-xs font-semibold" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
};

export default SeverityMeter;
