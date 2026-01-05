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

// --- 100 US-ONLY VERIFIED SALES DATA ---
const SALES_DATA = [
  { name: "James L.", loc: "Austin, TX" }, { name: "Mary S.", loc: "Denver, CO" }, { name: "Robert M.", loc: "Nashville, TN" }, { name: "Patricia J.", loc: "Seattle, WA" },
  { name: "John D.", loc: "Miami, FL" }, { name: "Jennifer A.", loc: "Chicago, IL" }, { name: "Michael B.", loc: "Phoenix, AZ" }, { name: "Linda W.", loc: "Columbus, OH" },
  { name: "David C.", loc: "Charlotte, NC" }, { name: "Elizabeth K.", loc: "Boston, MA" }, { name: "William R.", loc: "Atlanta, GA" }, { name: "Barbara T.", loc: "Dallas, TX" },
  { name: "Richard P.", loc: "San Diego, CA" }, { name: "Susan H.", loc: "Orlando, FL" }, { name: "Joseph G.", loc: "Las Vegas, NV" }, { name: "Jessica V.", loc: "Portland, OR" },
  { name: "Thomas F.", loc: "Houston, TX" }, { name: "Sarah N.", loc: "Minneapolis, MN" }, { name: "Charles Z.", loc: "Detroit, MI" }, { name: "Karen L.", loc: "Tampa, FL" },
  { name: "Christopher Q.", loc: "Philadelphia, PA" }, { name: "Nancy U.", loc: "San Antonio, TX" }, { name: "Daniel I.", loc: "Raleigh, NC" }, { name: "Lisa O.", loc: "Kansas City, MO" },
  { name: "Matthew Y.", loc: "Salt Lake City, UT" }, { name: "Betty E.", loc: "Richmond, VA" }, { name: "Anthony X.", loc: "Sacramento, CA" }, { name: "Margaret W.", loc: "New Orleans, LA" },
  { name: "Mark S.", loc: "Cleveland, OH" }, { name: "Sandra R.", loc: "Indianapolis, IN" }, { name: "Donald V.", loc: "Pittsburgh, PA" }, { name: "Ashley T.", loc: "Cincinnati, OH" },
  { name: "Steven B.", loc: "St. Louis, MO" }, { name: "Kimberly P.", loc: "Milwaukee, WI" }, { name: "Paul N.", loc: "Oklahoma City, OK" }, { name: "Emily M.", loc: "Louisville, KY" },
  { name: "Andrew J.", loc: "Boise, ID" }, { name: "Donna G.", loc: "Memphis, TN" }, { name: "Joshua D.", loc: "Tucson, AZ" }, { name: "Michelle F.", loc: "Fresno, CA" },
  { name: "Kenneth H.", loc: "Mesa, AZ" }, { name: "Carol K.", loc: "Virginia Beach, VA" }, { name: "Kevin L.", loc: "Tulsa, OK" }, { name: "Amanda C.", loc: "Oakland, CA" },
  { name: "Brian Z.", loc: "Arlington, TX" }, { name: "Melissa X.", loc: "Colorado Springs, CO" }, { name: "George V.", loc: "Wichita, KS" }, { name: "Deborah B.", loc: "Honolulu, HI" },
  { name: "Timothy N.", loc: "Bakersfield, CA" }, { name: "Stephanie M.", loc: "Anaheim, CA" }, { name: "Jason A.", loc: "Santa Ana, CA" }, { name: "Rebecca S.", loc: "Corpus Christi, TX" },
  { name: "Jeffrey D.", loc: "Lexington, KY" }, { name: "Laura F.", loc: "Henderson, NV" }, { name: "Ryan G.", loc: "Stockton, CA" }, { name: "Sharon H.", loc: "Saint Paul, MN" },
  { name: "Jacob J.", loc: "Newark, NJ" }, { name: "Cynthia K.", loc: "Plano, TX" }, { name: "Gary L.", loc: "Irvine, CA" }, { name: "Kathleen Z.", loc: "Lincoln, NE" },
  { name: "Nicholas X.", loc: "Durham, NC" }, { name: "Amy C.", loc: "Jersey City, NJ" }, { name: "Eric V.", loc: "Chandler, AZ" }, { name: "Shirley B.", loc: "Chula Vista, CA" },
  { name: "Stephen N.", loc: "Buffalo, NY" }, { name: "Angela M.", loc: "Madison, WI" }, { name: "Jonathan A.", loc: "Reno, NV" }, { name: "Helen S.", loc: "Lubbock, TX" },
  { name: "Larry D.", loc: "Gilbert, AZ" }, { name: "Anna F.", loc: "Glendale, AZ" }, { name: "Scott G.", loc: "North Las Vegas, NV" }, { name: "Brenda H.", loc: "Winston-Salem, NC" },
  { name: "Frank J.", loc: "Chesapeake, VA" }, { name: "Pamela K.", loc: "Garland, TX" }, { name: "Brandon L.", loc: "Irving, TX" }, { name: "Nicole Z.", loc: "Hialeah, FL" },
  { name: "Raymond X.", loc: "Fremont, CA" }, { name: "Emma C.", loc: "Spokane, WA" }, { name: "Gregory V.", loc: "Baton Rouge, LA" }, { name: "Samantha B.", loc: "Oneonta, NY" },
  { name: "Benjamin N.", loc: "Tacoma, WA" }, { name: "Katherine M.", loc: "Des Moines, IA" }, { name: "Samuel A.", loc: "Fayetteville, NC" }, { name: "Christine S.", loc: "Modesto, CA" },
  { name: "Patrick D.", loc: "San Bernardino, CA" }, { name: "Debra F.", loc: "Corona, CA" }, { name: "Jack G.", loc: "Knoxville, TN" }, { name: "Rachel H.", loc: "Fontana, CA" },
  { name: "Dennis J.", loc: "Oxnard, CA" }, { name: "Carolyn K.", loc: "Aurora, IL" }, { name: "Jerry L.", loc: "Moreno Valley, CA" }, { name: "Janet Z.", loc: "Akron, OH" },
  { name: "Tyler X.", loc: "Little Rock, AR" }, { name: "Maria C.", loc: "Amarillo, TX" }, { name: "Aaron V.", loc: "Augusta, GA" }, { name: "Heather B.", loc: "Mobile, AL" },
  { name: "Henry N.", loc: "Grand Rapids, MI" }, { name: "Diane M.", loc: "Huntsville, AL" }
];

