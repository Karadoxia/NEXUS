// server component for store page
import { prisma } from '@/src/lib/prisma';
import StoreContent from '@/components/store-content';

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  const products = await prisma.product.findMany();
  // pass all products to client component for filtering
  return <StoreContent initialProducts={products} />;
}
