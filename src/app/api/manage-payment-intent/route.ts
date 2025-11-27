import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Config } from "@/lib/env";

// Initialize Stripe using the validated configuration
const stripe = new Stripe(Config.stripeSecretKey, {
  // apiVersion removed to let the library use its default compatible version.
  typescript: true, // Enforce strict typing for Stripe responses
});

// Define constants for pricing (replace with DB/CMS lookup in production)
const PRICE_BASE_PRODUCT = 499; // $4.99
const PRICE_ORDER_BUMP = 2399; // $23.99

/**
 * Calculates the order total on the server side.
 * SECURITY: Never trust amounts calculated on the client.
 */
const calculateOrderAmount = (includeBump: boolean): number => {
  let total = PRICE_BASE_PRODUCT;

  if (includeBump) {
    total += PRICE_ORDER_BUMP;
  }
  return total;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Ensure input is correctly typed
    const includeBump: boolean = body.includeBump === true;
    const paymentIntentId: string | undefined = body.paymentIntentId;

    // 1. Calculate the amount securely
    const amount = calculateOrderAmount(includeBump);
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;

    // 2. Manage the Payment Intent (Create or Update Pattern)
    if (paymentIntentId && typeof paymentIntentId === "string") {
      // Update existing PaymentIntent
      paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: amount,
        metadata: {
          order_bump_included: includeBump ? "yes" : "no",
        },
      });
    } else {
      // Create new PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        // Enable automatic methods for optimized conversion (Wallets, etc.)
        automatic_payment_methods: {
          enabled: true,
        },
        // AOV Optimization: Prepare for One-Click Upsells.
        setup_future_usage: "off_session",
        metadata: {
          order_bump_included: includeBump ? "yes" : "no",
        },
      });
    }

    // 3. Return necessary data to the frontend
    if (!paymentIntent.client_secret) {
      throw new Error("Stripe failed to generate client_secret.");
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
    });
  } catch (error: unknown) {
    console.error("API Error (manage-payment-intent):", error);

    // Log the specific error internally, return a generic error to the client
    return NextResponse.json(
      { error: `Internal Server Error: Unable to process payment details.` },
      { status: 500 }
    );
  }
}