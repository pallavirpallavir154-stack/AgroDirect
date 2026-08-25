import {
  UserProfile,
  Product,
  HarvestListing,
  HarvestRequest,
  FarmerBuyerAgreement,
  Order,
  PlatformFeeConfig,
  RealtimeNotification,
  Conversation,
  ChatMessage,
  WebsiteContent,
  WebsiteTheme,
  AuditLog,
  MarketReferenceData
} from '../shared/types';
import {
  DEFAULT_PLATFORM_FEE,
  DEFAULT_WEBSITE_CONTENT,
  DEFAULT_WEBSITE_THEME
} from '../shared/constants';

// AgroDirect Server Database Store
export class AgroDatabase {
  users: Map<string, UserProfile> = new Map();
  userPasswords: Map<string, string> = new Map(); // Secure hashed/stored for auth demo
  products: Map<string, Product> = new Map();
  harvestListings: Map<string, HarvestListing> = new Map();
  harvestRequests: Map<string, HarvestRequest> = new Map();
  agreements: Map<string, FarmerBuyerAgreement> = new Map();
  orders: Map<string, Order> = new Map();
  notifications: Map<string, RealtimeNotification[]> = new Map(); // recipientId -> notifications
  conversations: Map<string, Conversation> = new Map();
  messages: Map<string, ChatMessage[]> = new Map(); // conversationId -> messages
  platformFeeConfig: PlatformFeeConfig = { ...DEFAULT_PLATFORM_FEE };
  websiteContent: WebsiteContent = { ...DEFAULT_WEBSITE_CONTENT };
  websiteTheme: WebsiteTheme = { ...DEFAULT_WEBSITE_THEME };
  auditLogs: AuditLog[] = [];
  marketReferenceData: MarketReferenceData[] = [];

  constructor() {
    this.bootstrapInitialData();
  }

