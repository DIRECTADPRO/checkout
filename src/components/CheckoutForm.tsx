/* FILE: src/components/CheckoutForm.tsx */
'use client';

import React, { useState } from 'react';
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

type CheckoutFormProps = {
  amountInCents: number;
  isPriceUpdating: boolean;
  productSlug: string;
  isBumpSelected: boolean;
  children?: React.ReactNode;
  funnelType?: string;
};

export default function CheckoutForm({
  amountInCents,
  isPriceUpdating,
  productSlug,
  isBumpSelected,
  children,
  funnelType = 'digital_product',
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIC: DEFINE VARIABLES HERE ---
  const needsShipping = ['physical_product', 'free_plus_shipping', 'pre_order', 'tripwire_offer'].includes(funnelType);
  const isFreeFunnel = ['newsletter_signup', 'lead_magnet', 'waitlist', 'application_funnel', 'webinar_live'].includes(funnelType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isFreeFunnel) {
        // Simulate Success for Free Funnels
        setTimeout(() => {
            alert(`Success! Captured email: ${email} for ${funnelType}`);
            setIsLoading(false);
        }, 1000);
        return;
    }

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
        receipt_email: email,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage('An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      
      {/* 1. EMAIL FIELD */}
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 2. SHIPPING ADDRESS (Conditional) */}
      {needsShipping && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
           <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
             Shipping Information
           </h3>
           <AddressElement options={{ mode: 'shipping', allowedCountries: ['US', 'CA', 'GB'] }} />
        </div>
      )}

      {/* 3. CREDIT CARD (Hidden if Free) */}
      {!isFreeFunnel && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Details
          </label>
          <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
        </div>
      )}

      {/* 4. BUMP OFFER (Hidden if Free) */}
      {!isFreeFunnel && children}

      {/* 5. SMART BUTTON */}
      <button
        disabled={isLoading || (!isFreeFunnel && (!stripe || !elements))}
        id="submit"
        className="w-full bg-[#6A45FF] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#5839db] transition-colors shadow-lg mt-6 text-lg relative overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">Processing...</div>
        ) : (
          (() => {
             const priceDisplay = `$${(amountInCents / 100).toFixed(2)}`;
             switch(funnelType) {
                case 'physical_product': return `Ship My Order - ${priceDisplay}`;
                case 'free_plus_shipping': return `I'll Cover Shipping - ${priceDisplay}`;
                case 'tripwire_offer': return `Grab the Deal - ${priceDisplay}`;
                case 'charity_donation': return `Donate Now - ${priceDisplay}`;
                case 'newsletter_signup': return "Subscribe Now (Free)";
                case 'lead_magnet': return "Send Me The Guide";
                case 'waitlist': return "Join The Waitlist";
                case 'webinar_live': return "Register For Free";
                case 'application_funnel': return "Submit Application";
                default: return `Get Instant Access - ${priceDisplay}`;
             }
          })()
        )}
      </button>

      {/* Error Messages */}
      {message && <div className="mt-4 text-center text-red-600 bg-red-50 p-3 rounded-md">{message}</div>}
      
      {/* Secure Badge - FIXED SIZE LOCK */}
      {!isFreeFunnel && (
        <div className="mt-4 text-center">
           <p className="text-xs text-gray-400 flex items-center justify-center">
             <svg 
               style={{ width: '12px', height: '12px', marginRight: '5px' }} 
               fill="currentColor" 
               viewBox="0 0 20 20"
             >
               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
             </svg>
             256-Bit Bank Level Security
           </p>
        </div>
      )}
    </form>
  );
}