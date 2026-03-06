import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/src/lib/prisma';

// simple sanity tests to ensure database and API are responsive

describe('database seed', () => {
  it('should have seeded products', async () => {
    const products = await prisma.product.findMany();
    expect(products.length).toBeGreaterThan(0);
  });
});
