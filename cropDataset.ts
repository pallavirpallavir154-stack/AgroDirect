// Agricultural Reference Dataset for Indian Crops, Mandi Trends, and Agro-Climatic Zones

export interface CropAgroData {
  cropName: string;
  category: 'Grains' | 'Pulses' | 'Vegetables' | 'Fruits' | 'Spices' | 'Oilseeds' | 'Cash Crops';
  suitableSoils: string[];
  suitableSeasons: ('KHARIF' | 'RABI' | 'ZAID')[];
  waterRequirement: 'LOW' | 'MEDIUM' | 'HIGH';
  growthDays: number;
  expectedYieldPerAcre: string;
  historicalBasePricePerUnit: number;
  unit: string;
  baseCostPerAcre: number;
  topStates: string[];
  description: string;
}

export const CROP_KNOWLEDGE_BASE: CropAgroData[] = [
  {
    cropName: 'Tomato (High Yield Hybrid)',
    category: 'Vegetables',
    suitableSoils: ['Red & Yellow Soil', 'Sandy Loam', 'Clay Loam', 'Black Soil (Regur)'],
    suitableSeasons: ['KHARIF', 'RABI', 'ZAID'],
    waterRequirement: 'MEDIUM',
    growthDays: 75,
    expectedYieldPerAcre: '150 - 220 Quintals',
    historicalBasePricePerUnit: 24, // ₹/kg
    unit: 'kg',
    baseCostPerAcre: 35000,
    topStates: ['Karnataka', 'Andhra Pradesh', 'Maharashtra', 'Madhya Pradesh'],
    description: 'High market demand vegetable with rapid harvest turnaround. Sensitive to unseasonal heavy rain during flowering.',
  },
  {
    cropName: 'Basmati Paddy (Pusa 1121)',
    category: 'Grains',
    suitableSoils: ['Alluvial Soil', 'Clay Loam', 'Black Soil (Regur)'],
    suitableSeasons: ['KHARIF'],
    waterRequirement: 'HIGH',
    growthDays: 130,
    expectedYieldPerAcre: '18 - 25 Quintals',
    historicalBasePricePerUnit: 3600, // ₹/quintal
    unit: 'quintal',
    baseCostPerAcre: 28000,
    topStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Karnataka'],
    description: 'Premium aromatic grain with strong domestic wholesale and export demand. Requires assured standing water during vegetative stage.',
  },
  {
    cropName: 'Tur / Arhar Dal (Red Gram)',
    category: 'Pulses',
    suitableSoils: ['Black Soil (Regur)', 'Alluvial Soil', 'Red & Yellow Soil'],
    suitableSeasons: ['KHARIF'],
    waterRequirement: 'LOW',
    growthDays: 160,
    expectedYieldPerAcre: '8 - 12 Quintals',
    historicalBasePricePerUnit: 7800, // ₹/quintal
    unit: 'quintal',
    baseCostPerAcre: 18000,
    topStates: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Telangana'],
    description: 'Drought-tolerant leguminous crop that enriches soil nitrogen. High national protein demand with steady pricing.',
  },
  {
    cropName: 'Onion (Nashik Red / Bellary)',
    category: 'Vegetables',
    suitableSoils: ['Sandy Loam', 'Alluvial Soil', 'Black Soil (Regur)'],
    suitableSeasons: ['KHARIF', 'RABI'],
    waterRequirement: 'MEDIUM',
    growthDays: 110,
    expectedYieldPerAcre: '100 - 140 Quintals',
    historicalBasePricePerUnit: 22, // ₹/kg
    unit: 'kg',
    baseCostPerAcre: 32000,
    topStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'],
    description: 'Crucial kitchen staple with seasonal volatility. Rabi harvest offers superior storage longevity.',
  },
  {
    cropName: 'Ragi (Finger Millet)',
    category: 'Grains',
    suitableSoils: ['Red & Yellow Soil', 'Sandy Loam', 'Laterite Soil'],
    suitableSeasons: ['KHARIF', 'RABI'],
    waterRequirement: 'LOW',
    growthDays: 105,
    expectedYieldPerAcre: '12 - 16 Quintals',
    historicalBasePricePerUnit: 3800, // ₹/quintal
    unit: 'quintal',
    baseCostPerAcre: 14000,
    topStates: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Maharashtra'],
    description: 'Climate-resilient superfood with surging urban consumer demand and minimal fertilizer requirement.',
  },
  {
    cropName: 'Pomegranate (Bhagwa Super)',
    category: 'Fruits',
    suitableSoils: ['Sandy Loam', 'Black Soil (Regur)', 'Alluvial Soil'],
    suitableSeasons: ['RABI', 'ZAID', 'KHARIF'],
    waterRequirement: 'LOW',
    growthDays: 180,
    expectedYieldPerAcre: '40 - 60 Quintals',
    historicalBasePricePerUnit: 85, // ₹/kg
    unit: 'kg',
    baseCostPerAcre: 60000,
    topStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Andhra Pradesh'],
    description: 'High-value perennial fruit crop with excellent export and domestic retail realizations. Performs best in semi-arid zones.',
  },
  {
    cropName: 'Turmeric (Salem / Alleppey High Curcumin)',
    category: 'Spices',
    suitableSoils: ['Alluvial Soil', 'Clay Loam', 'Red & Yellow Soil'],
    suitableSeasons: ['KHARIF'],
    waterRequirement: 'MEDIUM',
    growthDays: 240,
    expectedYieldPerAcre: '20 - 28 Quintals (Dry)',
    historicalBasePricePerUnit: 12500, // ₹/quintal
    unit: 'quintal',
    baseCostPerAcre: 45000,
    topStates: ['Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Maharashtra'],
    description: 'Commercial spice crop with high pharmaceutical and culinary demand. High resistance to dry spells post establishment.',
  },
  {
    cropName: 'Soybean (JS 335 / JS 9560)',
    category: 'Oilseeds',
    suitableSoils: ['Black Soil (Regur)', 'Alluvial Soil'],
    suitableSeasons: ['KHARIF'],
    waterRequirement: 'MEDIUM',
    growthDays: 95,
    expectedYieldPerAcre: '10 - 15 Quintals',
    historicalBasePricePerUnit: 4600, // ₹/quintal
    unit: 'quintal',
    baseCostPerAcre: 16000,
    topStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
    description: 'Primary oilseed and livestock meal protein crop. Fixes atmospheric nitrogen and thrives in rainfed central Indian vertisols.',
  }
];
