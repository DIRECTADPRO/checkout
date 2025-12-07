/* FILE: src/lib/strapi.ts */
import qs from 'qs';
import { ProductConfig } from './products';

// Define Interface for Strapi v5 Response (Flat Structure)
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
  // 1. Safety Check: Ensure Token Exists
  if (!STRAPI_TOKEN) {
    console.error("CRITICAL: STRAPI_API_TOKEN is missing in .env.local");
    return null;
  }

  try {
    // 2. Construct the Query using 'qs'
    // This asks Strapi to find the product by slug AND unpack every component
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
            features: '*' // Get the bullets
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
          populate: '*' // <--- CRITICAL: Fetch the Downsell data
        }
      },
    }, {
      encodeValuesOnly: true, // Prettifies the URL
    });

    // 3. Set a Timeout (Don't hang forever if server is slow)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout

    // 4. Fetch Data
    const url = `${STRAPI_URL}/api/products?${query}`;
    console.log(`[Strapi] Fetching: ${url}`);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh price data
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 5. Handle Errors
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Strapi Error (${res.status}): ${res.statusText}`);
      console.error("Strapi Response Body:", errorText);
      return null;
    }

    const json = await res.json();
    
    // 6. Validate Data
    if (!json.data || json.data.length === 0) {
      console.warn(`Product not found in Strapi for slug: ${slug}`);
      return null;
    }

    const item = json.data[0] as StrapiProductResponse;

    console.log(`[Strapi] ✅ Successfully loaded: ${item.name}`);

    // 7. Map Data (Flat Structure for Strapi v5)
    return {
      id: item.slug,
      theme: item.theme,
      checkout: {
        ...item.checkout,
        // Safely map features array to strings
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
      // Map the optional Downsell component
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