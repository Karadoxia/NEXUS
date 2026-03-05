"use client";

import { useState } from "react";

type SectionId = "overview" | "compose" | "lldap-config" | "integrations" | "migration" | "security";
type CodeKey = "compose" | "env" | "initdb" | "groups" | "grafanaLDAP" | "n8nLDAP" | "portainerLDAP" | "shopBackend" | "migration";

const CODE: Record<CodeKey, string> = {
  compose: `# docker-compose.yml (LLDAP + Keycloak + Postgres)
# Use the exact compose block you provided in your spec.
# Includes:
# - lldap
# - keycloak (optional)
# - postgres with init script
# - traefik labels for admin/auth domains`,
  env: `# .env
DB_USER=shopuser
DB_PASS=your_strong_password_here
LLDAP_JWT_SECRET=
LLDAP_ADMIN_PASS=
KC_ADMIN=admin
KC_ADMIN_PASS=
SMTP_USER=noreply@yourshop.com
SMTP_PASS=your_smtp_password`,
  initdb: `#!/bin/bash
set -e
set -u

create_db() {
  local db=$1
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE $db;
    GRANT ALL PRIVILEGES ON DATABASE $db TO $POSTGRES_USER;
EOSQL
}

create_db lldap
create_db keycloak`,
  groups: `admins, employees, managers, devops, readonly

Map each app to these groups for centralized auth/authorization.`,
  grafanaLDAP: `# grafana.ini
[auth.ldap]
enabled = true
config_file = /etc/grafana/ldap.toml

# ldap.toml
[[servers]]
host = "lldap"
port = 3890
bind_dn = "cn=admin,dc=yourshop,dc=com"
search_filter = "(uid=%s)"`,
  n8nLDAP: `# N8N LDAP credential
Server: ldap://lldap:3890
Bind DN: cn=admin,dc=yourshop,dc=com
Base DN: dc=yourshop,dc=com`,
  portainerLDAP: `# Portainer LDAP settings
LDAP Server: ldap://lldap:3890
Reader DN: cn=admin,dc=yourshop,dc=com
User Base DN: ou=people,dc=yourshop,dc=com
Group Base DN: ou=groups,dc=yourshop,dc=com`,
  shopBackend: `// Node + ldapts
import { Client } from 'ldapts';
const client = new Client({ url: 'ldap://lldap:3890' });
// bind as service account, find user DN, bind as user, map groups`,
  migration: `-- 1) Export active users from current Postgres
-- 2) Import to LLDAP via GraphQL API
-- 3) Add users to groups
-- 4) Trigger password-reset emails`,
};

const NAV: Array<{ id: SectionId; icon: string; label: string }> = [
  { id: "overview", icon: "🗺️", label: "Overview" },
  { id: "compose", icon: "🐳", label: "Docker Compose" },
  { id: "lldap-config", icon: "⚙️", label: "LLDAP Config" },
  { id: "integrations", icon: "🔌", label: "Integrations" },
  { id: "migration", icon: "🚀", label: "Migration" },
  { id: "security", icon: "🛡️", label: "Security" },
];

const INTEGRATIONS: Array<{ name: string; icon: string; key: CodeKey | null; desc: string }> = [
  { name: "Grafana", icon: "📊", key: "grafanaLDAP", desc: "LDAP auth + role mapping" },
  { name: "N8N", icon: "⚡", key: "n8nLDAP", desc: "LDAP credential node" },
  { name: "Portainer", icon: "🐋", key: "portainerLDAP", desc: "LDAP auth in Settings" },
  { name: "Shop Backend", icon: "🛒", key: "shopBackend", desc: "ldapts integration" },
  { name: "Keycloak OIDC", icon: "🔐", key: null, desc: "SSO broker" },
  { name: "Vaultwarden", icon: "🔑", key: null, desc: "Native LDAP support" },
];

