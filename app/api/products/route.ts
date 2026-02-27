import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';
import { auditLog } from '@/lib/audit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q     = searchParams.get('q');
  const stock = searchParams.get('stock'); // "low" → stock < 10
  const page  = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50', 10));

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name:        { contains: q, mode: 'insensitive' } },
      { brand:       { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { category:    { contains: q, mode: 'insensitive' } },
    ];
  }
  if (stock === 'low') where.stock = { lt: 10 };

  const orderBy = stock === 'low' ? { stock: 'asc' as const } : { createdAt: 'desc' as const };
  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy }),
    prisma.product.count({ where }),
  ]);
  return NextResponse.json({ products, total, page, limit });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { name, slug, brand, description, price, comparePrice, category, image, images, specs, stock, featured, rating, reviewCount, isNew, tags } = body;

  if (!name || !slug || !description || price == null || !category) {
    return NextResponse.json({ error: 'Missing required fields: name, slug, description, price, category' }, { status: 400 });
  }
  if (typeof price !== 'number' || price < 0) {
    return NextResponse.json({ error: 'price must be a non-negative number' }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: { name, slug, brand, description, price, comparePrice, category, image, images, specs, stock, featured, rating, reviewCount, isNew, tags },
    });
    await auditLog(session!.user!.email!, 'create', 'product', product.id, product.name);
    return NextResponse.json(product);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error('[products POST]', e);
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'A product with that slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { id, name, slug, brand, description, price, comparePrice, category, image, images, specs, stock, featured, rating, reviewCount, isNew, tags } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (name         !== undefined) data.name        = name;
  if (slug         !== undefined) data.slug        = slug;
  if (brand        !== undefined) data.brand       = brand;
  if (description  !== undefined) data.description = description;
  if (price        !== undefined) data.price       = price;
  if (comparePrice !== undefined) data.comparePrice = comparePrice;
  if (category     !== undefined) data.category    = category;
  if (image        !== undefined) data.image       = image;
  if (images       !== undefined) data.images      = images;
  if (specs        !== undefined) data.specs       = specs;
  if (stock        !== undefined) data.stock       = stock;
  if (featured     !== undefined) data.featured    = featured;
  if (rating       !== undefined) data.rating      = rating;
  if (reviewCount  !== undefined) data.reviewCount = reviewCount;
  if (isNew        !== undefined) data.isNew       = isNew;
  if (tags         !== undefined) data.tags        = tags;

  try {
    const product = await prisma.product.update({ where: { id }, data });
    await auditLog(session!.user!.email!, 'update', 'product', id, product.name);
    return NextResponse.json(product);
  } catch (e: unknown) {
    console.error('[products PUT]', e);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    const product = await prisma.product.delete({ where: { id } });
    await auditLog(session!.user!.email!, 'delete', 'product', id, product.name);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('[products DELETE]', e);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
