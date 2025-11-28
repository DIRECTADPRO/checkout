// src/lib/env.ts
// This check now uses a known fallback key only in a development environment.

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// A non-functional, safe key used only to prevent the UI from crashing locally.
const DUMMY_KEY = 'pk_test_DUMMY_KEY_FOR_LOCAL_UI_ONLY';

export const Config = {
  // If key is missing AND we are in dev, use the dummy key.
  stripePublishableKey: (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || (isDev ? DUMMY_KEY : undefined)) as string,
  stripeSecretKey: (process.env.STRIPE_SECRET_KEY || (isDev ? DUMMY_KEY : undefined)) as string,
};

// ONLY throw a FATAL error if we are in a production or staging environment.
if (!Config.stripePublishableKey || !Config.stripeSecretKey) {
  if (!isDev) {
      throw new Error(`[FATAL ERROR] Production Stripe API Keys are missing.`);
  }
}