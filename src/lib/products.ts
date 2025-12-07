/* FILE: src/lib/products.ts */

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
    price: number; // Cents
    image: string;
    features: string[];
    stripePriceId: string;
  };
  bump: {
    headline: string;
    description: string;
    price: number; // Cents
    stripePriceId: string;
  };
  oto: {
    headline: string;
    videoEmbedUrl?: string; 
    videoPlaceholder: string;
    price: number; // Cents
    retailPrice: number; // Cents
    features: string[];
    stripePriceId: string;
  };
  // NEW: Added Downsell Interface
  downsell?: { 
    headline: string;
    description: string;
    price: number; // Cents
    stripePriceId: string;
    deliveryUrl: string;
  };
}

// Static Fallback Data
export const products: Record<string, ProductConfig> = {
  "email-bundle": {
    id: "email-bundle",
    theme: {
      primaryColor: "#059669", 
      accentColor: "#6A45FF",  
      backgroundColor: "#F9FAFB",
      logoUrl: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Logo2_on0p1k.png",
      logoWidth: "150px"
    },
    checkout: {
      headline: "Turn New Subscribers Into Buyers Automatically",
      subhead: "Stop staring at a blank cursor...",
      productName: "The Next Best Message Book",
      price: 700, 
      image: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Bundle_va8f72.png",
      features: ["The 7-Figure Blueprint", "Plug-and-Play Templates", "Recover Revenue Scripts"],
      stripePriceId: "price_CORE_ID" 
    },
    bump: {
      headline: "Upgrade my order",
      description: "Get the high-converting subject lines.",
      price: 1700,
      stripePriceId: "price_BUMP_ID"
    },
    oto: {
      headline: "Want to 10X Your Results?",
      videoPlaceholder: "WATCH PRESENTATION",
      price: 14700,
      retailPrice: 29700,
      features: ["50+ Scripts", "Video Strategy", "Q&A Recordings"],
      stripePriceId: "price_OTO_ID"
    },
    // Added default downsell just in case
    downsell: {
        headline: "Is $147 too much?",
        description: "Get the DIY Checklist instead.",
        price: 3700,
        stripePriceId: "price_DOWNSELL_ID",
        deliveryUrl: ""
    }
  }
};

export const getProduct = (slug: string): ProductConfig => {
    return products[slug] || products["email-bundle"];
};