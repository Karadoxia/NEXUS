// GET /api/search?q=laptops
// Fans out to all enabled vendor APIs simultaneously + local DB.
// Upserts new vendor products to DB in the background.
// Returns results grouped by source for catalogue display.

import { NextResponse }        from 'next/server';
import { prisma }              from '@/src/lib/prisma';
import { fetchEbayProducts }   from '@/lib/vendors/ebay';
import { fetchSerpApiProducts } from '@/lib/vendors/serpapi';
import { syncVendor }          from '@/lib/vendors/sync';

const VENDOR_LABELS: Record<string, string> = {
  nexus:           'NEXUS Catalog',
  ebay:            'eBay',
  'google-shopping': 'Google Shopping',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ groups: {}, total: 0 });
  }

  const keyword = q.toLowerCase();

  // 1. Fan out — DB + all vendor APIs — all in parallel
  const [dbResult, ebayResult, serpapiResult] = await Promise.allSettled([
    prisma.product.findMany({
      where: {
        OR: [
          { name:        { contains: keyword } },
          { brand:       { contains: keyword } },
          { description: { contains: keyword } },
          { category:    { contains: keyword } },
        ],
      },
      take: 20,
    }),
    fetchEbayProducts(q),
    fetchSerpApiProducts(q),
  ]);

  const dbProducts    = dbResult.status    === 'fulfilled' ? dbResult.value    : [];
  const ebayProducts  = ebayResult.status  === 'fulfilled' ? ebayResult.value  : [];
  const serpapiItems  = serpapiResult.status === 'fulfilled' ? serpapiResult.value : [];

  // 2. Upsert vendor results to DB in the background (non-blocking)
  if (ebayProducts.length || serpapiItems.length) {
    syncVendor('all', q).catch((err) => console.error('[search] bg sync error:', err));
  }

  // 3. Normalize vendor products to a display shape
  function normalise(items: any[], source: string) {
    return items.map((p) => ({
      id:          `${source}-${p.externalId}`,
      slug:        `${source}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${p.externalId}`,
      name:        p.name,
      brand:       p.brand,
      price:       p.price,
      comparePrice: p.comparePrice,
      category:    p.category,
      image:       p.image,
      images:      p.images,
      description: p.description,
      stock:       p.stock,
      rating:      p.rating,
      reviewCount: p.reviewCount,
      tags:        p.tags,
      _source:     source,
      _label:      VENDOR_LABELS[source] ?? source,
    }));
  }

  const groups: Record<string, any[]> = {};
  if (dbProducts.length)    groups['nexus']           = dbProducts.map((p) => ({ ...p, _source: 'nexus', _label: 'NEXUS Catalog' }));
  if (ebayProducts.length)  groups['ebay']            = normalise(ebayProducts, 'ebay');
  if (serpapiItems.length)  groups['google-shopping'] = normalise(serpapiItems, 'google-shopping');

  const total = Object.values(groups).reduce((s, g) => s + g.length, 0);

  return NextResponse.json({ groups, total, query: q });
}
