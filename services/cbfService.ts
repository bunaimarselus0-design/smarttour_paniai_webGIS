import { Destination, UserPreference, RecommendationResult } from '../types';

/**
 * Calculates similarity between user preferences and destinations.
 * Uses a simplified Jaccard Index/Cosine Similarity approach suitable for tags.
 */
export const calculateRecommendations = (
  destinations: Destination[],
  preferences: UserPreference
): RecommendationResult[] => {
  
  // 1. Create User Vector
  // User vector is conceptually a set of desired features and categories.
  
  const results: RecommendationResult[] = destinations.map((dest) => {
    let score = 0;
    let maxScore = 0;

    // Weight for Category (High Importance: 0.4)
    const categoryWeight = 0.4;
    const isCategoryMatch = preferences.preferredCategories.includes(dest.category);
    if (isCategoryMatch) {
      score += categoryWeight;
    }
    maxScore += categoryWeight;

    // Weight for Features (High Importance: 0.6)
    // Calculate overlap of features
    if (preferences.preferredFeatures.length > 0) {
      const featureWeight = 0.6;
      const matchCount = dest.features.filter(f => preferences.preferredFeatures.includes(f)).length;
      // Normalize feature score based on the number of preferred features selected
      const featureScore = matchCount / Math.max(preferences.preferredFeatures.length, 1);
      
      score += featureScore * featureWeight;
    }
    // If user didn't select specific features, we rely mostly on category, but normalize total
    maxScore += 0.6; 

    return {
      ...dest,
      score: score // Raw score, typically 0 to 1
    };
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
};
