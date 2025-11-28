import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const eventData = await req.json();

    // 1. Log to Server Console (This effectively replaces a database for now)
    // You will see this data in your VS Code terminal when a user interacts.
    console.log("------------------------------------------------");
    console.log("📊 [ANALYTICS EVENT RECEIVED]");
    console.log(`Type:    ${eventData.eventType}`);
    console.log(`Slug:    ${eventData.productSlug}`);
    console.log(`Status:  ${eventData.eventStatus}`);
    if (eventData.revenueGross) {
        console.log(`Revenue: $${eventData.revenueGross / 100}`);
    }
    console.log("------------------------------------------------");

    // TODO: Connect to Supabase/Postgres here in the future
    // await db.insert(eventData)...

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics Error:", error);
    // Always return 200 to frontend so we don't block the user experience
    return NextResponse.json({ success: false }, { status: 200 }); 
  }
}