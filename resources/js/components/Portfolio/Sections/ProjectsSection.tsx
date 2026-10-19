import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowAngularTopRight,
    Globe1,
    Layers1,
    Sparkle,
    StarFat,
} from '../Shared/Icons';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import SolarSystemScene from '../Projects/SolarSystemScene';
import ProjectDetailPanel from '../Projects/ProjectDetailPanel';

interface ProjectsSectionProps {
    section: PortfolioSection;
    projects: ProjectItem[];
    isOff?: boolean;
    isDark?: boolean;
}

// Procedural visual avatar styles for fallback planet illustrations
function getPlanetAvatarGradient(
    style: string,
    accentColor?: string | null,
): string {
    switch (style) {
        case 'rocky':
            return 'radial-gradient(circle at 35% 35%, #e2e8f0 0%, #94a3b8 45%, #475569 80%, #1e293b 100%)';
        case 'station':
            return 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0369a1 40%, #0f172a 80%, #0284c7 100%)';
        case 'amber':
            return 'radial-gradient(circle at 35% 35%, #fef08a 0%, #d97706 45%, #78350f 80%, #451a03 100%)';
        case 'ringed':
            return 'radial-gradient(circle at 35% 35%, #fde68a 0%, #c4b5fd 40%, #7c3aed 75%, #4c1d95 100%)';
        case 'ocean':
            return 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0284c7 45%, #65a30d 75%, #082f49 100%)';
        case 'desert':
            return 'radial-gradient(circle at 35% 35%, #f97316 0%, #dc2626 50%, #9a3412 80%, #431407 100%)';
        case 'generic':
        default:
            return `radial-gradient(circle at 35% 35%, #ffffff 0%, ${
                accentColor || '#53e0f7'
            } 50%, #8b6cff 85%, #080d1c 100%)`;
    }
}

