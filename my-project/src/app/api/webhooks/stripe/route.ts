/* FILE: src/app/api/webhooks/stripe/route.ts */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
const resend = new Resend(process.env.RESEND_API_KEY);
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://137.184.188.99";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  
  // FIX: Await headers() before getting the signature
  const headerList = await headers();
  const signature = headerList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) throw new Error("Missing Stripe Webhook Secret");
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle Successful Payments
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    const { receipt_email, metadata } = paymentIntent;
    const email = receipt_email || "unknown@example.com";
    const name = metadata.customerName || "Valued Customer";
    const productName = metadata.product || "Digital Bundle";

    console.log(`💰 Payment succeeded: ${paymentIntent.id} for ${email}`);

    // 1. SAVE TO STRAPI
    try {
      await fetch(`${STRAPI_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            stripePaymentIntentId: paymentIntent.id,
            customerEmail: email,
            customerName: name,
            amountTotal: paymentIntent.amount,
            productsPurchased: metadata, 
            paymentStatus: "paid",
          },
        }),
      });
      console.log("✅ Order saved to Strapi");
    } catch (error) {
      console.error("❌ Failed to save order to Strapi:", error);
    }

    // 2. SEND RECEIPT EMAIL
    if (process.env.RESEND_API_KEY) {
        try {
        await resend.emails.send({
            from: "onboarding@resend.dev", 
            to: email,
            subject: "Access your Digital Bundle 🚀",
            html: `
            <h1>Welcome, ${name}!</h1>
            <p>Thank you for purchasing <strong>${productName}</strong>.</p>
            <p>You can access your products immediately here:</p>
            <a href="${process.env.NEXT_PUBLIC_URL}/sign-up?email=${email}" style="background:#4F46E5;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;">Create Your Account</a>
            `,
        });
        console.log("✅ Receipt email sent");
        } catch (error) {
        console.error("❌ Failed to send email:", error);
        }
    }
  }

  return NextResponse.json({ received: true });
}