/* FILE: src/app/[slug]/page.tsx */
import React from 'react';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { getProductFromStrapi } from '@/lib/strapi'; // <--- The new bridge
import { getProduct as getStaticProduct } from '@/lib/products'; // Fallback

// This function tells Next.js to fetch data before rendering the page
async function getProductData(slug: string) {
  // 1. Try to get data from your Live Database (Strapi)
  const strapiProduct = await getProductFromStrapi(slug);
  
  if (strapiProduct) {
    console.log(`✅ Loaded product from Strapi: ${slug}`);
    return strapiProduct;
  }

  // 2. Fallback to static file if Strapi is down or empty (Safety Net)
  console.log(`⚠️ Strapi product not found, falling back to static file: ${slug}`);
  return getStaticProduct(slug);
}

export default async function DynamicCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params object (Next.js 15 requirement)
  const { slug } = await params;

  // Fetch the real data
  const product = await getProductData(slug);

  if (!product) {
    return notFound();
  }

  // Pass the data to your Client Component
  return <CheckoutClient product={product} />;
}