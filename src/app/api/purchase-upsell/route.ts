import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from '@/lib/products';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia" as any, 
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { originalPaymentIntentId, type = 'oto' } = await req.json();

    if (!originalPaymentIntentId) return NextResponse.json({ error: "Missing Transaction ID" }, { status: 400 });

    const originalIntent = await stripe.paymentIntents.retrieve(originalPaymentIntentId);
    if (originalIntent.status !== "succeeded") return NextResponse.json({ error: "Initial payment incomplete" }, { status: 400 });

    const metadataKey = type === 'downsell' ? 'downsell_purchased' : 'upsell_purchased';
    if (originalIntent.metadata?.[metadataKey] === 'true') {
        return NextResponse.json({ success: true, message: "Already purchased" });
    }

    const productSlug = originalIntent.metadata.product_slug;
    const customerId = typeof originalIntent.customer === 'string' ? originalIntent.customer : originalIntent.customer?.id;
    const paymentMethodId = typeof originalIntent.payment_method === 'string' ? originalIntent.payment_method : originalIntent.payment_method?.id;

    if (!productSlug || !customerId || !paymentMethodId) return NextResponse.json({ error: "Missing Customer Data" }, { status: 400 });

    // THE TANK: Local Fetch Only
    const product = getProduct(productSlug);
    if (!product) throw new Error("Product not found");

    const priceToCharge = type === 'downsell' ? product.downsell?.price : product.oto.price;
    if (!priceToCharge) throw new Error(`No price found for ${type}`);

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

    await stripe.paymentIntents.update(originalPaymentIntentId, { metadata: { [metadataKey]: 'true' } });

    return NextResponse.json({ success: true, newOrderId: newIntent.id });

  } catch (error: any) {
    console.error("Purchase Error:", error);
    return NextResponse.json({ error: error.message || "Payment Failed" }, { status: 500 });
  }
}
