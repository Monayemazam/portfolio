import React, { useState } from 'react';
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
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
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

                    <div className="flex items-center gap-3 text-foreground font-semibold">
                        <span className="h-2 w-2 bg-[var(--primary)] inline-block" />
                        <span>CATALOGUE ARCHIVE: [{sorted.length.toString().padStart(2, '0')} EXHIBITS CATALOGUED]</span>
                    </div>
                </div>

                {/* Section Title & Exhibition Manifesto */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // ARCHITECTURAL SYSTEMS & CASE STUDIES
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

                {/* Curated Exhibition with Varied Architectural Compositions */}
                <div className="mt-12 space-y-12 sm:space-y-16">
                    {/* 1. FEATURED EXHIBIT: Wide Rectangular Architectural Showcase */}
                    {featuredProject && (
                        <div className="group border-2 border-foreground bg-surface p-6 sm:p-10 lg:p-12 shadow-sm relative transition-all duration-300 hover:shadow-md">
                            {/* Technical Corner Hairline Registration Marks */}
                            <span className="absolute -top-3 -left-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                                +
                            </span>
                            <span className="absolute -top-3 -right-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                                +
                            </span>
                            <span className="absolute -bottom-3 -left-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                                +
                            </span>
                            <span className="absolute -bottom-3 -right-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                                +
                            </span>

                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs text-muted-foreground uppercase">
                                <div className="flex items-center gap-3">
                                    <span className="stamp-orange text-[11px] font-bold">
                                        PRINCIPAL EXHIBIT // 01
                                    </span>
                                    <span className="font-bold text-foreground tracking-wider">
                                        {featuredProject.business_type || 'ENTERPRISE SYSTEM'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="hidden sm:inline">CYCLE: {featuredProject.year || '2025'}</span>
                                    <span className="text-[var(--primary)] font-bold">STATUS: PRODUCTION // ACTIVE</span>
                                </div>
                            </div>

                            <div className="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                                {/* Left: Wide Rectangular Architectural Cover / Media */}
                                <div className="lg:col-span-7">
                                    <div
                                        className="relative aspect-16/10 w-full overflow-hidden border-2 border-foreground bg-muted group cursor-pointer"
                                        onClick={(e) => openProject(featuredProject, e.currentTarget)}
                                        data-field-tag={featuredProject.slug}
                                    >
                                        <ProjectArchitecturalCover
                                            project={featuredProject}
                                            isFeatured={true}
                                        />

                                        <div className="absolute bottom-4 left-4 stamp-ink shadow-xs transition-transform duration-200 group-hover:translate-x-1">
                                            CLICK TO INSPECT DOSSIER [→]
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Project Title, Summary, Stack, and Direct Actions */}
                                <div className="lg:col-span-5 flex flex-col justify-between h-full">
                                    <div>
                                        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--primary)] tracking-widest uppercase">
                                            <span>[{featuredProject.role || 'LEAD ARCHITECT'}]</span>
                                            <span className="text-border">/</span>
                                            <span className="text-muted-foreground">{featuredProject.year || '2025'}</span>
                                        </div>

                                        <h3 className="mt-3 font-display text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-foreground uppercase leading-[0.95] transition-transform duration-200 group-hover:translate-x-1">
                                            {featuredProject.title}
                                        </h3>

                                        <p className="mt-5 font-body text-base sm:text-lg leading-relaxed text-foreground/85">
                                            {featuredProject.summary || featuredProject.description}
                                        </p>

                                        {/* Stack labels as clean monospaced text */}
                                        {featuredProject.tags && featuredProject.tags.length > 0 && (
                                            <div className="mt-6">
                                                <span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                                                    ENGINEERING STACK:
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {featuredProject.tags.map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="editorial-tag bg-background text-foreground border border-border"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={(e) => openProject(featuredProject, e.currentTarget)}
                                            className="bg-[var(--primary)] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 shadow-sm"
                                            data-field-tag="DOSSIER"
                                        >
                                            VIEW PROJECT DOSSIER [→]
                                        </button>

                                        {featuredProject.live_url && (
                                            <a
                                                href={featuredProject.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="border border-foreground px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
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
                            // Varied architectural card layouts:
                            // Index 02: Wide Sand plate (col-span-7)
                            // Index 03: Deep Forest solid interruption (col-span-5)
                            // Index 04: Minimalist Stark Ink plate (col-span-6)
                            // Index 05: Maritime / Marine spread (col-span-6)
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
                                    className={`group ${colSpan} border-2 border-foreground p-6 sm:p-8 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 ${
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

                                        {/* Media Box or Typographic Architectural Cover */}
                                        <div
                                            className="mt-6 aspect-16/10 w-full overflow-hidden border-2 border-current/30 cursor-pointer group/cover"
                                            onClick={(e) => openProject(project, e.currentTarget)}
                                            data-field-tag={project.slug}
                                        >
                                            <ProjectArchitecturalCover project={project} />
                                        </div>

                                        {/* Project Title & Summary */}
                                        <h3 className="mt-6 font-display text-2xl sm:text-3xl font-black tracking-tight uppercase transition-transform duration-200 group-hover:translate-x-1">
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
