import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    checkout: (customer: { name: string; email: string }, shippingAddress?: any) => Promise<any>;
    total: () => number;
    count: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1) => set((state) => {
                const existingItem = state.items.find(item => item.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                        isOpen: true, // Auto open cart
                    };
                }
                return {
                    items: [...state.items, { ...product, quantity }],
                    isOpen: true, // Auto open cart
                };
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id)
            })),

            updateQuantity: (id, quantity) => set((state) => {
                if (quantity <= 0) {
                    return { items: state.items.filter(item => item.id !== id) };
                }
                return {
                    items: state.items.map(item =>
                        item.id === id ? { ...item, quantity } : item
                    )
                };
            }),

                    clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            // send order to backend and clear
            checkout: async (customer, shippingAddress, paymentMethodId) => {
                const order: any = {
                    id: crypto.randomUUID(),
                    items: get().items,
                    total: get().total(),
                    status: 'pending',
                    date: new Date().toISOString(),
                    customer,
                    paymentMethodId,
                };
                if (shippingAddress) order.shippingAddress = shippingAddress;
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(order),
                });
                const data = await res.json();
                if (data.success) {
                    set({ items: [] });
                    return data.order;
                }
                throw new Error('checkout failed');
            },

            total: () => {
                const state = get();
                return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            },

            count: () => {
                const state = get();
                return state.items.reduce((sum, item) => sum + item.quantity, 0);
            }
        }),
        {
            name: 'nexus-cart-storage',
            partialize: (state) => ({ items: state.items }), // Only persist items, not UI state like isOpen
        }
    )
);
