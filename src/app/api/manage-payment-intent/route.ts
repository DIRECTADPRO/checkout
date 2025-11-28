import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Config } from "@/lib/env";
import { getProduct } from "@/lib/products";

// Initialize Stripe using the validated configuration
const stripe = new Stripe(Config.stripeSecretKey, {
  typescript: true, // Enforce strict typing for Stripe responses
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { includeBump, productSlug, paymentIntentId } = body;

    // 1. Get the real price from the registry based on the slug
    // Fallback to 'email-bundle' if slug is missing, though frontend should always send it.
    const product = getProduct(productSlug || "email-bundle");
    
    if (!product) {
      throw new Error("Invalid product slug");
    }

    // 2. Calculate Total securely on the server
    let amount = product.checkout.price;
    if (includeBump) {
      amount += product.bump.price;
    }

    let paymentIntent: Stripe.PaymentIntent;

    // 3. Manage the Payment Intent (Create or Update Pattern)
    if (paymentIntentId && typeof paymentIntentId === "string") {
      // Update existing PaymentIntent
      paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: amount,
        metadata: {
          product_slug: productSlug,
          order_bump_included: includeBump ? "yes" : "no",
        },
      });
    } else {
      // Create new PaymentIntent
      
      // CRITICAL STEP: Create a Customer first. 
      // This is required to attach a PaymentMethod and charge it later (Off-Session) for the Upsell.
      const customer = await stripe.customers.create({
        metadata: {
            funnel_source: productSlug
        }
      });

      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        customer: customer.id, // <--- Links the payment method to this customer
        // Enable automatic methods for optimized conversion (Wallets, etc.)
        automatic_payment_methods: {
          enabled: true,
        },
        // AOV Optimization: Prepare for One-Click Upsells.
        // "off_session" tells Stripe to get consent to charge this card again later.
        setup_future_usage: "off_session", 
        metadata: {
          product_slug: productSlug,
          order_bump_included: includeBump ? "yes" : "no",
        },
      });
    }

    // 4. Return necessary data to the frontend
    if (!paymentIntent.client_secret) {
      throw new Error("Stripe failed to generate client_secret.");
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
    });
  } catch (error: any) {
    console.error("API Error (manage-payment-intent):", error);

    // Log the specific error internally, return a generic error to the client
    return NextResponse.json(
      { error: error.message || `Internal Server Error: Unable to process payment details.` },
      { status: 500 }
    );
  }
}