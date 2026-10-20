import React from 'react';

interface TopProgressBarProps {
    progress: number;
    distanceKm?: number;
}

export default function TopProgressBar({
    progress,
}: TopProgressBarProps) {
    const percent = Math.min(100, Math.max(0, Math.round(progress * 100)));

    return (
        <aside
            aria-label="Monayem OS Scroll Progress"
            className="pointer-events-none fixed top-0 right-0 left-0 z-50 select-none"
        >
            {/* Architectural Signal-Orange Progress Line */}
            <div className="h-0.5 sm:h-1 w-full overflow-hidden bg-border/40">
                <div
                    className="h-full bg-[var(--primary)] transition-all duration-75 ease-out"
                    style={{
                        width: `${percent}%`,
                    }}
                />
            </div>

            {/* Precision Telemetry Badge */}
            <div className="mx-auto flex max-w-[1440px] justify-end px-4 pt-1 sm:px-8">
                <div className="inline-flex items-center gap-2 border border-border bg-background/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground backdrop-blur-xs">
                    <span className="h-1.5 w-1.5 bg-[var(--primary)]" />
                    <span>TRAVERSED:</span>
                    <span className="font-bold text-foreground">{percent}%</span>
                </div>
            </div>
        </aside>
    );
}
