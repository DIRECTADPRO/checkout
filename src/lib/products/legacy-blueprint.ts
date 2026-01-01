import { ProductConfig } from './index';

export const legacyBlueprint: ProductConfig = {
  id: "legacy-blueprint",
  theme: {
    // Keeping it "Black & White" serious with an Alert Red/Orange accent
    primaryColor: "#000000", 
    accentColor: "#D32F2F", // A "Red Protocol" shade 
    backgroundColor: "#FAFAFA", 
    logoUrl: "https://res.cloudinary.com/dse1cikja/image/upload/v1767295060/BLUEPRINTAsset_1_2x-8_vucxxa.png", // Add your logo URL here if you have one, otherwise keep empty
    logoWidth: "180px"
  },
  checkout: {
    // THE HOOK: Focusing on the "First 48 Hours" fear
    headline: "The Red Protocol: The 'First 48 Hours' Checklist Your Family Doesn't Have.",
    subhead: "Standard wills handle the money, but they fail to handle the chaos. This is the operational manual for when the silence settles.",
    productName: "The Legacy Blueprint (Red Protocol Edition)",
    
    // PRICE: The "DoorDash" impulse zone
    price: 3700, // $37.00
    
    // IMAGE: Ensure this is a high-res shot of the binder or the PDF cover
    image: "/images/legacy-blueprint-cover.png", 
    
    // VIDEO: If you don't have a VSL yet, comment this out or use a static image
     videoEmbedUrl: "", 
    
    // FEATURES: Pulled directly from your Source PDF
    features: [
      "The Red Protocol: Immediate 'Crisis Map' for the First 48 Hours", // [cite: 13, 39]
      "The Digital Estate: Master Key System for Passwords & 2FA", // [cite: 463, 506]
      "Hidden Asset Recovery: Cold Storage & Safe Deposit Locator", // [cite: 428, 637]
      "The 'Do Not Sell' List: Heirloom protection protocol" // [cite: 1035]
    ],
    
    // STRIPE ID: The $37 Product
    stripePriceId: "price_1SkpGiKWkFGAPPbCu0hwJqTT",
    
    funnelType: 'digital_product', 
    ctaText: "Secure My Legacy ($37)"
  },
  
  // THE ORDER BUMP: "Speed & Automation"
  bump: {
    headline: "YES! Upgrade to the 'Digital Twin' & Data-Entry Suite (+$17)",
    description: "Don't handwrite 100+ pages. Get the Fillable PDF + Excel 'Data Vault' to finish in 20 mins. Auto-calculates net worth. Error-proof.",
    
    // PRICE: $17.00
    price: 1700, 
    
    // STRIPE ID: The $17 Product (Or the $54 Bundle ID if using swap logic)
    stripePriceId: "price_1SkpHXKWkFGAPPbC9xuZ6PJK"
  },
  
  // THE OTO / UPSELL: "Family Peace"
  oto: {
    headline: "Wait! Your Order is Complete, But Your Mission Isn't.",
    // The subhead implied here is: "How do you tell your wife?"
    
    videoPlaceholder: "The Family Peace Protocol (Preview)",
    
    // PRICE: $27 (Discounted from $97)
    price: 2700, 
    retailPrice: 9700,
    
    features: [
      "The 'Roundtable' Script: Word-for-word family meeting guide",
      "The Video Legacy Guide: How to record your 'Ethical Will'", // [cite: 1106]
      "The Psychology of Peace: Avoiding the 'Burden' trap"
    ],
    
    // STRIPE ID: The $27 Product
    stripePriceId: "price_1SkpIvKWkFGAPPbC4BNSXdFJ"
  }
};