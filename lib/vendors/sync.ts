import { prisma } from '@/src/lib/prisma';
import { fetchFakeStoreProducts } from './fakestore';
import { fetchEbayProducts }      from './ebay';
import { fetchSerpApiProducts }   from './serpapi';
import type { VendorProduct }     from './types';

export type SyncVendor = 'fakestore' | 'ebay' | 'serpapi' | 'all';

export interface SyncResult {
  vendor:  string;
  synced:  number;
  skipped: number;
  errors:  number;
}

// Deterministic slug: source-slugified-name-externalId
function toSlug(vp: VendorProduct): string {
  const base = vp.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 55);
  return `${vp.source}-${base}-${vp.externalId}`.slice(0, 100);
}

async function upsertProduct(vp: VendorProduct): Promise<'created' | 'updated' | 'skipped'> {
  if (!vp.name?.trim() || vp.price <= 0) return 'skipped';

  const slug = toSlug(vp);

  await prisma.product.upsert({
    where:  { slug },
    create: {
      slug,
      name:         vp.name.trim(),
      brand:        vp.brand || 'Unknown',
      description:  vp.description?.trim() || vp.name,
      price:        vp.price,
      comparePrice: vp.comparePrice,
      category:     vp.category,
      image:        vp.image  || '',
      images:       vp.images.filter(Boolean),
      specs:        vp.specs  || {},
      stock:        vp.stock  ?? 10,
      rating:       Math.min(vp.rating, 5),
      reviewCount:  vp.reviewCount ?? 0,
      isNew:        false,
      featured:     false,
      tags:         vp.tags.filter(Boolean),
    },
    update: {
      name:         vp.name.trim(),
      price:        vp.price,
      comparePrice: vp.comparePrice,
      image:        vp.image || '',
      stock:        vp.stock ?? 10,
      rating:       Math.min(vp.rating, 5),
      reviewCount:  vp.reviewCount ?? 0,
    },
  });

  return 'updated';
}

export async function syncVendor(
  vendor: SyncVendor,
  query?: string,
): Promise<SyncResult[]> {
  const targets = vendor === 'all'
    ? (['fakestore', 'ebay', 'serpapi'] as const)
    : [vendor];

  const results: SyncResult[] = [];

  for (const v of targets) {
    const result: SyncResult = { vendor: v, synced: 0, skipped: 0, errors: 0 };

    let products: VendorProduct[] = [];

    try {
      if (v === 'fakestore') products = await fetchFakeStoreProducts();
      if (v === 'ebay')      products = await fetchEbayProducts(query ?? 'laptop electronics tech');
      if (v === 'serpapi')   products = await fetchSerpApiProducts(query ?? 'electronics tech informatique');
    } catch (err) {
      console.error(`[sync] ${v} fetch error:`, err);
      result.errors++;
      results.push(result);
      continue;
    }

    for (const p of products) {
      try {
        const outcome = await upsertProduct(p);
        if (outcome === 'skipped') result.skipped++;
        else result.synced++;
      } catch (err) {
        console.error(`[sync] ${v} upsert error for "${p.name}":`, err);
        result.errors++;
      }
    }

    results.push(result);
  }

  return results;
}
