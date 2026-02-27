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

// Pre-fetch existing slugs in bulk so upsertProduct can correctly return
// 'created' vs 'updated' without an extra per-row query.
async function buildExistingSlugSet(slugs: string[]): Promise<Set<string>> {
  if (slugs.length === 0) return new Set();
  const rows = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true },
  });
  return new Set(rows.map((r) => r.slug));
}

async function upsertProduct(
  vp: VendorProduct,
  existingSlugs: Set<string>,
): Promise<'created' | 'updated' | 'skipped'> {
  if (!vp.name?.trim() || vp.price <= 0) return 'skipped';

  const slug = toSlug(vp);
  const isNew = !existingSlugs.has(slug);

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

  return isNew ? 'created' : 'updated';
}

async function syncSingleVendor(
  v: 'fakestore' | 'ebay' | 'serpapi',
  query?: string,
): Promise<SyncResult> {
  const result: SyncResult = { vendor: v, synced: 0, skipped: 0, errors: 0 };
  let products: VendorProduct[] = [];

  try {
    if (v === 'fakestore') products = await fetchFakeStoreProducts();
    if (v === 'ebay')      products = await fetchEbayProducts(query ?? 'laptop electronics tech');
    if (v === 'serpapi')   products = await fetchSerpApiProducts(query ?? 'electronics tech informatique');
  } catch (err) {
    console.error(`[sync] ${v} fetch error:`, err);
    result.errors++;
    return result;
  }

  // Bulk-check which slugs already exist so we can report created vs updated
  const slugs = products.map(toSlug);
  const existingSlugs = await buildExistingSlugSet(slugs);

  for (const p of products) {
    try {
      const outcome = await upsertProduct(p, existingSlugs);
      if (outcome === 'skipped') result.skipped++;
      else result.synced++;
    } catch (err) {
      console.error(`[sync] ${v} upsert error for "${p.name}":`, err);
      result.errors++;
    }
  }

  return result;
}

export async function syncVendor(
  vendor: SyncVendor,
  query?: string,
): Promise<SyncResult[]> {
  if (vendor === 'all') {
    // Run all three vendors in parallel to halve wall-clock time
    const [fs, eb, sp] = await Promise.allSettled([
      syncSingleVendor('fakestore', query),
      syncSingleVendor('ebay',      query),
      syncSingleVendor('serpapi',   query),
    ]);
    return [
      fs.status === 'fulfilled' ? fs.value : { vendor: 'fakestore', synced: 0, skipped: 0, errors: 1 },
      eb.status === 'fulfilled' ? eb.value : { vendor: 'ebay',      synced: 0, skipped: 0, errors: 1 },
      sp.status === 'fulfilled' ? sp.value : { vendor: 'serpapi',   synced: 0, skipped: 0, errors: 1 },
    ];
  }

  return [await syncSingleVendor(vendor, query)];
}
