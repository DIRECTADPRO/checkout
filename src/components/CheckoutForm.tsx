/* FILE: src/components/CheckoutForm.tsx */
'use client';

import React, { useState } from 'react';
import { 
  PaymentElement, 
  AddressElement,
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { FunnelBehavior } from '@/lib/funnel-types';

interface CheckoutFormProps {
  amountInCents: number;
  isPriceUpdating: boolean;
  productSlug: string;
  isBumpSelected: boolean;
  funnelConfig: FunnelBehavior; // We now expect the FULL behavior object
  customButtonText: string;     // The finalized button text from parent
  children?: React.ReactNode;   // For the Order Bump
}

export default function CheckoutForm({ 
  amountInCents, 
  isPriceUpdating, 
  productSlug, 
  isBumpSelected,
  funnelConfig,
  customButtonText,
  children
}: CheckoutFormProps) {
  
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure you have a success page set up
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      
      {/* 1. EMAIL FIELD (Standard) */}
      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px'}}>
          Email Address
        </label>
        {/* Stripe's Link Authentication Element automatically handles email */}
        <div style={{display: 'none'}}> 
            {/* Note: If you want to capture email explicitly outside Stripe, add an input here. 
                Otherwise, PaymentElement handles it via "Link". 
                For this example, we let PaymentElement handle it or assume you have a separate email handler.
            */}
        </div>
      </div>

      {/* 2. DYNAMIC SHIPPING ADDRESS */}
      {/* Only renders if the funnel type REQUIRES it */}
      {funnelConfig.requiresShipping && (
         <div style={{marginBottom: '20px'}}>
             <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '12px'}}>Shipping Information</h3>
             <AddressElement options={{ mode: 'shipping' }} />
         </div>
      )}

      {/* 3. BILLING ADDRESS (If needed separately or different from Payment Default) */}
      {/* PaymentElement usually handles Billing Zip. Use AddressElement mode='billing' only if you need full address for digital products */}
      {funnelConfig.requiresBillingAddress && !funnelConfig.requiresShipping && (
          <div style={{marginBottom: '20px'}}>
             <AddressElement options={{ mode: 'billing' }} />
          </div>
      )}

      {/* 4. PAYMENT ELEMENT */}
      <div style={{marginBottom: '24px'}}>
        <PaymentElement id="payment-element" options={{layout: "tabs"}} />
      </div>

      {/* 5. ORDER BUMP INJECTION */}
      {/* The bump component is passed as 'children' from the parent */}
      {children}

      {/* 6. SUBMIT BUTTON */}
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        style={{
            width: '100%',
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '18px',
            border: 'none',
            cursor: (isLoading || !stripe) ? 'not-allowed' : 'pointer',
            opacity: (isLoading || !stripe) ? 0.7 : 1,
            marginTop: '24px',
            boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.2s ease'
        }}
      >
        <span id="button-text">
          {isLoading ? (
            <div className="spinner" id="spinner">Processing...</div>
          ) : (
            // DYNAMIC BUTTON TEXT
            customButtonText
          )}
        </span>
      </button>

      {/* ERROR MESSAGES */}
      {message && (
        <div id="payment-message" style={{color: '#df1b41', marginTop: '12px', textAlign: 'center', fontSize: '14px'}}>
            {message}
        </div>
      )}
    </form>
  );
}