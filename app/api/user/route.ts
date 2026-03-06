import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { addresses: true } });
  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    console.log('[user PUT] session email', session.user.email, 'body', body);
    const { name, image, phone } = body;
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
        ...(phone !== undefined && { phone }),
      },
    });
    return NextResponse.json(user);
  } catch (e: unknown) {
    console.error('[user PUT]', e);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;

    // Delete user and all related data (cascades via Prisma relations)
    await prisma.user.delete({
      where: { email: userEmail },
    });

    console.log('[user DELETE] Deleted user:', userEmail);

    // Return success — client will redirect to home
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('[user DELETE]', e);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}