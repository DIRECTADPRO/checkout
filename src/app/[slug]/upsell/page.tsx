/* FILE: src/app/[slug]/upsell/page.tsx */
import React from 'react';
import { notFound } from 'next/navigation';
import UpsellClient from './UpsellClient';
import { getProductFromStrapi } from '@/lib/strapi';
import { getProduct as getStaticProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function UpsellPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch Live Data
  let product = await getProductFromStrapi(slug);

  // 2. Fallback
  if (!product) {
    product = getStaticProduct(slug); null;
  }

  if (!product) {
    return notFound();
  }

  return <UpsellClient product={product} />;
}
