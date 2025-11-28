/* FILE: src/lib/products.ts */

/**
 * ==================================================================================
 * 📘 PRODUCT REGISTRY LEGEND (READ BEFORE ADDING NEW PRODUCTS)
 * ==================================================================================
 *
 * 1. IMAGES
 * - Logo: Transparent PNG. Ideal width: 150px-180px.
 * - Product Mockups: Transparent PNGs look best. Square or 4:3 aspect ratio.
 *
 * 2. PRICING (CRITICAL)
 * - ALL prices must be in CENTS.
 * - Example: $4.99 -> Write 499
 * - Example: $97.00 -> Write 9700
 *
 * 3. COPYWRITING LIMITS (To preserve design layout)
 * - Checkout Headline: 8-12 words max. Use "—" (em dash) to create a line break.
 * - Checkout Subhead: 2 sentences max. Focus on the "Pain" vs "Relief".
 * - Bump Headline: Start with "YES!" or "Upgrade". Keep it to 1 line.
 * - Bump Desc: 2 lines max. Focus on "Speed" or "Completion".
 *
 * 4. THEME COLORS
 * - Primary: Used for Buttons, Checkmarks, Borders. Darker/Saturated colors work best.
 * - Accent: Used for "Special Offer" badges and active steps.
 * - Background: Use very light greys (#F9FAFB) or dark blues (#111827). Avoid mid-tones.
 *
 * 5. STRIPE IDs
 * - These must match the "API ID" from your Stripe Product Dashboard.
 * - Format looks like: "price_1Pxyz..."
 * ==================================================================================
 */

export interface ProductConfig {
  id: string; // URL slug (e.g. "traffic-course"). Lowercase, no spaces.
  
  theme: {
    primaryColor: string;   // Main Action Color (Hex)
    accentColor: string;    // Secondary Highlights (Hex)
    backgroundColor: string; // Page Background (Hex)
    logoUrl: string;        // Full URL to image
    logoWidth: string;      // CSS value (e.g. "150px")
  };

  checkout: {
    headline: string;       // Use "—" to force a line break for visual impact
    subhead: string;
    productName: string;    // Appears on receipt
    price: number;          // IN CENTS
    image: string;
    features: string[];     // 3-4 bullet points max
    stripePriceId: string;
  };

  bump: {
    headline: string;
    description: string;
    price: number;          // IN CENTS
    stripePriceId: string;
  };

  oto: {
    headline: string;       // H1 on the Upsell page
    videoPlaceholder: string; // Text shown while video loads
    price: number;          // IN CENTS (Discounted Price)
    retailPrice: number;    // IN CENTS (Strikethrough Price)
    features: string[];     // 4-5 items for the Value Stack
    stripePriceId: string;
  };
}

export const products: Record<string, ProductConfig> = {
  
  // --- PRODUCT 1: The Email Bundle (Royal Growth Theme) ---
  "email-bundle": {
    id: "email-bundle",
    theme: {
      primaryColor: "#059669", // Mint Green
      accentColor: "#6A45FF",  // Electric Purple
      backgroundColor: "#F9FAFB", // Light Grey
      logoUrl: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Logo2_on0p1k.png",
      logoWidth: "150px"
    },
    checkout: {
      headline: "Turn New Subscribers Into Buyers Automatically—Without Writing a Single Word",
      subhead: "Stop staring at a blank cursor. Get the proven welcome sequence framework that engages leads the moment they sign up.",
      productName: "The Next Best Message Book",
      price: 499,
      image: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Bundle_va8f72.png",
      features: [
        "The 7-Figure Blueprint (Val: $97)", 
        "Plug-and-Play Templates (Val: $47)", 
        "Recover Revenue Scripts (Val: $47)"
      ],
      stripePriceId: "price_CORE_ID_PLACEHOLDER" 
    },
    bump: {
      headline: "YES! Upgrade my order to include the 'High-Open Subject Line Vault'",
      description: "The $4.99 system gives you the strategy, but this upgrade gives you the exact words.",
      price: 2399,
      stripePriceId: "price_BUMP_ID_PLACEHOLDER"
    },
    oto: {
      headline: "Want to 10X Your Results with our Profit-Multiplier Masterclass?",
      videoPlaceholder: "WATCH PRESENTATION",
      price: 4700,
      retailPrice: 9700,
      features: [
        "50+ Copy-Paste Body Scripts (Valued at $197)", 
        "The 'Infinite Traffic' Video Strategy (Valued at $147)", 
        "3 Live Q&A Session Recordings (Valued at $297)",
        "Bonus: The 7-Day Launch Checklist (Valued at $47)"
      ],
      stripePriceId: "price_OTO_ID_PLACEHOLDER"
    }
  },

  // --- PRODUCT 2: Traffic Course (Dark Luxury Theme) ---
  "traffic-mastery": {
    id: "traffic-mastery",
    theme: {
      primaryColor: "#D97706", // Amber
      accentColor: "#10B981",  // Emerald
      backgroundColor: "#1F2937", // Dark Slate
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
      stripePriceId: "price_CORE2_ID_PLACEHOLDER"
    },
    bump: {
      headline: "Add the 'Viral Video Hooks' Swipe File for $17.00",
      description: "Don't guess what to say. Get 100 hooks that went viral last month.",
      price: 1700,
      stripePriceId: "price_BUMP2_ID_PLACEHOLDER"
    },
    oto: {
      headline: "Unlock the 'Inner Circle' Coaching Group for Lifetime Access?",
      videoPlaceholder: "WATCH CASE STUDY",
      price: 9700,
      retailPrice: 29700,
      features: ["Weekly Live Coaching Calls", "Private Discord Access", "Guest Expert Sessions"],
      stripePriceId: "price_OTO2_ID_PLACEHOLDER"
    }
  }
};

export const getProduct = (slug: string): ProductConfig => {
    // Default to email-bundle if the slug doesn't exist
    return products[slug] || products["email-bundle"];
};