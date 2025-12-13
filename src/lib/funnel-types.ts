// src/lib/funnel-types.ts

export type FunnelType = 
  | 'digital_product'
  | 'physical_product'
  | 'free_plus_shipping'
  | 'tripwire_offer'
  | 'pre_order'
  | 'charity_donation'
  | 'event_ticket'
  | 'membership_sub'
  | 'saas_trial'
  | 'consulting_retainer'
  | 'newsletter_signup'
  | 'lead_magnet'
  | 'waitlist'
  | 'quiz_funnel'
  | 'survey_feedback'
  | 'challenge_funnel'
  | 'high_ticket_call'
  | 'application_funnel'
  | 'calendar_booking'
  | 'video_sales_letter'
  | 'webinar_live'
  | 'webinar_replay'
  | 'product_launch'
  | 'affiliate_bridge';

export interface FunnelBehavior {
  requiresShipping: boolean;
  requiresBillingAddress: boolean;
  defaultButtonText: string;
  showOrderBump: boolean;
  fulfillmentMode: 'digital' | 'physical' | 'service';
  isSubscription: boolean;
}

const DEFAULT_DIGITAL: FunnelBehavior = {
  requiresShipping: false,
  requiresBillingAddress: false,
  defaultButtonText: "Get Instant Access",
  showOrderBump: true,
  fulfillmentMode: 'digital',
  isSubscription: false,
};

const DEFAULT_PHYSICAL: FunnelBehavior = {
  requiresShipping: true,
  requiresBillingAddress: true,
  defaultButtonText: "Ship My Order",
  showOrderBump: true,
  fulfillmentMode: 'physical',
  isSubscription: false,
};

const DEFAULT_SERVICE: FunnelBehavior = {
  requiresShipping: false,
  requiresBillingAddress: true,
  defaultButtonText: "Book Now",
  showOrderBump: false,
  fulfillmentMode: 'service',
  isSubscription: false,
};

// THE SINGLE SOURCE OF TRUTH
export const FUNNEL_BEHAVIORS: Record<FunnelType, FunnelBehavior> = {
  // --- PHYSICAL COMMERCE ---
  physical_product:   DEFAULT_PHYSICAL,
  free_plus_shipping: { ...DEFAULT_PHYSICAL, defaultButtonText: "I'll Cover Shipping" },
  pre_order:          { ...DEFAULT_PHYSICAL, defaultButtonText: "Reserve My Copy" },
  
  // --- DIGITAL COMMERCE ---
  digital_product:    DEFAULT_DIGITAL,
  tripwire_offer:     { ...DEFAULT_DIGITAL, defaultButtonText: "Grab This Deal" },
  event_ticket:       { ...DEFAULT_DIGITAL, defaultButtonText: "Get Tickets" },
  charity_donation:   { ...DEFAULT_DIGITAL, defaultButtonText: "Donate Now" },
  
  // --- SUBSCRIPTIONS ---
  membership_sub:     { ...DEFAULT_DIGITAL, isSubscription: true, defaultButtonText: "Start Membership" },
  saas_trial:         { ...DEFAULT_DIGITAL, isSubscription: true, defaultButtonText: "Start Free Trial" },
  consulting_retainer:{ ...DEFAULT_SERVICE, isSubscription: true, defaultButtonText: "Activate Retainer" },
  
  // --- LEAD GEN & CONTENT (Usually Free or Low Barrier) ---
  newsletter_signup:  { ...DEFAULT_DIGITAL, showOrderBump: false, defaultButtonText: "Subscribe" },
  lead_magnet:        { ...DEFAULT_DIGITAL, showOrderBump: false, defaultButtonText: "Download Now" },
  waitlist:           { ...DEFAULT_DIGITAL, showOrderBump: false, defaultButtonText: "Join Waitlist" },
  quiz_funnel:        { ...DEFAULT_DIGITAL, showOrderBump: false, defaultButtonText: "See Results" },
  survey_feedback:    { ...DEFAULT_DIGITAL, showOrderBump: false, defaultButtonText: "Submit Feedback" },
  
  // --- HIGH TOUCH / APPLICATION ---
  high_ticket_call:   { ...DEFAULT_SERVICE, defaultButtonText: "Book Your Call" },
  application_funnel: { ...DEFAULT_SERVICE, defaultButtonText: "Submit Application" },
  calendar_booking:   { ...DEFAULT_SERVICE, defaultButtonText: "Confirm Appointment" },
  
  // --- EVENTS & LAUNCHES ---
  challenge_funnel:   { ...DEFAULT_DIGITAL, defaultButtonText: "Join The Challenge" },
  video_sales_letter: { ...DEFAULT_DIGITAL, defaultButtonText: "Get Access Now" },
  webinar_live:       { ...DEFAULT_DIGITAL, defaultButtonText: "Register for Live Class" },
  webinar_replay:     { ...DEFAULT_DIGITAL, defaultButtonText: "Watch Replay" },
  product_launch:     { ...DEFAULT_DIGITAL, defaultButtonText: "Get Early Access" }, // Often digital, change to physical if you ship launch kits
  affiliate_bridge:   { ...DEFAULT_DIGITAL, defaultButtonText: "Continue..." },
};

export function getFunnelConfig(type: string): FunnelBehavior {
  const validKey = (type in FUNNEL_BEHAVIORS ? type : 'digital_product') as FunnelType;
  return FUNNEL_BEHAVIORS[validKey];
}