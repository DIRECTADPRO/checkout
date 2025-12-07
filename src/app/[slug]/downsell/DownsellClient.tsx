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
    
    // Safety check: Use Strapi data if available, otherwise fallback
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
            // Call API with type='downsell' to charge the lower price ($37)
            const res = await fetch('/api/purchase-upsell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    originalPaymentIntentId: paymentIntentId,
                    type: 'downsell' 
                })
            });
            
            if (!res.ok) throw new Error("Payment failed");
            
            // Redirect to Success/Dashboard
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

                <div style={{padding: '40px', textAlign: 'center', backgroundColor: 'white'}}>
                    <h1 style={{fontSize: '32px', fontWeight: '800', color: '#111827', lineHeight: '1.2', marginBottom: '15px'}}>
                        {downsell.headline}
                    </h1>
                    
                    <p style={{fontSize: '16px', color: '#6B7280', lineHeight: '1.6', marginBottom: '30px'}}>
                        {downsell.description}
                    </p>

                    {/* Price Box */}
                    <div style={{backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '25px', border: '1px solid #E5E7EB', marginBottom: '30px'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
                            <span style={{fontSize: '20px', color: '#9CA3AF', textDecoration: 'line-through'}}>$97.00</span>
                            <span style={{fontSize: '42px', fontWeight: '800', color: '#059669'}}>${(downsell.price / 100).toFixed(0)}</span>
                        </div>
                        <p style={{fontSize: '13px', color: '#6B7280', marginTop: '5px', fontWeight: '500'}}>One-time payment. Instant Access.</p>
                    </div>

                    <button 
                        onClick={handleAccept}
                        disabled={loading}
                        className="cta-button"
                        style={{
                            backgroundColor: '#059669',
                            boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.39)',
                            fontSize: '20px',
                            padding: '20px',
                            width: '100%',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? "Processing..." : `Yes! Add This To My Order ($${(downsell.price/100).toFixed(0)})`}
                    </button>
                    
                    <div style={{marginTop: '25px'}}>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="text-sm text-gray-400 hover:text-gray-600 underline bg-transparent border-0 cursor-pointer transition"
                        >
                            No thanks, I'll figure it out myself.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}