/* FILE: src/lib/strapi.ts */
import qs from 'qs';
import { ProductConfig } from './products';

// Interface definitions remain the same...
interface StrapiProductResponse {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  isActive: boolean;
  funnel_type?: string;
  theme: ProductConfig['theme'];
  checkout: ProductConfig['checkout'] & { funnel_type?: string };
  bump: ProductConfig['bump'];
  oto: ProductConfig['oto'];
  downsell?: { 
    headline: string;
    description: string;
    price: number;
    stripePriceId: string;
    deliveryUrl: string;
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
    // 1. SIMPLIFIED QUERY (The Fix)
    // We removed the nested 'features' population which caused the 400 Error.
    // using 'populate: "*"' is safer and gets all direct children.
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
          populate: '*' // <--- CHANGED: Simply get everything (works for JSON & Components)
        },
        bump: {
          populate: '*'
        },
        oto: {
          populate: '*' // <--- CHANGED: Removed specific features nesting
        },
        downsell: {
          populate: '*'
        }
      },
    }, {
      encodeValuesOnly: true,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); 

    const url = `${STRAPI_URL}/api/products?${query}`;
    console.log(`[Strapi] Fetching: ${url}`);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', 
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
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

    console.log(`[Strapi] ✅ Successfully loaded: ${item.name}`);

    // Magic Switch Logic
    const detectedFunnelType = item.funnel_type || item.checkout.funnel_type || 'digital_product';

    return {
      id: item.slug,
      theme: item.theme,
      checkout: {
        ...item.checkout,
        funnelType: detectedFunnelType, 
        // Robust check: Handle if features is a string (JSON) or an array of components
        features: Array.isArray(item.checkout.features) 
          ? item.checkout.features.map((f: any) => f.text || f)
          : [],
      },
      bump: item.bump,
      oto: {
        ...item.oto,
        features: Array.isArray(item.oto.features) 
          ? item.oto.features.map((f: any) => f.text || f)
          : [],
      },
      downsell: item.downsell
    };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error("❌ Strapi Request Timed Out (Server took >15s)");
    } else {
      console.error("Failed to fetch product from Strapi:", error);
    }
    return null;
  }
}