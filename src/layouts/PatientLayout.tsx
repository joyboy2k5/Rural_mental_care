import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import EmergencySOS from '@/components/EmergencySOS';
import { isPatientLoggedIn, getPatientProfile, clearPatientProfile } from '@/lib/patientAuth';
import { Heart, MessageCircle, LayoutDashboard, FileText, Calendar, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const links = [
  { to: '/patient/triage', icon: MessageCircle, key: 'sidebar.triage' },
  { to: '/patient/dashboard', icon: LayoutDashboard, key: 'sidebar.dashboard' },
  { to: '/patient/records', icon: FileText, key: 'sidebar.records' },
  { to: '/patient/sessions', icon: Calendar, key: 'sidebar.sessions' },
  { to: '/patient/resources', icon: BookOpen, key: 'sidebar.resources' },
  { to: '/patient/settings', icon: Settings, key: 'sidebar.settings' },
];

const PatientLayout = () => {
  const isAuth = isPatientLoggedIn() || sessionStorage.getItem('manovaidya_guest_session') === 'true';
  if (!isAuth) {
    return <Navigate to="/patient/auth" replace />;
  }

  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const profile = getPatientProfile();
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  const toggleSidebar = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem('sidebarCollapsed', String(newVal));
  };

  const handleLogout = () => {
    clearPatientProfile();
    sessionStorage.removeItem('manovaidya_guest_session');
    navigate('/patient/auth');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - hidden on mobile, shown as bottom nav */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-card p-4 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-16 items-center px-2' : 'w-64'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary flex-shrink-0" />
            {!isCollapsed && <span className="font-display text-lg font-bold text-foreground truncate">ManoVaidya</span>}
          </div>
          <button
            onClick={toggleSidebar}
            className={`flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors ${isCollapsed ? 'absolute -right-4 bg-white z-10 shadow-sm' : ''}`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
          </button>
        </div>

        {!isCollapsed && profile && (
          <div className="flex items-center gap-3 p-3 mt-6 mb-2 rounded-xl bg-muted/30 border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-lg">{profile.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm text-foreground truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.district}</p>
            </div>
          </div>
        )}

        <nav className={`flex-1 space-y-1 w-full overflow-hidden ${isCollapsed || !profile ? 'mt-8' : 'mt-4'}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              title={isCollapsed ? t(link.key) : undefined}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{t(link.key)}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-border space-y-3 w-full">
          {!isCollapsed && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors hover:border-orange-300 text-gray-700"
            >
              <option value="en">🌐 English</option>
              <option value="te">🌐 తెలుగు (Telugu)</option>
              <option value="hi">🌐 हिंदी (Hindi)</option>
            </select>
          )}
          <button
            onClick={handleLogout}
            title={isCollapsed ? t('common.logout') : undefined}
            className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'} w-full rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{t('common.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 z-40">
        {links.slice(0, 5).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>

      <EmergencySOS />
    </div>
  );
};

export default PatientLayout;
