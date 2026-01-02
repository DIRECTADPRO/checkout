/* FILE: src/app/api/purchase-upsell/route.ts */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductFromStrapi } from "@/lib/strapi"; 
import { getProduct as getStaticProduct } from '@/lib/products';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia" as any, // Standardized to your working version
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { originalPaymentIntentId, type = 'oto' } = await req.json();

    if (!originalPaymentIntentId) {
      return NextResponse.json({ error: "Missing Transaction ID" }, { status: 400 });
    }

    // 1. Retrieve the original successful transaction
    const originalIntent = await stripe.paymentIntents.retrieve(originalPaymentIntentId);

    if (originalIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Initial payment incomplete" }, { status: 400 });
    }

    // --- IDEMPOTENCY CHECK ---
    const metadataKey = type === 'downsell' ? 'downsell_purchased' : 'upsell_purchased';
    if (originalIntent.metadata?.[metadataKey] === 'true') {
        return NextResponse.json({ success: true, message: "Already purchased" });
    }

    // 2. Identify the Product
    const productSlug = originalIntent.metadata.product_slug;
    const customerId = typeof originalIntent.customer === 'string' ? originalIntent.customer : originalIntent.customer?.id;
    
    const paymentMethodId = typeof originalIntent.payment_method === 'string' 
        ? originalIntent.payment_method 
        : originalIntent.payment_method?.id;

    if (!productSlug || !customerId || !paymentMethodId) {
       return NextResponse.json({ error: "Missing Customer Data" }, { status: 400 });
    }

    // 3. Get Product (Strapi -> Fallback to Local)
    let product = await getProductFromStrapi(productSlug);
    
    if (!product) {
        // FIX: Fallback to local file if not in Strapi
        product = getStaticProduct(productSlug) ?? null;
    }

    if (!product) throw new Error("Product not found");

    // Determine Price based on Type
    const priceToCharge = type === 'downsell' ? product.downsell?.price : product.oto.price;

    if (!priceToCharge) {
        throw new Error(`No price found for ${type}`);
    }

    // 4. Create the Charge
    const newIntent = await stripe.paymentIntents.create({
      amount: priceToCharge,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true, 
      confirm: true,     
      metadata: {
        is_upsell: "yes",
        type: type,
        parent_transaction: originalPaymentIntentId,
        product_slug: productSlug
      }
    });

    // 5. Update Original Transaction
    await stripe.paymentIntents.update(originalPaymentIntentId, {
        metadata: {
            [metadataKey]: 'true'
        }
    });

    return NextResponse.json({ success: true, newOrderId: newIntent.id });

  } catch (error: any) {
    console.error("Purchase Error:", error);
    return NextResponse.json(
      { error: error.message || "Payment Failed" }, 
      { status: 500 }
    );
  }
}
