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
    videoEmbedUrl?: string; // OPTIONAL (?) - The key to fixing the error
    image: string;
    features: string[];
    stripePriceId: string;
    // We allow string here to support the "standalone" legacy blueprint object
    funnelType: 'digital_product' | 'physical_product' | 'free_plus_shipping' | 'tripwire_offer' | 'application_funnel' | 'webinar_live' | 'saas_trial' | string;
    ctaText?: string;
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
}

// THE REGISTRY
export const products: Record<string, ProductConfig> = {
  // This maps the URL "/legacy-blueprint" to your file
  "legacy-blueprint": legacyBlueprint as ProductConfig, 
};

// THE ENGINE
export function getProduct(slug: string): ProductConfig | undefined {
  return products[slug];
}

export function getAllProductSlugs() {
  return Object.keys(products);
}