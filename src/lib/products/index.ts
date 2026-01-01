// ============================================================================
//  🚀 TANK COMMAND CENTER: PRODUCT REGISTRY
// ============================================================================
//  This file controls your entire website. 
//  If it is listed here, it is LIVE.
//  If it is not listed here, it does not exist.
// ============================================================================

// ----------------------------------------------------------------------------
//  👇 ZONE 1: IMPORT YOUR FILES HERE
//  (When you drag a new file into this folder, import it below)
// ----------------------------------------------------------------------------
import { legacyBlueprint } from './legacy-blueprint';
// import { myNewBook } from './my-new-book';   <-- Example of next import
// import { tripwire } from './tripwire';       <-- Example of next import


// ============================================================================
//  ⛔ RESTRICTED ZONE: DO NOT TOUCH
//  (This defines the rules for the system. Leave this alone.)
// ============================================================================
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
    videoEmbedUrl?: string; // If empty "", shows Image. If set, shows Video.
    image: string;
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
    ctaText?: string; // Optional override for OTO button
  };
}

// ----------------------------------------------------------------------------
//  👇 ZONE 2: REGISTER YOUR PRODUCTS HERE
//  (This maps the URL to the File. "key" = "website.com/key")
// ----------------------------------------------------------------------------
export const products: Record<string, ProductConfig> = {

  // --- URL: yoursite.com/legacy-blueprint ---
  "legacy-blueprint": legacyBlueprint,

  // --- URL: yoursite.com/book (Example for future) ---
  // "book": myNewBook,

  // --- URL: yoursite.com/special-offer (Example for future) ---
  // "special-offer": tripwire,

};

// ----------------------------------------------------------------------------
//  👇 ZONE 3: THE ENGINE (Helper Functions)
//  (This allows the website to safely grab a product. Do not touch.)
// ----------------------------------------------------------------------------
export function getProduct(slug: string): ProductConfig | undefined {
  return products[slug];
}

export function getAllProductSlugs() {
  return Object.keys(products);
}