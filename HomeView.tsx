import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  Truck,
  Sparkles,
  MapPin,
  CheckCircle2,
  Users,
  ChevronRight,
  Leaf,
  Layers
} from 'lucide-react';
import { FarmHero3D } from '../components/FarmHero3D';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { TRANSLATIONS } from '../../shared/i18n';
import { Product, HarvestListing } from '../../shared/types';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onSelectProductForApproach?: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectProductForApproach,
}) => {
  const { user, language } = useAuth();
  const { content, theme } = useTheme();
  const { addToCart } = useCart();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [upcomingHarvests, setUpcomingHarvests] = useState<HarvestListing[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setFeaturedProducts(data.products.slice(0, 4));
      })
      .catch(() => {});

    fetch('/api/harvests')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUpcomingHarvests(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const handleBuyDirect = (product: Product) => {
    if (!user) {
      onNavigate('marketplace'); // Trigger login guard with marketplace redirect
      return;
    }
    if (user.role === 'FARMER') {
      alert('You are currently signed in as a Farmer. Only registered Buyers can add items to cart and checkout.');
      return;
    }
    addToCart(product, product.minimumOrderQuantity || 1);
  };

  const handleApproachDeal = (product?: Product) => {
    if (!user) {
      onNavigate('direct-harvest'); // Trigger login guard with direct-harvest redirect
      return;
    }
    if (onSelectProductForApproach && product) {
      onSelectProductForApproach(product);
    } else {
      onNavigate('direct-harvest');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION WITH 3D CANVAS & HIGH-CONTRAST TYPOGRAPHY */}
      <section className="relative bg-gradient-to-b from-[#132d1c] via-[#1a4329] to-[#0f2416] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[2.5rem] shadow-2xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 z-10">
            {/* Top Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs text-emerald-200 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-semibold text-amber-300">
                {content.announcementBannerText || 'Direct Trade Without Middlemen'}
              </span>
              <span className="text-stone-400">|</span>
              <span>₹20 Flat Platform Fee</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-emerald-50 leading-[1.1]">
              {content.heroTitle || 'Direct Farm-to-Market Platform for'}{' '}
              <span className="text-amber-400 italic">
                {content.heroHighlightWord || 'Indian Farmers'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              {content.heroSubtitle ||
                'Empowering cultivators and buyers with AI-driven crop forecasting, direct harvest pre-agreements, and legally binding transparent digital contracts.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-marketplace-btn"
                onClick={() => onNavigate('marketplace')}
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950/50 transition active:scale-95"
              >
                <span>{content.heroCtaPrimaryText || t.hero?.browseBtn || 'Explore Marketplace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-list-harvest-btn"
                onClick={() => onNavigate('direct-harvest')}
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 rounded-2xl font-semibold text-sm transition active:scale-95"
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>{content.heroCtaSecondaryText || t.hero?.sellBtn || 'List Upcoming Harvest'}</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-emerald-800/50 text-xs">
              <div>
                <span className="font-bold text-base text-amber-300 block font-serif">₹20</span>
                <span className="text-emerald-200/80">Flat Platform Fee</span>
              </div>
              <div>
                <span className="font-bold text-base text-emerald-300 block font-serif">100%</span>
                <span className="text-emerald-200/80">Farm-Gate Direct</span>
              </div>
              <div>
                <span className="font-bold text-base text-emerald-300 block font-serif">7 Indian</span>
                <span className="text-emerald-200/80">Languages Supported</span>
              </div>
            </div>
          </div>

          {/* Right 3D Visualizer Column */}
          <div className="lg:col-span-6 z-10">
            {theme.enable3dHero !== false ? (
              <div className="relative">
                <FarmHero3D />
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md border border-emerald-500/20 p-3 rounded-2xl flex items-center justify-between text-xs text-stone-200">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>Real-time AgroDirect Bio-Engine Simulation</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">Live 3D View</span>
                </div>
              </div>
            ) : (
              <div className="h-80 rounded-3xl overflow-hidden shadow-2xl border border-emerald-700/50">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
                  alt="Lush Indian Farm"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. THE 4-STAGE FARM-TO-MARKET JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
            End-to-End Agronomy to Market Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            How AgroDirect Connects Farmers & Buyers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'AI Crop Selection',
              desc: 'Farmers utilize regional soil, rainfall, and APMC price forecasts to sow the most profitable seasonal crops.',
              icon: Sparkles,
              color: 'text-amber-700',
              bg: 'bg-amber-50 border-amber-200',
            },
            {
              step: '02',
              title: 'Pre-Harvest Pipeline',
              desc: 'Farmers list upcoming harvest yield weeks before cutting. Buyers negotiate quantity and lock forward prices.',
              icon: Sprout,
              color: 'text-emerald-700',
              bg: 'bg-emerald-50 border-emerald-200',
            },
            {
              step: '03',
              title: '₹20 Digital Agreement',
              desc: 'Both parties digitally sign legally compliant agreements with escrow protection and a flat ₹20 fee.',
              icon: FileCheck,
              color: 'text-blue-700',
              bg: 'bg-blue-50 border-blue-200',
            },
            {
              step: '04',
              title: 'Direct Farm-Gate Pickup',
              desc: 'Produce is dispatched directly from farm to buyer premises, eliminating APMC distress and unfair commissions.',
              icon: Truck,
              color: 'text-purple-700',
              bg: 'bg-purple-50 border-purple-200',
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-6 rounded-3xl border ${item.bg} flex flex-col justify-between shadow-xs transition hover:shadow-md`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-stone-400">STAGE {item.step}</span>
                  <div className={`p-2.5 rounded-2xl bg-white shadow-xs ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">{item.step}. {item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LIVE MARKETPLACE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Fresh Direct From Verified Cultivators
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Ready-to-Ship Harvests
            </h2>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition"
          >
            <span>View All Produce</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 backdrop-blur-xs">
                    {p.farmingType}
                  </span>
                  {p.farmerVerification === 'VERIFIED' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Farmer
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="capitalize">{p.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" /> {p.district}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition">
                    {p.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    Farmer: <span className="font-semibold text-stone-800">{p.farmerName}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Direct Farm Rate</span>
                    <span className="text-lg font-serif font-bold text-emerald-900">
                      ₹{p.pricePerUnit}
                      <span className="text-xs text-stone-600 font-sans font-normal">/{p.unit}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleBuyDirect(p)}
                    className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
                  >
                    Buy Direct
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UPCOMING HARVEST PIPELINE TEASER */}
      <section className="bg-stone-100 py-12 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full mb-1">
                <Sprout className="w-3.5 h-3.5" />
                Pre-Harvest Direct Contracts
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Upcoming Harvest Pipeline
              </h2>
            </div>
            <button
              onClick={() => onNavigate('direct-harvest')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition"
            >
              <span>Explore All Pre-Harvest Listings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingHarvests.map((h) => (
              <div
                key={h.id}
                className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase">
                        Expected: {h.expectedHarvestDate}
                      </span>
                      <h3 className="text-lg font-bold text-stone-900 mt-0.5">{h.cropName}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold">
                      {h.farmingType}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-4">{h.description}</p>

                  <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                    <div className="flex justify-between">
                      <span>Cultivator:</span>
                      <span className="font-semibold text-stone-900">{h.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Yield:</span>
                      <span className="font-semibold text-stone-900">{h.expectedYield} {h.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Indicative Price:</span>
                      <span className="font-semibold text-emerald-900">₹{h.estimatedPricePerUnit}/{h.unit}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleApproachDeal()}
                  className="mt-6 w-full py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition"
                >
                  Approach Farmer & Offer Deal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENT ₹20 PLATFORM FEE MANIFESTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1b432a] to-[#0f2919] text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-4 h-4" />
              Sovereign Fee Transparency Guarantee
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
              Why We Charge Only ₹20 Per Transaction
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Traditional Mandi commission agents and middlemen deduct anywhere between 8% to 18% from farmer payouts.
              AgroDirect operates on a strict flat ₹20 platform maintenance fee per completed contract, regardless of order value.
              100% of the produce value goes straight into the farmer's bank account.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Zero percentage commissions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Transparent legal escrow text</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>No hidden brokerage fees</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center text-white">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-widest block">Flat Standard Fee</span>
            <div className="text-5xl font-serif font-bold my-2 text-amber-400">₹20</div>
            <p className="text-xs text-emerald-200 leading-snug">
              Guaranteed escrow arbitration, verified digital legal agreement, and direct farm contact.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
