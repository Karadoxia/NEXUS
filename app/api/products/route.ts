import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

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

    const products = await prisma.product.findMany({ where });
    return NextResponse.json(products);
}

// allow admin to create new product
export async function POST(request: Request) {
    const body = await request.json();
    const { name, slug, brand, description, price, comparePrice, category, image, images, specs, stock, featured, rating, reviewCount, isNew, tags } = body;
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
}

// update existing product
export async function PUT(request: Request) {
    const body = await request.json();
    const { id, ...data } = body;
    const product = await prisma.product.update({
        where: { id },
        data,
    });
    return NextResponse.json(product);
}

// delete product
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await prisma.product.delete({ where: { id } as any });
    return NextResponse.json({ success: true });
}
