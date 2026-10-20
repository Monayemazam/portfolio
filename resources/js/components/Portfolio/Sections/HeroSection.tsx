import React from 'react';
import { HeroData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import CelestialPlanet from '@/components/Portfolio/Motion/CelestialPlanet';

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
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const roles = hero?.roles && hero.roles.length > 0
        ? hero.roles.map((r) => r.text).join(' · ')
        : 'Full-Stack Software Engineer · Creative Technologist';

    return (
        <section
            id={section.key}
            aria-label="Monayem Azam Celestial Hero"
            className="relative min-h-[92svh] w-full flex flex-col justify-between overflow-hidden px-6 sm:px-10 lg:px-16 pt-12 pb-16 select-none"
        >
            {/* Soft Ambient Nebula Glow in Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 right-0 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--forest)] opacity-20 blur-[120px]"
            />

            {/* Top Atmospheric Waypoint Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-border/40 pb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)] inline-block" />
                    <span className="font-bold text-foreground">
                        {hero?.name || 'MONAYEM AZAM'}
                    </span>
                    <span className="text-border">/</span>
                    <span className="hidden sm:inline">
                        {hero?.eyebrow || 'DEEP SPACE EXPLORATION'}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse inline-block" />
                    <span className="text-foreground font-semibold tracking-wider text-[11px]">
                        AVAILABLE FOR SELECT MISSIONS
                    </span>
                </div>
            </div>

            {/* Main Celestial Composition Grid */}
            <div className="relative z-10 my-auto py-10 lg:py-16 mx-auto max-w-[1440px] w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Monumental Headline & Narrative */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        {/* Role Breadcrumb */}
                        <div className="mb-6 flex items-center gap-2 font-mono text-xs text-[var(--primary)] uppercase tracking-widest">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                            <span>{roles}</span>
                        </div>

                        {/* Oversized Headline */}
                        <h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.88] tracking-tighter text-foreground uppercase">
                            <span className="block">I MAKE</span>
                            <span className="relative inline-block text-[var(--primary)]">
                                THE DIGITAL
                                <span
                                    aria-hidden="true"
                                    className="absolute -bottom-1 left-0 right-0 h-2 bg-[var(--primary)]/20 blur-xs"
                                />
                            </span>
                            <span className="block">FEEL REAL.</span>
                        </h1>

                        {/* Narrative Introduction */}
                        <div className="mt-8 max-w-xl">
                            <p className="font-body text-base sm:text-xl font-normal leading-relaxed text-foreground/85">
                                {settings?.site_tagline ||
                                    'Architecting high-performance web applications, resilient distributed systems, and atmospheric interactive digital worlds with disciplined craft.'}
                            </p>
                        </div>

                        {/* Atmospheric Action Buttons */}
                        <div className="mt-10 flex flex-wrap items-center gap-5">
                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.primary_button_url || '#projects').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 rounded-full bg-[var(--primary)] px-8 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-[0_0_25px_rgba(241,90,36,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>{hero?.primary_button_label || 'EXPLORE UNIVERSE'}</span>
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
                                className="group flex items-center gap-3 rounded-full border border-border bg-surface/60 backdrop-blur-md px-8 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:border-[var(--primary)] hover:bg-surface hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>{hero?.secondary_button_label || 'INITIATE CONTACT'}</span>
                                <span className="transition-transform group-hover:translate-x-1 font-sans">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Custom Planetary Artwork */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative w-full">
                        <CelestialPlanet
                            isDark={isDark}
                            isReducedMotion={isOff}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Telemetry & Navigation Prompt */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 border-t border-border/40 pt-4 font-mono text-xs text-muted-foreground uppercase">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        CORE STACK
                    </span>
                    <span>LARAVEL</span>
                    <span className="text-border">·</span>
                    <span>REACT</span>
                    <span className="text-border">·</span>
                    <span>TYPESCRIPT</span>
                    <span className="text-border">·</span>
                    <span>THREE.JS</span>
                    <span className="text-border">·</span>
                    <span>MYSQL</span>
                </div>

                <button
                    type="button"
                    onClick={() => scrollTo('about')}
                    className="flex items-center gap-2 text-[var(--primary)] font-bold hover:underline transition-all"
                >
                    <span>EXPLORE DOSSIER</span>
                    <span className="font-sans">↓</span>
                </button>
            </div>
        </section>
    );
}
