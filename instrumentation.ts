// Next.js Instrumentation — runs once when the server starts.
// Automatically syncs FakeStore products so the catalogue is always populated.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { syncVendor } = await import('./lib/vendors/sync');
      const results = await syncVendor('fakestore');
      const synced = results.reduce((s, r) => s + r.synced, 0);
      console.log(`[startup] FakeStore sync: ${synced} products upserted`);
    } catch (err) {
      console.error('[startup] FakeStore sync failed:', err);
    }
  }
}
