/* FILE: src/app/api/manage-payment-intent/route.ts */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductFromStrapi } from "@/lib/strapi"; 
import { getProduct as getStaticProduct } from '@/lib/products'; 

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // FIX: Updated to match your installed SDK version
  apiVersion: "2025-11-17.clover", 
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { productSlug, includeBump, userEmail, userName } = await req.json();

    // 1. FETCH LIVE DATA
    let product = await getProductFromStrapi(productSlug);

    if (!product) {
      console.warn(`API: Strapi failed for ${productSlug}, using static fallback.`);
      product = getStaticProduct(productSlug);
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 2. CALCULATE TOTAL
    let totalAmount = product.checkout.price; // Base Price
    
    if (includeBump) {
      totalAmount += product.bump.price; // Add Bump Price
    }

    console.log(`[API] Creating Intent for: ${userEmail} | Total: ${totalAmount}`);

    // 3. CREATE PAYMENT INTENT
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      receipt_email: userEmail,
      metadata: {
        product: product.checkout.productName,
        hasBump: includeBump ? "true" : "false",
        customerName: userName
      },
      // CRITICAL FIX: Force "card" only. This disables "Link", Apple Pay, Google Pay.
      payment_method_types: ["card"], 
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error: any) {
    console.error("[API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}