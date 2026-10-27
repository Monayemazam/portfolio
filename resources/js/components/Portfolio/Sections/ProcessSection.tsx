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
    isOff = false,
}: ProcessSectionProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const sortedSteps = [...processSteps].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

    return (
        <section
            id={section.key}
            aria-label="Development Process — Visual Journey"
            className="w-full bg-[var(--bg)] px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none relative overflow-hidden border-t border-[var(--surface-border)]"
        >
            {/* Ambient Nebula Light in Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 left-1/4 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-25 blur-[140px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* Section Heading & Narrative */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] uppercase leading-tight">
                            {section?.title || 'DEVELOPMENT PROCESS.'}
                        </h2>
                    </div>

                    <p className="max-w-md font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        A disciplined, transparent journey from initial discovery to high-availability deployment and continuous proactive support.
                    </p>
                </div>

                {/* DESKTOP HORIZONTAL TIMELINE JOURNEY */}
                <div className="mt-16 sm:mt-20 hidden lg:block relative">
                    {/* Horizontal Connecting Spine Track */}
                    <div className="absolute top-6 left-0 right-0 h-[2px] bg-[var(--surface-border)] z-0" />
                    <div className="absolute top-6 left-0 w-3/4 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] z-0 opacity-70" />

                    {/* 6 Waypoint Stations Row */}
                    <div className="grid grid-cols-6 gap-6 relative z-10">
                        {sortedSteps.map((step, idx) => {
                            const stepNum = (idx + 1).toString().padStart(2, '0');
                            const isHovered = hoveredIdx === idx;

                            return (
                                <div
                                    key={step.id}
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    className="flex flex-col items-start group cursor-default"
                                >
                                    {/* Waypoint Orbital Node */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <div
                                            className={`h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-[var(--bg)] ${
                                                isHovered
                                                    ? 'border-[var(--primary)] shadow-[0_0_18px_var(--primary)] scale-110'
                                                    : 'border-[var(--surface-border)] group-hover:border-[var(--primary)]/60'
                                            }`}
                                        >
                                            <span
                                                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                                                    isHovered
                                                        ? 'bg-[var(--primary)] scale-125'
                                                        : idx < 3
                                                        ? 'bg-[var(--accent)]'
                                                        : 'bg-[var(--text-muted)]'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Milestone Card Plate */}
                                    <div
                                        className={`w-full rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between min-h-[190px] ${
                                            isHovered
                                                ? 'border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_25px_rgba(241,90,36,0.18)] -translate-y-1'
                                                : 'border-[var(--surface-border)] bg-[var(--surface)]/50 group-hover:border-[var(--primary)]/40'
                                        }`}
                                    >
                                        <div>
                                            <span className="font-mono text-[11px] font-bold tracking-widest text-[var(--primary)] uppercase block">
                                                {stepNum}
                                            </span>

                                            <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                                                {step.title}
                                            </h3>

                                            <p className="mt-2.5 font-body text-xs text-[var(--text-muted)] leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. MOBILE / TABLET ACCESSIBLE VERTICAL TIMELINE */}
                <div className="mt-14 lg:hidden relative pl-6 sm:pl-8 border-l-2 border-[var(--surface-border)] space-y-8">
                    {sortedSteps.map((step, idx) => {
                        const stepNum = (idx + 1).toString().padStart(2, '0');

                        return (
                            <div key={step.id} className="relative group">
                                {/* Waypoint Node Marker on Left Spine */}
                                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-6 w-6 rounded-full border-2 border-[var(--primary)] bg-[var(--bg)] flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                                </div>

                                {/* Step Card */}
                                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 sm:p-6 transition-all duration-200">
                                    <span className="font-mono text-[11px] font-bold tracking-widest text-[var(--primary)] uppercase">
                                        {stepNum}
                                    </span>

                                    <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-[var(--text)]">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
