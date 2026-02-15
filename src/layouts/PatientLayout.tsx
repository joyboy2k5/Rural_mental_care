import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import EmergencySOS from '@/components/EmergencySOS';
import { Heart, MessageCircle, LayoutDashboard, FileText, Calendar, BookOpen, Settings, LogOut } from 'lucide-react';

const links = [
  { to: '/patient/triage', icon: MessageCircle, key: 'sidebar.triage' },
  { to: '/patient/dashboard', icon: LayoutDashboard, key: 'sidebar.dashboard' },
  { to: '/patient/records', icon: FileText, key: 'sidebar.records' },
  { to: '/patient/sessions', icon: Calendar, key: 'sidebar.sessions' },
  { to: '/patient/resources', icon: BookOpen, key: 'sidebar.resources' },
  { to: '/patient/settings', icon: Settings, key: 'sidebar.settings' },
];

const PatientLayout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - hidden on mobile, shown as bottom nav */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-8">
          <Heart className="w-6 h-6 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">ManoVaidya</span>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="pt-4 border-t border-border space-y-3">
          <LanguageSelector />
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('common.logout')}
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
              `flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                isActive ? 'text-primary' : 'text-muted-foreground'
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
