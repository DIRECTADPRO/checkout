// FILE: src/lib/strapi.ts
import qs from 'qs';
import { ProductConfig } from './products';

// Define Interface for Strapi v5 Response
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
    // FIXED QUERY: Simplified populate logic for Strapi v5
    const query = qs.stringify({
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        theme: {
          populate: '*'
        },
        checkout: {
          populate: {
            features: '*' // Use wildcard for simple component lists
          }
        },
        bump: {
          populate: '*'
        },
        oto: {
          populate: {
            features: '*'
          }
        }
      },
    }, {
      encodeValuesOnly: true, // prettify URL
    });

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
      // Improved Error Logging to see exactly WHY Strapi rejected it
      const errorText = await res.text();
      console.error(`Strapi Error (${res.status}): ${res.statusText}`);
      console.error("Strapi Response Body:", errorText); 
      return null;
    }

    const json = await res.json();
    
    if (!json.data || json.data.length === 0) {
      console.warn(`Product not found in Strapi for slug: ${slug}`);
      return null;
    }

    const item = json.data[0] as StrapiProductResponse;

    return {
      id: item.slug,
      theme: item.theme,
      checkout: {
        ...item.checkout,
        features: item.checkout.features 
          ? item.checkout.features.map((f: any) => f.text || f) 
          : [],
      },
      bump: item.bump,
      oto: {
        ...item.oto,
        features: item.oto.features 
          ? item.oto.features.map((f: any) => f.text || f) 
          : [],
      },
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("❌ Strapi Request Timed Out");
    } else {
      console.error("Failed to fetch product from Strapi:", error);
    }
    return null;
  }
}