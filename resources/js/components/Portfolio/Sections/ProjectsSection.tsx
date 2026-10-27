import React, { useEffect, useMemo, useState } from 'react';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import ProjectCard from '../Projects/ProjectCard';
import ProjectArchitecturalCover from '../Projects/ProjectArchitecturalCover';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';
import { ArrowAngularTopRight, ArrowRight, Github } from '../Shared/Icons';

interface ProjectsSectionProps {
    section: PortfolioSection;
    projects: ProjectItem[];
    isOff?: boolean;
    isDark?: boolean;
}

interface CategoryFilter {
    id: string;
    label: string;
    matches: (project: ProjectItem) => boolean;
}

const CATEGORY_DEFINITIONS: CategoryFilter[] = [
    {
        id: 'all',
        label: 'All Projects',
        matches: () => true,
    },
    {
        id: 'web-apps',
        label: 'Web Applications',
        matches: (p) => {
            const tags = (p.tags || []).map((t) => t.slug.toLowerCase());
            const text = `${p.title} ${p.summary} ${p.description || ''} ${p.business_type || ''}`.toLowerCase();
            return (
                tags.some((t) =>
                    [
                        'laravel',
                        'vuejs',
                        'vue-js',
                        'react',
                        'inertiajs',
                        'inertia-js',
                        'web-application',
                    ].includes(t),
                ) ||
                text.includes('web application') ||
                text.includes('platform') ||
                text.includes('portal')
            );
        },
    },
    {
        id: 'corporate',
        label: 'Corporate Websites',
        matches: (p) => {
            const tags = (p.tags || []).map((t) => t.slug.toLowerCase());
            const text = `${p.title} ${p.summary} ${p.description || ''} ${p.business_type || ''}`.toLowerCase();
            return (
                tags.some((t) => ['logistics', 'corporate'].includes(t)) ||
                text.includes('corporate') ||
                text.includes('shipping') ||
                text.includes('logistics') ||
                text.includes('freight')
            );
        },
    },
    {
        id: 'ecommerce',
        label: 'E-commerce',
        matches: (p) => {
            const tags = (p.tags || []).map((t) => t.slug.toLowerCase());
            const text = `${p.title} ${p.summary} ${p.description || ''} ${p.business_type || ''}`.toLowerCase();
            return (
                tags.some((t) =>
                    ['ecommerce', 'e-commerce', 'woocommerce', 'shopify'].includes(t),
                ) ||
                text.includes('ecommerce') ||
                text.includes('e-commerce') ||
                text.includes('store') ||
                text.includes('retail')
            );
        },
    },
    {
        id: 'wordpress',
        label: 'WordPress',
        matches: (p) => {
            const tags = (p.tags || []).map((t) => t.slug.toLowerCase());
            const text = `${p.title} ${p.summary} ${p.description || ''} ${p.business_type || ''}`.toLowerCase();
            return (
                tags.some((t) =>
                    ['wordpress', 'elementor', 'woocommerce'].includes(t),
                ) || text.includes('wordpress')
            );
        },
    },
];

