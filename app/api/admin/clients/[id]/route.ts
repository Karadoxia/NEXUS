import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const client = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        addresses: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            street: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
            isDefault: true,
          },
        },
        _count: {
          select: {
            orders: true,
            addresses: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (e: unknown) {
    console.error('[admin clients GET]', e);
    return NextResponse.json({ error: 'Failed to load client' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const { name, phone, password } = body;

    // Verify client exists
    const client = await prisma.user.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name || null;
    }
    if (phone !== undefined) {
      updateData.phone = phone || null;
    }
    if (password) {
      // Hash the new password
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        updatedAt: true,
      },
    });

    console.log('[admin clients PATCH] Updated client:', client.email);

    return NextResponse.json({ success: true, data: updated });
  } catch (e: unknown) {
    console.error('[admin clients PATCH]', e);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

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

