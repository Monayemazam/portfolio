import React, { useState } from 'react';
import { PortfolioSection } from '@/types/portfolio';

interface OrbitNavProps {
    sections: PortfolioSection[];
    activeSection: string;
    onSectionClick?: (key: string) => void;
}

export default function OrbitNav({
    sections,
    activeSection,
    onSectionClick,
}: OrbitNavProps) {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const handleClick = (e: React.MouseEvent, key: string) => {
        e.preventDefault();
        if (onSectionClick) {
            onSectionClick(key);
            return;
        }

        const el = document.getElementById(key);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', `#${key}`);
        }
    };

    return (
        <nav
            aria-label="Orbit section navigation"
            className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
        >
            {sections.map((section, idx) => {
                const isActive = activeSection === section.key;
                const isHovered = hoveredKey === section.key;

                return (
                    <div
                        key={`orbit-${section.key || section.id || idx}`}
                        className="relative flex items-center"
                        onMouseEnter={() => setHoveredKey(section.key)}
                        onMouseLeave={() => setHoveredKey(null)}
                    >
                        {/* Label Tooltip */}
                        <div
                            className={`pointer-events-none absolute right-7 flex items-center transition-all duration-200 ${
                                isHovered || isActive
                                    ? 'translate-x-0 opacity-100'
                                    : 'translate-x-2 opacity-0'
                            }`}
                        >
                            <span
                                className={`rounded-md border px-2.5 py-0.5 font-mono text-xs whitespace-nowrap shadow-md backdrop-blur-md ${
                                    isActive
                                        ? 'border-[var(--secondary)] bg-[var(--surface)] font-semibold text-[var(--secondary)]'
                                        : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)]'
                                }`}
                            >
                                {section.nav_label}
                            </span>
                        </div>

                        {/* Orbit Dot */}
                        <button
                            type="button"
                            onClick={(e) => handleClick(e, section.key)}
                            aria-label={`Scroll to ${section.nav_label}`}
                            aria-current={isActive ? 'true' : undefined}
                            className="group flex h-6 w-6 items-center justify-center rounded-full focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
                        >
                            {isActive ? (
                                <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--secondary)] shadow-[0_0_12px_var(--secondary)] transition-all duration-300">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--secondary)]" />
                                </span>
                            ) : (
                                <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-muted)]/40 transition-all duration-200 group-hover:scale-125 group-hover:bg-[var(--secondary)]" />
                            )}
                        </button>
                    </div>
                );
            })}
        </nav>
    );
}
