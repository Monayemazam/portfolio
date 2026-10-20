import React, { useEffect, useRef, useState } from 'react';
import { HeroData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import TypographicMachine from '@/components/Portfolio/Motion/TypographicMachine';

interface HeroSectionProps {
    section: PortfolioSection;
    hero: HeroData | null;
    settings: PortfolioSettings;
    isFull?: boolean;
    isOff?: boolean;
    isDark?: boolean;
}

export default function HeroSection({
    section,
    hero,
    settings,
    isOff = false,
    isDark = false,
}: HeroSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isOff) return;
        if (
            typeof window !== 'undefined' &&
            window.matchMedia('(pointer: coarse)').matches
        ) {
            return;
        }

        let frameId: number;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            targetX = (e.clientX / innerWidth - 0.5) * 20;
            targetY = (e.clientY / innerHeight - 0.5) * 20;
        };

        const loop = () => {
            currentX += (targetX - currentX) * 0.06;
            currentY += (targetY - currentY) * 0.06;
            setMouseOffset({ x: currentX, y: currentY });
            frameId = requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        loop();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, [isOff]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            ref={containerRef}
            id={section.key}
            aria-label="Monayem OS Hero Experience"
            className="relative min-h-[90svh] lg:min-h-[95svh] w-full flex flex-col justify-between overflow-hidden border-b-2 border-foreground bg-[var(--bg)] px-6 sm:px-8 xl:px-12 pt-8 sm:pt-10 pb-12 select-none"
        >
            {/* Top Calibration Header & Telemetry Band */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-wider border-b border-border pb-4 uppercase">
                <div className="flex items-center gap-3">
                    <span className="stamp-orange text-[10px] tracking-widest">
                        SYS.01 // LAUNCH
                    </span>
                    <span className="font-bold text-foreground">
                        {hero?.name || 'MONAYEM AZAM'}
                    </span>
                    <span className="text-border">/</span>
                    <span className="hidden sm:inline text-muted-foreground">
                        {hero?.eyebrow || 'EXPERIMENTAL DIGITAL ENVIRONMENT'}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="os-beacon" />
                    <span className="font-bold text-foreground tracking-widest text-[11px]">
                        STATUS: ACTIVE FOR COMMISSIONS
                    </span>
                    <span className="text-border">|</span>
                    <span className="hidden md:inline text-muted-foreground text-[10px]">
                        23°48'N · 90°24'E
                    </span>
                </div>
            </div>

            {/* Kinetic Typographic Machine Stage */}
            <div className="relative z-10 my-auto py-8 sm:py-12 mx-auto max-w-[1440px] w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    {/* Left Column: Architectural Headline & Kinetic Typography */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        {/* Technical Registration Breadcrumb */}
                        <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 font-mono text-xs font-bold uppercase">
                            <span className="border border-border bg-surface px-2.5 py-1 text-foreground">
                                [OPERATING_TITLE: FULL-STACK ARCHITECT]
                            </span>
                            <span className="text-[var(--primary)]">
                                // {hero?.roles && hero.roles.length > 0
                                    ? hero.roles.map((r) => r.text).join(' · ')
                                    : 'LARAVEL & REACT · KINETIC TYPOGRAPHY · INTERACTIVE WORLDS'}
                            </span>
                        </div>

                        {/* Kinetic Monumental Headline */}
                        <div
                            className="relative"
                            style={{
                                transform: isOff
                                    ? 'none'
                                    : `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)`,
                            }}
                        >
                            <h1 className="font-display text-[clamp(3.6rem,7.5vw,7.2rem)] font-black leading-[0.86] tracking-tighter text-foreground uppercase">
                                <span className="block hover:translate-x-1 transition-transform">
                                    I MAKE
                                </span>
                                <span className="relative inline-block text-[var(--primary)] hover:translate-x-2 transition-transform">
                                    THE DIGITAL
                                    <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[var(--primary)]/20" />
                                </span>
                                <span className="block hover:translate-x-1 transition-transform">
                                    FEEL REAL.
                                </span>
                            </h1>

                            {/* Background Cropped Architectural Ghost Typography */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -bottom-8 right-0 font-display text-[90px] sm:text-[140px] font-black text-foreground/[0.04] uppercase leading-none select-none"
                            >
                                DIGITAL
                            </div>
                        </div>

                        {/* Narrative Position Statement */}
                        <div className="mt-6 sm:mt-8 max-w-xl border-l-2 border-[var(--primary)] pl-4">
                            <p className="font-body text-base sm:text-lg font-normal leading-relaxed text-foreground/85">
                                {settings?.site_tagline ||
                                    'Bespoke digital environments, high-performance web applications, and experimental interactive design engineered with rigorous architectural precision.'}
                            </p>
                        </div>

                        {/* Interactive Action Triggers */}
                        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.primary_button_url || '#projects').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 bg-[var(--primary)] px-7 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 hover:-translate-y-0.5 active:translate-y-0 shadow-xs"
                            >
                                <span>{hero?.primary_button_label || 'EXPLORE EXHIBITION'}</span>
                                <span className="transition-transform group-hover:translate-y-1 font-sans">
                                    ↓
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.secondary_button_url || '#contact').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 border-2 border-foreground bg-transparent px-7 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                            >
                                <span>{hero?.secondary_button_label || 'INITIATE DIALOGUE'}</span>
                                <span className="transition-transform group-hover:translate-x-1 font-sans">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Signature Kinetic Typographic Machine */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative w-full">
                        <TypographicMachine
                            isDark={isDark}
                            isReducedMotion={isOff}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Hardware & Architecture Footnotes */}
            <div className="relative z-20 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-4 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <span className="font-bold text-foreground">OPERATIONAL STACK:</span>
                    <span>LARAVEL 12</span>
                    <span className="text-border">/</span>
                    <span>REACT 19</span>
                    <span className="text-border">/</span>
                    <span>TYPESCRIPT</span>
                    <span className="text-border">/</span>
                    <span>MYSQL</span>
                    <span className="text-border">/</span>
                    <span>INERTIA.JS</span>
                </div>

                <div className="flex items-center gap-4 text-foreground">
                    <button
                        type="button"
                        onClick={() => scrollTo('about')}
                        className="flex items-center gap-2 text-[var(--primary)] font-bold hover:underline"
                    >
                        <span>[REVEAL ARCHIVAL PROFILE]</span>
                        <span className="font-sans">↓</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
