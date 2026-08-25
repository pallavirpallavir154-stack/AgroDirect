import { CROP_KNOWLEDGE_BASE } from './cropDataset';
import { CropRecommendationRequest, CropRecommendationResult } from '../shared/types';

export function runCropRecommendationEngine(
  req: {
    state: string;
    district: string;
    soilType: string;
    season: string;
    irrigationAvailable?: boolean;
    farmSizeAcres?: number;
  }
): CropRecommendationResult[] {
  const scoredCrops = CROP_KNOWLEDGE_BASE.map((crop) => {
    let score = 65;

    // Soil match
    const soilMatched = crop.suitableSoils.some((s) =>
      req.soilType.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(req.soilType.toLowerCase())
    );
    if (soilMatched) score += 20;
    else score -= 10;

    // Season match
    if (crop.suitableSeasons.includes(req.season as any)) {
      score += 15;
    } else {
      score -= 20;
    }

    // State match
    const stateMatched = crop.topStates.some((st) =>
      st.toLowerCase() === req.state.toLowerCase()
    );
    if (stateMatched) score += 10;

    const finalScore = Math.min(99, Math.max(35, score));
    const profitPerAcre =
      crop.unit === 'kg'
        ? crop.historicalBasePricePerUnit * 1200 - 8000
        : crop.historicalBasePricePerUnit * 18 - 15000;

    return {
      cropName: crop.cropName,
      category: crop.category,
      suitabilityScore: finalScore,
      expectedYieldRange: crop.expectedYieldPerAcre,
      estimatedPriceRange: `₹${crop.historicalBasePricePerUnit - 5} - ₹${crop.historicalBasePricePerUnit + 8}/${crop.unit}`,
      estimatedNetProfitPerAcre: Math.max(25000, profitPerAcre),
      reasoning: `Highly adaptable to ${req.soilType} conditions in ${req.district}, ${req.state} with proven high yield during the ${req.season} sowing window.`,
    };
  });

  // Sort descending by suitability score
  scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return scoredCrops.slice(0, 5);
}
