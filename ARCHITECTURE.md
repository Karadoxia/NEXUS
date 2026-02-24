# System Architecture: NEXUS

## 🧠 Core Concepts

### 1. The "Mock Backend" Strategy

To achieve zero-latency performance and simplify deployment, we moved the traditional backend logic into the client-side state.

- **State as Database**: `Zustand` stores (`orderStore`, `cartStore`) act as our database.
- **Persistence**: `persist` middleware saves this state to `localStorage`, surviving page reloads.
- **Benefits**: Instant interactions, no database costs, works offline-first.

### 2. Next.js App Router Structure

We use the modern App Router (`app/`) for intuitive routing and Layout nesting.

- `app/layout.tsx`: Root layout with Providers (Theme, Tooltip).
- `app/store/page.tsx`: The main catalog with URL-state filtering.
- `app/products/[slug]/page.tsx`: Dynamic product pages.

### 3. Component Architecture

- **Atoms**: `Button`, `Input` (from Shadcn/UI).
- **Molecules**: `ProductCard`, `CartItem`.
- **Organisms**: `Navbar`, `CartDrawer`, `SearchModal`.
- **Templates**: `Hero`, `Footer`.

### 4. Search & Discovery Engine

- **Library**: `fuse.js`.
- **Logic**: Client-side fuzzy matching against the `products.ts` static data.
- **Optimization**: The Fuse instance is memoized to prevent re-indexing on every render.

## 🔄 Key Data Flows

### Add to Cart

1. User clicks "Add to Cart".
2. `useCartStore.addItem(product)` is called.
3. Store checks if item exists -> increments qty OR pushes new item.
4. `Navbar` and `CartDrawer` subscribe to store changes and update UI instantly.

### Checkout & Order Creation

1. User submits checkout form.
2. `useOrderStore.addOrder()` creates an order object.
3. Order is marked as `PENDING`.
4. User redirected to `/checkout/success`.
5. `useCartStore.clearCart()` is triggered.

### Fulfillment (Admin)

1. Admin clicks "Fulfill" on an order.
2. `useOrderStore.updateStatus(id, 'SHIPPED')` is called.
3. A mock tracking number is generated and attached to the order.
