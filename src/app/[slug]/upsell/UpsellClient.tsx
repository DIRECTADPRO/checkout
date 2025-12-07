/* FILE: src/app/[slug]/upsell/UpsellClient.tsx */
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { ProductConfig } from '@/lib/products';

// --- BACKGROUND & PROGRESS ---
const DynamicBackground = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#F9FAFB', overflow: 'hidden' }}>
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes float { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-50px) scale(1.1); } 66% { transform: translate(-20px,20px) scale(0.9); } 100% { transform: translate(0,0) scale(1); } }
            @keyframes float-delayed { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(-30px,50px) scale(1.1); } 66% { transform: translate(20px,-20px) scale(0.9); } 100% { transform: translate(0,0) scale(1); } }
            @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
        `}} />
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(106,69,255,0.15) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(60px)', borderRadius: '50%', animation: 'float 20s infinite ease-in-out' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(5,150,105,0.1) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(80px)', borderRadius: '50%', animation: 'float-delayed 25s infinite ease-in-out' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
);

const ProgressBar = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: '#064E3B', letterSpacing: '-0.01em', marginTop: '6px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
        <span style={{ color: '#059669', fontWeight: '900', fontSize: '12px' }}>✓</span> 
        <span>Checkout</span>
    </div>
    <div style={{ width: '15px', height: '2px', backgroundColor: '#10B981', opacity: 0.4 }}></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#6A45FF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 0 0 2px rgba(106, 69, 255, 0.2)' }}>2</div>
        <span style={{ color: '#6A45FF', fontWeight: '800' }}>Special Offer</span>
    </div>
    <div style={{ width: '15px', height: '2px', backgroundColor: '#10B981', opacity: 0.4 }}></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.5 }}>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#064E3B', fontWeight: '700' }}>3</div>
        <span>Access</span>
    </div>
  </div>
);

export default function UpsellClient({ product }: { product: ProductConfig }) {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const { oto } = product;

    const handleAccept = async () => {
        const paymentIntentId = searchParams?.get('payment_intent');
        if (!paymentIntentId) {
            alert("Order session expired. Please contact support.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/purchase-upsell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    originalPaymentIntentId: paymentIntentId,
                    type: 'oto'
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Payment failed");
            router.push('/dashboard'); 
        } catch (err: any) {
            alert(err.message);
            setLoading(false);
        }
    };

    const handleDecline = () => {
        const paymentIntent = searchParams?.get('payment_intent');
        const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
        router.push(`/${slug}/downsell?payment_intent=${paymentIntent}`);
    };

    return (
        <>
        <DynamicBackground />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative', zIndex: 1 }}>
            
            <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                
                <div style={{ backgroundColor: '#ECFDF5', padding: '10px', textAlign: 'center', borderBottom: '1px solid #10B981' }}>
                    <p style={{ color: '#065F46', fontWeight: '800', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                        ⚠️ Wait! Your Order Is Not Quite Complete...
                    </p>
                    <ProgressBar />
                </div>

                <div style={{ padding: '20px 30px' }}>
                    
                    <h1 style={{ fontSize: '26px', fontWeight: '800', textAlign: 'center', lineHeight: '1.2', color: '#111827', marginBottom: '6px', marginTop: '0' }}>
                        {oto.headline}
                    </h1>
                    
                    <p style={{ textAlign: 'center', fontSize: '15px', color: '#4B5563', marginBottom: '15px', lineHeight: '1.4' }}>
                        This is a one-time offer available only on this page. <span style={{color: '#EF4444', fontWeight: '700', backgroundColor: '#FEF2F2', padding: '0 4px', borderRadius: '2px'}}>Do not close this window.</span>
                    </p>

                    {/* VSL PLACEHOLDER */}
                    <div style={{ 
                        width: '100%', aspectRatio: '16/9', 
                        background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', 
                        borderRadius: '12px', marginBottom: '25px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)', overflow: 'hidden'
                    }}>
                        {oto.videoEmbedUrl ? (
                             <iframe src={oto.videoEmbedUrl} style={{width: '100%', height: '100%', border: 'none'}} allow="autoplay; fullscreen" />
                        ) : (
                            <>
                                <div style={{ 
                                    position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', 
                                    backgroundColor: 'rgba(255,255,255,0.2)', animation: 'pulse-ring 2s infinite' 
                                }} />
                                <div style={{ 
                                    zIndex: 2, width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{ 
                                        width: 0, height: 0, 
                                        borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #111827', 
                                        marginLeft: '4px' 
                                    }} />
                                </div>
                                <p style={{ position: 'absolute', bottom: '15px', color: 'white', fontSize: '12px', fontWeight: '600', opacity: 0.8, letterSpacing: '0.05em' }}>
                                    {oto.videoPlaceholder || "WATCH PRESENTATION"}
                                </p>
                            </>
                        )}
                    </div>

                    {/* --- VALUE STACK --- */}
                    <div style={{ border: '1px solid #D1D5DB', borderRadius: '12px', padding: '0', backgroundColor: '#F9FAFB', marginBottom: '25px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ padding: '20px 20px 15px 20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '15px', textAlign: 'center' }}>
                                Upgrade to the &quot;Full Execution System&quot;
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '10px' }}>
                                {oto.features.map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#374151' }}>
                                        <span style={{ color: '#059669', fontSize: '16px', fontWeight: 'bold' }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* PRICE STRIP */}
                        <div style={{ backgroundColor: '#ECFDF5', padding: '15px 20px', borderTop: '1px solid #D1D5DB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '13px', color: '#047857', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>
                                    TOTAL VALUE: <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>$688</span>
                                </p>
                                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                                    System Price: <span style={{ textDecoration: 'line-through' }}>${(oto.retailPrice / 100).toFixed(2)}</span>
                                </p>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '11px', color: '#059669', fontWeight: '700', marginBottom: '2px', backgroundColor: 'white', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', border: '1px solid #A7F3D0' }}>
                                    New Member Discount!
                                </p>
                                <p style={{ fontSize: '32px', fontWeight: '800', color: '#047857', letterSpacing: '-0.02em', lineHeight: '1' }}>
                                    Only ${(oto.price / 100).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* ATTACHED ACTION BUTTON (No Radius) */}
                        <button 
                            onClick={handleAccept}
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(to bottom, #059669, #047857)',
                                color: 'white',
                                padding: '24px', 
                                fontSize: '24px',
                                fontWeight: '900',
                                letterSpacing: '0.02em',
                                border: 'none',
                                borderRadius: '0', // Square corners attach it to the card above
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                opacity: loading ? 0.8 : 1,
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                        >
                            {loading ? "Processing..." : `YES! Add This To My Order ($${(oto.price/100).toFixed(0)})`}
                        </button>
                    </div>

                    {/* LINKS BELOW (Corrected Order) */}
                    <div style={{ textAlign: 'center' }}>
                        {/* 1. No Thanks */}
                        <button 
                            onClick={handleDecline}
                            disabled={loading}
                            style={{
                                background: 'none', border: 'none', color: '#6B7280',
                                fontSize: '14px', textDecoration: 'underline', cursor: 'pointer', opacity: 0.8,
                                marginBottom: '20px', display: 'inline-block'
                            }}
                        >
                            No thanks, I don&apos;t want to scale my results. I&apos;ll stick with the basics.
                        </button>

                        {/* 2. Security Badge */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#9CA3AF' }}>
                            <span>🔒</span> 256-bit SSL Secure • 30-Day Money-Back Guarantee
                        </div>
                    </div>

                </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px', color: '#9CA3AF', fontSize: '11px' }}>
                Copyright © 2025 Ready Set Focus LLC. All Rights Reserved.
            </div>

        </div>
        </>
    );
}