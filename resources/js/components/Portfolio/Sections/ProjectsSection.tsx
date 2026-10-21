import React, { useEffect, useMemo, useState } from 'react';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';
import ProjectArchitecturalCover from '../Projects/ProjectArchitecturalCover';
import TagChip from '../Shared/TagChip';
import { ArrowAngularTopRight, ArrowRight, Layers1 } from '../Shared/Icons';

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
    // 1. Sort projects strictly by featured status then sort_order
    const sorted = useMemo(() => {
        return [...projects].sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        });
    }, [projects]);

    // 2. Identify the genuinely featured project (or top sorted)
    const featuredProject = useMemo(() => {
        return sorted.find((p) => p.is_featured) || sorted[0];
    }, [sorted]);

    // 3. Supporting projects in the asymmetric archive
    const supportingProjects = useMemo(() => {
        if (!featuredProject) return [];
        return sorted.filter((p) => p.id !== featuredProject.id);
    }, [sorted, featuredProject]);

    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [activeSlug, setActiveSlug] = useState<string>(featuredProject?.slug || '');

    // Deep link handling (e.g. #asn-group or #mercury-bangladesh)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const target = sorted.find((p) => p.slug === hash);
                if (target) {
                    setActiveSlug(target.slug);
                    const el = document.getElementById(`project-${target.slug}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, [sorted]);

    const openDetail = (project: ProjectItem) => {
        setSelectedProject(project);
        setIsDetailOpen(true);
    };

    const scrollToProject = (slug: string) => {
        setActiveSlug(slug);
        const el = document.getElementById(`project-${slug}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Deliberate empty state if no projects are published
    if (!sorted || sorted.length === 0 || !featuredProject) {
        return (
            <section
                id={section.key}
                aria-label="The Work Archive"
                className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24"
            >
                <div className="mx-auto max-w-[1440px] text-center">
                    <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-12">
                        <span className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                            // WORK ARCHIVE
                        </span>
                        <h2 className="mt-4 font-display text-2xl font-bold uppercase text-[var(--text)]">
                            ARCHIVE OFFLINE
                        </h2>
                        <p className="mt-2 font-body text-sm text-[var(--text-muted)]">
                            No digital projects currently published to the archive database.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const featuredAccent = featuredProject.accent_color || '#F15A24';

    return (
        <section
            id={section.key}
            aria-label="The Work Archive — Curated Digital Case Studies"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32"
        >
            {/* Ambient Celestial Horizon Glow behind the exhibition */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 -right-24 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full opacity-10 blur-[160px] transition-all duration-1000"
                style={{ backgroundColor: featuredAccent }}
            />

            <div className="mx-auto max-w-[1440px]">
                {/* 1. Technical Coordinate Breadcrumb */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                    <div className="flex items-center gap-3">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{
                                backgroundColor: 'var(--primary)',
                                boxShadow: '0 0 10px var(--primary)',
                            }}
                        />
                        <span className="font-bold text-[var(--text)]">PROJECTS</span>
                        <span className="text-[var(--surface-border)]">/</span>
                        <span>SELECTED WORK</span>
                        <span className="text-[var(--surface-border)]">/</span>
                        <span className="text-[var(--primary)] font-bold">THE WORK ARCHIVE</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <span className="hidden sm:inline">COORDS // RA 14h // SPEC.PROD</span>
                        <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-0.5 font-bold text-[var(--text)]">
                            {sorted.length} PUBLISHED WORK{sorted.length === 1 ? '' : 'S'}
                        </span>
                    </div>
                </div>

                {/* 2. Strong Editorial Introduction */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // SELECTED WORK. REAL DIGITAL PRODUCTS.
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] uppercase leading-[1.08]">
                            SELECTED WORK.
                            <br />
                            <span className="text-[var(--text-muted)]">REAL DIGITAL PRODUCTS.</span>
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                        Curated case studies of production web applications, corporate logistics platforms, and custom ecommerce stores engineered for performance and reliability.
                    </p>
                </div>

                {/* 3. Refined Project Quick-Jump Index */}
                <div className="mt-10 border-y border-[var(--surface-border)] py-4">
                    <div className="flex items-center justify-between gap-4 pb-2 font-mono text-[11px] tracking-widest text-[var(--text-muted)] uppercase">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            <span>ARCHIVE INDEX</span>
                        </div>
                        <span className="hidden sm:inline">SELECT AN ENTRY TO JUMP OR INSPECT</span>
                    </div>
                    <div
                        className="flex items-center gap-2 overflow-x-auto pt-1 pb-2 scrollbar-none"
                        role="navigation"
                        aria-label="Archive Index"
                    >
                        {sorted.map((proj, idx) => {
                            const isCurrent = activeSlug === proj.slug;
                            const indexNumber = (idx + 1).toString().padStart(2, '0');

                            return (
                                <button
                                    key={proj.id}
                                    type="button"
                                    onClick={() => scrollToProject(proj.slug)}
                                    className={`group flex flex-shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs transition-all duration-200 ${
                                        isCurrent
                                            ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)] shadow-xs'
                                            : 'border-[var(--surface-border)] bg-[var(--surface)]/50 text-[var(--text-muted)] hover:border-[var(--text)]/30 hover:text-[var(--text)]'
                                    }`}
                                >
                                    <span
                                        className={`font-bold transition-colors ${
                                            isCurrent
                                                ? 'text-[var(--primary)]'
                                                : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'
                                        }`}
                                    >
                                        {indexNumber}.
                                    </span>
                                    <span className="font-semibold uppercase tracking-wider">
                                        {proj.title}
                                    </span>
                                    {proj.is_featured && (
                                        <span className="rounded bg-[var(--primary)]/15 px-1.5 py-0.5 text-[9px] font-bold text-[var(--primary)]">
                                            FEATURED
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. FEATURED PROJECT: Monumental Art-Directed Case Study */}
                <div
                    id={`project-${featuredProject.slug}`}
                    className="mt-12 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-10 lg:p-12 relative overflow-hidden group shadow-lg transition-all duration-300 hover:border-[var(--text)]/25"
                >
                    {/* Corner Registration Marks */}
                    <span className="pointer-events-none absolute top-3 left-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-60">
                        +
                    </span>
                    <span className="pointer-events-none absolute top-3 right-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-60">
                        +
                    </span>
                    <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-60">
                        +
                    </span>
                    <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-60">
                        +
                    </span>

                    {/* Subtle Top Status Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                        <div className="flex items-center gap-2.5">
                            <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
                            <span className="font-bold text-[var(--primary)]">
                                FEATURED CASE STUDY // 01
                            </span>
                            <span className="text-[var(--surface-border)]">|</span>
                            <span>{featuredProject.business_type || 'DIGITAL SYSTEM'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[var(--text-muted)]">
                                {featuredProject.year || '2025'} EDITION
                            </span>
                            <span className="rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-foreground)]">
                                PRODUCTION LIVE
                            </span>
                        </div>
                    </div>

                    {/* Case Study Split: Left Preview & Right Dossier */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Left: Prominent Browser-Style Viewport (7 cols) */}
                        <div className="lg:col-span-7">
                            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg)] overflow-hidden shadow-md">
                                {/* Browser Window Chrome Bar */}
                                <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/80" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/80" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/80" />
                                    </div>
                                    <div className="max-w-[280px] sm:max-w-xs truncate rounded-md border border-[var(--surface-border)] bg-[var(--bg)] px-3 py-1 font-mono text-[10px] text-[var(--text-muted)]">
                                        {featuredProject.live_url
                                            ? featuredProject.live_url.replace(/\/$/, '')
                                            : `archive://${featuredProject.slug}.local`}
                                    </div>
                                    <div className="font-mono text-[9px] font-bold text-[var(--accent)] uppercase hidden sm:block">
                                        200 OK
                                    </div>
                                </div>

                                {/* Preview Surface: Real screenshot or Architectural Plate */}
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg)]">
                                    <ProjectArchitecturalCover
                                        project={featuredProject}
                                        isFeatured={true}
                                        className="h-full w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Curated Dossier Metadata & Actions (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                            <div>
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                                    {featuredProject.role || 'LEAD FULL-STACK DEVELOPER'}
                                </span>
                                <h3 className="mt-2 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text)]">
                                    {featuredProject.title}
                                </h3>

                                <p className="mt-4 font-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                                    {featuredProject.summary || featuredProject.description}
                                </p>

                                {/* Real Tag Chips */}
                                {featuredProject.tags && featuredProject.tags.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {featuredProject.tags.map((tag) => (
                                            <TagChip key={tag.id}>{tag.name}</TagChip>
                                        ))}
                                    </div>
                                )}

                                {/* Key Verified Features List */}
                                {featuredProject.features && featuredProject.features.length > 0 && (
                                    <div className="mt-6 space-y-2 border-t border-[var(--surface-border)] pt-4">
                                        <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                                            // KEY ARCHITECTURAL DELIVERABLES:
                                        </span>
                                        {featuredProject.features.slice(0, 3).map((f) => (
                                            <div
                                                key={f.id}
                                                className="flex items-start gap-2.5 font-body text-xs text-[var(--text-muted)]"
                                            >
                                                <span className="mt-0.5 text-[var(--primary)] font-mono font-bold">
                                                    →
                                                </span>
                                                <span className="leading-snug">{f.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Direct Action Buttons */}
                            <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--surface-border)]">
                                <button
                                    type="button"
                                    onClick={() => openDetail(featuredProject)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--text)] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-paper)] shadow-sm transition-all duration-200 hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white"
                                >
                                    <span>Explore Full Dossier</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                {featuredProject.live_url && (
                                    <a
                                        href={featuredProject.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-200 hover:border-[var(--text)] hover:bg-[var(--surface)]"
                                    >
                                        <span>Visit Live System</span>
                                        <ArrowAngularTopRight className="h-4 w-4 text-[var(--primary)]" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. ASYMMETRIC EDITORIAL GALLERY: Supporting Work Archive */}
                {supportingProjects.length > 0 && (
                    <div className="mt-16 sm:mt-24">
                        {/* Editorial Section Divider */}
                        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                            <div className="flex items-center gap-2">
                                <Layers1 className="h-4 w-4 text-[var(--primary)]" />
                                <span className="font-bold text-[var(--text)]">
                                    THE ASYMMETRIC ARCHIVE
                                </span>
                                <span className="text-[var(--surface-border)]">/</span>
                                <span>ALL DOCUMENTED RELEASES</span>
                            </div>
                            <span className="hidden sm:inline text-[11px]">
                                {supportingProjects.length} ADDITIONAL PRODUCTION SYSTEMS
                            </span>
                        </div>

                        {/* Asymmetric 12-Column Responsive Layout */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {supportingProjects.map((proj, idx) => {
                                const indexNumber = (idx + 2).toString().padStart(2, '0');
                                const projAccent = proj.accent_color || '#F15A24';

                                // Alternating asymmetric spans on desktop (7 vs 5, 5 vs 7, etc.)
                                const isWide = idx % 3 === 0 || (idx % 3 === 2 && idx === supportingProjects.length - 1);
                                const colSpanClass = isWide
                                    ? 'lg:col-span-7'
                                    : idx % 3 === 1
                                    ? 'lg:col-span-5'
                                    : 'lg:col-span-5';

                                return (
                                    <article
                                        key={proj.id}
                                        id={`project-${proj.slug}`}
                                        className={`${colSpanClass} flex flex-col justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8 relative overflow-hidden group transition-all duration-300 hover:border-[var(--text)]/30 hover:shadow-lg`}
                                    >
                                        {/* Corner registration mark */}
                                        <span className="pointer-events-none absolute top-2.5 right-2.5 font-mono text-xs font-bold text-[var(--primary)] z-10 opacity-50 select-none">
                                            +
                                        </span>

                                        <div>
                                            {/* Item Top Metadata Bar */}
                                            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 font-mono text-[11px] tracking-widest text-[var(--text-muted)] uppercase">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: projAccent }}
                                                    />
                                                    <span className="font-bold text-[var(--text)]">
                                                        SPEC.{indexNumber}
                                                    </span>
                                                    <span className="text-[var(--surface-border)]">/</span>
                                                    <span className="truncate max-w-[150px] sm:max-w-none">
                                                        {proj.business_type || 'ENTERPRISE SYSTEM'}
                                                    </span>
                                                </div>
                                                <span>{proj.year || '2024'}</span>
                                            </div>

                                            {/* Media / Architectural Viewport */}
                                            <div className="mt-5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] overflow-hidden shadow-xs">
                                                <div className={`relative ${isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'} w-full overflow-hidden bg-[var(--bg)]`}>
                                                    <ProjectArchitecturalCover
                                                        project={proj}
                                                        isFeatured={false}
                                                        className="h-full w-full"
                                                    />
                                                </div>
                                            </div>

                                            {/* Title & Concise Summary */}
                                            <div className="mt-5">
                                                <div className="font-mono text-[10px] font-bold tracking-wider text-[var(--primary)] uppercase">
                                                    {proj.role || 'FULL-STACK DEVELOPER'}
                                                </div>
                                                <h4 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-[var(--text)]">
                                                    {proj.title}
                                                </h4>
                                                <p className="mt-2.5 font-body text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                                                    {proj.summary || proj.description}
                                                </p>
                                            </div>

                                            {/* Real Tags */}
                                            {proj.tags && proj.tags.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-1.5">
                                                    {proj.tags.slice(0, 4).map((tag) => (
                                                        <TagChip key={tag.id} className="text-[10px] py-0.5 px-2">
                                                            {tag.name}
                                                        </TagChip>
                                                    ))}
                                                    {proj.tags.length > 4 && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                                                            +{proj.tags.length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Action Footer */}
                                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--surface-border)] pt-4">
                                            <button
                                                type="button"
                                                onClick={() => openDetail(proj)}
                                                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:text-[var(--primary)]"
                                            >
                                                <span>View Dossier</span>
                                                <ArrowRight className="h-3.5 w-3.5 text-[var(--primary)]" />
                                            </button>

                                            {proj.live_url && (
                                                <a
                                                    href={proj.live_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-md border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:border-[var(--text)]"
                                                >
                                                    <span>Live Site</span>
                                                    <ArrowAngularTopRight className="h-3 w-3 text-[var(--primary)]" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Bottom Accent Highlight Bar */}
                                        <div
                                            className="absolute inset-x-0 bottom-0 h-0.5 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"
                                            style={{ backgroundColor: projAccent }}
                                        />
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Complete Project Detail Panel Slide-Over Modal */}
            <ProjectDetailPanel
                project={selectedProject}
                projects={sorted}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onSelectProject={(proj) => {
                    setSelectedProject(proj);
                    setActiveSlug(proj.slug);
                }}
            />
        </section>
    );
}
