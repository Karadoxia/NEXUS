import { NextRequest, NextResponse } from 'next/server';
import { prismaInfra } from '@/src/lib/prisma-infra';
import { requestDockerAPI } from '@/src/lib/docker-api';

export async function POST(request: NextRequest) {
    try {
        // 1. Fetch current containers from Docker daemon via API
        let runningContainers: any[];
        try {
            runningContainers = await requestDockerAPI('/containers/json');
        } catch (apiError: any) {
            console.warn('Docker API error, falling back to empty list:', apiError);
            runningContainers = [];
        }

        if (!runningContainers || runningContainers.length === 0) {
            return NextResponse.json({ message: 'No running containers found', synced: 0 });
        }

        let newSyncCount = 0;

        // 2. Process each running container
        for (const container of runningContainers) {
            // 3. Check if it already exists in the registry
            // API returns full 64-char hex Id, Prisma might expect short ID or exact string
            const containerId = container.Id;
            // Names array, typically ["/nexus-app"] -> "nexus-app" or just use the first item
            const containerName = container.Names && container.Names.length > 0 ? container.Names[0].replace(/^\//, '') : 'unknown';

            const existing = await prismaInfra.containerRegistry.findUnique({
                where: { containerId: containerId },
            });

            if (!existing) {
                // 4. Insert missing container
                await prismaInfra.containerRegistry.create({
                    data: {
                        containerId: containerId,
                        containerName: containerName,
                        image: container.Image,
                        status: container.State === 'running' ? 'active' : 'inactive',
                        ports: container.Ports ? { raw: container.Ports } : {},
                        labels: container.Labels ? { raw: container.Labels } : {},
                        networks: container.NetworkSettings?.Networks ? Object.keys(container.NetworkSettings.Networks) : [],
                    },
                });

                // 5. Log detection event
                await prismaInfra.registrationEvent.create({
                    data: {
                        containerId: containerId,
                        eventType: 'detected',
                        system: 'docker-sync',
                        status: 'success',
                        message: `Container ${containerName} imported via manual sync`,
                    },
                });

                newSyncCount++;
            }
        }

        return NextResponse.json({
            success: true,
            scanned: runningContainers.length,
            synced: newSyncCount,
            message: `Scanned ${runningContainers.length} containers. Imported ${newSyncCount} new containers.`
        });

    } catch (error: any) {
        console.error('Docker Sync failed:', error);
        return NextResponse.json(
            { error: 'Failed to sync with local Docker Daemon', details: error.message },
            { status: 500 }
        );
    }
}
