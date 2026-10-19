import React from 'react';
import { PortfolioSection, ProcessStepItem } from '@/types/portfolio';

interface ProcessSectionProps {
    section: PortfolioSection;
    processSteps: ProcessStepItem[];
}

export default function ProcessSection({
    section,
    processSteps,
}: ProcessSectionProps) {
    if (!processSteps || processSteps.length === 0) return null;

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
                        <span>METHODOLOGY SEQUENCE // 6-STAGE DELIVERY PIPELINE</span>
                    </div>
                    <span>TOTAL STAGES: [{processSteps.length.toString().padStart(2, '0')}]</span>
                </div>

                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // STRUCTURED EXECUTION
                        </span>
                        <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                            HOW THE WORK GETS DONE.
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        From raw domain discovery and architectural blueprints to production telemetry,
                        every engagement follows a disciplined, predictable execution sequence.
                    </p>
                </div>

                {/* Numbered Sequence: Horizontal Grid with 1px Rules */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t-2 border-l-2 border-foreground">
                    {processSteps.map((step, idx) => {
                        const stepNum = (idx + 1).toString().padStart(2, '0');

                        return (
                            <div
                                key={step.id}
                                className="group border-r-2 border-b-2 border-foreground p-6 sm:p-8 flex flex-col justify-between transition-colors hover:bg-surface"
                            >
                                <div>
                                    <div className="flex items-center justify-between border-b border-border pb-4">
                                        <span className="font-mono text-3xl sm:text-4xl font-black text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                                            {stepNum} //
                                        </span>
                                        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                            STAGE {idx + 1}/{processSteps.length}
                                        </span>
                                    </div>

                                    <h3 className="mt-6 font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                                    <span>PHASE DELIVERABLE VERIFIED</span>
                                    <span className="text-[var(--primary)] font-bold">→</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
