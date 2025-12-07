/* FILE: src/app/[slug]/downsell/DownsellClient.tsx */
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductConfig } from '@/lib/products';
import '@/styles/checkout-design.css';

export default function DownsellClient({ product }: { product: ProductConfig }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    
    const downsell = product.downsell || {
        headline: "Wait! One Last Chance...",
        description: "Get the 'Lite' version instead.",
        price: 3700,
        stripePriceId: "",
        deliveryUrl: ""
    };

    const handleAccept = async () => {
        const paymentIntentId = searchParams?.get('payment_intent');
        if (!paymentIntentId) return;

        setLoading(true);
        try {
            const res = await fetch('/api/purchase-upsell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    originalPaymentIntentId: paymentIntentId,
                    type: 'downsell' 
                })
            });
            
            if (!res.ok) throw new Error("Payment failed");
            router.push('/dashboard'); 
        } catch (err) {
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen font-sans text-gray-900"
            style={{
                background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f4f6 80%, #e5e7eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <div className="card relative" style={{ maxWidth: '600px', width: '100%', padding: '0', overflow: 'hidden', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                
                {/* Yellow Warning Header */}
                <div style={{backgroundColor: '#FFFBEB', padding: '15px', textAlign: 'center', borderBottom: '1px solid #FCD34D'}}>
                    <p style={{color: '#92400E', fontWeight: '800', fontSize: '14px', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase'}}>
                        ⚠️ Wait! One Last Chance...
                    </p>
                </div>

                <div style={{padding: '40px 30px', backgroundColor: 'white'}}>
                    <h1 style={{fontSize: '32px', fontWeight: '800', color: '#111827', lineHeight: '1.2', marginBottom: '15px', textAlign: 'center'}}>
                        {downsell.headline}
                    </h1>
                    
                    <p style={{fontSize: '16px', color: '#6B7280', lineHeight: '1.6', marginBottom: '30px', textAlign: 'center'}}>
                        {downsell.description}
                    </p>

                    {/* --- SEAMLESS OFFER CARD (ATTACHED BUTTON) --- */}
                    <div style={{ border: '1px solid #D1D5DB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        
                        <div style={{ padding: '25px', backgroundColor: '#F9FAFB' }}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <div style={{width: '50px', height: '50px', background: '#E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'}}>📄</div>
                                <div>
                                    <h3 style={{fontWeight: 'bold', color: '#111827', fontSize: '16px'}}>DIY Audit Checklist</h3>
                                    <p style={{fontSize: '13px', color: '#6B7280'}}>The exact PDF framework I use.</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Strip */}
                        <div style={{ backgroundColor: '#ECFDF5', padding: '15px 25px', borderTop: '1px solid #D1D5DB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{fontSize: '18px', color: '#9CA3AF', textDecoration: 'line-through', marginRight: '10px'}}>$97.00</span>
                                <span style={{fontSize: '12px', fontWeight: 'bold', color: '#059669', backgroundColor: 'white', padding: '2px 8px', borderRadius: '10px', border: '1px solid #A7F3D0'}}>SAVE 62%</span>
                            </div>
                            <div style={{fontSize: '32px', fontWeight: '800', color: '#059669'}}>${(downsell.price / 100).toFixed(0)}</div>
                        </div>

                        {/* ATTACHED BUTTON */}
                        <button 
                            onClick={handleAccept}
                            disabled={loading}
                            className="cta-button"
                            style={{
                                width: '100%',
                                backgroundColor: '#059669',
                                color: 'white',
                                padding: '24px',
                                fontSize: '22px',
                                fontWeight: '900',
                                letterSpacing: '0.02em',
                                border: 'none',
                                borderRadius: '0', // Square corners
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                        >
                            {loading ? "Processing..." : `Yes! Add The Checklist ($${(downsell.price/100).toFixed(0)})`}
                        </button>
                    </div>

                    {/* LINKS BELOW */}
                    <div style={{marginTop: '25px', textAlign: 'center'}}>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="text-sm text-gray-400 hover:text-gray-600 underline bg-transparent border-0 cursor-pointer"
                        >
                            No thanks, I'll figure it out myself.
                        </button>
                        
                        <div style={{marginTop: '15px', fontSize: '11px', color: '#D1D5DB', display: 'flex', justifyContent: 'center', gap: '5px'}}>
                            <span>🔒</span> 256-bit SSL Secure
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}