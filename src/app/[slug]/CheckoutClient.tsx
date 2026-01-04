/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products/index'; 
import { getFunnelConfig } from '@/lib/funnel-types';
import '@/styles/checkout-design.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SocialProofPopup = () => {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState({ name: "Sarah", location: "Austin, TX", time: "2 minutes ago" });

  useEffect(() => {
    const recentSales = [
        { name: "Mike T.", loc: "Denver, CO" },
        { name: "Sarah L.", loc: "Austin, TX" },
        { name: "David K.", loc: "Seattle, WA" },
        { name: "Robert M.", loc: "Nashville, TN" }
    ];
    
    const times = ["Just now", "2 minutes ago", "5 minutes ago"];

    const cycle = () => {
      const randomSale = recentSales[Math.floor(Math.random() * recentSales.length)];
      setInfo({
        name: randomSale.name,
        location: randomSale.loc,
        time: times[Math.floor(Math.random() * times.length)]
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000); 
    };

    const timer = setInterval(cycle, 15000);
    setTimeout(cycle, 4000); 

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg p-4 flex items-center gap-4 animate-[slideUp_0.5s_ease-out] max-w-xs">
      <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{info.name} in {info.location}</p>
        <p className="text-xs text-gray-500 font-medium">Verified Owner • {info.time}</p>
      </div>
    </div>
  );
};

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  const productData = checkout;
  
  const rawFunnelType = productData.funnelType || 'digital_product';
  const config = getFunnelConfig(rawFunnelType); 
  
  const buttonCTA = productData.ctaText || config.defaultButtonText;
  const [amount, setAmount] = useState<number>(checkout.price || 0);
  const [isBumpSelected, setIsBumpSelected] = useState(false);

  const videoUrl = productData.videoEmbedUrl;
  const hasVideo = videoUrl && videoUrl.length > 5;

  if (amount !== checkout.price && !isBumpSelected) {
      setAmount(checkout.price);
  }

  // AESTHETIC FIX: Custom Stripe Appearance for "Executive" Look
  const appearance = {
    theme: 'flat' as const,
    variables: {
      colorPrimary: '#B45309', // Legacy Gold
      colorBackground: '#F9FAFB', // Light Gray Input Background
      colorText: '#18181B', // Zinc-900
      borderRadius: '8px',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid #E4E4E7',
        boxShadow: 'none',
        padding: '12px',
        transition: 'border 0.2s ease',
      },
      '.Input:focus': {
        border: '1px solid #B45309', // Gold focus ring
        boxShadow: '0 0 0 2px rgba(180, 83, 9, 0.1)',
      },
      '.Label': {
        fontWeight: '600',
        color: '#3F3F46',
        marginBottom: '6px',
        fontSize: '14px',
      }
    }
  };

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: amount,
    currency: 'usd',
    appearance,
  };

  const OrderBumpComponent = (
    <div className="relative overflow-hidden bg-amber-50/50 border border-amber-200 rounded-xl p-5 mt-8 transition-all hover:border-amber-300">
      <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
        Recommended
      </div>
      <label className="flex items-start cursor-pointer select-none gap-4" htmlFor="bump-offer">
        <div className="flex-shrink-0 mt-1">
          <input 
            type="checkbox" 
            id="bump-offer" 
            className="h-5 w-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            checked={isBumpSelected}
            onChange={(e) => {
              setIsBumpSelected(e.target.checked);
              setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
            }}
          />
        </div>
        <div className="flex-1">
          <span className="block text-base font-bold text-gray-900 mb-1 leading-snug">
             <span className="text-red-700 uppercase mr-1.5 font-extrabold">ONE-TIME OFFER:</span> 
             {bump.headline}
          </span>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
             {bump.description}
          </p>
          <p className="text-amber-700 font-bold text-sm flex items-center gap-1">
             Add to order for just <span className="underline decoration-amber-300 decoration-2">${(bump.price / 100).toFixed(2)}</span>
          </p>
        </div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-[#F8F9FA] pb-24 text-gray-900">
      <SocialProofPopup />

      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-100 shadow-sm pt-8 pb-10 mb-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Logo" className="mx-auto h-10 mb-6 object-contain" />
            ) : (
              <div className="text-2xl font-serif font-bold mb-6 tracking-tight">THE LEGACY BLUEPRINT</div>
            )}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 leading-tight tracking-tight">
              {checkout.headline}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              {checkout.subhead}
            </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: CHECKOUT FORM */}
          <div className="lg:col-span-7 xl:col-span-8">
             {/* Main Card: Glass & Steel Effect */}
             <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                
                {/* Progress Header */}
                <div className="bg-gray-50/80 px-8 py-5 border-b border-gray-100 flex items-center justify-between backdrop-blur-sm">
                   <div className="flex items-center gap-3">
                      <div className="bg-gray-900 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-sm">1</div>
                      <h2 className="font-bold text-gray-800 tracking-tight">Secure Checkout</h2>
                   </div>
                   <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      AES-256 Encrypted
                   </div>
                </div>

                <div className="p-6 md:p-10">
                    <div className="mb-8">
                       <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          {config.requiresShipping ? 'Shipping Information' : 'Contact Information'}
                       </h3>
                       {/* This empty div is just a spacer for visual rhythm */}
                       <div className="h-px w-full bg-gray-100 mb-6"></div>
                    </div>

                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm 
                          amountInCents={amount} 
                          productSlug={product.id}
                          isBumpSelected={isBumpSelected}
                          funnelConfig={config} 
                          customButtonText={buttonCTA}
                      >
                          {config.showOrderBump && OrderBumpComponent}
                      </CheckoutForm>
                    </Elements>
                </div>
             </div>

             {/* --- THE ULTIMATE GUARANTEE SECTION (WITH 3D SEAL) --- */}
             <div className="mt-12 group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
               {/* Background Texture for "Official" Feel */}
               <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gray-50 opacity-50 blur-2xl transition-opacity group-hover:opacity-100"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                 {/* 1. The Visual Anchor (3D Seal or Fallback) */}
                 <div className="flex-shrink-0">
                   {product.checkout.guaranteeBadge ? (
                     <img 
                       src={product.checkout.guaranteeBadge} 
                       alt="Satisfaction Guarantee Seal" 
                       className="h-24 w-auto drop-shadow-xl filter transition-transform duration-300 hover:scale-105 hover:rotate-3" 
                     />
                   ) : (
                     <div className="relative h-20 w-20 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 shadow-inner">
                        <svg className="h-10 w-10 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20"></div>
                     </div>
                   )}
                 </div>

                 {/* 2. The Legal Promise (Copy) */}
                 <div className="flex-1">
                   <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                     The "Sleep Well At Night" 365-Day Promise
                   </h3>
                   <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                     <p>
                       We are asking you to trust us with your family's future. We take that responsibility seriously.
                     </p>
                     <p>
                       <strong className="text-gray-900">Here is the deal:</strong> Download the Survivor's Manual. Fill it out. If you don't feel an immediate, physical weight lift off your shoulders—or if your family doesn't thank you for it—simply email us.
                     </p>
                     <p>
                       We will refund <span className="underline decoration-yellow-400 decoration-2 font-medium text-gray-900">100% of your money</span>. No questions asked. And you can <strong className="text-gray-900">keep the files</strong> as our apology for wasting your time.
                     </p>
                   </div>
                   
                   {/* 3. The Personal Signature (Authority) */}
                   <div className="mt-6 flex items-center gap-3 pt-6 border-t border-gray-100">
                      <div className="h-px w-8 bg-gray-900"></div>
                      <span className="font-serif italic text-gray-900 text-lg">The Founders</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
          
          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            
            {/* PRODUCT CARD */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-gray-900 text-white px-6 py-4 font-bold text-sm tracking-wide uppercase flex justify-between items-center">
                 <span>Your Order</span>
                 <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              
              <div className="p-6">
                 {/* Product Image - Full Width Bleed Effect */}
                 <div className="-mx-6 -mt-6 mb-6 bg-gray-50 border-b border-gray-100">
                    {hasVideo ? (
                        <div className="aspect-video w-full relative">
                            <iframe 
                              src={videoUrl} 
                              className="absolute inset-0 w-full h-full" 
                              allow="autoplay; encrypted-media" 
                              allowFullScreen 
                            />
                        </div>
                    ) : (
                        <img src={checkout.image} alt={checkout.productName} className="w-full h-auto object-cover" />
                    )}
                 </div>

                 <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{checkout.productName}</h3>
                    <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {config.fulfillmentMode === 'physical' ? 'In Stock - Ships Tomorrow' : 'Instant Digital Access'}
                    </p>
                 </div>

                 {/* Feature List */}
                 <div className="bg-blue-50/50 rounded-lg p-5 mb-6 border border-blue-100">
                    <ul className="space-y-3">
                      {checkout.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                 </div>

                 {/* Order Summary Table */}
                 <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>The Legacy Blueprint</span>
                        <span className="font-medium text-gray-900">${(checkout.price / 100).toFixed(2)}</span>
                    </div>
                    {isBumpSelected && (
                        <div className="flex justify-between text-sm text-amber-700 font-medium">
                            <span>Digital Twin Upgrade</span>
                            <span>${(bump.price / 100).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping & Handling</span>
                        <span className="font-medium text-gray-900">FREE</span>
                    </div>
                    
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-dashed border-gray-200 mt-4">
                        <span>Total</span>
                        <span>${(amount / 100).toFixed(2)}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Simple FAQ */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
               <h4 className="font-bold text-gray-500 mb-4 text-sm uppercase tracking-wide">Common Questions</h4>
               <div className="space-y-4">
                  <details className="group">
                     <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-sm text-gray-800 hover:text-gray-600">
                        <span>When will this arrive?</span>
                        <span className="transition-transform group-open:rotate-180">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                     </summary>
                     <p className="text-gray-600 text-sm mt-2 leading-relaxed pl-1">
                        We ship physical binders within 24 hours. You will receive a tracking number immediately via email.
                     </p>
                  </details>
                  <details className="group">
                     <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-sm text-gray-800 hover:text-gray-600">
                        <span>Is my data secure?</span>
                        <span className="transition-transform group-open:rotate-180">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                     </summary>
                     <p className="text-gray-600 text-sm mt-2 leading-relaxed pl-1">
                        Absolutely. We use bank-level AES-256 encryption. We do not store your credit card information.
                     </p>
                  </details>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}