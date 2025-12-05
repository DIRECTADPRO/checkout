/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

// 1. Initialize Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) console.error("❌ CRITICAL: Stripe Key is missing in .env.local");
const stripePromise = loadStripe(stripeKey!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  // 2. State Management
  const [amount, setAmount] = useState<number>(checkout.price);

  // 3. THE LOGIC FIX: Keeps the price at $7.00
  useEffect(() => {
    if (checkout.price) {
      setAmount(checkout.price);
    }
  }, [checkout.price]);

  // 4. Stripe Appearance (Clean & Minimal)
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: theme.primaryColor || '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      borderRadius: '8px',
    },
  };

  const options = {
    mode: 'payment' as const,
    amount: amount, 
    currency: 'usd',
    appearance,
  };

  const handleBumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT COLUMN: Product Info (Span 7) --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* LOGO: Strictly constrained height */}
            <div className="mb-6">
               {theme.logoUrl ? (
                  <img 
                    src={theme.logoUrl} 
                    alt="Logo" 
                    className="h-12 w-auto object-contain" /* <--- FIXES HUGE LOGO */
                  />
               ) : (
                  <div className="text-2xl font-bold">LOGO</div>
               )}
            </div>

            {/* HERO IMAGE */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <img 
                src={checkout.image} 
                alt={checkout.productName} 
                className="w-full h-auto object-cover" 
              />
            </div>

            {/* HEADLINES */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                {checkout.headline}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {checkout.subhead}
              </p>
            </div>

            {/* WHAT'S INCLUDED */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                What's Included:
              </h3>
              <ul className="space-y-3">
                {checkout.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span style={{ color: theme.primaryColor }} className="font-bold text-lg">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Checkout Form (Span 5) --- */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              
              {/* ORDER SUMMARY */}
              <div className="flex justify-between items-end pb-6 border-b border-gray-100 mb-6">
                <div>
                   <h2 className="text-lg font-semibold text-gray-700">Order Summary</h2>
                   <p className="text-sm text-gray-400">Total Today</p>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                   ${(amount / 100).toFixed(2)}
                </div>
              </div>

              {/* STRIPE ELEMENTS */}
              <Elements key={amount} options={options} stripe={stripePromise}>
                <CheckoutForm amountInCents={amount} isPriceUpdating={false}>
                    
                    {/* ORDER BUMP (Inside Form) */}
                    <div className="mt-6 mb-6 p-4 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg flex gap-3">
                      <input 
                        type="checkbox" 
                        id="bump-offer" 
                        className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        onChange={handleBumpChange}
                      />
                      <label htmlFor="bump-offer" className="flex-1 cursor-pointer">
                        <span className="block font-bold text-red-700 text-sm uppercase mb-1">
                           {bump.headline}
                        </span>
                        <p className="text-sm text-gray-700 leading-snug">
                           {bump.description}
                        </p>
                      </label>
                    </div>

                </CheckoutForm>
              </Elements>

              {/* SECURITY BADGE */}
              <div className="mt-6 text-center">
                 <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    <span>🔒 Secure 256-bit SSL Encryption</span>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}