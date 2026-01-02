/* FILE: src/app/[slug]/success/page.tsx */
import React from 'react';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/products';
import Image from 'next/image';

// Force dynamic rendering so we handle new customers instantly
export const dynamic = 'force-dynamic';

export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Get the product configuration
  const product = getProduct(slug);

  // --- THE FIX: SAFETY CHECK ---
  // We stop the code right here if the product is missing.
  // This satisfies TypeScript and prevents the crash.
  if (!product) {
    return notFound();
  }
  // -----------------------------

  const { theme, checkout, oto } = product;

  return (
    <div style={{ backgroundColor: theme.backgroundColor }} className="min-h-screen flex flex-col items-center justify-center p-6">
      
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div style={{ backgroundColor: theme.primaryColor }} className="p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-white/80">Your secure access link has been sent to your email.</p>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    ✅
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Payment Successful</h3>
                    <p className="text-sm text-gray-600">You will see a charge from "{checkout.productName}" on your statement.</p>
                </div>
            </div>

            {/* OTO LINK (If applicable) */}
            <div className="text-center pt-4">
                <p className="text-gray-500 text-sm mb-4">Did you miss the Family Peace Protocol?</p>
                <a 
                   href={`/${slug}/oto`}
                   style={{ color: theme.accentColor }} 
                   className="font-bold hover:underline"
                >
                    Click here to check availability &rarr;
                </a>
            </div>
        </div>

      </div>
    </div>
  );
}