/**
 * Docker Event Watcher
 *
 * Listens for Docker container start events and automatically triggers
 * n8n webhook to register containers with infrastructure services.
 *
 * Usage:
 *   npx tsx scripts/docker-event-watcher.ts
 *
 * Or add to docker-compose.yml as a sidecar:
 *   docker-event-watcher:
 *     build: .
 *     command: npx tsx scripts/docker-event-watcher.ts
 *     volumes:
 *       - /var/run/docker.sock:/var/run/docker.sock:ro
 *     environment:
 *       WEBHOOK_URL: http://nexus-n8n.local/webhook/container-detected
 *       WEBHOOK_TOKEN_DOCKER: ${WEBHOOK_TOKEN_DOCKER}
 */

import Dockerode = require('dockerode');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://nexus-n8n.local/webhook/container-detected';
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN_DOCKER || '';
const REQUIRE_WEBHOOK_TOKEN =
  (process.env.REQUIRE_WEBHOOK_TOKEN || 'false').toLowerCase() === 'true';

if (REQUIRE_WEBHOOK_TOKEN && !WEBHOOK_TOKEN) {
  console.error('ERROR: WEBHOOK_TOKEN_DOCKER is required when REQUIRE_WEBHOOK_TOKEN=true');
  process.exit(1);
}

const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

async function sendToWebhook(payload: any) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (WEBHOOK_TOKEN) {
      headers.Authorization = `Bearer ${WEBHOOK_TOKEN}`;
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Webhook error (${response.status}): ${await response.text()}`);
      return false;
    }

    const result = await response.json();
    console.log(`✓ Webhook triggered: ${JSON.stringify(result)}`);
    return true;
  } catch (err) {
    console.error(`Webhook request failed: ${err}`);
    return false;
  }
}

async function processContainerEvent(event: any) {
  try {
    const containerId = event.Actor.ID;
    const container = docker.getContainer(containerId);

    // Inspect container to get full details
    const inspect = await container.inspect();

    // Check for auto-register label
    const labels = inspect.Config.Labels || {};
    if (labels['auto-register'] !== 'true') {
      console.log(`Skipping container ${inspect.Name} - auto-register label not set`);
      return;
    }

    console.log(`Processing container: ${inspect.Name}`);

    // Extract container metadata
    const ports = inspect.NetworkSettings.Ports || {};
    const exposedPorts: Record<string, string> = {};
    for (const [port, bindings] of Object.entries(ports)) {
      if (bindings) {
        exposedPorts[port] = port;
      }
    }

    // Parse environment variables
    const environment: Record<string, string> = {};
    (inspect.Config.Env || []).forEach((env: string) => {
      const [key, val] = env.split('=');
      if (key && val) {
        environment[key] = val;
      }
    });

    // Get connected networks
    const networks = Object.keys(inspect.NetworkSettings.Networks || {});

    // Build payload for n8n webhook
    const payload = {
      containerId: inspect.Id,
      containerName: inspect.Name.replace(/^\//, ''), // Remove leading slash
      image: inspect.Config.Image,
      ports: exposedPorts,
      labels: labels,
      environment: environment,
      networks: networks,
    };

    // Send to n8n webhook
    const success = await sendToWebhook(payload);
    if (success) {
      console.log(`✓ Container registered: ${payload.containerName}`);
    } else {
      console.error(`✗ Failed to register container: ${payload.containerName}`);
    }
  } catch (err) {
    console.error(`Error processing container event: ${err}`);
  }
}

async function startEventListener() {
  console.log('🚀 Docker Event Watcher started');
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);
  console.log(`🔐 Auth mode: ${WEBHOOK_TOKEN ? 'Bearer token enabled' : 'No token (dev mode)'}`);
  console.log('⏳ Listening for container start events...\n');

  try {
    // Listen for container start events
    const stream = await docker.getEvents({
      filters: {
        type: ['container'],
        event: ['start'],
      },
    });

    stream.on('data', async (chunk) => {
      try {
        const event = JSON.parse(chunk.toString());
        console.log(`[${new Date().toISOString()}] Container event: ${event.Type} ${event.Action}`);
        await processContainerEvent(event);
      } catch (err) {
        console.error(`Error parsing event: ${err}`);
      }
    });

    stream.on('error', (err) => {
      console.error(`Stream error: ${err}`);
      process.exit(1);
    });

    stream.on('end', () => {
      console.log('Stream ended, reconnecting...');
      setTimeout(startEventListener, 5000);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Docker Event Watcher');
      const destroyableStream = stream as unknown as { destroy?: () => void };
      destroyableStream.destroy?.();
      process.exit(0);
    });
  } catch (err) {
    console.error(`Failed to start event listener: ${err}`);
    process.exit(1);
  }
}

// Start the event listener
startEventListener();
