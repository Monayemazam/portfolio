import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PortfolioSection, ExperienceItem } from '@/types/portfolio';

interface ExperienceSectionProps {
    section: PortfolioSection;
    experiences: ExperienceItem[];
    isOff?: boolean;
}

interface MilestoneCardProps {
    exp: ExperienceItem;
    idx: number;
    isOff?: boolean;
}

function MilestoneItem({ exp, idx, isOff }: MilestoneCardProps) {
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

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
            }).toUpperCase();
        } catch {
            return dateStr;
        }
    };

    const isEven = idx % 2 === 0;
    const startStr = formatDate(exp.start_date);
    const endStr = exp.is_current ? 'PRESENT' : formatDate(exp.end_date);
    const stationNum = (idx + 1).toString().padStart(2, '0');

    return (
        <div
            ref={cardRef}
            className={`relative flex items-center w-full transition-all duration-500 ${
                inView || isOff ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
            {/* Center Node Marker (Desktop) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 h-7 w-7 items-center justify-center bg-background border-2 border-foreground transition-colors group-hover:border-[var(--primary)]">
                <div
                    className={`h-2.5 w-2.5 transition-colors ${
                        exp.is_current ? 'bg-[var(--accent)] ring-2 ring-[var(--primary)]' : 'bg-[var(--primary)]'
                    }`}
                />
            </div>

            {/* Left Node Marker (Mobile) */}
            <div className="flex md:hidden absolute left-5 -translate-x-1/2 z-10 h-5 w-5 items-center justify-center bg-background border-2 border-foreground">
                <div
                    className={`h-1.5 w-1.5 ${
                        exp.is_current ? 'bg-[var(--accent)] ring-1 ring-[var(--primary)]' : 'bg-[var(--primary)]'
                    }`}
                />
            </div>

            {/* Milestone Card */}
            <div
                className={`w-full pl-12 md:pl-0 ${
                    isEven
                        ? 'md:w-1/2 md:pr-12 md:text-right'
                        : 'md:w-1/2 md:pl-12 md:ml-auto md:text-left'
                }`}
            >
                <div className="border-2 border-foreground bg-surface p-6 sm:p-8 transition-colors hover:border-[var(--primary)]">
                    {/* Top Metadata Strip */}
                    <div
                        className={`flex items-center gap-3 border-b border-border pb-3 font-mono text-xs ${
                            isEven ? 'md:justify-end' : 'md:justify-start'
                        }`}
                    >
                        <span className="font-bold text-[var(--primary)]">
                            STATION {stationNum} //
                        </span>
                        <span className="text-foreground tracking-wider font-semibold">
                            {startStr} — {endStr}
                        </span>
                        {Boolean(exp.is_current) && (
                            <span className="bg-[var(--accent)] text-black px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider">
                                PRESENT
                            </span>
                        )}
                    </div>

                    {/* Role and Company */}
                    <div className="mt-4">
                        <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase">
                            {exp.role}
                        </h3>
                        <div className="mt-1 font-mono text-xs tracking-wider text-[var(--primary)] uppercase font-semibold">
                            @ {exp.company}
                        </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                        <p className="mt-4 font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                            {exp.description}
                        </p>
                    )}

                    {/* Flight Log Coordinates Stamp */}
                    <div
                        className={`mt-6 pt-3 border-t border-border flex items-center gap-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest ${
                            isEven ? 'md:justify-end' : 'md:justify-start'
                        }`}
                    >
                        <span>MISSION STATUS: VERIFIED</span>
                        <span>[LOGGED]</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ExperienceSection({
    section,
    experiences,
    isOff,
}: ExperienceSectionProps) {
    if (!experiences || experiences.length === 0) return null;

    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll-driven comet position down the timeline
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 70%', 'end 70%'],
    });

    const cometTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section
            id="experience"
            aria-label="Career Flight Log"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 05
                        </span>
                        <span>FLIGHT LOG // CAREER MILESTONES & STATIONS</span>
                    </div>
                    <span>TOTAL STATIONS: [{experiences.length.toString().padStart(2, '0')}]</span>
                </div>

                {/* Section Title */}
                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // VERIFIED FLIGHT LOG
                        </span>
                        <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                            {section?.title || 'CHRONOLOGY OF PRACTICE.'}
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        A continuous flight log of engineering roles, architectural appointments,
                        and production missions across independent clients and corporate ecosystems.
                    </p>
                </div>

                {/* Vertical Flight Log Timeline */}
                <div ref={containerRef} className="relative mt-16 sm:mt-24">
                    {/* Desktop Center Track Line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-border" />

                    {/* Mobile Left Track Line */}
                    <div className="block md:hidden absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

                    {/* Scrubbed Comet Traveling Down Timeline on Scroll */}
                    {!isOff && (
                        <>
                            {/* Desktop Center Comet */}
                            <motion.div
                                style={{ top: cometTop }}
                                className="hidden md:flex absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center pointer-events-none"
                            >
                                <div className="h-16 w-0.5 bg-gradient-to-t from-[var(--primary)] to-transparent" />
                                <div className="h-4 w-4 rounded-none bg-[var(--primary)] shadow-[0_0_14px_var(--primary)] ring-4 ring-[var(--primary)]/30 transform rotate-45" />
                            </motion.div>

                            {/* Mobile Left Comet */}
                            <motion.div
                                style={{ top: cometTop }}
                                className="flex md:hidden absolute left-5 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center pointer-events-none"
                            >
                                <div className="h-12 w-0.5 bg-gradient-to-t from-[var(--primary)] to-transparent" />
                                <div className="h-3 w-3 rounded-none bg-[var(--primary)] shadow-[0_0_10px_var(--primary)] ring-2 ring-[var(--primary)]/30 transform rotate-45" />
                            </motion.div>
                        </>
                    )}

                    {/* Milestone Nodes Alternating on Desktop, One Side on Mobile */}
                    <div className="flex flex-col gap-12 sm:gap-16">
                        {experiences.map((exp, idx) => (
                            <MilestoneItem
                                key={exp.id}
                                exp={exp}
                                idx={idx}
                                isOff={isOff}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
