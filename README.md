# NEXUS | 2027-online-shop

[![CI](https://github.com/your-username/2027-online-shop/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/2027-online-shop/actions/workflows/ci.yml)

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

> **Note:** The development environment provided by this workspace does **not** include a running PostgreSQL server or allow starting one via Docker due to sandbox restrictions. Any attempt to migrate or connect to `localhost:5432` will fail with `P1001` errors until you point the project at a real database instance (see "Database setup" below).

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
   # use PORT=3030 to avoid conflicts with other services
   PORT=3030 npm run dev
   ```

   or set `PORT` in `.env.local` and then just run `npm run dev`.

## Managing agents

Agent modules live under `lib/agents` and are driven by `agents/config.json`.  You can keep code and configuration in sync using the helper scripts shipped with the project:

```bash
# scaffold a single agent interactively
npm run agent:new -- "Name" "System prompt" "Optional description"

# create any missing files/exports for agents defined in config
# existing implementations (camelCase) are detected and not duplicated
npm run agent:sync
```

After updating `agents/config.json` run the seeder to persist entries in the database:

```bash
node scripts/seedAgents.ts
```

These tools are idempotent and will never overwrite existing files, so feel free to run them repeatedly while developing.

### Rust service and tools

A companion Rust microservice lives in `rust-agents/crates/service` and exposes a simple HTTP API (currently `POST /tool`) that your agents can call. The default `rustTool()` helper is added to new agents and can be used from any agent configuration; it performs a `sum` operation by default.

- Start the service with `npm run rust:run:service` or via Docker (`docker compose up nexus-rust-service`).
- Configure the endpoint using the `RUST_SERVICE_URL` or `NEXT_PUBLIC_RUST_SERVICE_URL` environment variable (fallback: `http://localhost:8081/tool`).

### LangSmith tracing

Set `LANGSMITH_API_KEY` in your environment to enable automatic tracing of LLM calls and tool usage. When provided, the `ChatGroq` model instance will be configured with a `LangSmithTracer` and all agent executions will be recorded in LangSmith for debugging and auditing.

Add tracing keys to your deployment configuration as needed.


4. Open [http://localhost:3030](http://localhost:3030) (or your chosen port) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file in the project root. A few values are optional for mock mode, but the full experience (database, authentication, payments) requires real values:

### Database setup

This project now **requires PostgreSQL**.  The Prisma schema is defined for `postgresql` and the runtime client expects `DATABASE_URL` to point at a live Postgres server. Provision the database any way that works for you – a local container (see `docker-compose.yml`, which exposes port **5433**), a managed service (Supabase, Railway, etc.), or an existing installation. The app will fail to start with `P1001` if it cannot reach the server.

> ⚠️ **Sandbox reminder:** the development environment used by this workspace cannot start Docker or host a database. You must run Postgres outside this environment (on your host machine or a remote instance) before launching the app.

Once the database is available, apply migrations and regenerate the client:

```bash
# Docker-compose defines user `nexus` and database `nexus_v2` on port 5433
export DATABASE_URL="postgresql://nexus:password@localhost:5433/nexus_v2"
# or set the same value in .env.local (see below)

npx prisma migrate dev --name init   # use `migrate deploy` in production
npx prisma generate
```

# You can also inspect the database from the host if you need to verify
# credentials or examine tables.  either install a client or run psql inside
the container:
#
#   docker exec -it nexus_v2_db psql -U nexus -d nexus_v2 -c '\l'
#
# (adjust user/db if you changed them in docker-compose)

To copy existing data from the old SQLite file (`dev.db`), run the helper script once (it uses `SQLITE_URL` or defaults to `file:./dev.db`):

```bash
npm run migrate:sqlite-to-postgres
```

### PostgreSQL Dashboard

For a convenient web UI we include **pgAdmin** in the compose setup. After
starting the containers you can access it at [http://localhost:15432](http://localhost:15432)
using the default credentials `admin@localhost` / `admin`.

- Add a new server in pgAdmin with host `postgres`, port `5432`,
  username `nexus`, password (your `POSTGRES_PASSWORD`).

This lets you browse tables, run queries, and manage the `nexus_v2` database
from the browser.

After migration you may delete `dev.db` and remove any `SQLITE_URL` variable – the application no longer references SQLite.

Example `.env.local`:

```env
# --- Database --------------------------------------------------------------
DATABASE_URL="postgresql://postgres:password@localhost:5433/nexus"

# --- Admin ---------------------------------------------------------------
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

# --- Stripe (required for real checkout) ----------------------------------
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# --- Grok / LLM -------------------------------------------------------------
# your Grok API key enables the built-in agents and any GPT-style calls.
# set this to the key you were provided before starting the dev server.
# example (do not commit the real key):
# GROK_API_KEY="your_actual_key_here"


# --- Authentication -------------------------------------------------------
# NextAuth uses a database for adapters; sessions are JWT by default.
# No further variables required unless using OAuth providers.

# --- Optional 3rd-party services ------------------------------------------
RESEND_API_KEY=re_...   # real key required for sending mail
GEMINI_API_KEY=AIzaSyBypwgh3aX5BQQ_Xeq-Mxwtvt5o6M9F7d0

## Sending email
A lightweight `/api/mail` route is provided for dispatching HTML messages via
Resend. You can call it directly during development:

```bash
curl -X POST http://localhost:3030/api/mail \
  -H 'Content-Type: application/json' \
  -d '{"to":"kalistox.ia@gmail.com","subject":"Test","html":"<p>Hello from NEXUS!</p>"}'
```

> ⚠️ **Replace** the `to` address with your own or use `kalistox.ia@gmail.com` for
manual testing, as suggested by the project maintainer.

The environment variable `RESEND_API_KEY` must be set (load from your vault)
otherwise the route will respond with a 500 error.

Back to optional variables:

# --- Local operations dashboard -------------------------------------------
The admin panel now includes an **Operations** page (`/admin/monitoring`) that
provides quick links to a handful of infrastructure consoles typically running
on `localhost` during development.  These are meant for your convenience and
are not bundled into production builds.

* WireGuard UI – usually on port 51821
* Wazuh SIEM – login at `/app/login?nextUrl=%2Fapp%2Fwz-home`
* Grafana overview panel (metrics & dashboards)
* Traefik proxy dashboard (middlewares, routers)
* Cloudflare registrar/dashboard link

You can override the target URLs by setting the following environment variables
in your development environment or vault:
  * `NEXT_PUBLIC_WIREGUARD_URL`
  * `NEXT_PUBLIC_WAZUH_URL`
  * `NEXT_PUBLIC_GRAFANA_URL`
  * `NEXT_PUBLIC_TRAEFIK_URL`
  * `NEXT_PUBLIC_CLOUDFLARE_URL`

These links are intended to be accessed via VPN or when the services are
running locally.  The admin page will show them only to authenticated
administrators.
