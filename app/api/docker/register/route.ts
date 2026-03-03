import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';
import { prismaInfra } from '@/src/lib/prisma-infra';


const containerRegisterSchema = z.object({
  containerId: z.string().min(12, 'Invalid container ID'),
  containerName: z.string().min(1, 'Container name required'),
  image: z.string().optional(),
  ports: z.record(z.string()).optional(),
  labels: z.record(z.string()).optional(),
  environment: z.record(z.string()).optional(),
  networks: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify webhook token if provided
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

    const body = await request.json();
    const validated = containerRegisterSchema.parse(body);

    // Check if already registered
    const existing = await prismaInfra.containerRegistry.findUnique({
      where: { containerId: validated.containerId },
    });

    if (existing) {
      return NextResponse.json(
        {
          status: 'duplicate',
          containerId: validated.containerId,
          message: 'Container already registered',
        },
        { status: 200 }
      );
    }

    // Create registration record
    const registry = await prismaInfra.containerRegistry.create({
      data: {
        containerId: validated.containerId,
        containerName: validated.containerName,
        image: validated.image,
        ports: validated.ports || {},
        labels: validated.labels || {},
        environment: validated.environment || {},
        networks: validated.networks || [],
        status: 'active',
        createdBy: 'docker-webhook',
      },
    });

    // Log initial detection event
    await prismaInfra.registrationEvent.create({
      data: {
        containerId: validated.containerId,
        eventType: 'detected',
        system: 'docker',
        status: 'success',
        message: `Container ${validated.containerName} detected`,
      },
    });

    return NextResponse.json(
      {
        status: 'queued',
        jobId: registry.id,
        containerId: registry.containerId,
        containerName: registry.containerName,
        message: 'Container registration queued for processing',
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
    console.error('Container registration failed:', err);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Optional: query parameter to filter by status
    const status = request.nextUrl.searchParams.get('status') || 'active';

    const containers = await prismaInfra.containerRegistry.findMany({
      where: { status: status as any },
      orderBy: { firstDetectedAt: 'desc' },
      take: 100,
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: containers.length,
      containers,
    });
  } catch (err) {
    console.error('Failed to fetch containers:', err);
    return NextResponse.json(
      { error: 'Failed to fetch containers' },
      { status: 500 }
    );
  }
}
