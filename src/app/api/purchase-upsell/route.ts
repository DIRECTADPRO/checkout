import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Config } from "@/lib/env";
import { getProduct } from "@/lib/products";

const stripe = new Stripe(Config.stripeSecretKey, { typescript: true });

export async function POST(req: NextRequest) {
  try {
    const { originalPaymentIntentId } = await req.json();

    if (!originalPaymentIntentId) {
      return NextResponse.json({ error: "Missing Transaction ID" }, { status: 400 });
    }

    // 1. Retrieve the original successful transaction
    const originalIntent = await stripe.paymentIntents.retrieve(originalPaymentIntentId);

    if (originalIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Initial payment incomplete" }, { status: 400 });
    }

    // 2. Identify the Product and Customer
    const productSlug = originalIntent.metadata.product_slug;
    const customerId = typeof originalIntent.customer === 'string' ? originalIntent.customer : originalIntent.customer?.id;
    
    // We need the payment method ID used in the first transaction.
    // When setup_future_usage is used, the payment method is attached to the Customer.
    const paymentMethodId = typeof originalIntent.payment_method === 'string' 
        ? originalIntent.payment_method 
        : originalIntent.payment_method?.id;

    if (!productSlug || !customerId || !paymentMethodId) {
       return NextResponse.json({ error: "Cannot process One-Click Upsell: Missing Customer Data" }, { status: 400 });
    }

    const product = getProduct(productSlug);
    const upsellPrice = product.oto.price;

    // 3. Create the Upsell Charge (Off-Session)
    // We confirm immediately because we already have the permission from the first checkout
    const upsellIntent = await stripe.paymentIntents.create({
      amount: upsellPrice,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true, // <--- The logic that allows charging without user interaction
      confirm: true,     // <--- Process immediately
      metadata: {
        is_upsell: "yes",
        parent_transaction: originalPaymentIntentId,
        product_slug: productSlug
      }
    });

    return NextResponse.json({ success: true, newOrderId: upsellIntent.id });

  } catch (error: any) {
    console.error("Upsell Error:", error);
    return NextResponse.json(
      { error: "Payment Failed. The card could not be charged." }, 
      { status: 500 }
    );
  }
}