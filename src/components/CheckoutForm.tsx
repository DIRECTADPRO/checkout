/* FILE: src/components/CheckoutForm.tsx */
'use client';

import React, { useState } from 'react';
import { 
  PaymentElement, 
  AddressElement,
  LinkAuthenticationElement, 
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

    // Note: We no longer need to pass 'name' manually. 
    // The AddressElement automatically attaches the Billing Details (Name, Phone, Address) 
    // to the PaymentIntent.
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
    <form id="payment-form" onSubmit={handleSubmit} className="w-full">
      
      {/* 1. CUSTOMER INFORMATION (Email Only) */}
      <div className="mb-8 mt-2">
         <h3 className="block text-lg font-bold text-gray-900 mb-4 tracking-tight">
            Customer Information
         </h3>
         
         {/* EMAIL */}
         <div className="mb-4">
             {/* ALIGNMENT FIX: Removed ml-1 to match Stripe's flush alignment */}
             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
             <LinkAuthenticationElement 
                id="link-authentication-element"
                options={{ defaultValues: { email: '' } }} 
             />
         </div>
         {/* REMOVED MANUAL NAME INPUT TO FIX DUPLICATION */}
      </div>

      {/* 2. ADDRESS BLOCK (Handles Name, Address, AND Phone) */}
      <div className="mb-8 animate-[fadeIn_0.4s_ease-out]">
          <h3 className="block text-lg font-bold text-gray-900 mb-4 tracking-tight">
             {funnelConfig.requiresShipping ? 'Shipping Address' : 'Billing Address'}
          </h3>
          <AddressElement 
             options={{ 
                 mode: funnelConfig.requiresShipping ? 'shipping' : 'billing',
                 // THIS ADDS THE PHONE FIELD AND MAKES IT REQUIRED
                 fields: { phone: 'always' },
                 validation: { phone: { required: 'always' } }
             }} 
          />
      </div>

      {/* 3. PAYMENT DETAILS */}
      <div className="mb-8">
        <h3 className="block text-lg font-bold text-gray-900 mb-4 tracking-tight">
            Payment Details
        </h3>
        <PaymentElement id="payment-element" options={{layout: "tabs"}} />
      </div>

      {/* 4. ORDER BUMP */}
      {children}

      {/* 5. CTA BUTTON */}
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className={`
            w-full group relative flex justify-center items-center mt-6
            py-4 px-6 rounded-lg text-white font-bold text-xl tracking-wide
            bg-gradient-to-r from-yellow-600 via-orange-600 to-red-700
            hover:from-yellow-500 hover:via-orange-500 hover:to-red-600
            shadow-[0_4px_14px_0_rgba(194,65,12,0.39)] 
            hover:shadow-[0_6px_20px_rgba(194,65,12,0.23)] 
            hover:-translate-y-0.5 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
            transition-all duration-300 ease-out
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        `}
      >
        <span className="flex items-center gap-3 relative z-10">
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Securely...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              {customButtonText}
            </>
          )}
        </span>
      </button>

      {/* Security Footnote */}
      <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-400">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
        <span>Guaranteed Safe & Secure Checkout</span>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-[fadeIn_0.3s_ease-out]">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-red-800 font-medium">{message}</p>
        </div>
      )}
    </form>
  );
}