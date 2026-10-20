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
        if (isDetailOpen) return; // Allow detail panel to handle its own keys

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if active element is an input
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
    const exhibitNumber = (currentIndex + 1).toString().padStart(2, '0');
    const totalExhibits = sorted.length.toString().padStart(2, '0');

    return (
        <section
            id={section.key}
            aria-label="Curated Work Exhibition Stage"
            className="w-full border-b-2 border-foreground bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28 select-none transition-colors duration-500"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Calibration Eyebrow Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="stamp-orange text-[10px] tracking-widest">
                            SEC. 04 // GALLERY
                        </span>
                        <span className="font-bold text-foreground">
                            CURATED WORK EXHIBITION
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-foreground font-semibold">
                        <span className="hidden sm:inline text-muted-foreground">
                            NAVIGATE: [← / → ARROWS] · [ENTER: DOSSIER]
                        </span>
                        <span className="h-2 w-2 bg-[var(--primary)] inline-block" />
                        <span>
                            STAGE: [{exhibitNumber} / {totalExhibits}]
                        </span>
                    </div>
                </div>

                {/* Section Introduction */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // ARCHITECTURAL SYSTEMS & CASE STUDIES
                        </span>
                        <h2 className="mt-2 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                            SELECTED WORK,
                            <br />
                            BUILT TO WORK.
                        </h2>
                    </div>
                    <div className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        <p>
                            An interactive stage showcasing verified production software.
                            Each case study reveals real client architectures, delivered features,
                            and responsive implementations.
                        </p>
                    </div>
                </div>

                {/* THE MAIN INTERACTIVE EXHIBITION STAGE */}
                <div
                    className="mt-12 border-2 border-foreground bg-surface shadow-sm relative overflow-hidden transition-all duration-300"
                    style={{
                        borderColor: isDarkState() ? 'rgba(242, 239, 230, 0.4)' : '#171914',
                    }}
                >
                    {/* Corner Caliper Precision Crosshairs */}
                    <span className="absolute top-3 left-3 font-mono text-xs font-bold text-[var(--primary)] z-20 pointer-events-none">
                        + [EXHIBIT_{exhibitNumber}]
                    </span>
                    <span className="absolute top-3 right-3 font-mono text-xs font-bold text-[var(--primary)] z-20 pointer-events-none">
                        [{activeProject.year || '2026'}] +
                    </span>
                    <span className="absolute bottom-3 left-3 font-mono text-xs font-bold text-[var(--primary)] z-20 pointer-events-none">
                        + [{activeProject.business_type || 'COMMERCIAL'}]
                    </span>
                    <span className="absolute bottom-3 right-3 font-mono text-xs font-bold text-[var(--primary)] z-20 pointer-events-none">
                        [ACTIVE_STAGE] +
                    </span>

                    {/* Top Exhibition Stage Header Bar */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between border-b-2 border-foreground bg-background px-6 py-3 font-mono text-xs uppercase">
                        <div className="flex items-center gap-3">
                            <span
                                className="h-2.5 w-2.5 inline-block border border-foreground"
                                style={{ backgroundColor: accentColor }}
                            />
                            <span className="font-bold text-foreground">
                                {activeProject.title}
                            </span>
                            <span className="text-border">/</span>
                            <span className="text-muted-foreground">
                                {activeProject.role || 'FULL-STACK ENGINEER'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {activeProject.is_featured && (
                                <span className="stamp-lime text-[9px]">
                                    FEATURED PRODUCTION RELEASE
                                </span>
                            )}
                            <span className="border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                                SLUG: #{activeProject.slug}
                            </span>
                        </div>
                    </div>

                    {/* Main Stage Grid: Media Preview Left, Architectural Dossier Right */}
                    <div
                        className={`grid grid-cols-1 lg:grid-cols-12 gap-0 transition-opacity duration-200 ${
                            isTransitioning ? 'opacity-30' : 'opacity-100'
                        }`}
                    >
                        {/* Left Column: Large Image or Deterministic Typographic Cover */}
                        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r-2 border-foreground bg-[#141712] relative min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full relative">
                                <ProjectArchitecturalCover
                                    project={activeProject}
                                    isFeatured={activeProject.is_featured}
                                    className="h-full w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[540px]"
                                />
                            </div>

                            {/* Accent Color Ambient Field Wash in Corner */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 opacity-25"
                                style={{
                                    background: `linear-gradient(to top, ${accentColor}, transparent)`,
                                }}
                            />
                        </div>

                        {/* Right Column: Architectural Project Dossier & Controls */}
                        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-surface">
                            <div>
                                {/* Project Index Number & Classification */}
                                <div className="flex items-baseline justify-between border-b border-border pb-3 font-mono text-xs">
                                    <span
                                        className="font-black text-2xl"
                                        style={{ color: accentColor }}
                                    >
                                        {exhibitNumber} //
                                    </span>
                                    <span className="text-muted-foreground uppercase">
                                        YEAR: {activeProject.year || '2026'}
                                    </span>
                                </div>

                                {/* Oversized Project Name */}
                                <h3 className="mt-4 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
                                    {activeProject.title}
                                </h3>

                                {/* Summary */}
                                <p className="mt-4 font-body text-sm sm:text-base leading-relaxed text-foreground/85">
                                    {activeProject.summary}
                                </p>

                                {/* Metadata Matrix */}
                                <div className="mt-6 border border-border bg-background p-4 font-mono text-xs divide-y divide-border">
                                    <div className="pb-2 flex justify-between">
                                        <span className="text-muted-foreground uppercase">SYSTEM:</span>
                                        <span className="font-bold text-foreground">
                                            {activeProject.title}
                                        </span>
                                    </div>
                                    <div className="py-2 flex justify-between">
                                        <span className="text-muted-foreground uppercase">ROLE:</span>
                                        <span className="font-bold text-foreground">
                                            {activeProject.role || 'FULL-STACK LEAD'}
                                        </span>
                                    </div>
                                    <div className="pt-2 flex justify-between">
                                        <span className="text-muted-foreground uppercase">SECTOR:</span>
                                        <span className="font-bold text-foreground">
                                            {activeProject.business_type || 'COMMERCIAL WEB'}
                                        </span>
                                    </div>
                                </div>

                                {/* Tag Chips */}
                                {activeProject.tags && activeProject.tags.length > 0 && (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {activeProject.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="border border-border bg-background px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Interactive Actions & Deep Navigation */}
                            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => openDetail(activeProject)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 active:scale-98 shadow-xs"
                                >
                                    <span>OPEN COMPLETE DOSSIER</span>
                                    <span className="font-sans font-bold">→</span>
                                </button>

                                {activeProject.live_url && (
                                    <a
                                        href={activeProject.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 border-2 border-foreground bg-transparent px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                                    >
                                        <span>LIVE SITE</span>
                                        <span className="font-sans">↗</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Exhibition Selector Console & Stepper Controls */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between border-t-2 border-foreground bg-background p-4 sm:p-6 gap-4">
                        {/* Stepper Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={goToPrev}
                                className="flex items-center gap-2 border-2 border-foreground bg-surface px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background active:scale-95"
                                aria-label="Previous Exhibit"
                            >
                                <span className="font-sans font-bold">←</span>
                                <span className="hidden sm:inline">PREV</span>
                            </button>

                            <button
                                type="button"
                                onClick={goToNext}
                                className="flex items-center gap-2 border-2 border-foreground bg-surface px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background active:scale-95"
                                aria-label="Next Exhibit"
                            >
                                <span className="hidden sm:inline">NEXT</span>
                                <span className="font-sans font-bold">→</span>
                            </button>
                        </div>

                        {/* Interactive Thumbnail Jump Strip */}
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                            {sorted.map((proj, idx) => {
                                const isCurrent = idx === currentIndex;
                                return (
                                    <button
                                        key={proj.id}
                                        type="button"
                                        onClick={() => changeProject(idx)}
                                        className={`group relative flex items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-all ${
                                            isCurrent
                                                ? 'border-foreground bg-foreground text-background font-bold'
                                                : 'border-border bg-surface text-muted-foreground hover:border-foreground hover:text-foreground'
                                        }`}
                                        title={proj.title}
                                    >
                                        <span>{(idx + 1).toString().padStart(2, '0')}</span>
                                        <span className="hidden md:inline max-w-[100px] truncate text-[11px]">
                                            {proj.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
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

function isDarkState(): boolean {
    if (typeof document === 'undefined') return true;
    return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
    );
}
