import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { requireAdmin } from '@/lib/server-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const count = await prisma.user.count();
  return NextResponse.json({ count });
}