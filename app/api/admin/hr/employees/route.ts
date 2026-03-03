import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server-auth';
import { getPrismaHR } from '@/src/lib/prisma-hr';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/src/lib/prisma';

const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/\d/, 'Password must contain a digit')
    .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
  role: z.enum(['ADMIN', 'MANAGER', 'MARKETING', 'IT', 'SUPPORT', 'EDITOR', 'TRAINEE']),
  department: z.string().optional(),
  phone: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const client = getPrismaHR();
    const result = await client.query(
      'SELECT id, email, name, role, department, phone, "isActive", "lastLogin", "createdAt" FROM "Employee" ORDER BY "createdAt" DESC'
    );

    return NextResponse.json({
      success: true,
      employees: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error('Failed to fetch employees:', err);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const validated = createEmployeeSchema.parse(body);

    const client = getPrismaHR();

    // Check if email already exists
    const existing = await client.query(
      'SELECT id FROM "Employee" WHERE email = $1',
      [validated.email]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create employee
    const id = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await client.query(
      `INSERT INTO "Employee" (id, email, name, "hashedPassword", role, department, phone, "createdBy", "isActive", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
       RETURNING id, email, name, role, department, phone, "isActive", "createdAt"`,
      [id, validated.email, validated.name, hashedPassword, validated.role, validated.department || null, validated.phone || null, session.user.email]
    );

    const employee = result.rows[0];

    // Log to audit log
    await prisma.log.create({
      data: {
        adminEmail: session.user.email,
        action: 'create',
        entity: 'employee',
        entityId: employee.id,
        detail: `Created employee: ${employee.email} with role ${employee.role}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        employee,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Failed to create employee:', err);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
