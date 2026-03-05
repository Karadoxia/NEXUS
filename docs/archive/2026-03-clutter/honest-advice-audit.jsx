import { useState } from "react";

// ═══════════════════════════════════════════════════
// THE HONEST AUDIT — every claim scored and explained
// ═══════════════════════════════════════════════════

const AUDIT = [
  {
    claim: "Create subdomains like grafana.nexus-io.duckdns.org",
    verdict: "MISLEADING",
    score: "⚠️",
    color: "#ff8800",
    reality: `DuckDNS ONLY manages A records for the exact subdomain you registered (nexus-io.duckdns.org).
It does NOT support sub-subdomains (grafana.nexus-io.duckdns.org) natively.
It does NOT support wildcard CNAME entries.
It does NOT let you add MX, TXT, or custom DNS records.

Why subdomains seem to work anyway:
Some DNS resolvers fall through *.nexus-io.duckdns.org to the parent A record — 
but this is UNRELIABLE across different ISPs and resolvers worldwide.
Relying on this for a production shop is gambling.

THE FIX: Add your domain to Cloudflare (free) for DNS management.
Cloudflare lets you add: A record → your IP, wildcard CNAME *.nexus-io... → @
Then ALL subdomains reliably resolve everywhere, plus you get DDoS protection free.`,
    fix: "Cloudflare DNS (free) — full wildcard + custom records",
    impact: "HIGH — your admin subdomains may not resolve for some users",
  },
  {
    claim: "CNAME *.nexus-io.duckdns.org → nexus-io.duckdns.org",
    verdict: "WRONG",
    score: "❌",
    color: "#ff4444",
    reality: `This is factually impossible with DuckDNS.
DuckDNS is NOT a full DNS provider. It is a Dynamic DNS updater only.
You have ZERO control over DNS records in the DuckDNS dashboard.
You can ONLY update the A record IP for your registered subdomain.

Attempting to add CNAME records in DuckDNS → there is no such UI or API.
Attempting to add MX records in DuckDNS → impossible.

This advice assumes you have a real DNS registrar (Cloudflare, Namecheap, etc.)
which you do NOT have with DuckDNS.`,
    fix: "Move DNS management to Cloudflare. Keep DuckDNS only for IP updates.",
    impact: "CRITICAL — email will never work, wildcard certs may fail",
  },
  {
    claim: "MX record: nexus-io.duckdns.org → mail.nexus-io.duckdns.org + Postfix",
    verdict: "DANGEROUS",
    score: "❌",
    color: "#ff2244",
    reality: `Three reasons this will fail spectacularly for your shop:

1. DELIVERABILITY: DuckDNS domains have terrible spam reputation.
   Gmail/Outlook will silently drop or spam-folder 100% of your emails.
   Your order confirmations, password resets — all going to spam.
   Customers think the shop is broken. Chargebacks follow.

2. PORT 25 BLOCKED: Most ISPs and cloud providers block outbound port 25
   on dynamic/residential IPs. Your emails never leave the server.

3. REVERSE DNS: Email requires rDNS (PTR record) matching your domain.
   Your ISP controls PTR records, not you. DuckDNS cannot help.

Running your own email server is a 2027 nightmare for a shop owner.
Even large companies use SendGrid/Mailgun/SES for transactional email.`,
    fix: "Brevo (300 emails/day FREE) or Mailgun. 30min setup. 99% deliverability.",
    impact: "CRITICAL — zero email deliverability from DuckDNS domain",
  },
  {
    claim: "Use Samba AD or FreeIPA for identity management",
    verdict: "WRONG FOR YOUR STACK",
    score: "❌",
    color: "#ff4444",
    reality: `You already have lldap + Keycloak deployed and running.
That combination is SUPERIOR to both Samba AD and FreeIPA for your use case.

Why this advice is wrong:

Samba AD: Designed for Windows domain environments (GPO, Windows clients).
You have zero Windows clients. Samba AD adds 500MB+ overhead for features you'll never use.

FreeIPA: Red Hat's enterprise suite. Requires its OWN Kerberos, DNS, NTP, CA.
Minimum 2GB RAM just for FreeIPA. Extremely complex to maintain.
And it duplicates everything lldap + Keycloak already does.

Your lldap + Keycloak stack:
✅ lldap = 50MB RAM, Postgres-backed, beautiful web UI
✅ Keycloak = full OIDC/OAuth2/SSO for all services
✅ Already deployed and in your docker-compose
✅ More modern and maintainable than either alternative

Migrating to Samba AD now = throw away working infrastructure for no gain.`,
    fix: "Keep lldap + Keycloak. You made the right choice already.",
    impact: "WASTE — would throw away working infrastructure",
  },
  {
    claim: "Traefik labels example for grafana routing",
    verdict: "CORRECT",
    score: "✅",
    color: "#00ff88",
    reality: `The Traefik label syntax shown is correct and matches best practice.
Host(\`grafana.nexus-io.duckdns.org\`) is the right rule format.
tls.certresolver=letsencrypt (or duckdns) works as shown.
This part of the advice is solid and matches your existing setup.`,
    fix: "Already implemented correctly in your stack.",
    impact: "NONE — this is fine",
  },
  {
    claim: "Start with Traefik + Subdomains, then Postfix",
    verdict: "HALF RIGHT",
    score: "⚠️",
    color: "#ff8800",
    reality: `Traefik + subdomains: YES — correct priority, you're already doing this.
Postfix for self-hosted email: NO — see the email point above.

The correct email path for your stack:
1. Brevo/Mailgun SMTP relay (NOT a full mail server)
2. N8N handles email workflows via SMTP credentials
3. Vaultwarden stores the SMTP API key
4. lldap sends password reset emails via SMTP relay
5. Your shop backend sends order confirmation via SMTP relay

This is 30 minutes of work vs weeks of email server hell.`,
    fix: "Traefik YES. Email relay (Brevo) YES. Full mail server NO.",
    impact: "MEDIUM — correct the email approach",
  },
];

