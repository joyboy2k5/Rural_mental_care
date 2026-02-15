import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Stethoscope, LayoutDashboard, ListChecks, Users, BarChart3, BookOpen, Settings, LogOut } from 'lucide-react';

const links = [
  { to: '/healthworker/dashboard', icon: LayoutDashboard, key: 'sidebar.dashboard' },
  { to: '/healthworker/queue', icon: ListChecks, key: 'sidebar.queue' },
  { to: '/healthworker/patients', icon: Users, key: 'sidebar.patients' },
  { to: '/healthworker/analytics', icon: BarChart3, key: 'sidebar.analytics' },
  { to: '/healthworker/resources', icon: BookOpen, key: 'sidebar.resourceLib' },
  { to: '/healthworker/settings', icon: Settings, key: 'sidebar.settings' },
];

const HealthWorkerLayout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-8">
          <Stethoscope className="w-6 h-6 text-secondary" />
          <span className="font-display text-lg font-bold text-foreground">ManoVaidya HW</span>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
            {t('common.logout')}
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 z-40">
        {links.slice(0, 5).map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex flex-col items-center gap-1 px-2 py-1 text-xs ${isActive ? 'text-secondary' : 'text-muted-foreground'}`}>
            <link.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default HealthWorkerLayout;
