import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  ShoppingBag,
  Send,
  Calendar,
  Layers,
  ArrowUpDown,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Product, CropCategory, FarmingType, IndianState, PaginatedProductsResponse } from '../../shared/types';
import { INDIAN_STATES } from '../../shared/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../../shared/i18n';

interface MarketplaceViewProps {
  onApproachFarmer: (product: Product) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onApproachFarmer }) => {
  const { addToCart } = useCart();
  const { user, language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [filterCounts, setFilterCounts] = useState<{ categories?: Record<string, number> }>({});

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedFarmingType, setSelectedFarmingType] = useState<string>('all');
  const [selectedQualityGrade, setSelectedQualityGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Crops' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'grains', label: 'Grains & Cereals' },
    { id: 'pulses', label: 'Pulses' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'spices', label: 'Spices' },
    { id: 'oilseeds', label: 'Oilseeds' },
  ];

  const farmingTypes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Methods' },
    { id: 'ORGANIC', label: 'Certified Organic' },
    { id: 'NATURAL', label: 'Natural / Zero Budget' },
    { id: 'CONVENTIONAL', label: 'Conventional' },
  ];

  const fetchProducts = (page: number = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(pageSize));
    if (search) params.append('search', search);
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedState !== 'all') params.append('state', selectedState);
    if (selectedFarmingType !== 'all') params.append('farmingType', selectedFarmingType);
    if (selectedQualityGrade !== 'all') params.append('qualityGrade', selectedQualityGrade);
    if (sortBy) params.append('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data: PaginatedProductsResponse) => {
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
        setCurrentPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        if (data.filterCounts) {
          setFilterCounts(data.filterCounts);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedState, selectedFarmingType, selectedQualityGrade, sortBy]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchProducts(newPage);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1a4329] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
            Direct Farm-Gate Procurement
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Direct Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-2 max-w-xl">
            Browse verified harvest listings straight from Indian cultivators. Zero middlemen markups, guaranteed produce origin, and transparent flat ₹20 fee.
          </p>
        </div>

        <div className="bg-emerald-950/70 border border-emerald-700/50 rounded-2xl p-4 text-xs text-stone-200 backdrop-blur-xs">
          <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Direct Trade Guarantee
          </div>
          <p>Every purchase supports genuine local farmers directly.</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        {/* Search input & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              id="marketplace-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search produce (e.g., Tomato, Turmeric, Basmati, Doddaballapur)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              id="marketplace-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            >
              <option value="newest">Newest Listings</option>
              <option value="harvest_recent">Recent Harvests</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="quantity_desc">Highest Available Stock</option>
            </select>
          </div>
        </div>

        {/* Categories Chips with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count = cat.id === 'all' ? totalProducts : filterCounts.categories?.[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{cat.label}</span>
                {typeof count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-950 text-emerald-200'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Dropdowns (State & Farming Method) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Filter by State:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            >
              <option value="all">All States of India</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Farming Method:
            </label>
            <select
              value={selectedFarmingType}
              onChange={(e) => setSelectedFarmingType(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            >
              {farmingTypes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Quality Grade:
            </label>
            <select
              value={selectedQualityGrade}
              onChange={(e) => setSelectedQualityGrade(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
            >
              <option value="all">All Grades</option>
              <option value="PREMIUM">Premium Select</option>
              <option value="GRADE_A">Grade A</option>
              <option value="STANDARD">Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Total & Pagination Top Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <div>
          Showing{' '}
          <span className="font-bold text-stone-800">
            {totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-bold text-stone-800">
            {Math.min(currentPage * pageSize, totalProducts)}
          </span>{' '}
          of <span className="font-bold text-stone-800">{totalProducts}</span> agricultural listings
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-stone-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 text-stone-500">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Loading marketplace produce...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center text-stone-500">
          <AlertCircle className="w-12 h-12 mx-auto text-stone-400 mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-lg text-stone-800">No produce matching your criteria</h3>
          <p className="text-xs text-stone-500 mt-1">Try relaxing your search or state filters to see more harvests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition flex flex-col justify-between group"
            >
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 backdrop-blur-xs">
                    {product.farmingType.replace('_', ' ')}
                  </span>
                  {product.farmerVerification === 'VERIFIED' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                  {product.isDemo && (
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-900/80 text-stone-300 backdrop-blur-xs">
                      Sample Catalog
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="capitalize">{product.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" /> {product.district}, {product.state}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition">
                    {product.name} {product.variety ? `(${product.variety})` : ''}
                  </h3>

                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">{product.description}</p>

                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Cultivator:</span>
                      <span className="font-semibold text-stone-900">{product.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Stock:</span>
                      <span className="font-semibold text-stone-900">
                        {product.quantityAvailable} {product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Order:</span>
                      <span className="font-semibold text-stone-900">
                        {product.minimumOrderQuantity} {product.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Direct Farm Rate</span>
                      <span className="text-lg font-serif font-bold text-emerald-900">
                        ₹{product.pricePerUnit}
                        <span className="text-xs text-stone-600 font-sans font-normal">/{product.unit}</span>
                      </span>
                    </div>

                    <button
                      id={`buy-product-${product.id}`}
                      onClick={() => addToCart(product, product.minimumOrderQuantity || 1)}
                      className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Basket
                    </button>
                  </div>

                  <button
                    onClick={() => onApproachFarmer(product)}
                    className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3 h-3 text-emerald-700" />
                    Approach for Direct Bulk Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                  currentPage === p
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold disabled:opacity-40 transition flex items-center gap-1 shadow-xs"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
