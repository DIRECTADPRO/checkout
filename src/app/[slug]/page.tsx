import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { getProductFromStrapi } from '@/lib/strapi';
import { getProduct as getStaticProduct } from '@/lib/products';

// Force dynamic rendering so it always checks for the latest data
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch Live Data (Strapi)
  let product = await getProductFromStrapi(slug);

  // 2. Fallback to Local File System (The "Tank" Method)
  // If Strapi is down or product is missing, we use the local file.
  if (!product) {
    product = getStaticProduct(slug) ?? null;
  }

  // 3. If still missing, show 404
  if (!product) {
    return notFound();
  }

  // 4. Render the Page
  return <CheckoutClient product={product} />;
}
