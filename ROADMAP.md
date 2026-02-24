# 🗺️ Future Roadmap: NEXUS

## 🌌 Phase 1: AI Agent Expansion

### 1. "Neuromancer" Shopping Assistant

- **Concept**: A persistent AI chat interface that follows the user from page to page.
- **Tech**: Integration with OpenAI Realtime API or a local LLM via WebLLM.
- **Capabilities**:
  - "Show me laptops under €3000" -> Updates fileters automatically.
  - "Compare these two neural interfaces" -> Generates a comparison table.

### 2. Predictive Logistics

- **Concept**: AI that predicts shipping delays before they happen.
- **Implementation**: Mock machine learning model that analyzes "weather" events in the shipment history.

## ✨ Phase 2: Immersive UI (Animations)

### 1. Page Transitions

- **Tech**: `framer-motion` + `AnimatePresence`.
- **Effect**: Smooth morphing between the Product Card on the listing page and the Hero image on the detail page (Shared Layout Animations).

### 2. 3D Product Previews

- **Tech**: `react-three-fiber` / `Drei`.
- **Effect**: Replace static product images with interactive GLTF models that users can rotate and inspect.

### 3. Micro-interactions

- **Cart**: Particles explode when adding an item.
- **Buttons**: Magnetic effect (button follows cursor slightly).

## 🛠️ Phase 3: Real Backend Migration

### 1. Database

- Migrate `Zustand` stores to **PostgreSQL** (via Prisma).
- Host on Supabase or Neon.

### 2. Authentication

- Re-enable **Clerk** or implement **NextAuth**.
- Secure `/admin` routes with real middleware.
