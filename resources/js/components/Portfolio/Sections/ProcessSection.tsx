import React, { useEffect, useRef, useState } from 'react';
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
    const containerRef = useRef<HTMLElement>(null);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    const sortedSteps = [...processSteps].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    // Dynamic scroll observer to highlight the active phase as user scrolls
    useEffect(() => {
        if (isOff) return;

        const handleScroll = () => {
            const stepElements = sortedSteps.map((_, i) =>
                document.getElementById(`process-step-${i}`)
            );

            const viewportCenter = window.innerHeight * 0.45;

            stepElements.forEach((el, index) => {
                if (!el) return;
                const rect = el.getBoundingClientRect();
                if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                    setActiveStepIndex(index);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sortedSteps, isOff]);

    const totalSteps = sortedSteps.length;
    const progressPercent = totalSteps > 0
        ? Math.round(((activeStepIndex + 1) / totalSteps) * 100)
        : 100;

    return (
        <section
            ref={containerRef}
            id={section.key}
            aria-label="Development Process Methodology"
            className="w-full border-b-2 border-foreground bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28 select-none"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Calibration Eyebrow Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="stamp-orange text-[10px] tracking-widest">
                            SEC. 06 // METHODOLOGY
                        </span>
                        <span className="font-bold text-foreground">
                            DEVELOPMENT SEQUENCE IN MOTION
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 bg-[var(--accent)] inline-block" />
                        <span>SEQUENCE PROGRESS: [{progressPercent}% DISPATCHED]</span>
                    </div>
                </div>

                {/* Section Introduction */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // 6-STAGE EXECUTION LIFECYCLE
                        </span>
                        <h2 className="mt-2 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                            PREDICTABLE CADENCE,
                            <br />
                            FLAWLESS EXECUTION.
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Every project advances through a verified sequential track from discovery
                        and architecture modeling down to final zero-downtime release.
                    </p>
                </div>

                {/* Horizontal / Sticky Sequence Progress Bar */}
                <div className="mt-12 border-2 border-foreground bg-surface p-4 sm:p-6">
                    <div className="flex items-center justify-between font-mono text-xs uppercase mb-3">
                        <div className="flex items-center gap-2">
                            <span className="os-beacon" />
                            <span className="font-bold text-foreground">
                                ACTIVE STAGE: PHASE 0{activeStepIndex + 1} // 0{totalSteps}
                            </span>
                        </div>
                        <span className="text-[var(--primary)] font-bold">
                            [{progressPercent}% COMPLETE]
                        </span>
                    </div>

                    {/* Stepping Indicator Rail */}
                    <div className="relative h-2 w-full bg-border overflow-hidden">
                        <div
                            className="h-full bg-[var(--primary)] transition-all duration-300 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* The Process Steps Interactive Timeline */}
                <div className="mt-10 relative">
                    {/* Vertical Connecting Line (Desktop & Mobile) */}
                    <div
                        aria-hidden="true"
                        className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-border pointer-events-none"
                    />

                    <div className="space-y-6 sm:space-y-8">
                        {sortedSteps.map((step, idx) => {
                            const isActive = idx === activeStepIndex;
                            const isCompleted = idx < activeStepIndex;
                            const stepNum = (step.sort_order ?? idx + 1)
                                .toString()
                                .padStart(2, '0');
                            const countdown = (totalSteps - idx).toString().padStart(2, '0');

                            return (
                                <div
                                    key={step.id}
                                    id={`process-step-${idx}`}
                                    onClick={() => setActiveStepIndex(idx)}
                                    className={`group relative flex flex-col sm:flex-row sm:items-start justify-between border-2 transition-all duration-300 pl-16 sm:pl-20 p-6 sm:p-8 cursor-pointer ${
                                        isActive
                                            ? 'border-foreground bg-surface shadow-md -translate-y-1'
                                            : isCompleted
                                            ? 'border-border bg-background opacity-85 hover:border-foreground'
                                            : 'border-border bg-background opacity-60 hover:opacity-100 hover:border-foreground'
                                    }`}
                                >
                                    {/* Timeline Node Ring */}
                                    <div
                                        className={`absolute left-6 sm:left-8 -translate-x-1/2 top-8 z-10 flex h-6 w-6 items-center justify-center border-2 transition-colors ${
                                            isActive
                                                ? 'border-foreground bg-[var(--primary)] text-white'
                                                : isCompleted
                                                ? 'border-foreground bg-[var(--accent)] text-[#171914]'
                                                : 'border-border bg-background text-muted-foreground'
                                        }`}
                                    >
                                        <span className="font-mono text-[10px] font-black">
                                            {isCompleted ? '✓' : idx + 1}
                                        </span>
                                    </div>

                                    {/* Content Block */}
                                    <div className="flex-1 max-w-2xl">
                                        <div className="flex items-center gap-3 font-mono text-xs">
                                            <span
                                                className={`font-black text-sm ${
                                                    isActive ? 'text-[var(--primary)]' : 'text-muted-foreground'
                                                }`}
                                            >
                                                T-{countdown} //
                                            </span>
                                            <span className="font-bold text-foreground uppercase tracking-wider">
                                                PHASE {stepNum}
                                            </span>
                                            {isActive && (
                                                <span className="stamp-lime text-[9px] px-1.5 py-0.5">
                                                    IN FOCUS
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mt-3 font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground group-hover:text-[var(--primary)] transition-colors">
                                            {step.title}
                                        </h3>

                                        <p className="mt-2 font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Status Indicator Chip */}
                                    <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end gap-1 font-mono text-[10px] uppercase text-muted-foreground shrink-0">
                                        <span className="border border-border px-2 py-0.5 bg-background">
                                            {isCompleted ? 'STAGE COMPLETED' : isActive ? 'STAGE ACTIVE' : 'STAGE UPCOMING'}
                                        </span>
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
