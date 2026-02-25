import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

export interface ShipmentEvent {
    id: string;
    details: string;
    location: string;
    date: string;
    status: 'ordered' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered';
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    date: string;
    customer: {
        name: string;
        email: string;
    };
    paymentId?: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    shipmentEvents?: ShipmentEvent[];
    cancelled?: boolean;
}

interface OrderState {
    orders: Order[];
    addOrder: (order: Order) => void; // attempts backend create
    storeOrder: (order: Order) => void; // local-only persistence
    updateStatus: (orderId: string, status: Order['status']) => void;
    updateShipment: (orderId: string, trackingNumber: string, carrier: string) => void;
    getOrdersByEmail: (email: string) => Promise<Order[]>;
    getOrderByTracking: (trackingNumber: string) => Order | undefined;
    getAllOrders: () => Promise<Order[]>;
    getRevenue: () => number;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            orders: [],

            // create order via backend
            addOrder: async (order) => {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(order),
                });
                const data = await res.json();
                if (data.success) {
                    set((state) => ({ orders: [data.order, ...state.orders] }));
                }
            },

            // store order locally without contacting server
            storeOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

            updateStatus: async (orderId, status) => {
                const res = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                });
                const data = await res.json();
                if (data.success) {
                    set((state) => ({
                        orders: state.orders.map(o =>
                            o.id === orderId ? { ...o, status } : o
                        ),
                    }));
                }
            },

            updateShipment: async (orderId, trackingNumber, carrier) => {
                const res = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trackingNumber, carrier, status: 'shipped' }),
                });
                const data = await res.json();
                if (data.success) {
                    set((state) => ({
                        orders: state.orders.map(o =>
                            o.id === orderId ? data.order : o
                        ),
                    }));
                }
            },

            getOrdersByEmail: async (email) => {
                // attempt to fetch from backend if logged in
                try {
                    const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
                    if (res.ok) {
                        const data = await res.json();
                        // merge into local state for quick access
                        set({ orders: [...data, ...get().orders] });
                        return data;
                    }
                } catch {
                    // fall back to in-memory
                }
                return get().orders.filter(o => o.customer.email === email);
            },

            getOrderByTracking: (trackingNumber) => {
                return get().orders.find(o => o.trackingNumber === trackingNumber);
            },

            getAllOrders: async () => {
                try {
                    const res = await fetch('/api/orders');
                    if (res.ok) {
                        const data = await res.json();
                        set({ orders: [...data, ...get().orders] });
                        return data;
                    }
                } catch {
                    // ignore
                }
                return get().orders;
            },

            getRevenue: () => {
                return get().orders.reduce((acc, curr) => acc + curr.total, 0);
            },
        }),
        {
            name: 'nexus-orders-storage',
        }
    )
);
