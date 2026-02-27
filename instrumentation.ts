// Next.js Instrumentation — runs once when the server starts.
// Automatically syncs FakeStore products so the catalogue is always populated.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // bail if agents disabled
    if (process.env.DISABLE_AGENTS === 'true') {
      console.log('[startup] FakeStore sync skipped (agents disabled)');
      return;
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn('[startup] DATABASE_URL not set — FakeStore sync skipped');
      return;
    }
    console.log('[startup] using database at', dbUrl.replace(/:\/\/[^@]+@/, '://***@'));

    // Apply pending migrations at startup only when explicitly requested.
    // Running migrations on every cold start can cause issues in clustered or
    // serverless deployments — set RUN_MIGRATIONS=true only in controlled
    // environments (e.g. a dedicated migration init container).
    if (process.env.RUN_MIGRATIONS === 'true') {
      try {
        console.log('[startup] running prisma migrations');
        // Use the async execFile (not the blocking execSync) to avoid stalling
        // the Node.js event loop for the full duration of the migration run.
        const { execFile } = require('child_process') as typeof import('child_process');
        const { promisify } = require('util') as typeof import('util');
        const execFileAsync = promisify(execFile);
        await execFileAsync('npx', ['prisma', 'migrate', 'deploy'], { cwd: process.cwd() });
        console.log('[startup] migrations applied successfully');
      } catch (merr) {
        console.warn('[startup] prisma migrate deploy encountered error', merr);
      }
    } else {
      console.log('[startup] skipping migrations (set RUN_MIGRATIONS=true to enable)');
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
