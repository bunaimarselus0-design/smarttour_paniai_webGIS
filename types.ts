export enum Category {
  ALAM = 'Alam',
  BUDAYA = 'Budaya'
}

export interface Destination {
  id: number;
  name: string;
  description: string;
  category: Category;
  latitude: number;
  longitude: number;
  rating: number; // 1-5
  image: string;
  features: string[]; // e.g., ['lake', 'hiking', 'museum'] used for CBF
}

export interface UserPreference {
  preferredCategories: Category[];
  preferredFeatures: string[];
}

export interface RecommendationResult extends Destination {
  score: number; // 0 to 1
}