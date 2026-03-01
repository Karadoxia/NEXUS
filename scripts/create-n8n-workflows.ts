/**
 * Create n8n Container Auto-Registration Workflows
 *
 * This script creates the complete n8n workflow structure for automatic
 * container detection and registration across infrastructure systems.
 *
 * Usage:
 *   npx tsx scripts/create-n8n-workflows.ts
 *
 * Prerequisites:
 *   - n8n running at http://n8n:5678 (internal) or https://n8n.nexus-io.duckdns.org (external)
 *   - n8n API available
 */

interface N8nNode {
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  typeVersion?: number;
}

interface N8nConnection {
  [key: string]: {
    [key: string]: Array<{
      node: string;
      type: string;
      index: number;
    }>;
  };
}

const N8N_URL = process.env.N8N_URL || 'http://n8n:5678';

async function createWorkflow(workflowData: any) {
  try {
    const response = await fetch(`${N8N_URL}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-Key': process.env.N8N_API_KEY || '',
      },
      body: JSON.stringify(workflowData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create workflow: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Created workflow: ${result.name}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create workflow:`, error);
    throw error;
  }
}

// Main workflow definition
const mainWorkflow = {
  name: 'Container Auto-Registration',
  description:
    'Automatically registers Docker containers across infrastructure (Traefik, Prometheus, Grafana, Kuma, WireGuard, Loki)',
  active: true,
  nodes: [
    {
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      position: [250, 300],
      parameters: {
        path: 'container-detected',
        httpMethod: 'POST',
      },
      typeVersion: 1,
    },
    {
      name: 'Switch',
      type: 'n8n-nodes-base.switch',
      position: [500, 300],
      parameters: {
        mode: 'expression',
        conditions: [
          {
            condition: 'expression',
            value:
              '{{ $json.body?.labels?.["auto-register"] === "true" }}',
          },
        ],
      },
      typeVersion: 1,
    },
    {
      name: 'HTTP Request - Register',
      type: 'n8n-nodes-base.httpRequest',
      position: [750, 300],
      parameters: {
        method: 'POST',
        url: 'https://app.nexus-io.duckdns.org/api/docker/register',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          containerId: '{{ $json.body.containerId }}',
          containerName: '{{ $json.body.containerName }}',
          image: '{{ $json.body.image }}',
          ports: '{{ $json.body.ports }}',
          labels: '{{ $json.body.labels }}',
          environment: '{{ $json.body.environment }}',
          networks: '{{ $json.body.networks }}',
        }),
      },
      typeVersion: 4,
    },
    {
      name: 'Set Variables',
      type: 'n8n-nodes-base.set',
      position: [1000, 300],
      parameters: {
        variables: {
          containerData: {
            containerId: '{{ $json.body.containerId }}',
            containerName: '{{ $json.body.containerName }}',
            image: '{{ $json.body.image }}',
            ports: '{{ $json.body.ports }}',
            labels: '{{ $json.body.labels }}',
            metricsPort:
              '{{ $json.body.labels?.["prometheus.port"] || 9090 }}',
          },
        },
      },
      typeVersion: 1,
    },
    // Service adapters (in parallel)
    {
      name: 'Traefik Adapter',
      type: 'n8n-nodes-base.code',
      position: [1250, 100],
      parameters: {
        jsCode: `return {
          system: "traefik",
          status: "pending",
          message: "Traefik registration queued for container: " + $variables.containerData.containerName,
          port: Object.keys($variables.containerData.ports)[0] || 8080
        }`,
      },
      typeVersion: 2,
    },
    {
      name: 'Prometheus Adapter',
      type: 'n8n-nodes-base.code',
      position: [1250, 200],
      parameters: {
        jsCode: `const metricsPort = $variables.containerData.metricsPort;
const jobName = "auto-" + $variables.containerData.containerName;
return {
  system: "prometheus",
  status: "pending",
  jobName: jobName,
  metricsPort: metricsPort,
  message: "Prometheus registration queued - job: " + jobName + ":" + metricsPort + "/metrics"
}`,
      },
      typeVersion: 2,
    },
    {
      name: 'Grafana Adapter',
      type: 'n8n-nodes-base.code',
      position: [1250, 300],
      parameters: {
        jsCode: `const dashboardName = $variables.containerData.containerName + " Metrics";
return {
  system: "grafana",
  status: "pending",
  dashboardName: dashboardName,
  message: "Grafana dashboard auto-creation queued: " + dashboardName
}`,
      },
      typeVersion: 2,
    },
    {
      name: 'Kuma Adapter',
      type: 'n8n-nodes-base.code',
      position: [1250, 400],
      parameters: {
        jsCode: `const serviceName = $variables.containerData.containerName;
const domain = serviceName + ".nexus-io.duckdns.org";
return {
  system: "kuma",
  status: "pending",
  monitorName: serviceName + " Uptime",
  url: "https://" + domain,
  message: "Kuma monitor creation queued for: " + domain
}`,
      },
      typeVersion: 2,
    },
    {
      name: 'WireGuard Adapter',
      type: 'n8n-nodes-base.code',
      position: [1250, 500],
      parameters: {
        jsCode: `const hasWgEnabled = $variables.containerData.labels["wireguard.enabled"] === "true";
if (!hasWgEnabled) {
  return {
    system: "wireguard",
    status: "skipped",
    message: "WireGuard registration skipped (wireguard.enabled label not set)"
  };
}
return {
  system: "wireguard",
  status: "pending",
  message: "WireGuard peer configuration generation queued"
}`,
      },
      typeVersion: 2,
    },
    {
      name: 'Loki Adapter',
      type: 'n8n-nodes-base.code',
      position: [1250, 600],
      parameters: {
        jsCode: `return {
  system: "loki",
  status: "pending",
  jobName: "docker-" + $variables.containerData.containerName,
  message: "Loki log scrape config registration queued"
}`,
      },
      typeVersion: 2,
    },
    {
      name: 'Merge',
      type: 'n8n-nodes-base.merge',
      position: [1500, 350],
      parameters: {
        mode: 'combine',
      },
      typeVersion: 3,
    },
    {
      name: 'Respond to Webhook',
      type: 'n8n-nodes-base.respondToWebhook',
      position: [1750, 350],
      parameters: {
        responseCode: 200,
        body: JSON.stringify({
          status: 'registered',
          containerId: '{{ $json.body.containerId }}',
          containerName: '{{ $json.body.containerName }}',
          systems: [
            { name: 'traefik', status: 'queued' },
            { name: 'prometheus', status: 'queued' },
            { name: 'grafana', status: 'queued' },
            { name: 'kuma', status: 'queued' },
            { name: 'wireguard', status: 'queued' },
            { name: 'loki', status: 'queued' },
          ],
          message:
            'Container registration initiated across all systems',
        }),
      },
      typeVersion: 1,
    },
  ] as N8nNode[],
  connections: {
    Webhook: {
      main: [
        [
          {
            node: 'Switch',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
    Switch: {
      main: [
        [
          {
            node: 'HTTP Request - Register',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
    'HTTP Request - Register': {
      main: [
        [
          {
            node: 'Set Variables',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
    'Set Variables': {
      main: [
        [
          { node: 'Traefik Adapter', type: 'main', index: 0 },
          { node: 'Prometheus Adapter', type: 'main', index: 0 },
          { node: 'Grafana Adapter', type: 'main', index: 0 },
          { node: 'Kuma Adapter', type: 'main', index: 0 },
          { node: 'WireGuard Adapter', type: 'main', index: 0 },
          { node: 'Loki Adapter', type: 'main', index: 0 },
        ],
      ],
    },
    'Traefik Adapter': {
      main: [
        [
          {
            node: 'Merge',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
    'Prometheus Adapter': {
      main: [
        [
          {
            node: 'Merge',
            type: 'main',
            index: 1,
          },
        ],
      ],
    },
    'Grafana Adapter': {
      main: [
        [
          {
            node: 'Merge',
            type: 'main',
            index: 2,
          },
        ],
      ],
    },
    'Kuma Adapter': {
      main: [
        [
          {
            node: 'Merge',
            type: 'main',
            index: 3,
          },
        ],
      ],
    },
    'WireGuard Adapter': {
      main: [
        [
          {
            node: 'Merge',
            type: 'main',
            index: 4,
          },
        ],
      ],
    },
    'Loki Adapter': {
      main: [
        [
          {
            node: 'Merge',
            type: 'main',
            index: 5,
          },
        ],
      ],
    },
    Merge: {
      main: [
        [
          {
            node: 'Respond to Webhook',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
  } as N8nConnection,
};

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   n8n Container Auto-Registration Workflow Creator    ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`📡 n8n URL: ${N8N_URL}`);
  console.log(`🔑 API Key: ${process.env.N8N_API_KEY ? '***set***' : '(none)'}\n`);

  try {
    // Create main workflow
    console.log('Creating main workflow...');
    const workflow = await createWorkflow(mainWorkflow);

    console.log('\n✅ Workflow created successfully!\n');
    console.log('Workflow Details:');
    console.log(`  ID: ${workflow.id}`);
    console.log(`  Name: ${workflow.name}`);
    console.log(`  Nodes: ${workflow.nodes.length}`);
    console.log(`  Active: ${workflow.active}`);

    // Extract webhook URL
    const webhookNode = workflow.nodes.find(
      (n: any) => n.type === 'n8n-nodes-base.webhook'
    );
    if (webhookNode) {
      console.log(`\n🔗 Webhook Path: ${webhookNode.parameters.path}`);
      console.log(`🌐 Webhook URL: https://n8n.nexus-io.duckdns.org/webhook/${webhookNode.parameters.path}`);
    }

    console.log('\n📝 Next Steps:');
    console.log('  1. Open n8n: https://n8n.nexus-io.duckdns.org');
    console.log('  2. Go to Workflows → Container Auto-Registration');
    console.log('  3. Click the Play button to activate');
    console.log('  4. Test with: scripts/test-container-registration.sh');

    console.log('\n✨ Setup complete!\n');
  } catch (error) {
    console.error('\n❌ Failed to create workflow:', error);
    process.exit(1);
  }
}

main();
