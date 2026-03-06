/**
 * NEXUS-V2 Interactive Identity & RBAC Dashboard
 * 
 * Self-contained React component (zero external files)
 * 6 tabs: Architecture, Roles, Access Matrix, Setup Commands, Semaphore, Clients
 * 
 * Purpose:
 *   - Visual reference for entire identity architecture
 *   - Copy-paste all setup commands
 *   - Role definitions & permission matrices
 *   - Admin quick-reference guide
 * 
 * Deployment: Next.js page component
 * Route: GET /dashboard/identity
 * Auth: RBAC required — super_admin or infra_admin only
 * 
 * Usage:
 *   import IdentityRBACDashboard from '@/components/dashboards/identity-rbac-dashboard'
 *   export default IdentityRBACDashboard
 */

'use client'

import { useState } from 'react'

// ===== ROLE DEFINITIONS =====

const ROLES = [
  {
    id: 'super_admin',
    label: 'SUPER_ADMIN',
    icon: '👑',
    color: '#ffd700',
    owner: 'caspertech78@gmail.com',
    access: {
      databases: [
        'ALL DBS — READ/WRITE/DELETE/CREATE/DROP',
        'Postgres SUPERUSER',
        'Schema modifications',
        'User/role management',
      ],
      services: [
        'lldap FULL (admin)',
        'Keycloak FULL (admin)',
        'Portainer FULL (admin)',
        'Grafana ADMIN',
        'N8N ADMIN',
        'Vaultwarden ADMIN',
        'Semaphore FULL',
      ],
      servers: [
        'SSH root all hosts',
        'Docker daemon full access',
        'All container exec + logs',
        'Kernel parameters',
        'System-wide settings',
      ],
      ldap: [
        'Create/delete any user',
        'Assign any role/group',
        'Modify LDAP schema',
        'Reset any password',
        'View all audit logs',
      ],
    },
    description: 'You. The owner. God mode. No restrictions anywhere.',
  },
  {
    id: 'infra_admin',
    label: 'INFRA_ADMIN',
    icon: '⚙️',
    color: '#00d4ff',
    access: {
      databases: [
        'shop_db R/W',
        'monitoring_db R/W',
        'NO DROP/DELETE on business tables',
      ],
      services: [
        'Portainer — read logs + exec',
        'Grafana — EDITOR (all dashboards)',
        'N8N — FULL (all workflows)',
        'Semaphore — DEPLOY (run playbooks)',
      ],
      servers: [
        'SSH non-root (infra_admin user)',
        'Docker restart + logs',
        'NO sudo to /bin/bash',
        'Journalctl for logs',
      ],
      ldap: [
        'List all users (read-only)',
        'Assign infra roles only',
        'NO delete users',
        'NO password reset',
      ],
    },
    description:
      'Infrastructure team. Full infra access, no business data writes or deletes.',
  },
  {
    id: 'shop_manager',
    label: 'SHOP_MANAGER',
    icon: '📊',
    color: '#00ff88',
    access: {
      databases: [
        'shop_db: orders R/W',
        'shop_db: products R/W',
        'shop_db: categories R/W',
        'NO users table',
        'NO system databases',
      ],
      services: [
        'Shop admin panel — FULL',
        'Grafana — shop dashboards only',
        'NO Portainer',
        'NO N8N',
        'NO Semaphore',
      ],
      servers: ['NO SSH access', 'NO Docker access', 'NO infra tools'],
      ldap: [
        'View own profile only',
        'NO user management',
        'NO group assignments',
      ],
    },
    description: 'Business team. Full shop access, zero infrastructure access.',
  },
  {
    id: 'shop_employee',
    label: 'SHOP_EMPLOYEE',
    icon: '👤',
    color: '#b44af0',
    access: {
      databases: [
        'shop_db: orders READ only',
        'shop_db: order_items READ',
        'shop_db: customers READ',
        'NO product writes',
        'NO system databases',
      ],
      services: [
        'Shop staff panel',
        'Grafana — viewer (shop only)',
        'NO admin tools',
      ],
      servers: ['NO SSH', 'NO Docker', 'NO infra'],
      ldap: ['View own profile only', 'NO user management'],
    },
    description: 'Frontline staff. Process orders, no management access.',
  },
  {
    id: 'client',
    label: 'CLIENT',
    icon: '🛒',
    color: '#ff8800',
    access: {
      databases: [
        'shop_db: OWN ORDERS ONLY (row-level security)',
        'shop_db: OWN PROFILE (RLS)',
        'NO product writes',
      ],
      services: ['Shop storefront ONLY', 'Own account page'],
      servers: ['NO access whatsoever'],
      ldap: ['Own profile — email/password only', 'NO other user access'],
    },
    description: 'Customers. Isolated to their own data only via Row-Level Security.',
  },
]

