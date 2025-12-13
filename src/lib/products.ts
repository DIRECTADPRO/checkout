/* FILE: src/lib/products.ts */

// OPTIONAL: You can import FunnelType to be strict, or just use string.
// import { FunnelType } from './funnel-types'; 

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
    
    // --- NEW FIELDS ADDED TO FIX TYPESCRIPT ERRORS ---
    funnelType?: string;      // The Magic Switch
    ctaText?: string;         // Custom Button Text
    videoEmbedUrl?: string;   // For Video Sales Letters
    // -------------------------------------------------
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
      headline: "Steal The Exact '5-Day Welcome Sequence' That Generated $1.3M In Sales (Without Being Pushy)",
      subhead: "Stop staring at a blinking cursor. Copy-paste these proven templates to turn new subscribers into raving fans and lifetime customers on autopilot.",
      productName: "The 'Next Best Message' Playbook",
      price: 700, 
      image: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Bundle_va8f72.png",
      features: [
        "The 5-Day 'Trust & Buy' Framework (Value: $97)", 
        "10x Plug-and-Play Email Templates (Value: $47)", 
        "The 'Ghost-Buster' Re-engagement Script (Value: $47)"
      ],
      stripePriceId: "price_CORE_ID",
      
      // EXPLICITLY DEFINING THE FUNNEL TYPE HERE
      funnelType: 'digital_product', 
    },
    bump: {
      headline: "Wait! Want 80% Higher Open Rates?",
      description: "Add the **'Click-Magnet' Subject Line Vault**. 500+ fill-in-the-blank headlines proven to get your emails opened. (One-time offer: $17)",
      price: 1700,
      stripePriceId: "price_BUMP_ID"
    },
    oto: {
      headline: "Wait! Let Me Personally Audit Your Setup To Ensure You Never Land In The Spam Folder.",
      videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1", 
      videoPlaceholder: "WATCH: How I Scale to 10k Subs",
      price: 14700,
      retailPrice: 29700,
      features: [
        "The 'Inbox Defense' Deep-Dive Audit (Value: $197)", 
        "The 'Infinite Traffic' Video Strategy (Value: $147)", 
        "3x Live Q&A 'Tear-Down' Recordings (Value: $297)",
        "Bonus: The 7-Day Launch Checklist (Value: $47)"
      ],
      stripePriceId: "price_OTO_ID"
    },
    downsell: {
      headline: "Okay, I Get It. $147 Is A Stretch Right Now.",
      description: "But I don't want you to fail because of technical errors. Get the **'DIY Inbox Defense Checklist'** (The exact PDF I use to audit clients) without the personal video review.",
      price: 3700,
      stripePriceId: "price_DOWNSELL_ID",
      deliveryUrl: ""
    }
  }
};

export const getProduct = (slug: string): ProductConfig => {
    return products[slug] || products["email-bundle"];
};