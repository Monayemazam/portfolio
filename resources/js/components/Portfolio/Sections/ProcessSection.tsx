import React from 'react';
import { PortfolioSection, ProcessStepItem } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';

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
            aria-label="Process Launch Sequence"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    eyebrow={section.eyebrow || 'MISSION 07 / LAUNCH SEQUENCE'}
                    title={section.title || 'Architectural Launch Sequence'}
                    subtitle={
                        section.subtitle ||
                        'A rigorous, six-stage engineering sequence from initial discovery to mission-critical support.'
                    }
                    highlightWord="Sequence"
                />

                {/* Steps Grid: 6 columns on large screens, 3 on tablet, 1 on mobile */}
                <div className="relative mt-8">
                    {/* Connecting line on desktop */}
                    <div
                        className="absolute top-12 right-8 left-8 z-0 hidden h-0.5 lg:block"
                        style={{
                            background:
                                'linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%)',
                            opacity: 0.3,
                        }}
                    />

                    <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {processSteps.map((step, index) => {
                            const stepNumber = String(index + 1).padStart(
                                2,
                                '0',
                            );

                            return (
                                <GlassPanel
                                    key={step.id}
                                    variant="card"
                                    interactive
                                    className="flex flex-col justify-between border-[var(--surface-border)] !p-5"
                                >
                                    <div>
                                        {/* Countdown / Sequence Indicator */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--secondary)]/40 bg-[var(--surface)] font-mono text-sm font-bold text-[var(--secondary)] shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                                                {stepNumber}
                                            </div>
                                            <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
                                                STAGE {stepNumber}
                                            </span>
                                        </div>

                                        <h3 className="mb-2 font-display text-base font-bold text-[var(--text)]">
                                            {step.title}
                                        </h3>
                                        <p className="font-sans text-xs leading-relaxed text-[var(--text-muted)]">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Telemetry Status Line */}
                                    <div className="mt-4 flex items-center gap-1.5 border-t border-[var(--surface-border)]/40 pt-3 font-mono text-[9px] text-[var(--text-muted)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                                        <span>CHECKLIST READY</span>
                                    </div>
                                </GlassPanel>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
