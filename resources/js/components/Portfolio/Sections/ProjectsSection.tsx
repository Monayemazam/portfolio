import React, { useEffect, useState } from 'react';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';
import ProjectArchitecturalCover from '../Projects/ProjectArchitecturalCover';

interface ProjectsSectionProps {
    section: PortfolioSection;
    projects: ProjectItem[];
    isOff?: boolean;
    isDark?: boolean;
}

export default function ProjectsSection({
    section,
    projects,
    isOff = false,
}: ProjectsSectionProps) {
    // Sort projects strictly by featured status and sort_order
    const sorted = [...projects].sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const activeProject = sorted[currentIndex] || sorted[0];

    // Deep link handling (e.g. #asn-group)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const foundIndex = sorted.findIndex((p) => p.slug === hash);
            if (foundIndex !== -1) {
                setCurrentIndex(foundIndex);
            }
        }

        const handleHashChange = () => {
            const currentHash = window.location.hash.replace('#', '');
            const idx = sorted.findIndex((p) => p.slug === currentHash);
            if (idx !== -1) {
                setCurrentIndex(idx);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [sorted]);

    // Keyboard navigation (Left / Right / Enter)
    useEffect(() => {
        if (isDetailOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const activeTag = document.activeElement?.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea') return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                goToNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                goToPrev();
            } else if (e.key === 'Enter') {
                if (activeProject) {
                    openDetail(activeProject);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, isDetailOpen, activeProject]);

    const changeProject = (newIndex: number) => {
        if (newIndex === currentIndex) return;
        if (!isOff) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex(newIndex);
                setIsTransitioning(false);
            }, 180);
        } else {
            setCurrentIndex(newIndex);
        }
    };

    const goToPrev = () => {
        const prev = currentIndex === 0 ? sorted.length - 1 : currentIndex - 1;
        changeProject(prev);
    };

    const goToNext = () => {
        const next = currentIndex === sorted.length - 1 ? 0 : currentIndex + 1;
        changeProject(next);
    };

    const openDetail = (project: ProjectItem) => {
        setSelectedProject(project);
        setIsDetailOpen(true);
    };

    if (!activeProject) return null;

    const accentColor = activeProject.accent_color || '#F15A24';
    const destinationNumber = (currentIndex + 1).toString().padStart(2, '0');
    const totalDestinations = sorted.length.toString().padStart(2, '0');

    return (
        <section
            id={section.key}
            aria-label="The Project Universe"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none"
        >
            {/* Dynamic Localized Ambient Light Wash matching active project accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 right-0 w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] rounded-full opacity-20 blur-[150px] transition-all duration-700"
                style={{ backgroundColor: accentColor }}
            />

            <div className="mx-auto max-w-[1440px]">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span
                        className="h-2 w-2 rounded-full transition-colors duration-500"
                        style={{
                            backgroundColor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                        }}
                    />
                    <span>03 // PROJECT UNIVERSE</span>
                    <span className="text-border">·</span>
                    <span className="text-foreground font-semibold">
                        CURATED CELESTIAL WORLDS
                    </span>
                    <span className="ml-auto hidden sm:inline text-muted-foreground">
                        USE [← / → ARROWS] OR SELECT A WORLD
                    </span>
                </div>

                {/* Section Title */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // SELECTED DIGITAL WORLDS
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
                            EXPLORE A UNIVERSE
                            <br />
                            OF REAL WORK.
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Each production system represents a distinct digital destination. Navigate
                        through verified architectures, live commercial platforms, and delivered features.
                    </p>
                </div>

                {/* Planetary Exploration Jump Strip */}
                <div className="mt-12 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {sorted.map((proj, idx) => {
                        const isCurrent = idx === currentIndex;
                        const projAccent = proj.accent_color || '#F15A24';

                        return (
                            <button
                                key={proj.id}
                                type="button"
                                onClick={() => changeProject(idx)}
                                className={`group flex items-center gap-3 rounded-full border px-5 py-2.5 transition-all whitespace-nowrap focus:outline-hidden ${
                                    isCurrent
                                        ? 'border-foreground bg-surface text-foreground shadow-lg'
                                        : 'border-border/70 bg-surface/30 backdrop-blur-sm text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                                }`}
                                aria-label={`Select ${proj.title}`}
                            >
                                <span
                                    className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                                    style={{
                                        backgroundColor: projAccent,
                                        boxShadow: isCurrent ? `0 0 10px ${projAccent}` : 'none',
                                    }}
                                />
                                <span className="font-mono text-xs font-bold">
                                    {(idx + 1).toString().padStart(2, '0')}.
                                </span>
                                <span className="font-display text-xs font-bold uppercase tracking-tight">
                                    {proj.title}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* THE MAIN CELESTIAL STAGE */}
                <div className="mt-8 rounded-3xl border border-border/80 bg-surface/60 backdrop-blur-2xl p-6 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden space-rim-light">
                    <div
                        className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center transition-opacity duration-200 ${
                            isTransitioning ? 'opacity-30' : 'opacity-100'
                        }`}
                    >
                        {/* Left Column: Visual Media Preview Surface */}
                        <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="group relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-[#141712] border border-border/60">
                                <ProjectArchitecturalCover
                                    project={activeProject}
                                    isFeatured={activeProject.is_featured}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                                />

                                {/* Ambient rim wash at the bottom */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 opacity-30"
                                    style={{
                                        background: `linear-gradient(to top, ${accentColor}, transparent)`,
                                    }}
                                />

                                {/* Floating Live Badge */}
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 font-mono text-[11px] text-white border border-white/10">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                    <span>DESTINATION {destinationNumber} // {totalDestinations}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Project World Information & Actions */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            <div>
                                {/* Project Tags & Year */}
                                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground uppercase">
                                    <span className="font-bold text-foreground">
                                        YEAR: {activeProject.year || '2026'}
                                    </span>
                                    <span className="text-border">·</span>
                                    <span>{activeProject.business_type || 'COMMERCIAL SYSTEM'}</span>
                                    {activeProject.is_featured && (
                                        <span className="ml-auto rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 px-2.5 py-0.5 text-[9px] font-bold text-[var(--accent)]">
                                            FEATURED WORLD
                                        </span>
                                    )}
                                </div>

                                {/* Project Title */}
                                <h3 className="mt-4 font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
                                    {activeProject.title}
                                </h3>

                                {/* Project Summary */}
                                <p className="mt-4 font-body text-base leading-relaxed text-foreground/80">
                                    {activeProject.summary}
                                </p>

                                {/* Tags */}
                                {activeProject.tags && activeProject.tags.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {activeProject.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-full border border-border/80 bg-surface/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 border-t border-border/40 flex flex-wrap items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => openDetail(activeProject)}
                                    className="flex items-center gap-3 rounded-full bg-[var(--primary)] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-[0_0_25px_rgba(241,90,36,0.35)] active:scale-98"
                                >
                                    <span>EXPLORE MISSION DOSSIER</span>
                                    <span className="font-sans">→</span>
                                </button>

                                {activeProject.live_url && (
                                    <a
                                        href={activeProject.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur-sm px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-[var(--primary)] hover:bg-surface"
                                    >
                                        <span>LIVE PLATFORM</span>
                                        <span className="font-sans">↗</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stage Stepper Footer Controls */}
                    <div className="mt-10 pt-6 border-t border-border/40 flex items-center justify-between font-mono text-xs text-muted-foreground uppercase">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={goToPrev}
                                className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-4 py-2 hover:border-foreground hover:text-foreground transition-all"
                            >
                                <span className="font-sans">←</span>
                                <span>PREVIOUS WORLD</span>
                            </button>

                            <button
                                type="button"
                                onClick={goToNext}
                                className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/50 px-4 py-2 hover:border-foreground hover:text-foreground transition-all"
                            >
                                <span>NEXT WORLD</span>
                                <span className="font-sans">→</span>
                            </button>
                        </div>

                        <span className="hidden sm:inline font-bold text-foreground">
                            ORBIT {destinationNumber} OF {totalDestinations}
                        </span>
                    </div>
                </div>
            </div>

            {/* Complete Project Detail Panel Modal */}
            <ProjectDetailPanel
                project={selectedProject}
                projects={sorted}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onSelectProject={(proj) => setSelectedProject(proj)}
            />
        </section>
    );
}
