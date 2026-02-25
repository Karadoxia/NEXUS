# NEXUS | 2027-online-shop

**NEXUS** is a futuristic e-commerce platform built with Next.js 14, Tailwind CSS, and Zustand. It features a high-performance, mock-backend architecture designed to simulate a premium shopping experience for next-generation technology.

## 🚀 Features

- **Ai Shopping Assistant**: "Neuromancer" prototype for navigation and support.
- **Immersive Experience**: Interactive 3D product previews with `Three.js` (Try it on Product Pages).
- **Storefront**: Immersive product catalog with filtering and search (`Ctrl+K`).
- **Immersive UI**: Smooth page transitions powered by `Framer Motion`.
- **Cart & Checkout**: Persistent cart state and simulated Stripe checkout flow.
- **User Accounts**: Mock authentication and order history tracking.
- **Admin Dashboard**: Real-time sales monitoring and order fulfillment.
- **Logistics**: Simulated shipment focus with visual tracking timeline.
- **Search**: Client-side fuzzy search powered by `fuse.js`.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Search**: [Fuse.js](https://fusejs.io/)
- **Payments**: Stripe (Mock Mode)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

> **Note:** The development environment provided by this workspace does **not** include a running PostgreSQL
> server or allow starting one via Docker due to sandbox restrictions. Any attempt to migrate or connect to
> `localhost:5432` will fail with `P1001` errors until you point the project at a real database instance
> (see "Database setup" below) or fall back to SQLite.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/2027-online-shop.git
   cd 2027-online-shop
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server (you can override the port if 3000 is in use):

   ```bash
   # use PORT=3001 to avoid conflicts with other services like Grafana
   PORT=3001 npm run dev
   ```

   or set `PORT` in `.env.local` and then just run `npm run dev`.

4. Open [http://localhost:3001](http://localhost:3001) (or your chosen port)
   in your browser.

## 🔧 Environment Variables

Create a `.env.local` file in the project root. A few values are optional for
mock mode, but the full experience (database, authentication, payments) requires
real values:

### Database setup

If you want to use PostgreSQL (recommended for production and to exercise the
Prisma migrations) you must have an accessible server. This can be a local
installation (outside the sandbox), a Docker container running on your host, or
any managed provider such as Supabase, Railway, ElephantSQL, or AWS RDS. Once
it is running, set `DATABASE_URL` accordingly and run:

```bash
npx prisma migrate dev --name init
```

If you do not have a Postgres instance handy, the project still works with the
built-in SQLite database; set the variable to `file:./dev.db` or remove
`DATABASE_URL` entirely. The codebase is already capable of using SQLite for
the mock backend and the migration command will operate on `dev.db` by
default.

```env
# --- Database --------------------------------------------------------------
# switch to Postgres for production; then run `npx prisma migrate dev`
DATABASE_URL="postgresql://user:password@localhost:5432/nexus"

# --- Admin ---------------------------------------------------------------
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com

# --- Stripe (required for real checkout) ----------------------------------
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# --- Authentication -------------------------------------------------------
# NextAuth uses a database for adapters; sessions are JWT by default.
# No further variables required unless using OAuth providers.

# --- Optional 3rd-party services ------------------------------------------
RESEND_API_KEY=re_...
GEMINI_API_KEY=AIzaSyBypwgh3aX5BQQ_Xeq-Mxwtvt5o6M9F7d0
```

During development you can rely on the embedded SQLite database and the mock
checkout button; however, set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
to test the real payment flow.

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## 📚 Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Deep dive into state management and patterns.
- [Deployment Guide](./DEPLOY.md) - How to ship to Vercel.
- [Future Roadmap](./ROADMAP.md) - Planned features (AI Agents, Animations).

## 🧩 API & Backend

A minimal backend now exists via Next.js API routes to start migrating off the in-browser ``mock backend``:

- **GET** `/api/products` – returns the static product catalogue.
- **GET/POST** `/api/orders` – list or create orders (stored in memory).
- **PUT** `/api/orders/[id]` – update status/shipment for a given order.

The Zustand stores call these endpoints; data is now persisted using Prisma
and the configured `DATABASE_URL` (SQLite by default). Orders are linked to
authenticated users when available.

## 🧪 Testing

Basic unit tests for the cart store have been added using Vitest.
Run `npm run test` to execute them. The suite currently covers adding items,
adjusting quantities, and removing items; more tests can be added as features
grow.


## 🤖 Vision: Hierarchical Agentic AI Company

Imagine your full‑stack online web shop as a living, intelligent digital company — a self‑orchestrating organism where a CEO‑level AI brain oversees specialized
departments of expert agents. Orders flow seamlessly, stock never surprises you,
suppliers get negotiated like pros, customers feel personally cared for (even in
after‑sales/SAV), and the entire system learns and optimizes 24/7. Humans step in
only for vision, big decisions, or creative sparks. This is **hierarchical agentic
AI** in action — and in 2026 it’s production‑ready, cost‑effective, and
transformative for e‑commerce.

### Core Architecture: Hierarchical Multi-Agent System (HMAS)

> **Self‑orchestration & resilience**
>
> The agent layer is designed to start automatically when the server renders the
> root layout (`initAgents()` in `app/layout.tsx`). A lightweight scheduler
> spins up the `Leader` orchestrator every hour and a `SupervisorAgent` every
> minute. The supervisor pings the site and, if it detects downtime, triggers a
> recovery run of the leader so that the system can attempt to heal itself after
> a crash or reboot. This means that simply redeploying or restarting the
> application brings the entire corporate brain back online with no manual
> intervention.
>
> Each leader cycle concludes with a `selfImprove()` step, where agents can
> introspect past performance metrics and adjust their internal configs. The
> current implementation is rudimentary (it counts orders and returns) but it
> illustrates the pattern; future work might include automated tuning, model
> retraining, and configuration evolution driven by real data.

### Core Architecture: Hierarchical Multi-Agent System (HMAS)

Think of it as a **corporate org chart made of AI**:

- **Strategic Layer** (1 Lead Orchestrator) — high‑level planning, delegation,
  KPI oversight, conflict resolution, escalation to human.
- **Tactical Layer** (6–8 Departmental Manager Agents) — break down goals,
  coordinate sub‑teams, report up.
- **Execution Layer** (20+ Specialist Worker Agents) — handle granular tasks with
autonomy.

```mermaid
flowchart TB
  CEO([E-Commerce Orchestrator])
  subgraph Managers
    Ops(Operations Manager)
    SC(Supply Chain Manager)
    Fin(Finance & Payments Manager)
    CX(Customer Experience Manager)
    Mkt(Marketing & Catalog Manager)
    Anal(Analytics & Insights Manager)
    IT(IT & Security Manager)
  end
  CEO --> Managers
  Ops --> Proc(Procurement)
  Ops --> Ret(Retention Specialist)
  SC --> Neg(Negotiation)
  SC --> Log(Logistics)
  Fin --> StockF(Stock Forecaster)
  Fin --> LogF(Logistics)
  CX --> PayProc(Payment Processor)
  CX --> Sup(Customer Support)
  Mkt --> SEO(SEO Optimizer)
  Mkt --> PayProc2(Payment Processor)
  Anal --> Fraud(Fraud Detection)
  Anal --> Content(Content Lister)
  IT --> Prod(Product Specialist)
  IT --> Data(Data Analyst)
```

A visual version of this hierarchy is also saved to `docs/architecture.mmd`.

**Benefits** include specialization, scalability (10k+ orders/day), resilience,
modularity, and built‑in human‑in‑the‑loop for high‑stakes actions.

### Communication Patterns

Vertical delegation/reporting, horizontal collaboration (e.g. Stock ➜ Procurement),
shared state via Vector DB + event bus, and event‑driven triggers.

### Recommended 2026 Tech Stack

Briefly:
- **Orchestration**: CrewAI + LangGraph hybrids
- **Backend**: Python/FastAPI or Node.js
- **DBs**: PostgreSQL, Redis, VectorDB (Chroma/PGVector)
- **LLMs**: mix of Grok‑4, Claude 3.5/4, Llama 3.1, Grok mini
- **Tools**: LangChain/LlamaIndex, Celery/RabbitMQ, LangSmith/Grafana

A full list of departments, agents, and implementation guidance is described
in the project roadmap and associated architecture docs.

### Implementation Path

Start with a minimal crew (orchestrator + order/stock/support agents), then
expand department by department. Use RAG for real‑time data, task decomposition
for planning, and asynchronous event-driven execution. Monitor with LangSmith or
your chosen observability stack.

This system can outperform a 20‑person team while giving you god‑mode
visibility and control. Prototype now, scale fast, and let AI handle the heavy
lifting.

## 📄 License

This project is licensed under the MIT License.
