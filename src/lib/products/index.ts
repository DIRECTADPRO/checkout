/* FILE: src/lib/products/index.ts */

// 1. IMPORT ONLY YOUR REAL PRODUCTS
import { legacyBlueprint } from './legacy-blueprint';

// 2. DEFINE THE INTERFACE
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
    
    // VIDEO LOGIC
    image: string;          
    videoEmbedUrl?: string; 

    features: string[];
    stripePriceId: string;
    funnelType: 'digital_product' | 'physical_product' | 'free_plus_shipping' | 'tripwire_offer' | 'application_funnel' | 'webinar_live' | 'saas_trial'; 
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
  };
}

// 3. REGISTER ONLY THE REAL PRODUCT
export const products: Record<string, ProductConfig> = {
  "legacy-blueprint": legacyBlueprint,
};

// 4. THE GETTER
export const getProduct = (slug: string): ProductConfig | null => {
  return products[slug] || null;
};