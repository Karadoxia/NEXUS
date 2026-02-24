'use client';

import { useBuilderStore } from '@/lib/builder-store';
import { PARTS, PartType } from '@/lib/parts-data';
import { Zap, Cpu, Trash2 } from 'lucide-react';

const TYPE_LABELS: Record<PartType, string> = {
    cpu: 'CPU',
    gpu: 'GPU',
    motherboard: 'Mobo',
    ram: 'RAM',
    storage: 'SSD',
    case: 'Case',
    psu: 'PSU'
};

export function BuildSummary() {
    const { parts, totalPrice, totalPower, removePart } = useBuilderStore();
    const hasParts = Object.keys(parts).length > 0;

    return (
        <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 border-b border-white/10">
                <h3 className="font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-cyan-500" />
                    Current Build
                </h3>
            </div>

            <div className="p-4 space-y-4">
                {/* Parts List */}
                <div className="space-y-3 min-h-[200px]">
                    {!hasParts ? (
                        <div className="text-center py-8 text-slate-600 italic text-sm">
                            No parts selected yet.<br />Start building your beast.
                        </div>
                    ) : (
                        (Object.keys(PARTS) as PartType[]).map((type) => {
                            const part = parts[type];
                            if (!part) return null;

                            return (
                                <div key={type} className="group flex justify-between items-start text-sm group">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <span className="text-[10px] text-slate-500 uppercase block font-mono mb-0.5">
                                            {TYPE_LABELS[type]}
                                        </span>
                                        <span className="text-slate-200 truncate block group-hover:text-white transition-colors">
                                            {part.name}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-cyan-400 font-mono">${part.price}</span>
                                        <button
                                            onClick={() => removePart(type)}
                                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Stats */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3 text-yellow-400" /> Est. Wattage
                        </span>
                        <span className="font-mono text-slate-200">{totalPower}W</span>
                    </div>

                    <div className="bg-cyan-950/30 p-3 rounded-lg flex justify-between items-center mt-4 border border-cyan-500/20">
                        <span className="text-cyan-400 font-bold uppercase text-xs">Total</span>
                        <span className="text-2xl font-bold text-white font-mono">${totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
