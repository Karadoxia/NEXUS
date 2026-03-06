import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

// GET USER DETAILS
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !(session.user as any).isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true,
                paymentMethods: true,
                accounts: true,
                _count: {
                    select: { orders: true, sessions: true, logs: true },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Don't send the hashed password to the client
        const { hashedPassword, ...safeUser } = user;
        return NextResponse.json(safeUser);
    } catch (error: any) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
}

// UPDATE USER
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !(session.user as any).isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { name, email, phone, role, password } = await req.json();

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (role !== undefined) updateData.role = role;

        // Only update password if a new one is provided
        if (password) {
            updateData.hashedPassword = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
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
                action: 'update',
                entity: 'user',
                entityId: user.id,
                detail: `Updated user ${user.email}`,
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Error updating user:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Email already in use by another account' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE USER
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !(session.user as any).isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Prevent self-deletion
        const targetUser = await prisma.user.findUnique({ where: { id }, select: { email: true } });
        if (targetUser?.email === session.user.email) {
            return NextResponse.json({ error: 'You cannot delete your own admin account' }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id },
        });

        // Log the action
        await prisma.log.create({
            data: {
                adminEmail: session.user.email,
                action: 'delete',
                entity: 'user',
                entityId: id,
                detail: `Deleted user ${targetUser?.email || id}`,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting user:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
