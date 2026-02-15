import { motion } from 'framer-motion';

const CulturalContextBadge = ({ label }: { label: string }) => (
  <motion.span
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/30 text-accent-foreground border border-accent/50"
  >
    {label}
  </motion.span>
);

export default CulturalContextBadge;
