import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';

const port = process.env.PORT || 3001;
const baseUrl = `http://localhost:${port}`;

describe('API routes', () => {
  it('should return a list of products', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    expect(res.ok).toBe(true);
    const list = await res.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('product detail endpoint should return single product', async () => {
    const resAll = await fetch(`${baseUrl}/api/products`);
    const list = await resAll.json();
    const slug = list[0]?.slug;
    if (!slug) return;
    const res = await fetch(`${baseUrl}/api/products/${slug}`);
    expect(res.ok).toBe(true);
    const product = await res.json();
    expect(product.slug).toBe(slug);
  });
});
