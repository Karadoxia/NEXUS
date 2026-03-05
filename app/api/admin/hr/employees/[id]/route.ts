import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { getPrismaHR } from '@/src/lib/prisma-hr';
import { z } from 'zod';
import { prisma } from '@/src/lib/prisma';

const updateEmployeeSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'MARKETING', 'IT', 'SUPPORT', 'EDITOR', 'TRAINEE']).optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const client = getPrismaHR();

    const result = await client.query(
      'SELECT id, email, name, role, department, phone, "isActive", "lastLogin", "createdAt", "updatedAt" FROM "Employee" WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee: result.rows[0],
    });
  } catch (err) {
    console.error('Failed to fetch employee:', err);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const updates = updateEmployeeSchema.parse(body);

    const client = getPrismaHR();

    // Build dynamic UPDATE query
    const updateFields: string[] = [];
    const values: (string | null)[] = [];
    let paramIndex = 1;

    if (updates.name) {
      updateFields.push(`"name" = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.role) {
      updateFields.push(`"role" = $${paramIndex++}`);
      values.push(updates.role);
    }
    if (updates.department !== undefined) {
      updateFields.push(`"department" = $${paramIndex++}`);
      values.push(updates.department || null);
    }
    if (updates.phone !== undefined) {
      updateFields.push(`"phone" = $${paramIndex++}`);
      values.push(updates.phone || null);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    updateFields.push(`"updatedAt" = NOW()`);

    const result = await client.query(
      `UPDATE "Employee" SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, role, department, phone, "isActive", "updatedAt"`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const employee = result.rows[0];

    // Audit log
    await prisma.log.create({
      data: {
        adminEmail: session.user.email,
        action: 'update',
        entity: 'employee',
        entityId: id,
        detail: `Updated employee: ${employee.email}. Changes: ${Object.keys(updates).join(', ')}`,
      },
    });

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Failed to update employee:', err);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const client = getPrismaHR();

    // Soft delete: set isActive to false
    const result = await client.query(
      `UPDATE "Employee" SET "isActive" = false, "updatedAt" = NOW() WHERE id = $1 RETURNING id, email, name, role`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const employee = result.rows[0];

    // Audit log
    await prisma.log.create({
      data: {
        adminEmail: session.user.email,
        action: 'delete',
        entity: 'employee',
        entityId: id,
        detail: `Deactivated employee: ${employee.email}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Employee deactivated successfully',
      employee,
    });
  } catch (err) {
    console.error('Failed to deactivate employee:', err);
    return NextResponse.json(
      { error: 'Failed to deactivate employee' },
      { status: 500 }
    );
  }
}
