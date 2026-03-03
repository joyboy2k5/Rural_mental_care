import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const containerVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const HWAuth = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = () => {
        setError('');
        if (!employeeId.trim() || !password) {
            setError(t('hw.auth.error.empty') || 'Please enter both Employee ID and password.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.setItem('manovaidya_hw_session', JSON.stringify({
                employeeId: employeeId.trim(),
                loginTime: new Date().toISOString()
            }));
            navigate('/healthworker/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center relative">
            {/* Animated gradient background identical to PatientAuth */}
            <div className="fixed inset-0 -z-10 opacity-30">
                <div
                    className="absolute inset-0 animate-gradient-shift"
                    style={{
                        background: 'linear-gradient(135deg, hsl(16 65% 48% / 0.15), hsl(145 25% 42% / 0.1), hsl(38 70% 55% / 0.15), hsl(200 60% 50% / 0.1))',
                        backgroundSize: '400% 400%',
                    }}
                />
            </div>

            {/* Header Branding */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-primary" />
                    <span className="font-display text-lg font-bold text-foreground">ManoVaidya</span>
                </div>
            </div>

            <div className="w-full max-w-md px-4 relative z-10 mx-auto py-12">
                <div className="glass-card overflow-hidden">
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div key="signin" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-6">

                                <div className="text-center space-y-1 pb-2">
                                    <h1 className="text-2xl font-bold text-foreground">{t('auth.tab.signin')}</h1>
                                    <div className="text-secondary font-medium text-sm inline-flex items-center px-2 py-1 bg-secondary/10 rounded-full">
                                        {t('hw.auth.portal') || 'Healthcare Worker Portal'}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">{t('hw.auth.empId') || 'Employee ID'}</label>
                                        <input
                                            type="text"
                                            value={employeeId}
                                            onChange={(e) => setEmployeeId(e.target.value)}
                                            placeholder={t('hw.auth.empId.placeholder') || 'Enter your Employee ID'}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.password')}</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t('hw.auth.password.placeholder') || 'Enter your password'}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                                <div className="pt-2">
                                    <div
                                        onClick={isLoading ? undefined : handleSignIn}
                                        className={`w-full hover-lift bg-secondary text-secondary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (t('hw.auth.btn.signin') || 'Sign In to Dashboard')}
                                    </div>
                                </div>

                                <div className="text-center pt-4">
                                    <div onClick={() => navigate('/')} className="text-sm text-secondary hover:underline font-medium block w-full cursor-pointer">
                                        {t('hw.auth.backToHome') || '← Back to Home'}
                                    </div>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HWAuth;
