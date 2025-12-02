// FILE: src/lib/strapi.ts
import { ProductConfig } from './products';

interface StrapiProductResponse {
  id: number;
  attributes: {
    slug: string;
    name: string;
    isActive: boolean;
    theme: ProductConfig['theme'];
    checkout: ProductConfig['checkout'];
    bump: ProductConfig['bump'];
    oto: ProductConfig['oto'];
  };
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://137.184.188.99';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function getProductFromStrapi(slug: string): Promise<ProductConfig | null> {
  if (!STRAPI_TOKEN) {
    console.error("CRITICAL: STRAPI_API_TOKEN is missing in .env.local");
    return null;
  }

  try {
    // FIXED: Use standard Strapi LHS Bracket Syntax for nested population.
    // This ensures all the nested components (features, theme, etc.) are actually returned.
    const query = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate[theme][populate]': '*',
      'populate[checkout][populate][features]': '*',
      'populate[bump][populate]': '*',
      'populate[oto][populate][features]': '*',
    }).toString();

    // INCREASED TIMEOUT: Set to 15 seconds to allow the server time to wake up/respond
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${STRAPI_URL}/api/products?${query}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Strapi Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    const item = json.data?.[0] as StrapiProductResponse;

    if (!item) {
      console.warn(`Product not found in Strapi for slug: ${slug}`);
      return null;
    }

    // Transform Strapi Data -> Your App's ProductConfig Format
    return {
      id: item.attributes.slug,
      theme: item.attributes.theme,
      checkout: {
        ...item.attributes.checkout,
        // Safely map features array to simple strings
        features: item.attributes.checkout.features.map((f: any) => f.text || f),
      },
      bump: item.attributes.bump,
      oto: {
        ...item.attributes.oto,
        features: item.attributes.oto.features.map((f: any) => f.text || f),
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