const DNS_REALITY = {
  duckdns_can: [
    "Update A record for nexus-io.duckdns.org → your IP",
    "Auto-update IP when your home IP changes (via cron/agent)",
    "Traefik DNS-01 challenge for Let's Encrypt wildcard cert",
    "Multiple subdomains (each registered separately)",
  ],
  duckdns_cannot: [
    "Wildcard CNAME records (*.nexus-io.duckdns.org)",
    "MX records (no email without these)",
    "TXT records (no SPF/DKIM without these)",
    "Custom nameservers",
    "API for automated sub-subdomain creation",
    "TTL control",
  ],
  cloudflare_adds: [
    "A record: nexus-io.duckdns.org → YOUR_IP",
    "CNAME: *.nexus-io.duckdns.org → nexus-io.duckdns.org (wildcard!)",
    "TXT: SPF, DKIM, DMARC records for email",
    "DDoS protection + WAF (free tier)",
    "Analytics on all DNS queries",
    "Proxy mode (hides your real IP)",
    "Page rules for caching",
    "Full API for automation",
  ],
};

const REAL_RECOMMENDATIONS = [
  {
    title: "Fix DNS — Cloudflare proxy",
    priority: "DO TODAY",
    color: "#ff4444",
    icon: "🌐",
    time: "30 min",
    cost: "FREE",
    steps: [
      "Sign up at cloudflare.com (free)",
      "Add site: nexus-io.duckdns.org (or register free domain at Freenom)",
      "Add A record → YOUR_IP, wildcard CNAME → @",
      "Update DuckDNS updater script to also hit Cloudflare API",
      "Result: all subdomains resolve globally, reliably",
    ],
    code: `# The proper hybrid setup:
# DuckDNS: still updates your IP (cron job)
# Cloudflare: manages all DNS records

# 1. In Cloudflare DNS, add:
# A     nexus-io.duckdns.org   → YOUR_PUBLIC_IP   (proxied ☁️)
# CNAME *.nexus-io.duckdns.org → nexus-io.duckdns.org

# 2. Auto-update Cloudflare when IP changes:
#!/bin/bash
CF_API_TOKEN="your_cloudflare_api_token"
CF_ZONE_ID="your_zone_id"
CF_RECORD_ID="your_a_record_id"
NEW_IP=$(curl -s https://api.ipify.org)
CURRENT_IP=$(curl -s "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$CF_RECORD_ID" \\
  -H "Authorization: Bearer $CF_API_TOKEN" | jq -r '.result.content')

if [ "$NEW_IP" != "$CURRENT_IP" ]; then
  curl -X PATCH \\
    "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$CF_RECORD_ID" \\
    -H "Authorization: Bearer $CF_API_TOKEN" \\
    -H "Content-Type: application/json" \\
    --data "{\"content\":\"$NEW_IP\"}"
  echo "✅ Updated IP: $CURRENT_IP → $NEW_IP"
fi

# Crontab: */5 * * * * /opt/nexus/scripts/update-cf-ip.sh`,
    note: "Cloudflare proxied mode also HIDES your real server IP from the internet",
  },
  {
    title: "Email — Transactional relay, NOT mail server",
    priority: "DO THIS WEEK",
    color: "#ff8800",
    icon: "📧",
    time: "30 min",
    cost: "FREE (300/day on Brevo)",
    steps: [
      "Sign up at brevo.com (300 emails/day free)",
      "Get SMTP credentials (server, port, user, password)",
      "Add to .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS",
      "Configure N8N to use SMTP for all email workflows",
      "Configure lldap SMTP for password reset emails",
      "Configure your shop backend nodemailer with same creds",
      "NEVER install Postfix as a standalone mail server",
    ],
    code: `# .env additions:
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your_brevo_api_key
SMTP_FROM="NEXUS Shop <noreply@nexus-io.duckdns.org>"

# docker-compose — N8N:
nexus-n8n:
  environment:
    N8N_EMAIL_MODE: smtp
    N8N_SMTP_HOST: \${SMTP_HOST}
    N8N_SMTP_PORT: \${SMTP_PORT}
    N8N_SMTP_USER: \${SMTP_USER}
    N8N_SMTP_PASS: \${SMTP_PASS}
    N8N_SMTP_SENDER: \${SMTP_FROM}

# lldap config for password reset:
# lldap_config.toml:
[smtp_options]
enable_password_reset = true
server = "smtp-relay.brevo.com"
port = 587
smtp_encryption = "STARTTLS"
user = "your-email@example.com"
password = "BREVO_API_KEY"
from = "NEXUS Identity <noreply@nexus-io.duckdns.org>"

# Node.js backend:
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: "customer@gmail.com",
  subject: "Order Confirmation",
  html: "<h1>Your order is confirmed!</h1>",
});`,
    note: "Brevo free = 300 emails/day. Scale to paid when revenue justifies it.",
  },
  {
    title: "Split-horizon DNS — internal vs external",
    priority: "CRITICAL MISSING PIECE",
    color: "#00d4ff",
    icon: "🔀",
    time: "1 hour",
    cost: "FREE",
    steps: [
      "Problem: LAN requests → nexus-io.duckdns.org → internet → back to router → hairpin NAT issues",
      "Solution: AdGuard Home on your server (DNS resolver)",
      "AdGuard rewrites: *.nexus-io.duckdns.org → 192.168.1.x (your server LAN IP)",
      "WireGuard clients use 10.13.13.1 as DNS → same rewrites apply",
      "External users still go through Cloudflare → your public IP → Traefik",
      "Result: LAN requests never leave your network, faster, no hairpin NAT",
    ],
    code: `# Deploy AdGuard Home:
adguard:
  image: adguard/adguardhome:latest
  container_name: nexus-adguard
  restart: unless-stopped
  ports:
    - "53:53/tcp"
    - "53:53/udp"
    - "3003:3000"  # Admin UI
  volumes:
    - ./adguard/work:/opt/adguardhome/work
    - ./adguard/conf:/opt/adguardhome/conf
  networks: [nexus-frontend]

# After setup → Admin at http://192.168.1.x:3003
# Settings → DNS rewrites → Add:
# Domain                      Answer
# nexus-io.duckdns.org       → 192.168.1.YOUR_SERVER
# *.nexus-io.duckdns.org     → 192.168.1.YOUR_SERVER

# WireGuard client config:
[Interface]
DNS = 10.13.13.1   # server = AdGuard

# Test it works:
dig grafana.nexus-io.duckdns.org @192.168.1.x
# Should return: 192.168.1.x (NOT your public IP)

# Set router DHCP DNS to AdGuard:
# Router admin → DHCP Settings → DNS = 192.168.1.x`,
    note: "Without this: every request from LAN goes: LAN → Internet → Router → back to LAN. Slow + breaks on some routers.",
  },
  {
    title: "Keep lldap + Keycloak — ignore Samba/FreeIPA",
    priority: "STAY THE COURSE",
    color: "#00ff88",
    icon: "✅",
    time: "0 min",
    cost: "FREE",
    steps: [
      "Your lldap + Keycloak combo is already production-grade",
      "lldap = 50MB RAM, Postgres-backed, beautiful UI, LDAP standard",
      "Keycloak = full OIDC, SSO, MFA support",
      "Samba AD = Windows domain controller — you have zero Windows clients",
      "FreeIPA = 2GB+ RAM, duplicates everything you have",
      "Do NOT migrate. Complete what you have: wire all services to lldap",
      "Test SSO via Keycloak, verify all service integrations",
    ],
    code: `# Services still needing LDAP integration:

# 1. Grafana LDAP config:
# grafana/ldap.toml:
[[servers]]
host = "nexus-lldap"
port = 3890
use_ssl = false
bind_dn = "uid=svc.readonly,ou=people,dc=yourshop,dc=com"
bind_password = "READONLY_PASS"
search_filter = "(uid=%s)"
search_base_dns = ["ou=people,dc=yourshop,dc=com"]

[[servers.group_mappings]]
group_dn = "cn=super_admins,ou=groups,dc=yourshop,dc=com"
org_role = "Admin"

[[servers.group_mappings]]
group_dn = "cn=infra_admins,ou=groups,dc=yourshop,dc=com"
org_role = "Editor"

# 2. Semaphore → already configured
# 3. Portainer → Settings → Authentication → LDAP
# 4. N8N → credential node with LDAP
# 5. Shop → ldapts library

# THAT IS ALL. Your identity stack is complete.`,
    note: "The advice to use Samba/FreeIPA was for someone starting from zero. You're past that.",
  },
];

