import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { session, error } = await requireAdmin();
  if (error) return error;

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