const ARCHITECTURE_LAYERS = [
  {
    id: 'owner',
    label: '👑 OWNER / SUPER_ADMIN',
    sublabel: 'caspertech78@gmail.com',
    color: '#ffd700',
    bg: '#ffd70008',
    border: '#ffd70044',
    items: [
      'Full lldap admin',
      'All Postgres SUPERUSER',
      'Root SSH all servers',
      'Docker daemon access',
      'Vaultwarden master',
      'Semaphore ALL templates',
    ],
  },
  {
    id: 'identity',
    label: '🔑 IDENTITY PLANE',
    sublabel: 'lldap + Keycloak + JWT',
    color: '#ff88cc',
    bg: '#ff88cc06',
    border: '#ff88cc33',
    items: [
      'lldap Web UI :17170',
      'LDAP protocol :3890',
      'Keycloak OIDC :8180',
      'Groups: 5 roles',
      'Email password reset',
      'Audit log via Loki',
    ],
  },
  {
    id: 'deploy',
    label: '🚀 DEPLOYMENT PLANE',
    sublabel: 'Ansible Semaphore',
    color: '#00d4ff',
    bg: '#00d4ff06',
    border: '#00d4ff33',
    items: [
      'Web UI :3000',
      'LDAP login (infra_admins)',
      'Playbook templates',
      'Audit trail all runs',
      'Scheduled jobs',
      'Secrets from Vaultwarden',
    ],
  },
  {
    id: 'services',
    label: '⚙️ SERVICES',
    sublabel: 'All authenticate against lldap',
    color: '#00ff88',
    bg: '#00ff8806',
    border: '#00ff8833',
    items: [
      'Grafana :3000 → LDAP roles',
      'Portainer :9000 → LDAP auth',
      'N8N :5678 → LDAP creds',
      'Prometheus metrics',
      'Vaultwarden secrets',
      'CrowdSec protection',
    ],
  },
  {
    id: 'data',
    label: '🐘 DATA PLANE',
    sublabel: 'Postgres RBAC + Row-Level Security',
    color: '#ff8800',
    bg: '#ff880006',
    border: '#ff880033',
    items: [
      'super_admin_role: SUPERUSER',
      'infra_admin_role: R/W no DROP',
      'shop_manager_role: business R/W',
      'shop_employee_role: orders R only',
      'client_role: OWN ROWS ONLY (RLS)',
      'lldap DB + keycloak DB + shop DB',
    ],
  },
  {
    id: 'network',
    label: '🌐 NETWORK',
    sublabel: 'Tiered isolation',
    color: '#b44af0',
    bg: '#b44af006',
    border: '#b44af033',
    items: [
      'frontend: public-facing',
      'backend: internal: true',
      'identity: internal: true',
      'monitoring: internal: true',
      'security: internal: true',
      'NO cross-tier without explicit rule',
    ],
  },
]

