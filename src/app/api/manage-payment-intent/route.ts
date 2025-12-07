/* FILE: src/app/api/manage-payment-intent/route.ts */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductFromStrapi } from "@/lib/strapi"; 
import { getProduct as getStaticProduct } from '@/lib/products'; 

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover", // Ensure this matches your version
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { productSlug, includeBump, userEmail, userName } = await req.json();

    // 1. FETCH PRODUCT
    let product = await getProductFromStrapi(productSlug);
    if (!product) {
      product = getStaticProduct(productSlug);
    }
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // 2. CALCULATE TOTAL
    let totalAmount = product.checkout.price;
    if (includeBump) {
      totalAmount += product.bump.price;
    }

    console.log(`[API] Processing: ${userEmail} | Total: $${totalAmount/100}`);

    // 3. GET OR CREATE STRIPE CUSTOMER (Critical for Upsells)
    // We check if this email already has a customer ID
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId = customers.data.length > 0 ? customers.data[0].id : null;

    if (!customerId) {
      const newCustomer = await stripe.customers.create({ 
          email: userEmail, 
          name: userName,
          metadata: { first_product: productSlug }
      });
      customerId = newCustomer.id;
    }

    // 4. CREATE INTENT WITH FUTURE USAGE
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      customer: customerId, // <--- Attach to Customer
      setup_future_usage: 'off_session', // <--- Permission to charge again later
      receipt_email: userEmail,
      metadata: {
        product: product.checkout.productName,
        hasBump: includeBump ? "true" : "false",
        customerName: userName,
        product_slug: productSlug // Save slug for the upsell API to use
      },
      payment_method_types: ["card"], 
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error: any) {
    console.error("[API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}