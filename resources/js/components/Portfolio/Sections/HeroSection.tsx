import React from 'react';
import { HeroData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import HeroTypographicSculpture from '@/components/Portfolio/Motion/HeroTypographicSculpture';

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
}: HeroSectionProps) {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id={section.key}
            aria-label="Editorial Introduction"
            className="relative min-h-[88svh] lg:min-h-[92svh] w-full flex flex-col justify-between overflow-hidden border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 pt-8 sm:pt-10 pb-12"
        >
            {/* Top Eyebrow & Archival Telemetry Strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-wider text-muted-foreground uppercase border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <span className="bg-[var(--primary)] px-2.5 py-0.5 text-white font-bold text-[10px] tracking-widest">
                        VOL. 26
                    </span>
                    <span className="font-semibold text-foreground/80">
                        {hero?.eyebrow || 'MISSION 01 / LAUNCH'}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-foreground font-semibold">
                    <span className="h-2 w-2 bg-[var(--accent)] border border-foreground inline-block" />
                    <span className="tracking-widest text-[11px]">STATUS: AVAILABLE FOR CONTRACTS</span>
                </div>
            </div>

            {/* Asymmetric Hero Typographic Canvas */}
            <div className="relative z-10 my-auto py-8 sm:py-10 lg:py-12 mx-auto max-w-[1440px] w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
                    {/* Left Column: Dominant Editorial Headline & Direct Actions */}
                    <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
                        {/* Practice & Specialization Annotation */}
                        <div className="mb-5 sm:mb-6 flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-[var(--primary)] uppercase">
                            <span className="bg-surface border border-border px-2.5 py-1 text-foreground">
                                [PRACTICE: {(hero?.name || 'MONAYEM AZAM').toUpperCase()}]
                            </span>
                            <span className="text-muted-foreground font-normal">
                                // {hero?.roles && hero.roles.length > 0
                                    ? hero.roles.map((r) => r.text).join(' · ')
                                    : 'FULL-STACK WEB DEVELOPER · LARAVEL AND REACT ENGINEER · UI/UX DESIGNER · ECOMMERCE BUILDER'}
                            </span>
                        </div>

                        {/* Oversized Headline with Deliberate Editorial Line Breaks */}
                        <h1 className="font-display text-[clamp(3.4rem,7.5vw,6.8rem)] font-black leading-[0.88] tracking-tighter text-foreground uppercase">
                            <span>I MAKE</span>
                            <br />
                            <span className="text-[var(--primary)] relative inline-block">
                                THE DIGITAL
                                <span className="absolute -bottom-1 left-0 right-0 h-1.5 sm:h-2 bg-[var(--primary)]/30" />
                            </span>
                            <br />
                            <span>FEEL REAL.</span>
                        </h1>

                        {/* Narrative Description & Positioning from Settings */}
                        <div className="mt-6 sm:mt-8 max-w-xl">
                            <p className="font-body text-base sm:text-xl font-normal leading-relaxed text-foreground/85">
                                {settings?.site_tagline ||
                                    'Building fast, beautiful web apps engineered for architectural integrity, clean performance, and expressive craft.'}
                            </p>
                        </div>

                        {/* Editorial Actions Driven by Database Settings */}
                        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.primary_button_url || '#projects').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 bg-[var(--primary)] px-6 sm:px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                                data-field-tag="EXHIBIT"
                            >
                                <span>{hero?.primary_button_label || 'VIEW PROJECTS'}</span>
                                <span className="transition-transform group-hover:translate-y-0.5 font-sans">↓</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.secondary_button_url || '#contact').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 border-2 border-foreground bg-transparent px-6 sm:px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                                data-field-tag="DIALOGUE"
                            >
                                <span>{hero?.secondary_button_label || 'HIRE ME'}</span>
                                <span className="transition-transform group-hover:translate-x-1 font-sans">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Architectural Typographic Sculpture Poster */}
                    <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
                        <HeroTypographicSculpture isOff={isOff} />
                    </div>
                </div>
            </div>

            {/* Bottom Archival Metadata & Technical Stacks */}
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-6 border-t border-border pt-4 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <span className="text-foreground font-bold">CORE STACK:</span>
                    <span>LARAVEL 12</span>
                    <span className="text-border">/</span>
                    <span>REACT 19</span>
                    <span className="text-border">/</span>
                    <span>TYPESCRIPT</span>
                    <span className="text-border">/</span>
                    <span>THREE.JS</span>
                    <span className="text-border">/</span>
                    <span>MYSQL</span>
                </div>

                <div className="flex items-center gap-4 text-foreground">
                    <span>COORDINATES: 23°48'N 90°24'E</span>
                    <span className="text-border">|</span>
                    <button
                        type="button"
                        onClick={() => scrollTo('about')}
                        className="text-[var(--primary)] font-bold hover:underline"
                    >
                        [SCROLL TO PROFILE ↓]
                    </button>
                </div>
            </div>
        </section>
    );
}
