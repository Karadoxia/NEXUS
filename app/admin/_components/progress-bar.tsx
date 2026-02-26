'use client';

import { useEffect, useRef } from 'react';

interface Props {
  /** Value between 0 and 100 */
  pct: number;
  color: string;
}

/**
 * Progress bar whose width is set imperatively after mount so that
 * JSX never carries an inline `style` attribute (which triggers the
 * no-inline-styles lint rule) while still supporting arbitrary runtime
 * percentages that Tailwind cannot produce at build time.
 */
export default function ProgressBar({ pct, color }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = `${Math.min(Math.max(pct, 0), 100)}%`;
    }
  }, [pct]);

  return (
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div ref={ref} className={`h-full ${color} rounded-full transition-all duration-500`} />
    </div>
  );
}
