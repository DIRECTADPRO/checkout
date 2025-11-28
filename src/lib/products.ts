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
    stripePriceId: string; // Placeholder
  };
  bump: {
    headline: string;
    description: string;
    price: number; // Cents
    stripePriceId: string; // Placeholder
  };
  oto: {
    headline: string;
    // UPDATED: Add this field for the real video link
    videoEmbedUrl?: string; 
    videoPlaceholder: string;
    price: number; // Cents
    retailPrice: number; // Cents
    features: string[];
    stripePriceId: string; // Placeholder
  };
}

export const products: Record<string, ProductConfig> = {
  // --- PRODUCT 1: The Email Bundle ---
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
      headline: "Turn New Subscribers Into Buyers Automatically—Without Writing a Single Word",
      subhead: "Stop staring at a blank cursor. Get the proven welcome sequence framework that engages leads the moment they sign up.",
      productName: "The Next Best Message Book",
      price: 499, // $4.99
      image: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Bundle_va8f72.png",
      features: [
        "The 7-Figure Blueprint (Val: $97)", 
        "Plug-and-Play Templates (Val: $47)", 
        "Recover Revenue Scripts (Val: $47)"
      ],
      stripePriceId: "price_CORE_ID" 
    },
    bump: {
      headline: "YES! Upgrade my order to include the 'High-Open Subject Line Vault'",
      description: "The $4.99 system gives you the strategy, but this upgrade gives you the exact words.",
      price: 2399, // $23.99
      stripePriceId: "price_BUMP_ID"
    },
    oto: {
      headline: "Want to 10X Your Results with our Profit-Multiplier Masterclass?",
      // EXAMPLE: You can put a YouTube embed URL here
      videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
      videoPlaceholder: "WATCH PRESENTATION",
      price: 4700, // $47.00
      retailPrice: 9700, // $97.00
      features: [
        "50+ Copy-Paste Body Scripts (Valued at $197)", 
        "The 'Infinite Traffic' Video Strategy (Valued at $147)", 
        "3 Live Q&A Session Recordings (Valued at $297)",
        "Bonus: The 7-Day Launch Checklist (Valued at $47)"
      ],
      stripePriceId: "price_OTO_ID"
    }
  },

  // --- PRODUCT 2: Traffic Course ---
  "traffic-mastery": {
    id: "traffic-mastery",
    theme: {
      primaryColor: "#D97706",
      accentColor: "#10B981",
      backgroundColor: "#1F2937",
      logoUrl: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Logo2_on0p1k.png", 
      logoWidth: "180px"
    },
    checkout: {
      headline: "Master Organic Traffic and Never Pay for an Ad Again",
      subhead: "The advanced playbook for reaching 10,000+ targeted visitors in 30 days.",
      productName: "Traffic Mastery Playbook",
      price: 9700,
      image: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Bundle_va8f72.png", 
      features: ["Advanced SEO Checklist", "Viral Content Templates", "The Reddit Hack"],
      stripePriceId: "price_CORE2_ID"
    },
    bump: {
      headline: "Add the 'Viral Video Hooks' Swipe File for $17.00",
      description: "Don't guess what to say. Get 100 hooks that went viral last month.",
      price: 1700,
      stripePriceId: "price_BUMP2_ID"
    },
    oto: {
      headline: "Unlock the 'Inner Circle' Coaching Group for Lifetime Access?",
      // No videoEmbedUrl here yet, so it will fall back to placeholder
      videoPlaceholder: "WATCH CASE STUDY",
      price: 9700,
      retailPrice: 29700,
      features: ["Weekly Live Coaching Calls", "Private Discord Access", "Guest Expert Sessions"],
      stripePriceId: "price_OTO2_ID"
    }
  }
};

export const getProduct = (slug: string): ProductConfig => {
    return products[slug] || products["email-bundle"];
};