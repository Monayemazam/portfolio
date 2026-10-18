import React from 'react';
import { ArrowAngularTopRight, StarFat } from 'lineicons-react';
import { PortfolioSection, ProjectItem } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';
import Button from '../Shared/Button';
import TagChip from '../Shared/TagChip';

interface ProjectsSectionProps {
    section: PortfolioSection;
    projects: ProjectItem[];
}

export default function ProjectsSection({
    section,
    projects,
}: ProjectsSectionProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <section
            id="projects"
            aria-label="Projects Solar System"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    eyebrow={section.eyebrow || 'MISSION 04 / SOLAR SHOWCASE'}
                    title={section.title || 'Featured Planetary Expeditions'}
                    subtitle={
                        section.subtitle ||
                        'A planetary system of full-stack web applications, architectures, and e-commerce platforms.'
                    }
                    highlightWord="Expeditions"
                />

                {/* Projects Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                        const accent =
                            project.accent_color || 'var(--secondary)';
                        const coverUrl =
                            project.cover_media?.webp_url ||
                            project.cover_media?.url;

                        return (
                            <GlassPanel
                                key={project.id}
                                variant="card"
                                interactive
                                className="group relative flex flex-col justify-between overflow-hidden border-[var(--surface-border)] !p-0"
                            >
                                {/* Top Accent Beam */}
                                <div
                                    className="h-1 w-full"
                                    style={{
                                        backgroundColor: accent,
                                        boxShadow: `0 0 12px ${accent}`,
                                    }}
                                />

                                <div>
                                    {/* Cover Media / Planet Preview Frame */}
                                    <div className="relative h-48 w-full overflow-hidden border-b border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                                        {coverUrl ? (
                                            <img
                                                src={coverUrl}
                                                alt={project.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--bg)] to-[var(--bg-elevated)]">
                                                <div
                                                    className="flex h-20 w-20 items-center justify-center rounded-full border-2 shadow-lg"
                                                    style={{
                                                        borderColor: accent,
                                                        boxShadow: `0 0 25px ${accent}40`,
                                                    }}
                                                >
                                                    <span className="font-mono text-xs font-bold text-[var(--text)] uppercase">
                                                        {project.planet_style}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Status & Style Badges */}
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                            <span
                                                className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase shadow-md backdrop-blur-md"
                                                style={{
                                                    backgroundColor: `${accent}CC`,
                                                }}
                                            >
                                                {project.planet_style}
                                            </span>
                                            {project.is_featured && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/90 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-950 uppercase shadow-md">
                                                    <StarFat className="h-3 w-3" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {project.year && (
                                            <div className="absolute top-3 right-3 rounded-full border border-[var(--surface-border)] bg-[var(--bg)]/80 px-2.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)] backdrop-blur-md">
                                                {project.year}
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Details */}
                                    <div className="p-6">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <h3 className="font-display text-xl font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)]">
                                                {project.title}
                                            </h3>
                                            {project.business_type && (
                                                <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase">
                                                    {project.business_type}
                                                </span>
                                            )}
                                        </div>

                                        {project.role && (
                                            <p className="mt-1 font-mono text-xs text-[var(--secondary)]">
                                                Role: {project.role}
                                            </p>
                                        )}

                                        <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-[var(--text-muted)]">
                                            {project.summary}
                                        </p>

                                        {/* Tech Tags */}
                                        {project.tags &&
                                            project.tags.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-1.5">
                                                    {project.tags
                                                        .slice(0, 4)
                                                        .map((tag) => (
                                                            <TagChip
                                                                key={tag.id}
                                                                className="!h-6 !px-2.5 text-[11px]"
                                                            >
                                                                {tag.name}
                                                            </TagChip>
                                                        ))}
                                                    {project.tags.length >
                                                        4 && (
                                                        <span className="self-center font-mono text-[10px] text-[var(--text-muted)]">
                                                            +
                                                            {project.tags
                                                                .length -
                                                                4}{' '}
                                                            more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="flex items-center justify-between border-t border-[var(--surface-border)] p-4">
                                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                                        ORBIT / STABLE
                                    </span>
                                    {project.live_url && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            href={project.live_url}
                                            target="_blank"
                                            icon={
                                                <ArrowAngularTopRight className="h-3.5 w-3.5 text-[var(--secondary)]" />
                                            }
                                        >
                                            Visit Live Site
                                        </Button>
                                    )}
                                </div>
                            </GlassPanel>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