export default function IdentityPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [activeCode, setActiveCode] = useState<CodeKey>("compose");
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (key: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <aside className="w-56 border-r border-slate-800 bg-slate-900/40 p-4 space-y-2">
        <div className="mb-4 pb-4 border-b border-slate-800">
          <p className="text-xs font-bold tracking-wider text-emerald-400">LLDAP SETUP</p>
          <p className="text-[10px] text-slate-500">IDENTITY MANAGEMENT</p>
        </div>
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              activeSection === item.id
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:bg-slate-800/60"
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-8 space-y-6">
        {activeSection === "overview" && (
          <section className="space-y-5">
            <h1 className="text-2xl font-bold text-emerald-300">Identity Layer for Your Shop 🛒</h1>
            <p className="text-sm text-slate-400">Centralize auth with LLDAP groups and integrate Grafana, N8N, Portainer, and your shop backend.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                "~50MB RAM",
                "Reuse existing Postgres",
                "Web admin UI",
                "Group-based RBAC",
                "Universal LDAP protocol",
                "Password reset email flow",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "compose" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-300">Docker Compose</h2>
            <div className="flex flex-wrap gap-2">
              {([
                ["compose", "docker-compose.yml"],
                ["env", ".env"],
                ["initdb", "init-multiple-dbs.sh"],
                ["groups", "groups-setup.txt"],
              ] as Array<[CodeKey, string]>).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setActiveCode(k)}
                  className={`px-3 py-1.5 rounded-md text-xs border ${
                    activeCode === k ? "border-cyan-400 text-cyan-300 bg-cyan-500/10" : "border-slate-700 text-slate-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="relative rounded-xl border border-slate-800 bg-black/40">
              <button
                onClick={() => copyCode(activeCode, CODE[activeCode])}
                className="absolute right-3 top-3 px-3 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                {copied === activeCode ? "✅ Copied" : "📋 Copy"}
              </button>
              <pre className="p-4 text-xs text-teal-200 overflow-x-auto">{CODE[activeCode]}</pre>
            </div>
          </section>
        )}

        {activeSection === "lldap-config" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-violet-300">LLDAP Groups & Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ["admins", "Full stack access"],
                ["managers", "Orders / inventory / reports"],
                ["employees", "Shop operations"],
                ["devops", "Infra and monitoring"],
              ].map(([g, d]) => (
                <div key={g} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <p className="font-mono text-sm text-violet-300">cn={g}</p>
                  <p className="text-xs text-slate-400 mt-1">{d}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "integrations" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-amber-300">Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {INTEGRATIONS.map((i) => (
                <button
                  key={i.name}
                  onClick={() => setActiveIntegration(activeIntegration === i.name ? null : i.name)}
                  className={`text-left rounded-xl border p-4 transition ${
                    activeIntegration === i.name ? "border-emerald-400/40 bg-emerald-500/5" : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-200">{i.icon} {i.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{i.desc}</p>
                </button>
              ))}
            </div>

            {activeIntegration && (() => {
              const found = INTEGRATIONS.find((i) => i.name === activeIntegration);
              if (!found || !found.key) {
                return <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">Use Keycloak user federation to bridge LLDAP with OIDC apps.</div>;
              }
              return (
                <div className="relative rounded-xl border border-slate-800 bg-black/40">
                  <button
                    onClick={() => copyCode(found.key as string, CODE[found.key as CodeKey])}
                    className="absolute right-3 top-3 px-3 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    {copied === found.key ? "✅ Copied" : "📋 Copy"}
                  </button>
                  <pre className="p-4 text-xs text-teal-200 overflow-x-auto">{CODE[found.key as CodeKey]}</pre>
                </div>
              );
            })()}
          </section>
        )}

        {activeSection === "migration" && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-rose-300">Migration (Zero-downtime)</h2>
            <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
              <li>Deploy LLDAP alongside existing stack.</li>
              <li>Create core groups.</li>
              <li>Export users and import through API.</li>
              <li>Point Grafana/N8N/Portainer to LDAP.</li>
              <li>Switch shop backend auth to LDAP.</li>
              <li>Keep old users table read-only during burn-in.</li>
            </ol>
            <div className="relative rounded-xl border border-slate-800 bg-black/40">
              <button
                onClick={() => copyCode("migration", CODE.migration)}
                className="absolute right-3 top-3 px-3 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                {copied === "migration" ? "✅ Copied" : "📋 Copy"}
              </button>
              <pre className="p-4 text-xs text-teal-200 overflow-x-auto">{CODE.migration}</pre>
            </div>
          </section>
        )}

        {activeSection === "security" && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-red-300">Security Hardening</h2>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
              <li>Keep LDAP internal-only; do not expose 3890 publicly.</li>
              <li>Restrict LLDAP admin UI behind VPN/middleware.</li>
              <li>Use service bind accounts (avoid admin bind in apps).</li>
              <li>Use CrowdSec for brute-force patterns.</li>
              <li>Rotate JWT secret and back up identity tables.</li>
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
