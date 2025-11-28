/* FILE: src/app/[slug]/success/page.tsx */
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
// Using relative path to ensure it finds the file without alias config issues
import { getProduct } from '@/lib/products'; 

interface DynamicBackgroundProps {
    color: string;
}

// FIX: Switched from <style jsx> to dangerouslySetInnerHTML to resolve TypeScript error
const DynamicBackground = ({ color }: DynamicBackgroundProps) => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: color, overflow: 'hidden' }}>
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes float { 
                0% { transform: translate(0,0); } 
                50% { transform: translate(20px,-20px); } 
                100% { transform: translate(0,0); } 
            }
        `}} />
        <div style={{ 
            position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', 
            background: 'radial-gradient(circle, rgba(106,69,255,0.1) 0%, rgba(255,255,255,0) 70%)', 
            filter: 'blur(60px)', borderRadius: '50%', animation: 'float 15s infinite ease-in-out' 
        }} />
    </div>
);

export default function DynamicSuccessPage() {
    // Robust way to get params in Client Components
    const params = useParams();
    const slug = typeof params?.slug === 'string' ? params.slug : 'email-bundle';
    
    // Fail-safe: default to first product if slug is missing during initial render
    const product = getProduct(slug); 
    const { theme, checkout } = product;

    return (
        <>
        <DynamicBackground color={theme.backgroundColor} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', maxWidth: '500px', width: '100%' }}>
                
                <div style={{ width: '80px', height: '80px', backgroundColor: theme.primaryColor + '11', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                    <span style={{ fontSize: '40px', color: theme.primaryColor }}>✓</span>
                </div>
                
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>Order Confirmed!</h1>
                <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6', marginBottom: '30px' }}>
                    Your access to the **{checkout.productName}** system is now complete. Your receipt and login details have been sent to your email.
                </p>

                <div style={{ padding: '15px', backgroundColor: '#F3F4F6', borderRadius: '8px', marginBottom: '30px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>Order ID: #882910-XJ</p>
                </div>

                <button style={{ backgroundColor: theme.accentColor, color: 'white', padding: '14px 28px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', width: '100%' }}>
                    Access Member Area Now
                </button>
            </div>

        </div>
        </>
    );
}