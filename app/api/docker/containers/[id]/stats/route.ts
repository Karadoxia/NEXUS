import { NextRequest, NextResponse } from 'next/server';
import { prismaInfra } from '@/src/lib/prisma-infra';
import { requestDockerAPI } from '@/src/lib/docker-api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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

        // 2. Fetch stats from API. `stream=false` to get a one-off response.
        const stats = await requestDockerAPI(`/containers/${container.containerId}/stats?stream=false`);

        let cpuPercent = 0.0;
        let memoryUsage = 0;
        let memoryLimit = 0;
        let memoryPercent = 0.0;

        try {
            // Calculate CPU percentage
            if (stats.cpu_stats && stats.precpu_stats && stats.cpu_stats.cpu_usage && stats.precpu_stats.cpu_usage) {
                const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
                const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
                if (systemDelta > 0 && cpuDelta > 0) {
                    const cpus = stats.cpu_stats.online_cpus || stats.cpu_stats.cpu_usage.percpu_usage?.length || 1;
                    cpuPercent = (cpuDelta / systemDelta) * cpus * 100.0;
                }
            }

            // Calculate Memory percentage and usage
            if (stats.memory_stats && stats.memory_stats.usage) {
                memoryUsage = stats.memory_stats.usage;
                // Subtract cache/buffers if present for more accurate reporting
                const cache = stats.memory_stats.stats?.cache || stats.memory_stats.stats?.inactive_file || 0;
                memoryUsage -= cache;
                if (memoryUsage < 0) memoryUsage = 0;

                memoryLimit = stats.memory_stats.limit || 0;
                if (memoryLimit > 0) {
                    memoryPercent = (memoryUsage / memoryLimit) * 100.0;
                }
            }
        } catch (calcError) {
            console.error(`Stats calculation error for ${container.containerName}:`, calcError);
        }

        return NextResponse.json({
            cpuPercent: parseFloat(cpuPercent.toFixed(2)),
            memoryPercent: parseFloat(memoryPercent.toFixed(2)),
            memoryUsageBytes: memoryUsage,
            memoryLimitBytes: memoryLimit,
        });

    } catch (error: any) {
        console.error(`Container stats fetch failed:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch container stats', details: error.message },
            { status: 500 }
        );
    }
}
