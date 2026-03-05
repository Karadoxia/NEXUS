import { useState } from "react";

// ═══════════════════════════════════════════
// DOMAIN: nexus-io.duckdns.org
// ═══════════════════════════════════════════

const DOMAIN = "nexus-io.duckdns.org";

const SUBDOMAINS = [
  // ── PUBLIC ──────────────────────────────
  { sub: "", label: "Shop / App", service: "nexus-app", port: 3000, zone: "PUBLIC", icon: "🛒", color: "#00ff88", desc: "Main storefront + customer accounts", traefik: true },
  { sub: "auth", label: "SSO / Auth", service: "nexus-keycloak", port: 8080, zone: "PUBLIC", icon: "🔐", color: "#00ff88", desc: "Keycloak OIDC — login for all services", traefik: true },
  { sub: "uptime", label: "Status Page", service: "nexus-uptime-kuma", port: 3001, zone: "PUBLIC", icon: "🟢", color: "#00ff88", desc: "Public uptime monitor — customers can see this", traefik: true },
  // ── VPN / LAN ONLY ───────────────────────
  { sub: "grafana", label: "Grafana", service: "nexus-grafana", port: 3000, zone: "VPN", icon: "📊", color: "#ff8800", desc: "Monitoring dashboards — admin only", traefik: true },
  { sub: "portainer", label: "Portainer", service: "nexus-portainer", port: 9000, zone: "VPN", icon: "🐋", color: "#ff8800", desc: "Container management — admin only", traefik: true },
  { sub: "n8n", label: "N8N", service: "nexus-n8n", port: 5678, zone: "VPN", icon: "⚡", color: "#ff8800", desc: "Workflow automation — admin only", traefik: true },
  { sub: "vault", label: "Vaultwarden", service: "nexus-vaultwarden", port: 80, zone: "VPN", icon: "🗄️", color: "#ff8800", desc: "Password/secrets manager — admin only", traefik: true },
  { sub: "ldap", label: "LLDAP Admin", service: "nexus-lldap", port: 17170, zone: "VPN", icon: "👥", color: "#ff8800", desc: "User/group management — super admin only", traefik: true },
  { sub: "semaphore", label: "Semaphore", service: "nexus-semaphore", port: 3000, zone: "VPN", icon: "🚀", color: "#ff8800", desc: "Ansible deploy — infra admin only", traefik: true },
  { sub: "loki", label: "Loki Logs", service: "nexus-loki", port: 3100, zone: "VPN", icon: "📝", color: "#ff8800", desc: "Log aggregation — admin only", traefik: true },
  // ── LAN ONLY (no WAN exposure) ───────────
  { sub: "npm", label: "Nginx PM", service: "nexus-nginx-pm", port: 81, zone: "LAN", icon: "🌐", color: "#aa44ff", desc: "Proxy manager admin — LAN only", traefik: false },
  { sub: "prometheus", label: "Prometheus", service: "nexus-prometheus", port: 9090, zone: "LAN", icon: "🔥", color: "#aa44ff", desc: "Metrics — LAN only, no public exposure", traefik: false },
  { sub: "alerts", label: "Alertmanager", service: "nexus-alertmanager", port: 9093, zone: "LAN", icon: "🚨", color: "#aa44ff", desc: "Alert routing — LAN only", traefik: false },
  { sub: "pgadmin", label: "PGAdmin", service: "nexus-postgres", port: 5432, zone: "LAN", icon: "🐘", color: "#aa44ff", desc: "DB admin — LAN only, never public", traefik: false },
];

