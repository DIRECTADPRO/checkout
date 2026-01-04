// --- FILE: src/lib/products/index.ts ---

import { legacyBlueprint } from './legacy-blueprint';

// THE RULES (Interface)
export interface ProductConfig {
  id: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    logoUrl: string;
    logoWidth: string;
  };
  checkout: {
    headline: string;
    subhead: string;
    productName: string;
    price: number;
    videoEmbedUrl?: string;
    image: string;
    features: string[];
    stripePriceId: string;
    funnelType: string;
    ctaText?: string;
    // --- ADD THIS LINE BELOW ---
    guaranteeBadge?: string; 
  };
  bump: {
    headline: string;
    description: string;
    price: number;
    stripePriceId: string;
  };
  oto: {
    headline: string;
    videoEmbedUrl?: string;
    videoPlaceholder: string;
    price: number;
    retailPrice: number;
    features: string[];
    stripePriceId: string;
    ctaText?: string;
  };
  downsell?: {
    headline: string;
    description: string;
    price: number;
    stripePriceId: string;
  };
}

// THE REGISTRY
export const products: Record<string, ProductConfig> = {
  "legacy-blueprint": legacyBlueprint as ProductConfig, 
};

// THE ENGINE
export function getProduct(slug: string): ProductConfig | undefined {
  return products[slug];
}

export function getAllProductSlugs() {
  return Object.keys(products);
}