const ACCESS_MATRIX = [
  { resource: 'lldap Web UI', super_admin: 'FULL', infra_admin: 'VIEW', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'Keycloak Admin', super_admin: 'FULL', infra_admin: 'VIEW', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'Portainer', super_admin: 'FULL', infra_admin: 'R+EXEC', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'Grafana', super_admin: 'ADMIN', infra_admin: 'EDITOR', shop_manager: 'VIEWER', shop_employee: '—', client: '—' },
  { resource: 'N8N', super_admin: 'ADMIN', infra_admin: 'FULL', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'Semaphore', super_admin: 'FULL', infra_admin: 'DEPLOY', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'Vaultwarden', super_admin: 'ADMIN', infra_admin: 'OWN VAULT', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'SSH Access', super_admin: 'ROOT ALL', infra_admin: 'NON-ROOT', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'Docker Daemon', super_admin: 'FULL', infra_admin: 'docker group', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'Postgres (all)', super_admin: 'SUPERUSER', infra_admin: 'R/W', shop_manager: '—', shop_employee: '—', client: '—' },
  { resource: 'shop_db orders', super_admin: 'ALL', infra_admin: 'R/W', shop_manager: 'R/W', shop_employee: 'R+status', client: 'OWN ROWS' },
  { resource: 'shop_db products', super_admin: 'ALL', infra_admin: 'R/W', shop_manager: 'R/W', shop_employee: 'READ', client: 'READ' },
  { resource: 'shop_db users', super_admin: 'ALL', infra_admin: 'READ', shop_manager: '—', shop_employee: '—', client: 'OWN ROW' },
  { resource: 'Shop storefront', super_admin: 'ALL', infra_admin: 'ALL', shop_manager: 'ALL', shop_employee: 'LIMITED', client: 'OWN ACCOUNT' },
  { resource: 'Shop admin panel', super_admin: 'ALL', infra_admin: 'ALL', shop_manager: 'FULL', shop_employee: 'ORDERS ONLY', client: '—' },
]

const TABS = [
  { id: 'schema', label: '🏗️ ARCHITECTURE' },
  { id: 'roles', label: '👥 ROLES' },
  { id: 'matrix', label: '🔐 ACCESS MATRIX' },
  { id: 'setup', label: '⚙️ SETUP' },
  { id: 'semaphore', label: '🚀 SEMAPHORE' },
  { id: 'clients', label: '🛒 CLIENTS' },
]

// ===== CELL COLOR HELPER =====

const getCellColor = (val: string | undefined) => {
  if (!val || val === '—')
    return { bg: 'rgba(255,255,255,0.02)', color: '#334' }
  if (
    val.includes('FULL') ||
    val.includes('ALL') ||
    val.includes('ADMIN') ||
    val.includes('SUPER') ||
    val.includes('ROOT')
  )
    return { bg: '#ffd70015', color: '#ffd700' }
  if (
    val.includes('EDITOR') ||
    val.includes('DEPLOY') ||
    val.includes('R/W') ||
    val.includes('NON-ROOT') ||
    val.includes('group')
  )
    return { bg: '#00d4ff12', color: '#00d4ff' }
  if (
    val.includes('VIEWER') ||
    val.includes('READ') ||
    val.includes('LIMITED') ||
    val.includes('VIEW')
  )
    return { bg: '#00ff8810', color: '#00ff88' }
  if (val.includes('OWN') || val.includes('status'))
    return { bg: '#ff880012', color: '#ff8800' }
  return { bg: 'rgba(255,255,255,0.04)', color: '#778' }
}

// ===== COMPONENTS =====

