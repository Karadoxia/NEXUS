import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

// CREATE A NEW USER
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !(session.user as any).isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, email, password, phone, role } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name: name || null,
                phone: phone || null,
                role: role || 'user',
                hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        // Log the action
        await prisma.log.create({
            data: {
                adminEmail: session.user.email,
                action: 'create',
                entity: 'user',
                entityId: user.id,
                detail: `Created user ${user.email} with role ${user.role}`,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
