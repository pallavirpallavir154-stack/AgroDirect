import { WebsiteContent, WebsiteTheme, PlatformFeeConfig } from './types';

// Secure Environment Configuration Placeholders for Admin Authorization
// In production, authorized admin accounts are verified server-side using Firebase Custom Claims
// and environment variables (ADMIN_EMAIL / ADMIN_GOOGLE_ACCOUNT)
export const ADMIN_CONFIG_PLACEHOLDER = '<configured-admin-email>';
export const ADMIN_ROLE_CLAIM = 'ADMIN';

export const DEFAULT_PLATFORM_FEE: PlatformFeeConfig = {
  feeAmount: 20, // ₹20 standard AgroDirect platform fee per completed transaction
  feeType: 'FIXED_PER_TRANSACTION',
  feePayer: 'BUYER',
  minimumOrderAmount: 50,
  active: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'System Bootstrap',
};

export const CROP_CATEGORIES = [
  { id: 'grains', name: 'Grains & Cereals', icon: '🌾' },
  { id: 'pulses', name: 'Pulses & Lentils', icon: '🫘' },
  { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥦' },
  { id: 'fruits', name: 'Orchard Fruits', icon: '🍎' },
  { id: 'spices', name: 'Spices & Condiments', icon: '🌶️' },
  { id: 'oilseeds', name: 'Oilseeds', icon: '🌻' },
  { id: 'cash_crops', name: 'Cash Crops & Cotton', icon: '🌱' },
  { id: 'organic_herbs', name: 'Herbs & Organics', icon: '🌿' },
];

export const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  'Karnataka': ['Bangalore Rural', 'Bangalore Urban', 'Belagavi', 'Ballari', 'Bidar', 'Chikkamagaluru', 'Chitradurga', 'Davanagere', 'Dharwad', 'Hassan', 'Haveri', 'Kalaburagi', 'Kolar', 'Mandya', 'Mysuru', 'Raichur', 'Shivamogga', 'Tumakuru', 'Udupi', 'Vijayapura'],
  'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Jalgaon', 'Kolhapur', 'Nagpur', 'Nashik', 'Pune', 'Sangli', 'Satara', 'Solapur', 'Wardha', 'Yavatmal'],
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'West Godavari'],
  'Telangana': ['Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Medak', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Warangal'],
  'Tamil Nadu': ['Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Madurai', 'Nagapattinam', 'Salem', 'Thanjavur', 'Tiruchirappalli', 'Vellore'],
  'Punjab': ['Amritsar', 'Bathinda', 'Faridkot', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Ludhiana', 'Patiala', 'Sangrur'],
  'Madhya Pradesh': ['Bhopal', 'Dewas', 'Gwalior', 'Hoshangabad', 'Indore', 'Jabalpur', 'Mandsaur', 'Ratlam', 'Sagar', 'Ujjain', 'Vidisha'],
  'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mehsana', 'Rajkot', 'Surat', 'Vadodara'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Bareilly', 'Gorakhpur', 'Jhansi', 'Kanpur', 'Lucknow', 'Mathura', 'Meerut', 'Prayagraj', 'Varanasi'],
  'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thrissur', 'Wayanad'],
};

export const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Andhra Pradesh',
  'Telangana',
  'Tamil Nadu',
  'Punjab',
  'Madhya Pradesh',
  'Gujarat',
  'Uttar Pradesh',
  'Kerala',
  'Haryana',
  'Rajasthan',
  'Odisha',
  'West Bengal',
  'Bihar',
];

export const SOIL_TYPES = [
  { id: 'RED_LOAMY', name: 'Red & Loamy Soil', description: 'Optimal for ragi, groundnut, pulses, and vegetables' },
  { id: 'BLACK_COTTON', name: 'Black Cotton Soil (Regur)', description: 'High clay, excellent for cotton, wheat, onion, and sugarcane' },
  { id: 'ALLUVIAL', name: 'Alluvial River Plains', description: 'Rich silt, ideal for rice, wheat, jute, and oilseeds' },
  { id: 'LATERITE', name: 'Laterite Soil', description: 'Rich in iron, suitable for cashew, coffee, tea, and spices' },
  { id: 'SANDY_LOAM', name: 'Sandy Loam Soil', description: 'Well-draining, ideal for watermelon, tomato, potato, and root crops' },
];

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  hero: {
    title: 'Direct From Earth to Every Market Table.',
    highlightWord: 'Fairer for Farmers, Fresher for Buyers.',
    subtitle: 'AgroDirect eliminates exploitative middlemen with transparent ₹20 flat fees, AI-powered price intelligence, pre-harvest direct negotiations, and legally secure digital trade agreements.',
    ctaPrimaryText: 'Explore Live Marketplace',
    ctaPrimaryLink: '/marketplace',
    ctaSecondaryText: 'Sell Upcoming Harvest',
    ctaSecondaryLink: '/farmer/register',
    heroBadgeText: '🌱 100% Direct Farm-to-Buyer Ecosystem',
  },
  announcements: [
    {
      id: 'ann-1',
      text: '🌾 Kharif Harvest Negotiation Pipeline is now open across South & Central Mandis. Lock forward contracts directly with growers.',
      type: 'INFO',
      active: true,
    }
  ],
  featuredCategories: [
    {
      id: 'vegetables',
      name: 'Farm Fresh Vegetables',
      description: 'Field-harvested tomatoes, onions, potatoes, and greens packed directly at source.',
      icon: '🥦',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      itemCount: 0,
    },
    {
      id: 'grains',
      name: 'Organic Grains & Millets',
      description: 'High-protein Ragi, Jowar, Basmati paddy, and Sona Masoori direct from verified farm clusters.',
      icon: '🌾',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      itemCount: 0,
    },
    {
      id: 'pulses',
      name: 'Lentils & Pulses',
      description: 'Unpolished Tur Dal, Moong, Chana, and Urad harvested with natural farming practices.',
      icon: '🫘',
      image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
      itemCount: 0,
    },
    {
      id: 'fruits',
      name: 'Orchard Fruits',
      description: 'Naturally ripened Mangoes, Pomegranates, Bananas, and Papayas with minimal transit time.',
      icon: '🍎',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
      itemCount: 0,
    },
  ],
  trustStats: {
    showRealStats: true,
    farmersStatement: 'Verified Independent Cultivators',
    directTradeStatement: 'Transparent ₹20 Flat Platform Fee',
    fairPriceStatement: 'Direct Negotiations Without Middlemen',
  },
  contactEmail: 'support@agrodirect.in',
  supportPhone: '+91 800-AGRO-DIR (Toll Free)',
  footerText: 'AgroDirect is committed to sovereign agricultural commerce, transparent price discovery, and sustainable rural prosperity.',
};

export const DEFAULT_WEBSITE_THEME: WebsiteTheme = {
  primaryColor: '#1a4329', // Deep Forest Green
  secondaryColor: '#2e7d32', // Leaf Green
  accentColor: '#d97706', // Warm Amber / Harvest Gold
  backgroundColor: '#faf8f5', // Warm Earth Cream
  surfaceColor: '#ffffff',
  borderRadius: 'lg',
  buttonStyle: 'rounded',
  animationIntensity: 'normal',
  enable3dHero: true,
};
