/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';
import '@/styles/checkout-design.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  const [amount, setAmount] = useState<number>(checkout.price);
  const [isBumpSelected, setIsBumpSelected] = useState(false);

  useEffect(() => {
    if (checkout.price) {
      const basePrice = checkout.price;
      setAmount(isBumpSelected ? basePrice + bump.price : basePrice);
    }
  }, [checkout.price, isBumpSelected, bump.price]);

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
    // REMOVED invalid options here. They belong in the PaymentElement.
  };

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
        '--color-text': '#111827',
        background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 80%, #e5e7eb 100%)'
      } as React.CSSProperties}
      className="min-h-screen font-sans text-gray-900"
    >
      <div className="checkout-container">
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
          <div className="checkout-main">
             <div style={{ 
                 position: 'relative',
                 backgroundColor: 'white', 
                 borderRadius: '16px', 
                 padding: '32px', 
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
                 border: '1px solid #E5E7EB',
                 marginTop: '20px'
             }}>
                <div className="card-header-pill" style={{backgroundColor: '#2E1065'}}>
                  Customer Information
                </div>

                <div style={{marginTop: '15px'}}>
                    <Elements key={amount} options={options} stripe={stripePromise}>
                      <CheckoutForm 
                          amountInCents={amount} 
                          isPriceUpdating={false}
                          productSlug={product.id}
                          isBumpSelected={isBumpSelected}
                      >
                          {OrderBumpComponent}
                      </CheckoutForm>
                    </Elements>
                </div>
             </div>
          </div>

          <div className="checkout-sidebar">
            <div className="card relative" style={{marginTop: '20px'}}>
              <div className="card-header-pill" style={{backgroundColor: '#2E1065'}}>
                What You Get
              </div>
              <div style={{marginTop: '20px'}}>
                 <img src={checkout.image} alt={checkout.productName} className="product-image-mockup" />
                 <div style={{marginBottom: '20px'}}>
                    <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '5px'}}>{checkout.productName}</h3>
                    <p style={{fontSize: '14px', color: '#6B7280'}}>Full Access Digital Package</p>
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

            <div className="card relative" style={{marginTop: '40px'}}>
              <div className="card-header-pill" style={{backgroundColor: '#2E1065'}}>
                Order Summary
              </div>
              <div style={{marginTop: '20px'}}>
                 <div className="pricing-breakdown space-y-3">
                    <div className="summary-item">
                        <span className="summary-item-title">{checkout.productName}</span>
                        <span className="summary-item-price" style={{color: '#111827'}}>${(checkout.price / 100).toFixed(2)}</span>
                    </div>
                    {isBumpSelected && (
                        <div className="summary-item">
                            <span className="summary-item-title">Audit Video Upgrade</span>
                            <span className="summary-item-price" style={{color: '#111827'}}>${(bump.price / 100).toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{height: '1px', backgroundColor: '#E5E7EB', margin: '20px 0'}}></div>
                    <div className="summary-total" style={{alignItems: 'center', marginTop: '15px', paddingTop: '0', borderTop: 'none'}}>
                        <span style={{fontSize: '16px', fontWeight: '800'}}>Total Due</span>
                        <span style={{fontSize: '24px', fontWeight: '800', color: '#10B981'}}>${(amount / 100).toFixed(2)}</span>
                    </div>
                 </div>
                 <div className="secure-text" style={{marginTop: '20px'}}>
                    <span>🔒</span> 256-bit SSL Secure
                 </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="checkout-footer" style={{marginTop: '60px', borderTop: '1px solid #E5E7EB', padding: '40px 0', textAlign: 'center'}}>
            <p style={{color: '#9CA3AF', fontSize: '13px'}}>© {new Date().getFullYear()} Built For Speed LLC. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}