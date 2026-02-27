// environment setup for Vitest
if (!process.env.DATABASE_URL) {
  // use in-memory SQLite by default to avoid needing a real database
  process.env.DATABASE_URL = 'file:./test.db?mode=memory&cache=shared';
}
