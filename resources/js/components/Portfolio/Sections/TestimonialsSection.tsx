import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from '../Shared/Icons';
import { PortfolioSection, TestimonialItem } from '@/types/portfolio';

interface TestimonialsSectionProps {
    section: PortfolioSection;
    testimonials: TestimonialItem[];
}

export default function TestimonialsSection({
    section,
    testimonials,
}: TestimonialsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

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
            aria-label="Editorial Quotations"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 07
                        </span>
                        <span>EDITORIAL TESTIMONIALS // THIRD-PARTY OBSERVATIONS</span>
                    </div>
                    <span>TOTAL QUOTES: [{total}]</span>
                </div>

                <div className="mx-auto mt-12 max-w-4xl border-2 border-foreground bg-surface p-8 sm:p-14">
                    <span className="font-mono text-5xl sm:text-6xl text-[var(--primary)] select-none font-serif">
                        “
                    </span>

                    <blockquote className="mt-2 font-body text-xl sm:text-3xl font-normal leading-relaxed text-foreground -mt-6">
                        {current.quote}
                    </blockquote>

                    <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="font-display text-lg font-bold text-foreground uppercase">
                                {current.author_name}
                            </div>
                            <div className="font-mono text-xs text-muted-foreground uppercase mt-0.5">
                                {current.author_role} {current.company && `// ${current.company}`}
                            </div>
                        </div>

                        {total > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    aria-label="Previous quote"
                                    className="border border-border p-2 hover:bg-foreground hover:text-background transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </button>
                                <span className="font-mono text-xs px-2">
                                    {currentIndex + 1} / {total}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    aria-label="Next quote"
                                    className="border border-border p-2 hover:bg-foreground hover:text-background transition-colors"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
