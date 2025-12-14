'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { ProductConfig } from '@/lib/products';
import { getFunnelConfig } from '@/lib/funnel-types';
import '@/styles/checkout-design.css'; // <--- Ensures Purple Headers & Seal

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- SOCIAL PROOF POPUP COMPONENT ---
const SocialProofPopup = () => {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState({ name: "Sarah", location: "Austin, TX", time: "2 minutes ago" });

  useEffect(() => {
    const names = ["Sarah L.", "Mike T.", "Jessica R.", "David K.", "Emily W."];
    const locations = ["Austin, TX", "New York, NY", "London, UK", "Toronto, CA", "Sydney, AU"];
    const times = ["2 minutes ago", "Just now", "5 minutes ago", "1 minute ago"];

    const cycle = () => {
      setInfo({
        name: names[Math.floor(Math.random() * names.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: times[Math.floor(Math.random() * times.length)]
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000); // Hide after 5s
    };

    const timer = setInterval(cycle, 12000); // Show every 12s
    setTimeout(cycle, 3000); // Show first one after 3s

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border-l-4 border-green-500 shadow-xl rounded-r-lg p-4 flex items-center gap-3 animate-fade-in-up" style={{maxWidth: '300px'}}>
      <div className="bg-green-100 p-2 rounded-full text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

  const productData = checkout as any;
  const rawFunnelType = productData.funnelType || 'digital_product';
  const config = getFunnelConfig(rawFunnelType); 
  
  const buttonCTA = productData.ctaText || config.defaultButtonText;

  const [amount, setAmount] = useState<number>(checkout.price || 0);
  const [isBumpSelected, setIsBumpSelected] = useState(false);

  const videoUrl = productData.videoEmbedUrl;
  const hasVideo = videoUrl && videoUrl.length > 0;

  if (amount !== checkout.price && !isBumpSelected) {
      if (amount === 499 && checkout.price === 700) {
          setAmount(700);
      }
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5', 
      colorBackground: '#F9FAFB', 
      colorText: '#111827',
      borderRadius: '8px',
      fontFamily: '"Inter", system-ui, sans-serif',
    },
  };

  const options: StripeElementsOptions = {
    mode: config.isSubscription ? 'subscription' : 'payment' as any,
    amount: config.isSubscription ? undefined : amount,
    currency: 'usd',
    appearance,
    paymentMethodTypes: ['card'],
  };

  const OrderBumpComponent = (
    <div className="order-bump">
      <label className="order-bump-label" htmlFor="bump-offer">
        <input 
          type="checkbox" 
          id="bump-offer" 
          checked={isBumpSelected}
          onChange={(e) => {
            setIsBumpSelected(e.target.checked);
            setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
          }}
        />
        <div className="order-bump-content" style={{marginLeft: '12px'}}>
          <div className="order-bump-title">{bump.headline}</div>
          <div className="order-bump-description">
             <span className="order-bump-price-container" style={{display: 'block', marginBottom: '4px'}}>
               <span style={{color: '#15803D', fontWeight: 'bold'}}>One-Time Offer (${(bump.price / 100).toFixed(2)}):</span>
             </span>
             {bump.description}
          </div>
        </div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
      {/* SOCIAL PROOF POPUP */}
      <SocialProofPopup />

      <div className="checkout-container">
        <div className="checkout-header" style={{textAlign: 'center', marginBottom: '50px'}}>
            {theme.logoUrl ? (
              <img src={theme.logoUrl} alt="Logo" className="logo" style={{margin: '0 auto 20px auto', maxWidth: '120px', display: 'block'}} />
            ) : (
              <div className="logo" style={{margin: '0 auto 20px auto', fontSize: '24px', fontWeight: 'bold'}}>LOGO</div>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              {checkout.headline}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {checkout.subhead}
            </p>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mt-6">
                <div className="inline-block bg-indigo-900 text-white px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
                   {config.requiresShipping ? 'Where Should We Ship It?' : 'Complete Your Order'}
                </div>

                <div>
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm 
                          amountInCents={amount} 
                          // REMOVED 'isPriceUpdating' TO FIX BUILD ERROR
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
          </div>
          
          <div className="checkout-sidebar">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-6">
              <div className="bg-gray-900 text-white px-6 py-3 font-bold text-lg">What You Get</div>
              <div className="p-6">
                 {hasVideo ? (
                    <div className="mb-6 rounded-lg overflow-hidden shadow-md aspect-video border border-gray-200">
                        <iframe src={videoUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                    </div>
                 ) : (
                    <img src={checkout.image} alt={checkout.productName} className="w-full rounded-lg mb-6 shadow-sm border border-gray-100" />
                 )}
                 <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{checkout.productName}</h3>
                    <p className="text-sm text-gray-500 font-medium">{config.fulfillmentMode === 'physical' ? 'Physical Package' : 'Instant Digital Access'}</p>
                 </div>
                 <div className="bg-gray-50 rounded-lg p-5 mb-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">What's Included:</p>
                    <ul className="space-y-3">
                      {checkout.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 font-bold mr-3">✓</span> 
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-8">
              <div className="bg-gray-900 text-white px-6 py-3 font-bold text-lg">Order Summary</div>
              <div className="p-6">
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                        <span>{checkout.productName}</span>
                        <span className="text-gray-900 font-bold">${(checkout.price / 100).toFixed(2)}</span>
                    </div>
                    {isBumpSelected && (
                        <div className="flex justify-between items-center text-sm font-medium text-green-700">
                            <span>{bump.headline}</span>
                            <span className="font-bold">${(bump.price / 100).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="h-px bg-gray-200 my-4"></div>
                    <div className="flex justify-between items-center text-xl font-extrabold text-gray-900">
                        <span>Total Due</span>
                        <span className="text-green-600">${(amount / 100).toFixed(2)}</span>
                    </div>
                 </div>
                 <div className="flex items-center justify-center mt-6 text-xs text-gray-400 bg-gray-50 py-2 rounded">
                    <span className="mr-2">🔒</span> 256-bit SSL Secure Payment
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}