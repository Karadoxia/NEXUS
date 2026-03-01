import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';

const RetryPayloadSchema = z.object({
  systems: z
    .array(
      z.enum(['traefik', 'prometheus', 'grafana', 'kuma', 'wireguard', 'loki'])
    )
    .optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (token !== process.env.WEBHOOK_TOKEN_DOCKER) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validated = RetryPayloadSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: validated.error.errors },
        { status: 400 }
      );
    }

    // Find the container
    const container = await prisma.containerRegistry.findUnique({
      where: { containerId: id },
    });

    if (!container) {
      return NextResponse.json(
        { error: 'Container not found' },
        { status: 404 }
      );
    }

    // Determine which systems to retry
    const systemsToRetry = validated.data.systems || [
      'traefik',
      'prometheus',
      'grafana',
      'kuma',
      'wireguard',
      'loki',
    ];

    // Reset registration status for specified systems
    const updateData: any = {
      lastEventAt: new Date(),
    };

    if (systemsToRetry.includes('traefik')) {
      updateData.traefikRegistered = false;
      updateData.traefikUpdatedAt = null;
    }
    if (systemsToRetry.includes('prometheus')) {
      updateData.prometheusRegistered = false;
      updateData.prometheusUpdatedAt = null;
    }
    if (systemsToRetry.includes('grafana')) {
      updateData.grafanaRegistered = false;
      updateData.grafanaUpdatedAt = null;
    }
    if (systemsToRetry.includes('kuma')) {
      updateData.kumaRegistered = false;
      updateData.kumaUpdatedAt = null;
    }
    if (systemsToRetry.includes('wireguard')) {
      updateData.wireguardRegistered = false;
      updateData.wireguardUpdatedAt = null;
    }
    if (systemsToRetry.includes('loki')) {
      updateData.lokiRegistered = false;
      updateData.lokiUpdatedAt = null;
    }

    // Check if all systems are being retried
    const allSystemsRetrying = systemsToRetry.length === 6;
    if (allSystemsRetrying) {
      updateData.registrationCompletedAt = null;
    }

    const updated = await prisma.containerRegistry.update({
      where: { containerId: id },
      data: updateData,
    });

    // Log retry event for each system
    for (const system of systemsToRetry) {
      await prisma.registrationEvent.create({
        data: {
          containerId: id,
          eventType: 'detected',
          system: system,
          status: 'pending',
          message: `Manual retry triggered for ${system}`,
        },
      });
    }

    return NextResponse.json({
      status: 'retrying',
      jobId: updated.id,
      containerId: updated.containerId,
      containerName: updated.containerName,
      systemsToRetry: systemsToRetry,
      message: `Retry queued for ${systemsToRetry.length} system(s)`,
    });
  } catch (err) {
    console.error('Failed to retry container registration:', err);
    return NextResponse.json(
      { error: 'Retry failed' },
      { status: 500 }
    );
  }
}
