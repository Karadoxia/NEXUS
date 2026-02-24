'use client';

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { useEffect, useState } from 'react';

// Mock data generator
const generateData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
        day: i,
        price: Math.floor(Math.random() * (100 - 80) + 80) // Random fluctuation
    }));
};

interface PriceHistoryProps {
    color?: string;
    height?: number;
}

export function PriceHistory({ color = "#00D4FF", height = 60 }: PriceHistoryProps) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        setData(generateData());
    }, []);

    if (data.length === 0) return <div style={{ height }} className="animate-pulse bg-slate-800/50 rounded-lg w-full" />;

    return (
        <div className="w-full relative group">
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Tooltip Overlay */}
            <div className="absolute inset-x-0 bottom-0 top-0 hidden group-hover:flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg transition-all">
                <span className="text-xs text-white font-mono bg-black/80 px-2 py-1 rounded border border-white/20">
                    30-Day Trend
                </span>
            </div>
        </div>
    );
}
