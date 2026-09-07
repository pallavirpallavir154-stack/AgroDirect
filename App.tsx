import React, { useState } from 'react';
import { AuthProvider, useAuth } from './frontend/context/AuthContext';
import { ThemeProvider } from './frontend/context/ThemeContext';
import { CartProvider } from './frontend/context/CartContext';
import { OfflineProvider } from './frontend/context/OfflineContext';
import { Navbar } from './frontend/components/Navbar';
import { HomeView } from './frontend/views/HomeView';
import { MarketplaceView } from './frontend/views/MarketplaceView';
import { DirectHarvestView } from './frontend/views/DirectHarvestView';
import { AIToolsView } from './frontend/views/AIToolsView';
import { FarmerDashboardView } from './frontend/views/FarmerDashboardView';
import { BuyerDashboardView } from './frontend/views/BuyerDashboardView';
import { HowItWorksView } from './frontend/views/HowItWorksView';
import { AboutView } from './frontend/views/AboutView';
import { LoginView } from './frontend/views/LoginView';
import { AdminLoginView } from './admin/AdminLoginView';
import { AdminDashboardView } from './admin/AdminDashboardView';
import { AccessDeniedView } from './frontend/views/AccessDeniedView';
import { DigitalAgreementModal } from './frontend/components/DigitalAgreementModal';
import { VoiceAssistantModal } from './frontend/components/VoiceAssistantModal';
import { CartDrawer } from './frontend/components/CartDrawer';
import { FarmerBuyerAgreement, Product, UserRole } from './shared/types';
import { Sprout, ShieldCheck, Heart, Sparkles, Lock, ArrowRight } from 'lucide-react';

