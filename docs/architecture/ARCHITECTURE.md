# NEXUS Architecture – March 2026 (Production Reality)

## Vision

NEXUS is a self-hosted AI-orchestrated e-commerce operating system running on a single Docker Compose stack with 36 standardized containers. It delivers an immersive shopping experience while 14 autonomous AI agents run the entire business in the background.

**Live domain (kept as requested)**: <https://app.nexus-io.duckdns.org> + all subdomains via DuckDNS wildcard + Traefik Let's Encrypt.

## 1. Frontend Layer

- Next.js 16 App Router + React 19 + Tailwind + Shadcn/UI
- Immersive features: Framer Motion, Three.js product canvases, Fuse.js Ctrl+K search
- Hybrid state: Zustand (instant UX + localStorage) ↔ Prisma sync
- AI Shopping Assistant: powered by `support-bot` agent

## 2. Data Layer (Multi-DB Strategy)

**Primary** – `nexus-postgres` (nexus_v2)
**Models** (full Prisma schema):

- User (roles + NextAuth)
- Product, Order, CartItem, Subscriber, Address, PaymentMethod, Log (full audit trail)

**Dedicated databases**:

- `nexus-postgres-ai`
- `nexus-postgres-hr`
- `nexus-postgres-infra`
- Redis (sessions/cache)

## 3. AI Agent System (14 Autonomous Employees)

Defined in `agents/config.json` (fully enabled):

**Business Agents**:

- inventory-forecaster
- finance-guardian
- revenue-forecaster
- security-fraud-guardian
- marketing-booster
- procurement-negotiator
- newsletter-agent ← **RAG upgrade coming in Phase 2**
- support-bot ← **RAG upgrade coming in Phase 2**

**Ops Agents**:

- it-operations-reporter
- performance-optimizer
- sentiment-loyalty-analyst
- crm-reclamations
- business-intelligence

**Tool Agent**: rust-sum (Rust microservice HTTP endpoint)

**Orchestration**: LangChain + LangGraph (supervisor pattern) + Groq/Gemini + LangSmith tracing + n8n workflows.

## 4. Infrastructure (36 Containers – 100% standardized)

All named `nexus-*` (March 4 commit). Full list & roles in `docs/infra/CONTAINER_STANDARDIZATION_COMPLETE.md`.

**Key stacks**:

- Edge & Security: Traefik (wildcard SSL), CrowdSec, Falco, Fail2Ban, WireGuard
- Observability: Prometheus + Loki + Grafana + cAdvisor + exporters
- Automation: n8n + MCP server + Semaphore
- Identity: Keycloak + lldap + VaultWarden
- App: nexus-app + nexus-rust

**Deployment**: `scripts/start-all.sh` (one command)

## 5. Security & Observability (Enterprise Grade)

- Full runtime security (Falco)
- Collaborative IPS (CrowdSec)
- Vulnerability scanning (Trivy cron)
- Audit logs in Prisma
- Telegram alerts

**Status**: Production-ready. Only cleanup + minor hardening left.

**Next milestones** (already planned in ROADMAP.md):

- Phase 2 Agent Superpowers
- Phase 3 Full production hardening
- Phase 4 Monorepo extraction (optional)
