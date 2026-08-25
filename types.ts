// Shared types and data contracts for AgroDirect

export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN';

export type CropCategory = 'all' | 'grains' | 'pulses' | 'vegetables' | 'fruits' | 'spices' | 'oilseeds' | 'cash_crops' | 'organic_herbs';

export type FarmingType = 'ALL' | 'ORGANIC' | 'NATURAL' | 'CONVENTIONAL';

export type IndianState = string;

export type SoilType = 'RED_LOAMY' | 'BLACK_COTTON' | 'ALLUVIAL' | 'LATERITE' | 'SANDY_LOAM';

export type CropSeason = 'KHARIF' | 'RABI' | 'ZAID' | 'YEAR_ROUND';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type ProductStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'OUT_OF_STOCK';

export type HarvestStatus = 'UPCOMING' | 'HARVESTING' | 'HARVESTED' | 'SOLD_OUT';

export type NegotiationStatus = 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export type AgreementStatus = 'DRAFT' | 'PENDING_FARMER' | 'PENDING_BUYER' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type FeeType = 'FIXED_PER_TRANSACTION' | 'PERCENTAGE' | 'TIERED';

export type LanguageCode = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml' | 'mr';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  language: LanguageCode;
  
  // Farmer Specific Fields
  farmName?: string;
  farmLocation?: {
    village: string;
    taluk?: string;
    district: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  farmSizeAcres?: number;
  farmingType?: 'ORGANIC' | 'CONVENTIONAL' | 'NATURAL_ZERO_BUDGET' | 'HYDROPONIC';
  farmerBio?: string;
  verificationStatus?: VerificationStatus;
  verificationDocuments?: string[];
  totalHarvestsCompleted?: number;
  rating?: number;
  reviewsCount?: number;

  // Buyer Specific Fields
  buyerType?: 'INDIVIDUAL' | 'RETAILER' | 'WHOLESALER' | 'RESTAURANT' | 'FOOD_PROCESSOR';
  businessName?: string;
  shippingAddresses?: {
    id: string;
    name: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }[];
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerVerification: VerificationStatus;
  name: string;
  category: string;
  variety?: string;
  description: string;
  quantityAvailable: number;
  unit: string; // 'kg' | 'quintal' | 'crate' | 'ton' | 'dozen' | 'liter'
  pricePerUnit: number; // in INR (₹)
  minimumOrderQuantity: number;
  location: string;
  district: string;
  state: string;
  harvestDate?: string;
  availabilityDate: string;
  farmingType: 'ORGANIC' | 'CONVENTIONAL' | 'NATURAL';
  qualityGrade: 'GRADE_A' | 'GRADE_B' | 'STANDARD' | 'PREMIUM';
  certifications?: string[];
  images: string[];
  status: ProductStatus;
  isDemo?: boolean; // Explicitly marks development sample data vs real farmer listings
  dataSource?: 'FARMER_LISTING' | 'DEVELOPMENT_DEMO';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  nextCursor?: string;
  filterCounts?: {
    categories: Record<string, number>;
    states: Record<string, number>;
    farmingTypes: Record<string, number>;
  };
}

export interface HarvestListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  cropName: string;
  category: string;
  variety: string;
  expectedYield: number;
  unit: string;
  estimatedPricePerUnit: number;
  expectedHarvestDate: string;
  farmLocation: string;
  district: string;
  state: string;
  farmingType: 'ORGANIC' | 'CONVENTIONAL' | 'NATURAL';
  status: HarvestStatus;
  images: string[];
  minimumPledgeQuantity: number;
  description: string;
  createdAt: string;
}

