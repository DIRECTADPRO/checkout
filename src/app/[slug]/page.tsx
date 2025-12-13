/* FILE: src/app/[slug]/page.tsx */
import React from 'react';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { getProductFromStrapi } from '@/lib/strapi';
import { getProduct as getStaticProduct } from '@/lib/products';

// CRITICAL: Force this page to always be dynamic (No caching)
export const dynamic = 'force-dynamic';

async function getProductData(slug: string) {
  // 1. Try to fetch from Strapi (The Live Database)
  console.log(`🔍 Checking Strapi for: ${slug}...`);
  const strapiProduct = await getProductFromStrapi(slug);
  
  if (strapiProduct) {
    // 2. SUCCESS LOGS (The "Magic Switch" Confirmation)
    // We explicitly log the funnel mode so you can verify it in your terminal
    const activeMode = strapiProduct.checkout.funnelType || 'digital_product (default)';
    
    console.log(`✅ SUCCESS: Using Strapi Data.`);
    console.log(`🔀 Active Funnel Mode: [ ${activeMode} ]`); // <--- NEW DEBUG LOG
    console.log(`💰 Live Price: $${strapiProduct.checkout.price / 100}`); 
    
    return strapiProduct;
  }

  // 3. Fallback to Static File (Safety Net)
  console.log(`⚠️ Strapi failed or returned null. Using Static Fallback.`);
  const staticProduct = getStaticProduct(slug);
  
  console.log(`🔒 Static Price: $${staticProduct.checkout.price / 100}`);
  return staticProduct;
}

export default async function DynamicCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProductData(slug);

  if (!product) {
    return notFound();
  }

  return <CheckoutClient product={product} />;
}