function CodeBlock({
  code,
  label,
  color,
}: {
  code: string
  label: string
  color: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      style={{
        marginBottom: 16,
        border: `1px solid ${color}33`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '8px 14px',
          background: `${color}10`,
          borderBottom: `1px solid ${color}22`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color,
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <button
          onClick={handleCopy}
          style={{
            padding: '3px 10px',
            borderRadius: 5,
            background: copied
              ? 'rgba(0,255,136,0.15)'
              : 'rgba(255,255,255,0.06)',
            border: `1px solid ${copied ? '#00ff8844' : 'rgba(255,255,255,0.1)'}`,
            color: copied ? '#00ff88' : '#667',
            cursor: 'pointer',
            fontSize: 10,
            fontFamily: 'monospace',
          }}
        >
          {copied ? '✅ COPIED' : '📋 COPY'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          fontSize: 10.5,
          lineHeight: 1.8,
          color: '#8bbf9f',
          background: '#030508',
          overflowX: 'auto',
          fontFamily: "'Courier New', monospace",
          whiteSpace: 'pre',
        }}
      >
        {code}
      </pre>
    </div>
  )
}

function SecurityAlert() {
  return (
    <div
      style={{
        background: 'rgba(0,255,136,0.06)',
        border: '2px solid #00ff8844',
        borderRadius: 10,
        padding: '12px 16px',
        marginBottom: 20,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>✅</span>
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: '#00ff88',
            marginBottom: 4,
            letterSpacing: '0.08em',
          }}
        >
          CREDENTIALS SECURED — VAULTWARDEN CONFIGURED
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#00ff88aa',
            lineHeight: 1.7,
          }}
        >
          All secrets for caspertech78@gmail.com are stored in Vaultwarden.
          Never paste credentials in code or chat. All environment variables
          use Vaultwarden secret references only.
        </div>
      </div>
    </div>
  )
}

// ===== MAIN COMPONENT =====

