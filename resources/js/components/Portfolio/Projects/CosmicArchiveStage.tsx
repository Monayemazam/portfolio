import React from 'react';
import { ProjectItem } from '@/types/portfolio';
import CosmicWorldCanvas from './CosmicWorldCanvas';

interface CosmicArchiveStageProps {
    project: ProjectItem;
    currentIndex: number;
    totalProjects: number;
    isTransitioning: boolean;
    isOff?: boolean;
    onExplore: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function CosmicArchiveStage({
    project,
    currentIndex,
    totalProjects,
    isTransitioning,
    isOff = false,
    onExplore,
    onPrev,
    onNext,
}: CosmicArchiveStageProps) {
    const accent = project.accent_color || '#F15A24';
    const sectorNumber = (currentIndex + 1).toString().padStart(2, '0');
    const totalSectors = totalProjects.toString().padStart(2, '0');

    return (
        <div className="relative mt-10 rounded-3xl border border-border/80 bg-surface/40 backdrop-blur-2xl p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden">
            {/* Ambient Localized Aura matching this project's accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl transition-colors duration-700"
                style={{ backgroundColor: accent }}
            />

            <div
                className={`flex flex-col space-y-8 transition-opacity duration-200 ${
                    isTransitioning ? 'opacity-25 translate-y-1' : 'opacity-100 translate-y-0'
                }`}
            >
                {/* 1. Sector Telemetry Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4 font-mono text-[10px] sm:text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span
                            className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0"
                            style={{
                                backgroundColor: accent,
                                boxShadow: `0 0 10px ${accent}`,
                            }}
                        />
                        <span className="font-bold text-foreground">
                            WORLD {sectorNumber} // {totalSectors}
                        </span>
                        <span className="text-border">·</span>
                        <span className="truncate max-w-[200px] sm:max-w-none">{project.business_type || 'COMMERCIAL SYSTEM'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-muted-foreground">
                            ROLE: <strong className="text-foreground">{project.role || 'FULL-STACK'}</strong>
                        </span>
                        <span className="text-border">·</span>
                        <span className="text-muted-foreground">
                            ERA: <strong className="text-foreground">{project.year || '2025'}</strong>
                        </span>
                        {project.is_featured && (
                            <span className="rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 px-2 py-0.5 text-[8px] sm:text-[9px] font-bold text-[var(--accent)]">
                                PRIME FEATURED
                            </span>
                        )}
                    </div>
                </div>

                {/* 2. Monumental World Title */}
                <div>
                    <h3 className="font-display text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-foreground leading-[1] break-words">
                        {project.title}
                    </h3>
                </div>

                {/* 3. The Panoramic Architectural Canvas */}
                <CosmicWorldCanvas
                    project={project}
                    sectorNumber={sectorNumber}
                    totalSectors={totalSectors}
                    onExplore={onExplore}
                    isOff={isOff}
                />

                {/* 4. Executive Narrative Dossier & Tech Chips */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                    {/* Summary Narrative */}
                    <div className="lg:col-span-8">
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // MISSION ARCHIVE SUMMARY
                        </span>
                        <p className="mt-2 font-body text-base sm:text-lg text-foreground/85 leading-relaxed">
                            {project.summary}
                        </p>

                        {/* Tech Chips */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full border border-border/80 bg-surface/60 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions Deck */}
                    <div className="lg:col-span-4 flex flex-col gap-3 justify-end lg:items-end">
                        <button
                            type="button"
                            onClick={onExplore}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-full bg-[var(--primary)] px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-[0_0_30px_rgba(241,90,36,0.4)] active:scale-98"
                        >
                            <span>EXPLORE MISSION DOSSIER</span>
                            <span className="font-sans">→</span>
                        </button>

                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur-sm px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-[var(--primary)] hover:bg-surface"
                            >
                                <span>LAUNCH LIVE PLATFORM</span>
                                <span className="font-sans">↗</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* 5. Traversal Controls Strip */}
                <div className="flex items-center justify-between pt-6 border-t border-border/40 font-mono text-xs text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onPrev}
                            className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-4 py-2 hover:border-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                            <span className="font-sans">←</span>
                            <span>PREV WORLD</span>
                        </button>

                        <button
                            type="button"
                            onClick={onNext}
                            className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-4 py-2 hover:border-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                            <span>NEXT WORLD</span>
                            <span className="font-sans">→</span>
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                        <span>NAVIGATE WITH</span>
                        <kbd className="px-2 py-0.5 rounded-sm bg-surface border border-border text-[10px] text-foreground">
                            ←
                        </kbd>
                        <kbd className="px-2 py-0.5 rounded-sm bg-surface border border-border text-[10px] text-foreground">
                            →
                        </kbd>
                        <span>OR CLICK ANY DESTINATION</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
