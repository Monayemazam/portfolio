import React from 'react';
import { PortfolioSection, ExperienceItem } from '@/types/portfolio';

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
            aria-label="Career Timeline"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 05
                        </span>
                        <span>CAREER TIMELINE // VERIFIED POSTS</span>
                    </div>
                    <span>TOTAL STATIONS: [{experiences.length}]</span>
                </div>

                <div className="mt-8">
                    <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                        // APPOINTMENTS & TRACK RECORD
                    </span>
                    <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                        CHRONOLOGY OF PRACTICE.
                    </h2>
                </div>

                {/* Typographic Timeline with Minimal Line Work */}
                <div className="mt-12 divide-y divide-border border-y border-border">
                    {experiences.map((exp) => {
                        const startStr = formatDate(exp.start_date);
                        const endStr = exp.is_current ? 'PRESENT' : formatDate(exp.end_date);

                        return (
                            <div
                                key={exp.id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 sm:py-10 transition-colors hover:bg-surface px-4 sm:px-6"
                            >
                                <div className="md:col-span-3 font-mono text-xs font-bold text-[var(--primary)] tracking-wider uppercase">
                                    {startStr} — {endStr}
                                    {exp.is_current && (
                                        <span className="ml-2 stamp-lime text-[9px]">CURRENT</span>
                                    )}
                                </div>

                                <div className="md:col-span-4">
                                    <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase">
                                        {exp.role}
                                    </h3>
                                    <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase mt-1 block">
                                        @ {exp.company}
                                    </span>
                                </div>

                                <div className="md:col-span-5 font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                                    {exp.description}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
