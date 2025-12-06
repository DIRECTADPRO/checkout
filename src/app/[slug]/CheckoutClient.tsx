/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

// CRITICAL: Import your design system
import '@/styles/checkout-design.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  // Initialize state with the product price
  const [amount, setAmount] = useState<number>(checkout.price);

  // CRITICAL LOGIC: Force price update when Strapi data loads ($4.99 -> $7.00)
  useEffect(() => {
    if (checkout.price) {
      setAmount(checkout.price);
    }
  }, [checkout.price]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5', // Indigo/Blurple (Matches description)
      colorBackground: '#F3F4F6', // Light Neutral (Matches description)
      colorText: '#111827', // Dark Neutral
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    mode: 'payment' as const,
    amount: amount, 
    currency: 'usd',
    appearance,
  };

  // Order Bump Component (Matches: Green Dashed Border, Pale Mint BG)
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
        '--color-background': '#FFFFFF', 
        '--color-text': '#111827' 
      } as React.CSSProperties}
    >
      <div className="checkout-container">
        
        {/* LAYOUT: 2 Columns (60% Left / 40% Right) */}
        {/* We use 'checkout-grid' from your CSS which defines 1.618fr 1fr */}
        <div className="checkout-grid">
          
          {/* LEFT COLUMN: Primary Interaction Area (Form) */}
          <div className="checkout-main">
             {/* Header */}
             <div style={{marginBottom: '20px'}}>
                <h1 style={{fontSize: '20px', fontWeight: '800', color: '#000'}}>Payment Details</h1>
                <p style={{fontSize: '14px', color: '#6B7280', marginTop: '4px'}}>Complete your purchase below.</p>
             </div>

             {/* The Form (Contains Inputs -> Bump -> CTA -> Guarantee) */}
             <Elements key={amount} options={options} stripe={stripePromise}>
               <CheckoutForm 
                   amountInCents={amount} 
                   isPriceUpdating={false}
               >
                   {OrderBumpComponent}
               </CheckoutForm>
             </Elements>

             {/* Legal Footer (Matches description) */}
             <div className="disclaimer">
                By providing your card information, you allow Teal Swing to charge your card for future payments in accordance with their terms.
             </div>
          </div>

          {/* RIGHT COLUMN: Summary Area (Floating Card) */}
          <div className="checkout-sidebar">
            <div className="card">
              {/* Floating Badge (Matches: Deep Purple Pill) */}
              <div className="card-header-pill" style={{backgroundColor: '#2E1065'}}>
                Order Summary
              </div>
              
              <div className="order-summary" style={{marginTop: '15px'}}>
                 {/* Item 1: The Book */}
                 <div className="summary-item">
                    <span className="summary-item-title">{checkout.productName}</span>
                    <span className="summary-item-price">${(checkout.price / 100).toFixed(2)}</span>
                 </div>

                 {/* Item 2: The Bump (Conditional) */}
                 {amount > checkout.price && (
                    <div className="summary-item">
                        <span className="summary-item-title">Audit Video Upgrade</span>
                        <span className="summary-item-price">${(bump.price / 100).toFixed(2)}</span>
                    </div>
                 )}
                 
                 {/* Divider */}
                 <div style={{height: '1px', backgroundColor: '#E5E7EB', margin: '20px 0'}}></div>
                 
                 {/* Total */}
                 <div className="summary-total">
                    <span>Total</span>
                    <span style={{color: '#10B981', fontSize: '20px'}}>${(amount / 100).toFixed(2)}</span>
                 </div>
              </div>

              {/* Security Badge */}
              <div className="secure-text">
                 <span>🔒</span> 256-bit SSL Secure
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}