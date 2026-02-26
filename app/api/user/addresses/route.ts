import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(_request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { addresses: true } });
  return NextResponse.json(user?.addresses || []);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const addr = await prisma.address.create({ data: { user: { connect: { email: session.user.email } }, ...body } });
  return NextResponse.json(addr);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Verify the address belongs to the requesting user before updating
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const existing = await prisma.address.findUnique({ where: { id } });
  if (!existing || existing.userId !== user?.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const addr = await prisma.address.update({ where: { id }, data });
  return NextResponse.json(addr);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Verify the address belongs to the requesting user before deleting
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const addr = await prisma.address.findUnique({ where: { id } });
  if (!addr || addr.userId !== user?.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
