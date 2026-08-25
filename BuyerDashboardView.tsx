import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Send,
  FileCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order, HarvestRequest, FarmerBuyerAgreement } from '../../shared/types';
import { TRANSLATIONS } from '../../shared/i18n';

interface BuyerDashboardViewProps {
  onOpenAgreement: (agreement: FarmerBuyerAgreement) => void;
  onNavigateMarketplace: () => void;
}

export const BuyerDashboardView: React.FC<BuyerDashboardViewProps> = ({
  onOpenAgreement,
  onNavigateMarketplace,
}) => {
  const { user, language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'orders' | 'proposals' | 'agreements'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [proposals, setProposals] = useState<HarvestRequest[]>([]);
  const [agreements, setAgreements] = useState<FarmerBuyerAgreement[]>([]);

  const fetchBuyerData = () => {
    if (!user) return;

    fetch(`/api/orders?userId=${user.id}&role=BUYER`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {});

    fetch(`/api/harvests/requests/me?userId=${user.id}&role=BUYER`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProposals(data);
      })
      .catch(() => {});

    fetch(`/api/agreements?userId=${user.id}&role=BUYER`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAgreements(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchBuyerData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Buyer Header */}
      <div className="bg-[#1a4329] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-stone-950 font-serif font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.fullName?.charAt(0) || 'B'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold">{user?.fullName || 'Buyer Portal'}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-700/50">
                {user?.buyerType || 'Bulk Retailer'}
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              Business: {user?.businessName || 'Fresh Farm Hub'} | Direct Procurement Ledger
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateMarketplace}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-2xl text-xs font-bold shadow-md transition active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          Explore Fresh Produce
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        {[
          { id: 'orders', label: `My Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'proposals', label: `Harvest Proposals (${proposals.length})`, icon: Send },
          { id: 'agreements', label: `Contracts & Agreements (${agreements.length})`, icon: FileCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center text-stone-500">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-400 mb-3 opacity-60" />
              <h3 className="font-serif font-bold text-stone-800 text-lg">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500 mt-1">Browse the marketplace and purchase directly from verified farmers.</p>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase block">Order #{o.id}</span>
                    <p className="text-stone-500 text-[11px]">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold">
                    {o.orderStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  {o.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-stone-800">
                      <span>{item.productName} ({item.quantity} {item.unit}) × ₹{item.pricePerUnit}</span>
                      <span className="font-semibold">₹{item.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-3 flex flex-wrap justify-between items-center text-stone-700 bg-stone-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>AgroDirect Flat Platform Fee: <strong>₹{o.platformFee.toFixed(2)}</strong></span>
                  </div>
                  <span className="font-bold text-emerald-900 font-serif text-base">
                    Total Settled: ₹{o.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* AGREEMENTS TAB */}
      {activeTab === 'agreements' && (
        <div className="space-y-4">
          {agreements.map((a) => (
            <div key={a.id} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-emerald-800 uppercase block">Agreement Ref: {a.id}</span>
                <h3 className="font-bold text-stone-900 text-base mt-0.5">{a.productName}</h3>
                <p className="text-stone-600">Farmer: {a.farmerName} | Harvest Date: {a.harvestDate}</p>
                <p className="text-emerald-900 font-serif font-bold text-sm mt-1">
                  Settlement: ₹{a.totalPayableAmount.toLocaleString('en-IN')} (AgroDirect Fee: ₹{a.platformFeeApplied})
                </p>
              </div>

              <button
                onClick={() => onOpenAgreement(a)}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-semibold shadow-xs"
              >
                View Agreement & Signatures
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
