import { LanguageCode } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    marketplace: string;
    directHarvest: string;
    aiAssistant: string;
    howItWorks: string;
    about: string;
    login: string;
    register: string;
    farmerPortal: string;
    buyerPortal: string;
    adminPortal: string;
    cart: string;
    profile: string;
    logout: string;
  };
  hero: {
    title: string;
    subtitle: string;
    browseBtn: string;
    sellBtn: string;
    badge: string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    filterByState: string;
    filterByFarming: string;
    sortBy: string;
    priceLowToHigh: string;
    priceHighToLow: string;
    quantity: string;
    harvestDate: string;
    farmer: string;
    location: string;
    addToCart: string;
    buyNow: string;
    approachFarmer: string;
    noProductsFound: string;
    verifiedFarmer: string;
    organic: string;
    conventional: string;
    natural: string;
  };
  directHarvest: {
    title: string;
    subtitle: string;
    approachModalTitle: string;
    expectedHarvest: string;
    expectedYield: string;
    minPledge: string;
    enterQty: string;
    offerPrice: string;
    preferredDate: string;
    deliveryLocation: string;
    notes: string;
    submitProposal: string;
    counterOffer: string;
    acceptProposal: string;
    rejectProposal: string;
    activeNegotiations: string;
  };
  agreement: {
    title: string;
    subtitle: string;
    farmerDetails: string;
    buyerDetails: string;
    productDetails: string;
    priceBreakdown: string;
    productSubtotal: string;
    platformFee: string;
    platformFeeNotice: string;
    totalAmount: string;
    termsHeader: string;
    farmerAcceptance: string;
    buyerAcceptance: string;
    signAgreement: string;
    statusAccepted: string;
    statusPending: string;
    downloadPdf: string;
  };
  aiTools: {
    cropRecommender: string;
    pricePredictor: string;
    demandPredictor: string;
    agrobot: string;
    voiceAssistant: string;
    selectSoil: string;
    selectState: string;
    selectSeason: string;
    getRecommendation: string;
    predictPrice: string;
    disclaimer: string;
  };
  voice: {
    listening: string;
    clickToSpeak: string;
    speakCommandPrompt: string;
    browserNotSupported: string;
  };
  offline: {
    offlineMode: string;
    cachedDataMsg: string;
    actionRequiresOnline: string;
    syncing: string;
    onlineRestored: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    empty: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    appName: 'AgroDirect',
    tagline: 'Redefining the journey from Farm to Market',
    nav: {
      home: 'Home',
      marketplace: 'Marketplace',
      directHarvest: 'Direct Harvest',
      aiAssistant: 'AI AgroTools',
      howItWorks: 'How It Works',
      about: 'About',
      login: 'Sign In',
      register: 'Join AgroDirect',
      farmerPortal: 'Farmer Portal',
      buyerPortal: 'Buyer Portal',
      adminPortal: 'Admin CMS',
      cart: 'Cart',
      profile: 'My Account',
      logout: 'Sign Out',
    },
    hero: {
      title: 'Direct From Earth to Every Market Table.',
      subtitle: 'Eliminate exploitative middlemen with transparent ₹20 flat fees, AI price intelligence, pre-harvest negotiations, and legally secure digital trade agreements.',
      browseBtn: 'Explore Marketplace',
      sellBtn: 'Sell Your Harvest',
      badge: '100% Direct Farm-to-Buyer Ecosystem',
    },
    marketplace: {
      title: 'Agricultural Produce Marketplace',
      subtitle: 'Browse authentic harvests direct from verified cultivators across India.',
      searchPlaceholder: 'Search crops, grains, pulses, fruits, vegetables...',
      allCategories: 'All Categories',
      filterByState: 'Filter by State',
      filterByFarming: 'Farming Method',
      sortBy: 'Sort by',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      quantity: 'Available Quantity',
      harvestDate: 'Harvest Date',
      farmer: 'Farmer',
      location: 'Location',
      addToCart: 'Add to Cart',
      buyNow: 'Direct Buy',
      approachFarmer: 'Approach Farmer',
      noProductsFound: 'No products currently listed matching your criteria.',
      verifiedFarmer: 'Verified Cultivator',
      organic: 'Certified Organic',
      conventional: 'Conventional',
      natural: 'Zero-Budget Natural',
    },
    directHarvest: {
      title: 'Direct Upcoming Harvest Pipeline',
      subtitle: 'Lock in harvest contracts before crops are cut. Zero intermediary commissions.',
      approachModalTitle: 'Approach Farmer for Forward Harvest',
      expectedHarvest: 'Expected Harvest Date',
      expectedYield: 'Projected Total Yield',
      minPledge: 'Minimum Order Quantity',
      enterQty: 'Requested Quantity',
      offerPrice: 'Offered Price Per Unit (₹)',
      preferredDate: 'Preferred Delivery Date',
      deliveryLocation: 'Delivery / Pickup Location',
      notes: 'Terms or Specific Requirements',
      submitProposal: 'Submit Harvest Proposal',
      counterOffer: 'Send Counter-Offer',
      acceptProposal: 'Accept & Generate Digital Agreement',
      rejectProposal: 'Decline Offer',
      activeNegotiations: 'Active Harvest Negotiations',
    },
    agreement: {
      title: 'AGRODIRECT FARMER-BUYER DIGITAL AGREEMENT',
      subtitle: 'Binding Forward Contract with Transparent Fee Structure',
      farmerDetails: 'Cultivator (Seller) Details',
      buyerDetails: 'Procuring Entity (Buyer) Details',
      productDetails: 'Harvest Specifications',
      priceBreakdown: 'Financial Breakdown',
      productSubtotal: 'Crop Subtotal',
      platformFee: 'AgroDirect Platform Service Fee',
      platformFeeNotice: 'AgroDirect charges a transparent flat fee of ₹20 per completed transaction to maintain digital escrow and verification infrastructure.',
      totalAmount: 'Total Transaction Value',
      termsHeader: 'Terms & Conditions',
      farmerAcceptance: 'Farmer Digital Signature',
      buyerAcceptance: 'Buyer Digital Signature',
      signAgreement: 'Confirm & Sign Agreement',
      statusAccepted: 'Legally Executed Agreement',
      statusPending: 'Awaiting Counterparty Acceptance',
      downloadPdf: 'Download Agreement Copy',
    },
    aiTools: {
      cropRecommender: 'AI Crop Recommendation',
      pricePredictor: 'Mandi Price Predictor',
      demandPredictor: 'Regional Demand Intelligence',
      agrobot: 'Agrobot AI Agricultural Copilot',
      voiceAssistant: 'Farmer Voice Assistant',
      selectSoil: 'Soil Characteristic',
      selectState: 'Select State & Mandi Zone',
      selectSeason: 'Cropping Season',
      getRecommendation: 'Run Agronomic Analysis',
      predictPrice: 'Generate Price Forecast',
      disclaimer: 'Advisory Note: AI predictions are decision-support estimates based on historical market trends and agronomic models. Always consider local weather and Mandi dynamics.',
    },
    voice: {
      listening: 'Listening to your query...',
      clickToSpeak: 'Tap Microphone & Speak in your language',
      speakCommandPrompt: 'Speak crop names, price queries, or ask farming advice...',
      browserNotSupported: 'Speech recognition is not supported in this browser. Please use text input.',
    },
    offline: {
      offlineMode: 'Offline Mode Active',
      cachedDataMsg: 'You are viewing cached marketplace data and local drafts.',
      actionRequiresOnline: 'This action requires an active internet connection to securely synchronize.',
      syncing: 'Syncing local drafts with server...',
      onlineRestored: 'Internet Connection Restored. System Synced.',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Operation completed successfully',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save Changes',
      edit: 'Edit',
      delete: 'Delete',
      empty: 'No items to display',
    },
  },
  kn: {
    appName: 'ಅಗ್ರೋಡೈರೆಕ್ಟ್ (AgroDirect)',
    tagline: 'ರೈತನ ಹೊಲದಿಂದ ಮಾರುಕಟ್ಟೆಗೆ ನೇರ ಸಂಪರ್ಕ',
    nav: {
      home: 'ಮುಖಪುಟ',
      marketplace: 'ಮಾರುಕಟ್ಟೆ',
      directHarvest: 'ನೇರ ಕಟಾವು ಒಪ್ಪಂದ',
      aiAssistant: 'ಎಐ ಕೃಷಿ ಸಲಹೆಗಾರ',
      howItWorks: 'ಕಾರ್ಯವಿಧಾನ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      login: 'ಲಾಗಿನ್',
      register: 'ಖಾತೆ ತೆರೆಯಿರಿ',
      farmerPortal: 'ರೈತರ ಪೋರ್ಟಲ್',
      buyerPortal: 'ಖರೀದಿದಾರರ ಪೋರ್ಟಲ್',
      adminPortal: 'ಆಡಳಿತ ಮಂಡಳಿ',
      cart: 'ಬುಟ್ಟಿ',
      profile: 'ನನ್ನ ಖಾತೆ',
      logout: 'ಲಾಗ್‌ಔಟ್',
    },
    hero: {
      title: 'ರೈತರ ಭೂಮಿಯಿಂದ ನೇರವಾಗಿ ಗ್ರಾಹಕರ ಮನೆ ಬಾಗಿಲಿಗೆ.',
      subtitle: 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ಕೇವಲ ₹20 ನಿಗದಿತ ಶುಲ್ಕದೊಂದಿಗೆ ಎಐ ಬೆಲೆ ಊಹೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಕೃಷಿ ಒಪ್ಪಂದಗಳ ಮೂಲಕ ವ್ಯಾಪಾರ ಮಾಡಿ.',
      browseBtn: 'ಮಾರುಕಟ್ಟೆ ನೋಡಿ',
      sellBtn: 'ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ',
      badge: '100% ನೇರ ರೈತ-ಖರೀದಿದಾರ ವೇದಿಕೆ',
    },
    marketplace: {
      title: 'ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ನೇರ ಮಾರುಕಟ್ಟೆ',
      subtitle: 'ಕರ್ನಾಟಕ ಹಾಗೂ ಭಾರತದ ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ.',
      searchPlaceholder: 'ತರಕಾರಿ, ಹಣ್ಣು, ಧಾನ್ಯ, ಕಾಳುಗಳನ್ನು ಹುಡುಕಿ...',
      allCategories: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು',
      filterByState: 'ರಾಜ್ಯದ ಪ್ರಕಾರ ಫಿಲ್ಟರ್',
      filterByFarming: 'ಬೇಸಾಯ ಪದ್ಧತಿ',
      sortBy: 'ವಿಂಗಡಿಸಿ',
      priceLowToHigh: 'ಬೆಲೆ: ಕಡಿಮೆಯಿಂದ ಹೆಚ್ಚು',
      priceHighToLow: 'ಬೆಲೆ: ಹೆಚ್ಚಿಂದ ಕಡಿಮೆ',
      quantity: 'ಲಭ್ಯವಿರುವ ಪ್ರಮಾಣ',
      harvestDate: 'ಕಟಾವು ದಿನಾಂಕ',
      farmer: 'ರೈತ',
      location: 'ಸ್ಥಳ',
      addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
      buyNow: 'ನೇರ ಖರೀದಿ',
      approachFarmer: 'ರೈತರನ್ನು ಸಂಪರ್ಕಿಸಿ',
      noProductsFound: 'ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ದೊರೆತಿಲ್ಲ.',
      verifiedFarmer: 'ದೃಢೀಕೃತ ರೈತ',
      organic: 'ಸಾವಯವ ಬೆಳೆ',
      conventional: 'ಸಾಂಪ್ರದಾಯಿಕ',
      natural: 'ಶೂನ್ಯ ಬಂಡವಾಳ ನೈಸರ್ಗಿಕ ಕೃಷಿ',
    },
    directHarvest: {
      title: 'ಮುಂದಿನ ಕಟಾವಿನ ನೇರ ಬುಕಿಂಗ್',
      subtitle: 'ಬೆಳೆ ಕಟಾವಿಗೆ ಬರುವ ಮೊದಲೇ ರೈತರೊಂದಿಗೆ ನೇರ ಒಪ್ಪಂದ ಮಾಡಿಕೊಳ್ಳಿ.',
      approachModalTitle: 'ಕಟಾವಿಗಾಗಿ ರೈತರೊಂದಿಗೆ ಮಾತುಕತೆ',
      expectedHarvest: 'ನಿರೀಕ್ಷಿತ ಕಟಾವು ದಿನಾಂಕ',
      expectedYield: 'ನಿರೀಕ್ಷಿತ ಒಟ್ಟು ಇಳುವರಿ',
      minPledge: 'ಕನಿಷ್ಠ ಖರೀದಿ ಪ್ರಮಾಣ',
      enterQty: 'ನಿಮಗೆ ಬೇಕಾದ ಪ್ರಮಾಣ',
      offerPrice: 'ನೀವು ನೀಡುವ ಬೆಲೆ (₹)',
      preferredDate: 'ಡೆಲಿವರಿ ದಿನಾಂಕ',
      deliveryLocation: 'ಡೆಲಿವರಿ ಸ್ಥಳ',
      notes: 'ನಿಮ್ಮ ಷರತ್ತುಗಳು',
      submitProposal: 'ಪ್ರಸ್ತಾವನೆ ಕಳುಹಿಸಿ',
      counterOffer: 'ಪ್ರತಿ ಪ್ರಸ್ತಾಪ ಕಳುಹಿಸಿ',
      acceptProposal: 'ಒಪ್ಪಿಕೊಂಡು ಒಪ್ಪಂದ ರಚಿಸಿ',
      rejectProposal: 'ತಿರಸ್ಕರಿಸಿ',
      activeNegotiations: 'ಸಕ್ರಿಯ ಮಾತುಕತೆಗಳು',
    },
    agreement: {
      title: 'ಅಗ್ರೋಡೈರೆಕ್ಟ್ ರೈತ-ಖರೀದಿದಾರ ಡಿಜಿಟಲ್ ಒಪ್ಪಂದ',
      subtitle: 'ಪಾರದರ್ಶಕ ಶುಲ್ಕದೊಂದಿಗೆ ಕಾನೂನುಬದ್ಧ ಡಿಜಿಟಲ್ ಕೃಷಿ ಕರಾರು',
      farmerDetails: 'ರೈತರ (ಮಾರಾಟಗಾರ) ವಿವರ',
      buyerDetails: 'ಖರೀದಿದಾರರ ವಿವರ',
      productDetails: 'ಬೆಳೆಯ ವಿವರ',
      priceBreakdown: 'ದರ ವಿವರಣೆ',
      productSubtotal: 'ಬೆಳೆಯ ಮೊತ್ತ',
      platformFee: 'ಅಗ್ರೋಡೈರೆಕ್ಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ (₹20)',
      platformFeeNotice: 'ಡಿಜಿಟಲ್ ಕರಾರು ಮತ್ತು ಭದ್ರತೆಗಾಗಿ ಕೇವಲ ₹20 ಪಾರದರ್ಶಕ ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ.',
      totalAmount: 'ಒಟ್ಟು ಮೊತ್ತ',
      termsHeader: 'ನಿಯಮ ಮತ್ತು ಷರತ್ತುಗಳು',
      farmerAcceptance: 'ರೈತರ ಡಿಜಿಟಲ್ ಸಹಿ',
      buyerAcceptance: 'ಖರೀದಿದಾರರ ಡಿಜಿಟಲ್ ಸಹಿ',
      signAgreement: 'ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ ಮಾಡಿ',
      statusAccepted: 'ಪೂರ್ಣಗೊಂಡ ಒಪ್ಪಂದ',
      statusPending: 'ಇನ್ನೊಬ್ಬರ ಒಪ್ಪಿಗೆಗಾಗಿ ಬಾಕಿ',
      downloadPdf: 'ಒಪ್ಪಂದದ ಪ್ರತಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    },
    aiTools: {
      cropRecommender: 'ಎಐ ಬೆಳೆ ಶಿಫಾರಸು',
      pricePredictor: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮುನ್ಸೂಚನೆ',
      demandPredictor: 'ಬೇಡಿಕೆ ವಿಶ್ಲೇಷಣೆ',
      agrobot: 'ಅಗ್ರೋಬಾಟ್ (Agrobot) ಕೃಷಿ ಮಿತ್ರ',
      voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕ (Voice Assistant)',
      selectSoil: 'ಮಣ್ಣಿನ ವಿಧ',
      selectState: 'ರಾಜ್ಯ ಮತ್ತು ಮಾರುಕಟ್ಟೆ',
      selectSeason: 'ಕೃಷಿ ಋತು (Kharif/Rabi)',
      getRecommendation: 'ವಿಶ್ಲೇಷಿಸಿ',
      predictPrice: 'ಬೆಲೆ ಊಹಿಸಿ',
      disclaimer: 'ಗಮನಿಸಿ: ಎಐ ಸಲಹೆಗಳು ಮಾರುಕಟ್ಟೆ ಮಾದರಿಗಳ ಆಧಾರದ ಮೇಲಿನ ಅಂದಾಜುಗಳು.',
    },
    voice: {
      listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ, ಮಾತನಾಡಿ...',
      clickToSpeak: 'ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ',
      speakCommandPrompt: 'ಬೆಳೆಗಳ ಬೆಲೆ ಅಥವಾ ಕೃಷಿ ಸಲಹೆ ಕೇಳಿ...',
      browserNotSupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ.',
    },
    offline: {
      offlineMode: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
      cachedDataMsg: 'ಉಳಿಸಿದ ಮಾಹಿತಿಯನ್ನು ನೋಡುತ್ತಿದ್ದೀರಿ.',
      actionRequiresOnline: 'ಈ ಕ್ರಿಯೆಗೆ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಅಗತ್ಯವಿದೆ.',
      syncing: 'ಮಾಹಿತಿ ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತಿದೆ...',
      onlineRestored: 'ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ.',
    },
    common: {
      loading: 'ದಯವಿಟ್ಟು ಕಾಯಿರಿ...',
      error: 'ದೋಷ ಸಂಭವಿಸಿದೆ',
      success: 'ಯಶಸ್ವಿಯಾಗಿದೆ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      confirm: 'ದೃಢೀಕರಿಸಿ',
      save: 'ಉಳಿಸಿ',
      edit: 'ತಿದ್ದಿ',
      delete: 'ಅಳಿಸಿ',
      empty: 'ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
    },
  },
  hi: {
    appName: 'एग्रोडायरेक्ट (AgroDirect)',
    tagline: 'खेत से सीधे मंडी तक - बिचौलियों से मुक्ति',
    nav: {
      home: 'होम',
      marketplace: 'मंडी / बाज़ार',
      directHarvest: 'सीधी फसल खरीद',
      aiAssistant: 'एआई कृषि मित्र',
      howItWorks: 'यह कैसे काम करता है',
      about: 'हमारे बारे में',
      login: 'लॉग इन',
      register: 'रजिस्टर करें',
      farmerPortal: 'किसान पोर्टल',
      buyerPortal: 'खरीदार पोर्टल',
      adminPortal: 'एडमिन पैनल',
      cart: 'कार्ट',
      profile: 'मेरा खाता',
      logout: 'लॉग आउट',
    },
    hero: {
      title: 'सीधे खेत से हर बाज़ार तक।',
      subtitle: 'बिचौलियों को हटाएं, केवल ₹20 के पारदर्शी शुल्क पर एआई मूल्य पूर्वानुमान और सुरक्षित डिजिटल समझौतों के साथ व्यापार करें।',
      browseBtn: 'बाज़ार देखें',
      sellBtn: 'फसल बेचें',
      badge: '100% सीधा किसान-खरीदार मंच',
    },
    marketplace: {
      title: 'कृषि उपज बाज़ार',
      subtitle: 'सत्यापित किसानों से सीधे ताज़ी उपज खरीदें।',
      searchPlaceholder: 'फसलें, अनाज, दालें, फल और सब्जियां खोजें...',
      allCategories: 'सभी श्रेणियां',
      filterByState: 'राज्य के अनुसार',
      filterByFarming: 'खेती का प्रकार',
      sortBy: 'क्रमबद्ध करें',
      priceLowToHigh: 'कीमत: कम से ज्यादा',
      priceHighToLow: 'कीमत: ज्यादा से कम',
      quantity: 'उपलब्ध मात्रा',
      harvestDate: 'कटाई की तारीख',
      farmer: 'किसान',
      location: 'स्थान',
      addToCart: 'कार्ट में जोड़ें',
      buyNow: 'सीधे खरीदें',
      approachFarmer: 'किसान से बात करें',
      noProductsFound: 'कोई उत्पाद नहीं मिला।',
      verifiedFarmer: 'सत्यापित किसान',
      organic: 'प्रमाणित जैविक',
      conventional: 'पारंपरिक',
      natural: 'प्राकृतिक खेती',
    },
    directHarvest: {
      title: 'आगामी फसल की सीधी बुकिंग',
      subtitle: 'कटाई से पहले ही खरीदार और किसान के बीच सीधा सौदा।',
      approachModalTitle: 'फसल के लिए किसान से संपर्क करें',
      expectedHarvest: 'अनुमानित कटाई तिथि',
      expectedYield: 'कुल अनुमानित उपज',
      minPledge: 'न्यूनतम ऑर्डर मात्रा',
      enterQty: 'आवश्यक मात्रा',
      offerPrice: 'प्रस्तावित मूल्य (₹ प्रति इकाई)',
      preferredDate: 'डिलीवरी की तारीख',
      deliveryLocation: 'डिलीवरी का स्थान',
      notes: 'शर्तें व विशेष विवरण',
      submitProposal: 'प्रस्ताव भेजें',
      counterOffer: 'काउंटर ऑफर भेजें',
      acceptProposal: 'स्वीकार करें व अनुबंध बनाएं',
      rejectProposal: 'अस्वीकार करें',
      activeNegotiations: 'सक्रिय सौदे',
    },
    agreement: {
      title: 'एग्रोडायरेक्ट किसान-खरीदार डिजिटल अनुबंध',
      subtitle: 'पारदर्शी ₹20 शुल्क के साथ कानूनी डिजिटल समझौता',
      farmerDetails: 'किसान (विक्रेता) विवरण',
      buyerDetails: 'खरीदार विवरण',
      productDetails: 'फसल विवरण',
      priceBreakdown: 'मूल्य विवरण',
      productSubtotal: 'उपज का मूल्य',
      platformFee: 'एग्रोडायरेक्ट मंच शुल्क (₹20)',
      platformFeeNotice: 'एग्रोडायरेक्ट सुरक्षित डिजिटल एस्क्रो के लिए प्रति लेनदेन केवल ₹20 का पारदर्शी शुल्क लेता है।',
      totalAmount: 'कुल देय राशि',
      termsHeader: 'नियम एवं शर्तें',
      farmerAcceptance: 'किसान के डिजिटल हस्ताक्षर',
      buyerAcceptance: 'खरीदार के डिजिटल हस्ताक्षर',
      signAgreement: 'अनुबंध पर हस्ताक्षर करें',
      statusAccepted: 'हस्ताक्षरित एवं वैध अनुबंध',
      statusPending: 'स्वीकृति की प्रतीक्षा में',
      downloadPdf: 'अनुबंध डाउनलोड करें',
    },
    aiTools: {
      cropRecommender: 'एआई फसल सिफारिश',
      pricePredictor: 'मंडी भाव पूर्वानुमान',
      demandPredictor: 'मांग विश्लेषण',
      agrobot: 'एग्रोबॉट (Agrobot) एआई सलाहकार',
      voiceAssistant: 'किसान वॉइस असिस्टेंट',
      selectSoil: 'मिट्टी का प्रकार',
      selectState: 'राज्य एवं जिला',
      selectSeason: 'फसल का मौसम (खरीफ/रबी)',
      getRecommendation: 'सलाह प्राप्त करें',
      predictPrice: 'मूल्य का अनुमान लगाएं',
      disclaimer: 'सलाह: एआई अनुमान ऐतिहासिक मंडी आंकड़ों पर आधारित हैं।',
    },
    voice: {
      listening: 'सुन रहे हैं, कृपया बोलें...',
      clickToSpeak: 'माइक दबाएं और हिंदी में बोलें',
      speakCommandPrompt: 'फसल के भाव पूछें या खेती की सलाह लें...',
      browserNotSupported: 'इस ब्राउज़र में वॉइस सुविधा समर्थित नहीं है।',
    },
    offline: {
      offlineMode: 'ऑफ़लाइन मोड सक्रिय है',
      cachedDataMsg: 'आप सहेजा गया डेटा देख रहे हैं।',
      actionRequiresOnline: 'इस कार्य के लिए इंटरनेट आवश्यक है।',
      syncing: 'डेटा सिंक हो रहा है...',
      onlineRestored: 'इंटरनेट कनेक्शन पुनः स्थापित।',
    },
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि हुई',
      success: 'सफलतापूर्वक संपन्न',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      save: 'सहेजें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      empty: 'कोई डेटा नहीं',
    },
  },
  te: {
    appName: 'అగ్రోడైరెక్ట్ (AgroDirect)',
    tagline: 'రైతు పొలం నుండి నేరుగా మార్కెట్ కు',
    nav: {
      home: 'హోమ్',
      marketplace: 'మార్కెట్',
      directHarvest: 'నేరుగా కోత ఒప్పందం',
      aiAssistant: 'ఏఐ వ్యవసాయ సహాయకుడు',
      howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
      about: 'మా గురించి',
      login: 'లాగిన్',
      register: 'ఖాతా తెరవండి',
      farmerPortal: 'రైతు పోర్టల్',
      buyerPortal: 'కొనుగోలుదారుల పోర్టల్',
      adminPortal: 'అడ్మిన్ పోర్టల్',
      cart: 'కార్ట్',
      profile: 'నా ప్రొఫైల్',
      logout: 'లాగౌట్',
    },
    hero: {
      title: 'పొలం నుండి నేరుగా ప్రతి మార్కెట్‌కు.',
      subtitle: 'మధ్యవర్తులు లేకుండా కేవలం ₹20 ప్లాట్‌ఫారమ్ రుసుముతో పంటను విక్రయించండి.',
      browseBtn: 'మార్కెట్ చూడండి',
      sellBtn: 'పంట అమ్మండి',
      badge: '100% రైతు-కొనుగోలుదారు నేరు వేదిక',
    },
    marketplace: {
      title: 'వ్యవసాయ ఉత్పత్తుల మార్కెట్',
      subtitle: 'ధృవీకరించబడిన రైతుల నుండి తాజా పంటలను కొనుగోలు చేయండి.',
      searchPlaceholder: 'పంటలు, కూరగాయలు, ధాన్యాలు శోధించండి...',
      allCategories: 'అన్ని విభాగాలు',
      filterByState: 'రాష్ట్రం ప్రకారం',
      filterByFarming: 'వ్యవసాయ విధానం',
      sortBy: 'క్రమబద్ధీకరించు',
      priceLowToHigh: 'ధర: తక్కువ నుండి ఎక్కువ',
      priceHighToLow: 'ధర: ఎక్కువ నుండి తక్కువ',
      quantity: 'అందుబాటులో ఉన్న పరిమాణం',
      harvestDate: 'కోత తేదీ',
      farmer: 'రైతు',
      location: 'ప్రాంతం',
      addToCart: 'కార్ట్‌కు జోడించు',
      buyNow: 'నేరుగా కొనండి',
      approachFarmer: 'రైతును సంప్రదించండి',
      noProductsFound: 'ఉత్పత్తులు ఏవీ కనుగొనబడలేదు.',
      verifiedFarmer: 'ధృవీకరించబడిన రైతు',
      organic: 'సేంద్రీయ పంట',
      conventional: 'సాంప్రదాయ',
      natural: 'ప్రకృతి వ్యవసాయం',
    },
    directHarvest: {
      title: 'రాబోయే పంట నేరుగా ముందస్తు ఒప్పందం',
      subtitle: 'కోతకు ముందే రైతుతో నేరుగా ఒప్పందం చేసుకోండి.',
      approachModalTitle: 'రైతుతో ముందస్తు ప్రతిపాదన',
      expectedHarvest: 'నిరీక్షిత కోత తేదీ',
      expectedYield: 'మొత్తం దిగుబడి',
      minPledge: 'కనిష్ట ఆర్డర్ పరిమాణం',
      enterQty: 'కావాల్సిన పరిమాణం',
      offerPrice: 'మీరు ఇచ్చే ధర (₹)',
      preferredDate: 'డెలివరీ తేదీ',
      deliveryLocation: 'డెలివరీ ప్రాంతం',
      notes: 'ప్రత్యేక నిబంధనలు',
      submitProposal: 'ప్రతిపాదన పంపండి',
      counterOffer: 'కౌంటర్ ఆఫర్ పంపండి',
      acceptProposal: 'ఒప్పుకుని ఒప్పందం చేయండి',
      rejectProposal: 'తిరస్కరించు',
      activeNegotiations: 'చురుకైన చర్చలు',
    },
    agreement: {
      title: 'అగ్రోడైరెక్ట్ రైతు-కొనుగోలుదారు డిజిటల్ ఒప్పందం',
      subtitle: 'పారదర్శక ₹20 ఫీజుతో చట్టపరమైన డిజిటల్ ఒప్పందం',
      farmerDetails: 'రైతు వివరాలు',
      buyerDetails: 'కొనుగోలుదారు వివరాలు',
      productDetails: 'పంట వివరాలు',
      priceBreakdown: 'ధర విశ్లేషణ',
      productSubtotal: 'ఉత్పత్తి విలువ',
      platformFee: 'అగ్రోడైరెక్ట్ ప్లాట్‌ఫారమ్ రుసుము (₹20)',
      platformFeeNotice: 'కేవలం ₹20 పారదర్శక రుసుముతో పూర్తి భద్రత.',
      totalAmount: 'మొత్తం చెల్లించవలసిన మొత్తం',
      termsHeader: 'నిబంధనలు & షరతులు',
      farmerAcceptance: 'రైతు డిజిటల్ సంతకం',
      buyerAcceptance: 'కొనుగోలుదారు డిజిటల్ సంతకం',
      signAgreement: 'ఒప్పందంపై సంతకం చేయండి',
      statusAccepted: 'పూర్తయిన ఒప్పందం',
      statusPending: 'ఆమోదం కోసం నిరీక్షిస్తోంది',
      downloadPdf: 'ఒప్పంద పత్రం డౌన్‌లోడ్ చేయండి',
    },
    aiTools: {
      cropRecommender: 'ఏఐ పంట సిఫార్సు',
      pricePredictor: 'మార్కెట్ ధర అంచనా',
      demandPredictor: 'డిమాండ్ విశ్లేషణ',
      agrobot: 'అగ్రోబాట్ ఏఐ సహాయకుడు',
      voiceAssistant: 'రైతు వాయిస్ అసిస్టెంట్',
      selectSoil: 'నేల రకం',
      selectState: 'రాష్ట్రం మరియు జిల్లా',
      selectSeason: 'పంట కాలం',
      getRecommendation: 'విశ్లేషణ పొందండి',
      predictPrice: 'ధర అంచనా వేయండి',
      disclaimer: 'గమనిక: ఏఐ అంచనాలు మార్కెట్ రికార్డుల ఆధారంగా రూపొందించబడినవి.',
    },
    voice: {
      listening: 'వింటున్నాము, మాట్లాడండి...',
      clickToSpeak: 'మైక్ నొక్కి తెలుగులో మాట్లాడండి',
      speakCommandPrompt: 'పంటల ధరలు లేదా వ్యవసాయ సలహాలు అడగండి...',
      browserNotSupported: 'ఈ బ్రౌజర్‌లో వాయిస్ సదుపాయం అందుబాటులో లేదు.',
    },
    offline: {
      offlineMode: 'ఆఫ్‌లైన్ మోడ్ ఆన్‌లో ఉంది',
      cachedDataMsg: 'సేవ్ చేసిన సమాచారాన్ని చూస్తున్నారు.',
      actionRequiresOnline: 'దీనికి ఇంటర్నెట్ అవసరం.',
      syncing: 'సమాచారం అప్‌డేట్ అవుతోంది...',
      onlineRestored: 'ఇంటర్నెట్ కనెక్షన్ పునరుద్ధరించబడింది.',
    },
    common: {
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం జరిగింది',
      success: 'విజయవంతమైంది',
      cancel: 'రద్దు చేయి',
      confirm: 'నిర్ధారించు',
      save: 'సేవ్ చేయి',
      edit: 'సవరించు',
      delete: 'తొలగించు',
      empty: 'సమాచారం లేదు',
    },
  },
  ta: {
    appName: 'அக்ரோடைரக்ட் (AgroDirect)',
    tagline: 'பண்ணையிலிருந்து சந்தைக்கு நேரடி இணைப்பு',
    nav: {
      home: 'முகப்பு',
      marketplace: 'சந்தை',
      directHarvest: 'நேரடி அறுவடை ஒப்பந்தம்',
      aiAssistant: 'AI வேளாண் வழிகாட்டி',
      howItWorks: 'செயல்முறை',
      about: 'எங்களை பற்றி',
      login: 'உள்நுழைக',
      register: 'பதிவு செய்க',
      farmerPortal: 'விவசாயி தளம்',
      buyerPortal: 'வாங்குபவர் தளம்',
      adminPortal: 'நிர்வாக தளம்',
      cart: 'கார்ட்',
      profile: 'என் கணக்கு',
      logout: 'வெளியேறு',
    },
    hero: {
      title: 'மண்ணிலிருந்து நேரடியாக ஒவ்வொரு சந்தைக்கும்.',
      subtitle: 'இடைத்தரகர்கள் இன்றி வெறும் ₹20 கட்டணத்தில் AI விலை வழிகாட்டலுடன் விவசாயம் செய்யுங்கள்.',
      browseBtn: 'சந்தையை காண்க',
      sellBtn: 'பயிர் விற்க',
      badge: '100% நேரடி விவசாயி-வாங்குபவர் தளம்',
    },
    marketplace: {
      title: 'விவசாய விளைபொருட்கள் சந்தை',
      subtitle: 'சரிபார்க்கப்பட்ட விவசாயிகளிடமிருந்து நேரடியாக வாங்குங்கள்.',
      searchPlaceholder: 'தானியங்கள், காய்கறிகள், பழங்கள் தேடுங்கள்...',
      allCategories: 'அனைத்து பிரிவுகள்',
      filterByState: 'மாநிலம் வாரியாக',
      filterByFarming: 'விவசாய முறை',
      sortBy: 'வரிசைப்படுத்து',
      priceLowToHigh: 'விலை: குறைவிலிருந்து அதிகம்',
      priceHighToLow: 'விலை: அதிகத்திலிருந்து குறைவு',
      quantity: 'கிடைக்கும் அளவு',
      harvestDate: 'அறுவடை தேதி',
      farmer: 'விவசாயி',
      location: 'இடம்',
      addToCart: 'கார்ட்டில் சேர்',
      buyNow: 'நேரடி வாங்குதல்',
      approachFarmer: 'விவசாயியை அணுகவும்',
      noProductsFound: 'பொருட்கள் எதுவும் கிடைக்கவில்லை.',
      verifiedFarmer: 'சரிபார்க்கப்பட்ட விவசாயி',
      organic: 'இயற்கை விவசாயம்',
      conventional: 'வழக்கமான முறை',
      natural: 'ஜீரோ பட்ஜெட் இயற்கை விவசாயம்',
    },
    directHarvest: {
      title: 'முன்கூட்டியே அறுவடை முன்பதிவு',
      subtitle: 'பயிர் அறுவடைக்கு முன்பே வாங்குபவருடன் நேரடி ஒப்பந்தம்.',
      approachModalTitle: 'அறுவடைக்காக விவசாயியுடன் பேசுங்கள்',
      expectedHarvest: 'எதிர்பார்க்கப்படும் அறுவடை தேதி',
      expectedYield: 'மொத்த மகசூல்',
      minPledge: 'குறைந்தபட்ச அளவு',
      enterQty: 'தேவையான அளவு',
      offerPrice: 'நீங்கள் வழங்கும் விலை (₹)',
      preferredDate: 'டெலிவரி தேதி',
      deliveryLocation: 'டெலிவரி இடம்',
      notes: 'விதிமுறைகள்',
      submitProposal: 'முன்மொழிவை அனுப்பு',
      counterOffer: 'மாற்று விலை அனுப்பு',
      acceptProposal: 'ஏற்று ஒப்பந்தம் செய்',
      rejectProposal: 'நிராகரி',
      activeNegotiations: 'செயலில் உள்ள பேச்சுவார்த்தைகள்',
    },
    agreement: {
      title: 'அக்ரோடைரக்ட் விவசாயி-வாங்குபவர் டிஜிட்டல் ஒப்பந்தம்',
      subtitle: 'வெளிப்படையான ₹20 கட்டணத்துடன் சட்டப்பூர்வ டிஜிட்டல் ஒப்பந்தம்',
      farmerDetails: 'விவசாயி விவரங்கள்',
      buyerDetails: 'வாங்குபவர் விவரங்கள்',
      productDetails: 'விளைபொருள் விவரங்கள்',
      priceBreakdown: 'விலை விவரம்',
      productSubtotal: 'விளைபொருள் தொகை',
      platformFee: 'அக்ரோடைரக்ட் தள கட்டணம் (₹20)',
      platformFeeNotice: 'பாதுகாப்பான டிஜிட்டல் பரிவர்த்தனைக்கு வெறும் ₹20 நிலையான கட்டணம்.',
      totalAmount: 'மொத்த தொகை',
      termsHeader: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
      farmerAcceptance: 'விவசாயி டிஜிட்டல் கையொப்பம்',
      buyerAcceptance: 'வாங்குபவர் டிஜிட்டல் கையொப்பம்',
      signAgreement: 'ஒப்பந்தத்தில் கையொப்பமிடு',
      statusAccepted: 'நிறைவடைந்த ஒப்பந்தம்',
      statusPending: 'ஏற்புக்காக காத்திருக்கிறது',
      downloadPdf: 'ஒப்பந்தத்தை பதிவிறக்கு',
    },
    aiTools: {
      cropRecommender: 'AI பயிர் பரிந்துரை',
      pricePredictor: 'சந்தை விலை கணிப்பு',
      demandPredictor: 'தேவை பகுப்பாய்வு',
      agrobot: 'அக்ரோபாட் AI உதவியாளர்',
      voiceAssistant: 'விவசாயி குரல் உதவியாளர்',
      selectSoil: 'மண் வகை',
      selectState: 'மாநிலம் மற்றும் மாவட்டம்',
      selectSeason: 'பருவ காலம்',
      getRecommendation: 'பகுப்பாய்வு செய்',
      predictPrice: 'விலை கணிக்க',
      disclaimer: 'குறிப்பு: AI கணிப்புகள் வரலாற்று தரவுகளின் அடிப்படையிலானவை.',
    },
    voice: {
      listening: 'கேட்கிறோம், பேசுங்கள்...',
      clickToSpeak: 'மைக் அழுத்தி தமிழில் பேசுங்கள்',
      speakCommandPrompt: 'பயிர் விலை அல்லது விவசாய ஆலோசனைகளை கேளுங்கள்...',
      browserNotSupported: 'இந்த உலாவியில் குரல் வசதி இல்லை.',
    },
    offline: {
      offlineMode: 'ஆஃப்லைன் பயன்முறை செயலில் உள்ளது',
      cachedDataMsg: 'சேமிக்கப்பட்ட தகவல்களை பார்க்கிறீர்கள்.',
      actionRequiresOnline: 'இதற்கு இணைய இணைப்பு தேவை.',
      syncing: 'புதுப்பிக்கப்படுகிறது...',
      onlineRestored: 'இணைய இணைப்பு மீண்டும் கிடைத்தது.',
    },
    common: {
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை ஏற்பட்டது',
      success: 'வெற்றிகரமாக முடிந்தது',
      cancel: 'ரத்து செய்',
      confirm: 'உறுதி செய்',
      save: 'சேமி',
      edit: 'திருத்து',
      delete: 'நீக்கு',
      empty: 'தகவல் இல்லை',
    },
  },
  ml: {
    appName: 'അഗ്രോഡയറക്ട് (AgroDirect)',
    tagline: 'പാടത്തുനിന്ന് നേരിട്ട് വിപണിയിലേക്ക്',
    nav: {
      home: 'ഹോം',
      marketplace: 'വിപണി',
      directHarvest: 'നേരിട്ടുള്ള വിളവെടുപ്പ് കരാർ',
      aiAssistant: 'AI കാർഷിക സഹായി',
      howItWorks: 'പ്രവർത്തനരീതി',
      about: 'ഞങ്ങളെക്കുറിച്ച്',
      login: 'ലോഗിൻ',
      register: 'രജിസ്റ്റർ ചെയ്യുക',
      farmerPortal: 'കർഷക പോർട്ടൽ',
      buyerPortal: 'ഉപഭോക്തൃ പോർട്ടൽ',
      adminPortal: 'അഡ്മിൻ പാനൽ',
      cart: 'കാർട്ട്',
      profile: 'എന്റെ അക്കൗണ്ട്',
      logout: 'ലോഗ് ഔട്ട്',
    },
    hero: {
      title: 'പാടത്തുനിന്ന് നേരിട്ട് ഓരോ വിപണിയിലേക്കും.',
      subtitle: 'ഇടനിലക്കാരില്ലാതെ കേവലം ₹20 പ്ലാറ്റ്‌ഫോം ഫീസിൽ AI വില വിശകലനത്തോടെ സുരക്ഷിതമായി വ്യാപാരം ചെയ്യുക.',
      browseBtn: 'വിപണി കാണുക',
      sellBtn: 'വിളവ് വിൽക്കുക',
      badge: '100% നേരിട്ടുള്ള കർഷക-ഉപഭോക്തൃ വേദി',
    },
    marketplace: {
      title: 'കാർഷിക ഉൽപ്പന്ന വിപണി',
      subtitle: 'കർഷകരിൽ നിന്ന് നേരിട്ട് ശുദ്ധമായ ഉൽപ്പന്നങ്ങൾ വാങ്ങൂ.',
      searchPlaceholder: 'പച്ചക്കറികൾ, പഴങ്ങൾ, ധാന്യങ്ങൾ തിരയുക...',
      allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
      filterByState: 'സംസ്ഥാനം തിരിച്ച്',
      filterByFarming: 'കൃഷിരീതി',
      sortBy: 'ക്രമീകരിക്കുക',
      priceLowToHigh: 'വില: കുറഞ്ഞതിൽ നിന്ന് കൂടിയതിലേക്ക്',
      priceHighToLow: 'വില: കൂടിയതിൽ നിന്ന് കുറഞ്ഞതിലേക്ക്',
      quantity: 'ലഭ്യമായ അളവ്',
      harvestDate: 'വിളവെടുപ്പ് തീയതി',
      farmer: 'കർഷകൻ',
      location: 'സ്ഥലം',
      addToCart: 'കാർട്ടിലേക്ക് ചേർക്കുക',
      buyNow: 'നേരിട്ട് വാങ്ങുക',
      approachFarmer: 'കർഷകനുമായി സംസാരിക്കുക',
      noProductsFound: 'ഉൽപ്പന്നങ്ങൾ ലഭ്യമല്ല.',
      verifiedFarmer: 'പരിശോധിച്ചുറപ്പിച്ച കർഷകൻ',
      organic: 'ജൈവ കൃഷി',
      conventional: 'പരമ്പരാഗതം',
      natural: 'പ്രകൃതി കൃഷി',
    },
    directHarvest: {
      title: 'വരാനിരിക്കുന്ന വിളവ് നേരിട്ട് മുൻകൂർ ബുക്കിംഗ്',
      subtitle: 'വിളവെടുപ്പിന് മുമ്പുതന്നെ കർഷകരുമായി നേരിട്ടുള്ള കരാർ.',
      approachModalTitle: 'വിളവെടുപ്പിനായി കർഷകനെ സമീപിക്കുക',
      expectedHarvest: 'പ്രതീക്ഷിക്കുന്ന വിളവെടുപ്പ് തീയതി',
      expectedYield: 'പ്രതീക്ഷിക്കുന്ന മൊത്തം ഉത്പാദനം',
      minPledge: 'കുറഞ്ഞ അളവ്',
      enterQty: 'ആവശ്യമായ അളവ്',
      offerPrice: 'നിങ്ങൾ നൽകുന്ന വില (₹)',
      preferredDate: 'ഡെലിവറി തീയതി',
      deliveryLocation: 'ഡെലിവറി സ്ഥലം',
      notes: 'നിബന്ധനകൾ',
      submitProposal: 'നിർദ്ദേശം അയക്കുക',
      counterOffer: 'മറുപടി ഓഫർ അയക്കുക',
      acceptProposal: 'സ്വീകരിച്ച് കരാർ ഉണ്ടാക്കുക',
      rejectProposal: 'നിരസിക്കുക',
      activeNegotiations: 'സജീവ ചർച്ചകൾ',
    },
    agreement: {
      title: 'അഗ്രോഡയറക്ട് കർഷക-ഉപഭോക്തൃ ഡിജിറ്റൽ കരാർ',
      subtitle: 'സുതാര്യമായ ₹20 ഫീസോടെ നിയമപരമായ ഡിജിറ്റൽ കരാർ',
      farmerDetails: 'കർഷകന്റെ വിവരങ്ങൾ',
      buyerDetails: 'വാങ്ങുന്നയാളുടെ വിവരങ്ങൾ',
      productDetails: 'വിളവിന്റെ വിവരങ്ങൾ',
      priceBreakdown: 'വില വിവരണം',
      productSubtotal: 'ഉൽപ്പന്ന തുക',
      platformFee: 'അഗ്രോഡയറക്ട് പ്ലാറ്റ്‌ഫോം ഫീസ് (₹20)',
      platformFeeNotice: 'ഡിജിറ്റൽ സുരക്ഷയ്ക്കായി കേവലം ₹20 സുതാര്യമായ ഫീസ് മാത്രം.',
      totalAmount: 'ആകെ തുക',
      termsHeader: 'നിബന്ധനകളും വ്യവസ്ഥകളും',
      farmerAcceptance: 'കർഷകന്റെ ഡിജിറ്റൽ ഒപ്പ്',
      buyerAcceptance: 'വാങ്ങുന്നയാളുടെ ഡിജിറ്റൽ ഒപ്പ്',
      signAgreement: 'കരാർ ഒപ്പിടുക',
      statusAccepted: 'പൂർത്തിയായ കരാർ',
      statusPending: 'അംഗീകാരത്തിനായി കാത്തിരിക്കുന്നു',
      downloadPdf: 'കരാർ ഡൗൺലോഡ് ചെയ്യുക',
    },
    aiTools: {
      cropRecommender: 'AI വിള ശുപാർശ',
      pricePredictor: 'വിപണി വില പ്രവചനം',
      demandPredictor: 'ഡിമാൻഡ് വിശകലനം',
      agrobot: 'അഗ്രോബോട്ട് AI സഹായി',
      voiceAssistant: 'കർഷക വോയ്‌സ് അസിസ്റ്റന്റ്',
      selectSoil: 'മണ്ണിന്റെ തരം',
      selectState: 'സംസ്ഥാനവും ജില്ലയും',
      selectSeason: 'കൃഷി സീസൺ',
      getRecommendation: 'വിശകലനം ചെയ്യുക',
      predictPrice: 'വില പ്രവചിക്കുക',
      disclaimer: 'ശ്രദ്ധിക്കുക: വിപണി കണക്കുകൾ അടിസ്ഥാനമാക്കിയുള്ളതാണ് AI പ്രവചനങ്ങൾ.',
    },
    voice: {
      listening: 'കേൾക്കുന്നു, സംസാരിക്കൂ...',
      clickToSpeak: 'മൈക്ക് അമർത്തി മലയാളത്തിൽ സംസാരിക്കൂ',
      speakCommandPrompt: 'വിളകളുടെ വിലയോ കൃഷി സംശയങ്ങളോ ചോദിക്കൂ...',
      browserNotSupported: 'ഈ ബ്രൗസറിൽ വോയ്‌സ് ലഭ്യമല്ല.',
    },
    offline: {
      offlineMode: 'ഓഫ്‌ലൈൻ മോഡ് പ്രവർത്തിക്കുന്നു',
      cachedDataMsg: 'സേവ് ചെയ്ത വിവരങ്ങൾ കാണുന്നു.',
      actionRequiresOnline: 'ഇതിന് ഇന്റർനെറ്റ് ആവശ്യമാണ്.',
      syncing: 'വിവരങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യുന്നു...',
      onlineRestored: 'ഇന്റർനെറ്റ് കണക്ഷൻ പുനഃസ്ഥാപിച്ചു.',
    },
    common: {
      loading: 'ലോഡ് ചെയ്യുന്നു...',
      error: 'തകരാർ സംഭവിച്ചു',
      success: 'വിജയകരമായി പൂർത്തിയായി',
      cancel: 'റദ്ദാക്കുക',
      confirm: 'സ്ഥിരീകരിക്കുക',
      save: 'സേവ് ചെയ്യുക',
      edit: 'മാറ്റം വരുത്തുക',
      delete: 'ഡിലീറ്റ് ചെയ്യുക',
      empty: 'വിവരങ്ങളില്ല',
    },
  },
  mr: {
    appName: 'ॲग्रोडायरेक्ट (AgroDirect)',
    tagline: 'शेतातून थेट बाजारापर्यंत - दलालांशिवाय थेट व्यापार',
    nav: {
      home: 'मुख्यपृष्ठ',
      marketplace: 'बाजारपेठ',
      directHarvest: 'थेट पीक करार',
      aiAssistant: 'एआय कृषी सहाय्यक',
      howItWorks: 'कसे कार्य करते',
      about: 'आमच्याबद्दल',
      login: 'लॉग इन',
      register: 'नोंदणी करा',
      farmerPortal: 'शेतकरी पोर्टल',
      buyerPortal: 'खरेदीदार पोर्टल',
      adminPortal: 'अॅडमिन कक्ष',
      cart: 'कार्ट',
      profile: 'माझे खाते',
      logout: 'लॉग आउट',
    },
    hero: {
      title: 'थेट शेतामधून प्रत्येक बाजारपेठेत.',
      subtitle: 'दलालांशिवाय फक्त ₹20 च्या पारदर्शक शुल्कात एआय भाव अंदाज आणि डिजिटल करारासह शेतीमाल विका.',
      browseBtn: 'बाजारपेठ पहा',
      sellBtn: 'पीक विका',
      badge: '100% थेट शेतकरी-खरेदीदार व्यासपीठ',
    },
    marketplace: {
      title: 'कृषी उत्पादने बाजारपेठ',
      subtitle: 'प्रमाणित शेतकऱ्यांकडून थेट ताजी उत्पादने खरेदी करा.',
      searchPlaceholder: 'धान्य, डाळी, भाजीपाला, फळे शोधा...',
      allCategories: 'सर्व श्रेणी',
      filterByState: 'राज्यानुसार',
      filterByFarming: 'शेतीची पद्धत',
      sortBy: 'क्रम लावा',
      priceLowToHigh: 'किंमत: कमी ते जास्त',
      priceHighToLow: 'किंमत: जास्त ते कमी',
      quantity: 'उपलब्ध प्रमाण',
      harvestDate: 'काढणी तारीख',
      farmer: 'शेतकरी',
      location: 'ठिकाण',
      addToCart: 'कार्टमध्ये जोडा',
      buyNow: 'थेट खरेदी',
      approachFarmer: 'शेतकऱ्याशी संपर्क साधा',
      noProductsFound: 'कोणतीही उत्पादने सापडली नाहीत.',
      verifiedFarmer: 'सत्यापित शेतकरी',
      organic: 'सेंद्रिय शेती',
      conventional: 'पारंपारिक',
      natural: 'नैसर्गिक शेती',
    },
    directHarvest: {
      title: 'येणाऱ्या पिकाची थेट पूर्व-नोंदणी',
      subtitle: 'काढणीपूर्वीच शेतकरी आणि खरेदीदार यांच्यात थेट व्यवहार.',
      approachModalTitle: 'पिकाच्या खरेदीसाठी शेतकऱ्याशी चर्चा',
      expectedHarvest: 'अपेक्षित काढणी तारीख',
      expectedYield: 'एकूण अपेक्षित उत्पादन',
      minPledge: 'किमान ऑर्डर प्रमाण',
      enterQty: 'आवश्यक प्रमाण',
      offerPrice: 'प्रस्तावित किंमत (₹)',
      preferredDate: 'डिलिव्हरी तारीख',
      deliveryLocation: 'डिलिव्हरीचे ठिकाण',
      notes: 'अटी व शर्ती',
      submitProposal: 'प्रस्ताव पाठवा',
      counterOffer: 'प्रति-प्रस्ताव पाठवा',
      acceptProposal: 'स्वीकारा व करार तयार करा',
      rejectProposal: 'नाकारा',
      activeNegotiations: 'सक्रिय सौदे',
    },
    agreement: {
      title: 'ॲग्रोडायरेक्ट शेतकरी-खरेदीदार डिजिटल करार',
      subtitle: 'पारदर्शक ₹20 शुल्कासह कायदेशीर डिजिटल करार',
      farmerDetails: 'शेतकरी (विक्रेता) तपशील',
      buyerDetails: 'खरेदीदार तपशील',
      productDetails: 'पीक तपशील',
      priceBreakdown: 'किंमत विवरण',
      productSubtotal: 'मालाची एकूण किंमत',
      platformFee: 'ॲग्रोडायरेक्ट प्लॅटफॉर्म शुल्क (₹20)',
      platformFeeNotice: 'सुरक्षित व्यवहारासाठी केवळ ₹20 पारदर्शक शुल्क आकारले जाते.',
      totalAmount: 'एकूण देय रक्कम',
      termsHeader: 'नियम आणि अटी',
      farmerAcceptance: 'शेतकऱ्याची डिजिटल स्वाक्षरी',
      buyerAcceptance: 'खरेदीदाराची डिजिटल स्वाक्षरी',
      signAgreement: 'करारावर स्वाक्षरी करा',
      statusAccepted: 'स्वाक्षरी झालेला वैध करार',
      statusPending: 'स्वीकृतीची प्रतीक्षा आहे',
      downloadPdf: 'करार डाउनलोड करा',
    },
    aiTools: {
      cropRecommender: 'एआय पीक शिफारस',
      pricePredictor: 'बाजार भाव अंदाज',
      demandPredictor: 'मागणी विश्लेषण',
      agrobot: 'ॲग्रोबॉट (Agrobot) एआय मित्र',
      voiceAssistant: 'शेतकरी व्हॉईस असिस्टंट',
      selectSoil: 'मातीचा प्रकार',
      selectState: 'राज्य आणि जिल्हा',
      selectSeason: 'हंगाम (खरीप/रब्बी)',
      getRecommendation: 'सल्ला मिळवा',
      predictPrice: 'भावाचा अंदाज लावा',
      disclaimer: 'टीप: एआय अंदाज ऐतिहासिक बाजार माहितीवर आधारित आहेत.',
    },
    voice: {
      listening: 'ऐकत आहोत, कृपया बोला...',
      clickToSpeak: 'माईक दाबा आणि मराठीत बोला',
      speakCommandPrompt: 'पिकाचे भाव विचारा किंवा शेतीविषयक सल्ला घ्या...',
      browserNotSupported: 'या ब्राउझरमध्ये व्हॉईस सुविधा उपलब्ध नाही.',
    },
    offline: {
      offlineMode: 'ऑफलाइन मोड सुरू आहे',
      cachedDataMsg: 'जतन केलेली माहिती दिसत आहे.',
      actionRequiresOnline: 'या कृतीसाठी इंटरनेट आवश्यक आहे.',
      syncing: 'माहिती अद्यतनित होत आहे...',
      onlineRestored: 'इंटरनेट कनेक्शन पूर्ववत झाले.',
    },
    common: {
      loading: 'लोड होत आहे...',
      error: 'त्रुटी आढळली',
      success: 'यशस्वीरित्या पूर्ण झाले',
      cancel: 'रद्द करा',
      confirm: 'पुष्टी करा',
      save: 'जतन करा',
      edit: 'बदल करा',
      delete: 'हटवा',
      empty: 'माहिती उपलब्ध नाही',
    },
  },
};
