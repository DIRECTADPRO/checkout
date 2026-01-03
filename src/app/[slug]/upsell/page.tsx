import React from 'react';
import { notFound } from 'next/navigation';
import UpsellClient from './UpsellClient';
import { getProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function UpsellPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // THE TANK: Direct local fetch only
  const product = getProduct(slug);

  if (!product) {
    return notFound();
  }

  return <UpsellClient product={product} />;
}
