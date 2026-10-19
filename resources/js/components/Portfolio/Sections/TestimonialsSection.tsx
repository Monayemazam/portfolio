import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from '../Shared/Icons';
import { PortfolioSection, TestimonialItem } from '@/types/portfolio';

interface TestimonialsSectionProps {
    section: PortfolioSection;
    testimonials: TestimonialItem[];
    isOff?: boolean;
}

export default function TestimonialsSection({
    section,
    testimonials,
    isOff,
}: TestimonialsSectionProps) {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const total = testimonials.length;

    // Auto-rotation (pauses on hover and focus, completely disabled under reduced motion)
    useEffect(() => {
        if (isOff || isPaused || total <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 6500);

        return () => clearInterval(interval);
    }, [isOff, isPaused, total]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 45) {
            handleNext();
        } else if (diff < -45) {
            handlePrev();
        }
        touchStartX.current = null;
    };

    const current = testimonials[currentIndex];
    const currentNum = (currentIndex + 1).toString().padStart(2, '0');
    const totalNum = total.toString().padStart(2, '0');

    return (
        <section
            id="testimonials"
            role="region"
            aria-roledescription="carousel"
            aria-label="Client Transmissions"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 07
                        </span>
                        <span>EDITORIAL TRANSMISSIONS // CLIENT OBSERVATIONS</span>
                    </div>
                    <span>TOTAL TRANSMISSIONS: [{totalNum}]</span>
                </div>

                {/* Section Title */}
                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // VERIFIED FIELD DISPATCHES
                        </span>
                        <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                            {section?.title || 'CLIENT TRANSMISSIONS.'}
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Unedited testimonials from founders, product directors, and technical teams
                        evaluating production delivery, velocity, and craftsmanship.
                    </p>
                </div>

                {/* Signal-Wave Carousel Container */}
                <div
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocusCapture={() => setIsPaused(true)}
                    onBlurCapture={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="relative mx-auto mt-14 max-w-4xl border-2 border-foreground bg-surface p-6 sm:p-12 lg:p-16 focus:outline-hidden focus:ring-2 focus:ring-[var(--primary)] overflow-hidden"
                >
                    {/* Background Oscilloscope Signal Wave */}
                    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-15 overflow-hidden">
                        <svg
                            className={`w-full h-32 text-[var(--primary)] ${!isOff ? 'animate-pulse' : ''}`}
                            viewBox="0 0 1000 120"
                            preserveAspectRatio="none"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M0,60 L200,60 L240,15 L260,105 L280,30 L300,90 L320,60 L500,60 L540,10 L565,110 L585,25 L610,95 L630,60 L800,60 L830,20 L850,100 L870,40 L890,75 L910,60 L1000,60" />
                        </svg>
                    </div>

                    {/* Carousel Top Technical Metadata */}
                    <div className="relative z-10 flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 bg-[var(--primary)]" />
                            <span className="uppercase tracking-widest font-bold text-foreground">
                                TRANSMISSION {currentNum} OF {totalNum}
                            </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-widest uppercase">
                            <span>FREQUENCY: 1420.405 MHZ</span>
                            <span>//</span>
                            <span>VERIFIED</span>
                        </div>
                    </div>

                    {/* Active Slide (with accessible live region) */}
                    <div
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Transmission ${currentIndex + 1} of ${total}`}
                        aria-live={isPaused ? 'polite' : 'off'}
                        className="relative z-10 my-8 sm:my-10 min-h-[160px] flex flex-col justify-center"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.id}
                                initial={{ opacity: 0, x: isOff ? 0 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isOff ? 0 : -20 }}
                                transition={{
                                    duration: isOff ? 0.01 : 0.35,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <span className="font-serif text-5xl sm:text-6xl text-[var(--primary)] select-none leading-none block -mb-4">
                                    “
                                </span>
                                <blockquote className="font-body text-lg sm:text-2xl font-normal leading-relaxed text-foreground italic">
                                    {current.quote}
                                </blockquote>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Author Attribution & Media Bar */}
                    <div className="relative z-10 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {current.photo?.url ? (
                                <img
                                    src={current.photo.url}
                                    alt={current.photo.alt_text || current.author_name}
                                    className="h-12 w-12 border-2 border-foreground object-cover"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center border-2 border-foreground bg-background font-mono text-sm font-bold text-[var(--primary)]">
                                    {current.author_name.slice(0, 2).toUpperCase()}
                                </div>
                            )}

                            <div>
                                <div className="font-display text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
                                    {current.author_name}
                                </div>
                                <div className="font-mono text-xs text-[var(--primary)] uppercase font-semibold mt-0.5">
                                    {current.author_role}
                                    {current.company && ` // ${current.company}`}
                                </div>
                                {current.project && (
                                    <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                                        COMMISSION: {current.project.title}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Controls: Arrows & Dots */}
                        {total > 1 && (
                            <div className="flex items-center gap-4 self-end sm:self-auto">
                                {/* Navigation Dots */}
                                <div
                                    className="flex items-center gap-1.5"
                                    role="tablist"
                                    aria-label="Transmission slides"
                                >
                                    {testimonials.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setCurrentIndex(idx)}
                                            aria-label={`Go to transmission ${idx + 1}`}
                                            aria-current={idx === currentIndex ? 'true' : undefined}
                                            className={`transition-all focus:outline-hidden ${
                                                idx === currentIndex
                                                    ? 'h-2 w-6 bg-[var(--primary)]'
                                                    : 'h-2 w-2 bg-border hover:bg-foreground'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Previous / Next Buttons */}
                                <div className="flex items-center gap-2 border-l border-border pl-4">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        aria-label="Previous transmission"
                                        className="border border-border p-2 bg-background text-foreground hover:bg-foreground hover:text-background transition-colors focus:outline-hidden focus:ring-1 focus:ring-[var(--primary)]"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        aria-label="Next transmission"
                                        className="border border-border p-2 bg-background text-foreground hover:bg-foreground hover:text-background transition-colors focus:outline-hidden focus:ring-1 focus:ring-[var(--primary)]"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
