import { NextRequest, NextResponse } from 'next/server';
import { prismaInfra } from '@/src/lib/prisma-infra';
import { requestDockerAPI } from '@/src/lib/docker-api';
import { z } from 'zod';

const ActionSchema = z.object({
    action: z.enum(['start', 'stop', 'restart']),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validated = ActionSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: 'Invalid action provided', details: validated.error.errors },
                { status: 400 }
            );
        }

        const { action } = validated.data;

        // 1. Verify container exists in our registry
        const container = await prismaInfra.containerRegistry.findUnique({
            where: { containerId: id },
        });

        if (!container) {
            return NextResponse.json(
                { error: 'Container not found in registry' },
                { status: 404 }
            );
        }

        // 2. Execute Docker Action via API
        try {
            await requestDockerAPI(`/containers/${container.containerId}/${action}`, 'POST');
        } catch (apiError: any) {
            throw new Error(`Docker API error: ${apiError.message}`);
        }

        // 3. Update local DB status if applicable
        const newStatus = action === 'stop' ? 'inactive' : 'active';
        await prismaInfra.containerRegistry.update({
            where: { containerId: id },
            data: { status: newStatus },
        });

        // 4. Log the action event
        await prismaInfra.registrationEvent.create({
            data: {
                containerId: id,
                eventType: 'lifecycle_action',
                system: 'admin-ui',
                status: 'success',
                message: `Admin triggered ${action} on ${container.containerName}.`,
            },
        });

        return NextResponse.json({
            success: true,
            action: action,
            containerName: container.containerName,
            status: newStatus,
            output: `${action} completed successfully`
        });

    } catch (error: any) {
        console.error(`Container lifecycle action failed:`, error);
        return NextResponse.json(
            { error: 'Failed to execute Docker API command', details: error.message },
            { status: 500 }
        );
    }
}
