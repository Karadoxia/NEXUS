// Next.js Instrumentation — runs once when the server starts.
// Automatically syncs FakeStore products so the catalogue is always populated.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // bail if agents disabled or database not accessible
    if (process.env.DISABLE_AGENTS === 'true') {
      console.log('[startup] FakeStore sync skipped (agents disabled)');
      return;
    }
    // resolve database path exactly like prisma.ts so we operate on the same file
    const path = require('path');
    const fs = require('fs');
    let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
    let dbPath = dbUrl.replace(/^file:/, '');
    if (!path.isAbsolute(dbPath)) {
      const projectRoot = path.resolve(process.cwd());
      dbPath = path.resolve(projectRoot, dbPath);
    }

    console.log('[startup] using database at', dbPath);

    // ensure containing directory exists and file is present
    if (!fs.existsSync(dbPath)) {
      console.log('[startup] database file missing, creating empty sqlite');
      try {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        fs.writeFileSync(dbPath, '');
      } catch (e) {
        console.warn('[startup] failed to create db file', e);
        console.log('[startup] FakeStore sync skipped (database missing)');
        return;
      }
    }

    // make sure migrations are applied to whatever file we're using
    try {
      console.log('[startup] running prisma migrations');
      const { execSync } = require('child_process');
      // use deploy so it works in dev and prod; add cwd just in case
      execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: process.cwd() });
    } catch (merr) {
      console.warn('[startup] prisma migrate deploy encountered error', merr);
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
