import React from 'react';
import { Pause, StarFat } from '../Shared/Icons';

interface ReduceEffectsToggleProps {
    reduceEffects: boolean;
    onToggle: () => void;
    className?: string;
}

export default function ReduceEffectsToggle({
    reduceEffects,
    onToggle,
    className = '',
}: ReduceEffectsToggleProps) {
    return (
        <aside
            aria-label="Motion and Effects settings"
            className={`fixed bottom-6 left-6 z-50 ${className}`}
        >
            <button
                type="button"
                role="switch"
                aria-checked={reduceEffects}
                aria-label={`Reduce effects mode: ${reduceEffects ? 'enabled' : 'disabled'}`}
                onClick={onToggle}
                className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs shadow-lg backdrop-blur-md transition-all duration-300 focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none ${
                    reduceEffects
                        ? 'border-[var(--secondary)] bg-[var(--surface)] text-[var(--secondary)] shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                        : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--text)]'
                }`}
                title={`Reduce effects is ${reduceEffects ? 'ON' : 'OFF'}. Click to toggle.`}
            >
                {reduceEffects ? (
                    <Pause className="h-3.5 w-3.5 animate-pulse text-[var(--secondary)]" />
                ) : (
                    <StarFat className="h-3.5 w-3.5 text-[var(--primary)] transition-transform group-hover:rotate-45" />
                )}
                <span className="hidden sm:inline">
                    {reduceEffects ? 'REDUCED MOTION: ON' : 'EFFECTS: FULL'}
                </span>
                <span className="sm:hidden">
                    {reduceEffects ? 'MOTION: OFF' : 'MOTION: ON'}
                </span>
            </button>
        </aside>
    );
}
