import React from 'react';
import { HeroData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import CinematicCosmosCanvas from '@/components/Portfolio/Motion/CinematicCosmosCanvas';

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
    isDark = true,
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
            aria-label="Enter the Cosmos Hero"
            className="relative min-h-[96svh] w-full flex flex-col justify-between overflow-hidden px-6 sm:px-10 lg:px-16 pt-8 pb-12 select-none bg-[var(--bg)]"
        >
            {/* 3D Cinematic Cosmos Scene: Colossal Planetary Horizon & Multi-Layer Starfield */}
            <CinematicCosmosCanvas
                isDark={isDark}
                isReducedMotion={isOff}
            />

            {/* Subtle Ethereal Forest-Green & Orange Volumetric Glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 right-1/6 w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full bg-[var(--forest)] opacity-25 blur-[160px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1/4 left-1/8 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--primary)] opacity-10 blur-[130px]"
            />

            {/* Top Header Bar: Identity & Real-Time Availability */}
            <div className="relative z-20 flex items-center justify-between border-b border-border/40 pb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    </span>
                    <span className="font-bold text-foreground tracking-wider">
                        {hero?.name || 'MONAYEM AZAM'}
                    </span>
                    <span className="text-border">/</span>
                    <span className="text-foreground/75">
                        {hero?.eyebrow || 'FULL-STACK WEB DEVELOPER'}
                    </span>
                </div>

                <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                    <span className="text-foreground font-semibold tracking-wider text-[11px]">
                        AVAILABLE FOR PROJECTS
                    </span>
                </div>
            </div>

            {/* MAIN CINEMATIC COMPOSITION: MONUMENTAL TYPOGRAPHY OVER PLANETARY HORIZON */}
            <div className="relative z-10 my-auto py-10 sm:py-14 mx-auto max-w-[1440px] w-full">
                <div className="flex flex-col justify-center max-w-4xl">
                    
                    {/* Role Eyebrow */}
                    <div className="flex items-center gap-3 font-mono text-xs text-[var(--primary)] uppercase tracking-widest mb-4 sm:mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                        <span>{roles}</span>
                    </div>

                    {/* Monumental Headline */}
                    <h1 className="font-display font-black leading-[0.85] tracking-tighter text-foreground uppercase text-[clamp(3.8rem,9.5vw,10.5rem)]">
                        <span className="block drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                            I MAKE
                        </span>
                        <span className="block text-[var(--primary)] drop-shadow-[0_0_40px_rgba(241,90,36,0.35)]">
                            THE DIGITAL
                        </span>
                        <span className="block drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                            FEEL REAL.
                        </span>
                    </h1>

                    {/* Supporting Narrative & Action Deck */}
                    <div className="mt-8 sm:mt-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-3xl">
                        <p className="max-w-xl font-body text-base sm:text-xl text-foreground/85 leading-relaxed font-normal">
                            {settings?.site_tagline ||
                                "I'm Monayem Azam — a Full-Stack Web Developer who loves turning ideas into digital experiences."}
                        </p>

                        {/* CTA Controls */}
                        <div className="flex flex-wrap items-center gap-4 shrink-0">
                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.primary_button_url || '#projects').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 rounded-full bg-[var(--primary)] px-8 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-[0_0_25px_rgba(241,90,36,0.5)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                <span>{hero?.primary_button_label || 'View Projects'}</span>
                                <span className="transition-transform group-hover:translate-y-0.5 font-sans">
                                    ↓
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.secondary_button_url || '#contact').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 rounded-full border border-border/80 bg-surface/70 backdrop-blur-md px-8 py-4 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                <span>{hero?.secondary_button_label || 'Contact Me'}</span>
                                <span className="transition-transform group-hover:translate-x-0.5 font-sans">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Horizon Strip: Core Engineering Stack & Navigation Prompt */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-6 border-t border-border/40 pt-4 font-mono text-xs text-muted-foreground uppercase">
                <div className="flex items-center gap-4 sm:gap-6">
                    <span className="flex items-center gap-2 text-foreground font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        CORE STACK
                    </span>
                    <span>LARAVEL</span>
                    <span className="text-border">·</span>
                    <span>REACT</span>
                    <span className="text-border">·</span>
                    <span>VUE.JS</span>
                    <span className="text-border">·</span>
                    <span>TYPESCRIPT</span>
                    <span className="text-border">·</span>
                    <span>MYSQL</span>
                </div>

                <button
                    type="button"
                    onClick={() => scrollTo('about')}
                    className="flex items-center gap-2 text-[var(--primary)] font-bold hover:underline transition-all cursor-pointer"
                >
                    <span>ABOUT MONAYEM</span>
                    <span className="font-sans">↓</span>
                </button>
            </div>
        </section>
    );
}
