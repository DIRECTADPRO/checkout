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
  headline: "Your Lawyer Prepared Your Family for the Probate Court. But Who Prepares Them for the First 48 Hours?",
  subhead: "Wills handle the wealth. The Manual handles the chaos. The comprehensive operational system that guides your family through the immediate crisis and the months of logistics that follow.",
  productName: "The Legacy Blueprint (Red Protocol Edition)",
    
    price: 3700, 
    image: "https://res.cloudinary.com/dse1cikja/image/upload/v1767504021/BLUEPRINTAsset_4_2x-8_fqirpq.png", 
   
    // THIS IS THE MISSING LINE THAT MAKES THE SHIELD APPEAR
    guaranteeBadge: "https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Badge_b86eiv.png",
    
    videoEmbedUrl: "", 

    features: [
      "The Crisis Pilot: Autopilots your family through the chaos of the first 48 hours.",
      "Digital Skeleton Key: Grants instant access to locked phones and frozen accounts.",
      "Hidden Asset Locator: Finds forgotten wealth before it vanishes to the state.",
      "Heirloom Peace Treaty: Prevents family wars over sentimental items."
    ],
    
    // YOUR CORE PRODUCT ID ($37)
    stripePriceId: "price_1SkpGiKWkFGAPPbCu0hwJqTT",
    
    funnelType: 'digital_product', 
    ctaText: "Secure My Survivor's Manual"
  },
  
bump: {
    headline: "Upgrade to the 'Digital Twin' & Auto-Fill Suite",
    description: "Don't cramp your hand writing 100+ pages. Get the Fillable PDF + Excel 'Data Vault' to copy-paste passwords and auto-calculate Net Worth in minutes. Finish twice as fast.",
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