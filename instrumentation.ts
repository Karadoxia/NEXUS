// Next.js Instrumentation — runs once when the server starts.
// Automatically syncs FakeStore products so the catalogue is always populated.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // bail if agents disabled or database not accessible
    if (process.env.DISABLE_AGENTS === 'true') {
      console.log('[startup] FakeStore sync skipped (agents disabled)');
      return;
    }
    const dbPath = (process.env.DATABASE_URL || 'file:./dev.db').replace(/^file:/, '');
    const fs = require('fs');
    if (!fs.existsSync(dbPath)) {
      console.log('[startup] FakeStore sync skipped (database missing)');
      return;
    }
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
