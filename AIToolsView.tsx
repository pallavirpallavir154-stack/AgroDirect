import React, { useState } from 'react';
import {
  Sparkles,
  Sprout,
  TrendingUp,
  BarChart3,
  Bot,
  Send,
  Volume2,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../../shared/i18n';
import { INDIAN_STATES, SOIL_TYPES } from '../../shared/constants';
import { SoilType, CropSeason, CropRecommendationResult, PricePredictionResult } from '../../shared/types';

export const AIToolsView: React.FC = () => {
  const { language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'recommender' | 'price' | 'demand' | 'agrobot'>('recommender');

  // 1. Crop Recommender Form State
  const [recState, setRecState] = useState('Karnataka');
  const [recDistrict, setRecDistrict] = useState('Bangalore Rural');
  const [recSoil, setRecSoil] = useState<SoilType>('RED_LOAMY');
  const [recSeason, setRecSeason] = useState<CropSeason>('KHARIF');
  const [recIrrigation, setRecIrrigation] = useState(true);
  const [recFarmSize, setRecFarmSize] = useState(3);
  const [recLoading, setRecLoading] = useState(false);
  const [recResults, setRecResults] = useState<CropRecommendationResult[] | null>(null);

  // 2. Price Predictor Form State
  const [priceCrop, setPriceCrop] = useState('Tomato');
  const [priceState, setPriceState] = useState('Karnataka');
  const [priceMonth, setPriceMonth] = useState('September');
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceResult, setPriceResult] = useState<PricePredictionResult | null>(null);

  // 3. Agrobot Copilot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: `Namaskara! I am Agrobot, your AI agronomy & direct market assistant. Ask me anything about crop fertilization, pest control, Mandi price projections, or direct harvest forward agreements.`,
    },
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Run Crop Recommendation
  const handleRunRecommender = async () => {
    setRecLoading(true);
    try {
      const res = await fetch('/api/ai/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: recState,
          district: recDistrict,
          soilType: recSoil,
          season: recSeason,
          irrigationAvailable: recIrrigation,
          farmSizeAcres: Number(recFarmSize),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRecResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRecLoading(false);
    }
  };

  // Run Price Prediction
  const handleRunPricePrediction = async () => {
    setPriceLoading(true);
    try {
      const res = await fetch('/api/ai/price-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: priceCrop,
          state: priceState,
          month: priceMonth,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPriceResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPriceLoading(false);
    }
  };

  // Agrobot AI Chat Submit
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsBotTyping(true);

    try {
      const res = await fetch('/api/ai/agrobot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      }
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'I encountered an issue. Please ask again.' },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1a4329] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Agronomy & Market Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            AgroDirect AI Workspace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-2 max-w-xl">
            Sovereign decision-support intelligence for farmers and bulk buyers: crop suitability rankings, APMC Mandi price forecasts, regional demand indicators, and 24/7 AI agronomist.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'recommender', label: 'Crop Recommender', icon: Sprout },
            { id: 'price', label: 'Price Predictor', icon: TrendingUp },
            { id: 'agrobot', label: 'Agrobot Copilot', icon: Bot },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. CROP RECOMMENDER TAB */}
      {activeTab === 'recommender' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Input Card */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
              <Sprout className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-bold text-stone-900 font-serif">Farm Soil & Climate Parameters</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">State:</label>
                <select
                  value={recState}
                  onChange={(e) => setRecState(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">District / Region:</label>
                <input
                  type="text"
                  value={recDistrict}
                  onChange={(e) => setRecDistrict(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Soil Type:</label>
                <select
                  value={recSoil}
                  onChange={(e) => setRecSoil(e.target.value as SoilType)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} - {s.description}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Target Cultivation Season:</label>
                <select
                  value={recSeason}
                  onChange={(e) => setRecSeason(e.target.value as CropSeason)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="KHARIF">Kharif (Monsoon Sowing: June - Oct)</option>
                  <option value="RABI">Rabi (Winter Sowing: Oct - March)</option>
                  <option value="ZAID">Zaid (Summer Sowing: March - June)</option>
                  <option value="YEAR_ROUND">Year-Round Perennial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold block mb-1">Farm Size (Acres):</label>
                  <input
                    type="number"
                    value={recFarmSize}
                    onChange={(e) => setRecFarmSize(Number(e.target.value))}
                    min={0.5}
                    step={0.5}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Irrigation Setup:</label>
                  <select
                    value={recIrrigation ? 'yes' : 'no'}
                    onChange={(e) => setRecIrrigation(e.target.value === 'yes')}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="yes">Borewell / Drip Available</option>
                    <option value="no">Rainfed Only</option>
                  </select>
                </div>
              </div>

              <button
                id="run-crop-recommender-btn"
                disabled={recLoading}
                onClick={handleRunRecommender}
                className="w-full mt-4 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                {recLoading ? (
                  <span>Analyzing Soil & APMC Models...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run AI Suitability Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recommendation Results Column */}
          <div className="lg:col-span-7 space-y-4">
            {!recResults ? (
              <div className="bg-stone-100 border border-dashed border-stone-300 rounded-3xl p-12 text-center text-stone-500">
                <Sprout className="w-12 h-12 mx-auto text-emerald-700/50 mb-3" />
                <h3 className="font-serif font-bold text-stone-800 text-lg">Ready for Agronomic Computation</h3>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  Configure your soil parameters and click "Run AI Suitability Analysis" to view top-ranked profitable crops tailored to your district.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-stone-900 text-lg">
                    Top Recommended Crops for {recDistrict}, {recState}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    {recResults.length} Crops Evaluated
                  </span>
                </div>

                {recResults.map((crop, idx) => (
                  <div
                    key={crop.cropName}
                    className="p-5 bg-white border border-stone-200 rounded-3xl shadow-xs space-y-3 hover:border-emerald-700 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-stone-400">#{idx + 1}</span>
                          <h4 className="font-bold text-stone-900 text-base">{crop.cropName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold capitalize">
                            {crop.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{crop.reasoning}</p>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                          <CheckCircle className="w-3 h-3 text-emerald-700" />
                          {crop.suitabilityScore}% Suitability
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-2xl text-xs text-stone-700">
                      <div>
                        <span className="text-stone-500 block text-[11px]">Expected Yield:</span>
                        <span className="font-semibold">{crop.expectedYieldRange}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[11px]">Est. Market Rate:</span>
                        <span className="font-semibold text-emerald-900">{crop.estimatedPriceRange}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[11px]">Net Profit / Acre:</span>
                        <span className="font-bold text-emerald-900 font-serif">
                          ₹{crop.estimatedNetProfitPerAcre.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MANDI PRICE PREDICTOR TAB */}
      {activeTab === 'price' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
              <TrendingUp className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-bold text-stone-900 font-serif">Mandi Benchmark Predictor</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Crop to Forecast:</label>
                <select
                  value={priceCrop}
                  onChange={(e) => setPriceCrop(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {['Tomato', 'Onion', 'Potato', 'Pomegranate', 'Turmeric', 'Ragi (Finger Millet)', 'Wheat', 'Tur (Pigeon Pea)'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Primary State Mandi Yard:</label>
                <select
                  value={priceState}
                  onChange={(e) => setPriceState(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Expected Harvest Month:</label>
                <select
                  value={priceMonth}
                  onChange={(e) => setPriceMonth(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <button
                id="run-price-predictor-btn"
                disabled={priceLoading}
                onClick={handleRunPricePrediction}
                className="w-full mt-4 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                {priceLoading ? (
                  <span>Computing APMC Regression...</span>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-amber-300" />
                    <span>Predict Mandi Realizations</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {!priceResult ? (
              <div className="bg-stone-100 border border-dashed border-stone-300 rounded-3xl p-12 text-center text-stone-500">
                <TrendingUp className="w-12 h-12 mx-auto text-emerald-700/50 mb-3" />
                <h3 className="font-serif font-bold text-stone-800 text-lg">Mandi Forecast Model Ready</h3>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  Select your crop and click "Predict Mandi Realizations" to calculate wholesale price bands and peak buyer demand windows.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase block">
                      {priceResult.state} Mandi Benchmark
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-stone-900 mt-0.5">
                      {priceResult.cropName} ({priceResult.month})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      priceResult.trend === 'BULLISH'
                        ? 'bg-emerald-100 text-emerald-900'
                        : priceResult.trend === 'BEARISH'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      Trend: {priceResult.trend}
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-stone-50 rounded-2xl">
                    <span className="text-xs text-stone-500 block">Min Support Rate</span>
                    <span className="text-lg font-bold text-stone-800 font-serif">
                      ₹{priceResult.predictedMinPrice}/{priceResult.unit}
                    </span>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <span className="text-xs text-emerald-800 font-bold block">Recommended Price</span>
                    <span className="text-2xl font-bold text-emerald-900 font-serif">
                      ₹{priceResult.recommendedListingPrice}/{priceResult.unit}
                    </span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl">
                    <span className="text-xs text-stone-500 block">Peak Realization</span>
                    <span className="text-lg font-bold text-stone-800 font-serif">
                      ₹{priceResult.predictedMaxPrice}/{priceResult.unit}
                    </span>
                  </div>
                </div>

                {/* Historical Simulation */}
                <div>
                  <h4 className="font-semibold text-stone-900 text-xs uppercase mb-2">
                    Historical Monthly Mandi Index (₹/{priceResult.unit})
                  </h4>
                  <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-2 px-2 bg-stone-50 rounded-2xl border border-stone-200">
                    {priceResult.historicalMonthlyAverage.map((item) => {
                      const maxVal = Math.max(...priceResult.historicalMonthlyAverage.map((i) => i.price));
                      const heightPercent = Math.max(15, (item.price / maxVal) * 85);
                      const isCurrent = item.month === priceResult.month.substring(0, 3);
                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[9px] text-stone-500 font-mono">₹{item.price}</span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-md transition ${
                              isCurrent ? 'bg-amber-500' : 'bg-emerald-700'
                            }`}
                          />
                          <span className={`text-[9px] font-bold ${isCurrent ? 'text-amber-700' : 'text-stone-500'}`}>
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs text-emerald-900 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 inline mr-1" />
                  <strong>Direct Farmer Advantage:</strong> Direct forward contracts on AgroDirect bypass the 10-15% APMC yard deduction. Lock in ₹{priceResult.recommendedListingPrice}/{priceResult.unit} today with ₹20 fee protection.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. AGROBOT COPILOT TAB */}
      {activeTab === 'agrobot' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Agrobot AI Copilot</h3>
                <p className="text-xs text-stone-500">24/7 Agronomy, Pest Management & Direct Market Negotiator</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-6 min-h-[320px] max-h-[420px] overflow-y-auto space-y-4 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 text-xs">
                    🌾
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-white font-medium rounded-br-none'
                      : 'bg-white border border-stone-200 text-stone-800 shadow-xs rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isBotTyping && (
              <div className="flex gap-2 items-center text-xs text-stone-500 italic">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-bounce" />
                Agrobot is analyzing agronomic datasets...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="agrobot-chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask Agrobot (e.g., How to prevent tomato leaf curl virus organically?)..."
              className="flex-1 p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
            />
            <button
              id="send-agrobot-msg-btn"
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="p-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
