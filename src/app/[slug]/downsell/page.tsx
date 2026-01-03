import React from 'react';
import { notFound } from 'next/navigation';
import DownsellClient from './DownsellClient';
import { getProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function DownsellPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // THE TANK: Direct local fetch only
  const product = getProduct(slug);

  if (!product) {
    return notFound();
  }

  return <DownsellClient product={product} />;
}
