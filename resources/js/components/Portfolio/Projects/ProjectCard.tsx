import React from 'react';
import { motion } from 'framer-motion';
import { ProjectItem } from '@/types/portfolio';
import ProjectArchitecturalCover from './ProjectArchitecturalCover';
import { ArrowAngularTopRight, Github } from '../Shared/Icons';

interface ProjectCardProps {
    project: ProjectItem;
    index?: number;
    isOff?: boolean;
    onOpenDetails?: (project: ProjectItem) => void;
}

export default function ProjectCard({
    project,
    index = 0,
    isOff = false,
    onOpenDetails,
}: ProjectCardProps) {
    // Resolve optional repository link if present on model/attributes
    const repoUrl =
        (project as { repo_url?: string | null }).repo_url ||
        (project as { repository_url?: string | null }).repository_url ||
        (project as { github_url?: string | null }).github_url ||
        null;

    const liveUrl = project.live_url || null;

    return (
        <motion.article
            initial={isOff ? false : { opacity: 0, y: 20 }}
            whileInView={isOff ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={
                isOff
                    ? { duration: 0 }
                    : {
                          duration: 0.35,
                          delay: Math.min(index * 0.08, 0.4),
                          ease: [0.22, 1, 0.36, 1],
                      }
            }
            className="group relative flex flex-col justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden transition-all duration-200 hover:border-[var(--primary)]/60 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.32)]"
        >
            {/* Top Screenshot / Cover Area (16:9 Aspect Ratio) */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg)] border-b border-[var(--surface-border)]">
                {/* Visual Cover: displays verified screenshot or tasteful architectural fallback */}
                <ProjectArchitecturalCover
                    project={project}
                    isFeatured={false}
                    className="h-full w-full"
                />

                {/* Subtle Featured Marker */}
                {project.is_featured && (
                    <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-[var(--primary)] px-2.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase shadow-sm z-20">
                        Featured
                    </span>
                )}
            </div>

            {/* Card Content Body */}
            <div className="flex flex-col flex-1 justify-between p-5 sm:p-6 gap-5">
                <div>
                    {/* Top Metadata Strip: Business type & Year */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] truncate">
                            {project.business_type || 'Digital Product'}
                        </span>
                        {project.year && (
                            <span className="font-mono text-[11px] text-[var(--text-muted)] shrink-0">
                                {project.year}
                            </span>
                        )}
                    </div>

                    {/* Project Title */}
                    <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
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

                    {/* Concise Project Description (1 to 3 short lines) */}
                    <p className="mt-2.5 font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3">
                        {project.summary || project.description}
                    </p>

                    {/* Compact Technology Tags (only verified tags) */}
                    {project.tags && project.tags.length > 0 && (
                        <div
                            className="mt-4 flex flex-wrap gap-1.5"
                            aria-label={`Technologies used in ${project.title}`}
                        >
                            {project.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-md border border-[var(--surface-border)] bg-[var(--muted)]/50 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons: Repository & Live Demo */}
                {(repoUrl || liveUrl || onOpenDetails) && (
                    <div className="pt-4 border-t border-[var(--surface-border)] flex items-center gap-2.5 sm:gap-3">
                        {/* Repository Button (Outlined, subtle style) */}
                        {repoUrl && (
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View source code repository for ${project.title}`}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-transparent px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--surface-border)]/15 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[44px]"
                            >
                                <Github className="h-4 w-4" />
                                <span>Repository</span>
                            </a>
                        )}

                        {/* Live Demo Button (Filled burnt-orange style) */}
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open live website for ${project.title}`}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-3.5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_16px_rgba(241,90,36,0.35)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[44px]"
                            >
                                <span>Live Demo</span>
                                <ArrowAngularTopRight className="h-4 w-4" />
                            </a>
                        )}

                        {/* If only Live Demo exists, add subtle Dossier button for parity and rich inspection */}
                        {!repoUrl && liveUrl && onOpenDetails && (
                            <button
                                type="button"
                                onClick={() => onOpenDetails(project)}
                                aria-label={`Inspect case study dossier for ${project.title}`}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-transparent px-3 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-border)]/15 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[44px] cursor-pointer"
                            >
                                <span>Dossier</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.article>
    );
}
