/* FILE: src/app/page.tsx */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { Config } from '@/lib/env';

// Initialize Stripe
const stripePromise = loadStripe(Config.stripePublishableKey);

// Formatting Helpers
const priceStyle = { fontVariantNumeric: 'tabular-nums', fontWeight: 600 };
const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100);

// Pricing Constants
const DISPLAY_PRICE_BASE = 499; 
const DISPLAY_PRICE_BUMP = 2399; 

// --- DYNAMIC BACKGROUND COMPONENT ---
const DynamicBackground = () => (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1,
        background: '#F9FAFB', 
        overflow: 'hidden',
    }}>
        <style jsx>{`
            @keyframes float {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            @keyframes float-delayed {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(-30px, 50px) scale(1.1); }
                66% { transform: translate(20px, -20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
        `}</style>
        
        <div style={{
            position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
            background: 'radial-gradient(circle, rgba(106,69,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(60px)', borderRadius: '50%',
            animation: 'float 20s infinite ease-in-out'
        }} />

        <div style={{
            position: 'absolute', bottom: '10%', right: '-10%', width: '60vw', height: '60vw',
            background: 'radial-gradient(circle, rgba(5,150,105,0.1) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(80px)', borderRadius: '50%',
            animation: 'float-delayed 25s infinite ease-in-out'
        }} />
        
        <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
    </div>
);

// --- SUB-COMPONENTS ---

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E5E7EB' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{ 
            width: '100%', padding: '14px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            fontSize: '13px', fontWeight: '700', color: '#111827', letterSpacing: '-0.01em' 
        }}
      >
        {question}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', opacity: 0.5 }}>▼</span>
      </button>
      {isOpen && (
        <div style={{ 
            paddingBottom: '14px', 
            fontSize: '13px', color: '#4B5563', lineHeight: '1.6', letterSpacing: '0.01em'
        }}>
          {answer}
        </div>
      )}
    </div>
  );
};

