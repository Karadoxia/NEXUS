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
