/* FILE: src/app/[slug]/page.tsx */
import React from 'react';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { getProductFromStrapi } from '@/lib/strapi'; // <--- Imports your new bridge
import { getProduct as getStaticProduct } from '@/lib/products'; // Keeps the old way as a backup

// This function decides where to get the data
async function getProductData(slug: string) {
  // 1. First, try to ask your Live Database (Strapi)
  console.log(`🔍 Attempting to fetch ${slug} from Strapi...`);
  const strapiProduct = await getProductFromStrapi(slug);
  
  if (strapiProduct) {
    console.log(`✅ SUCCESS: Loaded ${slug} directly from Strapi!`);
    return strapiProduct;
  }

  // 2. If Strapi is down or empty, use the file on your computer (Safety Net)
  console.log(`⚠️ Strapi returned nothing for ${slug}. Falling back to local static file.`);
  return getStaticProduct(slug);
}

export default async function DynamicCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Run the logic above
  const product = await getProductData(slug);

  if (!product) {
    return notFound();
  }

  return <CheckoutClient product={product} />;
}