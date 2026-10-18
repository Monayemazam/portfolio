import React from 'react';
import { PortfolioSection, ExperienceItem } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';

interface ExperienceSectionProps {
    section: PortfolioSection;
    experiences: ExperienceItem[];
}

export default function ExperienceSection({
    section,
    experiences,
}: ExperienceSectionProps) {
    if (!experiences || experiences.length === 0) return null;

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <section
            id="experience"
            aria-label="Experience Flight Log"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    eyebrow={section.eyebrow || 'MISSION 06 / FLIGHT LOG'}
                    title={section.title || 'Mission Trajectory & Experience'}
                    subtitle={
                        section.subtitle ||
                        'A chronicle of engineering milestones, leadership roles, and production systems.'
                    }
                    highlightWord="Trajectory"
                    align="center"
                />

                {/* Timeline Container */}
                <div className="relative mt-12">
                    {/* Central Vertical Flight Line */}
                    <div
                        className="absolute top-0 bottom-0 left-4 w-0.5 -translate-x-1/2 md:left-1/2"
                        style={{
                            background:
                                'linear-gradient(180deg, var(--secondary) 0%, var(--primary) 50%, transparent 100%)',
                        }}
                    />

                    <div className="flex flex-col gap-10">
                        {experiences.map((exp, index) => {
                            const isEven = index % 2 === 0;
                            const startStr = formatDate(exp.start_date);
                            const endStr = exp.is_current
                                ? 'Present'
                                : formatDate(exp.end_date);

                            return (
                                <div
                                    key={exp.id}
                                    className={`relative flex flex-col items-start md:flex-row md:items-center ${
                                        isEven ? 'md:flex-row-reverse' : ''
                                    }`}
                                >
                                    {/* Central Orbit Milestone Node */}
                                    <div className="absolute left-4 z-10 flex -translate-x-1/2 items-center justify-center md:left-1/2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--secondary)] bg-[var(--bg)] shadow-[0_0_12px_var(--secondary)]">
                                            <span className="h-2 w-2 rounded-full bg-[var(--secondary)]" />
                                        </div>
                                    </div>

                                    {/* Content Card (Left or Right) */}
                                    <div className="ml-10 w-full md:ml-0 md:w-1/2 md:px-8">
                                        <GlassPanel
                                            variant="card"
                                            interactive
                                            className="border-[var(--surface-border)]"
                                        >
                                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                                <span className="font-mono text-xs font-semibold tracking-wider text-[var(--secondary)] uppercase">
                                                    {startStr} — {endStr}
                                                </span>
                                                {exp.is_current && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--success)]/30 bg-[var(--success)]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--success)]">
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" />
                                                        Current Flight
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-display text-lg font-bold text-[var(--text)] md:text-xl">
                                                {exp.role}
                                            </h3>
                                            <div className="mt-0.5 font-sans text-sm font-medium text-[var(--text-muted)]">
                                                {exp.company}
                                            </div>

                                            {exp.description && (
                                                <p className="mt-3 font-sans text-sm leading-relaxed whitespace-pre-line text-[var(--text-muted)]">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </GlassPanel>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
