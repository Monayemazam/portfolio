import React from 'react';
import { PortfolioSection } from '@/types/portfolio';

interface ConstellationWaypointProps {
    sections: PortfolioSection[];
    activeSection: string;
    onSelectSection: (key: string) => void;
}

export default function ConstellationWaypoint({
    sections,
    activeSection,
    onSelectSection,
}: ConstellationWaypointProps) {
    // Filter to visible main sections
    const navSections = sections.filter(
        (s) => s.is_visible !== false && s.key !== 'footer'
    );

    const activeIndex = navSections.findIndex((s) => s.key === activeSection);

    return (
        <aside
            aria-label="Constellation Waypoint Navigator"
            className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none"
        >
            {/* Constellation Connecting Backbone Line */}
            <div className="relative flex flex-col items-center py-4">
                <div
                    aria-hidden="true"
                    className="absolute top-0 bottom-0 w-[1px] bg-border/40"
                />

                {/* Illuminated Progression Beam */}
                <div
                    aria-hidden="true"
                    className="absolute top-0 w-[2px] bg-gradient-to-b from-[var(--primary)] to-[var(--accent)] transition-all duration-300"
                    style={{
                        height: activeIndex >= 0
                            ? `${(activeIndex / (navSections.length - 1)) * 100}%`
                            : '0%',
                    }}
                />

                {/* Section Celestial Star Nodes */}
                <div className="relative flex flex-col gap-6">
                    {navSections.map((sec, idx) => {
                        const isActive = sec.key === activeSection;
                        const isPast = activeIndex > idx;

                        return (
                            <div key={sec.key} className="group relative flex items-center">
                                {/* Node Button */}
                                <button
                                    type="button"
                                    onClick={() => onSelectSection(sec.key)}
                                    aria-label={`Jump to ${sec.nav_label || sec.key}`}
                                    className={`relative z-10 flex h-4 w-4 items-center justify-center rounded-full transition-all focus:outline-hidden ${
                                        isActive
                                            ? 'scale-125'
                                            : 'hover:scale-110'
                                    }`}
                                >
                                    <span
                                        className={`rounded-full transition-all ${
                                            isActive
                                                ? 'h-2.5 w-2.5 bg-[var(--accent)] shadow-[0_0_12px_var(--accent)] ring-2 ring-[var(--accent)]/40'
                                                : isPast
                                                ? 'h-2 w-2 bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]'
                                                : 'h-1.5 w-1.5 bg-muted-foreground/50 group-hover:bg-foreground'
                                        }`}
                                    />
                                </button>

                                {/* Hover Constellation Tooltip */}
                                <div className="pointer-events-none absolute right-7 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                                    <span className="whitespace-nowrap rounded-md border border-border/80 bg-surface/90 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground shadow-lg">
                                        {sec.nav_label || sec.key}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
