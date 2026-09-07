import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Send,
  Calendar,
  MapPin,
  TrendingUp,
  FileCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
  MessageSquare
} from 'lucide-react';
import { HarvestListing, HarvestRequest, FarmerBuyerAgreement, Product } from '../../shared/types';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../../shared/i18n';

interface DirectHarvestViewProps {
  onOpenAgreement: (agreement: FarmerBuyerAgreement) => void;
  preSelectedProduct?: Product | null;
}

export const DirectHarvestView: React.FC<DirectHarvestViewProps> = ({
  onOpenAgreement,
  preSelectedProduct,
}) => {
  const { user, language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [harvestListings, setHarvestListings] = useState<HarvestListing[]>([]);
  const [myRequests, setMyRequests] = useState<HarvestRequest[]>([]);
  const [selectedListing, setSelectedListing] = useState<HarvestListing | null>(null);
  const [isApproachModalOpen, setIsApproachModalOpen] = useState(false);
  const [isNegotiating, setIsNegotiating] = useState(false);

  // Approach form state
  const [requestedQuantity, setRequestedQuantity] = useState<number>(100);
  const [offeredPrice, setOfferedPrice] = useState<number>(30);
  const [preferredDate, setPreferredDate] = useState<string>('2026-09-15');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Buyer Hub, Bangalore');
  const [proposalMessage, setProposalMessage] = useState<string>('Direct bulk purchase with quality grade A inspection.');

  // Counter proposal state
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [activeNegotiatingRequestId, setActiveNegotiatingRequestId] = useState<string | null>(null);

  const fetchData = () => {
    fetch('/api/harvests')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHarvestListings(data);
      })
      .catch(() => {});

    if (user) {
      fetch(`/api/harvests/requests/me?userId=${user.id}&role=${user.role}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setMyRequests(data);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (preSelectedProduct) {
      // Auto open approach modal for product
      setSelectedListing({
        id: `virtual-${preSelectedProduct.id}`,
        farmerId: preSelectedProduct.farmerId,
        farmerName: preSelectedProduct.farmerName,
        farmerPhone: '+91 98450 12345',
        cropName: preSelectedProduct.name,
        category: preSelectedProduct.category,
        expectedYield: preSelectedProduct.quantityAvailable,
        unit: preSelectedProduct.unit,
        estimatedPricePerUnit: preSelectedProduct.pricePerUnit,
        expectedHarvestDate: preSelectedProduct.harvestDate || '2026-09-15',
        farmLocation: preSelectedProduct.location,
        district: preSelectedProduct.district,
        state: preSelectedProduct.state,
        farmingType: preSelectedProduct.farmingType,
        status: 'UPCOMING',
        images: preSelectedProduct.images,
        minimumPledgeQuantity: preSelectedProduct.minimumOrderQuantity,
        description: preSelectedProduct.description,
        createdAt: new Date().toISOString(),
      });
      setOfferedPrice(preSelectedProduct.pricePerUnit);
      setRequestedQuantity(preSelectedProduct.minimumOrderQuantity || 50);
      setIsApproachModalOpen(true);
    }
  }, [preSelectedProduct]);

  const handleOpenApproach = (listing: HarvestListing) => {
    setSelectedListing(listing);
    setOfferedPrice(listing.estimatedPricePerUnit);
    setRequestedQuantity(listing.minimumPledgeQuantity || 50);
    setPreferredDate(listing.expectedHarvestDate);
    setIsApproachModalOpen(true);
  };

  const submitApproach = async () => {
    if (!user) {
      alert('Please log in to approach farmers and initiate direct forward agreements.');
      return;
    }
    if (!selectedListing) return;

    try {
      const res = await fetch('/api/harvests/approach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          harvestListingId: selectedListing.id,
          farmerId: selectedListing.farmerId,
          buyerId: user.id,
          cropName: selectedListing.cropName,
          requestedQuantity: Number(requestedQuantity),
          unit: selectedListing.unit,
          offeredPricePerUnit: Number(offeredPrice),
          preferredDeliveryDate: preferredDate,
          deliveryLocation,
          message: proposalMessage,
        }),
      });

      if (res.ok) {
        setIsApproachModalOpen(false);
        fetchData();
        alert('Your harvest proposal has been transmitted directly to the farmer. You can track counter-offers below.');
      }
    } catch (e) {
      console.error('Submit approach failed', e);
    }
  };

  const submitCounterOffer = async (request: HarvestRequest) => {
    if (!user || counterPrice <= 0) return;
    try {
      const res = await fetch('/api/harvests/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          senderId: user.id,
          senderRole: user.role,
          counterPricePerUnit: Number(counterPrice),
          message: `Counter-proposal: ₹${counterPrice}/${request.unit}`,
        }),
      });

      if (res.ok) {
        setActiveNegotiatingRequestId(null);
        setCounterPrice(0);
        fetchData();
      }
    } catch (e) {
      console.error('Counter offer failed', e);
    }
  };

  const generateAgreementFromRequest = async (request: HarvestRequest) => {
    try {
      const res = await fetch('/api/agreements/create-from-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          deliveryMethod: 'DIRECT_TRANSPORT',
          pickupOrDeliveryAddress: request.deliveryLocation,
        }),
      });

      if (res.ok) {
        const agreement = await res.json();
        onOpenAgreement(agreement);
        fetchData();
      }
    } catch (e) {
      console.error('Agreement generation failed', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#1a4329] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
            <Sprout className="w-3.5 h-3.5" />
            Direct Pre-Harvest Forward Contracts
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Direct Harvest Negotiation Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-2 max-w-xl">
            Book upcoming crop yields before harvest. Negotiate volume and fair price directly with verified cultivators, locked with digital agreements and ₹20 flat fee.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs text-white">
          <div className="font-bold text-amber-400 mb-1">How Direct Negotiation Works</div>
          <ol className="list-decimal list-inside space-y-1 text-emerald-100">
            <li>Select an upcoming crop listing</li>
            <li>Submit your price & volume offer</li>
            <li>Negotiate counter-proposals</li>
            <li>Lock agreement with ₹20 fee</li>
          </ol>
        </div>
      </div>

      {/* ACTIVE USER NEGOTIATIONS THREADS (If logged in) */}
      {user && myRequests.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                  My Active Harvest Negotiations ({myRequests.length})
                </h2>
                <p className="text-xs text-stone-500">Live proposal counter-offers and agreement readiness</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {myRequests.map((req) => {
              const isMyTurnToCounter =
                (user.role === 'FARMER' && req.negotiationHistory[req.negotiationHistory.length - 1]?.senderRole === 'BUYER') ||
                (user.role === 'BUYER' && req.negotiationHistory[req.negotiationHistory.length - 1]?.senderRole === 'FARMER');

              return (
                <div
                  key={req.id}
                  className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4 hover:border-emerald-700/50 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase block">
                        Crop: {req.cropName}
                      </span>
                      <h3 className="font-semibold text-stone-900 text-sm">
                        {user.role === 'FARMER' ? `Buyer: ${req.buyerName}` : `Farmer: ${req.farmerName}`}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        req.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : req.status === 'COUNTERED'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        Status: {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Proposal details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500 block">Requested Volume:</span>
                      <span className="font-semibold text-stone-900">{req.requestedQuantity} {req.unit}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Current Offered Rate:</span>
                      <span className="font-semibold text-emerald-900 text-sm">₹{req.offeredPricePerUnit}/{req.unit}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Delivery Date:</span>
                      <span className="font-semibold text-stone-900">{req.preferredDeliveryDate}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Estimated Value:</span>
                      <span className="font-semibold text-stone-900 font-serif">
                        ₹{(req.requestedQuantity * req.offeredPricePerUnit).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Negotiation Timeline log */}
                  <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-stone-600 block text-[11px] uppercase">Negotiation History:</span>
                    {req.negotiationHistory.map((h, idx) => (
                      <div key={idx} className="flex justify-between items-center text-stone-700 text-[11px]">
                        <span>
                          <strong className={h.senderRole === 'FARMER' ? 'text-emerald-800' : 'text-blue-800'}>
                            {h.senderRole}:
                          </strong>{' '}
                          {h.message} (₹{h.pricePerUnit}/{req.unit})
                        </span>
                        <span className="text-stone-400">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {activeNegotiatingRequestId === req.id ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="number"
                          value={counterPrice || ''}
                          onChange={(e) => setCounterPrice(Number(e.target.value))}
                          placeholder="Your counter price ₹/unit"
                          className="p-2 border border-stone-300 rounded-lg text-xs w-48"
                        />
                        <button
                          onClick={() => submitCounterOffer(req)}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Submit Counter
                        </button>
                        <button
                          onClick={() => setActiveNegotiatingRequestId(null)}
                          className="px-3 py-2 bg-stone-200 text-stone-700 rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {req.status !== 'ACCEPTED' && (
                          <button
                            onClick={() => {
                              setActiveNegotiatingRequestId(req.id);
                              setCounterPrice(req.offeredPricePerUnit);
                            }}
                            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-xl text-xs font-semibold transition"
                          >
                            Propose Counter Offer
                          </button>
                        )}

                        <button
                          onClick={() => generateAgreementFromRequest(req)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                          Lock Deal & Generate Agreement (₹20 Fee)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALL UPCOMING HARVEST LISTINGS GRID */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Cultivation Pipeline
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Upcoming Pre-Harvest Listings
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {harvestListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition flex flex-col justify-between"
            >
              <div className="relative h-44 bg-stone-100 overflow-hidden">
                <img
                  src={listing.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'}
                  alt={listing.cropName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 backdrop-blur-xs">
                    {listing.farmingType}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  Ready: {listing.expectedHarvestDate}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="capitalize">{listing.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" /> {listing.district}, {listing.state}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-lg">{listing.cropName}</h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">{listing.description}</p>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-700">
                    <div className="flex justify-between">
                      <span>Cultivator:</span>
                      <span className="font-semibold text-stone-900">{listing.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Volume:</span>
                      <span className="font-semibold text-stone-900">
                        {listing.expectedYield} {listing.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Pledge:</span>
                      <span className="font-semibold text-stone-900">
                        {listing.minimumPledgeQuantity} {listing.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Indicative Price:</span>
                      <span className="font-bold text-emerald-900 text-sm">
                        ₹{listing.estimatedPricePerUnit}/{listing.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  id={`approach-farmer-${listing.id}`}
                  onClick={() => handleOpenApproach(listing)}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Approach Farmer & Offer Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APPROACH FARMER PROPOSAL MODAL */}
      {isApproachModalOpen && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-300 rounded-3xl w-full max-w-lg p-6 text-stone-900 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">Direct Proposal</span>
                <h3 className="font-serif font-bold text-lg">Approach {selectedListing.farmerName}</h3>
              </div>
              <button
                onClick={() => setIsApproachModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
              Crop: <strong>{selectedListing.cropName}</strong> | Expected Harvest:{' '}
              <strong>{selectedListing.expectedHarvestDate}</strong>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  Requested Volume ({selectedListing.unit}):
                </label>
                <input
                  type="number"
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(Number(e.target.value))}
                  min={selectedListing.minimumPledgeQuantity || 1}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Your Offered Price (₹ per {selectedListing.unit}):
                </label>
                <input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-emerald-900"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Preferred Delivery Date:</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Delivery Destination / Warehouse:</label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Bangalore APMC Hub or Direct Factory"
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Notes / Quality Specifications:</label>
                <textarea
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-stone-100 rounded-xl text-stone-700 flex justify-between font-semibold">
                <span>Estimated Contract Value:</span>
                <span className="text-emerald-900 font-serif text-sm">
                  ₹{(requestedQuantity * offeredPrice).toLocaleString('en-IN')} (+ ₹20 flat fee)
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => setIsApproachModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="submit-approach-btn"
                onClick={submitApproach}
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Submit Proposal to Farmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
