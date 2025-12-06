/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

// 1. Import the CSS to ensure layout classes work
import '@/styles/checkout-design.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  const [amount, setAmount] = useState<number>(checkout.price);

  // Logic: Update price when Strapi data loads
  useEffect(() => {
    if (checkout.price) {
      setAmount(checkout.price);
    }
  }, [checkout.price]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5', 
      colorBackground: '#F9FAFB',
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
        '--color-background': '#F3F4F6', 
        '--color-text': '#111827' 
      } as React.CSSProperties}
      className="min-h-screen bg-[#F3F4F6] font-sans text-gray-900"
    >
      <div className="checkout-container">
        
        {/* LAYOUT: Uses your CSS class '.checkout-grid' (1.618fr 1fr) */}
        <div className="checkout-grid">
          
          {/* LEFT COLUMN: Payment Form */}
          <div className="checkout-main">
             {/* Boundary Box: White card styling */}
             <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB' }}>
                
                {/* Header (Logo + Title) */}
                <div className="checkout-header" style={{marginBottom: '30px', textAlign: 'left'}}>
                    {theme.logoUrl ? (
                      <img src={theme.logoUrl} alt="Logo" className="logo" style={{margin: '0 0 20px 0', maxWidth: '180px'}} />
                    ) : (
                      <div className="logo" style={{margin: '0 0 20px 0', fontSize: '24px', fontWeight: 'bold'}}>LOGO</div>
                    )}
                    <h1 style={{fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '8px', lineHeight: '1.2'}}>{checkout.headline}</h1>
                    <p style={{fontSize: '16px', color: '#6B7280', lineHeight: '1.5'}}>{checkout.subhead}</p>
                </div>

                {/* Section Header */}
                <div style={{marginBottom: '20px', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px'}}>
                   <h2 style={{fontSize: '18px', fontWeight: '700', color: '#111827'}}>Customer Information</h2>
                </div>

                {/* Stripe Form */}
                <Elements key={amount} options={options} stripe={stripePromise}>
                  <CheckoutForm amountInCents={amount} isPriceUpdating={false}>
                      {OrderBumpComponent}
                  </CheckoutForm>
                </Elements>

                {/* Disclaimer */}
                <div className="disclaimer" style={{textAlign: 'center', marginTop: '24px'}}>
                   By providing your card information, you allow Teal Swing to charge your card for future payments in accordance with their terms.
                </div>
             </div>
          </div>

          {/* RIGHT COLUMN: Summary Card */}
          <div className="checkout-sidebar">
            <div className="card" style={{position: 'relative', overflow: 'visible', marginTop: '20px'}}>
              
              {/* Floating Badge */}
              <div className="card-header-pill" style={{
                  backgroundColor: '#2E1065', 
                  position: 'absolute', 
                  top: '-18px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  padding: '8px 24px',
                  fontSize: '14px'
              }}>
                Order Summary
              </div>
              
              <div style={{marginTop: '15px'}}>
                 {/* 1. Hero Image (Restored using CSS class) */}
                 <img 
                   src={checkout.image} 
                   alt={checkout.productName} 
                   className="product-image-mockup" 
                 />

                 {/* 2. Description */}
                 <div style={{marginBottom: '20px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '5px'}}>{checkout.productName}</h3>
                    <p style={{fontSize: '14px', color: '#6B7280'}}>Full Access Digital Package</p>
                 </div>

                 {/* 3. Bullets (No Border per request) */}
                 <div style={{backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', marginBottom: '20px'}}>
                    <p style={{fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em'}}>What's Included:</p>
                    <ul className="features-list" style={{margin: 0}}>
                      {checkout.features.map((feature, i) => (
                        <li key={i} className="feature-item" style={{marginBottom: '8px', fontSize: '14px'}}>
                          <span className="feature-icon" style={{width: '18px', height: '18px', fontSize: '10px', marginRight: '10px'}}>✓</span> 
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                 </div>

                 <div style={{height: '1px', backgroundColor: '#E5E7EB', margin: '20px 0'}}></div>
                 
                 {/* 4. Pricing Summary */}
                 <div>
                    <div className="summary-item">
                        <span className="summary-item-title">{checkout.productName}</span>
                        <span className="summary-item-price" style={{color: '#111827'}}>${(checkout.price / 100).toFixed(2)}</span>
                    </div>

                    {amount > checkout.price && (
                        <div className="summary-item">
                            <span className="summary-item-title">Audit Video Upgrade</span>
                            <span className="summary-item-price" style={{color: '#111827'}}>${(bump.price / 100).toFixed(2)}</span>
                        </div>
                    )}
                    
                    <div className="summary-total" style={{alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #E5E7EB'}}>
                        <span style={{fontSize: '16px', fontWeight: '800'}}>Total Due</span>
                        <span style={{fontSize: '24px', fontWeight: '800', color: '#10B981'}}>${(amount / 100).toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              <div className="secure-text" style={{marginTop: '20px'}}>
                 <span>🔒</span> 256-bit SSL Secure
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}