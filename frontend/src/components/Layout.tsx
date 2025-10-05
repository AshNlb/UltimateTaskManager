import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, LogOut, MessageSquare, Moon, Sun, Sparkles, Gamepad2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import AIAssistant from './AIAssistant';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, isGame } = useTheme();
  const [showAI, setShowAI] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeMenu]);

  const themes: { mode: ThemeMode; label: string; icon: React.ReactNode; color: string }[] = [
    { mode: 'light', label: 'Light', icon: <Sun size={16} />, color: 'from-yellow-400 to-orange-400' },
    { mode: 'dark', label: 'Dark', icon: <Moon size={16} />, color: 'from-blue-600 to-indigo-600' },
    { mode: 'game', label: 'Game', icon: <Gamepad2 size={16} />, color: 'from-pink-500 to-purple-600' },
  ];

  return (
    <div className={`min-h-screen transition-colors ${isGame ? 'bg-game-bg' : 'bg-gray-50 dark:bg-dark-bg'}`}>
      {/* Header */}
      <header className="glass-effect border-b border-gray-200 dark:border-dark-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl gradient-primary flex items-center justify-center ${isGame ? 'animate-pulse-slow' : ''}`}>
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className={`text-2xl font-bold ${isGame ? 'bg-gradient-to-r from-game-primary to-game-secondary' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}>
                TaskFlow
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${isGame ? 'text-game-secondary' : 'text-gray-600 dark:text-gray-400'}`}>
                Welcome, <span className={`font-semibold ${isGame ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{user?.name}</span>
              </span>

              {/* Theme Selector */}
              <div className="relative" ref={themeMenuRef}>
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isGame
                      ? 'bg-game-card hover:bg-game-hover border border-game-border/40'
                      : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover'
                  }`}
                  title="Change theme"
                >
                  {theme === 'light' && <Sun size={18} className="text-gray-700" />}
                  {theme === 'dark' && <Moon size={18} className="text-yellow-500" />}
                  {theme === 'game' && <Gamepad2 size={18} className="text-game-primary" />}
                </button>

                {showThemeMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-50 ${
                    isGame
                      ? 'bg-game-surface border-game-border'
                      : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border'
                  }`}>
                    {themes.map((t) => (
                      <button
                        key={t.mode}
                        onClick={() => {
                          setTheme(t.mode);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                          theme === t.mode
                            ? `bg-gradient-to-r ${t.color} text-white`
                            : isGame
                            ? 'text-white hover:bg-game-hover'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
                        }`}
                      >
                        <div className={theme === t.mode ? 'text-white' : ''}>{t.icon}</div>
                        <span className="font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  isGame
                    ? 'bg-game-card hover:bg-game-hover border border-game-border/40 text-white'
                    : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300'
                }`}
              >
                <LogOut size={16} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-72 glass-effect border-r min-h-[calc(100vh-64px)] sticky top-16 ${
          isGame ? 'border-game-border' : 'border-gray-200 dark:border-dark-border'
        }`}>
          <nav className="p-6 space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                isActive('/')
                  ? `gradient-primary text-white shadow-lg ${isGame ? 'shadow-game-primary/50' : 'shadow-blue-500/30'}`
                  : isGame
                  ? 'text-white hover:bg-game-hover border border-game-border/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Task Overview</span>
            </Link>
            <Link
              to="/calendar"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                isActive('/calendar')
                  ? `gradient-primary text-white shadow-lg ${isGame ? 'shadow-game-primary/50' : 'shadow-blue-500/30'}`
                  : isGame
                  ? 'text-white hover:bg-game-hover border border-game-border/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              <Calendar size={20} />
              <span>Calendar View</span>
            </Link>
            <button
              onClick={() => setShowAI(!showAI)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                showAI
                  ? `gradient-primary text-white shadow-lg ${isGame ? 'shadow-game-primary/50' : 'shadow-blue-500/30'}`
                  : isGame
                  ? 'text-white hover:bg-game-hover border border-game-border/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
              }`}
            >
              <MessageSquare size={20} />
              <span>AI Assistant</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* AI Assistant Sidebar */}
        {showAI && (
          <div className="w-96 glass-effect border-l border-gray-200 dark:border-dark-border">
            <AIAssistant onClose={() => setShowAI(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
