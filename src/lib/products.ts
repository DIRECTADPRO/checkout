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
    funnelType?: string;      
    ctaText?: string;         
    videoEmbedUrl?: string;   
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
  downsell?: { 
    headline: string;
    description: string;
    price: number; // Cents
    stripePriceId: string;
    deliveryUrl: string;
  };
}

export const products: Record<string, ProductConfig> = {
  // --- 1. DEFAULT PRODUCT (Email Bundle) ---
  "email-bundle": {
    id: "email-bundle",
    theme: {
      primaryColor: "#059669", 
      accentColor: "#6A45FF",  
      backgroundColor: "#F9FAFB",
      logoUrl: "",
      logoWidth: "150px"
    },
    checkout: {
      headline: "Steal The Exact '5-Day Welcome Sequence' That Generated $1.3M",
      subhead: "Stop staring at a blinking cursor. Copy-paste these proven templates.",
      productName: "The 'Next Best Message' Playbook",
      price: 700, 
      image: "https://via.placeholder.com/600x400",
      features: ["5-Day Framework", "Templates", "Scripts"],
      stripePriceId: "price_123",
      funnelType: 'digital_product', 
    },
    bump: {
      headline: "Want Higher Open Rates?",
      description: "Add the 'Click-Magnet' Subject Line Vault.",
      price: 1700,
      stripePriceId: "price_bump"
    },
    oto: {
      headline: "Wait! Upgrade Your Order?",
      videoPlaceholder: "Watch Video",
      price: 9700,
      retailPrice: 19700,
      features: ["Audit", "Strategy"],
      stripePriceId: "price_oto"
    }
  },

  // --- 2. YOUR FOOD PRODUCT (Hardcoded for Safety) ---
  "food": {
    id: "food",
    theme: {
      primaryColor: "#ef4444", // Red for food
      accentColor: "#f59e0b",   // Orange accent
      backgroundColor: "#fff7ed",
      logoUrl: "", 
      logoWidth: "150px"
    },
    checkout: {
      headline: "Turn New Dishes Into Favs",  // <--- YOUR HEADLINE
      subhead: "The ultimate guide to transforming your kitchen experience with simple, delicious recipes.",
      productName: "The Family Favorites Cookbook",
      price: 2700, // $27.00 (Example)
      image: "https://via.placeholder.com/600x400?text=Food+Bundle",
      features: [
        "30+ 5-Minute Recipes", 
        "Weekly Shopping Lists", 
        "Kid-Friendly Options"
      ],
      stripePriceId: "price_FOOD_ID", // Update this if you have a real ID
      funnelType: 'free_plus_shipping', // <--- FORCES ADDRESS FIELDS
      ctaText: "Send Me The Cookbook"
    },
    bump: {
      headline: "Add The 'Holiday Special' Bonus?",
      description: "Get 15 extra festive recipes for just $9 more.",
      price: 900,
      stripePriceId: "price_food_bump"
    },
    oto: {
      headline: "Wait! Want The Video Masterclass?",
      videoPlaceholder: "Cooking Demo",
      price: 4700,
      retailPrice: 9700,
      features: ["Video Tutorials", "Knife Skills", "Sauce Mastery"],
      stripePriceId: "price_food_oto"
    }
  }
};

export const getProduct = (slug: string): ProductConfig => {
    // If the slug exists (like "food"), return it. Otherwise default to "email-bundle".
    return products[slug] || products["email-bundle"];
};