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
            aria-label="Celestial Traverse Progress"
            className="pointer-events-none fixed top-0 right-0 left-0 z-50 select-none"
        >
            {/* Celestial Signal-Orange Hairline Progress */}
            <div className="h-[2px] w-full overflow-hidden bg-border/20">
                <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] shadow-[0_0_8px_var(--primary)] transition-all duration-75 ease-out"
                    style={{
                        width: `${percent}%`,
                    }}
                />
            </div>
        </aside>
    );
}
