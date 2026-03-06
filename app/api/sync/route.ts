// POST /api/sync?vendor=all&q=laptops
// Fetches products from enabled vendor APIs and upserts them into the DB.
//
// vendor: 'fakestore' | 'ebay' | 'serpapi' | 'all'  (default: 'all')
// q:      search query forwarded to eBay / SerpApi   (optional)
//
// Requires SYNC_SECRET env var. Pass it as the x-sync-secret header.
// e.g. POST /api/sync?vendor=ebay&q=gaming+laptop  -H "x-sync-secret: yourSecret"

import { NextResponse } from 'next/server';
import { syncVendor, type SyncVendor } from '@/lib/vendors/sync';

const VALID_VENDORS: SyncVendor[] = ['fakestore', 'ebay', 'serpapi', 'all'];

export async function POST(request: Request) {
  // SYNC_SECRET is required — the endpoint is disabled until configured
  const secret = process.env.SYNC_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Sync endpoint disabled: set SYNC_SECRET in your environment' },
      { status: 503 },
    );
  }
  const provided = request.headers.get('x-sync-secret');
  if (provided !== secret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const vendorParam = (searchParams.get('vendor') ?? 'all') as SyncVendor;
  const query       = searchParams.get('q') ?? undefined;

  if (!VALID_VENDORS.includes(vendorParam)) {
    return NextResponse.json(
      { error: `Invalid vendor. Use: ${VALID_VENDORS.join(' | ')}` },
      { status: 400 },
    );
  }

  try {
    const results = await syncVendor(vendorParam, query);
    const total   = results.reduce((s, r) => s + r.synced, 0);
    const errors  = results.reduce((s, r) => s + r.errors, 0);

    return NextResponse.json({ success: true, total, results, errors });
  } catch (err: unknown) {
    console.error('[sync route]', err);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

// GET /api/sync — returns vendor status (which keys are configured)
export async function GET() {
  return NextResponse.json({
    vendors: {
      fakestore: { enabled: true,  note: 'No key required' },
      ebay:      { enabled: !!(process.env.EBAY_CLIENT_ID && process.env.EBAY_CLIENT_SECRET), note: 'Needs EBAY_CLIENT_ID + EBAY_CLIENT_SECRET' },
      serpapi:   { enabled: !!process.env.SERPAPI_KEY, note: 'Needs SERPAPI_KEY — 100 free searches/month' },
    },
    usage: 'POST /api/sync?vendor=all  (or vendor=fakestore|ebay|serpapi)  &q=your+query',
  });
}