const DOCKER_NETWORKS = [
  {
    id: "frontend", name: "nexus-frontend", color: "#00ff88", internal: false,
    desc: "Public-facing. Traefik lives here. Internet-reachable.",
    services: ["nexus-traefik", "nexus-nginx-pm"],
    subnet: "172.20.0.0/24",
  },
  {
    id: "backend", name: "nexus-backend", color: "#00d4ff", internal: false,
    desc: "App tier. Backend services. Reachable from frontend via Traefik.",
    services: ["nexus-app", "nexus-n8n", "nexus-n8n-mcp", "nexus-vaultwarden"],
    subnet: "172.20.1.0/24",
  },
  {
    id: "identity", name: "nexus-identity", color: "#ff88cc", internal: true,
    desc: "Identity only. lldap + keycloak. No direct internet access.",
    services: ["nexus-lldap", "nexus-keycloak"],
    subnet: "172.20.2.0/24",
  },
  {
    id: "data", name: "nexus-data", color: "#ff8800", internal: true,
    desc: "Databases only. internal: true — unreachable from outside.",
    services: ["nexus-postgres", "nexus-postgres-ai", "nexus-redis"],
    subnet: "172.20.3.0/24",
  },
  {
    id: "monitoring", name: "nexus-monitoring", color: "#b44af0", internal: true,
    desc: "Monitoring plane. Scrapers, dashboards. internal: true.",
    services: ["nexus-prometheus", "nexus-grafana", "nexus-loki", "nexus-alertmanager", "nexus-cadvisor", "nexus-node-exporter", "nexus-pushgateway"],
    subnet: "172.20.4.0/24",
  },
  {
    id: "security", name: "nexus-security", color: "#ff4444", internal: true,
    desc: "Security agents. CrowdSec, Falco, Trivy. Isolated.",
    services: ["nexus-crowdsec", "nexus-falco", "nexus-trivy-cron"],
    subnet: "172.20.5.0/24",
  },
  {
    id: "vpn", name: "nexus-vpn", color: "#ffdd00", internal: false,
    desc: "WireGuard VPN. Admin access tunnel into LAN-only services.",
    services: ["nexus-wireguard"],
    subnet: "10.13.13.0/24",
  },
];

const DB_CONNECTIONS = [
  // nexus-postgres
  { db: "nexus-postgres", database: "shop_db",    client: "nexus-app",       role: "shop_role",       net: "nexus-data + nexus-backend", color: "#00ff88" },
  { db: "nexus-postgres", database: "lldap",       client: "nexus-lldap",     role: "lldap_role",      net: "nexus-data + nexus-identity", color: "#ff88cc" },
  { db: "nexus-postgres", database: "keycloak",    client: "nexus-keycloak",  role: "keycloak_role",   net: "nexus-data + nexus-identity", color: "#ff88cc" },
  { db: "nexus-postgres", database: "n8n",         client: "nexus-n8n",       role: "n8n_role",        net: "nexus-data + nexus-backend", color: "#00d4ff" },
  { db: "nexus-postgres", database: "semaphore",   client: "nexus-semaphore", role: "semaphore_role",  net: "nexus-data + nexus-backend", color: "#00d4ff" },
  { db: "nexus-postgres", database: "grafana",     client: "nexus-grafana",   role: "grafana_role",    net: "nexus-data + nexus-monitoring", color: "#b44af0" },
  { db: "nexus-postgres", database: "uptime_kuma", client: "nexus-uptime-kuma", role: "uptime_role",   net: "nexus-data + nexus-backend", color: "#00ff88" },
  // nexus-postgres-ai
  { db: "nexus-postgres-ai", database: "ai_vectors", client: "nexus-app (AI routes)", role: "ai_role", net: "nexus-data + nexus-backend", color: "#aa44ff" },
  { db: "nexus-postgres-ai", database: "ai_memory",  client: "nexus-n8n (AI workflows)", role: "ai_role", net: "nexus-data + nexus-backend", color: "#aa44ff" },
  // redis
  { db: "nexus-redis", database: "db0 (cache)",  client: "nexus-app",    role: "AUTH password", net: "nexus-data + nexus-backend", color: "#ff4444" },
  { db: "nexus-redis", database: "db1 (sessions)", client: "nexus-app",  role: "AUTH password", net: "nexus-data + nexus-backend", color: "#ff4444" },
  { db: "nexus-redis", database: "db2 (queues)",  client: "nexus-n8n",   role: "AUTH password", net: "nexus-data + nexus-backend", color: "#ff4444" },
];

