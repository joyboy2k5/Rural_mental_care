import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Calendar as CalendarIcon, Clock, Video, Phone, MessageCircle,
  Star, User, Check, CheckCircle, ChevronLeft, ChevronRight, ArrowLeft
} from 'lucide-react';
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
type CounselorType = {
  id: string;
  name: string;
  title: string;
  languages: string[];
  specialization: string;
  rating: number;
  experience: number;
  available: boolean;
  specialties: string[];
  bio: string;
};

const counselors: CounselorType[] = [
  {
    id: '1', name: 'Dr. Priya Sharma', title: 'Licensed Clinical Psychologist',
    languages: ['Telugu', 'Hindi', 'English'],
    specialization: 'Clinical Psychology', rating: 4.9, experience: 8,
    available: true, specialties: ['Anxiety', 'Depression', 'Trauma'],
    bio: 'Specializes in trauma-informed care and cognitive behavioral therapy.'
  },
  {
    id: '2', name: 'Dr. Lakshmi Reddy', title: 'Mental Health Counselor',
    languages: ['Telugu', 'English'],
    specialization: 'Counseling', rating: 4.8, experience: 6,
    available: true, specialties: ['Stress Management', 'Family Pressure', 'Relationships'],
    bio: 'Focuses on holistic approaches to stress and family dynamics.'
  },
  {
    id: '3', name: 'Dr. Arun Kumar', title: 'Licensed Therapist',
    languages: ['Hindi', 'English'],
    specialization: 'Therapy', rating: 4.9, experience: 10,
    available: false, specialties: ['Self-esteem', 'Life Transitions', 'Wellness'],
    bio: 'Helps clients navigate major life transitions and build self-esteem.'
  },
  {
    id: '4', name: 'Dr. Meera Nair', title: 'Clinical Social Worker',
    languages: ['Malayalam', 'English'],
    specialization: 'Social Work', rating: 4.7, experience: 12,
    available: true, specialties: ['Crisis Support', 'Coping Skills', 'Support Groups'],
    bio: 'Provides compassionate crisis support and practical coping strategies.'
  }
];

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const bookedSlots = ['10:00 AM', '03:00 PM'];

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  const d = new Date(year, month - 1, day); // local time, no UTC shift
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const PatientSessions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [booking, setBooking] = useState<{
    counselor: CounselorType | null;
    date: string | null;
    time: string | null;
    sessionType: 'video' | 'phone' | 'chat' | null;
    reason: string;
    notes: string;
  }>({
    counselor: null,
    date: null,
    time: null,
    sessionType: 'video',
    reason: '',
    notes: ''
  });

  const [showBookings, setShowBookings] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(2025, 10, 1); // November 2025 as default
    return d;
  });

  const handleNextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handlePrevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

  const getCalendarCells = () => {
    const cells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysInMonthCount = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const prevMonthDaysCount = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDaysCount - i);
      cells.push({ date: d, isCurrentMonth: false, isPast: d < today });
    }
    for (let i = 1; i <= daysInMonthCount; i++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      cells.push({ date: d, isCurrentMonth: true, isPast: d < today });
    }
    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
      cells.push({ date: d, isCurrentMonth: false, isPast: d < today });
    }
    return cells;
  };

  const confirmBooking = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in");
    return;
  }

  try {
    await addDoc(collection(db, "appointments"), {
      patientId: user.uid,
      patientEmail: user.email,
      counselorName: booking.counselor?.name,
      counselorId: booking.counselor?.id,
      date: booking.date,
      time: booking.time,
      sessionType: booking.sessionType,
      reason: booking.reason,
      notes: booking.notes,
      status: "booked",
      severity: "Medium",
      createdAt: Timestamp.now(),
    });

    setStep(4);

  } catch (error) {
    console.error("Error saving booking:", error);
    alert("Something went wrong");
  }
};
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6 bg-background">
      {step < 4 && (
        <div className="glass-card overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
            <h1 className="font-display text-2xl font-bold text-foreground">{t('sessions.title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('sessions.subtitle')}</p>
            <div className="relative flex items-center justify-between max-w-xs mx-auto mt-8">
              <div className="absolute top-4 left-0 right-0 h-[2px] bg-muted z-0" />
              {[{ num: 1, label: t('sessions.step1') }, { num: 2, label: t('sessions.step2') }, { num: 3, label: t('sessions.step3') }].map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                    <div className="bg-card px-1 rounded-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isCompleted ? 'bg-primary text-primary-foreground' :
                        isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                          'bg-muted text-muted-foreground'
                        }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden w-full">
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="grid md:grid-cols-2 gap-4">
                {counselors.map((c) => (
                  <div key={c.id} className="glass-card hover-lift p-5 flex flex-col items-start gap-4">
                    <div className="w-full flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.available ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-lg text-foreground">{c.name}</h3>
                          <p className="text-sm text-muted-foreground">{c.title}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.available ? 'bg-healing-green/10 text-healing-green' : 'bg-destructive/10 text-destructive'}`}>
                        {c.available ? t('sessions.available') : t('sessions.busy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-soft-gold fill-soft-gold" />
                      <span className="text-sm font-medium text-foreground">{c.rating} • {c.experience} {t('sessions.years')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {c.specialties.map(s => (
                        <span key={s} className="px-2 py-0.5 mt-1 rounded-full text-xs bg-muted text-muted-foreground tracking-wide">{s}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => { setBooking(prev => ({ ...prev, counselor: c })); setStep(2); }}
                      disabled={!c.available}
                      className={`mt-auto w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${c.available ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                    >
                      {c.available ? t('sessions.bookNow') : t('sessions.unavailable')}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <h2 className="text-sm font-medium">{t('sessions.bookingWith')} {booking.counselor?.name}</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Calendar Column */}
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={handlePrevMonth} className="p-1 rounded bg-muted hover:bg-muted/80 transition-all duration-200"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="font-semibold text-sm">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      <button onClick={handleNextMonth} className="p-1 rounded bg-muted hover:bg-muted/80 transition-all duration-200"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarCells().map((cell, idx) => {
                        const cellStr = new Date(cell.date.getTime() - (cell.date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                        const todayStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                        const isSelected = booking.date === cellStr;
                        const isToday = cellStr === todayStr;
                        return (
                          <button
                            key={idx}
                            onClick={() => { if (!cell.isPast) setBooking(prev => ({ ...prev, date: cellStr })); }}
                            disabled={cell.isPast}
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm transition-all duration-200 ${!cell.isCurrentMonth ? 'text-muted-foreground/30' :
                              cell.isPast ? 'text-muted-foreground/50 cursor-not-allowed' :
                                isSelected ? 'bg-primary text-primary-foreground' :
                                  'hover:bg-primary/10 text-foreground'
                              } ${isToday && !isSelected ? 'ring-1 ring-primary' : ''}`}
                          >
                            {cell.date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Times Column */}
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-foreground mb-1">{t('sessions.availableTimes')}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{booking.date ? formatDate(booking.date) : t('sessions.selectDate')}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(time => {
                        const isBooked = bookedSlots.includes(time);
                        const isSelected = booking.time === time;
                        return (
                          <button
                            key={time}
                            disabled={isBooked || !booking.date}
                            onClick={() => setBooking(prev => ({ ...prev, time }))}
                            className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${isBooked ? 'bg-muted/50 border-transparent text-muted-foreground line-through cursor-not-allowed' :
                              isSelected ? 'bg-primary/20 border-primary text-primary' :
                                'bg-background border-border text-foreground hover:border-primary/50'
                              } ${!booking.date ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Summary Column */}
                  <div className="glass-card p-5 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{t('sessions.summary.title')}</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <User className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground uppercase">{t('sessions.summary.counselor')}</p>
                          <p className="text-sm font-medium text-foreground">{booking.counselor?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <CalendarIcon className="w-4 h-4 text-secondary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground uppercase">{t('sessions.summary.date')}</p>
                          <p className={`text-sm font-medium ${booking.date ? 'text-foreground' : 'text-muted-foreground'}`}>{booking.date ? formatDate(booking.date) : t('sessions.summary.notSelected')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Clock className="w-4 h-4 text-soft-gold" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground uppercase">{t('sessions.summary.time')}</p>
                          <p className={`text-sm font-medium ${booking.time ? 'text-foreground' : 'text-muted-foreground'}`}>{booking.time || t('sessions.summary.notSelected')}</p>
                        </div>
                      </div>
                    </div>
                    {(!booking.date || !booking.time) && (
                      <p className="text-xs text-center text-muted-foreground mb-4 mt-auto">{t('sessions.completeSelection')}</p>
                    )}
                    <div className="mt-auto space-y-2">
                      <button
                        disabled={!booking.date || !booking.time}
                        onClick={() => setStep(3)}
                        className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${booking.date && booking.time ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                          }`}
                      >
                        {t('sessions.confirmDateTime')}
                      </button>
                      <button
                        onClick={() => setStep(1)}
                        className="w-full py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-200"
                      >
                        {t('sessions.backToCounselors')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-muted-foreground">
                  <h2 className="text-sm border border-border bg-card px-3 py-1 rounded-full">{formatDate(booking.date)} at {booking.time}</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 glass-card p-6 space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">{t('sessions.details.type')}</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'video', label: t('sessions.type.video'), icon: Video },
                          { id: 'phone', label: t('sessions.type.phone'), icon: Phone },
                          { id: 'chat', label: t('sessions.type.chat'), icon: MessageCircle }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setBooking(prev => ({ ...prev, sessionType: opt.id as any }))}
                            className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all duration-200 ${booking.sessionType === opt.id ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50 hover:border-border'
                              }`}
                          >
                            <opt.icon className="w-6 h-6 mb-2" />
                            <span className="text-xs font-semibold">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('sessions.details.reason')}</label>
                      <select
                        value={booking.reason}
                        onChange={e => setBooking(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full h-12 px-4 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all duration-200"
                      >
                        <option value="" disabled>{t('sessions.details.selectReason')}</option>
                        {["Anxiety or Stress", "Depression", "Family Issues", "Work/Financial Stress", "Sleep Problems", "Relationship Issues", "Grief or Loss", "Other"].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{t('sessions.details.notes')} <span className="text-muted-foreground font-normal">({t('sessions.details.optional')})</span></label>
                      <textarea
                        value={booking.notes}
                        onChange={e => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                        rows={4}
                        placeholder={t('sessions.details.placeholder')}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none transition-all duration-200 resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="glass-card p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground text-lg">{t('sessions.summary.title')}</h3>
                    </div>
                    <div className="space-y-3 mb-8 flex-1">
                      <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('sessions.summary.counselor')}</p>
                          <p className="text-sm font-semibold text-foreground">{booking.counselor?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center"><CalendarIcon className="w-5 h-5 text-secondary" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('sessions.summary.date')}</p>
                          <p className="text-sm font-semibold text-foreground">{formatDate(booking.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-soft-gold/20 flex items-center justify-center"><Clock className="w-5 h-5 text-soft-gold" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('sessions.summary.time')}</p>
                          <p className="text-sm font-semibold text-foreground">{booking.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          {booking.sessionType === 'video' && <Video className="w-5 h-5 text-primary" />}
                          {booking.sessionType === 'phone' && <Phone className="w-5 h-5 text-primary" />}
                          {booking.sessionType === 'chat' && <MessageCircle className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('sessions.details.type')}</p>
                          <p className="text-sm font-semibold text-foreground capitalize">{booking.sessionType === 'video' ? t('sessions.type.video') : booking.sessionType === 'phone' ? t('sessions.type.phone') : t('sessions.type.chat')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 mt-auto">
                      <button
                        disabled={!booking.reason}
                        onClick={confirmBooking}
                        className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-200 ${booking.reason ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg' : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                          }`}
                      >
                        {t('sessions.confirmBooking')}
                      </button>
                      <button
                        onClick={() => setStep(2)}
                        className="w-full py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-all duration-200"
                      >
                        {t('sessions.backToDate')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              {showBookings ? (
                <div className="mt-6 w-full max-w-2xl mx-auto space-y-3">
                  <h3 className="font-display text-xl font-semibold text-foreground text-center mb-4">{t('sessions.myBookings')}</h3>
                  {JSON.parse(localStorage.getItem('manovaidya_bookings') || '[]').map((b: any, i: number) => (
                    <div key={i} className="glass-card p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        {b.sessionType === 'video' ? <Video className="w-5 h-5 text-primary" /> :
                          b.sessionType === 'phone' ? <Phone className="w-5 h-5 text-primary" /> :
                            <MessageCircle className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{b.counselorName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(b.date)} • {b.time}</p>
                      </div>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">{b.sessionType}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => { setShowBookings(false); setStep(1); setBooking({ counselor: null, date: null, time: null, sessionType: 'video', reason: '', notes: '' }); }}
                    className="w-full py-3 mt-4 rounded-xl font-semibold text-muted-foreground hover:bg-muted transition-all duration-200"
                  >
                    {t('sessions.bookAnother')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center glass-card p-10 max-w-2xl mx-auto">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-healing-green/20 text-healing-green rounded-full flex items-center justify-center mb-6"
                  >
                    <Check className="w-12 h-12" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="font-display text-4xl font-bold text-primary mb-2"
                  >
                    {t('sessions.confirm.title')}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="text-muted-foreground mb-8 text-lg max-w-md"
                  >
                    {t('sessions.confirm.desc1')} <span className="font-semibold text-foreground capitalize">{booking.sessionType === 'video' ? t('sessions.type.video') : booking.sessionType === 'phone' ? t('sessions.type.phone') : t('sessions.type.chat')}</span> {t('sessions.confirm.desc2')} <span className="font-semibold text-foreground">{booking.counselor?.name}</span> {t('sessions.confirm.desc3')} <span className="font-semibold text-foreground">{formatDate(booking.date)}</span> {t('sessions.confirm.desc4')} <span className="font-semibold text-foreground">{booking.time}</span>.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 w-full max-w-sm"
                  >
                    <button
                      onClick={() => navigate('/patient/dashboard')}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200"
                    >
                      {t('sessions.confirm.return')}
                    </button>
                    <button
                      onClick={() => setShowBookings(true)}
                      className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-accent transition-all duration-200"
                    >
                      {t('sessions.confirm.viewBookings')}
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientSessions;
