import React, { useEffect, useMemo, useState } from 'react';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import ProjectShowcaseCard from '../Projects/ProjectShowcaseCard';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';
import GravityItem from '../Motion/GravityItem';

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

    const handleOpenDetails = (project: ProjectItem) => {
        setDetailProject(project);
        setIsDetailOpen(true);
    };

    if (!sorted || sorted.length === 0) {
        return (
            <section
                id={section.key}
                aria-label="Selected Work"
                className="relative w-full overflow-x-clip px-6 sm:px-10 lg:px-16 py-24 bg-[var(--bg)]"
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

    return (
        <section
            id={section.key}
            aria-label="Selected Work — Cinematic Stacking Project Showcase"
            className="relative w-full overflow-x-clip px-4 sm:px-8 lg:px-16 py-20 lg:py-28 select-none bg-[var(--bg)] border-t border-[var(--surface-border)]"
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
                {/* Prominent Section Heading & Concise Intro */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-14">
                    <div>
                        <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] uppercase leading-[1.08]">
                            SELECTED WORK.
                        </h2>
                        <p className="mt-3 font-body text-base sm:text-lg text-[var(--text-muted)] font-medium">
                            Real projects. Thoughtfully built.
                        </p>
                    </div>

                    <p className="max-w-md font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        A curated selection of verified production web applications, corporate logistics portals, and custom e-commerce stores deployed for real clients.
                    </p>
                </div>

                {/* Compact Functional Category Filter Bar */}
                <div className="border-y border-[var(--surface-border)] py-3 mb-12 lg:mb-16">
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
                                <GravityItem key={cat.id} radius={90} maxPull={5} strength={0.2} pushForce={6} disabled={isOff}>
                                    <button
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
                                </GravityItem>
                            );
                        })}
                    </div>
                </div>

                {/* ==================================================================== */}
                {/* DESKTOP SHOWCASE: Direct Sticky Card Stacking Deck (Deck of Cards)  */}
                {/* Each card becomes sticky in position. As the user continues         */}
                {/* scrolling, the next card ascends and covers the previous one,       */}
                {/* accumulating into a stacked deck in the shared container.          */}
                {/* Every card, including the final one (AYRA ESPAÑA), receives ample   */}
                {/* scroll distance (45vh) to slide up, cover the previous card, reach  */}
                {/* its sticky position, and settle properly before releasing.         */}
                {/* ==================================================================== */}
                <div className="hidden lg:block relative w-full pb-12 lg:pb-16">
                    {filteredProjects.map((project, idx) => (
                        <div
                            key={project.id}
                            className="sticky w-full transition-all duration-300 origin-top"
                            style={{
                                top: `calc(5rem + ${idx * 1.25}rem)`,
                                zIndex: idx + 10,
                                marginBottom: '45vh',
                            }}
                        >
                            <ProjectShowcaseCard
                                project={project}
                                index={idx}
                                isOff={isOff}
                                onOpenDetails={handleOpenDetails}
                                isMobileLayout={false}
                            />
                        </div>
                    ))}
                </div>

                {/* ==================================================================== */}
                {/* MOBILE & TABLET SHOWCASE: Fluid Vertical Presentation Cards          */}
                {/* ==================================================================== */}
                <div className="lg:hidden flex flex-col gap-8 sm:gap-10">
                    {filteredProjects.map((project, idx) => (
                        <ProjectShowcaseCard
                            key={project.id}
                            project={project}
                            index={idx}
                            isOff={isOff}
                            onOpenDetails={handleOpenDetails}
                            isMobileLayout={true}
                        />
                    ))}
                </div>

                {/* Graceful empty state when filter yields 0 projects */}
                {filteredProjects.length === 0 && (
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-12 text-center">
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
