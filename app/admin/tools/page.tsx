import {
  ExternalLink,
  Activity,
  BarChart3,
  Lock,
  Workflow,
  Shield,
  Radio,
  LayoutGrid,
  Database,
  Container,
} from 'lucide-react';

interface Tool {
  name: string;
  description: string;
  localUrl: string;
  publicUrl?: string;
  icon: React.ElementType;
  color: string;
  category: string;
  badge?: string;
}

const TOOLS: Tool[] = [
  // Monitoring
  {
    name: 'Grafana',
    description: 'Dashboards, metrics visualisation, and alerting for all NEXUS services.',
    localUrl: 'http://nexus-grafana.local',
    publicUrl: 'https://grafana.nexus-io.duckdns.org',
    icon: BarChart3,
    color: 'from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400',
    category: 'Monitoring',
  },
  {
    name: 'Prometheus',
    description: 'Time-series metrics database. Scrapes the app, Redis, and infra endpoints.',
    localUrl: 'http://nexus-prometheus.local',
    icon: Activity,
    color: 'from-red-500/20 to-red-500/5 border-red-500/20 text-red-400',
    category: 'Monitoring',
    badge: 'Internal only',
  },
  {
    name: 'Uptime Kuma',
    description: 'Self-hosted uptime & status-page monitor. Get notified when services go down.',
    localUrl: 'http://nexus-uptime.local',
    publicUrl: 'https://status.nexus-io.duckdns.org',
    icon: Radio,
    color: 'from-green-500/20 to-green-500/5 border-green-500/20 text-green-400',
    category: 'Monitoring',
  },
  // Infrastructure
  {
    name: 'Portainer',
    description: 'Centralized container management and Docker introspection dashboard.',
    localUrl: 'http://nexus-portainer.local',
    publicUrl: 'https://portainer.nexus-io.duckdns.org',
    icon: Container,
    color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    category: 'Infrastructure',
  },
  {
    name: 'Traefik',
    description: 'Reverse-proxy dashboard — view routers, services, and TLS certificates.',
    localUrl: 'http://nexus-traefik.local',
    icon: Container,

    color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    category: 'Infrastructure',
    badge: 'Internal only',
  },
  {
    name: 'VaultWarden',
    description: 'Self-hosted Bitwarden-compatible password manager. Uses localhost:8080 locally — web vault requires a TLS secure context (HTTPS or localhost).',
    localUrl: 'http://localhost:8080',
    publicUrl: 'https://vault.nexus-io.duckdns.org',
    icon: Lock,
    color: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    category: 'Infrastructure',
    badge: 'localhost:8080',
  },
  {
    name: 'Loki',
    description: 'Log aggregation system. Query container logs via LogQL in Grafana.',
    localUrl: 'http://nexus-loki.local',
    icon: Database,
    color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
    category: 'Infrastructure',
    badge: 'Internal only',
  },
  // Automation
  {
    name: 'n8n',
    description: 'Workflow automation engine — connect APIs, automate tasks, build pipelines.',
    localUrl: 'http://nexus-n8n.local',
    publicUrl: 'https://n8n.nexus-io.duckdns.org',
    icon: Workflow,
    color: 'from-pink-500/20 to-pink-500/5 border-pink-500/20 text-pink-400',
    category: 'Automation',
  },
  // Security
  {
    name: 'WireGuard VPN',
    description: 'VPN management UI (wg-easy). Manage peers and download configs.',
    localUrl: 'http://nexus-vpn.local',
    publicUrl: 'https://vpn.nexus-io.duckdns.org',
    icon: Shield,
    color: 'from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-400',
    category: 'Security',
  },
  {
    name: 'Nginx Proxy Manager',
    description: 'SSL certificate management UI — issue, view, and auto-renew Let\'s Encrypt certs. Supports DNS challenge for wildcard certs (no port-80 conflict with Traefik). Default login: admin@example.com / changeme.',
    localUrl: 'http://nexus-npm.local',
    publicUrl: 'https://npm.nexus-io.duckdns.org',
    icon: Lock,
    color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    category: 'Security',
    badge: 'localhost:81',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Monitoring: 'bg-green-500/10 text-green-400 border-green-500/20',
  Infrastructure: 'bg-blue-500/10  text-blue-400  border-blue-500/20',
  Automation: 'bg-pink-500/10  text-pink-400  border-pink-500/20',
  Security: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <div className={`relative flex flex-col bg-gradient-to-br ${tool.color} border rounded-2xl p-5 hover:scale-[1.01] transition-transform`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-xl border bg-slate-900/60 ${tool.color}`}>
            {/* @ts-ignore */}
            <Icon size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{tool.name}</p>
            {tool.badge && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded-full border border-slate-700/50">
                {tool.badge}
              </span>
            )}
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${CATEGORY_COLORS[tool.category]}`}>
          {tool.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed flex-1 mb-4">{tool.description}</p>

      {/* Links */}
      <div className="flex flex-wrap gap-2">
        <a
          href={tool.localUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-colors"
        >
          <LayoutGrid size={11} />
          Local access
          <ExternalLink size={10} className="opacity-60" />
        </a>
        {tool.publicUrl && (
          <a
            href={tool.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-colors"
          >
            Public
            <ExternalLink size={10} className="opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function ToolsPage() {
  const categories = [...new Set(TOOLS.map((t) => t.category))];

  return (
    <div className="p-8 max-w-screen-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Infrastructure Tools</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          All self-hosted services — 100% free &amp; open source
        </p>
      </div>

      {/* Setup banner */}
      <div className="mb-8 flex items-start gap-3 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
        <Activity size={16} className="text-cyan-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-cyan-300 mb-1">Local Access Setup</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            To access services by name in your browser, run:
          </p>
          <code className="mt-1 block text-xs text-cyan-300 bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 font-mono">
            sudo ./scripts/register-local-hosts.sh add
          </code>
          <p className="text-xs text-slate-500 mt-1">
            Then open any &quot;Local access&quot; link below directly in your browser.
          </p>
        </div>
      </div>

      {/* Tool grid by category */}
      {categories.map((cat) => (
        <section key={cat} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{cat}</h2>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {TOOLS.filter((t) => t.category === cat).map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