const CONFIGS = {
  traefik_tls: `# /config/traefik/traefik.yml (static config)
# ════════════════════════════════════════════

global:
  checkNewVersion: false
  sendAnonymousUsage: false

api:
  dashboard: true
  insecure: false             # dashboard only via VPN

log:
  level: INFO

accessLog:
  filePath: "/logs/access.log"
  format: json

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true

  websecure:
    address: ":443"
    http:
      middlewares:
        - security-headers@file
    forwardedHeaders:
      trustedIPs:
        - "103.21.244.0/22"
        - "103.22.200.0/22"
        - "10.13.13.0/24"     # WireGuard

providers:
  docker:
    exposedByDefault: false
    network: nexus-frontend
  file:
    directory: /config/dynamic
    watch: true

certificatesResolvers:
  duckdns:
    acme:
      email: caspertech78@gmail.com
      storage: /acme/acme.json
      dnsChallenge:
        provider: duckdns
        delayBeforeCheck: 10`,

  traefik_dynamic: `# /config/traefik/dynamic/middlewares.yml
# ════════════════════════════════════════════

http:
  middlewares:

    # ── IP WHITELIST — VPN + LAN only ──────
    vpn-whitelist:
      ipWhiteList:
        sourceRange:
          - "10.13.13.0/24"      # WireGuard VPN
          - "192.168.1.0/24"     # LAN direct
          - "127.0.0.1/32"       # localhost

    # ── RATE LIMITING ───────────────────────
    rate-limit-public:
      rateLimit:
        average: 100
        burst: 50
        period: 1m

    rate-limit-auth:
      rateLimit:
        average: 5
        burst: 3
        period: 15m

    # ── SECURITY HEADERS ────────────────────
    security-headers:
      headers:
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        stsPreload: true
        forceSTSHeader: true
        frameDeny: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"

    # ── REDIRECT HTTP → HTTPS ───────────────
    redirect-https:
      redirectScheme:
        scheme: https
        permanent: true`,

  traefik_routers: `# /config/traefik/dynamic/routers.yml
# ════════════════════════════════════════════

http:
  routers:

    # ════ PUBLIC ZONE ════════════════════════

    nexus-app:
      rule: "Host(\`nexus-io.duckdns.org\`)"
      service: nexus-app
      tls:
        certResolver: duckdns
      middlewares:
        - redirect-https
        - security-headers
        - rate-limit-public

    nexus-auth:
      rule: "Host(\`auth.nexus-io.duckdns.org\`)"
      service: nexus-keycloak
      tls:
        certResolver: duckdns
      middlewares:
        - redirect-https
        - security-headers
        - rate-limit-auth

    # ════ VPN/LAN ZONE ═══════════════════════

    nexus-grafana:
      rule: "Host(\`grafana.nexus-io.duckdns.org\`)"
      service: nexus-grafana
      tls:
        certResolver: duckdns
      middlewares:
        - vpn-whitelist
        - security-headers

    nexus-portainer:
      rule: "Host(\`portainer.nexus-io.duckdns.org\`)"
      service: nexus-portainer
      tls:
        certResolver: duckdns
      middlewares:
        - vpn-whitelist
        - security-headers

    nexus-n8n:
      rule: "Host(\`n8n.nexus-io.duckdns.org\`)"
      service: nexus-n8n
      tls:
        certResolver: duckdns
      middlewares:
        - vpn-whitelist
        - security-headers

  services:
    nexus-app:
      loadBalancer:
        servers:
          - url: "http://nexus-app:3000"
    nexus-keycloak:
      loadBalancer:
        servers:
          - url: "http://nexus-keycloak:8080"
    nexus-grafana:
      loadBalancer:
        servers:
          - url: "http://nexus-grafana:3000"`,

  docker_networks: `# docker-compose.yml — Network definitions
# ════════════════════════════════════════════

networks:

  # ── PUBLIC FACING ──────────────────────────
  nexus-frontend:
    name: nexus-frontend
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/24

  # ── APPLICATION TIER ───────────────────────
  nexus-backend:
    name: nexus-backend
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.1.0/24

  # ── IDENTITY PLANE ─────────────────────────
  nexus-identity:
    name: nexus-identity
    driver: bridge
    internal: true              # NO external routing
    ipam:
      config:
        - subnet: 172.20.2.0/24

  # ── DATA PLANE ─────────────────────────────
  nexus-data:
    name: nexus-data
    driver: bridge
    internal: true              # NEVER reachable from outside
    ipam:
      config:
        - subnet: 172.20.3.0/24

services:
  nexus-traefik:
    networks: [nexus-frontend]

  nexus-app:
    networks: [nexus-frontend, nexus-backend, nexus-data]

  nexus-postgres:
    networks: [nexus-data]

  nexus-lldap:
    networks: [nexus-backend, nexus-identity, nexus-data]`,
};

