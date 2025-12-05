import { ProductConfig } from './products';

// Strapi v5 Response Interface (Flat Structure - No 'attributes')
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
    // FIXED QUERY: Manually construct the query to avoid 'qs' library issues with Strapi v5
    // This requests the main product AND fully unpacks all nested components
    const params = new URLSearchParams();
    params.append('filters[slug][$eq]', slug);
    params.append('populate[theme][populate]', '*');
    params.append('populate[checkout][populate]', '*');
    params.append('populate[bump][populate]', '*');
    params.append('populate[oto][populate]', '*');

    const queryString = params.toString();
    const fullUrl = `${STRAPI_URL}/api/products?${queryString}`;

    // Debug Log: Show exactly what we are asking for
    console.log(`[Strapi] Fetching: ${fullUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout

    const res = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data (price changes)
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      // Log the ACTUAL error from Strapi (e.g. "Invalid parameter")
      const errorText = await res.text();
      console.error(`Strapi Error (${res.status}): ${res.statusText}`);
      console.error("Strapi Response Body:", errorText);
      return null;
    }

    const json = await res.json();
    const item = json.data?.[0] as StrapiProductResponse;

    if (!item) {
      console.warn(`Product not found in Strapi for slug: ${slug}`);
      return null;
    }

    console.log(`[Strapi] ✅ Successfully loaded: ${item.name} | Price: $${(item.checkout?.price || 0) / 100}`);

    // Transform Strapi Data (Handle v5 Flat Structure)
    return {
      id: item.slug,
      theme: item.theme,
      checkout: {
        ...item.checkout,
        // Fix: Ensure features map correctly even if Strapi returns null
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