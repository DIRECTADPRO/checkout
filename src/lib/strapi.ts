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

// Default to your Droplet IP if env var is missing
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://137.184.188.99'; 
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function getProductFromStrapi(slug: string): Promise<ProductConfig | null> {
  if (!STRAPI_TOKEN) {
    console.error("CRITICAL: STRAPI_API_TOKEN is missing in .env.local");
    return null;
  }

  try {
    // Fetch the product by Slug and populate all nested components (theme, checkout, bump, oto)
    // We explicitly ask for the fields we need to ensure the response is complete
    const res = await fetch(
      `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=theme,checkout.features,bump,oto.features`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Never cache this; we need instant price updates
      }
    );

    if (!res.ok) {
      console.error(`Strapi Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    const item = json.data[0] as StrapiProductResponse;

    if (!item) return null;

    // Transform Strapi Data -> Your App's ProductConfig Format
    return {
      id: item.attributes.slug,
      theme: item.attributes.theme,
      checkout: {
        ...item.attributes.checkout,
        // Strapi returns features as an array of objects; map them to simple strings
        features: item.attributes.checkout.features.map((f: any) => f.text || f), 
      },
      bump: item.attributes.bump,
      oto: {
        ...item.attributes.oto,
        features: item.attributes.oto.features.map((f: any) => f.text || f),
      },
    };
  } catch (error) {
    console.error("Failed to fetch product from Strapi:", error);
    return null;
  }
}