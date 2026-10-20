import React, { useEffect, useState } from 'react';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';
import CosmicWorldBadge from '../Projects/CosmicWorldBadge';
import CosmicArchiveStage from '../Projects/CosmicArchiveStage';
import CosmicWaypointRail from '../Projects/CosmicWaypointRail';

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

    // Deep link handling (e.g. #asn-group or direct slug)
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

    // Deliberate empty state if no projects are published
    if (!sorted || sorted.length === 0 || !activeProject) {
        return (
            <section
                id={section.key}
                aria-label="The Cosmic Archive"
                className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 select-none"
            >
                <div className="mx-auto max-w-[1440px] text-center">
                    <div className="rounded-3xl border border-border/60 bg-surface/30 p-12 backdrop-blur-xl">
                        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            // COSMIC ARCHIVE
                        </span>
                        <h2 className="mt-4 font-display text-2xl font-bold uppercase text-foreground">
                            ARCHIVE INDEX OFFLINE
                        </h2>
                        <p className="mt-2 font-body text-sm text-muted-foreground">
                            No digital worlds currently published to the archive database.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const accentColor = activeProject.accent_color || '#F15A24';

    return (
        <section
            id={section.key}
            aria-label="The Cosmic Archive — Worlds I Have Built"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none"
        >
            {/* Ambient Cosmic Horizon Glow matching active project accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 right-0 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full opacity-15 blur-[160px] transition-all duration-700"
                style={{ backgroundColor: accentColor }}
            />

            <div className="mx-auto max-w-[1440px]">
                {/* 1. Archive Section Telemetry Header */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span
                        className="h-2 w-2 rounded-full transition-colors duration-500"
                        style={{
                            backgroundColor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}`,
                        }}
                    />
                    <span>03 // THE COSMIC ARCHIVE</span>
                    <span className="text-border">·</span>
                    <span className="text-foreground font-semibold">
                        WORLDS I HAVE BUILT
                    </span>
                    <span className="ml-auto hidden sm:inline text-muted-foreground">
                        CURATED DIGITAL DESTINATIONS
                    </span>
                </div>

                {/* 2. Section Heroic Headline */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // WORLDS I HAVE BUILT
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
                            THE COSMIC ARCHIVE:
                            <br />
                            NAVIGATE MY CREATIONS.
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                        An interactive exhibition of production architectures, live enterprise platforms,
                        and commercial ecommerce systems. Each world has its own atmosphere, purpose, and story.
                    </p>
                </div>

                {/* 3. ELEMENT A: The Universe View (Constellation Deck) */}
                <div className="mt-12">
                    <div className="flex items-center justify-between pb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            <span>CONSTELLATION VIEW // CHOOSE A WORLD DESTINATION</span>
                        </div>
                        <span className="hidden sm:inline">SWIPE OR CLICK TO ENTER</span>
                    </div>

                    <div
                        className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none"
                        role="tablist"
                        aria-label="Cosmic Worlds Constellation"
                    >
                        {sorted.map((proj, idx) => (
                            <CosmicWorldBadge
                                key={proj.id}
                                project={proj}
                                index={idx}
                                isActive={idx === currentIndex}
                                onSelect={() => changeProject(idx)}
                                isOff={isOff}
                            />
                        ))}
                    </div>
                </div>

                {/* 4. ELEMENT B: The Selected World Exhibition Chamber */}
                <CosmicArchiveStage
                    project={activeProject}
                    currentIndex={currentIndex}
                    totalProjects={sorted.length}
                    isTransitioning={isTransitioning}
                    isOff={isOff}
                    onExplore={() => openDetail(activeProject)}
                    onPrev={goToPrev}
                    onNext={goToNext}
                />

                {/* 5. ELEMENT C: The Celestial Waypoint Index */}
                <div className="mt-10">
                    <CosmicWaypointRail
                        projects={sorted}
                        currentIndex={currentIndex}
                        onSelect={changeProject}
                    />
                </div>
            </div>

            {/* Complete Project Detail Panel Modal */}
            <ProjectDetailPanel
                project={selectedProject}
                projects={sorted}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onSelectProject={(proj) => {
                    setSelectedProject(proj);
                    const idx = sorted.findIndex((p) => p.id === proj.id);
                    if (idx !== -1) setCurrentIndex(idx);
                }}
            />
        </section>
    );
}
