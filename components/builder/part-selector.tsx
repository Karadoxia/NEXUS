'use client';

import { useBuilderStore } from '@/lib/builder-store';
import { PARTS, PartType } from '@/lib/parts-data';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';
import Image from 'next/image';

export function PartSelector({ type }: { type: PartType }) {
    const { parts, setPart } = useBuilderStore();
    const availableParts = PARTS[type];
    const selectedPart = parts[type];

    // Basic compatibility filter can be added here
    // For now we show all parts for the category

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableParts.map((part) => {
                const isSelected = selectedPart?.id === part.id;

                return (
                    <motion.div
                        key={part.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPart(type, part)}
                        className={`
                            relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300
                            ${isSelected
                                ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_20px_rgba(0,212,255,0.2)]'
                                : 'border-white/10 bg-slate-900/40 hover:border-white/30 hover:bg-slate-800/60'
                            }
                        `}
                    >
                        <div className="aspect-video relative overflow-hidden bg-black/40">
                            {/* Placeholder for real images */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-bold uppercase tracking-widest">
                                {type} Image
                            </div>

                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-cyan-500 text-black p-1 rounded-full shadow-lg z-10">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className={`font-bold mb-1 truncate ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                                {part.name}
                            </h3>
                            <div className="flex justify-between items-baseline mb-3">
                                <span className="text-lg font-mono text-white">${part.price}</span>
                                {part.compatibility?.power && (
                                    <span className="text-xs text-slate-500 font-mono">{part.compatibility.power}W</span>
                                )}
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-black/20 p-2 rounded-lg">
                                {Object.entries(part.specs).map(([key, val]) => (
                                    <div key={key}>
                                        <span className="opacity-50 block text-[10px] uppercase">{key}</span>
                                        <span className="font-mono text-slate-200">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
