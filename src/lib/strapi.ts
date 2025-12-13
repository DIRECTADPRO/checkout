/* FILE: src/lib/strapi.ts */
import qs from 'qs';
import { ProductConfig } from './products';

// 1. UPDATE INTERFACE: Add funnel_type to the response definition
interface StrapiProductResponse {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  isActive: boolean;
  funnel_type?: string; // <--- ADDED: The field from your Product collection
  theme: ProductConfig['theme'];
  checkout: ProductConfig['checkout'] & { funnel_type?: string }; // <--- ADDED: Check inside checkout too
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
            features: '*' 
          }
        },
        bump: {
          populate: '*'
        },
        oto: {
          populate: {
            features: '*'
          }
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

    // 2. THE MAGIC SWITCH LOGIC
    // We check the root 'funnel_type' first, then fall back to 'checkout.funnel_type'.
    // Finally, we default to 'digital_product' if neither is set.
    const detectedFunnelType = item.funnel_type || item.checkout.funnel_type || 'digital_product';

    return {
      id: item.slug,
      theme: item.theme,
      checkout: {
        ...item.checkout,
        // 3. MAP THE VALUE
        // This explicitly tells the app which funnel logic to use
        funnelType: detectedFunnelType, 
        
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