/* FILE: src/app/[slug]/success/page.tsx */
import React from 'react';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/products';

// Force dynamic rendering so we handle new customers instantly
export const dynamic = 'force-dynamic';

export default async function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // 1. Get the product configuration
  const product = getProduct(slug);

  // 2. Safety Check: If product doesn't exist, trigger a 404 immediately.
  // This satisfies TypeScript that 'product' is not undefined below.
  if (!product) {
    return notFound();
  }

  // 3. Destructure safe data
  const { theme, checkout } = product;

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

            {/* OTO LINK */}
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