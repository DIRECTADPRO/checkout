/* FILE: src/app/[slug]/downsell/page.tsx */
import React from 'react';
import { notFound } from 'next/navigation';
import DownsellClient from './DownsellClient';
import { getProductFromStrapi } from '@/lib/strapi';
import { getProduct as getStaticProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function DownsellPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Fetch Live Data from Strapi
  let product = await getProductFromStrapi(slug);

  // 2. Fallback to Static Data if Strapi fails
  if (!product) {
    // FIX APPLIED: We force 'undefined' to become 'null' so TypeScript accepts it.
    product = getStaticProduct(slug) ?? null;
  }

  if (!product) {
    return notFound();
  }

  return <DownsellClient product={product} />;
}