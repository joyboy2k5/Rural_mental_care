import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Heart, Stethoscope, AlertTriangle, ArrowRight, Shield, Users, MessageCircle } from 'lucide-react';
import heroImage from '@/assets/hero-rural-health.jpg';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const entryPoints = [
  { key: 'nav.patient', icon: Heart, path: '/patient/triage', color: 'bg-primary' },
  { key: 'nav.healthworker', icon: Stethoscope, path: '/healthworker/dashboard', color: 'bg-secondary' },
  { key: 'nav.emergency', icon: AlertTriangle, path: '/patient/triage', color: 'bg-destructive' },
];

const features = [
  { icon: Shield, title: 'Privacy First', desc: 'Your data is encrypted and secure' },
  { icon: Users, title: 'Cultural Sensitivity', desc: 'Understanding local idioms and context' },
  { icon: MessageCircle, title: 'Vernacular Support', desc: 'Telugu, Hindi, and English' },
];

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: 'linear-gradient(135deg, hsl(16 65% 48% / 0.15), hsl(145 25% 42% / 0.1), hsl(38 70% 55% / 0.15), hsl(200 60% 50% / 0.1))',
            backgroundSize: '400% 400%',
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">ManoVaidya</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="text-center md:text-left"
            >
              <motion.h1
                variants={item}
                key={`title-${language}`}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6"
              >
                {t('welcome.title')}
              </motion.h1>
              <motion.p
                variants={item}
                key={`sub-${language}`}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
              >
                {t('welcome.subtitle')}
              </motion.p>
              <motion.div variants={item} className="flex flex-wrap gap-4 justify-center md:justify-start">
                {entryPoints.map((ep) => (
                  <button
                    key={ep.key}
                    onClick={() => navigate(ep.path)}
                    className={`hover-lift flex items-center gap-2 rounded-xl ${ep.color} text-primary-foreground px-6 py-3 font-semibold shadow-md`}
                  >
                    <ep.icon className="w-5 h-5" />
                    {t(ep.key)}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
                <img
                  src={heroImage}
                  alt="Rural healthcare worker using digital health tools"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card p-3 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-healing-green" />
                  <span className="text-sm font-medium text-foreground">3 Languages Supported</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card hover-lift p-6 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 ManoVaidya — Vernacular Mental Health Triage</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