export interface HarvestRequest {
  id: string;
  harvestListingId?: string;
  productId?: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  cropName: string;
  requestedQuantity: number;
  unit: string;
  offeredPricePerUnit: number;
  preferredDeliveryDate: string;
  deliveryLocation: string;
  message: string;
  status: NegotiationStatus;
  negotiationHistory: {
    senderRole: 'FARMER' | 'BUYER';
    senderId: string;
    pricePerUnit: number;
    quantity: number;
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FarmerBuyerAgreement {
  id: string;
  requestId: string;
  farmerId: string;
  farmerName: string;
  farmerContact: string;
  buyerId: string;
  buyerName: string;
  buyerContact: string;
  productName: string;
  variety?: string;
  quantity: number;
  unit: string;
  agreedPricePerUnit: number;
  productSubtotal: number; // quantity * agreedPricePerUnit
  platformFeeApplied: number; // e.g. ₹20 locked at creation time
  platformFeeMode: 'BUYER_PAYS' | 'FARMER_DEDUCTION';
  totalPayableAmount: number;
  harvestDate: string;
  deliveryDate: string;
  deliveryMethod: 'FARM_PICKUP' | 'DIRECT_TRANSPORT' | 'AGRODIRECT_LOGISTICS';
  pickupOrDeliveryAddress: string;
  termsAndConditions: string;
  agreementVersion: string;
  farmerAcceptedAt?: string;
  buyerAcceptedAt?: string;
  status: AgreementStatus;
  createdAt: string;
  updatedAt: string;
  relatedOrderId?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  farmerId: string;
  farmerName: string;
  pricePerUnit: number;
  quantity: number;
  unit: string;
  subtotal: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  items: CartItem[];
  productSubtotal: number;
  platformFee: number; // ₹20 standard
  deliveryFee: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CARD' | 'ESCROW' | 'CASH_ON_DELIVERY';
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  agreementId?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformFeeConfig {
  feeAmount: number; // default 20
  feeType: FeeType;
  feePayer: 'BUYER' | 'FARMER';
  minimumOrderAmount: number;
  active: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface RealtimeNotification {
  id: string;
  recipientId: string;
  type: 'HARVEST_REQUEST' | 'OFFER_UPDATE' | 'AGREEMENT_SIGN' | 'ORDER_PLACED' | 'ORDER_UPDATE' | 'PAYMENT' | 'ANNOUNCEMENT' | 'SYSTEM';
  title: string;
  message: string;
  relatedEntityId?: string;
  entityType?: 'harvest' | 'agreement' | 'order' | 'product';
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  relatedOrderId?: string;
  relatedHarvestId?: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
  }[];
  lastMessage?: string;
  lastMessageAt?: string;
  cropContext?: string;
  unreadCount?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteContent {
  hero: {
    title: string;
    highlightWord: string;
    subtitle: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
    ctaSecondaryText: string;
    ctaSecondaryLink: string;
    heroBadgeText: string;
  };
  announcements: {
    id: string;
    text: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
    active: boolean;
    validTill?: string;
  }[];
  featuredCategories: {
    id: string;
    name: string;
    description: string;
    icon: string;
    image: string;
    itemCount: number;
  }[];
  trustStats: {
    showRealStats: boolean;
    farmersStatement: string;
    directTradeStatement: string;
    fairPriceStatement: string;
  };
  contactEmail: string;
  supportPhone: string;
  footerText: string;
}

export interface WebsiteTheme {
  primaryColor: string; // e.g. #1a4329 (Deep Forest Green)
  secondaryColor: string; // e.g. #2e7d32 (Leaf Green)
  accentColor: string; // e.g. #eab308 (Soft Harvest Gold)
  backgroundColor: string; // e.g. #faf8f5 (Warm natural cream)
  surfaceColor: string; // e.g. #ffffff
  borderRadius: 'sm' | 'md' | 'lg' | 'xl';
  buttonStyle: 'rounded' | 'pill' | 'subtle';
  animationIntensity: 'subtle' | 'normal' | 'expressive' | 'none';
  enable3dHero: boolean;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'USER' | 'PRODUCT' | 'AGREEMENT' | 'ORDER' | 'FEE_CONFIG' | 'THEME' | 'CMS' | 'DATA_IMPORT' | 'AUTH';
  targetId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface MarketReferenceData {
  id: string;
  commodity: string;
  variety: string;
  mandi: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalDate: string;
  source: string; // e.g. 'Agmarknet (Govt of India)'
  license: string;
  importedAt: string;
}

export interface CropRecommendationRequest {
  state: string;
  district: string;
  season: 'KHARIF' | 'RABI' | 'ZAID';
  soilType: string;
  irrigationSource: string;
  farmSizeAcres: number;
  currentTemperatureC?: number;
  averageRainfallMm?: number;
}

export interface CropRecommendationResult {
  cropName: string;
  category: string;
  suitabilityScore: number;
  expectedYieldRange: string;
  estimatedPriceRange: string;
  estimatedNetProfitPerAcre: number;
  reasoning: string;
}

export interface PricePredictionResult {
  cropName: string;
  state: string;
  month: string;
  predictedMinPrice: number;
  predictedMaxPrice: number;
  recommendedListingPrice: number;
  unit: string;
  trend: 'BULLISH' | 'BEARISH' | 'STABLE';
  historicalMonthlyAverage: { month: string; price: number }[];
}

export interface DemandPredictionResult {
  cropName: string;
  demandIndex: number; // 0 - 100
  marketTrend: 'HIGH_DEMAND' | 'MODERATE_DEMAND' | 'SURPLUS_EXPECTED';
  peakDemandMonths: string[];
  topConsumingRegions: string[];
  summary: string;
  disclaimer: string;
}
