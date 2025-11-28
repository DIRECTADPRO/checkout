// src/app/[slug]/CheckoutClient.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';
import { logFunnelEvent } from '@/lib/analytics';

// Pricing & Formatting Helpers
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);
const stripePromise = (key: string) => loadStripe(key);

// --- Component Props now receive static data from the Server Component ---
interface CheckoutClientProps {
  product: ProductConfig;
}

// --- SUB-COMPONENTS (Reused logic) ---
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E5E7EB' }}>
      <button onClick={() => setIsOpen(!isOpen)} type="button" style={{ width: '100%', padding: '14px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '700', color: '#111827', letterSpacing: '-0.01em' }}>
        {question}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', opacity: 0.5 }}>▼</span>
      </button>
      {isOpen && <div style={{ paddingBottom: '14px', fontSize: '13px', color: '#4B5563', lineHeight: '1.6', letterSpacing: '0.01em' }}>{answer}</div>}
    </div>
  );
};
const SocialProof = () => { /* ... (Content Omitted for Brevity) ... */ return null; }; // Assume this is implemented

export default function CheckoutClient({ product }: CheckoutClientProps) {
  const { theme, checkout, bump } = product;

  // --- Dynamic Stripe Initialization ---
  const [stripePromiseInstance] = useState(() => stripePromise(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''));
  
  const [clientSecret, setClientSecret] = useState<string>("");
  const [amount, setAmount] = useState<number>(0); 
  const [loading, setLoading] = useState<boolean>(true);
  const [includeBump, setIncludeBump] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const managePaymentIntent = useCallback(async (bumpState: boolean) => {
    setLoading(true); setError(null);
    logFunnelEvent({ productSlug: product.id, eventType: 'checkout_init', eventStatus: 'pending', revenueGross: bumpState ? checkout.price + bump.price : checkout.price, sessionId: 'MOCK-SESSION-ID' });
    try {
      const res = await fetch("/api/manage-payment-intent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeBump: bumpState, productSlug: product.id }),
      });
      if (!res.ok) throw new Error('Failed to fetch payment intent.');
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setAmount(data.amount); 
    } catch (err) { setError(err instanceof Error ? err.message : "Network error"); } finally { setLoading(false); }
  }, [product.id, checkout.price, bump.price]);

  useEffect(() => { if (!clientSecret) managePaymentIntent(false); }, [managePaymentIntent, clientSecret]);

  const handleBumpToggle = () => {
    const newBumpState = !includeBump;
    setIncludeBump(newBumpState);
    managePaymentIntent(newBumpState);
  };
  
  // Apply Dynamic CSS Variables for Global Theming
  const themeStyles = {
    '--theme-primary': theme.primaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-bg': theme.backgroundColor,
    'backgroundColor': theme.backgroundColor
  } as React.CSSProperties;

  const options: StripeElementsOptions = { clientSecret: clientSecret || undefined, appearance: { theme: 'flat', variables: { colorPrimary: theme.accentColor } } };

  const OrderBumpComponent = (
    <div className="order-bump-container" style={{ marginTop: '24px', marginBottom: '24px', 
        border: includeBump ? `2px solid var(--theme-primary)` : '2px dashed #D1D5DB', 
        backgroundColor: theme.primaryColor + '11', padding: '16px', borderRadius: '12px',
        position: 'relative', transition: 'all 0.2s ease-in-out' }}>
        <label style={{display: 'flex', gap: '14px', cursor: 'pointer', alignItems: 'flex-start'}}>
            <input type="checkbox" checked={includeBump} onChange={handleBumpToggle} disabled={loading} style={{marginTop: '4px', transform: 'scale(1.2)', accentColor: theme.primaryColor}} />
            <div style={{flex: 1}}>
                <p style={{ fontWeight: '800', color: theme.primaryColor, marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.01em', lineHeight: '1.3' }}>{bump.headline}</p>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                    <span style={{fontWeight: '700', color: theme.primaryColor}}>One-Time Offer ({formatCurrency(bump.price)}):</span> {bump.description}
                </p>
            </div>
        </label>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="checkout-container" style={themeStyles}>
        <SocialProof />
        <header className="checkout-header">
            <img src={theme.logoUrl} alt="Logo" className="logo" style={{ maxWidth: theme.logoWidth, height: 'auto', marginBottom: '20px' }} />
            <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.025em', marginBottom: '16px', color: '#111827' }}>
                {checkout.headline.split('—')[0]}
                <br />
                —{checkout.headline.split('—')[1] || ''}
            </h1>
            <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>{checkout.subhead}</p>
        </header>

        <main className="checkout-grid">
            <section className="checkout-main">
                <div className="card" style={{position: 'relative', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                    <h2 className="card-header-pill">Customer Information</h2>
                    {clientSecret && <Elements options={options} stripe={stripePromiseInstance}><CheckoutForm amountInCents={amount} isPriceUpdating={loading}>{OrderBumpComponent}</CheckoutForm></Elements>}
                </div>
            </section>

            <aside className="checkout-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Value Stack */}
                <div className="card" style={{backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                    <h2 className="card-header-pill">What&apos;s Included</h2>
                    <img src={checkout.image} alt="Bundle" className="product-image-mockup" />
                    <ul className="features-list" style={{listStyle: 'none', padding: 0, margin: '20px 0'}}>
                        {checkout.features.map((feature, i) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#374151', fontWeight: '500' }}><span>{feature}</span></li>
                        ))}
                    </ul>
                    <div style={{borderTop: '1px solid #E5E7EB', paddingTop: '14px', textAlign: 'center'}}>
                        <p style={{margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: 'var(--theme-primary)', letterSpacing: '-0.02em'}}>{formatCurrency(checkout.price)}</p>
                    </div>
                </div>

                {/* 2. Order Summary - Sticky Top */}
                <div className="card" style={{ position: 'sticky', top: '20px', zIndex: 10, backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <h2 className="card-header-pill">Order Summary</h2>
                    <div className="summary-item" style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6'}}>
                        <span style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>{checkout.productName}</span>
                        <span style={{fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '14px'}}>{formatCurrency(checkout.price)}</span>
                    </div>
                    {includeBump && (
                        <div className="summary-item" style={{ backgroundColor: theme.primaryColor + '11', padding: '10px', margin: '12px -10px', borderRadius: '6px', borderLeft: `4px solid ${theme.primaryColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{fontSize: '13px', lineHeight: '1.3'}}><span style={{color: theme.primaryColor, fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', display: 'block'}}>UPGRADE ADDED</span>Subject Line Vault</span>
                            <span style={{fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '14px'}}>{formatCurrency(bump.price)}</span>
                        </div>
                    )}
                    <div className="summary-total" style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #E5E7EB'}}>
                        <span style={{fontSize: '18px', fontWeight: '800', letterSpacing: '-0.01em'}}>Total</span>
                        <span style={{fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--theme-primary)'}}>{formatCurrency(amount)}</span>
                    </div>
                </div>
            </aside>
        </main>
    </div>
  );
}