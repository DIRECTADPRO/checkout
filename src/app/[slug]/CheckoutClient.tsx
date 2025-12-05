'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

// Initialize Stripe outside of the component to avoid re-initialization on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  // Initialize with the prop value
  // This ensures the component starts with the correct price from the server (Strapi)
  const [amount, setAmount] = useState<number>(checkout.price);

  // CRITICAL FIX: Force update state if the incoming product prop changes
  // This handles the scenario where the page hydrates with initial state but
  // the prop updates shortly after from the async server fetch.
  useEffect(() => {
    setAmount(checkout.price);
  }, [checkout.price]);

  // Define custom styling for Stripe Elements to match your theme
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
    amount: amount, // Use the dynamic state amount (700 or 2400)
    currency: 'usd',
    appearance,
  };

  // The Order Bump UI Component
  // This is passed as a child to CheckoutForm so it sits nicely inside the form
  const OrderBumpComponent = (
    <div className="order-bump" style={{
      backgroundColor: '#FEFCE8', 
      border: '2px dashed #EF4444', 
      padding: '15px', 
      borderRadius: '8px', 
      marginTop: '20px', 
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    }}>
      <input 
        type="checkbox" 
        id="bump-offer" 
        style={{marginTop: '4px', width: '18px', height: '18px'}} 
        // Logic: If checked, add bump price. If unchecked, revert to base price.
        onChange={(e) => {
          setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
        }}
      />
      <label htmlFor="bump-offer" style={{cursor: 'pointer'}}>
        <span style={{fontWeight: '800', color: '#B91C1C', fontSize: '15px', display: 'block', marginBottom: '4px'}}>
           {bump.headline}
        </span>
        <span style={{fontSize: '14px', color: '#374151', lineHeight: '1.4'}}>
           {bump.description}
        </span>
      </label>
    </div>
  );

  return (
    <div style={{ backgroundColor: theme.backgroundColor, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <div className="checkout-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
        
        {/* LEFT COLUMN: Product Information & Testimonials */}
        <div className="product-info">
          <div style={{marginBottom: '30px'}}>
             {/* Dynamic Logo Display */}
             {theme.logoUrl ? (
                <img src={theme.logoUrl} alt="Logo" style={{ width: theme.logoWidth, marginBottom: '20px' }} />
             ) : (
                <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>LOGO</div>
             )}
          </div>
          
          {/* Product Hero Image */}
          <div className="hero-image" style={{marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
            <img src={checkout.image} alt={checkout.productName} style={{width: '100%', height: 'auto', display: 'block'}} />
          </div>

          {/* Headline & Subhead */}
          <h1 style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px', color: '#111827' }}>
            {checkout.headline}
          </h1>
          <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '24px', lineHeight: '1.6' }}>
            {checkout.subhead}
          </p>

          {/* Features List (What's Included) */}
          <div className="what-you-get" style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '30px'}}>
            <h3 style={{fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: '700', marginBottom: '16px'}}>What's Included:</h3>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {checkout.features.map((feature, i) => (
                <li key={i} style={{marginBottom: '12px', display: 'flex', alignItems: 'start', gap: '10px', fontSize: '15px', color: '#1F2937'}}>
                  <span style={{color: theme.primaryColor, fontWeight: 'bold'}}>✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* RESTORED: Social Proof / Testimonials */}
          <div className="testimonials-section">
             <h3 style={{fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px'}}>Trusted by Creators</h3>
             <div style={{display: 'grid', gap: '16px'}}>
                <div className="testimonial" style={{backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB'}}>
                    <div style={{color: '#F59E0B', marginBottom: '8px'}}>★★★★★</div>
                    <p style={{fontSize: '14px', color: '#374151', fontStyle: 'italic', marginBottom: '8px'}}>"Recovered $400 in lost cart sales automatically. This system paid for itself in 2 hours."</p>
                    <p style={{fontSize: '12px', fontWeight: '700', color: '#111827'}}>— Sarah J.</p>
                </div>
                <div className="testimonial" style={{backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB'}}>
                    <div style={{color: '#F59E0B', marginBottom: '8px'}}>★★★★★</div>
                    <p style={{fontSize: '14px', color: '#374151', fontStyle: 'italic', marginBottom: '8px'}}>"I rewrote my welcome sequence in 20 minutes using these templates. Insane value."</p>
                    <p style={{fontSize: '12px', fontWeight: '700', color: '#111827'}}>— Mark T.</p>
                </div>
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Checkout Form & Payment */}
        <div className="checkout-form-wrapper" style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', border: '1px solid #F3F4F6', height: 'fit-content' }}>
          <div className="order-summary" style={{marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontWeight: '600', color: '#374151'}}>{checkout.productName}</span>
                <span style={{fontWeight: '700', color: '#111827'}}>${(amount / 100).toFixed(2)}</span>
             </div>
          </div>

          {/* Stripe Elements Provider */}
          {/* Force re-render when amount changes to update PaymentElement context if needed */}
          <Elements key={amount} options={options} stripe={stripePromise}>
            <CheckoutForm 
                amountInCents={amount} 
                isPriceUpdating={false}
                // REMOVED: requireShipping={false} because it caused TypeScript error
            >
                {OrderBumpComponent}
            </CheckoutForm>
          </Elements>

          <div style={{marginTop: '24px', textAlign: 'center'}}>
             <img src="https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Badge_b86eiv.png" alt="Secure Payment" style={{height: '30px', opacity: 0.8, margin: '0 auto'}} />
             <p style={{fontSize: '11px', color: '#9CA3AF', marginTop: '8px'}}>Powered by Stripe • 256-bit SSL Encrypted</p>
          </div>
        </div>

      </div>
    </div>
  );
}