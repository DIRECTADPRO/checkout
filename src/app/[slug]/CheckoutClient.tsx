/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

// Import design system
import '@/styles/checkout-design.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  // Initialize state with the product price
  const [amount, setAmount] = useState<number>(checkout.price);

  // CRITICAL LOGIC: Force price update when Strapi data loads
  useEffect(() => {
    if (checkout.price) {
      setAmount(checkout.price);
    }
  }, [checkout.price]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5', 
      colorBackground: '#F9FAFB', // Slightly off-white for inputs to contrast with the white card
      colorText: '#111827',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
  };

  const options = {
    mode: 'payment' as const,
    amount: amount, 
    currency: 'usd',
    appearance,
  };

  // Order Bump Component
  const OrderBumpComponent = (
    <div className="order-bump">
      <label className="order-bump-label" htmlFor="bump-offer">
        <input 
          type="checkbox" 
          id="bump-offer" 
          onChange={(e) => {
            setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
          }}
        />
        <div className="order-bump-content" style={{marginLeft: '12px'}}>
          <div className="order-bump-title">
             {bump.headline}
          </div>
          <div className="order-bump-description">
             <span className="order-bump-price-container" style={{display: 'block', marginBottom: '4px'}}>
               <span style={{color: '#15803D', fontWeight: 'bold'}}>One-Time Offer (${(bump.price / 100).toFixed(2)}):</span>
             </span>
             {bump.description}
          </div>
        </div>
      </label>
    </div>
  );

  return (
    <div 
      style={{ 
        '--color-primary-cta': '#4F46E5',
        '--color-background': '#F3F4F6', // Light gray page background to make the white cards pop
        '--color-text': '#111827' 
      } as React.CSSProperties}
      className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900"
    >
      <div className="max-w-[1140px] mx-auto px-4 py-12">
        
        {/* LAYOUT: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
          
          {/* --- LEFT COLUMN: The "Work" Zone --- */}
          {/* FIX #6: Added Boundary Box (bg-white, shadow, border) */}
          <div className="left-column bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
             
             {/* FIX #2, #4, #5: Header Area inside the boundary box */}
             <div className="mb-8 border-b border-gray-100 pb-6">
                {/* Logo */}
                {theme.logoUrl ? (
                  <img src={theme.logoUrl} alt="Logo" className="logo mb-6" style={{width: theme.logoWidth, maxWidth: '180px'}} />
                ) : (
                  <div className="logo mb-6 font-bold text-2xl">LOGO</div>
                )}
                
                {/* Headlines */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {checkout.headline}
                </h1>
                <p className="text-base text-gray-500 leading-relaxed">
                  {checkout.subhead}
                </p>
             </div>

             {/* FIX #3: Added "Customer Information" Section Header */}
             <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Customer Information
                </h2>
             </div>

             {/* Payment Form */}
             <div className="form-container">
               <Elements key={amount} options={options} stripe={stripePromise}>
                 <CheckoutForm 
                     amountInCents={amount} 
                     isPriceUpdating={false}
                 >
                     {OrderBumpComponent}
                 </CheckoutForm>
               </Elements>
             </div>

             {/* Legal Footer */}
             <div className="disclaimer mt-8 text-xs text-gray-400 text-center leading-relaxed">
                By providing your card information, you allow Teal Swing to charge your card for future payments in accordance with their terms.
             </div>
          </div>

          {/* --- RIGHT COLUMN: The "Receipt" Zone --- */}
          <div className="checkout-sidebar">
            <div className="card relative bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              
              {/* Floating Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#2E1065] text-white px-6 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm whitespace-nowrap">
                Order Summary
              </div>
              
              <div className="mt-4">
                 {/* Hero Image */}
                 <img 
                   src={checkout.image} 
                   alt={checkout.productName} 
                   className="w-full h-auto rounded-lg shadow-sm mb-6 block"
                 />

                 {/* Product Title */}
                 <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {checkout.productName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Full Access Digital Package
                    </p>
                 </div>

                 {/* What's Included Bullets */}
                 {/* FIX #1: Removed 'border' class to remove the black line */}
                 <div className="bg-gray-50 rounded-lg p-5 mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      What's Included:
                    </p>
                    <ul className="space-y-3">
                      {checkout.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <span style={{color: theme.primaryColor}} className="font-bold mt-0.5">✓</span> 
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                 </div>

                 {/* Divider */}
                 <div className="h-px bg-gray-100 my-6"></div>
                 
                 {/* Pricing Breakdown */}
                 <div className="pricing-breakdown space-y-3">
                    {/* Item 1: The Book */}
                    <div className="flex justify-between text-sm text-gray-600">
                        <span className="font-medium">{checkout.productName}</span>
                        <span className="font-semibold text-gray-900">${(checkout.price / 100).toFixed(2)}</span>
                    </div>

                    {/* Item 2: The Bump (Conditional) */}
                    {amount > checkout.price && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span className="font-medium">Audit Video Upgrade</span>
                            <span className="font-semibold text-gray-900">${(bump.price / 100).toFixed(2)}</span>
                        </div>
                    )}
                    
                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200 mt-4">
                        <span className="text-base font-extrabold text-gray-900">Total Due</span>
                        <span className="text-2xl font-extrabold text-[#10B981]">${(amount / 100).toFixed(2)}</span>
                    </div>
                 </div>

              </div>

              {/* Security Badge */}
              <div className="mt-8 text-center">
                 <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    🔒 256-bit SSL Secure
                 </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}