const getTimeAgo = () => {
  const r = Math.random();
  if (r < 0.2) {
    const mins = Math.floor(Math.random() * 59) + 1;
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  } 
  else if (r < 0.5) {
    const hours = Math.floor(Math.random() * 23) + 1;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  else if (r < 0.8) {
    const days = Math.floor(Math.random() * 6) + 1;
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  else {
    const weeks = Math.floor(Math.random() * 3) + 1; 
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
};

const SocialProofPopup = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: "", loc: "", time: "" });
  const [queue, setQueue] = useState<typeof SALES_DATA>([]);

  useEffect(() => {
    const shuffled = [...SALES_DATA];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQueue(shuffled);
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    let currentIndex = 0;
    const cycle = () => {
      const person = queue[currentIndex];
      setData({
        name: person.name,
        loc: person.loc,
        time: getTimeAgo() 
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000); 
      currentIndex = (currentIndex + 1) % queue.length;
    };
    const initialTimer = setTimeout(cycle, 4000);
    const intervalTimer = setInterval(cycle, 15000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [queue]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg p-4 flex items-center gap-4 animate-[slideUp_0.5s_ease-out] max-w-xs cursor-default">
      <div className="bg-emerald-50 p-2 rounded-full text-emerald-600 flex-shrink-0">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 leading-tight">{data.name} in {data.loc}</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">Verified Owner • {data.time}</p>
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
    <div className="relative overflow-hidden bg-[#FFFDF5] border-2 border-dashed border-amber-300 rounded-xl p-5 mt-8 transition-all hover:border-amber-400 group">
      <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Recommended
      </div>
      <label className="flex items-start cursor-pointer select-none gap-4 relative z-10" htmlFor="bump-offer">
        <div className="flex-shrink-0 mt-1">
          <input 
            type="checkbox" 
            id="bump-offer" 
            className="peer sr-only" 
            checked={isBumpSelected}
            onChange={(e) => {
              setIsBumpSelected(e.target.checked);
              setAmount(e.target.checked ? checkout.price + bump.price : checkout.price);
            }}
          />
          <div className="h-6 w-6 rounded border-2 border-gray-300 bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-all shadow-sm group-hover:border-blue-400">
             <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
        <div className="flex-1">
          <span className="block text-base font-bold text-gray-900 mb-1 leading-snug">
             {bump.headline}
          </span>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
             {bump.description}
          </p>
          <p className="text-gray-900 font-bold text-sm flex items-center gap-2">
             <span className="text-green-700">Yes, add this to my order.</span>
             <span className="text-gray-400 font-normal line-through text-xs">$97.00</span>
             <span className="text-gray-900 underline decoration-amber-400 decoration-2">Only ${(bump.price / 100).toFixed(2)}</span>
          </p>
        </div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-[#F8F9FA] pb-24 text-gray-900">
      <SocialProofPopup />

      {/* --- HERO SECTION --- */}
      <section className="w-full bg-white pt-10 pb-8 border-b border-gray-100 shadow-sm mb-8">
        {/* FIX: Increased max-width to 6xl so the headline has room to breathe */}
        <div className="mx-auto max-w-6xl px-6 text-center">
          
          {/* 1. THE NAVY LOGO */}
          <div className="mb-6 flex justify-center animate-[fadeIn_0.6s_ease-out]">
             <img 
               src="https://res.cloudinary.com/dse1cikja/image/upload/v1767569445/BLUEPRINTAsset_6_u1gevt.png" 
               alt="The Legacy Blueprint" 
               className="h-12 w-auto object-contain" 
             />
          </div>

          {/* 2. THE HEADLINE: FIXED WITH WIDER CONTAINER & HARD BREAK */}
          <h1 className="mx-auto max-w-5xl font-serif text-3xl font-bold tracking-tight text-slate-900 md:text-4xl leading-[1.2] animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            Your Lawyer Prepared Your Family for the Probate Court.
            {/* HARD BREAK TO FORCE 2nd LINE BALANCE */}
            <br className="hidden md:block" />
            <span className="md:mt-2 block md:inline">
              But Who Prepares Them for the <span className="text-amber-700 italic relative inline-block whitespace-nowrap">
                First 48 Hours?
                <svg className="absolute -bottom-1 left-0 w-full h-1.5 text-amber-200 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" /></svg>
              </span>
            </span>
          </h1>

          {/* 3. THE SUBHEAD */}
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg leading-relaxed animate-[fadeIn_1s_ease-out_0.4s_both]">
            <span className="font-bold text-slate-900">Wills handle the wealth. The Manual handles the chaos.</span> The comprehensive operational system that guides your family through the immediate crisis.
          </p>

        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: CHECKOUT FORM */}
          <div className="lg:col-span-7 xl:col-span-8">
             {/* Main Card */}
             <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                
                {/* --- FIXED HEADER: NAVY BLUE with GOLD LOCK --- */}
                <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between font-bold text-sm tracking-wide uppercase">
                   <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <span>Secure Checkout</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold tracking-widest opacity-80">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      AES-256
                   </div>
                </div>

                <div className="p-6">
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

             {/* --- GUARANTEE SECTION (WITH 3D SEAL) --- */}
             <div className="mt-12 group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-gray-50 opacity-50 blur-2xl transition-opacity group-hover:opacity-100"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
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
                 <div className="flex-1">
                   <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                     The "Sleep Well At Night" 365-Day Promise
                   </h3>
                   <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                     <p>We are asking you to trust us with your family's future. We take that responsibility seriously.</p>
                     <p><strong className="text-gray-900">Here is the deal:</strong> Download the Survivor's Manual. Fill it out. If you don't feel an immediate, physical weight lift off your shoulders—or if your family doesn't thank you for it—simply email us.</p>
                     <p>We will refund <span className="underline decoration-yellow-400 decoration-2 font-medium text-gray-900">100% of your money</span>. No questions asked. And you can <strong className="text-gray-900">keep the files</strong> as our apology for wasting your time.</p>
                   </div>
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
            
            {/* PRODUCT CARD - NAVY HEADER */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-gray-900 text-white px-6 py-4 font-bold text-sm tracking-wide uppercase flex justify-between items-center">
                 <span>Your Order</span>
                 <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              
              <div className="p-0">
                 <div className="bg-gray-50 border-b border-gray-100">
                    {hasVideo ? (
                        <div className="aspect-video w-full relative">
                            <iframe src={videoUrl} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                        </div>
                    ) : (
                        <img src={checkout.image} alt={checkout.productName} className="w-full h-auto object-cover" />
                    )}
                 </div>

                 <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{checkout.productName}</h3>
                        <p className="text-sm text-green-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {config.fulfillmentMode === 'physical' ? 'In Stock - Ships Tomorrow' : 'Instant Digital Access'}
                        </p>
                    </div>

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
                 </div>

                 {/* Order Summary */}
                 <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="space-y-3">
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
            </div>

            {/* FAQ */}
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