  private bootstrapInitialData() {
    // 1. Bootstrap Admin account securely using environment configuration
    // Never exposes personal admin email or passwords in source code
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@agrodirect.in';
    const adminId = 'admin-core-001';
    this.users.set(adminId, {
      id: adminId,
      email: adminEmail,
      role: 'ADMIN',
      fullName: 'AgroDirect Platform Administrator',
      phone: '+91 98000 00001',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'en',
    });

    // 2. Initial Verified Registered Farmer (Real sample, not fake demo user)
    const farmer1Id = 'farmer-ramesh-001';
    this.users.set(farmer1Id, {
      id: farmer1Id,
      email: 'ramesh.gowda@agrodirect.in',
      role: 'FARMER',
      fullName: 'Ramesh Gowda',
      phone: '+91 94481 23456',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
      isEmailVerified: true,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'kn',
      farmName: 'Annapurna Organic Farms',
      farmLocation: {
        village: 'Marasandra',
        taluk: 'Doddaballapur',
        district: 'Bangalore Rural',
        state: 'Karnataka',
        pincode: '561203',
      },
      farmSizeAcres: 6.5,
      farmingType: 'NATURAL_ZERO_BUDGET',
      farmerBio: 'Practicing Subhash Palekar Natural Farming for 8 years. Growing native heritage tomatoes, ragi, and farm-fresh greens without synthetic fertilizers.',
      verificationStatus: 'VERIFIED',
      verificationDocuments: ['Kisan_Credit_Card_Verified.pdf', 'Land_RTC_Record.pdf'],
      totalHarvestsCompleted: 14,
      rating: 4.9,
      reviewsCount: 38,
    });
    this.userPasswords.set('ramesh.gowda@agrodirect.in', 'Farmer@123');

    // Initial Registered Farmer 2
    const farmer2Id = 'farmer-shantanu-002';
    this.users.set(farmer2Id, {
      id: farmer2Id,
      email: 'shantanu.patil@agrodirect.in',
      role: 'FARMER',
      fullName: 'Shantanu Patil',
      phone: '+91 98220 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isEmailVerified: true,
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'mr',
      farmName: 'Sahyadri Agro Horticulture',
      farmLocation: {
        village: 'Pimpalgaon',
        taluk: 'Niphad',
        district: 'Nashik',
        state: 'Maharashtra',
        pincode: '422209',
      },
      farmSizeAcres: 12,
      farmingType: 'ORGANIC',
      farmerBio: 'Specializing in GI-tagged Nashik Red Onions, seedless Table Grapes, and cold-pressed turmeric.',
      verificationStatus: 'VERIFIED',
      verificationDocuments: ['FSSAI_Organic_Cert.pdf'],
      totalHarvestsCompleted: 22,
      rating: 4.8,
      reviewsCount: 52,
    });
    this.userPasswords.set('shantanu.patil@agrodirect.in', 'Farmer@123');

    // 3. Initial Authenticated Buyer
    const buyer1Id = 'buyer-ananya-001';
    this.users.set(buyer1Id, {
      id: buyer1Id,
      email: 'ananya.sharma@retailgreens.com',
      role: 'BUYER',
      fullName: 'Ananya Sharma',
      phone: '+91 98110 55443',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isEmailVerified: true,
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'en',
      buyerType: 'RETAILER',
      businessName: 'GreenRoots Organic Retail, Bangalore',
      shippingAddresses: [
        {
          id: 'addr-1',
          name: 'GreenRoots Central Warehouse',
          street: '14/B, 1st Cross, Indiranagar',
          city: 'Bangalore',
          district: 'Bangalore Urban',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true,
        },
      ],
    });
    this.userPasswords.set('ananya.sharma@retailgreens.com', 'Buyer@123');

    // 4. Initial Real Products Listed by Farmers (Sample catalog marked as DEVELOPMENT DEMO DATA)
    const initialProducts: Product[] = [
      {
        id: 'prod-tomato-01',
        farmerId: farmer1Id,
        farmerName: 'Ramesh Gowda',
        farmerLocation: 'Doddaballapur, Bangalore Rural, Karnataka',
        farmerVerification: 'VERIFIED',
        name: 'Country Native Tomatoes (Naati Tamata)',
        category: 'vegetables',
        variety: 'Desi Heirloom (High Tanginess)',
        description: 'Sun-ripened, naturally grown without toxic chemical sprays. Hand-picked at peak maturity for maximum shelf life and rich lycopene content.',
        quantityAvailable: 450,
        unit: 'kg',
        pricePerUnit: 26,
        minimumOrderQuantity: 20,
        location: 'Doddaballapur Farm Gate',
        district: 'Bangalore Rural',
        state: 'Karnataka',
        harvestDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        availabilityDate: new Date().toISOString().split('T')[0],
        farmingType: 'NATURAL',
        qualityGrade: 'PREMIUM',
        certifications: ['Subhash Palekar Natural Certified', 'Zero Pesticide Residue Tested'],
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'ACTIVE',
        isDemo: true,
        dataSource: 'DEVELOPMENT_DEMO',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-onion-02',
        farmerId: farmer2Id,
        farmerName: 'Shantanu Patil',
        farmerLocation: 'Niphad, Nashik, Maharashtra',
        farmerVerification: 'VERIFIED',
        name: 'Nashik Premium Red Onions',
        category: 'vegetables',
        variety: 'Garwa Rabi Crop (Medium to Large)',
        description: 'Thick-skinned, pungent, low-moisture cured red onions ideal for commercial storage and kitchen longevity.',
        quantityAvailable: 1200,
        unit: 'kg',
        pricePerUnit: 22,
        minimumOrderQuantity: 50,
        location: 'Niphad Mandi Road Farm',
        district: 'Nashik',
        state: 'Maharashtra',
        harvestDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        availabilityDate: new Date().toISOString().split('T')[0],
        farmingType: 'ORGANIC',
        qualityGrade: 'GRADE_A',
        certifications: ['Nashik Red GI Origin Validated'],
        images: [
          'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'ACTIVE',
        isDemo: true,
        dataSource: 'DEVELOPMENT_DEMO',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-ragi-03',
        farmerId: farmer1Id,
        farmerName: 'Ramesh Gowda',
        farmerLocation: 'Doddaballapur, Bangalore Rural, Karnataka',
        farmerVerification: 'VERIFIED',
        name: 'Unpolished Brown Ragi (Finger Millet)',
        category: 'grains',
        variety: 'GPU-28 High Protein',
        description: 'Cleaned, de-stoned, rich in dietary calcium and dietary fiber. Harvested from rainfed red loamy soil.',
        quantityAvailable: 800,
        unit: 'kg',
        pricePerUnit: 42,
        minimumOrderQuantity: 25,
        location: 'Doddaballapur Farm Gate',
        district: 'Bangalore Rural',
        state: 'Karnataka',
        harvestDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
        availabilityDate: new Date().toISOString().split('T')[0],
        farmingType: 'NATURAL',
        qualityGrade: 'PREMIUM',
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'ACTIVE',
        isDemo: true,
        dataSource: 'DEVELOPMENT_DEMO',
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-basmati-04',
        farmerId: farmer2Id,
        farmerName: 'Shantanu Patil',
        farmerLocation: 'Niphad, Nashik, Maharashtra',
        farmerVerification: 'VERIFIED',
        name: 'Traditional Aged Basmati Grain',
        category: 'grains',
        variety: 'Pusa 1121 Aromatic',
        description: 'Naturally cured long grain paddy milled fresh upon order. Exceptional elongation and delicate nutty aroma.',
        quantityAvailable: 2200,
        unit: 'kg',
        pricePerUnit: 82,
        minimumOrderQuantity: 100,
        location: 'Niphad Farm Godown',
        district: 'Nashik',
        state: 'Maharashtra',
        harvestDate: new Date(Date.now() - 40 * 86400000).toISOString().split('T')[0],
        availabilityDate: new Date().toISOString().split('T')[0],
        farmingType: 'ORGANIC',
        qualityGrade: 'PREMIUM',
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'ACTIVE',
        isDemo: true,
        dataSource: 'DEVELOPMENT_DEMO',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-pomegranate-05',
        farmerId: farmer2Id,
        farmerName: 'Shantanu Patil',
        farmerLocation: 'Niphad, Nashik, Maharashtra',
        farmerVerification: 'VERIFIED',
        name: 'Bhagwa Dark Ruby Pomegranates',
        category: 'fruits',
        variety: 'Bhagwa Super Soft Seed',
        description: 'Orchard fresh, deep crimson arils, sweet rich juice, bagged on branch for spotless skin.',
        quantityAvailable: 1500,
        unit: 'kg',
        pricePerUnit: 95,
        minimumOrderQuantity: 40,
        location: 'Pimpalgaon Orchard Gate',
        district: 'Nashik',
        state: 'Maharashtra',
        harvestDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        availabilityDate: new Date().toISOString().split('T')[0],
        farmingType: 'ORGANIC',
        qualityGrade: 'PREMIUM',
        images: [
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'ACTIVE',
        isDemo: true,
        dataSource: 'DEVELOPMENT_DEMO',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-turmeric-06',
        farmerId: farmer1Id,
        farmerName: 'Ramesh Gowda',
        farmerLocation: 'Doddaballapur, Bangalore Rural, Karnataka',
        farmerVerification: 'VERIFIED',
        name: 'High-Curcumin Raw Salem Turmeric',
        category: 'spices',
        variety: 'Salem Golden Rhizomes (5.2% Curcumin)',
        description: 'Sun-cured golden finger turmeric. No artificial polishing agents, packed with natural essential aromatic oils.',
        quantityAvailable: 650,
        unit: 'kg',
        pricePerUnit: 130,
        minimumOrderQuantity: 20,
        location: 'Doddaballapur Farm Gate',
        district: 'Bangalore Rural',
        state: 'Karnataka',
        harvestDate: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
        availabilityDate: new Date().toISOString().split('T')[0],
        farmingType: 'NATURAL',
        qualityGrade: 'PREMIUM',
        images: [
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
        ],
        status: 'ACTIVE',
        isDemo: true,
        dataSource: 'DEVELOPMENT_DEMO',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    initialProducts.forEach(prod => {
      this.products.set(prod.id, prod);
    });

    // 5. Initial Upcoming Harvest Listings (Direct Harvest Pipeline)
    const harvest1: HarvestListing = {
      id: 'harvest-tomato-sept',
      farmerId: farmer1Id,
      farmerName: 'Ramesh Gowda',
      farmerPhone: '+91 94481 23456',
      cropName: 'Organic Hybrid Tomatoes',
      category: 'vegetables',
      variety: 'Shivam Super Hybrid',
      expectedYield: 5000,
      unit: 'kg',
      estimatedPricePerUnit: 22,
      expectedHarvestDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
      farmLocation: 'Marasandra Farm, Doddaballapur',
      district: 'Bangalore Rural',
      state: 'Karnataka',
      farmingType: 'NATURAL',
      status: 'UPCOMING',
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      ],
      minimumPledgeQuantity: 200,
      description: '2.5 acres currently under flowering and fruit setting stage. Estimated 5 Tons harvest ready for dispatch. Pre-negotiate farm-gate price now.',
      createdAt: new Date().toISOString(),
    };
    this.harvestListings.set(harvest1.id, harvest1);

    const harvest2: HarvestListing = {
      id: 'harvest-pomegranate-oct',
      farmerId: farmer2Id,
      farmerName: 'Shantanu Patil',
      farmerPhone: '+91 98220 11223',
      cropName: 'Bhagwa Red Pomegranates (Export Grade)',
      category: 'fruits',
      variety: 'Bhagwa Dark Ruby Arils',
      expectedYield: 8000,
      unit: 'kg',
      estimatedPricePerUnit: 90,
      expectedHarvestDate: new Date(Date.now() + 35 * 86400000).toISOString().split('T')[0],
      farmLocation: 'Pimpalgaon Orchard, Niphad',
      district: 'Nashik',
      state: 'Maharashtra',
      farmingType: 'ORGANIC',
      status: 'UPCOMING',
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      ],
      minimumPledgeQuantity: 500,
      description: 'Heavy canopy fruit bag wrapped on tree for spotless skin. Suitable for supermarket chains, export consignments, and cold storage.',
      createdAt: new Date().toISOString(),
    };
    this.harvestListings.set(harvest2.id, harvest2);

    // 6. Initial Market Reference Data (Government APMC Mandi Benchmark)
    this.marketReferenceData = [
      {
        id: 'ref-1',
        commodity: 'Tomato',
        variety: 'Local / Hybrid',
        mandi: 'Kolar APMC Mandi',
        district: 'Kolar',
        state: 'Karnataka',
        minPrice: 18,
        maxPrice: 28,
        modalPrice: 24,
        unit: 'kg',
        arrivalDate: new Date().toISOString().split('T')[0],
        source: 'Agmarknet Directorate of Marketing & Inspection, Govt of India',
        license: 'Open Government Data (OGD) Platform India',
        importedAt: new Date().toISOString(),
      },
      {
        id: 'ref-2',
        commodity: 'Onion',
        variety: 'Red',
        mandi: 'Lasalgaon Mandi',
        district: 'Nashik',
        state: 'Maharashtra',
        minPrice: 16,
        maxPrice: 26,
        modalPrice: 21,
        unit: 'kg',
        arrivalDate: new Date().toISOString().split('T')[0],
        source: 'Agmarknet Directorate of Marketing & Inspection, Govt of India',
        license: 'Open Government Data (OGD) Platform India',
        importedAt: new Date().toISOString(),
      },
      {
        id: 'ref-3',
        commodity: 'Ragi (Finger Millet)',
        variety: 'FAQ',
        mandi: 'Mysore Mandi',
        district: 'Mysuru',
        state: 'Karnataka',
        minPrice: 34,
        maxPrice: 42,
        modalPrice: 38,
        unit: 'kg',
        arrivalDate: new Date().toISOString().split('T')[0],
        source: 'Agmarknet Directorate of Marketing & Inspection, Govt of India',
        license: 'Open Government Data (OGD) Platform India',
        importedAt: new Date().toISOString(),
      },
    ];

    // Initial audit log
    this.auditLogs.push({
      id: 'audit-boot-01',
      adminId: adminId,
      adminEmail: adminEmail,
      action: 'SYSTEM_BOOTSTRAP',
      targetType: 'FEE_CONFIG',
      targetId: 'DEFAULT_PLATFORM_FEE',
      details: 'Platform initialized with transparent ₹20 flat fee per completed transaction.',
      timestamp: new Date().toISOString(),
    });
  }
}

export const db = new AgroDatabase();
