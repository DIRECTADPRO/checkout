import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { getProduct } from '@/lib/products'; 

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // THE TANK: Direct local fetch only. No Strapi.
  const product = getProduct(slug);

  if (!product) {
    return notFound();
  }

  return <CheckoutClient product={product} />;
}
