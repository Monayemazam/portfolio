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
    // 1. Sort projects by featured first, then database sort_order
    const sorted = useMemo(() => {
        return [...projects].sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        });
    }, [projects]);

    // 2. Currently selected active project on the stage
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(() => {
        return sorted.find((p) => p.is_featured) || sorted[0] || null;
    });

    const [isScanning, setIsScanning] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Deep link handling (e.g. #asn-group or #mercury-bangladesh)
    useEffect(() => {
        if (typeof window === 'undefined' || sorted.length === 0) return;

        const checkHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const target = sorted.find((p) => p.slug === hash);
                if (target) {
                    setSelectedProject(target);
                    const el = document.getElementById('project-stage');
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

    // Handle project selection with signature scanning interaction
    const handleSelectProject = (project: ProjectItem) => {
        if (selectedProject?.id === project.id) return;

        if (!isOff) {
            setIsScanning(true);
            setTimeout(() => {
                setSelectedProject(project);
                setTimeout(() => setIsScanning(false), 240);
            }, 80);
        } else {
            setSelectedProject(project);
        }
    };

    // Deliberate empty state if no projects are published
    if (!sorted || sorted.length === 0 || !selectedProject) {
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

    const activeAccent = selectedProject.accent_color || '#F15A24';

    return (
        <section
            id={section.key}
            aria-label="Interactive Work Archive — Curated Digital Case Studies"
            className="relative w-full overflow-hidden px-4 sm:px-8 lg:px-16 py-20 lg:py-32 select-none"
        >
            {/* Dynamic Ambient Horizon Glow tuned to active project's accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 -right-24 w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full opacity-15 blur-[160px] transition-all duration-700"
                style={{ backgroundColor: activeAccent }}
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
                        <span>INTERACTIVE ARCHIVE</span>
                        <span className="text-[var(--surface-border)]">/</span>
                        <span className="text-[var(--primary)] font-bold">STAGE &amp; INDEX</span>
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
                        An interactive editorial archive of production web applications, corporate logistics portals, and custom ecommerce stores. Select any project to explore its architecture.
                    </p>
                </div>

                {/* 3. Mobile / Tablet Quick-Select Tab Bar */}
                <div className="mt-10 lg:hidden border-y border-[var(--surface-border)] py-3">
                    <div className="flex items-center justify-between gap-4 pb-2 font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            <span>TAP A PROJECT TO PREVIEW</span>
                        </div>
                        <span>{sorted.length} ENTRIES</span>
                    </div>
                    <div
                        className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none"
                        role="tablist"
                        aria-label="Projects tab list"
                    >
                        {sorted.map((proj, idx) => {
                            const isCurrent = selectedProject.id === proj.id;
                            const indexNumber = (idx + 1).toString().padStart(2, '0');

                            return (
                                <button
                                    key={proj.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isCurrent}
                                    onClick={() => handleSelectProject(proj)}
                                    className={`group flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-xs transition-all duration-200 cursor-pointer ${
                                        isCurrent
                                            ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)] shadow-sm ring-1 ring-[var(--primary)]'
                                            : 'border-[var(--surface-border)] bg-[var(--surface)]/50 text-[var(--text-muted)] hover:border-[var(--text)]/30 hover:text-[var(--text)]'
                                    }`}
                                >
                                    <span
                                        className={`font-bold transition-colors ${
                                            isCurrent
                                                ? 'text-[var(--primary)]'
                                                : 'text-[var(--text-muted)]'
                                        }`}
                                    >
                                        {indexNumber}.
                                    </span>
                                    <span className="font-semibold uppercase tracking-wider">
                                        {proj.title}
                                    </span>
                                    {proj.is_featured && (
                                        <span className="rounded bg-[var(--primary)]/15 px-1 py-0.5 text-[8px] font-bold text-[var(--primary)]">
                                            FEATURED
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. THE TWO COORDINATED AREAS: PROJECT INDEX (LEFT) + FEATURED STAGE (RIGHT) */}
                <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* ========================================================= */}
                    {/* AREA A: PROJECT INDEX (Compact Desktop List)              */}
                    {/* ========================================================= */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col space-y-3 sticky top-28">
                        <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3 font-mono text-[11px] tracking-widest text-[var(--text-muted)] uppercase">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                <span className="font-bold text-[var(--text)]">PROJECT INDEX</span>
                            </div>
                            <span>SELECT TO INSPECT STAGE</span>
                        </div>

                        <div className="flex flex-col space-y-2.5 pt-1">
                            {sorted.map((proj, idx) => {
                                const isCurrent = selectedProject.id === proj.id;
                                const indexNumber = (idx + 1).toString().padStart(2, '0');
                                const projAccent = proj.accent_color || '#F15A24';

                                return (
                                    <button
                                        key={proj.id}
                                        type="button"
                                        onClick={() => handleSelectProject(proj)}
                                        aria-label={`Select ${proj.title}`}
                                        className={`group relative flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                                            isCurrent
                                                ? 'border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_20px_rgba(241,90,36,0.18)] ring-1 ring-[var(--primary)] translate-x-1'
                                                : 'border-[var(--surface-border)] bg-[var(--surface)]/40 hover:border-[var(--primary)]/60 hover:bg-[var(--surface)] hover:translate-x-0.5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {/* Index number with active beacon */}
                                            <div className="flex flex-col items-center">
                                                <span
                                                    className={`font-mono text-xs font-bold transition-colors ${
                                                        isCurrent
                                                            ? 'text-[var(--primary)]'
                                                            : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'
                                                    }`}
                                                >
                                                    {indexNumber}
                                                </span>
                                                <span
                                                    className={`mt-1 h-1.5 w-1.5 rounded-full transition-all ${
                                                        isCurrent
                                                            ? 'bg-[var(--primary)] shadow-[0_0_8px_var(--primary)] scale-125'
                                                            : 'bg-transparent group-hover:bg-[var(--primary)]/40'
                                                    }`}
                                                />
                                            </div>

                                            {/* Title and metadata */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors truncate">
                                                        {proj.title}
                                                    </span>
                                                    {proj.is_featured && (
                                                        <span className="shrink-0 rounded bg-[var(--primary)]/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[var(--primary)]">
                                                            FEATURED
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider truncate mt-0.5">
                                                    {proj.business_type || 'PRODUCTION APPLICATION'} · {proj.year || '2025'}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="font-mono text-xs text-[var(--text-muted)] transition-transform group-hover:translate-x-1">
                                            →
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* AREA B: FEATURED PROJECT STAGE (Dynamic Showcase)         */}
                    {/* ========================================================= */}
                    <div
                        id="project-stage"
                        className="lg:col-span-7 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10 relative overflow-hidden group shadow-xl transition-all duration-300"
                    >
                        {/* Corner Registration Crosshairs */}
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

                        {/* Top Telemetry & Status Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                            <div className="flex items-center gap-2.5">
                                <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                                <span className="font-bold text-[var(--primary)]">
                                    ACTIVE CASE STUDY // {selectedProject.slug}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] text-[var(--text-muted)]">
                                    {selectedProject.year || '2025'} EDITION
                                </span>
                                <span className="rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-foreground)]">
                                    PRODUCTION LIVE
                                </span>
                            </div>
                        </div>

                        {/* Interactive Viewport Plate with Signature Scanning Line */}
                        <div className="mt-6 rounded-2xl border border-[var(--surface-border)] bg-[var(--bg)] overflow-hidden shadow-md relative">
                            {/* Browser Chrome Bar */}
                            <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/80" />
                                </div>
                                <div className="max-w-[240px] sm:max-w-xs truncate rounded-md border border-[var(--surface-border)] bg-[var(--bg)] px-3 py-1 font-mono text-[10px] text-[var(--text-muted)]">
                                    {selectedProject.live_url
                                        ? selectedProject.live_url.replace(/\/$/, '')
                                        : `archive://${selectedProject.slug}.local`}
                                </div>
                                <div className="font-mono text-[9px] font-bold text-[var(--accent)] uppercase hidden sm:block">
                                    200 OK
                                </div>
                            </div>

                            {/* Viewport Surface */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg)]">
                                {/* Signature Laser Scanning Line Beam */}
                                {isScanning && (
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent z-30 shadow-[0_0_14px_var(--primary)] animate-[scan-line_0.24s_linear_infinite]"
                                    />
                                )}

                                <div
                                    className={`h-full w-full transition-all duration-300 ${
                                        isScanning ? 'opacity-40 scale-[0.99] filter blur-[1px]' : 'opacity-100 scale-100 filter-none'
                                    }`}
                                >
                                    <ProjectArchitecturalCover
                                        project={selectedProject}
                                        isFeatured={true}
                                        className="h-full w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dossier Metadata & Narrative Details */}
                        <div className="mt-8 flex flex-col justify-between">
                            <div>
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                                    {selectedProject.role || 'LEAD FULL-STACK DEVELOPER'}
                                </span>
                                <h3 className="mt-2 font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text)]">
                                    {selectedProject.title}
                                </h3>

                                <p className="mt-4 font-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                                    {selectedProject.summary || selectedProject.description}
                                </p>

                                {/* Real Tag Chips */}
                                {selectedProject.tags && selectedProject.tags.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {selectedProject.tags.map((tag) => (
                                            <TagChip key={tag.id}>{tag.name}</TagChip>
                                        ))}
                                    </div>
                                )}

                                {/* Key Deliverables from Database */}
                                {selectedProject.features && selectedProject.features.length > 0 && (
                                    <div className="mt-6 space-y-2 border-t border-[var(--surface-border)] pt-4">
                                        <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                                            // ARCHITECTURAL DELIVERABLES:
                                        </span>
                                        {selectedProject.features.slice(0, 3).map((f) => (
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

                            {/* Direct Actions: Visit Live System & Explore Full Dossier */}
                            <div className="mt-8 flex flex-wrap items-center gap-3 pt-5 border-t border-[var(--surface-border)]">
                                <button
                                    type="button"
                                    onClick={() => setIsDetailOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--text)] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-paper)] shadow-sm transition-all duration-200 hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white cursor-pointer"
                                >
                                    <span>Explore Full Dossier</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                {selectedProject.live_url && (
                                    <a
                                        href={selectedProject.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] cursor-pointer"
                                    >
                                        <span>Visit Live System</span>
                                        <ArrowAngularTopRight className="h-4 w-4 text-[var(--primary)]" />
                                    </a>
                                )}
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* Comprehensive Project Detail Dossier Modal */}
            <ProjectDetailPanel
                project={selectedProject}
                projects={sorted}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onSelectProject={(proj) => {
                    setSelectedProject(proj);
                }}
            />
        </section>
    );
}
