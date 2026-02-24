import { create } from 'zustand';
import { Part, PartType } from './parts-data';

interface BuilderState {
    step: number;
    parts: Partial<Record<PartType, Part>>;
    totalPrice: number;
    totalPower: number;

    // Actions
    setPart: (type: PartType, part: Part) => void;
    removePart: (type: PartType) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetBuild: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
    step: 0,
    parts: {},
    totalPrice: 0,
    totalPower: 0,

    setPart: (type, part) => set((state) => {
        const newParts = { ...state.parts, [type]: part };
        const newTotal = Object.values(newParts).reduce((sum, p) => sum + (p?.price || 0), 0);
        const newPower = Object.values(newParts).reduce((sum, p) => sum + (p?.compatibility?.power || 0), 0);

        return {
            parts: newParts,
            totalPrice: newTotal,
            totalPower: newPower
        };
    }),

    removePart: (type) => set((state) => {
        const newParts = { ...state.parts };
        delete newParts[type];
        const newTotal = Object.values(newParts).reduce((sum, p) => sum + (p?.price || 0), 0);
        const newPower = Object.values(newParts).reduce((sum, p) => sum + (p?.compatibility?.power || 0), 0);

        return {
            parts: newParts,
            totalPrice: newTotal,
            totalPower: newPower
        };
    }),

    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
    resetBuild: () => set({ step: 0, parts: {}, totalPrice: 0, totalPower: 0 })
}));