export default function ProjectsSection({
    section,
    projects,
    isOff = false,
}: ProjectsSectionProps) {
    // 1. Sort projects: featured first, then database sort_order
    const sorted = useMemo(() => {
        return [...projects].sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        });
    }, [projects]);

    // 2. Only show categories that have real matching projects
    const availableCategories = useMemo(() => {
        return CATEGORY_DEFINITIONS.filter((cat) => {
            if (cat.id === 'all') return true;
            return sorted.some((p) => cat.matches(p));
        });
    }, [sorted]);

    // 3. Category filter state: default is 'all'
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // 4. Detail panel state for full architectural dossier inspection
    const [detailProject, setDetailProject] = useState<ProjectItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Deep link handling (e.g. #asn-group or #mercury-bangladesh)
    useEffect(() => {
        if (typeof window === 'undefined' || sorted.length === 0) return;

        const checkHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const target = sorted.find((p) => p.slug === hash);
                if (target) {
                    setDetailProject(target);
                    setIsDetailOpen(true);
                }
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, [sorted]);

    // Filter projects based on the active category
    const filteredProjects = useMemo(() => {
        const cat = availableCategories.find((c) => c.id === activeCategory);
        if (!cat || cat.id === 'all') {
            return sorted;
        }
        return sorted.filter((p) => cat.matches(p));
    }, [sorted, activeCategory, availableCategories]);

    // Curated digital exhibition: spotlight the first/featured project, followed by the remaining gallery
    const spotlightProject = filteredProjects[0] || null;
    const galleryProjects = filteredProjects.slice(1);

    const handleOpenDetails = (project: ProjectItem) => {
        setDetailProject(project);
        setIsDetailOpen(true);
    };

    if (!sorted || sorted.length === 0) {
        return (
            <section
                id={section.key}
                aria-label="Selected Work"
                className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 bg-[var(--bg)]"
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

    const spotlightRepoUrl =
        (spotlightProject as { repo_url?: string | null } | null)?.repo_url ||
        (spotlightProject as { repository_url?: string | null } | null)?.repository_url ||
        (spotlightProject as { github_url?: string | null } | null)?.github_url ||
        null;

    return (
        <section
            id={section.key}
            aria-label="Selected Work — Curated Digital Exhibition"
            className="relative w-full overflow-hidden px-4 sm:px-8 lg:px-16 py-20 lg:py-28 select-none bg-[var(--bg)] border-t border-[var(--surface-border)]"
        >
            {/* Ambient Cosmic Horizon Glows in Site Palette */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 -right-24 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-25 blur-[150px] transition-all duration-700"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-12 -left-20 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--primary)] opacity-10 blur-[130px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
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
                        <span className="text-[var(--primary)] font-bold">DIGITAL EXHIBITION</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <span className="hidden sm:inline">EXHIBITION // MISSION 04</span>
                        <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-0.5 font-bold text-[var(--text)]">
                            {filteredProjects.length} OF {sorted.length} WORKS
                        </span>
                    </div>
                </div>

                {/* 2. Prominent Section Heading & Concise Intro */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // 04 · SELECTED WORK
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] uppercase leading-[1.08]">
                            SELECTED WORK.
                        </h2>
                        <p className="mt-3 font-body text-base sm:text-lg text-[var(--text-muted)] font-medium">
                            Real projects. Thoughtfully built.
                        </p>
                    </div>

                    <p className="max-w-md font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        A curated exhibition of verified production web applications, corporate logistics portals, and custom e-commerce stores deployed for real clients.
                    </p>
                </div>

                {/* 3. Compact Functional Category Filter Bar */}
                <div className="mt-10 border-y border-[var(--surface-border)] py-3">
                    <div
                        className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1"
                        role="tablist"
                        aria-label="Project category filters"
                    >
                        {availableCategories.map((cat) => {
                            const isCurrent = activeCategory === cat.id;
                            const count =
                                cat.id === 'all'
                                    ? sorted.length
                                    : sorted.filter((p) => cat.matches(p)).length;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isCurrent}
                                    tabIndex={0}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`group flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[44px] ${
                                        isCurrent
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_14px_rgba(241,90,36,0.3)]'
                                            : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)]'
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                            isCurrent
                                                ? 'bg-white/20 text-white'
                                                : 'bg-[var(--muted)] text-[var(--text-muted)]'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. PREMIER EXHIBITION SPOTLIGHT: Featured Showcase */}
                {spotlightProject && (
                    <div className="mt-10 rounded-2xl sm:rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden shadow-2xl transition-all duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                            
                            {/* Spotlight Large Preview (Col 7) */}
                            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[var(--bg)] border-b lg:border-b-0 lg:border-r border-[var(--surface-border)] group">
                                <ProjectArchitecturalCover
                                    project={spotlightProject}
                                    isFeatured={true}
                                    className="h-full w-full"
                                />

                                {spotlightProject.is_featured && (
                                    <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-[var(--primary)] px-3 py-1 font-mono text-[10px] font-bold text-white uppercase shadow-md z-20">
                                        FEATURED SPOTLIGHT
                                    </span>
                                )}
                            </div>

                            {/* Spotlight Content Dossier (Col 5) */}
                            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
                                <div>
                                    <div className="flex items-center justify-between gap-2 border-b border-[var(--surface-border)] pb-3">
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                                            {spotlightProject.business_type || 'PRODUCTION PLATFORM'}
                                        </span>
                                        {spotlightProject.year && (
                                            <span className="font-mono text-xs text-[var(--text-muted)]">
                                                {spotlightProject.year} EDITION
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-4 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text)]">
                                        {spotlightProject.title}
                                    </h3>

                                    <p className="mt-3 font-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                                        {spotlightProject.summary || spotlightProject.description}
                                    </p>

                                    {/* Technology Tags */}
                                    {spotlightProject.tags && spotlightProject.tags.length > 0 && (
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {spotlightProject.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center rounded-md border border-[var(--surface-border)] bg-[var(--muted)]/50 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Verified Deliverables (if present) */}
                                    {spotlightProject.features && spotlightProject.features.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-[var(--surface-border)] space-y-2">
                                            <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase block">
                                                // ARCHITECTURAL DELIVERABLES:
                                            </span>
                                            {spotlightProject.features.slice(0, 3).map((f) => (
                                                <div
                                                    key={f.id}
                                                    className="flex items-start gap-2 text-xs font-body text-[var(--text-muted)]"
                                                >
                                                    <span className="text-[var(--primary)] font-mono font-bold">→</span>
                                                    <span className="leading-snug">{f.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Spotlight Action Deck */}
                                <div className="pt-6 border-t border-[var(--surface-border)] flex flex-wrap items-center gap-3">
                                    {spotlightRepoUrl && (
                                        <a
                                            href={spotlightRepoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-transparent px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all min-h-[44px]"
                                        >
                                            <Github className="h-4 w-4" />
                                            <span>Repository</span>
                                        </a>
                                    )}

                                    {spotlightProject.live_url && (
                                        <a
                                            href={spotlightProject.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 shadow-sm transition-all min-h-[44px]"
                                        >
                                            <span>Live Demo</span>
                                            <ArrowAngularTopRight className="h-4 w-4" />
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleOpenDetails(spotlightProject)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] hover:border-[var(--text-muted)] hover:text-[var(--primary)] transition-all min-h-[44px] cursor-pointer"
                                    >
                                        <span>Inspect Full Dossier</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. BALANCED RESPONSIVE GALLERY: Remaining Curated Projects */}
                {galleryProjects.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center justify-between pb-4 border-b border-[var(--surface-border)] font-mono text-xs text-[var(--text-muted)] uppercase">
                            <span>ADDITIONAL CURATED EXHIBITS</span>
                            <span>{galleryProjects.length} PROJECTS</span>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                            {galleryProjects.map((project, idx) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={idx}
                                    isOff={isOff}
                                    onOpenDetails={handleOpenDetails}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Graceful empty state when filter yields 0 projects */}
                {filteredProjects.length === 0 && (
                    <div className="mt-12 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-12 text-center">
                        <p className="font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                            No projects currently match this filter category.
                        </p>
                        <button
                            type="button"
                            onClick={() => setActiveCategory('all')}
                            className="mt-4 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:brightness-110"
                        >
                            Reset to All Projects
                        </button>
                    </div>
                )}
            </div>

            {/* Comprehensive Project Detail Dossier Modal */}
            <ProjectDetailPanel
                project={detailProject}
                projects={sorted}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onSelectProject={(proj) => {
                    setDetailProject(proj);
                }}
            />
        </section>
    );
}
