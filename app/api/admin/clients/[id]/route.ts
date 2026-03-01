import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Delete client and all related data (cascades via Prisma relations)
    await prisma.user.delete({
      where: { id },
    });

    console.log('[admin clients DELETE] Deleted client:', client.email);

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('[admin clients DELETE]', e);
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