const ADMIN_TOOLS = [
  { name: "Portainer", url: "portainer.nexus-io.duckdns.org", icon: "🐋", color: "#00d4ff", access: "infra_admin+", what: "Manage all 33 containers, volumes, networks, logs", from: "VPN only", actions: ["Start/stop/restart containers", "View real-time logs", "Inspect volumes", "Shell into containers (admin)", "Manage Docker networks"] },
  { name: "Grafana", url: "grafana.nexus-io.duckdns.org", icon: "📊", color: "#ff8800", access: "all staff", what: "Infrastructure + business metrics dashboards", from: "VPN only", actions: ["Container CPU/RAM per container", "Business revenue dashboard", "Alert management", "LDAP role → dashboard access", "Loki log search"] },
  { name: "Semaphore", url: "semaphore.nexus-io.duckdns.org", icon: "🚀", color: "#00ff88", access: "infra_admin+", what: "Ansible playbook web UI — deploy without SSH", from: "VPN only", actions: ["1-click service deploy", "Backup playbooks", "Update images", "Audit trail of all runs", "Scheduled jobs"] },
  { name: "LLDAP", url: "ldap.nexus-io.duckdns.org", icon: "👑", color: "#ffd700", access: "super_admin ONLY", what: "User/group management for all staff and clients", from: "WireGuard IP only", actions: ["Create/disable users", "Assign roles/groups", "Password reset emails", "View all groups", "Client account management"] },
  { name: "N8N", url: "n8n.nexus-io.duckdns.org", icon: "⚡", color: "#aa44ff", access: "infra_admin+", what: "Workflow automation — order emails, notifications", from: "VPN only", actions: ["Outbox event processor", "Order confirmation emails", "Telegram alerts", "Scheduled backups", "LDAP sync workflows"] },
  { name: "Vaultwarden", url: "vault.nexus-io.duckdns.org", icon: "🗄️", color: "#ff88cc", access: "admin+ (own vault)", what: "Password + secrets manager", from: "VPN only", actions: ["Store all service passwords", "API keys", "TLS certificates", "Share secrets with team", "Audit access log"] },
  { name: "Uptime Kuma", url: "uptime.nexus-io.duckdns.org", icon: "🟢", color: "#00ff88", access: "PUBLIC", what: "Service status page — customers can see this", from: "Public internet", actions: ["Monitor all subdomains", "SSL cert expiry", "Response time", "Public status page", "Telegram/email alerts"] },
];

const zoneColor = { PUBLIC: "#00ff88", VPN: "#ff8800", LAN: "#aa44ff" };
const zoneBg = { PUBLIC: "#00ff8815", VPN: "#ff880015", LAN: "#aa44ff15" };

function Pulse({ color, size = 8 }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite", opacity: 0.4 }} />
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
      <style>{`@keyframes ping { 0%{transform:scale(1);opacity:.4} 75%,100%{transform:scale(2);opacity:0} }`}</style>
    </span>
  );
}

