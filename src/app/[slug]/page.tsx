import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { getProduct } from '@/lib/products/index'; 

// Force dynamic rendering so it always checks the file
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { slug: string } }) {
  
  // 1. Fetch from Local File System (The "Tank" Method)
  const product = getProduct(params.slug);

  // 2. If no file exists, show 404
  if (!product) {
    return notFound();
  }

  // 3. Render the Page
  return <CheckoutClient product={product} />;
}