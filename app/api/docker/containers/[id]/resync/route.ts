import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

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

    // Reset all registration statuses to force re-registration
    const updated = await prisma.containerRegistry.update({
      where: { containerId: id },
      data: {
        traefikRegistered: false,
        prometheusRegistered: false,
        grafanaRegistered: false,
        kumaRegistered: false,
        wireguardRegistered: false,
        lokiRegistered: false,
        registrationCompletedAt: null,
        lastEventAt: new Date(),
      },
    });

    // Log resync event
    await prisma.registrationEvent.create({
      data: {
        containerId: id,
        eventType: 'detected',
        system: 'docker',
        status: 'pending',
        message: `Container ${container.containerName} resynced - all registrations reset`,
      },
    });

    return NextResponse.json({
      status: 'resyncing',
      jobId: updated.id,
      containerId: updated.containerId,
      containerName: updated.containerName,
      message: 'Container resync queued',
    });
  } catch (err) {
    console.error('Failed to resync container:', err);
    return NextResponse.json(
      { error: 'Resync failed' },
      { status: 500 }
    );
  }
}