const SocialProof = () => {
    const [visible, setVisible] = useState(false);
    const [customer, setCustomer] = useState({ name: 'Matthew', location: 'Austin, TX', time: '2 minutes ago' });

    // US-Only Locations
    const purchases = [
        { name: 'Sarah', location: 'Denver, CO', time: 'just now' },
        { name: 'Michael', location: 'Miami, FL', time: '5 minutes ago' },
        { name: 'Jessica', location: 'Seattle, WA', time: '1 minute ago' },
        { name: 'David', location: 'Austin, TX', time: '12 minutes ago' },
        { name: 'Emily', location: 'New York, NY', time: 'just now' },
        { name: 'James', location: 'Nashville, TN', time: '8 minutes ago' },
        { name: 'Robert', location: 'Chicago, IL', time: '3 minutes ago' },
        { name: 'Jennifer', location: 'Los Angeles, CA', time: '4 minutes ago' },
    ];

    useEffect(() => {
        const showTimer = setTimeout(() => {
            const randomCustomer = purchases[Math.floor(Math.random() * purchases.length)];
            setCustomer(randomCustomer);
            setVisible(true);
        }, 5000);

        const loopInterval = setInterval(() => {
             const randomCustomer = purchases[Math.floor(Math.random() * purchases.length)];
             setCustomer(randomCustomer);
             setVisible(true);
             setTimeout(() => setVisible(false), 15000); 
        }, 45000);

        return () => { clearTimeout(showTimer); clearInterval(loopInterval); };
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed', bottom: '20px', left: '20px', zIndex: 100,
            backgroundColor: 'white', padding: '12px 16px', borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #E5E7EB',
            animation: 'fadeInUp 0.5s ease-out',
            fontFamily: 'var(--font-family)'
        }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛒</div>
            <div>
                <p style={{ fontSize: '13px', color: '#111827', margin: 0, lineHeight: '1.2' }}><strong>{customer.name}</strong> from {customer.location}</p>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.2' }}>just bought the <strong>$4.99 Book</strong></p>
                <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0 0', letterSpacing: '0.02em' }}>{customer.time}</p>
            </div>
        </div>
    );
};

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0); 
  const [loading, setLoading] = useState<boolean>(true);
  const [includeBump, setIncludeBump] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const managePaymentIntent = useCallback(async (bumpState: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/manage-payment-intent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeBump: bumpState, paymentIntentId: paymentIntentId }),
      });
      if (!res.ok) throw new Error('Failed to initialize checkout session.');
      const data = await res.json();
      setClientSecret(data.clientSecret);
      if (!paymentIntentId) setPaymentIntentId(data.paymentIntentId);
      setAmount(data.amount); 
    } catch (err) { setError(err instanceof Error ? err.message : "Network error"); } 
    finally { setLoading(false); }
  }, [paymentIntentId]);

  useEffect(() => { if (!paymentIntentId) managePaymentIntent(false); }, [managePaymentIntent, paymentIntentId]);

  const handleBumpToggle = () => {
    const newBumpState = !includeBump;
    setIncludeBump(newBumpState);
    if (paymentIntentId) managePaymentIntent(newBumpState);
  };

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
        theme: 'flat', 
        variables: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            borderRadius: '8px', colorText: '#111827', colorBackground: '#F9FAFB', colorPrimary: '#6A45FF',
            fontSizeBase: '15px', spacingUnit: '4px',
        },
        rules: {
            '.Input': { border: '1px solid #D1D5DB', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
            '.Input:focus': { borderColor: '#6A45FF', boxShadow: '0 0 0 3px rgba(106, 69, 255, 0.2)' },
        }
    },
  };

  if (error) return <div style={{padding: '40px', textAlign: 'center', color: '#EF4444'}}>Error: {error}</div>;

  // --- ORDER BUMP ---
  const OrderBumpComponent = (
    <div className="order-bump-container" style={{
        marginTop: '24px', marginBottom: '24px',
        border: includeBump ? '2px solid #059669' : '2px dashed #D1D5DB', 
        backgroundColor: '#ECFDF5', padding: '16px', borderRadius: '12px',
        position: 'relative', transition: 'all 0.2s ease-in-out'
    }}>
        <label style={{display: 'flex', gap: '14px', cursor: 'pointer', alignItems: 'flex-start'}}>
            <input 
                type="checkbox" checked={includeBump} onChange={handleBumpToggle} disabled={loading}
                style={{marginTop: '4px', transform: 'scale(1.2)', accentColor: '#059669'}}
            />
            <div style={{flex: 1}}>
                <p style={{
                    fontWeight: '800', color: '#064E3B', marginBottom: '6px', fontSize: '15px', letterSpacing: '-0.01em', lineHeight: '1.3'
                }}>
                    {/* FIXED: &nbsp; forces "Subject Line Vault" to stay together */}
                    YES! Upgrade my order to include the &quot;High-Open Subject&nbsp;Line&nbsp;Vault.&quot;
                </p>
                <p style={{
                    fontSize: '14px', color: '#374151', lineHeight: '1.6'
                }}>
                    <span style={{fontWeight: '700', color: '#059669'}}>One-Time Offer ({formatCurrency(DISPLAY_PRICE_BUMP)}):</span> The $4.99 system gives you the <em>strategy</em>, but this upgrade gives you the <strong>exact&nbsp;words.</strong>
                </p>
            </div>
        </label>
    </div>
  );

  return (
    <>
    <DynamicBackground />
    <SocialProof />

    <div className="checkout-container">
        <header className="checkout-header">
            <img src="https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Logo2_on0p1k.png" alt="Logo" className="logo" 
                 style={{ maxWidth: '150px', height: 'auto', marginBottom: '20px' }} 
            />
            
            <h1 style={{
                fontSize: '32px', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.025em', 
                marginBottom: '16px', color: '#111827'
            }}>
                Turn New Subscribers Into Buyers Automatically
                <br />
                —Without Writing a Single Word
            </h1>
            
            <p style={{
                fontSize: '18px', color: '#374151', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto'
            }}>
                Stop staring at a blank cursor. Get the proven welcome sequence framework that engages leads the moment they sign up.
            </p>
        </header>

        <main className="checkout-grid">
            
            {/* LEFT COLUMN */}
            <section className="checkout-main">
                <div className="card" style={{position: 'relative', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'}}>
                    <h2 className="card-header-pill">Customer Information</h2>
                    {loading && !clientSecret && <p style={{textAlign: 'center', padding: '50px 0'}}>Initializing...</p>}
                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm amountInCents={amount} isPriceUpdating={loading}>
                                {OrderBumpComponent}
                            </CheckoutForm>
                        </Elements>
                    )}
                     {loading && clientSecret && (
                        <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: '12px'}}>
                            <p style={{fontWeight: '700', color: '#6A45FF'}}>Updating...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* RIGHT COLUMN */}
            <aside className="checkout-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* 1. Value Stack */}
                <div className="card" style={{backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                    <h2 className="card-header-pill">What&apos;s Included</h2>
                    <img src="https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Bundle_va8f72.png" alt="Bundle" className="product-image-mockup" />

                    <ul className="features-list" style={{listStyle: 'none', padding: 0, margin: '20px 0'}}>
                        {[
                            { name: "The 7-Figure Blueprint", val: "$97" },
                            { name: "Plug-and-Play Templates", val: "$47" },
                            { name: "Recover Revenue Scripts", val: "$47" }
                        ].map((item, i) => (
                            <li key={i} style={{
                                display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
                                fontSize: '14px', color: '#374151', fontWeight: '500'
                            }}>
                                <span>{item.name}</span>
                                <span style={{color: '#6B7280', fontSize: '13px', fontWeight: '400'}}>(Val: {item.val})</span>
                            </li>
                        ))}
                    </ul>

                    <div style={{borderTop: '1px solid #E5E7EB', paddingTop: '14px', textAlign: 'center'}}>
                        <p style={{margin: 0, fontSize: '14px', color: '#6B7280'}}>Total Value: <span style={{textDecoration: 'line-through'}}>$191.00</span></p>
                        <p style={{margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#059669', letterSpacing: '-0.02em'}}>Today&apos;s Price: $4.99</p>
                    </div>

                    <div style={{marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed #E5E7EB'}}>
                         <p style={{fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px'}}>Common Questions</p>
                         <FAQItem question="Is this a subscription?" answer="NO. This is a one-time payment of $4.99." />
                         <FAQItem question="How do I get access?" answer="Check your email immediately after payment for the download link." />
                         <FAQItem question="Refund policy?" answer="30-Day Money-Back Guarantee. No questions asked." />
                    </div>

                    <div className="guarantee" style={{marginTop: '20px'}}>
                        <img src="https://res.cloudinary.com/dse1cikja/image/upload/v1763817716/Badge_b86eiv.png" alt="Seal" className="guarantee-seal" />
                        <p className="guarantee-text" style={{fontSize: '13px', lineHeight: '1.5'}}>
                            <span className="guarantee-title" style={{color: '#059669', fontWeight: '700', display: 'block'}}>30-Day Guarantee</span>
                            If you aren&apos;t satisfied, email us within 30 days for a full refund.
                        </p>
                    </div>
                </div>

                {/* 2. Order Summary - Sticky Top */}
                <div className="card" style={{
                    position: 'sticky', 
                    top: '20px', 
                    zIndex: 10,
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <h2 className="card-header-pill">Order Summary</h2>
                    <div className="summary-item" style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6'}}>
                        <span style={{fontSize: '14px', fontWeight: '500', color: '#374151'}}>The Next Best Message Book</span>
                        <span style={{fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '14px'}}>{formatCurrency(DISPLAY_PRICE_BASE)}</span>
                    </div>

                    {includeBump && (
                        <div className="summary-item" style={{
                            backgroundColor: '#ECFDF5', padding: '10px', margin: '12px -10px', borderRadius: '6px',
                            borderLeft: '4px solid #059669', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{fontSize: '13px', lineHeight: '1.3'}}>
                                <span style={{color: '#059669', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase', display: 'block'}}>UPGRADE ADDED</span>
                                Subject Line Vault
                            </span>
                            <span style={{fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '14px'}}>{formatCurrency(DISPLAY_PRICE_BUMP)}</span>
                        </div>
                    )}

                    <div className="summary-total" style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #E5E7EB'}}>
                        <span style={{fontSize: '18px', fontWeight: '800', letterSpacing: '-0.01em'}}>Total</span>
                        <span style={{fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#059669'}}>{formatCurrency(amount)}</span>
                    </div>
                </div>
                
            </aside>
        </main>
    </div>

    <footer className="checkout-footer">
        <div className="footer-payment-logos">
            <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="footer-logo" />
            <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="footer-logo" />
            <img src="https://res.cloudinary.com/dse1cikja/image/upload/v1763818297/image_gsilwt.png" alt="Amex" className="footer-logo" />
        </div>
        <div className="footer-links" style={{fontSize: '13px', color: '#6B7280'}}>
            <p>Need help? Email info@readysetfocus.com</p>
            <p>2025 Ready Set Focus LLC. All Rights Reserved.</p>
        </div>
    </footer>
    </>
  );
}