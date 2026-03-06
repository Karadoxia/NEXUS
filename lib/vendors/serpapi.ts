// SerpApi — Google Shopping aggregator (Amazon, Fnac, Cdiscount, Darty, etc.)
// Free tier: 100 searches/month
// Sign up: https://serpapi.com  →  Dashboard  →  API Key
import type { VendorProduct } from './types';

const SERPAPI_URL = 'https://serpapi.com/search.json';

function mapCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('laptop') || t.includes('notebook') || t.includes('macbook'))          return 'laptops';
  if (t.includes('monitor') || t.includes('display') || t.includes('écran'))            return 'monitors';
  if (t.includes('keyboard') || t.includes('mouse') || t.includes('headphone') || t.includes('headset') || t.includes('casque')) return 'peripherals';
  if (t.includes('router') || t.includes('switch') || t.includes('network') || t.includes('wifi'))  return 'networking';
  if (t.includes('ssd') || t.includes('hdd') || t.includes('disque') || t.includes('storage') || t.includes('nvme')) return 'storage';
  if (t.includes('workstation') || t.includes('desktop') || t.includes('tour'))         return 'workstations';
  if (t.includes('gpu') || t.includes('cpu') || t.includes('processor') || t.includes('ram') || t.includes('carte graphique')) return 'components';
  return 'accessories';
}

export async function fetchSerpApiProducts(query = 'electronics gadgets'): Promise<VendorProduct[]> {
  if (!process.env.SERPAPI_KEY) {
    console.warn('[serpapi] SERPAPI_KEY not set — skipping');
    return [];
  }

  const params = new URLSearchParams({
    engine:  'google_shopping',
    q:       query,
    api_key: process.env.SERPAPI_KEY,
    num:     '40',
    gl:      'fr',   // France — surfaces Cdiscount, Fnac, Darty, etc.
    hl:      'fr',
    currency: 'EUR',
  });

  const res = await fetch(`${SERPAPI_URL}?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`SerpApi error: ${res.status}`);
  const data = await res.json();

  if (!data.shopping_results?.length) return [];

  return data.shopping_results
    .filter((item: any) => item.extracted_price && item.title)
    .map((item: any, idx: number) => ({
      externalId:  item.product_id ?? `serpapi-${idx}-${Date.now()}`,
      source:      'serpapi',
      name:        item.title,
      brand:       item.source ?? 'Unknown',
      description: item.snippet ?? item.title,
      price:       parseFloat(item.extracted_price ?? '0'),
      comparePrice: item.extracted_old_price ? parseFloat(item.extracted_old_price) : undefined,
      category:    mapCategory(item.title),
      image:       item.thumbnail ?? '',
      images:      item.thumbnail ? [item.thumbnail] : [],
      specs: {
        source:     item.source ?? '',
        rating:     String(item.rating ?? ''),
        store:      item.source ?? '',
      },
      stock:       10,
      rating:      parseFloat(item.rating ?? '0'),
      reviewCount: parseInt(item.reviews ?? '0', 10),
      tags:        ['google-shopping', item.source].filter(Boolean),
    }));
}
