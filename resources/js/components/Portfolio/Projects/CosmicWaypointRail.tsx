import React from 'react';
import { ProjectItem } from '@/types/portfolio';

interface CosmicWaypointRailProps {
    projects: ProjectItem[];
    currentIndex: number;
    onSelect: (index: number) => void;
}

export default function CosmicWaypointRail({
    projects,
    currentIndex,
    onSelect,
}: CosmicWaypointRailProps) {
    return (
        <div className="w-full border-t border-border/60 pt-6">
            <div className="flex items-center justify-between pb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                    <span>CELESTIAL WAYPOINT INDEX</span>
                </div>
                <span>DIRECT JUMP AVAILABLE</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {projects.map((proj, idx) => {
                    const isCurrent = idx === currentIndex;
                    const accent = proj.accent_color || '#F15A24';
                    const num = (idx + 1).toString().padStart(2, '0');

                    return (
                        <button
                            key={proj.id}
                            type="button"
                            onClick={() => onSelect(idx)}
                            className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border font-mono text-xs transition-all duration-200 shrink-0 focus:outline-hidden ${
                                isCurrent
                                    ? 'border-foreground bg-surface text-foreground shadow-md font-bold'
                                    : 'border-border/60 bg-surface/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                            }`}
                            aria-label={`Jump to ${proj.title}`}
                            aria-current={isCurrent ? 'true' : undefined}
                        >
                            <span
                                className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                                style={{
                                    backgroundColor: accent,
                                    boxShadow: isCurrent ? `0 0 8px ${accent}` : 'none',
                                }}
                            />
                            <span>{num}.</span>
                            <span className="font-display font-bold uppercase tracking-tight text-xs text-foreground">
                                {proj.title}
                            </span>
                            {proj.is_featured && (
                                <span className="text-[9px] rounded-full bg-[var(--accent)]/15 text-[var(--accent)] px-1.5 py-0.2 font-mono">
                                    ★
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
