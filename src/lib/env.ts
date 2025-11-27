export const Config = {
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
};

if (!Config.stripePublishableKey || !Config.stripeSecretKey) {
  throw new Error("Missing Stripe API Keys in .env.local");
}