'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

const MESSAGES = [
    "Alex from NY just ordered a RTX 5090",
    "Sarah from London purchased Intel Core Ultra 9",
    "Mike from Tokyo just configured a custom build",
    "Elena from Berlin bought 64GB DDR5 RAM",
    "David from Toronto just upgraded to PRO tier"
];

export function SocialProof() {
    useEffect(() => {
        const interval = setInterval(() => {
            // 30% chance to show a toast every cycle
            if (Math.random() > 0.7) {
                const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
                toast.success(msg, {
                    style: {
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                        color: '#fff',
                        backdropFilter: 'blur(12px)'
                    },
                    icon: '🚀' // Simple icon
                });
            }
        }, 8000); // Check every 8 seconds

        return () => clearInterval(interval);
    }, []);

    return null; // Logic only component
}
