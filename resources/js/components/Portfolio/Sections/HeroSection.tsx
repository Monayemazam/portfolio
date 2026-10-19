import React from 'react';
import { HeroData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import HeroApparatus from '@/components/Portfolio/Motion/HeroApparatus';

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
            className="relative min-h-[90svh] lg:min-h-[95svh] w-full flex flex-col justify-between overflow-hidden border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 pt-12 pb-16"
        >
            {/* Interactive Editorial Drafting Apparatus */}
            <HeroApparatus isOff={isOff} />

            {/* Top Eyebrow & Archival Telemetry Strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-wider text-muted-foreground uppercase border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <span className="bg-[var(--primary)] px-2 py-0.5 text-white font-bold text-[10px]">
                        VOL. 26
                    </span>
                    <span>
                        {hero?.eyebrow || 'DISPATCH 001 // CREATIVE ENGINEERING & SYSTEMS'}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-foreground font-semibold">
                    <span className="h-2 w-2 bg-[var(--accent)] border border-foreground inline-block" />
                    <span>STATUS: AVAILABLE FOR CONTRACTS</span>
                </div>
            </div>

            {/* Asymmetric Hero Typographic Canvas */}
            <div className="relative z-10 my-auto py-12 lg:py-16 max-w-[1440px] w-full">
                <div className="max-w-4xl">
                    {/* Database Roles & Specialization Annotation */}
                    {hero?.roles && hero.roles.length > 0 && (
                        <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-[var(--primary)] uppercase">
                            <span className="bg-surface border border-border px-2 py-0.5">
                                [PRACTICE: {hero.name.toUpperCase()}]
                            </span>
                            <span className="text-muted-foreground">
                                // {hero.roles.map((r) => r.text).join(' · ')}
                            </span>
                        </div>
                    )}

                    {/* Oversized Headline with Deliberate Editorial Line Breaks */}
                    <h1 className="font-display text-[clamp(3.5rem,8.5vw,7.5rem)] font-black leading-[0.88] tracking-tighter text-foreground uppercase">
                        <span>I MAKE</span>
                        <br />
                        <span className="text-[var(--primary)] relative inline-block">
                            THE DIGITAL
                            <span className="absolute -bottom-1 left-0 right-0 h-1.5 bg-[var(--primary)]/30" />
                        </span>
                        <br />
                        <span>FEEL REAL.</span>
                    </h1>

                    {/* Narrative Description & Positioning from Settings */}
                    <div className="mt-8 sm:mt-10 max-w-2xl">
                        <p className="font-body text-lg sm:text-2xl font-normal leading-relaxed text-foreground/90">
                            {settings?.site_tagline ||
                                'Independent full-stack software engineer and digital creator crafting high-integrity web platforms, expressive interfaces, and interactive systems.'}
                        </p>
                    </div>

                    {/* Editorial Actions Driven by Database Settings */}
                    <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
                        <button
                            type="button"
                            onClick={() => {
                                const target = (hero?.primary_button_url || '#projects').replace('#', '');
                                scrollTo(target);
                            }}
                            className="group flex items-center gap-3 bg-[var(--primary)] px-6 sm:px-8 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                            data-field-tag="EXHIBIT"
                        >
                            <span>{hero?.primary_button_label || 'EXPLORE EXHIBITION'}</span>
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
                            <span>{hero?.secondary_button_label || 'INITIATE DIALOGUE'}</span>
                            <span className="transition-transform group-hover:translate-x-1 font-sans">→</span>
                        </button>
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
