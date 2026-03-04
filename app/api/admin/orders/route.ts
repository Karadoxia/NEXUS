import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'delete-all') {
      // Get all orders for archival purposes (optional)
      const allOrders = await prisma.order.findMany({
        include: {
          items: true,
          user: true,
        },
      });

      const orderCount = allOrders.length;

      // Delete all orders (cascades to order items, payments, etc.)
      await prisma.order.deleteMany({});

      console.log('[admin orders DELETE] Deleted all', orderCount, 'orders');
      console.log('[cache] Note: Browser-side order caches should be cleared on next page reload');

      return NextResponse.json({
        success: true,
        message: `Deleted ${orderCount} orders`,
        deletedCount: orderCount,
      });
    } else if (action === 'export') {
      // Export orders before deletion (for audit trail)
      const orders = await prisma.order.findMany({
        include: {
          items: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });

      return NextResponse.json({
        success: true,
        orders,
        exportedAt: new Date().toISOString(),
        count: orders.length,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use ?action=delete-all or ?action=export' },
      { status: 400 }
    );
  } catch (e: unknown) {
    console.error('[admin orders DELETE]', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to process orders' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const searchParams = new URL(request.url).searchParams;
    const action = searchParams.get('action');

    if (action === 'stats') {
      const orderCount = await prisma.order.count();
      const cartItemCount = await prisma.cartItem.count();

      return NextResponse.json({
        orders: orderCount,
        orderItems: cartItemCount,
        readyForDeletion: orderCount > 0,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use ?action=stats' },
      { status: 400 }
    );
  } catch (e: unknown) {
    console.error('[admin orders GET]', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to retrieve order stats' },
      { status: 500 }
    );
  }
}
