import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
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
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 10, // Last 10 events
        },
      },
    });

    if (!container) {
      return NextResponse.json(
        { error: 'Container not found' },
        { status: 404 }
      );
    }

    // Build status summary
    const registrationStatus = {
      traefik: {
        registered: container.traefikRegistered,
        updatedAt: container.traefikUpdatedAt,
      },
      prometheus: {
        registered: container.prometheusRegistered,
        updatedAt: container.prometheusUpdatedAt,
        jobName: container.prometheusJobName,
      },
      grafana: {
        registered: container.grafanaRegistered,
        updatedAt: container.grafanaUpdatedAt,
        panelCount: container.grafanaPanelIds?.length || 0,
      },
      kuma: {
        registered: container.kumaRegistered,
        updatedAt: container.kumaUpdatedAt,
        monitorId: container.kumaMonitorId,
      },
      wireguard: {
        registered: container.wireguardRegistered,
        updatedAt: container.wireguardUpdatedAt,
        assignedIp: container.wireguardIp,
      },
      loki: {
        registered: container.lokiRegistered,
        updatedAt: container.lokiUpdatedAt,
      },
    };

    // Count registered systems
    const registeredCount = Object.values(registrationStatus).filter(
      (s) => s.registered
    ).length;
    const totalSystems = 6;
    const completionPercentage = Math.round((registeredCount / totalSystems) * 100);

    return NextResponse.json({
      container: {
        id: container.id,
        containerId: container.containerId,
        containerName: container.containerName,
        image: container.image,
        status: container.status,
      },
      registration: registrationStatus,
      summary: {
        registeredSystems: registeredCount,
        totalSystems: totalSystems,
        completionPercentage: completionPercentage,
        allRegistered: registeredCount === totalSystems,
        firstDetected: container.firstDetectedAt,
        lastEvent: container.lastEventAt,
        completedAt: container.registrationCompletedAt,
      },
      recentEvents: container.events.map((event) => ({
        id: event.id,
        type: event.eventType,
        system: event.system,
        status: event.status,
        message: event.message,
        timestamp: event.timestamp,
        errorDetails: event.errorDetails,
      })),
    });
  } catch (err) {
    console.error('Failed to get container status:', err);
    return NextResponse.json(
      { error: 'Status retrieval failed' },
      { status: 500 }
    );
  }
}
