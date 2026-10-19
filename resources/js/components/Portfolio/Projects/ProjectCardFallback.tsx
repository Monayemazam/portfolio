import React from 'react';
import { ArrowAngularTopRight, StarFat } from '../Shared/Icons';
import { ProjectItem } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import TagChip from '../Shared/TagChip';
import Button from '../Shared/Button';

interface ProjectCardFallbackProps {
    projects: ProjectItem[];
    onSelectProject: (project: ProjectItem, element?: HTMLElement) => void;
}

// Procedural visual avatar styles for 96px fallback planet illustrations
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
            return `radial-gradient(circle at 35% 35%, #ffffff 0%, ${accentColor || '#22d3ee'} 50%, #7c3aed 85%, #05060f 100%)`;
    }
}

export default function ProjectCardFallback({
    projects,
    onSelectProject,
}: ProjectCardFallbackProps) {
    return (
        <div className="flex flex-col gap-6">
            {projects.map((project, idx) => {
                const accent = project.accent_color || 'var(--secondary)';
                const planetGrad = getPlanetAvatarGradient(
                    project.planet_style,
                    project.accent_color,
                );

                return (
                    <GlassPanel
                        key={project.id}
                        variant="card"
                        interactive
                        tabIndex={0}
                        role="button"
                        aria-label={`Open project details for ${project.title}`}
                        onClick={(e) =>
                            onSelectProject(project, e.currentTarget)
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectProject(project, e.currentTarget);
                            }
                        }}
                        className="group flex flex-col justify-between gap-5 border-[var(--surface-border)] !p-5 transition-all duration-300 hover:border-[var(--secondary)] focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none sm:flex-row sm:items-center sm:!p-6"
                    >
                        {/* Left: 96px Planet Sphere + Telemetry Index */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                                {/* Orbit glow aura */}
                                <div
                                    className="absolute -inset-1.5 rounded-full opacity-40 blur-md transition-opacity duration-300 group-hover:opacity-75"
                                    style={{ backgroundColor: accent }}
                                />

                                {/* 96px Planet Sphere */}
                                <div
                                    className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 shadow-xl transition-transform duration-300 group-hover:scale-105"
                                    style={{
                                        background: planetGrad,
                                        boxShadow: `0 0 25px ${accent}40`,
                                    }}
                                >
                                    {/* Ring overlay for ringed style */}
                                    {project.planet_style === 'ringed' && (
                                        <div className="absolute inset-0 -m-3 scale-y-50 -rotate-25 transform rounded-full border border-violet-300/40 opacity-70" />
                                    )}

                                    {/* Station ring overlay for station style */}
                                    {project.planet_style === 'station' && (
                                        <div className="absolute inset-0 -m-2 animate-spin rounded-full border-2 border-dashed border-cyan-300/50 opacity-80 [animation-duration:25s]" />
                                    )}

                                    <span className="font-mono text-[10px] font-bold text-white uppercase drop-shadow-md">
                                        {project.planet_style}
                                    </span>
                                </div>

                                {/* Order index badge */}
                                <span className="absolute -top-1.5 -left-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] font-mono text-[10px] font-bold text-[var(--secondary)] shadow">
                                    0{idx + 1}
                                </span>
                            </div>

                            {/* Title & Sub-label */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-display text-lg font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)] sm:text-xl">
                                        {project.title}
                                    </h3>
                                    {project.is_featured && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/90 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-950 uppercase shadow">
                                            <StarFat className="h-2.5 w-2.5" />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
                                    {project.year && (
                                        <span className="font-semibold text-[var(--secondary)]">
                                            {project.year}
                                        </span>
                                    )}
                                    {project.business_type && (
                                        <span>• {project.business_type}</span>
                                    )}
                                    {project.role && (
                                        <span>• {project.role}</span>
                                    )}
                                </div>

                                <p className="mt-2 line-clamp-2 font-sans text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                                    {project.summary}
                                </p>
                            </div>
                        </div>

                        {/* Right: Tags & Action Button */}
                        <div className="flex flex-col items-start gap-3 sm:flex-shrink-0 sm:items-end">
                            {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {project.tags.slice(0, 3).map((tag) => (
                                        <TagChip
                                            key={tag.id}
                                            className="!h-6 !px-2 text-[10px]"
                                        >
                                            {tag.name}
                                        </TagChip>
                                    ))}
                                    {project.tags.length > 3 && (
                                        <span className="self-center font-mono text-[10px] text-[var(--text-muted)]">
                                            +{project.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                                <span className="font-mono text-[10px] text-[var(--secondary)] uppercase sm:hidden">
                                    TAP FOR BRIEFING ▶
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectProject(project);
                                    }}
                                    icon={
                                        <ArrowAngularTopRight className="h-3 w-3 text-[var(--secondary)]" />
                                    }
                                >
                                    Mission Briefing
                                </Button>
                            </div>
                        </div>
                    </GlassPanel>
                );
            })}
        </div>
    );
}
