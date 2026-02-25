import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50', 10));

    const where: any = {};
    if (q) {
        const keyword = q.toLowerCase();
        where.OR = [
            { name: { contains: keyword } },
            { brand: { contains: keyword } },
            { description: { contains: keyword } },
            { category: { contains: keyword } },
        ];
    }

    const products = await prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
    });
    return NextResponse.json(products);
}

// allow admin to create new product
export async function POST(request: Request) {
    const { error } = await requireAdmin();
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
            data: {
                name,
                slug,
                brand,
                description,
                price,
                comparePrice,
                category,
                image,
                images,
                specs,
                stock,
                featured,
                rating,
                reviewCount,
                isNew,
                tags,
            },
        });
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

// update existing product
export async function PUT(request: Request) {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    try {
        const product = await prisma.product.update({
            where: { id },
            data,
        });
        return NextResponse.json(product);
    } catch (e: unknown) {
        console.error('[products PUT]', e);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// delete product
export async function DELETE(request: Request) {
    const { error } = await requireAdmin();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    try {
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e: unknown) {
        console.error('[products DELETE]', e);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
