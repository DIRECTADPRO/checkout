'use client';

import React, { useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
// ENSURE THIS IMPORT IS CORRECT. If this file doesn't exist, the code breaks.
import CheckoutForm from '@/components/CheckoutForm'; 
import { ProductConfig } from '@/lib/products';
import { FUNNEL_BEHAVIORS, FunnelType } from '@/lib/funnel-types';
import '@/styles/checkout-design.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function getFunnelConfig(type: string): typeof FUNNEL_BEHAVIORS['digital_product'] {
  const validKey = (type in FUNNEL_BEHAVIORS ? type : 'digital_product') as FunnelType;
  return FUNNEL_BEHAVIORS[validKey];
}

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;

  // 1. DATA PREP
  const productData = checkout as any; 
  const rawFunnelType = productData.funnelType || 'digital_product';
  const config = getFunnelConfig(rawFunnelType);
  const buttonCTA = productData.ctaText || config.defaultButtonText;

  // Initialize amount (default to 0 if missing to prevent NaN errors)
  const [amount, setAmount] = useState<number>(checkout.price || 0);
  const [isBumpSelected, setIsBumpSelected] = useState(false);

  // 2. VIDEO CHECK
  const videoUrl = productData.videoEmbedUrl;
  const hasVideo = videoUrl && videoUrl.length > 0;

  // 3. PRICE CORRECTION (Logic Check)
  if (amount !== checkout.price && !isBumpSelected) {
      if (amount === 499 && checkout.price === 700) {
          setAmount(700);
      }
  }

  // 4. STRIPE CONFIGURATION
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5', 
      colorBackground: '#F9FAFB', 
      colorText: '#111827',
      borderRadius: '6px',
    },
  };

  // FIX: Force amount to be a number. Stripe Subscriptions REQUIRE an amount 
  // in client-mode (for the first invoice). If 0, it behaves like a setup intent.
  const stripeMode = config.isSubscription ? 'subscription' : 'payment';
  
  const options: StripeElementsOptions = {
    mode: stripeMode as any, // Cast to any to bypass strict union mismatch temporarily
    amount: amount,          // Always pass amount
    currency: 'usd',
    appearance,
    paymentMethodTypes: ['card'],
  };

  // 5. ORDER BUMP COMPONENT
  const OrderBumpComponent = (
    <div className="order-bump">
      <label className="order-bump-label" htmlFor="bump-offer">
        <input 
          type="checkbox" 
          id="bump-offer" 
          checked={isBumpSelected}
          onChange={(e) => {
            setIsBumpSelected(e.target.checked);
            setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
          }}
        />
        <div className="order-bump-content" style={{marginLeft: '12px'}}>
          <div className="order-bump-title">{bump.headline}</div>
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
    <div className="min-h-screen font-sans text-gray-900 bg-gray-100">
      <div className="checkout-container">
        {/* --- HEADER --- */}
        <div className="checkout-header" style={{textAlign: 'center', marginBottom: '50px'}}>
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Logo" className="logo" style={{margin: '0 auto 20px auto', maxWidth: '90px', display: 'block'}} />
            ) : (
              <div className="logo" style={{margin: '0 auto 20px auto', fontSize: '24px', fontWeight: 'bold'}}>LOGO</div>
            )}
            <h1 style={{fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '12px', lineHeight: '1.2'}}>
              {checkout.headline}
            </h1>
            <p style={{fontSize: '18px', color: '#6B7280', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto'}}>
              {checkout.subhead}
            </p>
        </div>

        <div className="checkout-grid">
          {/* --- MAIN COLUMN --- */}
          <div className="checkout-main">
             <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #E5E7EB', marginTop: '20px' }}>
                <div className="card-header-pill" style={{backgroundColor: '#2E1065'}}>
                   Where Should We Send Your {config.fulfillmentMode === 'physical' ? 'Package' : 'Access'}?
                </div>

                <div style={{marginTop: '15px'}}>
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm 
                          amountInCents={amount} 
                          isPriceUpdating={false}
                          productSlug={product.id}
                          isBumpSelected={isBumpSelected}
                          funnelConfig={config} 
                          customButtonText={buttonCTA}
                      >
                          {config.showOrderBump && OrderBumpComponent}
                      </CheckoutForm>
                    </Elements>
                </div>
             </div>
          </div>
          
          {/* --- SIDEBAR COLUMN --- */}
          <div className="checkout-sidebar">
            <div className="card relative" style={{marginTop: '20px'}}>
              <div className="card-header-pill" style={{backgroundColor: '#2E1065'}}>What You Get</div>
              <div style={{marginTop: '20px'}}>
                 {hasVideo ? (
                    <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', aspectRatio: '16/9', border: '1px solid #E5E7EB' }}>
                        <iframe src={videoUrl} style={{width: '100%', height: '100%', border: 'none'}} allow="autoplay; encrypted-media" allowFullScreen />
                    </div>
                 ) : (
                    <img src={checkout.image} alt={checkout.productName} className="product-image-mockup" />
                 )}
                 <div style={{marginBottom: '20px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '5px'}}>{checkout.productName}</h3>
                    <p style={{fontSize: '14px', color: '#6B7280'}}>Full Access Package</p>
                 </div>
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
              </div>
            </div>
            
            {/* ORDER SUMMARY */}
            <div className="card relative" style={{marginTop: '40px'}}>
              <div className="card-header-pill" style={{backgroundColor: '#2E1065'}}>Order Summary</div>
              <div style={{marginTop: '20px'}}>
                 <div className="pricing-breakdown space-y-3">
                    <div className="summary-item">
                        <span className="summary-item-title">{checkout.productName}</span>
                        <span className="summary-item-price" style={{color: '#111827'}}>${(checkout.price / 100).toFixed(2)}</span>
                    </div>
                    {isBumpSelected && (
                        <div className="summary-item">
                            <span className="summary-item-title">{bump.headline}</span>
                            <span className="summary-item-price" style={{color: '#111827'}}>${(bump.price / 100).toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{height: '1px', backgroundColor: '#E5E7EB', margin: '20px 0'}}></div>
                    <div className="summary-total" style={{alignItems: 'center', marginTop: '15px', paddingTop: '0', borderTop: 'none'}}>
                        <span style={{fontSize: '16px', fontWeight: '800'}}>Total Due</span>
                        <span style={{fontSize: '24px', fontWeight: '800', color: '#10B981'}}>${(amount / 100).toFixed(2)}</span>
                    </div>
                 </div>
                 <div className="secure-text" style={{marginTop: '20px'}}><span>🔒</span> 256-bit SSL Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}