export default function IdentityRBACDashboard() {
  const [activeTab, setActiveTab] = useState('schema')
  const [expandedRole, setExpandedRole] = useState<string | null>('super_admin')

  return (
    <div
      style={{
        background: '#050810',
        minHeight: '100vh',
        color: '#c8d4f0',
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: 'rgba(0,0,0,0.7)',
          borderBottom: '1px solid rgba(255,215,0,0.2)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 28 }}>👑</span>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                background:
                  'linear-gradient(90deg,#ffd700,#ff8800,#ff4444)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.08em',
              }}
            >
              NEXUS IDENTITY & ACCESS MANAGEMENT
            </div>
            <div
              style={{
                fontSize: 9,
                color: '#445',
                letterSpacing: '0.2em',
                marginTop: 2,
              }}
            >
              LLDAP · KEYCLOAK · POSTGRES RBAC · ANSIBLE SEMAPHORE
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            ['👑', '1 SUPER_ADMIN', '#ffd700'],
            ['👥', '5 ROLES', '#00d4ff'],
            ['🔐', '15 RESOURCES', '#00ff88'],
            ['🚀', 'SEMAPHORE', '#b44af0'],
          ].map(([icon, label, color]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14 }}>{icon}</div>
              <div
                style={{
                  fontSize: 8,
                  color,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.4)',
          overflowX: 'auto',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              background:
                activeTab === tab.id
                  ? 'rgba(255,215,0,0.06)'
                  : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? '#ffd700' : 'transparent'}`,
              color: activeTab === tab.id ? '#ffd700' : '#445',
              cursor: 'pointer',
              fontSize: 10,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: '20px 24px',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 140px)',
        }}
      >
        <SecurityAlert />

        {/* ── SCHEMA ── */}
        {activeTab === 'schema' && (
          <div>
            <div
              style={{
                fontSize: 10,
                color: '#334',
                letterSpacing: '0.15em',
                marginBottom: 16,
              }}
            >
              ▸ FULL IDENTITY + ACCESS ARCHITECTURE — TOP TO BOTTOM
            </div>

            {ARCHITECTURE_LAYERS.map((layer, i) => (
              <div key={layer.id} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    background: layer.bg,
                    border: `1px solid ${layer.border}`,
                    borderRadius: 12,
                    padding: '14px 18px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${layer.color}, transparent)`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: layer.color,
                      marginBottom: 10,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {layer.label}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    {layer.items.map(item => (
                      <span
                        key={item}
                        style={{
                          fontSize: 10,
                          padding: '3px 10px',
                          borderRadius: 5,
                          background: `${layer.color}12`,
                          color: layer.color,
                          border: `1px solid ${layer.color}22`,
                          fontFamily: 'monospace',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ROLES ── */}
        {activeTab === 'roles' && (
          <div>
            <div
              style={{
                fontSize: 10,
                color: '#334',
                letterSpacing: '0.15em',
                marginBottom: 16,
              }}
            >
              ▸ ALL 5 ROLES — CLICK TO EXPAND
            </div>
            {ROLES.map(role => (
              <div
                key={role.id}
                style={{
                  marginBottom: 10,
                  border: `1px solid ${role.color}33`,
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() =>
                    setExpandedRole(
                      expandedRole === role.id ? null : role.id
                    )
                  }
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background:
                      expandedRole === role.id
                        ? `${role.color}10`
                        : 'rgba(0,0,0,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: `${role.color}20`,
                      border: `2px solid ${role.color}66`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                      boxShadow:
                        expandedRole === role.id
                          ? `0 0 14px ${role.color}66`
                          : 'none',
                    }}
                  >
                    {role.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 900,
                          color: role.color,
                          fontFamily: 'monospace',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {role.label}
                      </span>
                      {role.owner && (
                        <span
                          style={{
                            fontSize: 9,
                            padding: '1px 7px',
                            borderRadius: 3,
                            background: '#ffd70020',
                            color: '#ffd700',
                            border: '1px solid #ffd70033',
                          }}
                        >
                          OWNER
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: '#556',
                      }}
                    >
                      {role.description}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: role.color,
                      opacity: 0.6,
                    }}
                  >
                    {expandedRole === role.id ? '▼' : '▶'}
                  </span>
                </button>
                {expandedRole === role.id && (
                  <div
                    style={{
                      padding: '0 18px 16px',
                      background: `${role.color}05`,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {([
                        ['🐘 Databases', role.access.databases],
                        ['⚙️ Services', role.access.services],
                        ['🖥️ Servers', role.access.servers],
                        ['🔑 LDAP', role.access.ldap],
                      ] as [string, string[]][]).map(([title, items], idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: `1px solid ${role.color}20`,
                            borderRadius: 8,
                            padding: '10px 12px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              color: role.color,
                              marginBottom: 8,
                              letterSpacing: '0.06em',
                            }}
                          >
                            {title}
                          </div>
                          {items.map(item => (
                            <div
                              key={item}
                              style={{
                                fontSize: 10,
                                color: '#667',
                                padding: '2px 0',
                                display: 'flex',
                                gap: 5,
                              }}
                            >
                              <span
                                style={{
                                  color: role.color,
                                  fontSize: 7,
                                  marginTop: 3,
                                  flexShrink: 0,
                                }}
                              >
                                ◆
                              </span>
                              {item}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ACCESS MATRIX ── */}
        {activeTab === 'matrix' && (
          <div>
            <div
              style={{
                fontSize: 10,
                color: '#334',
                letterSpacing: '0.15em',
                marginBottom: 16,
              }}
            >
              ▸ COMPLETE ACCESS MATRIX
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 10,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '2px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <th
                      style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        color: '#445',
                        fontFamily: 'monospace',
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        background: 'rgba(0,0,0,0.4)',
                        minWidth: 150,
                      }}
                    >
                      RESOURCE
                    </th>
                    {[
                      '👑 SUPER_ADMIN',
                      '⚙️ INFRA_ADMIN',
                      '📊 SHOP_MANAGER',
                      '👤 SHOP_EMPLOYEE',
                      '🛒 CLIENT',
                    ].map((h, i) => {
                      const colors = [
                        '#ffd700',
                        '#00d4ff',
                        '#00ff88',
                        '#b44af0',
                        '#ff8800',
                      ]
                      return (
                        <th
                          key={h}
                          style={{
                            padding: '10px 10px',
                            textAlign: 'center',
                            color: colors[i],
                            fontFamily: 'monospace',
                            fontSize: 8,
                            letterSpacing: '0.08em',
                            background: 'rgba(0,0,0,0.4)',
                            minWidth: 100,
                            fontWeight: 800,
                          }}
                        >
                          {h}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ACCESS_MATRIX.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        background:
                          i % 2 === 0
                            ? 'rgba(255,255,255,0.01)'
                            : 'transparent',
                      }}
                    >
                      <td
                        style={{
                          padding: '8px 12px',
                          color: '#778',
                          fontFamily: 'monospace',
                          fontSize: 10,
                          borderRight: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        {row.resource}
                      </td>
                      {[
                        row.super_admin,
                        row.infra_admin,
                        row.shop_manager,
                        row.shop_employee,
                        row.client,
                      ].map((val, j) => {
                        const { bg, color } = getCellColor(val)
                        return (
                          <td
                            key={j}
                            style={{
                              padding: '6px 8px',
                              textAlign: 'center',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 7px',
                                borderRadius: 4,
                                background: bg,
                                color,
                                fontSize: 9,
                                fontFamily: 'monospace',
                                fontWeight:
                                  val && val !== '—'
                                    ? 700
                                    : 400,
                              }}
                            >
                              {val || '—'}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SETUP ── */}
        {activeTab === 'setup' && (
          <div>
            <div
              style={{
                fontSize: 10,
                color: '#334',
                letterSpacing: '0.15em',
                marginBottom: 16,
              }}
            >
              ▸ SETUP COMMANDS & CONFIGURATION
            </div>
            <div
              style={{
                background: 'rgba(0,255,136,0.04)',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: 10,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#00ff88',
                  marginBottom: 8,
              }}
              >
                📋 Step 1: Deploy lldap
              </div>
              <div style={{ fontSize: 10, color: '#556', lineHeight: 1.7 }}>
                lldap is already in your docker-compose.yml (see next tab for
                compose config). Start with:{' '}
                <code
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    padding: '1px 5px',
                    borderRadius: 3,
                  }}
                >
                  docker compose up -d lldap
                </code>
              </div>
              <div style={{ fontSize: 9, color: '#334', marginTop: 8 }}>
                Web UI: http://YOUR_IP:17170 | LDAP: localhost:3890
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,215,0,0.04)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: 10,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#ffd700',
                  marginBottom: 8,
                }}
              >
                👑 Step 2: Create SUPER_ADMIN (YOU)
              </div>
              <div style={{ fontSize: 10, color: '#556', lineHeight: 1.7 }}>
                In lldap Web UI:
              </div>
              <ul style={{ fontSize: 10, color: '#556', margin: '8px 0' }}>
                <li>
                  Login as <code style={{ color: '#ffd700' }}>admin</code>
                </li>
                <li>
                  Users → Create → username:{' '}
                  <code style={{ color: '#ffd700' }}>super.admin</code>, email:{' '}
                  <code style={{ color: '#ffd700' }}>
                    caspertech78@gmail.com
                  </code>
                </li>
                <li>
                  Groups → Create <code style={{ color: '#ffd700' }}>
                    super_admins
                  </code>
                  , infra_admins, shop_managers, shop_employees, clients
                </li>
                <li>
                  Add super.admin → super_admins group
                </li>
                <li>
                  Send password reset email → create strong password
                </li>
              </ul>
            </div>

            <div
              style={{
                background: 'rgba(255,136,0,0.04)',
                border: '1px solid rgba(255,136,0,0.2)',
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#ff8800',
                  marginBottom: 8,
                }}
              >
                🐘 Step 3: Postgres RBAC
              </div>
              <div style={{ fontSize: 10, color: '#556', lineHeight: 1.7 }}>
                Execute SQL in postgres container to create roles matching LDAP
                groups. See docker-compose.yml pg-init files for full setup.
              </div>
            </div>
          </div>
        )}

        {/* ── SEMAPHORE ── */}
        {activeTab === 'semaphore' && (
          <div>
            <div
              style={{
                fontSize: 10,
                color: '#334',
                letterSpacing: '0.15em',
                marginBottom: 14,
              }}
            >
              ▸ ANSIBLE SEMAPHORE — DEPLOYMENT ORCHESTRATION
            </div>
            <div
              style={{
                background: 'rgba(0,255,136,0.04)',
                border: '2px solid rgba(0,255,136,0.3)',
                borderRadius: 12,
                padding: '16px 18px',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#00ff88',
                  marginBottom: 8,
                }}
              >
                ✅ YES — HIGHLY RECOMMENDED
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#556',
                  lineHeight: 1.8,
                }}
              >
                Semaphore replaces manual SSH with audited web deployments.
                infra_admins can deploy services without raw SSH access.
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                {
                  title: 'What it replaces',
                  color: '#ff4444',
                  items: [
                    'Manual SSH + docker compose',
                    'Cron jobs you can\'t see',
                    'Shared root access',
                  ],
                },
                {
                  title: 'What it gives you',
                  color: '#00ff88',
                  items: [
                    'Web UI for all deployments',
                    'Full LDAP-integrated audit trail',
                    'Scheduled playbooks',
                    'Secrets from Vaultwarden',
                  ],
                },
              ].map(box => (
                <div
                  key={box.title}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${box.color}33`,
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: box.color,
                      marginBottom: 10,
                    }}
                  >
                    {box.title}
                  </div>
                  {box.items.map(item => (
                    <div
                      key={item}
                      style={{
                        fontSize: 10,
                        color: '#556',
                        padding: '3px 0',
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      <span style={{ color: box.color, fontSize: 8 }}>
                        ◆
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '14px 16px',
                background: 'rgba(0,212,255,0.04)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#00d4ff',
                  marginBottom: 8,
                }}
              >
                📋 Recommended Templates
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 6,
                }}
              >
                {[
                  '🚀 Deploy all services',
                  '💾 Backup Postgres',
                  '📦 Update images',
                  '🔍 Trivy scan',
                ].map(t => (
                  <div
                    key={t}
                    style={{
                      fontSize: 10,
                      color: '#445',
                      padding: '5px 8px',
                      background: 'rgba(0,212,255,0.06)',
                      borderRadius: 5,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CLIENTS ── */}
        {activeTab === 'clients' && (
          <div>
            <div
              style={{
                fontSize: 10,
                color: '#334',
                letterSpacing: '0.15em',
                marginBottom: 14,
              }}
            >
              ▸ CLIENT ACCOUNTS IN LDAP
            </div>
            <div
              style={{
                background: 'rgba(255,136,0,0.04)',
                border: '2px solid rgba(255,136,0,0.3)',
                borderRadius: 12,
                padding: '16px 18px',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#ff8800',
                  marginBottom: 8,
                }}
              >
                ✅ YES — UP TO ~50,000 USERS
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#556',
                  lineHeight: 1.8,
                }}
              >
                Client accounts in lldap = single identity system for ALL
                users. Password reset, disable, GDPR delete all in one place.
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                {
                  title: 'Benefits',
                  color: '#ff8800',
                  items: [
                    'Single user directory',
                    'Instant disable = no access',
                    'Password reset via email',
                    'Login audit trail',
                    'GDPR delete with one command',
                  ],
                },
                {
                  title: 'Isolation guarantees',
                  color: '#b44af0',
                  items: [
                    'Postgres RLS: own rows only',
                    'No admin routes',
                    'No product writes',
                    'Brute force protection',
                    'Rate limiting per account',
                  ],
                },
              ].map(box => (
                <div
                  key={box.title}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${box.color}33`,
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: box.color,
                      marginBottom: 10,
                    }}
                  >
                    {box.title}
                  </div>
                  {box.items.map(item => (
                    <div
                      key={item}
                      style={{
                        fontSize: 10,
                        color: '#556',
                        padding: '3px 0',
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      <span style={{ color: box.color, fontSize: 8 }}>
                        ◆
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '14px 16px',
                background: 'rgba(255,136,0,0.04)',
                border: '1px solid rgba(255,136,0,0.2)',
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#ff8800',
                  marginBottom: 10,
                }}
              >
                👑 Admin Actions in lldap Web UI
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 6,
                }}
              >
                {[
                  '🔍 Search client',
                  '🚫 Disable account',
                  '📧 Password reset',
                  '🏷️ Move to VIP',
                  '🗑️ Delete + GDPR',
                  '📊 Login history',
                ].map(a => (
                  <div
                    key={a}
                    style={{
                      fontSize: 10,
                      color: '#ff8800aa',
                      padding: '5px 8px',
                      background: 'rgba(255,136,0,0.06)',
                      borderRadius: 5,
                    }}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
