import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { getPrismaHR } from '@/src/lib/prisma-hr';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/src/lib/prisma';

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a digit')
    .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const { newPassword } = resetPasswordSchema.parse(body);

    const client = getPrismaHR();

    // Verify employee exists
    const checkResult = await client.query(
      'SELECT id, email FROM "Employee" WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const employee = checkResult.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const result = await client.query(
      `UPDATE "Employee" SET "hashedPassword" = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING id, email`,
      [hashedPassword, id]
    );

    // Audit log
    await prisma.log.create({
      data: {
        adminEmail: session.user.email,
        action: 'update',
        entity: 'employee_password',
        entityId: id,
        detail: `Admin reset password for employee: ${employee.email}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      employee: result.rows[0],
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Failed to reset password:', err);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
