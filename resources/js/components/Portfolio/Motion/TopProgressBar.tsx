import React from 'react';

interface TopProgressBarProps {
    progress: number;
    distanceKm: number;
}

export default function TopProgressBar({
    progress,
    distanceKm,
}: TopProgressBarProps) {
    const formattedDistance = distanceKm.toLocaleString('en-US');

    return (
        <aside
            aria-label="Mission flight telemetry progress"
            className="pointer-events-none fixed top-0 right-0 left-0 z-50 select-none"
        >
            {/* Thin Progress Line */}
            <div className="h-1 w-full overflow-hidden bg-[var(--surface-border)]/40">
                <div
                    className="h-full transition-all duration-100 ease-out"
                    style={{
                        width: `${Math.min(100, Math.max(0, progress * 100))}%`,
                        background:
                            'linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%)',
                        boxShadow: '0 0 10px var(--secondary)',
                    }}
                />
            </div>

            {/* Distance Telemetry Pill Header */}
            <div className="mx-auto flex max-w-7xl justify-end px-4 pt-2 md:px-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px] text-[var(--text-muted)] shadow-sm backdrop-blur-md">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--secondary)]" />
                    <span>DISTANCE:</span>
                    <span className="font-bold text-[var(--secondary)]">
                        {formattedDistance} KM
                    </span>
                </div>
            </div>
        </aside>
    );
}
