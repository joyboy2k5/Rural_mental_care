import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { motion } from 'framer-motion';
import {
    Monitor, Moon, Sun, Type, AlignLeft, Clock, RefreshCcw, BellRing, Info, BellOff,
    RefreshCw, Volume2, LayoutTemplate, MapPin, Activity, Minimize2
} from 'lucide-react';

const TEXT_SIZES = [
    { tKey: 'settings.textSize.small', value: 12 },
    { tKey: 'settings.textSize.default', value: 16 },
    { tKey: 'settings.textSize.medium', value: 20 },
    { tKey: 'settings.textSize.large', value: 24 },
    { tKey: 'settings.textSize.xlarge', value: 28 },
];

const THEMES = [
    { tKey: 'settings.contrast.default', value: 'default', icon: Sun },
    { tKey: 'settings.contrast.high', value: 'high-contrast', icon: Monitor },
    { tKey: 'settings.contrast.dark', value: 'dark', icon: Moon },
];

const SPACING_OPTIONS = [
    { tKey: 'settings.spacing.compact', value: 'Compact', line: 1.2 },
    { tKey: 'settings.spacing.normal', value: 'Normal', line: 1.6 },
    { tKey: 'settings.spacing.relaxed', value: 'Relaxed', line: 2.0 },
];

const ANIMATION_SPEEDS = [0.25, 0.5, 0.75, 1, 1.5, 2];

const getStoredVal = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    if (stored !== null) {
        try {
            return JSON.parse(stored);
        } catch {
            return stored; // For bare strings like time inputs
        }
    }
    return defaultValue;
};

