import Link from 'next/link';

export default function MonitoringPage() {
  const links = [
    { label: 'WireGuard', url: process.env.NEXT_PUBLIC_WIREGUARD_URL || 'http://localhost:51821/' },
    { label: 'Wazuh (SIEM)', url: process.env.NEXT_PUBLIC_WAZUH_URL || 'https://localhost/app/login?nextUrl=%2Fapp%2Fwz-home' },
    { label: 'Grafana', url: process.env.NEXT_PUBLIC_GRAFANA_URL || 'http://localhost:3000/d/nexus-overview-v1/nexus-security-stack-e28094-overview?orgId=1&from=now-3h&to=now&timezone=browser&var-DS_PROMETHEUS=PBFA97CFB590B2093&refresh=30s' },
    { label: 'Traefik Proxy', url: process.env.NEXT_PUBLIC_TRAEFIK_URL || 'http://localhost:8585/dashboard/#/http/middlewares' },
    { label: 'Cloudflare', url: process.env.NEXT_PUBLIC_CLOUDFLARE_URL || 'https://dash.cloudflare.com/32947a70bdbf6628bf80156073c9f56a/registrar/register' },
  ];

  return (
    <div className="p-8 max-w-screen-md">
      <h1 className="text-2xl font-bold text-white mb-4">Operations Dashboard</h1>
      <p className="text-sm text-slate-400 mb-6">
        Quick access links to local services and infrastructure tools. Only reachable when
        running on the same host or via VPN.
      </p>
      <ul className="space-y-2">
        {links.map(({ label, url }) => (
          <li key={label}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-400 hover:underline"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
