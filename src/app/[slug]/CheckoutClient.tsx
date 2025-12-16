/* FILE: src/app/[slug]/CheckoutClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
// FIX 1: Point directly to the index file so it finds the folder correctly
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
        { name: "Jessica R.", loc: "Miami, FL" },
        { name: "David K.", loc: "Seattle, WA" },
        { name: "Emily W.", loc: "Chicago, IL" },
        { name: "James P.", loc: "Atlanta, GA" },
        { name: "Amanda B.", loc: "Phoenix, AZ" },
        { name: "Robert M.", loc: "Nashville, TN" }
    ];
    
    const times = ["Just now", "2 minutes ago", "5 minutes ago", "12 minutes ago"];

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
    <div className="fixed bottom-4 left-4 z-50 bg-white border-l-4 border-green-500 shadow-xl rounded-r-lg p-4 flex items-center gap-3 animate-[slideUp_0.5s_ease-out]" style={{maxWidth: '320px'}}>
      <div className="bg-green-100 p-2 rounded-full text-green-600">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{info.name} in {info.location}</p>
        <p className="text-xs text-gray-500">Verified Purchase • {info.time}</p>
      </div>
    </div>
  );
};

export default function CheckoutClient({ product }: { product: ProductConfig }) {
  const { theme, checkout, bump } = product;
  const productData = checkout;
  
  // Use the funnelType from the config, or default to digital
  const rawFunnelType = productData.funnelType || 'digital_product';
  const config = getFunnelConfig(rawFunnelType); 
  
  const buttonCTA = productData.ctaText || config.defaultButtonText;
  const [amount, setAmount] = useState<number>(checkout.price || 0);
  const [isBumpSelected, setIsBumpSelected] = useState(false);

  // VIDEO LOGIC: Check if embed URL exists
  const videoUrl = productData.videoEmbedUrl;
  const hasVideo = videoUrl && videoUrl.length > 5; // Simple check for valid string

  // Fix Price Logic
  if (amount !== checkout.price && !isBumpSelected) {
      setAmount(checkout.price);
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: theme.accentColor || '#6366f1',
      colorBackground: '#ffffff', 
      colorText: '#1f2937',
      borderRadius: '8px',
    },
  };

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: amount,
    currency: 'usd',
    appearance,
  };

  const OrderBumpComponent = (
    <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-xl p-4 mt-6">
      <label className="flex items-start cursor-pointer select-none" htmlFor="bump-offer">
        <div className="flex h-6 items-center">
          <input 
            type="checkbox" 
            id="bump-offer" 
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={isBumpSelected}
            onChange={(e) => {
              setIsBumpSelected(e.target.checked);
              setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
            }}
          />
        </div>
        <div className="ml-3 text-sm">
          <span className="block text-base font-bold text-gray-900 mb-1">
             <span className="text-red-600 uppercase mr-1">ONE-TIME OFFER:</span> 
             {bump.headline}
          </span>
          <p className="text-gray-600 leading-relaxed mb-2">
             {bump.description}
          </p>
          <span className="text-green-700 font-bold text-base">
             Add for just ${(bump.price / 100).toFixed(2)}
          </span>
        </div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50 pb-20">
      <SocialProofPopup />

      <div className="max-w-6xl mx-auto px-4 pt-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Logo" className="mx-auto h-12 mb-6" />
            ) : (
              <div className="text-2xl font-bold mb-6">LOGO</div>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {checkout.headline}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {checkout.subhead}
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* MAIN CHECKOUT (LEFT) */}
          <div className="lg:col-span-8">
             <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                      <h2 className="font-bold text-gray-800">Contact & Shipping</h2>
                   </div>
                   <div className="text-xs text-gray-400 font-medium">Step 1 of 2</div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="inline-block bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide mb-6 shadow-sm">
                       {config.requiresShipping ? 'Where Should We Ship It?' : 'Complete Your Order'}
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

             {/* 30 DAY GUARANTEE SEAL */}
             <div className="mt-8 flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <div className="flex-shrink-0">
                    <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954-1.582 1.605 3.192a1 1 0 01-.44 1.355l-2.006 1.102 2.006 1.103a1 1 0 01.44 1.354L14.954 16.67l-3.954-1.582V17a1 1 0 11-2 0v-1.912l-3.954 1.582-1.605-3.192a1 1 0 01.44-1.354l2.006-1.103-2.006-1.102a1 1 0 01-.44-1.355L6.046 4.323 10 5.905V3a1 1 0 011-1zm0 4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd"/></svg>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg">30-Day Money-Back Guarantee</h3>
                    <p className="text-sm text-gray-600">If you don't love it, simply email us within 30 days for a full refund. No questions asked.</p>
                 </div>
             </div>
          </div>
          
          {/* SIDEBAR (RIGHT) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* WHAT YOU GET */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#6366f1] text-white px-6 py-3 font-bold text-lg">What You Get</div>
              <div className="p-6">
                 {hasVideo ? (
                    <div className="mb-6 rounded-lg overflow-hidden shadow-md aspect-video border border-gray-200 relative bg-black">
                        <iframe 
                          src={videoUrl} 
                          className="absolute top-0 left-0 w-full h-full" 
                          allow="autoplay; encrypted-media" 
                          allowFullScreen 
                          title="Product Video"
                        />
                    </div>
                 ) : (
                    <img src={checkout.image} alt={checkout.productName} className="w-full rounded-lg mb-6 shadow-sm border border-gray-100" />
                 )}
                 <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{checkout.productName}</h3>
                    <p className="text-sm text-gray-500 font-medium">{config.fulfillmentMode === 'physical' ? 'Physical Package' : 'Instant Digital Access'}</p>
                 </div>
                 <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <ul className="space-y-3">
                      {/* FIX 2: Explicitly type feature and index */}
                      {checkout.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="text-blue-500 font-bold mr-3">✓</span> 
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
            </div>
            
            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#6366f1] text-white px-6 py-3 font-bold text-lg">Order Summary</div>
              <div className="p-6">
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Item Price</span>
                        <span>${(checkout.price / 100).toFixed(2)}</span>
                    </div>
                    {isBumpSelected && (
                        <div className="flex justify-between text-sm text-green-700 font-medium">
                            <span>{bump.headline} (Add-on)</span>
                            <span>${(bump.price / 100).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Shipping & Handling</span>
                        <span className="font-bold text-gray-900">$0.00</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between text-xl font-extrabold text-gray-900">
                        <span>Total</span>
                        <span className="text-[#6366f1]">${(amount / 100).toFixed(2)}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
               <h4 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h4>
               <div className="space-y-4">
                  <details className="group">
                     <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm text-gray-700">
                        <span>When will this arrive?</span>
                        <span className="transition group-open:rotate-180">
                           <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                     </summary>
                     <p className="text-gray-600 text-xs mt-3 group-open:animate-fadeIn">
                        We deliver instantly for digital items, and ship within 24 hours for physical goods.
                     </p>
                  </details>
                  <details className="group">
                     <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm text-gray-700">
                        <span>Is there a refund policy?</span>
                        <span className="transition group-open:rotate-180">
                           <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                     </summary>
                     <p className="text-gray-600 text-xs mt-3 group-open:animate-fadeIn">
                        Yes! We offer a no-questions-asked 30-day money-back guarantee.
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