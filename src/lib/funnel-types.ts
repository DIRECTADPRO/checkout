/* FILE: src/lib/funnel-types.ts */

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

// A standard default to keep the map clean for generic types
const DEFAULT_DIGITAL: FunnelBehavior = {
  requiresShipping: false,
  requiresBillingAddress: false,
  defaultButtonText: "Get Instant Access",
  showOrderBump: true,
  fulfillmentMode: 'digital',
  isSubscription: false,
};

export const FUNNEL_BEHAVIORS: Record<FunnelType, FunnelBehavior> = {
  // --- CORE COMMERCE ---
  digital_product: DEFAULT_DIGITAL,
  physical_product: { ...DEFAULT_DIGITAL, requiresShipping: true, requiresBillingAddress: true, defaultButtonText: "Ship My Order", fulfillmentMode: 'physical' },
  free_plus_shipping: { ...DEFAULT_DIGITAL, requiresShipping: true, requiresBillingAddress: true, defaultButtonText: "I'll Cover Shipping", fulfillmentMode: 'physical' },
  tripwire_offer: { ...DEFAULT_DIGITAL, defaultButtonText: "Grab This Deal" },
  pre_order: { ...DEFAULT_DIGITAL, requiresShipping: true, requiresBillingAddress: true, defaultButtonText: "Reserve My Copy", fulfillmentMode: 'physical' },
  
  // --- SUBSCRIPTIONS ---
  membership_sub: { ...DEFAULT_DIGITAL, isSubscription: true, defaultButtonText: "Start My Trial" },
  saas_trial: { ...DEFAULT_DIGITAL, isSubscription: true, defaultButtonText: "Start Free Trial" },
  newsletter_signup: { ...DEFAULT_DIGITAL, showOrderBump: false, defaultButtonText: "Subscribe Now" },
  
  // --- EVENTS & SERVICES ---
  event_ticket: { ...DEFAULT_DIGITAL, defaultButtonText: "Get Tickets" },
  consulting_retainer: { ...DEFAULT_DIGITAL, isSubscription: true, defaultButtonText: "Hire Now", fulfillmentMode: 'service' },
  high_ticket_call: { ...DEFAULT_DIGITAL, defaultButtonText: "Book Your Call", fulfillmentMode: 'service' },
  calendar_booking: { ...DEFAULT_DIGITAL, defaultButtonText: "Confirm Time", fulfillmentMode: 'service' },
  
  // --- LEAD GEN & OTHERS ---
  lead_magnet: { ...DEFAULT_DIGITAL, defaultButtonText: "Download Now", showOrderBump: false },
  waitlist: { ...DEFAULT_DIGITAL, defaultButtonText: "Join Waitlist", showOrderBump: false },
  quiz_funnel: { ...DEFAULT_DIGITAL, defaultButtonText: "See Results", showOrderBump: false },
  survey_feedback: { ...DEFAULT_DIGITAL, defaultButtonText: "Submit Feedback", showOrderBump: false },
  challenge_funnel: { ...DEFAULT_DIGITAL, defaultButtonText: "Join The Challenge" },
  application_funnel: { ...DEFAULT_DIGITAL, defaultButtonText: "Submit Application", showOrderBump: false },
  video_sales_letter: { ...DEFAULT_DIGITAL, defaultButtonText: "Get Access Now" },
  webinar_live: { ...DEFAULT_DIGITAL, defaultButtonText: "Register for Live Class" },
  webinar_replay: { ...DEFAULT_DIGITAL, defaultButtonText: "Watch Replay" },
  product_launch: { ...DEFAULT_DIGITAL, defaultButtonText: "Get Early Access" },
  affiliate_bridge: { ...DEFAULT_DIGITAL, defaultButtonText: "Continue..." },
  charity_donation: { ...DEFAULT_DIGITAL, defaultButtonText: "Donate Now" },
};