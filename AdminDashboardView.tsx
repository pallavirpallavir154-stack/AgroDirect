import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  DollarSign,
  Users,
  Settings,
  Edit3,
  CheckCircle,
  FileText,
  Lock,
  Layers,
  Save,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../frontend/context/AuthContext';
import { useTheme } from '../frontend/context/ThemeContext';
import { AuditLog, PlatformFeeConfig, UserProfile } from '../shared/types';

export const AdminDashboardView: React.FC = () => {
  const { user, token } = useAuth();
  const { theme, content, refreshThemeAndContent } = useTheme();

  const [activeTab, setActiveTab] = useState<'profit' | 'cms' | 'fee' | 'verification' | 'audit'>('profit');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [feeConfig, setFeeConfig] = useState<PlatformFeeConfig | null>(null);

  // CMS editable fields
  const [cmsHeroTitle, setCmsHeroTitle] = useState(content.heroTitle);
  const [cmsHeroHighlight, setCmsHeroHighlight] = useState(content.heroHighlightWord);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(content.heroSubtitle);
  const [cmsBanner, setCmsBanner] = useState(content.announcementBannerText);

  // Dynamic fee fields
  const [editFeeAmount, setEditFeeAmount] = useState(20);
  const [editFeePayer, setEditFeePayer] = useState<'BUYER' | 'FARMER' | 'SPLIT_50_50'>('BUYER');

  const isAdmin = user?.role === 'ADMIN';

  const getAdminHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token || ''}`,
    'x-admin-token': token || '',
    'x-admin-email': user?.email || '',
  });

  const fetchAdminData = () => {
    if (!isAdmin) return;

    fetch('/api/admin/dashboard', {
      headers: getAdminHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        setAdminStats(data);
        if (data.feeConfig) {
          setFeeConfig(data.feeConfig);
          setEditFeeAmount(data.feeConfig.feeAmount);
          setEditFeePayer(data.feeConfig.feePayer);
        }
      })
      .catch(() => {});

    fetch('/api/admin/audit-logs', {
      headers: getAdminHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch(() => {});

    fetch('/api/admin/users', {
      headers: getAdminHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUserList(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAdminData();
  }, [user, token]);

  const handleSaveCMS = async () => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          heroTitle: cmsHeroTitle,
          heroHighlightWord: cmsHeroHighlight,
          heroSubtitle: cmsHeroSubtitle,
          announcementBannerText: cmsBanner,
        }),
      });
      if (res.ok) {
        alert('Website CMS content updated successfully!');
        refreshThemeAndContent();
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveFee = async () => {
    try {
      const res = await fetch('/api/admin/fee-config', {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          feeAmount: Number(editFeeAmount),
          feePayer: editFeePayer,
        }),
      });
      if (res.ok) {
        alert(`Platform fee updated to ₹${editFeeAmount} without touching code!`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyFarmer = async (userId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ verificationStatus: status }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-red-50 border border-red-200 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
        <h2 className="text-xl font-bold text-red-900 font-serif">403 Access Denied: Administrator Only</h2>
        <p className="text-xs text-red-700 leading-relaxed">
          Access to this terminal is strictly restricted to verified platform administrators. Your current session does not hold active administrator privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#12281a] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
            <Lock className="w-3.5 h-3.5" />
            Verified Sovereign Administrator Session
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            AgroDirect Command Center & CMS
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Logged in as: <strong className="text-amber-400">{user?.email || 'Platform Administrator'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'profit', label: 'Profit & Revenue', icon: DollarSign },
            { id: 'cms', label: 'Live Website CMS', icon: Edit3 },
            { id: 'fee', label: 'Platform Fee Settings', icon: Settings },
            { id: 'verification', label: 'Farmer KYC', icon: CheckCircle },
            { id: 'audit', label: 'Audit Logs', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. PROFIT & REVENUE TAB */}
      {activeTab === 'profit' && adminStats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Gross Transaction Value (GTV)
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 my-2">
                ₹{adminStats.realRevenue.totalGrossTransactionValue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-stone-500">100% paid directly to farmers</p>
            </div>

            <div className="bg-emerald-950 border border-emerald-800 rounded-3xl p-6 shadow-xs text-white">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                Net AgroDirect Platform Revenue
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-400 my-2">
                ₹{adminStats.realRevenue.netPlatformRevenue.toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-200">
                Calculated strictly from completed ₹{adminStats.realRevenue.currentFlatFee} flat fees
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Completed Contracts
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 my-2">
                {adminStats.realRevenue.completedOrdersCount} Orders
              </div>
              <p className="text-[11px] text-stone-500">{adminStats.realRevenue.pendingOrdersCount} in escrow/fulfillment</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Registered Cultivators & Buyers
              </span>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 my-2">
                {adminStats.counts.farmers} Farmers / {adminStats.counts.buyers} Buyers
              </div>
              <p className="text-[11px] text-stone-500">{adminStats.counts.products} Active Harvest Listings</p>
            </div>
          </div>

          {/* Revenue Breakdown Explainer */}
          <div className="p-6 bg-stone-100 border border-stone-300 rounded-3xl space-y-2 text-xs text-stone-700">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-800" />
              Sovereign Platform Profit Accounting
            </h4>
            <p>
              AgroDirect maintains complete architectural segregation between produce payout and platform maintenance fees.
              Every completed transaction locks a flat <strong>₹{adminStats.realRevenue.currentFlatFee}</strong> platform fee.
              Zero percentage deductions are applied to farmer payouts.
            </p>
          </div>
        </div>
      )}

      {/* 2. LIVE WEBSITE CMS TAB */}
      {activeTab === 'cms' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900">Homepage Dynamic Content CMS</h2>
              <p className="text-xs text-stone-500">Update headline texts and top announcements without redeploying code</p>
            </div>
            <button
              onClick={handleSaveCMS}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Save Live Content
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Top Announcement Banner:</label>
              <input
                type="text"
                value={cmsBanner}
                onChange={(e) => setCmsBanner(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Hero Main Title:</label>
                <input
                  type="text"
                  value={cmsHeroTitle}
                  onChange={(e) => setCmsHeroTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Highlight Word (Italicized Golden):</label>
                <input
                  type="text"
                  value={cmsHeroHighlight}
                  onChange={(e) => setCmsHeroHighlight(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Hero Subtitle:</label>
              <textarea
                value={cmsHeroSubtitle}
                onChange={(e) => setCmsHeroSubtitle(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. PLATFORM FEE SETTINGS TAB */}
      {activeTab === 'fee' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900">Dynamic Platform Fee Manager</h2>
              <p className="text-xs text-stone-500">Modify platform fee without modifying source code</p>
            </div>
            <button
              onClick={handleSaveFee}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Save className="w-4 h-4" />
              Update Fee
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Standard Flat Fee (₹ per completed order):</label>
              <input
                type="number"
                value={editFeeAmount}
                onChange={(e) => setEditFeeAmount(Number(e.target.value))}
                min={0}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl font-bold text-lg text-emerald-900"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Fee Obligation Payer:</label>
              <select
                value={editFeePayer}
                onChange={(e) => setEditFeePayer(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="BUYER">Procuring Entity / Buyer Pays (Default)</option>
                <option value="FARMER">Farmer Pays</option>
                <option value="SPLIT_50_50">Split 50% / 50% between both parties</option>
              </select>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 inline mr-1" />
              <strong>Historical Contract Integrity:</strong> Changes to this setting will apply strictly to new agreements and checkouts. All previously executed digital contracts preserve their original locked-in platform fee.
            </div>
          </div>
        </div>
      )}

      {/* 4. FARMER KYC VERIFICATION TAB */}
      {activeTab === 'verification' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900 mb-2">Farmer KYC & Verification Queue</h2>
          <div className="space-y-3">
            {userList
              .filter((u) => u.role === 'FARMER')
              .map((farmer) => (
                <div
                  key={farmer.id}
                  className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{farmer.fullName}</h4>
                    <p className="text-stone-500">{farmer.email} | {farmer.phone}</p>
                    <p className="text-stone-700 mt-1">
                      Farm: <strong>{farmer.farmName}</strong> ({farmer.farmLocation?.district}, {farmer.farmLocation?.state})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full font-bold ${
                      farmer.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {farmer.verificationStatus}
                    </span>

                    {farmer.verificationStatus !== 'VERIFIED' && (
                      <button
                        onClick={() => handleVerifyFarmer(farmer.id, 'VERIFIED')}
                        className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-semibold shadow-xs"
                      >
                        Approve & Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-stone-900 mb-2">Immutable Admin Action Audit Logs</h2>
          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-emerald-900 uppercase">[{log.action}]</span>
                  <p className="text-stone-800 mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-stone-400">By: {log.adminEmail}</span>
                </div>
                <span className="text-stone-500 font-mono text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
