'use client';

import { useBuilderStore } from '@/lib/builder-store';
import { PARTS, PartType } from '@/lib/parts-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, RotateCcw, ShoppingCart } from 'lucide-react';
import { PartSelector } from './part-selector';
import { BuildSummary } from './build-summary';
import { useCartStore } from '@/src/stores/cartStore';

const STEPS: { type: PartType; label: string }[] = [
    { type: 'cpu', label: 'Processor' },
    { type: 'motherboard', label: 'Motherboard' },
    { type: 'gpu', label: 'Graphics' },
    { type: 'ram', label: 'Memory' },
    { type: 'storage', label: 'Storage' },
    { type: 'case', label: 'Case' },
    { type: 'psu', label: 'Power Supply' },
];

export function BuilderWizard() {
    const { step, nextStep, prevStep, resetBuild, parts, totalPrice } = useBuilderStore();
    const addItem = useCartStore(state => state.addItem);
    const currentStep = STEPS[step];
    const isLastStep = step === STEPS.length - 1;

    // Check if current step has a selection
    const canProceed = !!parts[currentStep.type];

    // when finished, add custom build product to cart
    const handleAddToCart = () => {
        const product = {
            id: `custom-${Date.now()}`,
            slug: `custom-build-${Date.now()}`,
            name: 'Custom NEXUS Build',
            brand: 'NEXUS',
            price: totalPrice,
            description: 'A fully custom built configuration.',
            category: 'components',
            images: [],
            specs: {},
            stock: 1,
            rating: 0,
            reviewCount: 0,
            tags: [],
        };
        addItem(product, 1);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Selection Area */}
            <div className="flex-1 space-y-6">
                {/* Progress Bar */}
                <div className="bg-slate-900/50 backdrop-blur-md p-4 rounded-xl border border-white/10 overflow-x-auto">
                    <div className="flex items-center gap-4 min-w-max">
                        {STEPS.map((s, idx) => {
                            const isCompleted = idx < step;
                            const isCurrent = idx === step;
                            const hasSelection = !!parts[s.type];

                            return (
                                <div key={s.type} className={`flex items-center gap-2 ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-slate-600'}`}>
                                    <div className={`
                                        h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border
                                        ${isCurrent ? 'border-cyan-400 bg-cyan-950/50' : isCompleted ? 'border-green-400 bg-green-950/50' : 'border-slate-700 bg-slate-900'}
                                    `}>
                                        {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                                    </div>
                                    <span className="font-mono text-sm uppercase">{s.label}</span>
                                    {idx < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-slate-800" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="min-h-[600px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-2 font-display uppercase tracking-widest">
                                Select {currentStep.label}
                            </h2>
                            <p className="text-slate-400 mb-6">Choose the heart of your machine. Compatibility checked automatically.</p>

                            <PartSelector type={currentStep.type} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Actions */}
                <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-white/10 sticky bottom-4 z-10 shadow-2xl">
                    <button
                        onClick={prevStep}
                        disabled={step === 0}
                        className="px-6 py-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase text-sm"
                    >
                        Back
                    </button>

                    <div className="flex gap-4">
                        <button
                            onClick={resetBuild}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
                            title="Start Over"
                        >
                            <RotateCcw className="h-5 w-5" />
                        </button>

                        {isLastStep ? (
                            <button
                                onClick={handleAddToCart}
                                disabled={!canProceed}
                                className="bg-green-500 hover:bg-green-400 text-black px-8 py-2 rounded-lg font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:grayscale transition-all"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                disabled={!canProceed}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2 rounded-lg font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next Step
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Sidebar Summary */}
            <div className="w-full lg:w-80 shrink-0">
                <div className="sticky top-24">
                    <BuildSummary />
                </div>
            </div>
        </div>
    );
}
