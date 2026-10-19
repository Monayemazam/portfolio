import React from 'react';
import { ArrowRight, Sparkle } from '../Shared/Icons';
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

    const eyebrow = section.eyebrow || 'WORKFLOW & METHODOLOGY';
    const title = section.title || 'Development Process';
    const subtitle =
        section.subtitle ||
        'A structured, reliable engineering journey ensuring clear delivery, high security, and exceptional performance at every stage.';

    return (
        <section
            id="process"
            aria-label="Development Process Section"
            className="relative w-full overflow-hidden px-4 py-24 sm:px-6 sm:py-32 md:px-10 lg:px-16 lg:py-36 xl:px-20"
        >
            {/* Ambient Background Aura */}
            <div
                className="pointer-events-none absolute bottom-10 left-1/4 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[140px]"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1440px]">
                {/* Header Section */}
                <div className="flex flex-col items-start max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                        <Sparkle className="h-3.5 w-3.5 text-[var(--secondary)]" />
                        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                            {eyebrow}
                        </span>
                    </div>

                    <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-[var(--text)]">
                        {title}
                    </h2>

                    <p className="mt-4 font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                        {subtitle}
                    </p>
                </div>

                {/* Structured Process Sequence Grid (3 columns desktop, 2 tablet, 1 mobile) */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {processSteps.map((step, index) => {
                        const stepNum = String(index + 1).padStart(2, '0');

                        return (
                            <div
                                key={step.id}
                                className="group relative flex flex-col justify-between rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--secondary)] hover:shadow-[0_20px_40px_rgba(83,224,247,0.12)]"
                            >
                                <div>
                                    {/* Large Step Number */}
                                    <div className="mb-6 flex items-center justify-between">
                                        <span className="font-display text-4xl font-black tracking-tight text-[var(--secondary)]/80 transition-colors group-hover:text-[var(--secondary)]">
                                            {stepNum}
                                        </span>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--bg-elevated)] font-mono text-xs font-bold text-[var(--text-muted)] group-hover:border-[var(--secondary)] group-hover:text-[var(--secondary)]">
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </div>
                                    </div>

                                    {/* Step Title */}
                                    <h3 className="font-display text-xl font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)]">
                                        {step.title}
                                    </h3>

                                    {/* Step Description */}
                                    <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                                        {step.description}
                                    </p>
                                </div>

                                <div className="mt-6 border-t border-[var(--surface-border)]/40 pt-4 font-mono text-[11px] text-[var(--text-muted)]">
                                    Stage {index + 1} of {processSteps.length}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
