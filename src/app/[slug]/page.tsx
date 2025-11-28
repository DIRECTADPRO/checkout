/* FILE: src/app/[slug]/page.tsx */
'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { getProduct } from '@/lib/products';
import { logFunnelEvent } from '@/lib/analytics';

// Pricing & Formatting Helpers
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);

// Dynamic Stripe Loader
const stripePromise = (key: string) => loadStripe(key);

interface CheckoutPageProps {
  // FIX: params is now a Promise in Next.js 15+ App Router
  params: Promise<{ slug: string }>;
}

// --- SUB-COMPONENTS ---

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E5E7EB' }}>
      <button onClick={() => setIsOpen(!isOpen)} type="button" style={{ width: '100%', padding: '12px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', color: '#111827', letterSpacing: '-0.01em' }}>
        {question}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', opacity: 0.5 }}>▼</span>
      </button>
      {isOpen && <div style={{ paddingBottom: '12px', fontSize: '12px', color: '#4B5563', lineHeight: '1.5' }}>{answer}</div>}
    </div>
  );
};

// Hardcoded Social Proof (restored for visual completeness)
const SocialProof = () => {
    const [visible, setVisible] = useState(false);
    const [customer, setCustomer] = useState({ name: 'Matthew', location: 'Austin, TX', time: '2 minutes ago' });
    const purchases = [
        { name: 'Sarah', location: 'Denver, CO', time: 'just now' }, { name: 'Michael', location: 'Miami, FL', time: '5 minutes ago' },
        { name: 'Jessica', location: 'Seattle, WA', time: '1 minute ago' }, { name: 'David', location: 'Austin, TX', time: '12 minutes ago' },
        { name: 'Emily', location: 'New York, NY', time: 'just now' }, { name: 'James', location: 'Nashville, TN', time: '8 minutes ago' },
    ];
    useEffect(() => {
        const showTimer = setTimeout(() => { const r = purchases[Math.floor(Math.random() * purchases.length)]; setCustomer(r); setVisible(true); }, 5000);
        const loop = setInterval(() => { const r = purchases[Math.floor(Math.random() * purchases.length)]; setCustomer(r); setVisible(true); setTimeout(() => setVisible(false), 15000); }, 45000);
        return () => { clearTimeout(showTimer); clearInterval(loop); };
    }, []);
    if (!visible) return null;
    return (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 100, backgroundColor: 'white', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #E5E7EB', animation: 'fadeInUp 0.5s ease-out', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛒</div>
            <div>
                <p style={{ fontSize: '13px', color: '#111827', margin: 0, lineHeight: '1.2' }}><strong>{customer.name}</strong> from {customer.location}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.2' }}>just bought the <strong>Bundle</strong></p>
                <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0 0', letterSpacing: '0.02em' }}>{customer.time}</p>
            </div>
        </div>
    );
};

export default function DynamicCheckoutPage({ params }: CheckoutPageProps) {
  // FIX: Unwrap the params promise using React.use()
  const { slug } = use(params);

  const product = getProduct(slug);
  const { theme, checkout, bump } = product;

  // Calculate Total Value (Fake Retail Price) for the Strikethrough effect
  // If not defined, we assume 10x the actual price for the marketing visual
  const estimatedRetailValue = checkout.price * 5; 

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
  
  const themeStyles = {
    '--theme-primary': theme.primaryColor,
    '--theme-accent': theme.accentColor,
    '--theme-bg': theme.backgroundColor,
    'backgroundColor': theme.backgroundColor
  } as React.CSSProperties;

  const options: StripeElementsOptions = { clientSecret: clientSecret || undefined, appearance: { theme: 'flat', variables: { colorPrimary: theme.accentColor } } };

  const OrderBumpComponent = (
    <div className="order-bump-container" style={{ marginTop: '24px', marginBottom: '24px', border: includeBump ? '2px solid var(--theme-primary)' : '2px dashed #D1D5DB', backgroundColor: theme.primaryColor + '11', padding: '16px', borderRadius: '12px', position: 'relative', transition: 'all 0.2s ease-in-out' }}>
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
                
                {/* 1. Value Stack with Formatting */}
                <div className="card" style={{backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                    <h2 className="card-header-pill">What&apos;s Included</h2>
                    <img src={checkout.image} alt="Bundle" className="product-image-mockup" />
                    
                    <ul className="features-list" style={{listStyle: 'none', padding: 0, margin: '20px 0'}}>
                        {checkout.features.map((feature, i) => {
                            // LOGIC: Check if feature has a value inparens like "(Val: $97)"
                            const parts = feature.split('(');
                            const name = parts[0];
                            const val = parts.length > 1 ? '(' + parts[1] : '';

                            return (
                                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                                    <span>{name}</span>
                                    {val && <span style={{color: '#9CA3AF', fontSize: '13px', fontWeight: '400'}}>{val}</span>}
                                </li>
                            );
                        })}
                    </ul>
                    
                    <div style={{borderTop: '1px solid #E5E7EB', paddingTop: '14px', textAlign: 'center'}}>
                         <p style={{margin: 0, fontSize: '14px', color: '#6B7280'}}>Total Value: <span style={{textDecoration: 'line-through'}}>{formatCurrency(estimatedRetailValue)}</span></p>
                         <p style={{margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: 'var(--theme-primary)', letterSpacing: '-0.02em'}}>Today&apos;s Price: {formatCurrency(checkout.price)}</p>
                    </div>

                    {/* RESTORED: The FAQ Section */}
                    <div style={{marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed #E5E7EB'}}>
                         <p style={{fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px'}}>Common Questions</p>
                         <FAQItem question="Is this a subscription?" answer="NO. This is a one-time payment." />
                         <FAQItem question="How do I get access?" answer="Check your email immediately after payment for the download link." />
                         <FAQItem question="Refund policy?" answer="30-Day Money-Back Guarantee. No questions asked." />
                    </div>

                    {/* RESTORED: The Guarantee Seal */}
                    <div className="guarantee" style={{marginTop: '20px'}}>
                        <img src="https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Badge_b86eiv.png" alt="Seal" className="guarantee-seal" />
                        <p className="guarantee-text" style={{fontSize: '13px', lineHeight: '1.5'}}>
                            <span className="guarantee-title" style={{color: theme.primaryColor, fontWeight: '700', display: 'block'}}>30-Day Guarantee</span>
                            If you aren&apos;t satisfied, email us within 30 days for a full refund.
                        </p>
                    </div>
                </div>

                {/* 2. Order Summary */}
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