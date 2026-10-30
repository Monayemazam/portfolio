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
    isMobileLayout?: boolean;
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
    isMobileLayout = false,
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
            className={`group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] transition-all duration-300 hover:border-[var(--primary)]/50 ${
                isMobileLayout ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-12 items-stretch'
            }`}
        >
            {/* Ambient subtle corner glow on the card */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.06] blur-3xl transition-opacity group-hover:opacity-[0.14]"
            />

            {/* ======================================================== */}
            {/* LEFT SIDE — PROJECT INFORMATION (~50% width on Desktop) */}
            {/* ======================================================== */}
            <div
                className={`flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 z-10 ${
                    isMobileLayout ? 'order-2 border-t border-[var(--surface-border)]' : 'lg:col-span-5 xl:col-span-5'
                }`}
            >
                <div>
                    {/* Category Label and Project Year */}
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--surface-border)] pb-3">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                            {categoryLabel}
                            {project.year && (
                                <span className="text-[var(--text-muted)] font-normal ml-2">
                                    • {project.year}
                                </span>
                            )}
                        </span>

                        {project.is_featured && (
                            <span className="rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[var(--primary)] uppercase">
                                Spotlight
                            </span>
                        )}
                    </div>

                    {/* Project Name */}
                    <h3 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[var(--text)] leading-[1.1] group-hover:text-[var(--primary)] transition-colors">
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

                    {/* Technology Stack Badges */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-lg border border-[var(--surface-border)] bg-[var(--muted)]/40 px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Short Project Description */}
                    <p className="mt-4 sm:mt-5 font-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed line-clamp-3 sm:line-clamp-4">
                        {project.summary || project.description}
                    </p>
                </div>

                {/* Action Buttons Deck */}
                <div className="mt-8 pt-6 border-t border-[var(--surface-border)] flex flex-wrap items-center gap-3">
                    {/* Live Preview Button */}
                    {liveUrl && (
                        <GravityItem radius={110} maxPull={4} strength={0.2} pushForce={5} disabled={isOff}>
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 shadow-sm transition-all min-h-[44px]"
                            >
                                <span>View Live</span>
                                <ArrowAngularTopRight className="h-4 w-4" />
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
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all min-h-[44px]"
                            >
                                <Github className="h-4 w-4" />
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
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)] transition-all min-h-[44px] cursor-pointer"
                                aria-label={`View dossier for ${project.title}`}
                            >
                                <span>Details</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </GravityItem>
                    )}
                </div>
            </div>

            {/* ======================================================== */}
            {/* RIGHT SIDE — WEBSITE PREVIEW (~50% width on Desktop)    */}
            {/* ======================================================== */}
            <div
                className={`relative flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-10 ${
                    isMobileLayout ? 'order-1' : 'lg:col-span-7 xl:col-span-7'
                }`}
            >
                {/* Premium Browser-Style Presentation Frame */}
                <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--surface-border)] bg-[var(--bg)] shadow-2xl flex flex-col">
                    
                    {/* Browser Chrome Header Bar */}
                    <div className="flex h-9 items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface)] px-4 shrink-0">
                        {/* macOS Window Controls */}
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
                        </div>

                        {/* Centered Domain Address Pill */}
                        <div className="flex items-center gap-1.5 rounded-md border border-[var(--surface-border)] bg-[var(--bg)] px-3 py-0.5 text-[10px] font-mono text-[var(--text-muted)] truncate max-w-[220px]">
                            <span className="text-[9px] text-[var(--primary)] select-none">https://</span>
                            <span className="truncate">{domain}</span>
                        </div>

                        {/* Balanced Spacer */}
                        <div className="w-10" aria-hidden="true" />
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
        </article>
    );
}
