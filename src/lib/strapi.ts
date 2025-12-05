// FILE: src/lib/strapi.ts
import qs from 'qs'; // <--- The new power tool
import { ProductConfig } from './products';

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
    // 1. Construct the Query using 'qs' (The "Good Code" way)
    // This tells Strapi: "Give me the product matching this slug, AND unpack every single nested component completely."
    const query = qs.stringify({
      filters: { slug: { $eq: slug } },
      populate: {
        theme: { populate: '*' },
        checkout: { 
          populate: {
            features: true, // Explicitly get the features list
            image: true     // Ensure image is grabbed if it's a media field
          } 
        },
        bump: { populate: '*' },
        oto: { 
          populate: {
            features: true 
          } 
        }
      },
    }, { encodeValuesOnly: true });

    // 2. Set a Timeout (Don't hang forever)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // 3. Fetch Data
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
    
    // 4. Validate Response
    if (!json.data || json.data.length === 0) {
      console.warn(`Product not found in Strapi for slug: ${slug}`);
      return null;
    }

    const item = json.data[0] as StrapiProductResponse;

    // 5. Map the Data (Robustly)
    // We spread (...) the objects to ensure we catch every field Strapi sends (like Price)
    return {
      id: item.slug,
      theme: item.theme,
      checkout: {
        ...item.checkout, // <--- This contains the 'price': 700
        // Guard against empty features to prevent crashes
        features: item.checkout.features 
          ? item.checkout.features.map((f: any) => f.text || f)
          : [],
      },
      bump: {
        ...item.bump,
        // Ensure description is passed if it exists
      },
      oto: {
        ...item.oto,
        features: item.oto.features 
          ? item.oto.features.map((f: any) => f.text || f)
          : [],
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