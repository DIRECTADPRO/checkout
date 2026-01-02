// --- FILE: src/lib/products/legacy-blueprint.ts ---

// NO IMPORTS HERE. WE ARE BREAKING THE LOOP.

export const legacyBlueprint = {
  id: "legacy-blueprint",
  theme: {
    primaryColor: "#000000", 
    accentColor: "#D32F2F", 
    backgroundColor: "#FAFAFA", 
    logoUrl: "https://res.cloudinary.com/dse1cikja/image/upload/v1767295060/BLUEPRINTAsset_1_2x-8_vucxxa.png",
    logoWidth: "180px"
  },
  checkout: {
    headline: "The Red Protocol: The 'First 48 Hours' Checklist Your Family Doesn't Have.",
    subhead: "Standard wills handle the money, but they fail to handle the chaos. This is the operational manual for when the silence settles.",
    productName: "The Legacy Blueprint (Red Protocol Edition)",
    
    price: 3700, 
    image: "/images/legacy-blueprint-cover.png", 
    
    // FIX: This empty string is fine now because we made it optional in the other file
    videoEmbedUrl: "", 
    
    features: [
      "The Red Protocol: Immediate 'Crisis Map' for the First 48 Hours",
      "The Digital Estate: Master Key System for Passwords & 2FA",
      "Hidden Asset Recovery: Cold Storage & Safe Deposit Locator",
      "The 'Do Not Sell' List: Heirloom protection protocol"
    ],
    
    // YOUR CORE PRODUCT ID ($37)
    stripePriceId: "price_1SkpGiKWkFGAPPbCu0hwJqTT",
    
    funnelType: 'digital_product', 
    ctaText: "Secure My Legacy ($37)"
  },
  
  bump: {
    headline: "YES! Upgrade to the 'Digital Twin' & Data-Entry Suite (+$17)",
    description: "Don't handwrite 100+ pages. Get the Fillable PDF + Excel 'Data Vault' to finish in 20 mins. Auto-calculates net worth. Error-proof.",
    
    price: 1700, 
    
    // YOUR BUNDLE PRODUCT ID ($54)
    stripePriceId: "price_1SkpHXKWkFGAPPbC9xuZ6PJK"
  },
  
  oto: {
    headline: "Wait! Your Order is Complete, But Your Mission Isn't.",
    videoPlaceholder: "The Family Peace Protocol (Preview)",
    
    price: 2700, 
    retailPrice: 9700,
    
    features: [
      "The 'Roundtable' Script: Word-for-word family meeting guide",
      "The Video Legacy Guide: How to record your 'Ethical Will'",
      "The Psychology of Peace: Avoiding the 'Burden' trap"
    ],
    
    // YOUR OTO PRODUCT ID ($27)
    stripePriceId: "price_1SkpIvKWkFGAPPbC4BNSXdFJ"
  }
};