/* FILE: src/app/[slug]/downsell/page.tsx */
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import '@/styles/checkout-design.css'; // Shared Design System

export default function DownsellPage() {
    const router = useRouter();
    const params = useParams(); // Get slug from URL
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        const paymentIntentId = searchParams?.get('payment_intent');
        if (!paymentIntentId) return;

        setLoading(true);
        try {
            // Call API with type='downsell'
            const res = await fetch('/api/purchase-upsell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    originalPaymentIntentId: paymentIntentId,
                    type: 'downsell' // <--- CRITICAL: Tells API to charge the lower price
                })
            });
            if (!res.ok) throw new Error("Payment failed");
            
            // Redirect to the VIP Dashboard
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
            <div className="card relative" style={{ maxWidth: '600px', width: '100%', padding: '40px' }}>
                
                {/* Floating Badge */}
                <div className="card-header-pill" style={{backgroundColor: '#F59E0B', top: '-20px'}}>
                   WAIT! ONE LAST CHANCE...
                </div>

                <div style={{textAlign: 'center', marginTop: '10px'}}>
                    <h1 style={{fontSize: '28px', fontWeight: '800', color: '#111827', lineHeight: '1.2', marginBottom: '15px'}}>
                        Is $147 too much right now?
                    </h1>
                    
                    <p style={{fontSize: '16px', color: '#6B7280', lineHeight: '1.6', marginBottom: '25px'}}>
                        I understand. But I don't want you to leave empty-handed and stuck in the "Spam Folder."
                        <br/><br/>
                        Get the <strong>"DIY Audit Checklist"</strong> (The exact PDF I use to audit clients) without the personal video review.
                    </p>

                    {/* Price Box */}
                    <div style={{backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB', marginBottom: '25px'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
                            <span style={{fontSize: '18px', color: '#9CA3AF', textDecoration: 'line-through'}}>$97.00</span>
                            <span style={{fontSize: '32px', fontWeight: '800', color: '#059669'}}>$37.00</span>
                        </div>
                        <p style={{fontSize: '13px', color: '#6B7280', marginTop: '5px'}}>One-time payment. Instant Access.</p>
                    </div>

                    <button 
                        onClick={handleAccept}
                        disabled={loading}
                        className="cta-button"
                        style={{
                            backgroundColor: '#059669', // Green for "Go"
                            boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.39)'
                        }}
                    >
                        {loading ? "Processing..." : "Yes! Add the $37 Checklist"}
                    </button>
                    
                    <div style={{marginTop: '20px'}}>
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="text-sm text-gray-400 hover:text-gray-600 underline bg-transparent border-0 cursor-pointer"
                        >
                            No thanks, I'll figure it out myself.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}