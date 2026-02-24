import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface FavoritesState {
    items: Product[];
    toggleFavorite: (product: Product) => void;
    removeFavorite: (productId: string) => void;
    clearFavorites: () => void;
    isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            items: [],

            toggleFavorite: (product) => set((state) => {
                const exists = state.items.some(item => item.id === product.id);
                if (exists) {
                    return { items: state.items.filter(item => item.id !== product.id) };
                }
                return { items: [...state.items, product] };
            }),

            removeFavorite: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id)
            })),

            clearFavorites: () => set({ items: [] }),

            isFavorite: (id) => {
                return get().items.some(item => item.id === id);
            }
        }),
        {
            name: 'nexus-favorites-storage',
        }
    )
);
