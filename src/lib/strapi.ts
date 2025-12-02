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
    // FIXED: Use standard Strapi LHS Bracket Syntax for nested population
    const query = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate[theme][populate]': '*',
      'populate[checkout][populate][features]': '*',
      'populate[bump][populate]': '*',
      'populate[oto][populate][features]': '*',
    }).toString();

    // Added AbortSignal to prevent hanging forever (5 second timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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
    const item = json.data?.[0] as StrapiProductResponse;

    if (!item) return null;

    return {
      id: item.attributes.slug,
      theme: item.attributes.theme,
      checkout: {
        ...item.attributes.checkout,
        features: item.attributes.checkout.features.map((f: any) => f.text || f),
      },
      bump: item.attributes.bump,
      oto: {
        ...item.attributes.oto,
        features: item.attributes.oto.features.map((f: any) => f.text || f),
      },
    };
  } catch (error) {
    console.error("Failed to fetch product from Strapi (Server might be down):", error);
    return null;
  }
}