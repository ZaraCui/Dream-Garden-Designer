export enum GardenStyle {
  COTTAGE = "English Cottage",
  ZEN = "Japanese Zen",
  MODERN = "Modern Minimalist",
  XERISCAPE = "Desert/Xeriscape",
  TROPICAL = "Tropical Paradise",
  EDIBLE = "Kitchen Garden (Edible)"
}

export enum Sunlight {
  FULL_SUN = "Full Sun (6+ hours)",
  PARTIAL_SHADE = "Partial Shade (3-6 hours)",
  SHADE = "Full Shade (<3 hours)"
}

export enum GardenSize {
  BALCONY = "Small Balcony/Patio",
  SMALL_YARD = "Small Urban Yard (approx 500sqft)",
  MEDIUM_YARD = "Medium Suburban Yard (approx 2000sqft)",
  LARGE_ESTATE = "Large Estate/Acreage"
}

export interface GardenPreferences {
  style: GardenStyle;
  sunlight: Sunlight;
  size: GardenSize;
  hardinessZone?: string;
  colors?: string;
  extraNotes?: string;
}

export interface PlantRecommendation {
  name: string;
  description: string;
  careLevel: 'Easy' | 'Moderate' | 'Difficult';
}

export interface GardenPlan {
  title: string;
  description: string;
  plants: PlantRecommendation[];
  layoutTips: string[];
}
