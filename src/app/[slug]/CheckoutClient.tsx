'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  
  // Initialize with the price from Strapi (700)
  const [amount, setAmount] = useState<number>(checkout.price);

  // Force update if the prop changes (Fixes the $4.99 -> $7.00 glitch)
  useEffect(() => {
    setAmount(checkout.price);
  }, [checkout.price]);

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
    amount: amount, // Dynamic amount
    currency: 'usd',
    appearance,
  };

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
        
        {/* LEFT COLUMN: Product Details */}
        <div className="product-info">
          <div style={{marginBottom: '30px'}}>
             {theme.logoUrl ? (
                <img src={theme.logoUrl} alt="Logo" style={{ width: theme.logoWidth, marginBottom: '20px' }} />
             ) : (
                <div style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>LOGO</div>
             )}
          </div>
          
          <div className="hero-image" style={{marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
            <img src={checkout.image} alt={checkout.productName} style={{width: '100%', height: 'auto', display: 'block'}} />
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px', color: '#111827' }}>
            {checkout.headline}
          </h1>
          <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '24px', lineHeight: '1.6' }}>
            {checkout.subhead}
          </p>

          <div className="what-you-get" style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E5E7EB'}}>
            <h3 style={{fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: '700', marginBottom: '16px'}}>What's Included:</h3>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {checkout.features.map((feature, i) => (
                <li key={i} style={{marginBottom: '12px', display: 'flex', alignItems: 'start', gap: '10px', fontSize: '15px', color: '#1F2937'}}>
                  <span style={{color: theme.primaryColor, fontWeight: 'bold'}}>✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Checkout Form */}
        <div className="checkout-form-wrapper" style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', border: '1px solid #F3F4F6' }}>
          <div className="order-summary" style={{marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <span style={{fontWeight: '600', color: '#374151'}}>{checkout.productName}</span>
                <span style={{fontWeight: '700', color: '#111827'}}>${(amount / 100).toFixed(2)}</span>
             </div>
          </div>

          <Elements key={amount} options={options} stripe={stripePromise}>
            <CheckoutForm 
                amountInCents={amount} 
                isPriceUpdating={false}
            >
                {OrderBumpComponent}
            </CheckoutForm>
          </Elements>

          <div style={{marginTop: '24px', textAlign: 'center'}}>
             <img src="/stripe-badge-grey.png" alt="Powered by Stripe" style={{height: '24px', opacity: 0.6}} />
          </div>
        </div>

      </div>
    </div>
  );
}