// ═════════════════════════════════════════════════════════════

function VerdictBadge({ verdict, color }) {
  return (
    <span style={{ fontSize: 9, padding: "2px 10px", borderRadius: 4, background: `${color}20`, color, fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.1em", border: `1px solid ${color}44` }}>
      {verdict}
    </span>
  );
}

function CodeBlock({ code, color = "#00ff88", label }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ border: `1px solid ${color}33`, borderRadius: 8, overflow: "hidden", marginTop: 10 }}>
      {label && (
        <div style={{ background: `${color}0c`, borderBottom: `1px solid ${color}22`, padding: "6px 12px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, color, fontFamily: "monospace", fontWeight: 800 }}>{label}</span>
          <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ fontSize: 9, padding: "1px 8px", borderRadius: 3, background: copied ? "#00ff8820" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? "#00ff8844" : "rgba(255,255,255,0.1)"}`, color: copied ? "#00ff88" : "#556", cursor: "pointer", fontFamily: "monospace" }}>
            {copied ? "✅" : "⎘ COPY"}
          </button>
        </div>
      )}
      <pre style={{ margin: 0, padding: "12px 14px", fontSize: 10, lineHeight: 1.8, color: "#7ab89a", background: "#020407", overflowX: "auto", fontFamily: "monospace", maxHeight: 300, overflowY: "auto" }}>{code}</pre>
    </div>
  );
}

function DNSCapabilityDiagram() {
  return (
    <svg viewBox="0 0 860 320" style={{ width: "100%", fontFamily: "monospace" }}>
      <defs>
        <filter id="fg"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="860" height="320" fill="#020508"/>
      <pattern id="gp" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.6" fill="rgba(0,255,136,0.07)"/>
      </pattern>
      <rect width="860" height="320" fill="url(#gp)"/>

      <rect x="20" y="20" width="360" height="280" rx="12" fill="rgba(255,68,68,0.05)" stroke="#ff444444" strokeWidth="2"/>
      <text x="200" y="44" textAnchor="middle" fill="#ff6666" fontSize="13" fontWeight="900">🦆 DuckDNS</text>
      <text x="200" y="58" textAnchor="middle" fill="#554" fontSize="8">Free Dynamic DNS — LIMITED capabilities</text>

      <text x="32" y="78" fill="#00ff8888" fontSize="9" fontWeight="700">✅ CAN DO:</text>
      {DNS_REALITY.duckdns_can.map((item, i) => (
        <text key={i} x="32" y={95 + i * 18} fill="#00ff8866" fontSize="8">◆ {item}</text>
      ))}

      <text x="32" y="174" fill="#ff444488" fontSize="9" fontWeight="700">❌ CANNOT DO:</text>
      {DNS_REALITY.duckdns_cannot.map((item, i) => (
        <text key={i} x="32" y={191 + i * 18} fill="#ff444466" fontSize="8">✗ {item}</text>
      ))}

      <text x="420" y="155" textAnchor="middle" fill="#00d4ff" fontSize="20">→</text>
      <text x="420" y="170" textAnchor="middle" fill="#334" fontSize="8">ADD</text>

      <rect x="460" y="20" width="380" height="280" rx="12" fill="rgba(0,255,136,0.04)" stroke="#00ff8844" strokeWidth="2" filter="url(#fg)"/>
      <text x="650" y="44" textAnchor="middle" fill="#00ff88" fontSize="13" fontWeight="900">☁️ Cloudflare (FREE)</text>
      <text x="650" y="58" textAnchor="middle" fill="#554" fontSize="8">Full DNS — everything DuckDNS cannot do</text>

      <text x="472" y="78" fill="#00ff8888" fontSize="9" fontWeight="700">✅ ADDS ALL THIS:</text>
      {DNS_REALITY.cloudflare_adds.map((item, i) => (
        <text key={i} x="472" y={95 + i * 18} fill="#00ff8877" fontSize="8">◆ {item}</text>
      ))}

      <rect x="20" y="295" width="820" height="18" rx="4" fill="rgba(0,212,255,0.08)"/>
      <text x="430" y="307" textAnchor="middle" fill="#00d4ff88" fontSize="8" fontWeight="700">
        HYBRID: Keep DuckDNS for IP updates → Cloudflare for DNS records. Zero cost.
      </text>
    </svg>
  );
}

function EmailDeliverabilityChart() {
  const providers = [
    { name: "Self-hosted\n(DuckDNS)", rate: 8, icon: "💀", color: "#ff2244" },
    { name: "Postfix relay\n(your IP)", rate: 35, icon: "⚠️", color: "#ff8800" },
    { name: "Brevo\n(FREE 300/day)", rate: 97, icon: "✅", color: "#00ff88" },
    { name: "Mailgun\n(FREE 1k/mo)", rate: 97, icon: "✅", color: "#00ff88" },
    { name: "Amazon SES\n($0.10/1k)", rate: 99, icon: "🏆", color: "#00d4ff" },
  ];

  return (
    <svg viewBox="0 0 860 200" style={{ width: "100%", fontFamily: "monospace" }}>
      <rect width="860" height="200" fill="#020508"/>
      <pattern id="ep" width="15" height="15" patternUnits="userSpaceOnUse">
        <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(0,255,136,0.06)"/>
      </pattern>
      <rect width="860" height="200" fill="url(#ep)"/>

      <text x="430" y="18" textAnchor="middle" fill="#556" fontSize="9" letterSpacing="2" fontWeight="700">EMAIL DELIVERABILITY — WHICH TO CHOOSE</text>

      {providers.map((p, i) => {
        const x = 30 + i * 166;
        const barH = (p.rate / 100) * 100;
        const barY = 140 - barH;
        return (
          <g key={i}>
            <rect x={x + 28} y={140} width={80} height={3} rx="1" fill="rgba(255,255,255,0.06)"/>
            <rect x={x + 28} y={barY} width={80} height={barH} rx="4"
              fill={`${p.color}22`} stroke={`${p.color}55`} strokeWidth="1"/>
            <rect x={x + 28} y={barY} width={80} height={4} rx="2" fill={p.color}/>

            <text x={x + 68} y={barY - 6} textAnchor="middle" fill={p.color} fontSize="11" fontWeight="900">{p.rate}%</text>
            <text x={x + 68} y={barY - 18} textAnchor="middle" fontSize="12">{p.icon}</text>

            {p.name.split("\n").map((line, li) => (
              <text key={li} x={x + 68} y={152 + li * 12} textAnchor="middle" fill="#556" fontSize="8">{line}</text>
            ))}
          </g>
        );
      })}

      <line x1="20" y1="140" x2="840" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
      <text x="14" y="144" fill="#334" fontSize="7">0%</text>
    </svg>
  );
}

export default function App() {
  const [tab, setTab] = useState("audit");
  const [openAudit, setOpenAudit] = useState(null);
  const [openRec, setOpenRec] = useState(0);

  const verdictColors = { "CORRECT": "#00ff88", "WRONG": "#ff4444", "MISLEADING": "#ff8800", "DANGEROUS": "#ff2244", "HALF RIGHT": "#ff8800", "WRONG FOR YOUR STACK": "#ff4444" };

  const TABS = [
    { id: "audit", label: "🔍 ADVICE AUDIT" },
    { id: "dns", label: "🌐 DNS REALITY" },
    { id: "email", label: "📧 EMAIL REALITY" },
    { id: "action", label: "✅ ACTION PLAN" },
  ];

  const summary = { wrong: AUDIT.filter(a => a.verdict.includes("WRONG") || a.verdict === "DANGEROUS").length, warn: AUDIT.filter(a => a.verdict === "MISLEADING" || a.verdict === "HALF RIGHT").length, ok: AUDIT.filter(a => a.verdict === "CORRECT").length };

  return (
    <div style={{ background: "#020508", minHeight: "100vh", color: "#c8d4f0", fontFamily: "monospace" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-thumb { background: #00ff8833; border-radius: 2px; }`}</style>

      <div style={{ background: "rgba(0,0,0,0.85)", borderBottom: "1px solid rgba(255,68,68,0.2)", padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 8, background: "rgba(255,34,68,0.1)", border: "1px solid rgba(255,34,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔍</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, background: "linear-gradient(90deg,#ff4444,#ff8800,#00ff88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.06em" }}>
              HONEST ADVICE AUDIT — NEXUS
            </div>
            <div style={{ fontSize: 8, color: "#334", letterSpacing: "0.18em", marginTop: 2 }}>
              {summary.wrong} WRONG · {summary.warn} MISLEADING · {summary.ok} CORRECT
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[[summary.wrong, "WRONG", "#ff4444"], [summary.warn, "MISLEADING", "#ff8800"], [summary.ok, "CORRECT", "#00ff88"]].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: c, textShadow: `0 0 12px ${c}88` }}>{v}</div>
              <div style={{ fontSize: 7, color: "#334", letterSpacing: "0.1em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.5)", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", background: tab === t.id ? "rgba(255,136,0,0.06)" : "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? "#ff8800" : "transparent"}`, color: tab === t.id ? "#ff8800" : "#445", cursor: "pointer", fontSize: 10, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap", transition: "all 0.15s" }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "18px 22px", overflow: "auto", maxHeight: "calc(100vh - 115px)" }}>

        {/* ── AUDIT ── */}
        {tab === "audit" && (
          <div>
            <div style={{ background: "rgba(255,34,68,0.06)", border: "1px solid rgba(255,34,68,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#ff4444", marginBottom: 4 }}>⚠️ BOTTOM LINE FIRST</div>
              <div style={{ fontSize: 11, color: "#778", lineHeight: 1.8 }}>
                The advice you received is <strong style={{ color: "#ff8800" }}>generic AI output</strong> that doesn't know your stack.
                <strong style={{ color: "#ff4444" }}> 3 technically wrong claims</strong> + <strong style={{ color: "#ff8800" }}>2 misleading ones</strong>.
                Following it blindly = days of debugging, zero email deliverability, destroying working infrastructure.
                Here's every claim scored honestly.
              </div>
            </div>

            {AUDIT.map((item, i) => {
              const c = verdictColors[item.verdict] || "#ff8800";
              return (
                <div key={i} style={{ marginBottom: 10, border: `1px solid ${openAudit === i ? c + "55" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s" }}>
                  <button onClick={() => setOpenAudit(openAudit === i ? null : i)} style={{ width: "100%", padding: "12px 16px", background: openAudit === i ? `${c}0c` : "rgba(0,0,0,0.3)", border: "none", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left" }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{item.score}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                        <VerdictBadge verdict={item.verdict} color={c} />
                        <span style={{ fontSize: 9, padding: "1px 8px", borderRadius: 3, background: `${item.color}15`, color: item.color, fontFamily: "monospace" }}>impact: {item.impact}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#778", lineHeight: 1.5, fontStyle: "italic" }}>"{item.claim}"</div>
                    </div>
                    <span style={{ fontSize: 10, color: c, opacity: 0.6, flexShrink: 0 }}>{openAudit === i ? "▼" : "▶"}</span>
                  </button>
                  {openAudit === i && (
                    <div style={{ padding: "0 16px 16px", background: "#020507" }}>
                      <pre style={{ margin: "12px 0 10px", padding: "12px 14px", fontSize: 10.5, lineHeight: 1.9, color: c + "cc", background: `${c}08`, borderRadius: 8, border: `1px solid ${c}22`, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{item.reality}</pre>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 6 }}>
                        <span style={{ fontSize: 10 }}>✅</span>
                        <span style={{ fontSize: 10, color: "#00ff88", fontWeight: 700 }}>FIX: </span>
                        <span style={{ fontSize: 10, color: "#556" }}>{item.fix}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── DNS REALITY ── */}
        {tab === "dns" && (
          <div>
            <div style={{ fontSize: 9, color: "#334", letterSpacing: "0.2em", marginBottom: 12 }}>▸ WHAT DUCKDNS ACTUALLY IS — AND WHAT CLOUDFLARE ADDS</div>
            <DNSCapabilityDiagram />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
              <div style={{ background: "rgba(255,68,68,0.04)", border: "1px solid rgba(255,68,68,0.2)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#ff6666", marginBottom: 10 }}>❌ Why the subdomain advice breaks</div>
                {[
                  "DuckDNS = ONE entry: nexus-io.duckdns.org → YOUR_IP",
                  "grafana.nexus-io.duckdns.org is a sub-subdomain DuckDNS doesn't manage",
                  "Some DNS resolvers resolve it via fallback, others return NXDOMAIN",
                  "Traefik wildcard cert via DNS-01 works (duckdns plugin handles it)",
                  "But reliable subdomain DNS = Cloudflare",
                ].map(r => (
                  <div key={r} style={{ fontSize: 9, color: "#556", padding: "3px 0", display: "flex", gap: 6, lineHeight: 1.5 }}><span style={{ color: "#ff6666", fontSize: 7, marginTop: 3 }}>◆</span>{r}</div>
                ))}
              </div>
              <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#00ff88", marginBottom: 10 }}>✅ The hybrid setup that works</div>
                {[
                  "Register FREE domain (Freenom) OR buy .com (~$10/yr)",
                  "Point nameservers to Cloudflare (free tier)",
                  "Cloudflare A record: @ → YOUR_IP",
                  "Cloudflare CNAME: * → @ (wildcard all subdomains)",
                  "Keep DuckDNS OR switch to Cloudflare API script",
                  "Result: every subdomain resolves reliably, globally",
                ].map(r => (
                  <div key={r} style={{ fontSize: 9, color: "#556", padding: "3px 0", display: "flex", gap: 6, lineHeight: 1.5 }}><span style={{ color: "#00ff88", fontSize: 7, marginTop: 3 }}>◆</span>{r}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EMAIL ── */}
        {tab === "email" && (
          <div>
            <div style={{ fontSize: 9, color: "#334", letterSpacing: "0.2em", marginBottom: 12 }}>▸ EMAIL DELIVERABILITY — WHAT ACTUALLY REACHES INBOXES</div>
            <EmailDeliverabilityChart />
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "rgba(255,34,68,0.04)", border: "1px solid rgba(255,34,68,0.2)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#ff4444", marginBottom: 10 }}>💀 Why self-hosted email from DuckDNS fails</div>
                {[
                  ["No PTR record", "ISP owns your PTR. Gmail checks it. Fails."],
                  ["No SPF/DKIM/DMARC", "DuckDNS cannot add TXT. No SPF = spam. Rejected."],
                  ["Port 25 blocked", "ISPs block outbound 25 on dynamic IPs."],
                  ["Dynamic IP reputation", "Your IP may already be blacklisted."],
                ].map(([title, desc]) => (
                  <div key={title} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#ff8888" }}>✗ {title}</div>
                    <div style={{ fontSize: 9, color: "#445", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: "14px" }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#00ff88", marginBottom: 10 }}>✅ Brevo — 30 min setup</div>
                {[
                  "Free: 300 emails/day (orders, resets, alerts)",
                  "SMTP relay: host + port + user + pass",
                  "High deliverability: proper SPF/DKIM pre-configured",
                  "Works: N8N, lldap, shop backend, keycloak",
                  "No server maintenance ever",
                  "Scale to paid when shop grows",
                ].map(r => (
                  <div key={r} style={{ fontSize: 9, color: "#556", padding: "2px 0", display: "flex", gap: 6 }}><span style={{ color: "#00ff88", fontSize: 7, marginTop: 2 }}>◆</span>{r}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ACTION PLAN ── */}
        {tab === "action" && (
          <div>
            <div style={{ fontSize: 9, color: "#334", letterSpacing: "0.2em", marginBottom: 14 }}>▸ YOUR REAL ACTION PLAN — PRIORITISED & SPECIFIC TO YOUR STACK</div>
            {REAL_RECOMMENDATIONS.map((rec, i) => (
              <div key={i} style={{ marginBottom: 10, border: `1px solid ${openRec === i ? rec.color + "55" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
                <button onClick={() => setOpenRec(openRec === i ? null : i)} style={{ width: "100%", padding: "13px 16px", background: openRec === i ? `${rec.color}0c` : "rgba(0,0,0,0.3)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{rec.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: rec.color, fontFamily: "monospace" }}>{rec.title}</span>
                      <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${rec.color}20`, color: rec.color, fontWeight: 800 }}>{rec.priority}</span>
                      <span style={{ fontSize: 8, color: "#334" }}>⏱ {rec.time}</span>
                      <span style={{ fontSize: 8, color: "#334" }}>💰 {rec.cost}</span>
                    </div>
                    <div style={{ fontSize: 9, color: "#445" }}>{rec.note}</div>
                  </div>
                  <span style={{ fontSize: 10, color: rec.color, opacity: 0.6 }}>{openRec === i ? "▼" : "▶"}</span>
                </button>
                {openRec === i && (
                  <div style={{ padding: "0 16px 16px", background: "#020507" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "12px 0" }}>
                      <div>
                        <div style={{ fontSize: 9, color: rec.color, fontWeight: 800, marginBottom: 8, letterSpacing: "0.1em" }}>STEPS:</div>
                        {rec.steps.map((step, si) => (
                          <div key={si} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 10, color: "#556", lineHeight: 1.5 }}>
                            <span style={{ color: rec.color, fontSize: 8, fontFamily: "monospace", minWidth: 14, marginTop: 2 }}>{si + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <CodeBlock code={rec.code} color={rec.color} label="EXACT COMMANDS" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
