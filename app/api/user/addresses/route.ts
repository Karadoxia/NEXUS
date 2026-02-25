import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request) {
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
  const addr = await prisma.address.update({ where: { id }, data });
  return NextResponse.json(addr);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.address.delete({ where: { id } as any });
  return NextResponse.json({ success: true });
}
