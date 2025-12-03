/* FILE: src/components/CheckoutForm.tsx */
'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
    amountInCents: number;
    isPriceUpdating: boolean;
    children?: React.ReactNode; 
}

export default function CheckoutForm({ amountInCents, isPriceUpdating, children }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');

  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountInCents / 100);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    if (!email.includes('@') || !fullName.trim()) {
      setMessage("Please fill in all fields."); return;
    }

    setIsProcessing(true); setMessage(null);

    // Get current path to redirect to the correct dynamic sub-route
    const currentPath = window.location.pathname; // e.g. "/email-bundle"
    // Strip trailing slash if present just in case
    const cleanPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // *** CRITICAL UPDATE: Redirects dynamically to [slug]/upsell ***
        return_url: `${window.location.origin}${cleanPath}/upsell`,
        receipt_email: email,
        payment_method_data: { billing_details: { name: fullName.trim(), email: email } }
      },
    });
    if (error) setMessage(error.message || 'Payment failed.');
    setIsProcessing(false);
  };

  const isButtonDisabled = isProcessing || isPriceUpdating || !stripe || !elements;
  let buttonText = isPriceUpdating ? 'Updating Total...' : `Get Instant Access - ${formattedAmount}`;
  if (isProcessing) buttonText = 'Processing...';

  return (
    <form id="checkoutForm" onSubmit={handleSubmit}>
        
        {/* STEP 1 */}
        <div className="form-section">
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#111827', marginBottom: '16px' }}>
                <span style={{color: '#6A45FF', marginRight: '10px', fontSize: '20px'}}>1.</span> Contact Information
            </h3>
            <div className="form-group" style={{marginBottom: '16px'}}>
                <input type="text" placeholder="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px', color: '#111' }} />
            </div>
            <div className="form-group">
                <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px', color: '#111' }} />
            </div>
        </div>

        {/* SOCIAL PROOF */}
        <div className="form-section" style={{marginBottom: '30px'}}>
            <h3 className="section-title" style={{fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', fontWeight: '700', marginBottom: '12px'}}>The People Have Spoken...</h3>
            <div className="testimonials" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                {[ {text: "Recovered $400 in lost cart sales automatically.", author: "Sarah J."}, {text: "I rewrote my welcome sequence in 20 minutes.", author: "Mark T."} ].map((t, i) => (
                    <div key={i} className="testimonial-card" style={{backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB'}}>
                        <div style={{color: '#F59E0B', fontSize: '14px', marginBottom: '8px'}}>★★★★★</div>
                        <p style={{fontSize: '13px', lineHeight: '1.5', color: '#374151', marginBottom: '8px', fontStyle: 'italic'}}>&quot;{t.text}&quot;</p>
                        <p style={{fontSize: '12px', fontWeight: '700', color: '#111827'}}>— {t.author}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* STEP 2 */}
        <div className="form-section">
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#111827', marginBottom: '16px' }}>
                <span style={{color: '#6A45FF', marginRight: '10px', fontSize: '20px'}}>2.</span> Payment Details
            </h3>
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
            
            <div style={{marginTop: '8px', display: 'flex', justifyContent: 'flex-start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#9CA3AF', fontWeight: '500'}}>
                    <span>🔒</span> 256-bit SSL Secure
                </div>
            </div>
        </div>

        {children}

        {message && <div role="alert" style={{color: '#B91C1C', margin: '15px 0', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', background: '#fef2f2', textAlign: 'center', fontSize: '14px', fontWeight: '500'}}>{message}</div>}

        <button type="submit" className="cta-button" id="submitButton" disabled={isButtonDisabled} 
            style={{
                width: '100%', backgroundColor: '#6A45FF', color: 'white', padding: '20px', borderRadius: '10px',
                fontSize: '20px', fontWeight: '800', letterSpacing: '0.01em', border: 'none', cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                opacity: isButtonDisabled ? 0.7 : 1, transition: 'all 0.2s', marginTop: '10px',
                boxShadow: '0 4px 6px -1px rgba(106, 69, 255, 0.4), 0 2px 4px -1px rgba(106, 69, 255, 0.2)'
            }}>
             {buttonText}
        </button>

        <div style={{textAlign: 'center', marginTop: '16px'}}>
            <p style={{fontWeight: '700', color: '#059669', marginBottom: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
                <span>✓</span> 30-Day Money-Back Guarantee
            </p>
        </div>
    </form>
  );
}