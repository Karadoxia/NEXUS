# 🗺️ Future Roadmap: NEXUS

## 🌌 Phase 1: AI Agent Expansion

### 1. "Neuromancer" Shopping Assistant ✅

- **Concept**: A persistent AI chat interface that follows the user from page to page.
- **Tech**: Integrated a basic chat component with fallback; Gemini key support added.
- **Capabilities**:
  - Chatbox appears on all pages; text queries are echoed (future: hook into RAG or Gemini).
  - File upload and vision not yet implemented (planned later).

### 2. Predictive Logistics ✅

- **Concept**: AI that predicts shipping delays before they happen.
- **Implementation**: SupplyChainAgent returns random delay prediction as a stub; ready for real data integration.

## ✨ Phase 2: Immersive UI (Animations)

### 1. Page Transitions ✅

- **Tech**: `framer-motion` + `AnimatePresence` deployed globally via `PageTransition` component.
- **Effect**: Page animations already active on route changes.

### 2. 3D Product Previews ✅

- **Tech**: `react-three-fiber` / `Drei`.
- **Effect**: `ProductCanvas` component renders interactive placeholder model; can substitute with GLTF.

### 3. Micro-interactions ✅

- **Cart**: Particle effect added on "Add to Cart" button; simple CSS animation.
- **Buttons**: Magnetic/hover effects built in via Tailwind transitions; further polish available.

## 🛠️ Phase 3: Real Backend Migration (pending)

### Core agent foundation
- Added `OperationsManager` to handle order intake & validation as part of the agent hierarchy.
- Added `SupplyChainManager` to generate reorder suggestions and inventory insights.
- Added `FinanceManager` to summarise revenue/refunds.
- Added `CustomerExperienceManager` to monitor tickets.
- Added `MarketingManager` to generate recommendations.
- Added `AnalyticsManager` for basic order trends.

### 1. Database

- Migrate `Zustand` stores to **PostgreSQL** (via Prisma).
- Host on Supabase or Neon.

### 2. Authentication

- Re-enable **Clerk** or implement **NextAuth**.
- Secure `/admin` routes with real middleware.

*Phase 3 has not been started yet; current prototype still uses SQLite and mock auth.*

## 🧩 Phase 4+: Agent expansion and tooling

- Continue building departmental managers (SupplyChain, Finance, CX, etc.)
- Integrate Gemini vision tools for inventory & SAV agents.
- Add scheduling, observability, and SLAs for leader orchestration.
