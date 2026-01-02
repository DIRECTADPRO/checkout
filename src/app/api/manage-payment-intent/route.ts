import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductFromStrapi } from "@/lib/strapi"; 
import { getProduct as getStaticProduct } from '@/lib/products'; 
import { getFunnelConfig } from "@/lib/funnel-types"; // IMPORT THE BRAIN

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia" as any, // Use your latest version
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { productSlug, includeBump, userEmail, userName } = await req.json();

    // 1. FETCH PRODUCT
    let product = await getProductFromStrapi(productSlug);
    if (!product) {
      // FIX: The '?? null' ensures types match (null vs undefined)
      product = getStaticProduct(productSlug) ?? null;
    }
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // 2. DETERMINE CONFIGURATION FROM TYPE
    const funnelType = (product.checkout as any).funnelType || 'digital_product';
    const config = getFunnelConfig(funnelType); // AUTOMATIC CONFIGURATION

    // 3. CALCULATE TOTAL
    let totalAmount = product.checkout.price;
    if (includeBump) {
      totalAmount += product.bump.price;
    }

    console.log(`[API] Processing: ${userEmail} | Type: ${funnelType} | Mode: ${config.fulfillmentMode}`);

    // 4. GET/CREATE CUSTOMER
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

    // 5. CREATE INTENT WITH DYNAMIC RULES
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      customer: customerId, 
      setup_future_usage: 'off_session',
      receipt_email: userEmail,
      metadata: {
        product: product.checkout.productName,
        hasBump: includeBump ? "true" : "false",
        funnel_type: funnelType
      },
      // AUTOMATIC SHIPPING ENFORCEMENT
      ...(config.requiresShipping && {
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU'], 
        },
      }),
      payment_method_types: ["card"], 
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error: any) {
    console.error("[API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
