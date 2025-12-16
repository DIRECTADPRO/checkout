import { ProductConfig } from './index';

export const legacyBlueprint: ProductConfig = {
  id: "legacy-blueprint",
  theme: {
    primaryColor: "#000000", 
    accentColor: "#FF4F00",  
    backgroundColor: "#ffffff", 
    logoUrl: "", 
    logoWidth: "180px"
  },
  checkout: {
    headline: "The Modern Alternative to the 'Dusty Binder'",
    subhead: "The first estate planning system designed for the Digital Age.",
    productName: "The Legacy Blueprint",
    price: 2700, 
    image: "https://via.placeholder.com/600x400?text=Legacy+Blueprint", 
    videoEmbedUrl: "https://www.youtube.com/embed/PLACEHOLDER", // Ready for video
    features: ["The Red Protocol", "Digital Vault", "Financial Map"],
    stripePriceId: "price_legacy_core",
    funnelType: 'digital_product', 
    ctaText: "Download The Blueprint ($27)"
  },
  bump: {
    headline: "Add the 'Digital Lockbox' Kit?",
    description: "Don't leave passwords exposed. Get the security templates.",
    price: 1700, 
    stripePriceId: "price_legacy_bump"
  },
  oto: {
    headline: "Upgrade: The 'Sunday Afternoon' Audio Companion",
    videoPlaceholder: "Audio Guide Preview",
    price: 4700, 
    retailPrice: 9700,
    features: ["Audio Walkthrough", "Script: Talking to Kids", "Probate Pitfalls"],
    stripePriceId: "price_legacy_oto"
  }
};