function MainAppContent() {
  const { user, switchDemoUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);
  const [deniedRoleRequired, setDeniedRoleRequired] = useState<string | undefined>(undefined);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');

  const [activeAgreement, setActiveAgreement] = useState<FarmerBuyerAgreement | null>(null);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [approachProduct, setApproachProduct] = useState<Product | null>(null);

  const getViewTitle = (view: string) => {
    switch (view) {
      case 'marketplace': return 'Produce Marketplace';
      case 'direct-harvest': return 'Pre-Harvest Direct Contracts Pipeline';
      case 'ai-tools': return 'Gemini Agricultural AI Suite';
      case 'farmer-dashboard': return 'Cultivator Command Dashboard';
      case 'buyer-dashboard': return 'Wholesale Buyer Dashboard';
      case 'admin-portal': return 'AgroDirect Admin Console';
      case 'how-it-works': return 'Direct Contracting Guidelines';
      case 'about': return 'AgroDirect Mission & Sovereignty';
      default: return 'AgroDirect Secure Area';
    }
  };

  const handleNavigate = (view: string, customNotice?: string) => {
    // 1. Unauthenticated user can only access 'home', 'login', 'register', and 'admin-login'
    if (view === 'register') {
      setAuthInitialTab('register');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'home' || view === 'login' || view === 'admin-login') {
      if (view === 'login') setAuthInitialTab('login');
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. If unauthenticated, intercept and route to Login with target and notice
    if (!user) {
      setRedirectTarget(view);
      setRedirectNotice(
        customNotice ||
          `Please sign in or create an account to access ${getViewTitle(view)}.`
      );
      if (view === 'admin-portal') {
        setCurrentView('admin-login');
      } else {
        setAuthInitialTab('login');
        setCurrentView('login');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Authenticated Role Guarding
    if (view === 'farmer-dashboard' && user.role !== 'FARMER' && user.role !== 'ADMIN') {
      setDeniedRoleRequired('Cultivator / Farmer');
      setCurrentView('access-denied');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'buyer-dashboard' && user.role !== 'BUYER' && user.role !== 'ADMIN') {
      setDeniedRoleRequired('Wholesale Buyer / Institution');
      setCurrentView('access-denied');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'admin-portal' && user.role !== 'ADMIN') {
      setDeniedRoleRequired('Verified Platform Administrator');
      setCurrentView('access-denied');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Allow navigation
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (loggedInRole?: UserRole) => {
    const role = loggedInRole || user?.role;
    const target = redirectTarget;
    setRedirectTarget(null);
    setRedirectNotice(null);

    if (role === 'ADMIN') {
      setCurrentView('admin-portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (target) {
      if (target === 'farmer-dashboard') {
        if (role === 'FARMER') setCurrentView('farmer-dashboard');
        else setCurrentView('buyer-dashboard');
        return;
      }
      if (target === 'buyer-dashboard') {
        if (role === 'BUYER') setCurrentView('buyer-dashboard');
        else setCurrentView('farmer-dashboard');
        return;
      }
      if (target === 'admin-portal') {
        if (role === 'ADMIN') setCurrentView('admin-portal');
        else {
          setDeniedRoleRequired('Platform Administrator');
          setCurrentView('access-denied');
        }
        return;
      }
      // General protected view
      setCurrentView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default landings
    if (role === 'FARMER') {
      setCurrentView('farmer-dashboard');
    } else {
      setCurrentView('buyer-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAgreement = (agreement: FarmerBuyerAgreement) => {
    if (!user) {
      handleNavigate('direct-harvest', 'Sign in to review and sign legally binding digital agreements.');
      return;
    }
    setActiveAgreement(agreement);
    setIsAgreementModalOpen(true);
  };

  const handleApproachProduct = (product: Product) => {
    if (!user) {
      handleNavigate('direct-harvest', `Sign in to approach farmer for ${product.name}.`);
      return;
    }
    setApproachProduct(product);
    setCurrentView('direct-harvest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderId: string) => {
    alert(`Order #${orderId} placed successfully! Check your dashboard for live delivery tracking.`);
    if (user?.role === 'BUYER') {
      setCurrentView('buyer-dashboard');
    } else {
      setCurrentView('marketplace');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf8f5]">
      {/* Top Header Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
      />

      {/* Main View Switcher with Strict Route Protection */}
      <main className="flex-1">
        {/* PUBLIC ROUTE */}
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectProductForApproach={handleApproachProduct}
          />
        )}

        {/* AUTHENTICATION VIEWS */}
        {currentView === 'login' && (
          <LoginView
            onSuccess={handleLoginSuccess}
            redirectNotice={redirectNotice}
            initialTab={authInitialTab}
            onNavigateToAdmin={() => setCurrentView('admin-login')}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLoginView
            onSuccess={() => handleLoginSuccess('ADMIN')}
            onNavigateToUserLogin={() => setCurrentView('login')}
          />
        )}

        {/* ACCESS DENIED 403 VIEW */}
        {currentView === 'access-denied' && (
          <AccessDeniedView
            requiredRole={deniedRoleRequired}
            onNavigateHome={() => setCurrentView('home')}
            onNavigateLogin={() => {
              setAuthInitialTab('login');
              setCurrentView('login');
            }}
          />
        )}

        {/* PROTECTED ROUTES (Requires user session) */}
        {currentView === 'marketplace' && user && (
          <MarketplaceView onApproachFarmer={handleApproachProduct} />
        )}

        {currentView === 'direct-harvest' && user && (
          <DirectHarvestView
            onOpenAgreement={handleOpenAgreement}
            preSelectedProduct={approachProduct}
          />
        )}

        {currentView === 'ai-tools' && user && <AIToolsView />}

        {currentView === 'how-it-works' && user && <HowItWorksView />}

        {currentView === 'about' && user && <AboutView />}

        {/* ROLE-RESTRICTED FARMER VIEW */}
        {currentView === 'farmer-dashboard' && user && (user.role === 'FARMER' || user.role === 'ADMIN') && (
          <FarmerDashboardView onOpenAgreement={handleOpenAgreement} />
        )}

        {/* ROLE-RESTRICTED BUYER VIEW */}
        {currentView === 'buyer-dashboard' && user && (user.role === 'BUYER' || user.role === 'ADMIN') && (
          <BuyerDashboardView
            onOpenAgreement={handleOpenAgreement}
            onNavigateMarketplace={() => handleNavigate('marketplace')}
          />
        )}

        {/* ROLE-RESTRICTED ADMIN VIEW */}
        {currentView === 'admin-portal' && user && user.role === 'ADMIN' && (
          <AdminDashboardView />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <DigitalAgreementModal
        agreement={activeAgreement}
        isOpen={isAgreementModalOpen}
        onClose={() => setIsAgreementModalOpen(false)}
        onAgreementSigned={(updated) => {
          setActiveAgreement(updated);
          alert('Agreement signed successfully!');
        }}
      />

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigate={(view) => {
          handleNavigate(view);
        }}
      />

      <CartDrawer onOrderSuccess={handleOrderSuccess} />

      {/* Footer */}
      <footer className="bg-[#12281a] text-stone-300 border-t border-emerald-900/60 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-lg text-white">AgroDirect</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              India's direct agricultural marketplace connecting farmers and buyers with AI price forecasting, pre-harvest negotiation, and transparent ₹20 digital agreements.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 border border-emerald-800/80 rounded-full text-emerald-300 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Flat ₹20 Platform Fee Guarantee
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Marketplace & Tools</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => handleNavigate('marketplace')} className="hover:text-emerald-300">
                  Ready-to-Ship Harvests
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('direct-harvest')} className="hover:text-emerald-300">
                  Upcoming Harvest Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('ai-tools')} className="hover:text-emerald-300">
                  AI Crop Recommender
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('ai-tools')} className="hover:text-emerald-300">
                  APMC Mandi Price Forecaster
                </button>
              </li>
              <li>
                <button onClick={() => setIsVoiceModalOpen(true)} className="hover:text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Multilingual Voice AI
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Transparency & Trust</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => handleNavigate('how-it-works')} className="hover:text-emerald-300">
                  How Direct Contracting Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('about')} className="hover:text-emerald-300">
                  Our Mission & Values
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('how-it-works')} className="hover:text-emerald-300">
                  Escrow & Dispute Arbitration
                </button>
              </li>
              <li>
                <span className="text-stone-500">Legal: Indian Contract Act 1872 compliant</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Role & Access Switcher</h4>
            <p className="text-[11px] text-stone-400">Test authentication & role authorization workflows:</p>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  switchDemoUser('FARMER');
                  handleNavigate('farmer-dashboard');
                }}
                className="w-full text-left p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 text-[11px] font-semibold flex items-center justify-between"
              >
                <span>🌱 Sign In as Farmer (Ramesh)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  switchDemoUser('BUYER');
                  handleNavigate('buyer-dashboard');
                }}
                className="w-full text-left p-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-200 text-[11px] font-semibold flex items-center justify-between"
              >
                <span>🛒 Sign In as Buyer (Ananya)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  switchDemoUser('ADMIN');
                  handleNavigate('admin-portal');
                }}
                className="w-full text-left p-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-200 text-[11px] font-semibold flex items-center justify-between"
              >
                <span>👑 Sign In as Platform Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                  }}
                  className="w-full text-center p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-red-400 text-[11px] font-bold border border-stone-800"
                >
                  Log Out Current User
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <p>© 2026 AgroDirect. Dedicated to sovereign Indian agriculture.</p>
          <div className="flex items-center gap-4">
            <span>Server: Node.js Express + TS</span>
            <span>Security: Zero-Trust RBAC</span>
            <span>Platform Fee: ₹20</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <OfflineProvider>
            <MainAppContent />
          </OfflineProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
