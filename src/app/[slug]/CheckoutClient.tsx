/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

// CRITICAL: Import the design system so the page looks right
import '@/styles/checkout-design.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  // Initialize state with the product price
  const [amount, setAmount] = useState<number>(checkout.price);

  // CRITICAL FIX: Force state update when Strapi data loads (fixes $4.99 -> $7.00 issue)
  useEffect(() => {
    if (checkout.price) {
      setAmount(checkout.price);
    }
  }, [checkout.price]);

  // Stripe Appearance Settings
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: theme.primaryColor,
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
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

  // The Order Bump Component (Now uses the clean .order-bump class from CSS)
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
        <div className="order-bump-content" style={{marginLeft: '15px'}}>
          <div className="order-bump-title">
             <span style={{color: '#B91C1C'}}>YES!</span> {bump.headline}
          </div>
          <div className="order-bump-description">
             {bump.description}
             <span className="order-bump-price-container" style={{display: 'block', marginTop: '5px'}}>
               <span className="order-bump-old-price" style={{textDecoration: 'line-through', opacity: 0.7, marginRight: '5px'}}>$47</span>
               <span className="order-bump-new-price" style={{color: '#B91C1C', fontWeight: 'bold'}}> +${(bump.price / 100).toFixed(2)}</span>
             </span>
          </div>
        </div>
      </label>
    </div>
  );

  return (
    // Dynamic Theme Injection: Maps Strapi colors to your CSS Variables
    <div 
      style={{ 
        '--color-primary-cta': theme.primaryColor,
        '--color-background': theme.backgroundColor,
        '--color-text': '#212121' 
      } as React.CSSProperties}
    >
      <div className="checkout-container">
        
        {/* HEADER SECTION */}
        <div className="checkout-header">
           {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Logo" className="logo" style={{width: theme.logoWidth}} />
           ) : (
              <div className="logo" style={{fontSize: '24px', fontWeight: 'bold'}}>LOGO</div>
           )}
           <h1>{checkout.headline}</h1>
           <p>{checkout.subhead}</p>
        </div>

        <div className="checkout-grid">
          
          {/* LEFT COLUMN: Product Info & Social Proof */}
          <div className="checkout-sidebar">
            <img 
              src={checkout.image} 
              alt={checkout.productName} 
              className="product-image-mockup" 
              style={{ borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            />

            <div className="card" style={{padding: '30px', marginTop: '30px'}}>
              <h3 className="section-title">What's Included:</h3>
              <ul className="features-list">
                {checkout.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-title">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Guarantee Badge */}
              <div className="guarantee" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                 <div className="guarantee-text">
                    <strong className="guarantee-title">30-Day Money-Back Guarantee</strong>
                    <span style={{fontSize: '13px', color: '#666'}}>If you don't love it, get a full refund. No questions asked.</span>
                 </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="testimonials-section" style={{marginTop: '40px'}}>
               <h3 className="section-title" style={{textAlign: 'center', marginBottom: '20px'}}>Trusted by Creators</h3>
               <div className="testimonials">
                  <div className="testimonial-card">
                      <div className="stars">★★★★★</div>
                      <p className="testimonial-text">"Recovered $400 in lost cart sales automatically. This system paid for itself in 2 hours."</p>
                      <div className="testimonial-author-block">
                         <span className="testimonial-author">— Sarah J.</span>
                      </div>
                  </div>
                  <div className="testimonial-card">
                      <div className="stars">★★★★★</div>
                      <p className="testimonial-text">"I rewrote my welcome sequence in 20 minutes using these templates. Insane value."</p>
                      <div className="testimonial-author-block">
                         <span className="testimonial-author">— Mark T.</span>
                      </div>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Form */}
          <div className="checkout-main">
            <div className="card">
              <div className="card-header-pill">SECURE CHECKOUT</div>
              
              <div className="order-summary" style={{marginTop: '20px'}}>
                 <div className="summary-item">
                    <span className="summary-item-title">{checkout.productName}</span>
                    <span className="summary-item-price">${(amount / 100).toFixed(2)}</span>
                 </div>
                 <div className="summary-total">
                    <span>Total Today</span>
                    <span>${(amount / 100).toFixed(2)}</span>
                 </div>
              </div>

              {/* Stripe Elements */}
              <Elements key={amount} options={options} stripe={stripePromise}>
                <CheckoutForm 
                    amountInCents={amount} 
                    isPriceUpdating={false}
                >
                    {OrderBumpComponent}
                </CheckoutForm>
              </Elements>

              <div className="footer-payment-logos" style={{textAlign: 'center', marginTop: '30px', opacity: 0.6}}>
                 <p style={{fontSize: '12px'}}>Secure 256-bit SSL Encrypted Payment</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}