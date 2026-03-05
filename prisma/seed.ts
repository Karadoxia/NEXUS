import { prisma } from '../src/lib/prisma.ts';
import { products } from '../data/products.ts';

async function main() {
  console.log('Seeding products...');
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        description: p.description,
        price: p.price,
        comparePrice: (p as any).comparePrice || null,
        category: p.category,
        image: p.images?.[0] || null,
        images: p.images || [],
        specs: p.specs || null,
        stock: p.stock,
        featured: p.featured,
        rating: p.rating,
        reviewCount: p.reviewCount || 0,
        isNew: p.isNew,
        tags: p.tags || [],
      },
    });
  }
  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
