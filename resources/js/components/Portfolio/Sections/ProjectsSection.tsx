import React, { useState } from 'react';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';
import SolarSystemScene from '../Projects/SolarSystemScene';

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
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'exhibition' | 'orbital'>('exhibition');
    const [originEl, setOriginEl] = useState<HTMLElement | null>(null);

    // Sort projects strictly by featured status and sort_order
    const sorted = [...projects].sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

    const featuredProject = sorted[0];
    const remainingProjects = sorted.slice(1);

    const openProject = (project: ProjectItem, el: HTMLElement) => {
        setSelectedProject(project);
        setOriginEl(el);
        setIsDetailOpen(true);
    };

    return (
        <section
            id={section.key}
            aria-label="Curated Projects Exhibition"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 03
                        </span>
                        <span>CURATED EXHIBITION // SELECTED CASE STUDIES</span>
                    </div>

                    {/* View mode toggle */}
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">VIEW MODE:</span>
                        <div className="flex border border-border">
                            <button
                                type="button"
                                onClick={() => setViewMode('exhibition')}
                                className={`px-3 py-1 font-mono text-[11px] font-bold uppercase transition-colors ${
                                    viewMode === 'exhibition'
                                        ? 'bg-foreground text-background'
                                        : 'bg-transparent text-foreground hover:bg-muted'
                                }`}
                            >
                                EXHIBITION
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('orbital')}
                                className={`px-3 py-1 font-mono text-[11px] font-bold uppercase transition-colors ${
                                    viewMode === 'orbital'
                                        ? 'bg-foreground text-background'
                                        : 'bg-transparent text-foreground hover:bg-muted'
                                }`}
                            >
                                3D ORBIT
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Title & Exhibition Manifesto */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // CATALOGUE ARCHIVE
                        </span>
                        <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                            SELECTED WORK,
                            <br />
                            BUILT TO WORK.
                        </h2>
                    </div>
                    <div className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        <p>
                            Each exhibit represents a bespoke architecture delivered for real organizations.
                            From multi-tenant enterprise platforms to high-performance consumer e-commerce.
                        </p>
                        <p className="mt-2 font-bold text-foreground">
                            TOTAL EXHIBITS CATALOGUED: [{sorted.length.toString().padStart(2, '0')}]
                        </p>
                    </div>
                </div>

                {/* VIEW MODE: 3D Orbital Fly-Through Mode */}
                {viewMode === 'orbital' ? (
                    <div className="mt-12 border-2 border-foreground bg-black/90 p-4 sm:p-6 text-white min-h-[600px] flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-white/20 pb-3 font-mono text-xs">
                            <span className="text-[var(--accent)] font-bold">
                                // 3D CELESTIAL PROJECTION
                            </span>
                            <span>SELECT PLANET TO ACCESS PROJECT DOSSIER</span>
                        </div>
                        <div className="h-[520px] w-full">
                            <SolarSystemScene
                                projects={sorted}
                                activeProject={selectedProject}
                                onSelectProject={(p: ProjectItem) => {
                                    setSelectedProject(p);
                                    setIsDetailOpen(true);
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    /* VIEW MODE: Curated Exhibition with Varied Compositions */
                    <div className="mt-12 space-y-12 sm:space-y-16">
                        {/* 1. FEATURED EXHIBIT: Dominant Split Spread (ASN Group) */}
                        {featuredProject && (
                            <div className="border-2 border-foreground bg-surface p-6 sm:p-10 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs text-muted-foreground uppercase">
                                    <div className="flex items-center gap-2">
                                        <span className="stamp-orange">
                                            PRINCIPAL EXHIBIT // 01
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {featuredProject.business_type || 'CONGLOMERATE ERP'}
                                        </span>
                                    </div>
                                    <span>STATUS: PRODUCTION // {featuredProject.year || '2025'}</span>
                                </div>

                                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                                    {/* Left: Oversized Image or Generative Visual */}
                                    <div className="lg:col-span-7">
                                        <div
                                            className="relative aspect-16/10 w-full overflow-hidden border-2 border-foreground bg-muted group cursor-pointer"
                                            onClick={(e) => openProject(featuredProject, e.currentTarget)}
                                            data-field-tag="ASN.GROUP"
                                        >
                                            {featuredProject.cover_media?.url ? (
                                                <img
                                                    src={featuredProject.cover_media.url}
                                                    alt={featuredProject.title}
                                                    className="h-full w-full object-cover grayscale contrast-110 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--surface-sand)]/60 p-8 text-center">
                                                    <span className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground/40">
                                                        {featuredProject.title}
                                                    </span>
                                                    <span className="mt-2 font-mono text-xs tracking-widest text-[var(--primary)] uppercase">
                                                        [ARCHITECTURAL ENTERPRISE CASE STUDY]
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-4 left-4 stamp-ink">
                                                CLICK TO INSPECT DOSSIER
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Project Title, Summary, Stack, and Direct Actions */}
                                    <div className="lg:col-span-5 flex flex-col justify-between">
                                        <div>
                                            <span className="font-mono text-xs font-bold text-[var(--primary)] tracking-widest uppercase">
                                                {featuredProject.role || 'LEAD ARCHITECT & DEVELOPER'}
                                            </span>
                                            <h3 className="mt-2 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                                                {featuredProject.title}
                                            </h3>
                                            <p className="mt-4 font-body text-base sm:text-lg leading-relaxed text-foreground/80">
                                                {featuredProject.summary ||
                                                    featuredProject.description}
                                            </p>

                                            {/* Stack labels as clean monospaced text */}
                                            {featuredProject.tags && featuredProject.tags.length > 0 && (
                                                <div className="mt-6 flex flex-wrap gap-2">
                                                    {featuredProject.tags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="editorial-tag bg-background text-foreground"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8 sm:mt-10 pt-6 border-t border-border flex flex-wrap items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={(e) => openProject(featuredProject, e.currentTarget)}
                                                className="bg-[var(--primary)] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                                                data-field-tag="DOSSIER"
                                            >
                                                VIEW PROJECT DOSSIER [→]
                                            </button>

                                            {featuredProject.live_url && (
                                                <a
                                                    href={featuredProject.live_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="border border-foreground px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
                                                    data-field-tag="LIVE"
                                                >
                                                    LIVE SITE [↗]
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. REMAINING PROJECTS WITH DELIBERATELY VARIED COMPOSITIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
                            {remainingProjects.map((project, idx) => {
                                const indexStr = (idx + 2).toString().padStart(2, '0');
                                // Give each card a distinct editorial character:
                                // Index 02: Wide Sand plate (col-span-7)
                                // Index 03: Deep Forest solid interruption (col-span-5)
                                // Index 04: Minimalist Stark Ink plate (col-span-6)
                                // Index 05: Maritime Coordinate spread (col-span-6)
                                // Index 06: Full-width plate (col-span-12)
                                const isForest = project.slug === 'tasa' || idx === 1;
                                const isSand = idx === 0;
                                const colSpan =
                                    idx === 0 ? 'lg:col-span-7' :
                                    idx === 1 ? 'lg:col-span-5' :
                                    idx === 2 ? 'lg:col-span-6' :
                                    idx === 3 ? 'lg:col-span-6' : 'lg:col-span-12';

                                return (
                                    <div
                                        key={project.id}
                                        className={`${colSpan} border-2 border-foreground p-6 sm:p-8 flex flex-col justify-between transition-transform hover:-translate-y-1 ${
                                            isForest
                                                ? 'bg-[var(--bg-forest)] text-white'
                                                : isSand
                                                ? 'bg-[var(--surface-sand)]/60 text-foreground'
                                                : 'bg-surface text-foreground'
                                        }`}
                                    >
                                        <div>
                                            {/* Top Index and Business Sector */}
                                            <div className="flex items-center justify-between border-b border-current/20 pb-3 font-mono text-xs">
                                                <span className={`font-black ${isForest ? 'text-[var(--accent)]' : 'text-[var(--primary)]'}`}>
                                                    EXHIBIT // {indexStr}
                                                </span>
                                                <span className="uppercase tracking-wider opacity-80">
                                                    {project.business_type || 'DIGITAL SYSTEM'}
                                                </span>
                                            </div>

                                            {/* Media Box or Typographic Cover */}
                                            <div
                                                className="mt-6 aspect-16/10 w-full overflow-hidden border border-current/30 cursor-pointer group"
                                                onClick={(e) => openProject(project, e.currentTarget)}
                                                data-field-tag={project.slug}
                                            >
                                                {project.cover_media?.url ? (
                                                    <img
                                                        src={project.cover_media.url}
                                                        alt={project.title}
                                                        className="h-full w-full object-cover grayscale contrast-110 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-black/10">
                                                        <span className="font-display text-2xl sm:text-3xl font-black uppercase opacity-60">
                                                            {project.title}
                                                        </span>
                                                        <span className="mt-2 font-mono text-[10px] tracking-widest uppercase opacity-75">
                                                            [{project.role || 'FULL-STACK'}]
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Project Title & Summary */}
                                            <h3 className="mt-6 font-display text-2xl sm:text-3xl font-black tracking-tight uppercase">
                                                {project.title}
                                            </h3>

                                            <p className="mt-3 font-body text-sm sm:text-base leading-relaxed opacity-85">
                                                {project.summary || project.description}
                                            </p>

                                            {/* Tags */}
                                            {project.tags && project.tags.length > 0 && (
                                                <div className="mt-5 flex flex-wrap gap-1.5">
                                                    {project.tags.slice(0, 4).map((t) => (
                                                        <span
                                                            key={t.id}
                                                            className={`font-mono text-[10px] px-2 py-0.5 border ${
                                                                isForest
                                                                    ? 'border-white/30 text-white'
                                                                    : 'border-foreground/30 text-foreground'
                                                            }`}
                                                        >
                                                            {t.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Actions */}
                                        <div className="mt-8 pt-4 border-t border-current/20 flex items-center justify-between font-mono text-xs">
                                            <button
                                                type="button"
                                                onClick={(e) => openProject(project, e.currentTarget)}
                                                className={`font-bold uppercase tracking-wider transition-colors hover:underline ${
                                                    isForest ? 'text-[var(--accent)]' : 'text-[var(--primary)]'
                                                }`}
                                                data-field-tag="DOSSIER"
                                            >
                                                INSPECT DOSSIER [→]
                                            </button>

                                            {project.live_url && (
                                                <a
                                                    href={project.live_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="opacity-80 hover:opacity-100 hover:underline uppercase"
                                                    data-field-tag="EXTERNAL"
                                                >
                                                    LIVE SITE [↗]
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Redesigned Editorial Project Dossier Modal */}
            <ProjectDetailPanel
                project={selectedProject}
                projects={sorted}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onSelectProject={(p) => setSelectedProject(p)}
                originElement={originEl}
            />
        </section>
    );
}
