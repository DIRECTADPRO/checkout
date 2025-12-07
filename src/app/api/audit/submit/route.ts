/* FILE: src/app/api/audit/submit/route.ts */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req: NextRequest) {
  // FIX: Await the auth() promise
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { websiteUrl, draftLink } = body;

    // Save to Strapi
    const res = await fetch(`${STRAPI_URL}/api/audit-submissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          clerkUserId: userId, 
          websiteUrl,
          draftLink,
          status: "pending",
        },
      }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("Strapi Save Error:", errorData);
        throw new Error("Failed to save to Strapi");
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}