const HWSettings = () => {
    const { t } = useLanguage();

    // ---------------------------------------------------------
    // SHARED SETTINGS (Mirrors PatientSettings.tsx)
    // ---------------------------------------------------------
    const [textSizeIdx, setTextSizeIdx] = useState<number>(() => {
        const val = getStoredVal('textSize', 16);
        const idx = TEXT_SIZES.findIndex(s => s.value === val);
        return idx !== -1 ? idx : 1;
    });
    const [contrastTheme, setContrastTheme] = useState<string>(() => getStoredVal('contrastTheme', 'default'));
    const [reduceMotion, setReduceMotion] = useState<boolean>(() => getStoredVal('reduceMotion', false));
    const [animationSpeed, setAnimationSpeed] = useState<number>(() => getStoredVal('animationSpeed', 1));
    const [lineSpacing, setLineSpacing] = useState<string>(() => getStoredVal('lineSpacing', 'Normal'));

    const [sessionReminders, setSessionReminders] = useState<boolean>(() => getStoredVal('sessionReminders', true));
    const [healthTips, setHealthTips] = useState<boolean>(() => getStoredVal('healthTips', true));
    const [quietHoursFrom, setQuietHoursFrom] = useState<string>(() => getStoredVal('quietHoursFrom', '22:00'));
    const [quietHoursTo, setQuietHoursTo] = useState<string>(() => getStoredVal('quietHoursTo', '07:00'));

    // ---------------------------------------------------------
    // HEALTHWORKER SPECIFIC SETTINGS
    // ---------------------------------------------------------
    // Queue & Triage Preferences
    const [hwAutoRefresh, setHwAutoRefresh] = useState<boolean>(() => getStoredVal('hw_autoRefresh', true));
    const [hwSoundAlert, setHwSoundAlert] = useState<boolean>(() => getStoredVal('hw_soundAlert', true));
    const [hwDefaultView, setHwDefaultView] = useState<string>(() => getStoredVal('hw_defaultView', 'all'));

    // Display Preferences
    const [hwShowLocation, setHwShowLocation] = useState<boolean>(() => getStoredVal('hw_showLocation', true));
    const [hwShowConfidence, setHwShowConfidence] = useState<boolean>(() => getStoredVal('hw_showConfidence', false));
    const [hwCompactCards, setHwCompactCards] = useState<boolean>(() => getStoredVal('hw_compactCards', false));

    // ---------------------------------------------------------
    // EFFECTS (Shared DOM side-effects & persistence)
    // ---------------------------------------------------------
    useEffect(() => {
        const size = TEXT_SIZES[textSizeIdx].value;
        localStorage.setItem('textSize', JSON.stringify(size));
        document.documentElement.style.fontSize = `${size}px`;
    }, [textSizeIdx]);

    useEffect(() => {
        localStorage.setItem('contrastTheme', JSON.stringify(contrastTheme));
        document.documentElement.classList.remove('high-contrast', 'dark');
        if (contrastTheme === 'high-contrast') document.documentElement.classList.add('high-contrast');
        if (contrastTheme === 'dark') document.documentElement.classList.add('dark');
    }, [contrastTheme]);

    useEffect(() => {
        localStorage.setItem('reduceMotion', JSON.stringify(reduceMotion));
        document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    }, [reduceMotion]);

    useEffect(() => {
        localStorage.setItem('animationSpeed', JSON.stringify(animationSpeed));
        document.documentElement.style.setProperty('--animation-speed', String(reduceMotion ? 0 : animationSpeed));
    }, [animationSpeed, reduceMotion]);

    useEffect(() => {
        localStorage.setItem('lineSpacing', JSON.stringify(lineSpacing));
        const spacingVal = SPACING_OPTIONS.find(o => o.value === lineSpacing)?.line || 1.6;
        document.documentElement.style.lineHeight = String(spacingVal);
    }, [lineSpacing]);

    useEffect(() => {
        localStorage.setItem('sessionReminders', JSON.stringify(sessionReminders));
        localStorage.setItem('healthTips', JSON.stringify(healthTips));
        localStorage.setItem('quietHoursFrom', quietHoursFrom);
        localStorage.setItem('quietHoursTo', quietHoursTo);
    }, [sessionReminders, healthTips, quietHoursFrom, quietHoursTo]);

    // ---------------------------------------------------------
    // EFFECTS (HW Specific persistence)
    // ---------------------------------------------------------
    useEffect(() => {
        localStorage.setItem('hw_autoRefresh', JSON.stringify(hwAutoRefresh));
        localStorage.setItem('hw_soundAlert', JSON.stringify(hwSoundAlert));
        localStorage.setItem('hw_defaultView', JSON.stringify(hwDefaultView));
        localStorage.setItem('hw_showLocation', JSON.stringify(hwShowLocation));
        localStorage.setItem('hw_showConfidence', JSON.stringify(hwShowConfidence));
        localStorage.setItem('hw_compactCards', JSON.stringify(hwCompactCards));
    }, [hwAutoRefresh, hwSoundAlert, hwDefaultView, hwShowLocation, hwShowConfidence, hwCompactCards]);


    // ---------------------------------------------------------
    // RESET HANDLERS
    // ---------------------------------------------------------
    const resetAllSettings = () => {
        const keys = ['textSize', 'contrastTheme', 'reduceMotion', 'animationSpeed', 'lineSpacing', 'sessionReminders', 'healthTips', 'quietHoursFrom', 'quietHoursTo'];
        keys.forEach(k => localStorage.removeItem(k));

        setTextSizeIdx(1); // Default (16px)
        setContrastTheme('default');
        setReduceMotion(false);
        setAnimationSpeed(1);
        setLineSpacing('Normal');
        setSessionReminders(true);
        setHealthTips(true);
        setQuietHoursFrom('22:00');
        setQuietHoursTo('07:00');

        document.documentElement.style.fontSize = '';
        document.documentElement.style.lineHeight = '';
        document.documentElement.style.removeProperty('--animation-speed');
        document.documentElement.classList.remove('high-contrast', 'dark', 'reduce-motion');
    };

    const resetHWPreferences = () => {
        const hwKeys = ['hw_autoRefresh', 'hw_soundAlert', 'hw_defaultView', 'hw_showLocation', 'hw_showConfidence', 'hw_compactCards'];
        hwKeys.forEach(k => localStorage.removeItem(k));

        setHwAutoRefresh(true);
        setHwSoundAlert(true);
        setHwDefaultView('all');
        setHwShowLocation(true);
        setHwShowConfidence(false);
        setHwCompactCards(false);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 h-full bg-background flex flex-col lg:flex-row gap-6">

            {/* Left Column: Settings Configuration */}
            <div className="flex-1 space-y-6 max-w-3xl">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground mb-1">{t('sidebar.settings')}</h1>
                    <p className="text-muted-foreground text-sm">{t('hw.settings.subtitle')}</p>
                </div>

                {/* Language Preference */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                    <h2 className="font-semibold text-foreground mb-4">{t('settings.language')}</h2>
                    <LanguageSelector />
                </motion.div>

                {/* Accessibility */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-semibold text-foreground text-lg">{t('settings.accessibility')}</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium flex items-center gap-2"><Type className="w-4 h-4 text-muted-foreground" /> {t('settings.textSize')}</span>
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-semibold">{t(TEXT_SIZES[textSizeIdx].tKey)} ({TEXT_SIZES[textSizeIdx].value}px)</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={TEXT_SIZES.length - 1}
                            step="1"
                            value={textSizeIdx}
                            onChange={(e) => setTextSizeIdx(Number(e.target.value))}
                            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                            <span>{t('settings.textSize.small')}</span>
                            <span>{t('settings.textSize.xlarge')}</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <span className="font-medium flex items-center gap-2 mb-3"><Monitor className="w-4 h-4 text-muted-foreground" /> {t('settings.contrast')}</span>
                        <div className="flex flex-wrap gap-3">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.value}
                                    onClick={() => setContrastTheme(theme.value)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${contrastTheme === theme.value
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-card text-foreground border-border hover:bg-accent hover:border-accent'
                                        }`}
                                >
                                    <theme.icon className="w-4 h-4" />
                                    {t(theme.tKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <span className="font-medium flex items-center gap-2 mb-3"><AlignLeft className="w-4 h-4 text-muted-foreground" /> {t('settings.spacing')}</span>
                        <div className="flex bg-muted p-1 rounded-xl w-fit">
                            {SPACING_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setLineSpacing(opt.value)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${lineSpacing === opt.value ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {t(opt.tKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5 pt-4 border-t border-border">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <span className="font-medium block">{t('settings.reduceMotion')}</span>
                                <span className="text-sm text-muted-foreground">{t('settings.reduceMotion.desc')}</span>
                            </div>
                            <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>

                        <div className={`space-y-3 transition-opacity duration-300 ${reduceMotion ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">{t('settings.animSpeed')}</span>
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-semibold">{animationSpeed}x</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={ANIMATION_SPEEDS.length - 1}
                                step="1"
                                value={ANIMATION_SPEEDS.indexOf(animationSpeed) !== -1 ? ANIMATION_SPEEDS.indexOf(animationSpeed) : 3}
                                onChange={(e) => setAnimationSpeed(ANIMATION_SPEEDS[Number(e.target.value)])}
                                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                disabled={reduceMotion}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                                <span>{t('settings.animSpeed.slow')}</span>
                                <span>{t('settings.animSpeed.fast')}</span>
                            </div>
                        </div>
                    </div>

                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-semibold text-foreground text-lg">{t('settings.notifications')}</h2>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="font-medium">{t('settings.sessionReminders')}</span>
                            <input type="checkbox" checked={sessionReminders} onChange={(e) => setSessionReminders(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group border-t border-border pt-4">
                            <span className="font-medium">{t('settings.healthTips')}</span>
                            <input type="checkbox" checked={healthTips} onChange={(e) => setHealthTips(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>

                        <label className="flex items-center justify-between cursor-not-allowed border-t border-border pt-4 opacity-80" aria-disabled="true" title={t('settings.emergencyAlerts.desc')}>
                            <div>
                                <span className="font-medium flex items-center gap-2"><BellRing className="w-4 h-4 text-destructive" /> {t('settings.emergencyAlerts')}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Info className="w-3 h-3" /> {t('settings.emergencyAlerts.desc')}</span>
                            </div>
                            <input type="checkbox" checked={true} disabled className="w-5 h-5 accent-destructive cursor-not-allowed" />
                        </label>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-border">
                        <span className="font-medium flex items-center gap-2 mb-3"><BellOff className="w-4 h-4 text-muted-foreground" /> {t('settings.quietHours')}</span>
                        <p className="text-sm text-muted-foreground mb-4">{t('settings.quietHours.desc')}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('settings.quietHours.from')}</label>
                                <div className="relative">
                                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input type="time" value={quietHoursFrom} onChange={e => setQuietHoursFrom(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('settings.quietHours.to')}</label>
                                <div className="relative">
                                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input type="time" value={quietHoursTo} onChange={e => setQuietHoursTo(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ---------------------------------------------------------
            HW specific: Queue & Triage Preferences 
            --------------------------------------------------------- */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-semibold text-foreground text-lg">{t('hw.settings.queuePrefs')}</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Auto refresh */}
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <span className="font-medium flex items-center gap-2"><RefreshCw className="w-4 h-4 text-muted-foreground" /> {t('hw.settings.autoRefresh')}</span>
                                <span className="text-sm text-muted-foreground mt-1 block">{t('hw.settings.autoRefresh.desc')}</span>
                            </div>
                            <input type="checkbox" checked={hwAutoRefresh} onChange={(e) => setHwAutoRefresh(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>

                        {/* High-risk sound alert */}
                        <label className="flex items-center justify-between cursor-pointer group border-t border-border pt-4">
                            <div>
                                <span className="font-medium flex items-center gap-2"><Volume2 className="w-4 h-4 text-muted-foreground" /> {t('hw.settings.soundAlert')}</span>
                                <span className="text-sm text-muted-foreground mt-1 block">{t('hw.settings.soundAlert.desc')}</span>
                            </div>
                            <input type="checkbox" checked={hwSoundAlert} onChange={(e) => setHwSoundAlert(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>

                        {/* Default triage view */}
                        <div className="space-y-3 pt-4 border-t border-border">
                            <span className="font-medium flex items-center gap-2 mb-3"><LayoutTemplate className="w-4 h-4 text-muted-foreground" /> {t('hw.settings.defaultView')}</span>
                            <div className="flex bg-muted p-1 rounded-xl w-fit flex-wrap">
                                <button
                                    onClick={() => setHwDefaultView('all')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${hwDefaultView === 'all' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t('hw.settings.view.all')}
                                </button>
                                <button
                                    onClick={() => setHwDefaultView('critical')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${hwDefaultView === 'critical' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t('hw.settings.view.critical')}
                                </button>
                                <button
                                    onClick={() => setHwDefaultView('highCritical')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${hwDefaultView === 'highCritical' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t('hw.settings.view.highCritical')}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ---------------------------------------------------------
            HW specific: Display Preferences 
            --------------------------------------------------------- */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-semibold text-foreground text-lg">{t('hw.settings.displayPrefs')}</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Show Location */}
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <span className="font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /> {t('hw.settings.showLocation')}</span>
                                <span className="text-sm text-muted-foreground mt-1 block">{t('hw.settings.showLocation.desc')}</span>
                            </div>
                            <input type="checkbox" checked={hwShowLocation} onChange={(e) => setHwShowLocation(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>

                        {/* Show Confidence */}
                        <label className="flex items-center justify-between cursor-pointer group border-t border-border pt-4">
                            <div>
                                <span className="font-medium flex items-center gap-2"><Activity className="w-4 h-4 text-muted-foreground" /> {t('hw.settings.showConfidence')}</span>
                                <span className="text-sm text-muted-foreground mt-1 block">{t('hw.settings.showConfidence.desc')}</span>
                            </div>
                            <input type="checkbox" checked={hwShowConfidence} onChange={(e) => setHwShowConfidence(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>

                        {/* Compact Cards */}
                        <label className="flex items-center justify-between cursor-pointer group border-t border-border pt-4">
                            <div>
                                <span className="font-medium flex items-center gap-2"><Minimize2 className="w-4 h-4 text-muted-foreground" /> {t('hw.settings.compactCards')}</span>
                                <span className="text-sm text-muted-foreground mt-1 block">{t('hw.settings.compactCards.desc')}</span>
                            </div>
                            <input type="checkbox" checked={hwCompactCards} onChange={(e) => setHwCompactCards(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer group-hover:scale-105 transition-transform" />
                        </label>
                    </div>
                </motion.div>

            </div>

            {/* Right Column: Live Preview & Reset */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="glass-card p-5 xl:sticky xl:top-6 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-bold text-foreground">{t('settings.preview')}</h3>
                        <span className="animate-pulse w-2 h-2 rounded-full bg-primary block"></span>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-sm relative overflow-hidden">
                        {/* The preview card relies on document-level font size and line height which will automatically cascade in here. */}
                        <h4 className="font-display font-bold text-primary">{t('settings.preview.title')}</h4>
                        <p className="text-muted-foreground">
                            {t('settings.preview.body')}
                        </p>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium w-full mt-2 hover:bg-primary/90 transition-colors">
                            {t('settings.preview.button')}
                        </button>
                    </div>

                    <button
                        onClick={resetAllSettings}
                        className="mt-6 flex items-center justify-center gap-2 w-full px-4 py-2 text-destructive border border-destructive/30 hover:bg-destructive/10 rounded-lg transition-colors font-medium"
                    >
                        <RefreshCcw className="w-4 h-4" /> {t('settings.reset')}
                    </button>

                    <button
                        onClick={resetHWPreferences}
                        className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2 text-muted-foreground border border-border hover:bg-muted rounded-lg transition-colors font-medium text-sm"
                    >
                        <RefreshCcw className="w-4 h-4" /> {t('hw.settings.resetHW')}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HWSettings;
