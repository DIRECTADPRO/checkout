/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

// CRITICAL: This imports your custom design file
import '@/styles/checkout-design.css';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) console.error("❌ CRITICAL: Stripe Key is missing");
const stripePromise = loadStripe(stripeKey!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  // 1. STATE
  const [amount, setAmount] = useState<number>(checkout.price);

  // 2. THE FIX: Force the price to update to $7.00
  useEffect(() => {
    if (checkout.price) {
      setAmount(checkout.price);
    }
  }, [checkout.price]);

  // 3. APPEARANCE: Matching your custom aesthetic
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: theme.primaryColor || '#6A45FF',
      colorBackground: '#ffffff',
      colorText: '#212121',
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

  // 4. THE RESTORATION: Using YOUR class names (checkout-grid, card, etc.)
  return (
    <div className="checkout-container">
      
      {/* HEADER */}
      <div className="checkout-header">
         {theme.logoUrl ? (
            <img src={theme.logoUrl} alt="Logo" className="logo" />
         ) : (
            <div className="logo-placeholder">LOGO</div>
         )}
         <h1 style={{ color: theme.primaryColor }}>{checkout.headline}</h1>
         <p>{checkout.subhead}</p>
      </div>

      {/* GRID LAYOUT */}
      <div className="checkout-grid">
        
        {/* LEFT COLUMN */}
        <div className="checkout-main">
           <div className="card">
              <div className="card-header-pill">1. What You Get</div>
              
              <div className="card-body">
                <div className="hero-image-wrapper">
                    <img 
                        src={checkout.image} 
                        alt={checkout.productName} 
                        className="product-image-mockup" 
                    />
                </div>
                
                <ul className="features-list">
                  {checkout.features.map((feature, i) => (
                    <li key={i} className="feature-item">
                       <span className="feature-icon" style={{ backgroundColor: theme.primaryColor }}>✓</span>
                       <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="guarantee-badge">
                   <img src="/stripe-badge-grey.png" alt="Guarantee" style={{ height: '30px', opacity: 0.7 }} />
                   <span className="guarantee-text">30-Day Money-Back Guarantee</span>
                </div>
              </div>
           </div>

           {/* TESTIMONIALS */}
           <div className="testimonials">
              <div className="testimonial-card">
                 <div className="stars">★★★★★</div>
                 <p>"This system completely changed my workflow."</p>
                 <div className="author">- Verified User</div>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="checkout-sidebar">
           <div className="card">
              <div className="card-header-pill">2. Payment Details</div>
              
              <div className="card-body">
                <div className="summary-row">
                    <span className="summary-title">Total Today:</span>
                    <span className="summary-price">${(amount / 100).toFixed(2)}</span>
                </div>

                <Elements key={amount} options={options} stripe={stripePromise}>
                    <CheckoutForm amountInCents={amount} isPriceUpdating={false}>
                        
                        {/* ORDER BUMP - Using your classes */}
                        <div className="order-bump">
                           <label className="bump-label">
                              <input type="checkbox" onChange={handleBumpChange} />
                              <div className="bump-content">
                                 <div className="bump-headline">
                                    YES! {bump.headline}
                                 </div>
                                 <div className="bump-desc">
                                    {bump.description}
                                 </div>
                              </div>
                           </label>
                        </div>

                    </CheckoutForm>
                </Elements>
                
                <div className="secure-footer">
                   🔒 256-bit SSL Secure Payment
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}