import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, MapPin, MessageCircle } from 'lucide-react';

const patients = [
  { name: 'Suresh M.', age: 42, village: 'Warangal', language: 'Telugu', risk: 'critical', lastSeen: '2 min ago' },
  { name: 'Ramesh K.', age: 35, village: 'Nizamabad', language: 'Hindi', risk: 'high', lastSeen: '8 min ago' },
  { name: 'Lakshmi D.', age: 28, village: 'Karimnagar', language: 'Telugu', risk: 'medium', lastSeen: '15 min ago' },
  { name: 'Pradeep V.', age: 50, village: 'Adilabad', language: 'Hindi', risk: 'low', lastSeen: '22 min ago' },
  { name: 'Anitha R.', age: 33, village: 'Khammam', language: 'Telugu', risk: 'medium', lastSeen: '1 hour ago' },
];

const HWPatients = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.patients')}</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          placeholder="Search by name, village, or ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card hover-lift p-5 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.age}y • {p.language}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize severity-bg-${p.risk} severity-${p.risk}`}>
                {p.risk}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <MapPin className="w-3 h-3" /> {p.village}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{p.lastSeen}</span>
              <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                <MessageCircle className="w-3 h-3" /> Message
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HWPatients;
