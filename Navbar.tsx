import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ShoppingBag,
  Bell,
  Mic,
  User,
  ShieldCheck,
  CheckCircle,
  Menu,
  X,
  Globe,
  LogOut,
  ChevronDown,
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOffline } from '../context/OfflineContext';
import { TRANSLATIONS } from '../../shared/i18n';
import { LanguageCode, RealtimeNotification } from '../../shared/types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenVoice,
}) => {
  const { user, language, setLanguage, logout, switchDemoUser } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { isOnline } = useOffline();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  // Fetch real-time notifications for current user
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const fetchNotifs = () => {
      fetch(`/api/notifications?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(() => {});
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 8000); // Periodic live poll
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotifRead = async (notifId: string) => {
    if (!user) return;
    await fetch(`/api/notifications/${notifId}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'marketplace', label: t.nav.marketplace },
    { id: 'direct-harvest', label: t.nav.directHarvest },
    { id: 'ai-tools', label: t.nav.aiAssistant },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'about', label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#163820]/95 backdrop-blur-md text-white border-b border-emerald-900/60 shadow-lg">
      {/* Offline Status Top Bar */}
      {!isOnline && (
        <div className="bg-amber-600 text-stone-950 text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t.offline.offlineMode} — {t.offline.cachedDataMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <div
            id="nav-brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl md:text-2xl tracking-tight text-emerald-50">
                  AgroDirect
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/30">
                  ₹20 Flat
                </span>
              </div>
              <span className="text-[10px] text-emerald-300/80 block -mt-1 hidden sm:block">
                Farm-to-Market Sovereignty
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition ${
                  currentView === item.id
                    ? 'bg-emerald-800/80 text-emerald-200 shadow-inner'
                    : 'text-stone-300 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice Assistant Mic Button */}
            <button
              id="nav-voice-assistant-btn"
              onClick={onOpenVoice}
              title="Open Multilingual Voice Assistant"
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800/70 hover:bg-emerald-700 text-emerald-200 rounded-xl text-xs font-semibold border border-emerald-600/40 shadow-sm transition active:scale-95"
            >
              <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Voice AI</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="nav-language-dropdown"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-stone-200 rounded-xl text-xs border border-emerald-800/50 transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl py-2 z-50">
                  {(
                    [
                      { code: 'en', name: 'English' },
                      { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
                      { code: 'hi', name: 'हिन्दी (Hindi)' },
                      { code: 'te', name: 'తెలుగు (Telugu)' },
                      { code: 'ta', name: 'தமிழ் (Tamil)' },
                      { code: 'ml', name: 'മലയാളം (Malayalam)' },
                      { code: 'mr', name: 'मराठी (Marathi)' },
                    ] as { code: LanguageCode; name: string }[]
                  ).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition ${
                        language === lang.code
                          ? 'bg-emerald-900/80 text-emerald-300 font-bold'
                          : 'text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-stone-200 rounded-xl border border-emerald-800/50 transition"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#163820]">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="nav-notifications-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-stone-200 rounded-xl border border-emerald-800/50 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#163820] animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-4 z-50 text-stone-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <span className="font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-stone-400">{notifications.length} recent</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto mt-2 space-y-2 text-xs">
                    {notifications.length === 0 ? (
                      <p className="text-stone-500 italic text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotifRead(n.id)}
                          className={`p-2.5 rounded-xl transition cursor-pointer ${
                            n.read
                              ? 'bg-stone-950/40 text-stone-400'
                              : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-100'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold">{n.title}</span>
                            <span className="text-[10px] text-stone-500">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-stone-300 leading-snug">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Portal Menu */}
            <div className="relative flex items-center gap-2">
              {user ? (
                <>
                  {user.role === 'FARMER' && (
                    <button
                      onClick={() => onNavigate('farmer-dashboard')}
                      className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentView === 'farmer-dashboard'
                          ? 'bg-emerald-500 text-stone-950 shadow-sm'
                          : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
                      }`}
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Farmer Portal</span>
                    </button>
                  )}
                  {user.role === 'BUYER' && (
                    <button
                      onClick={() => onNavigate('buyer-dashboard')}
                      className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentView === 'buyer-dashboard'
                          ? 'bg-emerald-500 text-stone-950 shadow-sm'
                          : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buyer Portal</span>
                    </button>
                  )}
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => onNavigate('admin-portal')}
                      className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentView === 'admin-portal'
                          ? 'bg-amber-400 text-stone-950 shadow-sm'
                          : 'bg-amber-900/60 text-amber-200 hover:bg-amber-800'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Portal</span>
                    </button>
                  )}

                  <button
                    id="nav-user-profile-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl text-xs font-semibold"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="hidden md:inline truncate max-w-[110px]">
                      {user.fullName.split(' ')[0]} ({user.role})
                    </span>
                    <ChevronDown className="w-3 h-3 text-emerald-400" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    id="nav-login-btn"
                    onClick={() => onNavigate('login')}
                    className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-xl text-xs font-semibold border border-emerald-600/40 transition"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    id="nav-register-btn"
                    onClick={() => onNavigate('register')}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    <span>Register</span>
                  </button>
                </div>
              )}

              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-stone-800">
                    <p className="font-semibold text-white">{user.fullName}</p>
                    <p className="text-stone-400 text-[11px] truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 font-semibold">
                      Role: {user.role}
                    </span>
                  </div>

                  {user.role === 'FARMER' && (
                    <button
                      onClick={() => {
                        onNavigate('farmer-dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-800 hover:text-white"
                    >
                      {t.nav.farmerPortal}
                    </button>
                  )}

                  {user.role === 'BUYER' && (
                    <button
                      onClick={() => {
                        onNavigate('buyer-dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-800 hover:text-white"
                    >
                      {t.nav.buyerPortal}
                    </button>
                  )}

                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        onNavigate('admin-portal');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-amber-300 hover:bg-stone-800 font-semibold"
                    >
                      {t.nav.adminPortal} (CMS & Revenue)
                    </button>
                  )}

                  <div className="border-t border-stone-800 my-1 pt-1">
                    <span className="px-4 py-1 text-[10px] text-stone-500 uppercase tracking-wider block">
                      Switch Active Persona:
                    </span>
                    <button
                      onClick={() => {
                        switchDemoUser('FARMER');
                        setIsUserMenuOpen(false);
                        onNavigate('farmer-dashboard');
                      }}
                      className="w-full text-left px-4 py-1.5 text-stone-400 hover:bg-stone-800 hover:text-emerald-400"
                    >
                      🌱 Farmer (Ramesh Gowda)
                    </button>
                    <button
                      onClick={() => {
                        switchDemoUser('BUYER');
                        setIsUserMenuOpen(false);
                        onNavigate('buyer-dashboard');
                      }}
                      className="w-full text-left px-4 py-1.5 text-stone-400 hover:bg-stone-800 hover:text-blue-400"
                    >
                      🛒 Buyer (Ananya Sharma)
                    </button>
                    <button
                      onClick={() => {
                        switchDemoUser('ADMIN');
                        setIsUserMenuOpen(false);
                        onNavigate('admin-portal');
                      }}
                      className="w-full text-left px-4 py-1.5 text-stone-400 hover:bg-stone-800 hover:text-amber-400"
                    >
                      👑 Platform Admin
                    </button>
                  </div>

                  <div className="border-t border-stone-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        onNavigate('home');
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-stone-800 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t.nav.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-emerald-900/80 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                  currentView === item.id
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-stone-300 hover:bg-emerald-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user?.role === 'FARMER' && (
              <button
                onClick={() => {
                  onNavigate('farmer-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-300 hover:bg-emerald-900/50"
              >
                {t.nav.farmerPortal}
              </button>
            )}

            {user?.role === 'BUYER' && (
              <button
                onClick={() => {
                  onNavigate('buyer-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-emerald-300 hover:bg-emerald-900/50"
              >
                {t.nav.buyerPortal}
              </button>
            )}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => {
                  onNavigate('admin-portal');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-amber-400 hover:bg-emerald-900/50"
              >
                {t.nav.adminPortal}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