export default function ProjectsSection({
    section,
    projects,
    isOff = false,
    isDark = true,
}: ProjectsSectionProps) {
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
        null,
    );
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [originElement, setOriginElement] = useState<HTMLElement | null>(
        null,
    );
    const [isMobile, setIsMobile] = useState(false);
    const [hasWebGL, setHasWebGL] = useState(true);
    const [viewMode, setViewMode] = useState<'showcase' | 'system'>('showcase');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        try {
            const canvas = document.createElement('canvas');
            const gl =
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl');
            setHasWebGL(Boolean(gl));
        } catch {
            setHasWebGL(false);
        }

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Deep Linking: Support /#project-slug
    useEffect(() => {
        const handleHashChange = () => {
            if (typeof window === 'undefined') return;
            const hash = window.location.hash.replace(/^#/, '').trim();
            if (!hash || hash === 'projects') return;

            const matched = projects.find((p) => p.slug === hash);
            if (matched) {
                setSelectedProject(matched);
                setIsPanelOpen(true);
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [projects]);

    const handleOpenProject = (project: ProjectItem, element?: HTMLElement) => {
        setSelectedProject(project);
        setIsPanelOpen(true);
        if (element) {
            setOriginElement(element);
        }
        if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState(null, '', `#${project.slug}`);
        }
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState(null, '', '#projects');
        }
    };

    if (!projects || projects.length === 0) return null;

    // First featured project is visually dominant
    const primaryFeatured = useMemo(() => {
        return projects.find((p) => p.is_featured) || projects[0];
    }, [projects]);

    const remainingProjects = useMemo(() => {
        return projects.filter((p) => p.id !== primaryFeatured?.id);
    }, [projects, primaryFeatured]);

    const eyebrow = section.eyebrow || 'SELECTED WORK';
    const title = section.title || 'Selected Work';
    const subtitle =
        section.subtitle ||
        'Real-world business platforms, high-concurrency Laravel systems, and responsive e-commerce web applications.';

    return (
        <section
            id="projects"
            aria-label="Projects Showcase"
            className="relative w-full overflow-hidden px-4 py-24 sm:px-6 sm:py-32 md:px-10 lg:px-16 lg:py-36 xl:px-20"
        >
            {/* Atmospheric Lighting */}
            <div
                className="pointer-events-none absolute top-1/4 left-10 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[150px]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute bottom-1/4 right-10 h-[500px] w-[500px] rounded-full bg-[var(--secondary)]/10 blur-[130px]"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1440px]">
                {/* Section Header & View Mode Switcher */}
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <div className="flex flex-col items-start max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                            <Sparkle className="h-3.5 w-3.5 text-[var(--secondary)]" />
                            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                                {eyebrow}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-4">
                            <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-[var(--text)]">
                                {title}
                            </h2>
                            <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1 font-mono text-xs font-bold text-[var(--secondary)]">
                                {projects.length} Platforms
                            </span>
                        </div>

                        <p className="mt-4 font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                            {subtitle}
                        </p>
                    </div>

                    {/* View Switcher (Editorial Showcase vs 3D Solar System) */}
                    {!isMobile && hasWebGL && !isOff && (
                        <div className="inline-flex items-center gap-1 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-1.5 shadow-lg backdrop-blur-xl">
                            <button
                                type="button"
                                onClick={() => setViewMode('showcase')}
                                aria-label="Editorial Showcase View"
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                                    viewMode === 'showcase'
                                        ? 'bg-[var(--secondary)] text-[#080d1c] shadow-[0_0_15px_rgba(83,224,247,0.4)]'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                }`}
                            >
                                <Layers1 className="h-4 w-4" />
                                <span>Editorial Showcase</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode('system')}
                                aria-label="3D Solar System View"
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                                    viewMode === 'system'
                                        ? 'bg-[var(--primary)] text-white shadow-[0_0_15px_rgba(139,108,255,0.4)]'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                }`}
                            >
                                <Globe1 className="h-4 w-4" />
                                <span>3D Orbit System</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* 3D Solar System View (when explicitly activated by visitor) */}
                {viewMode === 'system' && !isMobile && hasWebGL && !isOff ? (
                    <div className="mt-12">
                        <SolarSystemScene
                            projects={projects}
                            activeProject={selectedProject}
                            onSelectProject={handleOpenProject}
                            isDark={isDark}
                            isOff={isOff}
                        />
                    </div>
                ) : (
                    /* Default: Award-Winning Editorial Project Showcase */
                    <div className="mt-12 sm:mt-16 flex flex-col gap-10">
                        {/* 1. VISUALLY DOMINANT FEATURED PROJECT */}
                        {primaryFeatured && (
                            <div className="group relative overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--surface)] via-[var(--bg-elevated)] to-[var(--surface)] p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-[var(--secondary)]/50 sm:p-10 lg:p-12">
                                {/* Subtle Ambient Aura tinted by project accent */}
                                <div
                                    className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-35"
                                    style={{
                                        backgroundColor:
                                            primaryFeatured.accent_color ||
                                            'var(--secondary)',
                                    }}
                                />

                                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                                    {/* Left: Large Visual Centerpiece or Cover Preview */}
                                    <div className="relative flex items-center justify-center lg:col-span-6">
                                        <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg)]/80 shadow-2xl">
                                            {primaryFeatured.cover_media?.url ? (
                                                <img
                                                    src={
                                                        primaryFeatured
                                                            .cover_media.url
                                                    }
                                                    alt={primaryFeatured.title}
                                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                /* Distinctive Planet Celestial Showcase */
                                                <div className="relative flex h-full w-full flex-col items-center justify-center p-8 text-center">
                                                    <div
                                                        className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-110 sm:h-52 sm:w-52"
                                                        style={{
                                                            background:
                                                                getPlanetAvatarGradient(
                                                                    primaryFeatured.planet_style,
                                                                    primaryFeatured.accent_color,
                                                                ),
                                                            boxShadow: `0 0 50px ${
                                                                primaryFeatured.accent_color ||
                                                                'var(--secondary)'
                                                            }40`,
                                                        }}
                                                    >
                                                        {primaryFeatured.planet_style ===
                                                            'station' && (
                                                            <div className="absolute inset-0 -m-3 animate-spin rounded-full border-2 border-dashed border-cyan-300/50 [animation-duration:35s]" />
                                                        )}
                                                        {primaryFeatured.planet_style ===
                                                            'ringed' && (
                                                            <div className="absolute inset-0 -m-5 scale-y-50 -rotate-25 rounded-full border border-violet-300/50" />
                                                        )}
                                                        <span className="font-mono text-xs font-bold text-white uppercase drop-shadow-md">
                                                            {
                                                                primaryFeatured.planet_style
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Featured Pill */}
                                            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-[10px] font-bold text-[#080d1c] uppercase shadow-lg">
                                                <StarFat className="h-3 w-3" />
                                                <span>Featured Flagship</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Project Narrative, Metadata, and Dual Actions */}
                                    <div className="flex flex-col items-start lg:col-span-6">
                                        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
                                            {primaryFeatured.year && (
                                                <span className="font-bold text-[var(--secondary)]">
                                                    {primaryFeatured.year}
                                                </span>
                                            )}
                                            {primaryFeatured.business_type && (
                                                <span>
                                                    •{' '}
                                                    {
                                                        primaryFeatured.business_type
                                                    }
                                                </span>
                                            )}
                                            {primaryFeatured.role && (
                                                <span>
                                                    • {primaryFeatured.role}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--secondary)] sm:text-3xl lg:text-4xl">
                                            {primaryFeatured.title}
                                        </h3>

                                        <p className="mt-4 font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                                            {primaryFeatured.summary}
                                        </p>

                                        {/* Technology Tags */}
                                        {primaryFeatured.tags &&
                                            primaryFeatured.tags.length > 0 && (
                                                <div className="mt-6 flex flex-wrap gap-2">
                                                    {primaryFeatured.tags.map(
                                                        (t) => (
                                                            <span
                                                                key={t.id}
                                                                className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1 font-mono text-xs font-medium text-[var(--text)]"
                                                            >
                                                                {t.name}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                        {/* Actions */}
                                        <div className="mt-8 flex flex-wrap items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={(e) =>
                                                    handleOpenProject(
                                                        primaryFeatured,
                                                        e.currentTarget,
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-3 font-sans text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(83,224,247,0.35)] active:scale-95"
                                            >
                                                <span>Explore Project</span>
                                                <ArrowAngularTopRight className="h-4 w-4" />
                                            </button>

                                            {primaryFeatured.live_url && (
                                                <a
                                                    href={
                                                        primaryFeatured.live_url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-6 py-3 font-sans text-sm font-semibold text-[var(--text)] transition-all duration-300 hover:border-[var(--secondary)] hover:text-[var(--secondary)]"
                                                >
                                                    <span>Visit Live Site</span>
                                                    <ArrowAngularTopRight className="h-3.5 w-3.5 opacity-70" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. REMAINING PROJECTS EDITORIAL GRID */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {remainingProjects.map((project, idx) => {
                                const accent =
                                    project.accent_color || 'var(--secondary)';
                                const planetGrad = getPlanetAvatarGradient(
                                    project.planet_style,
                                    project.accent_color,
                                );

                                return (
                                    <div
                                        key={project.id}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Open project details for ${project.title}`}
                                        onClick={(e) =>
                                            handleOpenProject(
                                                project,
                                                e.currentTarget,
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            ) {
                                                e.preventDefault();
                                                handleOpenProject(
                                                    project,
                                                    e.currentTarget,
                                                );
                                            }
                                        }}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--secondary)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none"
                                    >
                                        <div>
                                            {/* Card Top: Distinctive Visual Avatar / Thumbnail */}
                                            <div className="relative mb-6 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                                                {project.cover_media?.url ? (
                                                    <img
                                                        src={
                                                            project.cover_media
                                                                .url
                                                        }
                                                        alt={project.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="relative flex h-full w-full items-center justify-center">
                                                        <div
                                                            className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 shadow-xl transition-transform duration-500 group-hover:scale-110"
                                                            style={{
                                                                background:
                                                                    planetGrad,
                                                                boxShadow: `0 0 25px ${accent}40`,
                                                            }}
                                                        >
                                                            {project.planet_style ===
                                                                'ringed' && (
                                                                <div className="absolute inset-0 -m-3 scale-y-50 -rotate-25 rounded-full border border-violet-300/40" />
                                                            )}
                                                            <span className="font-mono text-[9px] font-bold text-white uppercase drop-shadow">
                                                                {
                                                                    project.planet_style
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <span className="absolute top-3 left-3 rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/90 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--secondary)] backdrop-blur-md">
                                                    0{idx + 2}
                                                </span>
                                            </div>

                                            {/* Metadata */}
                                            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                                                {project.year && (
                                                    <span className="font-bold text-[var(--secondary)]">
                                                        {project.year}
                                                    </span>
                                                )}
                                                {project.business_type && (
                                                    <span>
                                                        •{' '}
                                                        {project.business_type}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="mt-2 font-display text-xl font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)]">
                                                {project.title}
                                            </h3>

                                            {/* Summary */}
                                            <p className="mt-3 line-clamp-2 font-sans text-sm leading-relaxed text-[var(--text-muted)]">
                                                {project.summary}
                                            </p>
                                        </div>

                                        {/* Card Bottom: Tags & Action Links */}
                                        <div className="mt-6 border-t border-[var(--surface-border)]/50 pt-4">
                                            {project.tags &&
                                                project.tags.length > 0 && (
                                                    <div className="mb-4 flex flex-wrap gap-1.5">
                                                        {project.tags
                                                            .slice(0, 3)
                                                            .map((t) => (
                                                                <span
                                                                    key={t.id}
                                                                    className="rounded-md border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                                                                >
                                                                    {t.name}
                                                                </span>
                                                            ))}
                                                    </div>
                                                )}

                                            <div className="flex items-center justify-between">
                                                <span className="inline-flex items-center gap-1 font-sans text-xs font-bold text-[var(--secondary)] transition-transform group-hover:translate-x-1">
                                                    <span>View Case Study</span>
                                                    <ArrowAngularTopRight className="h-3 w-3" />
                                                </span>

                                                {project.live_url && (
                                                    <a
                                                        href={project.live_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] underline-offset-4 hover:underline"
                                                    >
                                                        Live Site ↗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Redesigned Project Detail Slide-over Panel */}
            <ProjectDetailPanel
                project={selectedProject}
                projects={projects}
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                onSelectProject={(proj) => setSelectedProject(proj)}
                originElement={originElement}
            />
        </section>
    );
}
