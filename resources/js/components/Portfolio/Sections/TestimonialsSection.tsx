import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, DoubleQuotesEnd1 } from 'lineicons-react';
import { PortfolioSection, TestimonialItem } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';

interface TestimonialsSectionProps {
    section: PortfolioSection;
    testimonials: TestimonialItem[];
}

export default function TestimonialsSection({
    section,
    testimonials,
}: TestimonialsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Prompt 7 requirement: Hide automatically when no testimonial is published
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const current = testimonials[currentIndex];
    const total = testimonials.length;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    return (
        <section
            id="testimonials"
            aria-label="Testimonials Transmissions"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-5xl">
                <SectionHeading
                    eyebrow={section.eyebrow || 'MISSION 08 / TRANSMISSIONS'}
                    title={section.title || 'Client Transmissions & Feedback'}
                    subtitle={
                        section.subtitle ||
                        'Direct dispatches and mission evaluations received from engineering collaborators and partners.'
                    }
                    highlightWord="Transmissions"
                    align="center"
                />

                {/* Central Quote Panel */}
                <div className="relative mx-auto mt-12 max-w-3xl">
                    <GlassPanel
                        variant="panel"
                        className="relative overflow-hidden border-[var(--surface-border)] !p-8 text-center shadow-[0_0_35px_rgba(124,58,237,0.15)] md:!p-12"
                    >
                        {/* Background Signal Waves Watermark */}
                        <div className="pointer-events-none absolute -top-12 -right-12 text-[var(--secondary)] opacity-10">
                            <DoubleQuotesEnd1 className="h-44 w-44" />
                        </div>

                        {/* Quote Text */}
                        <blockquote className="relative z-10 font-sans text-lg leading-relaxed font-normal text-[var(--text)] italic md:text-2xl">
                            "{current.quote}"
                        </blockquote>

                        {/* Author Profile */}
                        <div className="relative z-10 mt-8 flex flex-col items-center justify-center">
                            {/* Author Photo in Porthole */}
                            {current.photo?.url ? (
                                <img
                                    src={current.photo.url}
                                    alt={current.author_name}
                                    className="mb-3 h-16 w-16 rounded-full border-2 border-[var(--secondary)] object-cover shadow-[0_0_12px_var(--secondary)]"
                                />
                            ) : (
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--secondary)] bg-[var(--surface)] font-mono text-sm font-bold text-[var(--secondary)]">
                                    {current.author_name
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                            )}

                            <div className="font-display text-base font-bold text-[var(--text)] md:text-lg">
                                {current.author_name}
                            </div>

                            <div className="font-sans text-xs text-[var(--text-muted)] md:text-sm">
                                {current.author_role}
                                {current.company && ` • ${current.company}`}
                            </div>

                            {current.project && (
                                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-0.5 font-mono text-[10px] text-[var(--secondary)]">
                                    <span>PROJECT:</span>
                                    <span className="font-bold">
                                        {current.project.title}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Carousel Arrows at Sides if multiple */}
                        {total > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-6">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    aria-label="Previous transmission"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:shadow-[0_0_12px_var(--secondary)] focus:outline-none"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </button>

                                {/* Navigation Dots */}
                                <div className="flex items-center gap-2">
                                    {testimonials.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setCurrentIndex(idx)}
                                            aria-label={`Go to transmission ${idx + 1}`}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                idx === currentIndex
                                                    ? 'w-6 bg-[var(--secondary)] shadow-[0_0_8px_var(--secondary)]'
                                                    : 'w-2 bg-[var(--surface-border)] hover:bg-[var(--text-muted)]'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    aria-label="Next transmission"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:shadow-[0_0_12px_var(--secondary)] focus:outline-none"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </GlassPanel>
                </div>
            </div>
        </section>
    );
}
