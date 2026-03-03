import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft, Loader2, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import {
    savePatientProfile,
    getPatientProfile,
    validatePassword,
    TELANGANA_DISTRICTS,
    PatientProfile,
} from '@/lib/patientAuth';

const containerVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const PatientAuth = () => {
    const { t, language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    // Mode & UI State
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [signInError, setSignInError] = useState('');

    // Sign In State
    const [signInName, setSignInName] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    // Sign Up State
    const [step, setStep] = useState(1);
    const [signUpName, setSignUpName] = useState('');
    const [signUpAge, setSignUpAge] = useState<number | ''>('');
    const [signUpGender, setSignUpGender] = useState<'male' | 'female' | 'other' | ''>('');
    const [signUpDistrict, setSignUpDistrict] = useState('');
    const [signUpVillage, setSignUpVillage] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
    const [signUpError, setSignUpError] = useState('');

    const handleGuest = () => {
        sessionStorage.setItem('manovaidya_guest_session', 'true');
        navigate('/patient/triage');
    };

    const handleSignIn = () => {
        setSignInError('');
        if (!signInName.trim() || !signInPassword) {
            setSignInError(t('auth.error.empty') || 'Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const stored = getPatientProfile();
            if (
                !stored ||
                stored.name.trim().toLowerCase() !== signInName.trim().toLowerCase() ||
                !validatePassword(signInPassword)
            ) {
                setSignInError(t('auth.error.invalid') || 'Invalid name or password. Please try again.');
                setIsLoading(false);
                return;
            }

            // Success
            setLanguage(stored.language);
            navigate('/patient/triage');
        }, 600);
    };

    const handleSignUpNext = () => {
        setSignUpError('');
        if (step === 1) {
            if (signUpName.trim().length < 2) {
                setSignUpError(t('auth.error.nameLength') || 'Name must be at least 2 characters.');
                return;
            }
            if (signUpAge === '' || signUpAge < 5 || signUpAge > 110) {
                setSignUpError(t('auth.error.ageRange') || 'Age must be between 5 and 110.');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!signUpGender) {
                setSignUpError(t('auth.error.genderSelect') || 'Please select a gender.');
                return;
            }
            setStep(3);
        }
    };

    const handleSignUpSubmit = () => {
        setSignUpError('');
        if (!signUpDistrict || !signUpVillage) {
            setSignUpError(t('auth.error.locationSelect') || 'Please select your district and village.');
            return;
        }
        if (signUpPassword.length < 6) {
            setSignUpError(t('auth.error.passwordLength') || 'Password must be at least 6 characters.');
            return;
        }
        if (signUpPassword !== signUpConfirmPassword) {
            setSignUpError(t('auth.error.passwordMatch') || 'Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const profile: PatientProfile = {
                id: Date.now().toString(),
                name: signUpName.trim(),
                language: language,
                age: Number(signUpAge),
                gender: signUpGender as 'male' | 'female' | 'other',
                district: signUpDistrict,
                village: signUpVillage,
                password: signUpPassword, // TODO: hash password before production
                createdAt: new Date().toISOString()
            };
            savePatientProfile(profile);
            setLanguage(language);
            navigate('/patient/triage');
        }, 600);
    };

    const sortedDistricts = Object.keys(TELANGANA_DISTRICTS).sort();
    const currentVillages = signUpDistrict ? TELANGANA_DISTRICTS[signUpDistrict] : [];

    return (
        <div className="min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center relative">
            {/* Animated gradient background identical to Index.tsx */}
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

            <div className="w-full max-w-md px-4 relative z-10 w-full mx-auto py-12">
                <div className="glass-card overflow-hidden">

                    {/* Mode Switcher */}
                    <div className="flex border-b border-border bg-muted/20">
                        <button
                            onClick={() => { setMode('signin'); setSignUpError(''); setSignInError(''); }}
                            className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${mode === 'signin' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t('auth.tab.signin')}
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setSignUpError(''); setSignInError(''); }}
                            className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${mode === 'signup' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t('auth.tab.signup')}
                        </button>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {mode === 'signin' ? (
                                <motion.div key="signin" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-4">

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">{t('auth.name')}</label>
                                            <input
                                                type="text"
                                                value={signInName}
                                                onChange={(e) => setSignInName(e.target.value)}
                                                placeholder={t('auth.name.placeholder')}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-1">{t('auth.password')}</label>
                                            <input
                                                type="password"
                                                value={signInPassword}
                                                onChange={(e) => setSignInPassword(e.target.value)}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {signInError && <p className="text-sm font-medium text-destructive">{signInError}</p>}

                                    <div className="pt-2">
                                        <button
                                            onClick={handleSignIn}
                                            disabled={isLoading}
                                            className="w-full hover-lift bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center transition-all disabled:opacity-70 disabled:pointer-events-none"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.btn.signin')}
                                        </button>
                                    </div>

                                    <div className="text-center pt-4 space-y-3">
                                        <button onClick={() => setMode('signup')} className="text-sm text-primary hover:underline font-medium block w-full">
                                            {t('auth.link.newUser')}
                                        </button>
                                        <button onClick={handleGuest} className="text-sm text-muted-foreground hover:text-foreground hover:underline font-medium block w-full">
                                            {t('auth.link.guest')}
                                        </button>
                                    </div>

                                </motion.div>
                            ) : (
                                <motion.div key="signup" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-6">

                                    {/* Progress Indicator */}
                                    <div className="flex items-center justify-center space-x-2">
                                        {[1, 2, 3].map((s) => (
                                            <div key={s} className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                                {s < 3 && <div className={`w-6 h-0.5 mx-1 transition-colors duration-300 ${s < step ? 'bg-primary' : 'bg-muted-foreground/30'}`} />}
                                            </div>
                                        ))}
                                    </div>
                                    <h2 className="text-center text-lg font-semibold text-foreground">
                                        {t(`auth.step${step}.title`)}
                                    </h2>

                                    {/* Wizard Content */}
                                    <div className="min-h-[220px]">
                                        <AnimatePresence mode="wait">
                                            {step === 1 && (
                                                <motion.div key="step1" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.name')}</label>
                                                        <input
                                                            type="text"
                                                            value={signUpName}
                                                            onChange={(e) => setSignUpName(e.target.value)}
                                                            placeholder={t('auth.name.placeholder')}
                                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.language')}</label>
                                                        <div className="flex" onClick={(e) => e.stopPropagation()}>
                                                            <LanguageSelector />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.age')}</label>
                                                        <input
                                                            type="number"
                                                            min="5" max="110"
                                                            value={signUpAge}
                                                            onChange={(e) => setSignUpAge(e.target.value === '' ? '' : Number(e.target.value))}
                                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 2 && (
                                                <motion.div key="step2" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-4">
                                                    <label className="block text-sm font-medium text-foreground mb-2 text-center">{t('auth.gender.prompt')}</label>
                                                    <div className="flex flex-col gap-3">
                                                        {(['male', 'female', 'other'] as const).map(g => (
                                                            <button
                                                                key={g}
                                                                onClick={() => setSignUpGender(g)}
                                                                className={`py-3 px-4 rounded-xl font-medium border text-center transition-all duration-200 ${signUpGender === g ? 'bg-primary text-primary-foreground border-primary shadow-md transform scale-[1.02]' : 'bg-background text-foreground border-border hover:border-primary/50'}`}
                                                            >
                                                                {t(`auth.gender.${g}`)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {step === 3 && (
                                                <motion.div key="step3" variants={containerVariant} initial="hidden" animate="show" exit="exit" className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.district')}</label>
                                                        <select
                                                            value={signUpDistrict}
                                                            onChange={(e) => {
                                                                setSignUpDistrict(e.target.value);
                                                                setSignUpVillage('');
                                                            }}
                                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                                                        >
                                                            <option value="" disabled>{t('auth.district.select')}</option>
                                                            {sortedDistricts.map(d => (
                                                                <option key={d} value={d}>{d}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.village')}</label>
                                                        <select
                                                            value={signUpVillage}
                                                            onChange={(e) => setSignUpVillage(e.target.value)}
                                                            disabled={!signUpDistrict}
                                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all appearance-none disabled:opacity-50"
                                                        >
                                                            <option value="" disabled>{t('auth.village.select')}</option>
                                                            {currentVillages.map(v => (
                                                                <option key={v} value={v}>{v}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.password')}</label>
                                                        <input
                                                            type="password"
                                                            value={signUpPassword}
                                                            onChange={(e) => setSignUpPassword(e.target.value)}
                                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">{t('auth.passwordConfirm')}</label>
                                                        <input
                                                            type="password"
                                                            value={signUpConfirmPassword}
                                                            onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {signUpError && <p className="text-sm font-medium text-destructive text-center">{signUpError}</p>}

                                    <div className="flex gap-3 pt-2">
                                        {step > 1 && (
                                            <button
                                                onClick={() => { setStep(s => s - 1); setSignUpError(''); }}
                                                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors flex items-center justify-center shrink-0"
                                            >
                                                <ChevronLeft className="w-5 h-5 mr-1" /> {t('auth.btn.back')}
                                            </button>
                                        )}
                                        {step < 3 ? (
                                            <button
                                                onClick={handleSignUpNext}
                                                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center hover-lift transition-all"
                                            >
                                                {t('auth.btn.next')} <ChevronRight className="w-5 h-5 ml-1" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleSignUpSubmit}
                                                disabled={isLoading}
                                                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center hover-lift transition-all disabled:opacity-70 disabled:pointer-events-none"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.btn.create')}
                                            </button>
                                        )}
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAuth;
