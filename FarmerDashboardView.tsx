import React, { useState, useEffect } from 'react';
import {
  Sprout,
  PlusCircle,
  Package,
  FileCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  X,
  AlertCircle,
  ShoppingBag,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, HarvestListing, HarvestRequest, FarmerBuyerAgreement, Order } from '../../shared/types';
import { TRANSLATIONS } from '../../shared/i18n';
import { INDIAN_STATES } from '../../shared/constants';

interface FarmerDashboardViewProps {
  onOpenAgreement: (agreement: FarmerBuyerAgreement) => void;
}

export const FarmerDashboardView: React.FC<FarmerDashboardViewProps> = ({ onOpenAgreement }) => {
  const { user, language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'products' | 'harvests' | 'requests' | 'agreements' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [harvests, setHarvests] = useState<HarvestListing[]>([]);
  const [requests, setRequests] = useState<HarvestRequest[]>([]);
  const [agreements, setAgreements] = useState<FarmerBuyerAgreement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('Fresh Organic Tomato');
  const [newProdCat, setNewProdCat] = useState('vegetables');
  const [newProdVariety, setNewProdVariety] = useState('Vaishnavi F1');
  const [newProdQty, setNewProdQty] = useState(500);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdPrice, setNewProdPrice] = useState(28);
  const [newProdMinOrder, setNewProdMinOrder] = useState(25);
  const [newProdFarming, setNewProdFarming] = useState('ORGANIC');
  const [newProdDesc, setNewProdDesc] = useState('Directly harvested farm-fresh produce with rich nutrient profile.');

  // Harvest modal state
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(false);
  const [newHName, setNewHName] = useState('Pomegranate (Bhagwa)');
  const [newHCat, setNewHCat] = useState('fruits');
  const [newHYield, setNewHYield] = useState(2000);
  const [newHUnit, setNewHUnit] = useState('kg');
  const [newHPrice, setNewHPrice] = useState(85);
  const [newHDate, setNewHDate] = useState('2026-10-15');
  const [newHPledge, setNewHPledge] = useState(100);

  const fetchFarmerData = () => {
    if (!user) return;

    fetch(`/api/products?farmerId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});

    fetch('/api/harvests')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHarvests(data.filter((h) => h.farmerId === user.id));
      })
      .catch(() => {});

    fetch(`/api/harvests/requests/me?userId=${user.id}&role=FARMER`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
      })
      .catch(() => {});

    fetch(`/api/agreements?userId=${user.id}&role=FARMER`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAgreements(data);
      })
      .catch(() => {});

    fetch(`/api/orders?userId=${user.id}&role=FARMER`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchFarmerData();
  }, [user]);

  const handleCreateProduct = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user.id,
          name: newProdName,
          category: newProdCat,
          variety: newProdVariety,
          description: newProdDesc,
          quantityAvailable: Number(newProdQty),
          unit: newProdUnit,
          pricePerUnit: Number(newProdPrice),
          minimumOrderQuantity: Number(newProdMinOrder),
          farmingType: newProdFarming,
          district: user.farmLocation?.district || 'Bangalore Rural',
          state: user.farmLocation?.state || 'Karnataka',
        }),
      });

      if (res.ok) {
        setIsAddProductOpen(false);
        fetchFarmerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateHarvest = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/harvests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: user.id,
          cropName: newHName,
          category: newHCat,
          expectedYield: Number(newHYield),
          unit: newHUnit,
          estimatedPricePerUnit: Number(newHPrice),
          expectedHarvestDate: newHDate,
          minimumPledgeQuantity: Number(newHPledge),
          district: user.farmLocation?.district || 'Bangalore Rural',
          state: user.farmLocation?.state || 'Karnataka',
          farmingType: 'ORGANIC',
        }),
      });

      if (res.ok) {
        setIsAddHarvestOpen(false);
        fetchFarmerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchFarmerData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Farmer Profile Card */}
      <div className="bg-[#1a4329] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-stone-950 font-serif font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.fullName?.charAt(0) || 'F'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold">{user?.fullName || 'Farmer Portal'}</h1>
              {user?.verificationStatus === 'VERIFIED' ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Cultivator
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {user?.farmName || 'Kaveri Organic Farm'}, {user?.farmLocation?.district || 'Bangalore Rural'}, {user?.farmLocation?.state || 'Karnataka'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            id="farmer-add-product-btn"
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-2xl text-xs font-bold shadow-md transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            List Harvested Produce
          </button>
          <button
            id="farmer-add-harvest-btn"
            onClick={() => setIsAddHarvestOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/50 rounded-2xl text-xs font-semibold transition active:scale-95"
          >
            <Sprout className="w-4 h-4 text-emerald-400" />
            Publish Pre-Harvest
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {[
          { id: 'products', label: `My Products (${products.length})`, icon: Package },
          { id: 'harvests', label: `Pre-Harvest Pipeline (${harvests.length})`, icon: Sprout },
          { id: 'requests', label: `Buyer Proposals (${requests.length})`, icon: Send },
          { id: 'agreements', label: `Signed Contracts (${agreements.length})`, icon: FileCheck },
          { id: 'orders', label: `Orders to Fulfill (${orders.length})`, icon: Truck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
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

      {/* TAB CONTENT: MY PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-3">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-36 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-stone-900 text-base">{p.name}</h3>
                  <p className="text-xs text-stone-500">{p.variety}</p>
                </div>
                <div className="flex justify-between text-xs border-t border-stone-100 pt-2 text-stone-700">
                  <span>Stock: <strong>{p.quantityAvailable} {p.unit}</strong></span>
                  <span className="font-bold text-emerald-900 text-sm">₹{p.pricePerUnit}/{p.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-stone-500 italic py-8 text-center">No orders received yet.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-emerald-800">Order #{o.id}</span>
                  <p className="text-stone-800 font-semibold mt-1">Buyer: {o.buyerName} ({o.buyerPhone})</p>
                  <p className="text-stone-500">Destination: {o.shippingAddress?.street}, {o.shippingAddress?.city}</p>
                  <span className="text-stone-900 font-bold font-serif text-sm block mt-1">
                    Value: ₹{o.productSubtotal.toLocaleString('en-IN')} (Flat ₹20 fee accounted)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold">
                    {o.orderStatus}
                  </span>
                  {o.orderStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => updateOrderStatus(o.id, 'DISPATCHED')}
                      className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl font-semibold"
                    >
                      Mark Dispatched
                    </button>
                  )}
                  {o.orderStatus === 'DISPATCHED' && (
                    <button
                      onClick={() => updateOrderStatus(o.id, 'DELIVERED')}
                      className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl font-semibold"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: AGREEMENTS */}
      {activeTab === 'agreements' && (
        <div className="space-y-4">
          {agreements.map((a) => (
            <div key={a.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-emerald-800 uppercase block">Contract: {a.id}</span>
                <h4 className="text-stone-900 font-bold text-sm mt-0.5">{a.productName} ({a.quantity} {a.unit})</h4>
                <p className="text-stone-600">Buyer: {a.buyerName} | Rate: ₹{a.agreedPricePerUnit}/{a.unit}</p>
                <p className="text-emerald-900 font-bold font-serif text-sm mt-1">
                  Settlement: ₹{a.totalPayableAmount.toLocaleString('en-IN')} (AgroDirect Fee: ₹{a.platformFeeApplied})
                </p>
              </div>

              <button
                onClick={() => onOpenAgreement(a)}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-semibold shadow-xs"
              >
                View & Sign Agreement
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-300 rounded-3xl w-full max-w-lg p-6 text-stone-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg">List Ready Produce</h3>
              <button onClick={() => setIsAddProductOpen(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Produce Name:</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category:</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains & Cereals</option>
                    <option value="pulses">Pulses</option>
                    <option value="fruits">Fruits</option>
                    <option value="spices">Spices</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Variety / Seed:</label>
                  <input
                    type="text"
                    value={newProdVariety}
                    onChange={(e) => setNewProdVariety(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Available Qty:</label>
                  <input
                    type="number"
                    value={newProdQty}
                    onChange={(e) => setNewProdQty(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Unit:</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="crates">crates</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Price (₹/unit):</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Farming Method:</label>
                <select
                  value={newProdFarming}
                  onChange={(e) => setNewProdFarming(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                >
                  <option value="ORGANIC">Certified Organic</option>
                  <option value="NATURAL_FARMING">Natural / Zero Budget</option>
                  <option value="CONVENTIONAL">Conventional</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description:</label>
                <textarea
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="submit-product-listing-btn"
                onClick={handleCreateProduct}
                className="px-6 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Publish Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
