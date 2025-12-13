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
  productSlug: string;
  isBumpSelected: boolean;
  funnelConfig: FunnelBehavior;
  customButtonText: string;
  children?: React.ReactNode;
  // Included to prevent TS errors if passed, though unused in logic
  isPriceUpdating?: boolean; 
}

export default function CheckoutForm({ 
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
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
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
    <form id="payment-form" onSubmit={handleSubmit} className="w-full space-y-6">
      
      {/* 1. SHIPPING (Dynamic) */}
      {funnelConfig.requiresShipping && (
         <div className="mb-5 animate-[fadeIn_0.5s_ease-in-out]">
             <h3 className="text-base font-semibold text-gray-900 mb-3">
                Shipping Information
             </h3>
             <AddressElement options={{ mode: 'shipping' }} />
         </div>
      )}

      {/* 2. PAYMENT */}
      <div className="mb-6 rounded-md bg-white">
        <PaymentElement id="payment-element" options={{layout: "tabs"}} />
      </div>

      {/* 3. ORDER BUMP */}
      {children}

      {/* 4. CONVERSION MASTERPIECE BUTTON (Pure Tailwind) */}
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className={`
            w-full group relative flex justify-center items-center
            py-4 px-6 rounded-lg text-white font-bold text-lg
            bg-gradient-to-r from-amber-500 to-orange-600 
            hover:from-amber-400 hover:to-orange-500
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
            transition-all duration-200 ease-in-out
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
        `}
      >
        <span className="flex items-center gap-2">
          {isLoading ? (
            // Simple Tailwind Spinner
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              {/* Lock Icon */}
              <svg className="w-5 h-5 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              {customButtonText}
            </>
          )}
        </span>
      </button>

      {/* ERROR MESSAGE */}
      {message && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r shadow-sm">
            <div className="flex">
                <p className="text-sm text-red-700">{message}</p>
            </div>
        </div>
      )}
    </form>
  );
}