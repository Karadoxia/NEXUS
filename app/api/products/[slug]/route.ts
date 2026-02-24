import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.json(product);
}
