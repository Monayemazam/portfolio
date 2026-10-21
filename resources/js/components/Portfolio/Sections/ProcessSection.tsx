import React, { useState } from 'react';
import { PortfolioSection, ProcessStepItem } from '@/types/portfolio';

interface ProcessSectionProps {
    section: PortfolioSection;
    processSteps: ProcessStepItem[];
    isOff?: boolean;
}

export default function ProcessSection({
    section,
    processSteps,
}: ProcessSectionProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const sortedSteps = [...processSteps].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    return (
        <section
            id={section.key}
            aria-label="Development Process"
            className="w-full border-b border-border/40 bg-[var(--bg)] px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none relative overflow-hidden"
        >
            {/* Subtle Ethereal Forest-Green Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--forest)] opacity-20 blur-[120px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* Section Header Strip */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    <span className="font-bold text-foreground">PROCESS</span>
                    <span className="text-border">/</span>
                    <span>HOW I WORK</span>
                </div>

                {/* Section Title and Narrative */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // METHODOLOGY
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
                            HOW I WORK
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                        A disciplined development process from initial discovery to production deployment and ongoing support.
                    </p>
                </div>

                {/* Process Steps Grid */}
                <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {sortedSteps.map((step, idx) => {
                        const stepNum = (idx + 1).toString().padStart(2, '0');
                        const isHovered = hoveredIndex === idx;

                        return (
                            <div
                                key={step.id}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`group relative rounded-2xl border p-8 transition-all duration-300 ${
                                    isHovered
                                        ? 'border-[var(--primary)] bg-surface/75 shadow-[0_0_25px_rgba(241,90,36,0.15)] -translate-y-1'
                                        : 'border-border/60 bg-surface/40 backdrop-blur-md hover:border-border hover:bg-surface/60'
                                }`}
                            >
                                <div className="flex items-center justify-between pb-4 border-b border-border/30">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className={`h-2 w-2 rounded-full transition-colors ${
                                                isHovered
                                                    ? 'bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]'
                                                    : 'bg-[var(--accent)]'
                                            }`}
                                        />
                                        <span className="font-mono text-xs font-bold text-foreground">
                                            STAGE {stepNum}
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs text-muted-foreground">
                                        0{idx + 1} / 0{sortedSteps.length}
                                    </span>
                                </div>

                                <h3 className="mt-5 font-display text-2xl font-black uppercase tracking-tight text-foreground">
                                    {step.title}
                                </h3>

                                <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
