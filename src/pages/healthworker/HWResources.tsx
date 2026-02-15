import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Upload, Tag, Eye } from 'lucide-react';

const resources = [
  { title: 'Farming Stress Guide', languages: ['Telugu', 'Hindi', 'English'], category: 'Farming', views: 234 },
  { title: 'Family Pressure Workbook', languages: ['Telugu', 'English'], category: 'Family', views: 189 },
  { title: 'Financial Anxiety Audio', languages: ['Hindi', 'English'], category: 'Financial', views: 156 },
  { title: 'Migration Support Video', languages: ['Telugu', 'Hindi'], category: 'Migration', views: 98 },
];

const HWResources = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">{t('sidebar.resourceLib')}</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Upload className="w-4 h-4" /> Upload Resource
        </button>
      </div>

      <div className="space-y-3">
        {resources.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card hover-lift p-5 flex items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold text-foreground mb-1">{r.title}</h3>
              <div className="flex gap-2 mb-2">
                {r.languages.map((l) => (
                  <span key={l} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{l}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {r.category}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {r.views} views</span>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition-colors">
              Preview
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HWResources;
