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

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

Create a `.env.local` file in the project root. A few values are optional for
mock mode, but the full experience (database, authentication, payments) requires
real values:

```env
# --- Database --------------------------------------------------------------
DATABASE_URL="file:./dev.db"            # Or your Postgres/Mongo connection

# --- Stripe (required for real checkout) ----------------------------------
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# --- Authentication -------------------------------------------------------
# NextAuth uses a database for adapters; sessions are JWT by default.
# No further variables required unless using OAuth providers.

# --- Optional 3rd-party services ------------------------------------------
RESEND_API_KEY=re_...
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

## 📄 License

This project is licensed under the MIT License.