function SubdomainTable() {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? SUBDOMAINS : SUBDOMAINS.filter(s => s.zone === filter);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: "#334", letterSpacing: "0.15em" }}>FILTER:</span>
        {["ALL", "PUBLIC", "VPN", "LAN"].map(z => (
          <button key={z} onClick={() => setFilter(z)} style={{
            padding: "4px 12px", borderRadius: 5, border: `1px solid ${filter === z ? (zoneColor[z] || "#00d4ff") : "rgba(255,255,255,0.08)"}`,
            background: filter === z ? `${(zoneColor[z] || "#00d4ff")}18` : "transparent",
            color: filter === z ? (zoneColor[z] || "#00d4ff") : "#445",
            cursor: "pointer", fontSize: 9, fontFamily: "monospace", fontWeight: 700,
          }}>{z}</button>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["SUBDOMAIN", "SERVICE", "ZONE", "MIDDLEWARES", "IP RESTRICTION", "TLS"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#334", fontSize: 8, letterSpacing: "0.12em", fontFamily: "monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const full = s.sub ? `${s.sub}.${DOMAIN}` : DOMAIN;
              const zc = zoneColor[s.zone] || "#aaa";
              return (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: zc }}>{s.icon} {full}</div>
                    <div style={{ fontSize: 8, color: "#334", marginTop: 2 }}>{s.desc}</div>
                  </td>
                  <td style={{ padding: "8px 10px", fontFamily: "monospace", fontSize: 9, color: "#778" }}>{s.service}:{s.port}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: `${zc}18`, color: zc, fontSize: 8, fontWeight: 800, fontFamily: "monospace" }}>{s.zone}</span>
                  </td>
                  <td style={{ padding: "8px 10px", fontSize: 8, color: "#445", fontFamily: "monospace" }}>
                    {s.zone === "PUBLIC" ? "rate-limit, security-headers" :
                     s.zone === "VPN" ? "vpn-whitelist, security-headers" :
                     "LAN-only (no Traefik)"}
                  </td>
                  <td style={{ padding: "8px 10px", fontSize: 8, color: "#445", fontFamily: "monospace" }}>
                    {s.zone === "PUBLIC" ? "—" :
                     s.zone === "VPN" ? "10.13.13.0/24, 192.168.1.0/24" :
                     "192.168.x.x only"}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    {s.traefik ?
                      <span style={{ fontSize: 8, color: "#00ff88", fontFamily: "monospace" }}>✅ Wildcard</span> :
                      <span style={{ fontSize: 8, color: "#445", fontFamily: "monospace" }}>— direct</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CodePanel({ code, label, color = "#00ff88" }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ border: `1px solid ${color}33`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ background: `${color}0c`, borderBottom: `1px solid ${color}22`, padding: "7px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, color, fontFamily: "monospace", fontWeight: 800, letterSpacing: "0.08em" }}>{label}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ padding: "2px 10px", borderRadius: 4, background: copied ? "#00ff8820" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? "#00ff8844" : "rgba(255,255,255,0.1)"}`, color: copied ? "#00ff88" : "#556", cursor: "pointer", fontSize: 9, fontFamily: "monospace" }}>
          {copied ? "✅ COPIED" : "⎘ COPY"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "12px 14px", fontSize: 10, lineHeight: 1.85, color: "#8ab99a", background: "#020508", overflowX: "auto", fontFamily: "monospace", maxHeight: 340, overflowY: "auto" }}>{code}</pre>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("domains");
  const [selectedTool, setSelectedTool] = useState(null);

  const TABS = [
    { id: "domains", label: "🗺️ DOMAIN MAP" },
    { id: "admin", label: "🔧 ADMIN TOOLS" },
    { id: "config", label: "⚙️ TRAEFIK CONFIG" },
  ];

  return (
    <div style={{ background: "#030810", minHeight: "100vh", color: "#c8d4f0", fontFamily: "monospace" }}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #030810; }
        ::-webkit-scrollbar-thumb { background: #00ff8833; border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: "rgba(0,0,0,0.8)", borderBottom: "1px solid rgba(0,255,136,0.12)", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(10px)" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, background: "linear-gradient(90deg,#00ff88,#00d4ff,#ff8800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.08em" }}>
            NEXUS INFRASTRUCTURE — COMPLETE VISUAL GUIDE
          </div>
          <div style={{ fontSize: 8, color: "#334", letterSpacing: "0.2em", marginTop: 2 }}>
            nexus-io.duckdns.org · TRAEFIK · WIREGUARD VPN · DOCKER NETWORKS · POSTGRES CONSOLIDATED
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {[["🌍", "1 DOMAIN", "#00d4ff"], ["🔀", "6 NETWORKS", "#ff8800"], ["🗺️", "13 DOMAINS", "#00ff88"], ["🔒", "VPN SECURED", "#ffd700"]].map(([icon, label, color]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{icon}</div>
              <div style={{ fontSize: 7, color, fontWeight: 700, letterSpacing: "0.1em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.5)", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "9px 18px", background: tab === t.id ? "rgba(0,255,136,0.06)" : "transparent",
            border: "none", borderBottom: `2px solid ${tab === t.id ? "#00ff88" : "transparent"}`,
            color: tab === t.id ? "#00ff88" : "#445", cursor: "pointer",
            fontSize: 10, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em",
            whiteSpace: "nowrap", transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "16px 18px", overflow: "auto", maxHeight: "calc(100vh - 110px)" }}>

        {/* ── DOMAIN MAP ── */}
        {tab === "domains" && (
          <div>
            <div style={{ fontSize: 9, color: "#334", letterSpacing: "0.2em", marginBottom: 12 }}>▸ COMPLETE SUBDOMAIN MAP — nexus-io.duckdns.org</div>
            <SubdomainTable />
          </div>
        )}

        {/* ── ADMIN TOOLS ── */}
        {tab === "admin" && (
          <div>
            <div style={{ fontSize: 9, color: "#334", letterSpacing: "0.2em", marginBottom: 12 }}>▸ HOW TO ACCESS EACH ADMIN TOOL — FROM YOUR ADMIN PANEL</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 16 }}>
              {ADMIN_TOOLS.map((tool, i) => (
                <div key={i} onClick={() => setSelectedTool(selectedTool === i ? null : i)}
                  style={{ background: selectedTool === i ? `${tool.color}0e` : "rgba(0,0,0,0.3)", border: `1px solid ${selectedTool === i ? tool.color + "55" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{tool.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: tool.color }}>{tool.name}</span>
                        <span style={{ fontSize: 8, padding: "1px 7px", borderRadius: 3, background: `${zoneColor[tool.access] || tool.color}18`, color: zoneColor[tool.access] || tool.color, fontWeight: 700 }}>{tool.access}</span>
                      </div>
                      <div style={{ fontSize: 8, color: "#334", marginTop: 2, fontFamily: "monospace" }}>{tool.url}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: "#556", lineHeight: 1.5, marginBottom: 6 }}>{tool.what}</div>
                  {selectedTool === i && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${tool.color}22` }}>
                      <div style={{ fontSize: 8, color: tool.color, marginBottom: 6, fontWeight: 700, letterSpacing: "0.1em" }}>AVAILABLE ACTIONS:</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                        {tool.actions.map(a => (
                          <div key={a} style={{ fontSize: 9, color: "#445", padding: "3px 6px", background: `${tool.color}08`, borderRadius: 4, display: "flex", gap: 4 }}>
                            <span style={{ color: tool.color, fontSize: 7 }}>◆</span>{a}
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 8, color: "#334" }}>
                        🔒 Access from: <span style={{ color: tool.color, fontWeight: 700 }}>{tool.from}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONFIG ── */}
        {tab === "config" && (
          <div>
            <div style={{ fontSize: 9, color: "#334", letterSpacing: "0.2em", marginBottom: 14 }}>▸ COMPLETE TRAEFIK + DOCKER NETWORK CONFIGS</div>
            <CodePanel code={CONFIGS.traefik_tls} label="traefik.yml — Static config + DuckDNS Let's Encrypt" color="#00ff88" />
            <CodePanel code={CONFIGS.traefik_dynamic} label="dynamic/middlewares.yml — IP whitelist + rate-limit" color="#ff8800" />
            <CodePanel code={CONFIGS.traefik_routers} label="dynamic/routers.yml — All subdomain routes with middlewares" color="#00d4ff" />
            <CodePanel code={CONFIGS.docker_networks} label="docker-compose.yml — Network tier definitions" color="#b44af0" />
          </div>
        )}
      </div>
    </div>
  );
}
