// FILE: src/lib/strapi.ts
import { ProductConfig } from './products';

// Updated Interface for Strapi v5 (No 'attributes' nesting)
interface StrapiProductResponse {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  isActive: boolean;
  theme: ProductConfig['theme'];
  checkout: ProductConfig['checkout'];
  bump: ProductConfig['bump'];
  oto: ProductConfig['oto'];
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://137.184.188.99';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function getProductFromStrapi(slug: string): Promise<ProductConfig | null> {
  if (!STRAPI_TOKEN) {
    console.error("CRITICAL: STRAPI_API_TOKEN is missing in .env.local");
    return null;
  }

  try {
    const query = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate[theme][populate]': '*',
      'populate[checkout][populate][features]': '*',
      'populate[bump][populate]': '*',
      'populate[oto][populate][features]': '*',
    }).toString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${STRAPI_URL}/api/products?${query}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Strapi Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    
    // V5 CHANGE: Data is direct, not in 'attributes'
    const item = json.data?.[0] as StrapiProductResponse;

    if (!item) {
      console.warn(`Product not found in Strapi for slug: ${slug}`);
      return null;
    }

    // Transform Strapi Data -> Your App's ProductConfig Format
    // Removed '.attributes' from all paths below
    return {
      id: item.slug,
      theme: item.theme,
      checkout: {
        ...item.checkout,
        // Safely map features array to simple strings
        features: item.checkout.features.map((f: any) => f.text || f),
      },
      bump: item.bump,
      oto: {
        ...item.oto,
        features: item.oto.features.map((f: any) => f.text || f),
      },
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("❌ Strapi Request Timed Out (took longer than 15s)");
    } else {
      console.error("Failed to fetch product from Strapi:", error);
    }
    return null;
  }
}