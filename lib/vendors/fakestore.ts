// FakeStore API — completely free, no API key required
// https://fakestoreapi.com/products
import type { VendorProduct } from './types';

const CATEGORY_MAP: Record<string, string> = {
  'electronics':       'components',
  'jewelery':          'accessories',
  "men's clothing":    'accessories',
  "women's clothing":  'accessories',
};

function mapCategory(cat: string): string {
  return CATEGORY_MAP[cat.toLowerCase()] ?? 'accessories';
}

export async function fetchFakeStoreProducts(): Promise<VendorProduct[]> {
  const res = await fetch('https://fakestoreapi.com/products', { cache: 'no-store' });
  if (!res.ok) throw new Error(`FakeStore API error: ${res.status}`);

  const data: any[] = await res.json();

  return data.map((item) => ({
    externalId: String(item.id),
    source:     'fakestore',
    name:       item.title,
    brand:      'FakeStore',
    description: item.description,
    price:      item.price,
    category:   mapCategory(item.category ?? ''),
    image:      item.image,
    images:     [item.image],
    specs:      { category: item.category },
    stock:      Math.floor(Math.random() * 80) + 10,
    rating:     item.rating?.rate  ?? 0,
    reviewCount: item.rating?.count ?? 0,
    tags:       ['fakestore', item.category].filter(Boolean),
  }));
}
