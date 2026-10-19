import React, { useEffect, useRef, useState } from 'react';
import { PortfolioSection, ProcessStepItem } from '@/types/portfolio';

interface ProcessSectionProps {
    section: PortfolioSection;
    processSteps: ProcessStepItem[];
    isOff?: boolean;
}

interface ProcessCardProps {
    step: ProcessStepItem;
    idx: number;
    totalSteps: number;
    isOff?: boolean;
}

function ProcessStepCard({ step, idx, totalSteps, isOff }: ProcessCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.05, rootMargin: '50px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Countdown code e.g. T-06 down to T-01
    const countdownNum = (totalSteps - idx).toString().padStart(2, '0');
    const countdownCode = `T-${countdownNum}`;
    const stageIndex = (idx + 1).toString().padStart(2, '0');

    return (
        <div
            ref={cardRef}
            className={`relative flex flex-col justify-between border-2 border-foreground bg-surface p-6 sm:p-7 transition-all duration-500 hover:border-[var(--primary)] pl-14 sm:pl-6 ${
                inView || isOff ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            data-field-tag={countdownCode}
        >
            {/* Mobile Node Marker on Vertical Line */}
            <div className="flex lg:hidden absolute left-6 -translate-x-1/2 top-7 z-20 h-5 w-5 items-center justify-center bg-background border-2 border-foreground">
                <div className="h-1.5 w-1.5 bg-[var(--primary)]" />
            </div>

            <div>
                {/* Countdown Header Badge & Sequence Index */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-mono text-xl sm:text-2xl font-black text-[var(--primary)] tracking-tight">
                        {countdownCode}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        PHASE {stageIndex}
                    </span>
                </div>

                {/* Stage Title */}
                <h3 className="mt-5 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground uppercase">
                    {step.title}
                </h3>

                {/* Step Description */}
                <p className="mt-3 font-body text-xs sm:text-sm leading-relaxed text-foreground/80">
                    {step.description}
                </p>
            </div>

            {/* Verification Milestone Footer */}
            <div className="mt-8 pt-3 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                <span>CHECKPOINT</span>
                <span className="text-[var(--primary)] font-bold">VERIFIED</span>
            </div>
        </div>
    );
}

export default function ProcessSection({
    section,
    processSteps,
    isOff,
}: ProcessSectionProps) {
    if (!processSteps || processSteps.length === 0) return null;

    const totalSteps = processSteps.length;

    return (
        <section
            id="process"
            aria-label="Methodology Sequence"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 06
                        </span>
                        <span>METHODOLOGY SEQUENCE // LAUNCH COUNTDOWN PIPELINE</span>
                    </div>
                    <span>TOTAL STAGES: [{totalSteps.toString().padStart(2, '0')}]</span>
                </div>

                {/* Section Title */}
                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // STRUCTURED EXECUTION SEQUENCE
                        </span>
                        <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                            {section?.title || 'DEVELOPMENT PROCESS'}
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        From raw domain discovery and architectural blueprints to production telemetry,
                        every engagement follows an unbroken, countdown-driven execution pipeline.
                    </p>
                </div>

                {/* Desktop: Six Step Panels in a Row with Horizontal Connecting Line */}
                {/* Mobile: Vertical Stack with Connecting Line */}
                <div className="relative mt-16 sm:mt-24">
                    {/* Desktop Horizontal Connecting Line */}
                    <div className="hidden lg:block absolute top-[44px] left-8 right-8 h-0.5 bg-border z-0" />

                    {/* Mobile Vertical Connecting Line */}
                    <div className="block lg:hidden absolute top-6 bottom-6 left-6 w-0.5 bg-border z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
                        {processSteps.map((step, idx) => (
                            <ProcessStepCard
                                key={step.id}
                                step={step}
                                idx={idx}
                                totalSteps={totalSteps}
                                isOff={isOff}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
