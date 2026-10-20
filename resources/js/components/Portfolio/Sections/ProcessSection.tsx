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
            const viewportCenter = window.innerHeight * 0.45;

            sortedSteps.forEach((_, index) => {
                const el = document.getElementById(`mission-step-${index}`);
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
            className="w-full border-b border-border/40 bg-[var(--bg)] px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none relative overflow-hidden"
        >
            {/* Ambient Background Light Cone */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--forest)] opacity-25 blur-[120px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                        <span className="font-bold text-foreground">
                            {section?.title || 'MISSION SEQUENCE'}
                        </span>
                        <span className="text-border">/</span>
                        <span>DEVELOPMENT TRAJECTORY</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        <span>TRAJECTORY PROGRESS: {progressPercent}% ORBITAL REACH</span>
                    </div>
                </div>

                {/* Section Title and Narrative */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 font-mono text-xs text-[var(--primary)] uppercase tracking-widest">
                            <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
                            <span>6-STAGE FLIGHT PLAN</span>
                        </div>
                        <h2 className="mt-3 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                            PREDICTABLE CADENCE,
                            <br />
                            <span className="text-[var(--primary)]">FLAWLESS TRAJECTORY.</span>
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-foreground/70 leading-relaxed">
                        Every initiative follows a disciplined orbital sequence — advancing systematically
                        from deep discovery and system architecture to precision deployment and orbit stabilization.
                    </p>
                </div>

                {/* Trajectory Progress Gauge */}
                <div className="mt-12 rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-md p-6">
                    <div className="flex items-center justify-between font-mono text-xs uppercase mb-3">
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent)]" />
                            </span>
                            <span className="font-bold text-foreground tracking-wider">
                                CURRENT TRAJECTORY: STAGE 0{activeStepIndex + 1} OF 0{totalSteps}
                            </span>
                        </div>
                        <span className="text-[var(--primary)] font-bold">
                            [{progressPercent}% COMPLETE]
                        </span>
                    </div>

                    {/* Progress Track */}
                    <div className="relative h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* The Mission Steps Connected Timeline */}
                <div className="mt-14 relative">
                    {/* Vertical Connecting Trajectory Line */}
                    <div
                        aria-hidden="true"
                        className="absolute left-6 sm:left-8 top-6 bottom-6 w-[2px] bg-gradient-to-b from-[var(--primary)] via-[var(--accent)]/50 to-border/40 pointer-events-none"
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
                                    id={`mission-step-${idx}`}
                                    onClick={() => setActiveStepIndex(idx)}
                                    className={`group relative flex flex-col sm:flex-row sm:items-start justify-between rounded-2xl border transition-all duration-300 pl-16 sm:pl-20 p-6 sm:p-8 cursor-pointer ${
                                        isActive
                                            ? 'border-[var(--primary)]/60 bg-surface/80 shadow-[0_0_30px_rgba(241,90,36,0.12)] -translate-y-1'
                                            : isCompleted
                                            ? 'border-border/60 bg-surface/40 hover:border-border hover:bg-surface/60'
                                            : 'border-border/30 bg-surface/20 opacity-60 hover:opacity-90 hover:border-border/60'
                                    }`}
                                >
                                    {/* Trajectory Star Node */}
                                    <div
                                        className={`absolute left-6 sm:left-8 -translate-x-1/2 top-8 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                                            isActive
                                                ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_15px_var(--primary)] scale-110'
                                                : isCompleted
                                                ? 'border-[var(--accent)] bg-[var(--accent)] text-[#171914] shadow-[0_0_10px_var(--accent)]'
                                                : 'border-border bg-surface text-muted-foreground'
                                        }`}
                                    >
                                        <span className="font-mono text-[11px] font-bold">
                                            {isCompleted ? '✓' : idx + 1}
                                        </span>
                                    </div>

                                    {/* Content Block */}
                                    <div className="flex-1 max-w-2xl">
                                        <div className="flex items-center gap-3 font-mono text-xs">
                                            <span
                                                className={`font-black text-sm tracking-wider ${
                                                    isActive ? 'text-[var(--primary)]' : 'text-muted-foreground'
                                                }`}
                                            >
                                                T-{countdown} //
                                            </span>
                                            <span className="font-bold text-foreground uppercase tracking-widest text-[11px]">
                                                STAGE {stepNum}
                                            </span>
                                            {isActive && (
                                                <span className="rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent)] tracking-wider">
                                                    IN ORBIT
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground group-hover:text-[var(--primary)] transition-colors">
                                            {step.title}
                                        </h3>

                                        <p className="mt-3 font-body text-base sm:text-lg leading-relaxed text-foreground/75">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-4 sm:mt-0 flex items-center sm:justify-end shrink-0">
                                        <span
                                            className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider font-semibold border ${
                                                isCompleted
                                                    ? 'border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10'
                                                    : isActive
                                                    ? 'border-[var(--primary)]/40 text-[var(--primary)] bg-[var(--primary)]/10'
                                                    : 'border-border/40 text-muted-foreground bg-surface/30'
                                            }`}
                                        >
                                            {isCompleted ? 'STAGE VERIFIED' : isActive ? 'TRAJECTORY ACTIVE' : 'UPCOMING'}
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
