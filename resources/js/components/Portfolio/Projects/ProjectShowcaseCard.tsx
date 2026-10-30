import React from 'react';
import { ProjectItem } from '@/types/portfolio';
import ProjectArchitecturalCover from './ProjectArchitecturalCover';
import GravityItem from '../Motion/GravityItem';
import { ArrowAngularTopRight, ArrowRight, Github } from '../Shared/Icons';

interface ProjectShowcaseCardProps {
    project: ProjectItem;
    index?: number;
    isOff?: boolean;
    onOpenDetails?: (project: ProjectItem) => void;
}

// Extract display domain cleanly for the browser mockup address bar
function getDisplayDomain(url?: string | null): string {
    if (!url) return 'project.internal';
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace(/^www\./, '');
    } catch {
        return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
}

export default function ProjectShowcaseCard({
    project,
    index = 0,
    isOff = false,
    onOpenDetails,
}: ProjectShowcaseCardProps) {
    // Resolve optional repository link if present on project model
    const repoUrl =
        (project as { repo_url?: string | null }).repo_url ||
        (project as { repository_url?: string | null }).repository_url ||
        (project as { github_url?: string | null }).github_url ||
        null;

    const liveUrl = project.live_url || null;
    const domain = getDisplayDomain(liveUrl);
    const categoryLabel = project.business_type || 'Digital Platform';

    return (
        <article
            aria-label={`${project.title} showcase presentation`}
            style={{ backgroundColor: 'var(--surface)' }}
            className="group relative w-full box-border overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--surface-border)] shadow-[0_-12px_30px_rgba(0,0,0,0.5),0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-[var(--primary)]/60 flex flex-col lg:grid lg:grid-cols-12 items-stretch lg:min-h-[500px] xl:min-h-[520px]"
        >
            {/* Ambient subtle corner glow on the card */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.06] blur-3xl transition-opacity group-hover:opacity-[0.14]"
            />

            {/* ======================================================== */}
            {/* 1. PROJECT INFORMATION BLOCK                              */}
            {/* Desktop: Column 5 (left side)                             */}
            {/* Mobile: Top section above the website preview             */}
            {/* ======================================================== */}
            <div className="order-1 lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 z-10">
                <div>
                    {/* Category Label and Project Year */}
                    <div className="flex items-center justify-between gap-2 border-b border-[var(--surface-border)] pb-2 sm:pb-3">
                        <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--primary)] truncate">
                            {categoryLabel}
                            {project.year && (
                                <span className="text-[var(--text-muted)] font-normal ml-1.5 sm:ml-2">
                                    • {project.year}
                                </span>
                            )}
                        </span>

                        {project.is_featured && (
                            <span className="shrink-0 rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-2 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold text-[var(--primary)] uppercase">
                                Spotlight
                            </span>
                        )}
                    </div>

                    {/* Project Name */}
                    <h3 className="mt-2.5 sm:mt-3 lg:mt-4 font-display text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-tight text-[var(--text)] leading-[1.15] group-hover:text-[var(--primary)] transition-colors">
                        {onOpenDetails ? (
                            <button
                                type="button"
                                onClick={() => onOpenDetails(project)}
                                className="text-left uppercase tracking-tight hover:text-[var(--primary)] transition-colors cursor-pointer focus:outline-none focus:underline"
                                aria-label={`View full dossier for ${project.title}`}
                            >
                                {project.title}
                            </button>
                        ) : (
                            project.title
                        )}
                    </h3>

                    {/* Short Project Description underneath */}
                    <p className="mt-1.5 sm:mt-2.5 lg:mt-4 font-body text-xs sm:text-sm lg:text-base text-[var(--text-muted)] leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {project.summary || project.description}
                    </p>

                    {/* Technology Stack Badges in Compact Layout */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="mt-2.5 sm:mt-3 lg:mt-4 flex flex-wrap gap-1 sm:gap-1.5 lg:gap-2">
                            {project.tags.slice(0, 5).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-md sm:rounded-lg border border-[var(--surface-border)] bg-[var(--muted)]/40 px-1.5 sm:px-2 py-0.5 font-mono text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider"
                                >
                                    {tag.name}
                                </span>
                            ))}
                            {project.tags.length > 5 && (
                                <span className="inline-flex items-center rounded-md border border-[var(--surface-border)] bg-[var(--muted)]/20 px-1.5 py-0.5 font-mono text-[9px] font-medium text-[var(--text-muted)]">
                                    +{project.tags.length - 5}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Action Buttons Deck (Anchored at the bottom of left column on lg+) */}
                <div className="hidden lg:flex mt-6 xl:mt-8 pt-4 sm:pt-5 border-t border-[var(--surface-border)] flex-wrap items-center gap-2.5 sm:gap-3">
                    {/* Live Preview Button */}
                    {liveUrl && (
                        <GravityItem radius={110} maxPull={4} strength={0.2} pushForce={5} disabled={isOff}>
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 sm:px-5 py-2.5 sm:py-3 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 shadow-sm transition-all min-h-[40px] sm:min-h-[44px]"
                            >
                                <span>View Live</span>
                                <ArrowAngularTopRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                        </GravityItem>
                    )}

                    {/* Source Code Button (ONLY if actual repo URL exists) */}
                    {repoUrl && (
                        <GravityItem radius={100} maxPull={4} strength={0.18} pushForce={4} disabled={isOff}>
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-3.5 sm:px-4 py-2.5 sm:py-3 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all min-h-[40px] sm:min-h-[44px]"
                            >
                                <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span>Github</span>
                            </a>
                        </GravityItem>
                    )}

                    {/* Case Study Details Modal Button */}
                    {onOpenDetails && (
                        <GravityItem radius={100} maxPull={3} strength={0.16} pushForce={4} disabled={isOff}>
                            <button
                                type="button"
                                onClick={() => onOpenDetails(project)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 sm:px-4 py-2.5 sm:py-3 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)] transition-all min-h-[40px] sm:min-h-[44px] cursor-pointer"
                                aria-label={`View dossier for ${project.title}`}
                            >
                                <span>Details</span>
                                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                        </GravityItem>
                    )}
                </div>
            </div>

            {/* ======================================================== */}
            {/* 2. WEBSITE PREVIEW BLOCK                                 */}
            {/* Desktop: Column 7 (right side)                            */}
            {/* Mobile: Below project info, above action buttons         */}
            {/* ======================================================== */}
            <div className="order-2 lg:col-span-7 xl:col-span-7 relative flex items-center justify-center px-4 pt-1 pb-3 sm:px-6 sm:py-4 lg:p-6 xl:p-8">
                {/* Premium Browser-Style Presentation Frame */}
                <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--surface-border)] bg-[var(--bg)] shadow-xl flex flex-col">
                    {/* Browser Chrome Header Bar */}
                    <div className="flex h-7 sm:h-8 lg:h-9 items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface)] px-2.5 sm:px-3 lg:px-4 shrink-0">
                        {/* macOS Window Controls */}
                        <div className="flex items-center gap-1 sm:gap-1.5" aria-hidden="true">
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-[#FF5F56]/80" />
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-[#FFBD2E]/80" />
                            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-[#27C93F]/80" />
                        </div>

                        {/* Centered Domain Address Pill */}
                        <div className="flex items-center gap-1 sm:gap-1.5 rounded-md border border-[var(--surface-border)] bg-[var(--bg)] px-2 py-0.5 text-[8px] sm:text-[9px] lg:text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[220px]">
                            <span className="text-[7px] sm:text-[8px] lg:text-[9px] text-[var(--primary)] select-none">https://</span>
                            <span className="truncate">{domain}</span>
                        </div>

                        {/* Balanced Spacer */}
                        <div className="w-6 sm:w-8 lg:w-10" aria-hidden="true" />
                    </div>

                    {/* Screenshot Display Frame */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface)]">
                        <ProjectArchitecturalCover
                            project={project}
                            isFeatured={true}
                            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />

                        {/* Subtle edge vignette overlay */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 rounded-b-xl"
                        />
                    </div>
                </div>
            </div>

            {/* ======================================================== */}
            {/* 3. MOBILE ACTION BUTTONS DECK (< lg viewports)            */}
            {/* Cleanly positioned at bottom of the card on mobile/tablet */}
            {/* ======================================================== */}
            <div className="order-3 flex lg:hidden px-4 pb-4 sm:px-6 sm:pb-6 pt-2 border-t border-[var(--surface-border)] flex-wrap items-center gap-2">
                {liveUrl && (
                    <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-white hover:brightness-110 shadow-sm transition-all min-h-[42px]"
                    >
                        <span>View Live</span>
                        <ArrowAngularTopRight className="h-3.5 w-3.5" />
                    </a>
                )}

                {repoUrl && (
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all min-h-[42px]"
                    >
                        <Github className="h-3.5 w-3.5" />
                        <span>Code</span>
                    </a>
                )}

                {onOpenDetails && (
                    <button
                        type="button"
                        onClick={() => onOpenDetails(project)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)] transition-all min-h-[42px] cursor-pointer"
                        aria-label={`View dossier for ${project.title}`}
                    >
                        <span>Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </article>
    );
}
