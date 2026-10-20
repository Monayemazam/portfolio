import React, { useEffect, useRef, useState } from 'react';
import { HeroData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import CosmicCanvasScene from '@/components/Portfolio/Motion/CosmicCanvasScene';

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
    const heroRef = useRef<HTMLElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Subtly track mouse pointer for organic layered depth parallax
    useEffect(() => {
        if (isOff) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;
            setMousePos({ x: normX, y: normY });
        };

        const heroEl = heroRef.current;
        if (heroEl) {
            heroEl.addEventListener('mousemove', handleMouseMove, { passive: true });
        }
        return () => {
            if (heroEl) {
                heroEl.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [isOff]);

    const photoUrl = settings?.photo_media?.webp_url || settings?.photo_media?.url;
    const photoAlt = settings?.photo_media?.alt_text || hero?.name || 'Monayem Azam';

    const roles = hero?.roles && hero.roles.length > 0
        ? hero.roles.map((r) => r.text).join(' · ')
        : 'Full-Stack Software Engineer · Creative Technologist';

    // Parallax transformations
    const textParallax = !isOff
        ? {
              transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -10}px, 0)`,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }
        : {};

    const portraitParallax = !isOff
        ? {
              transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 15}px, 0) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`,
              transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
              perspective: 1200,
          }
        : {};

    const glowParallax = !isOff
        ? {
              transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 25}px, 0)`,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }
        : {};

    return (
        <section
            ref={heroRef}
            id={section.key}
            aria-label="Cosmic Canvas Hero"
            className="relative min-h-[96svh] w-full flex flex-col justify-between overflow-hidden px-6 sm:px-10 lg:px-16 pt-8 pb-12 select-none bg-[var(--bg)]"
        >
            {/* Interactive Cosmic Canvas: Dynamic Particles & Deep Nebula Atmosphere */}
            <CosmicCanvasScene
                isDark={isDark}
                isReducedMotion={isOff}
            />

            {/* Deep Cosmic Forest-Green & Orange Volumetric Lighting */}
            <div
                aria-hidden="true"
                style={glowParallax}
                className="pointer-events-none absolute top-1/6 right-1/4 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--forest)] opacity-30 blur-[150px]"
            />
            <div
                aria-hidden="true"
                style={glowParallax}
                className="pointer-events-none absolute bottom-1/5 left-1/6 w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] rounded-full bg-[var(--primary)] opacity-12 blur-[130px]"
            />

            {/* Top Waypoint Strip: Identity & Real-Time Availability */}
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
                    <span className="hidden sm:inline text-foreground/70">
                        {hero?.eyebrow || 'COSMIC CANVAS // 2026'}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                    <span className="text-foreground font-semibold tracking-wider text-[11px]">
                        AVAILABLE FOR ARCHITECTURAL COMMISSIONS
                    </span>
                </div>
            </div>

            {/* UNIFIED COSMIC CANVAS ART INSTALLATION */}
            <div className="relative z-10 my-auto py-8 sm:py-12 mx-auto max-w-[1440px] w-full">
                <div className="relative flex flex-col justify-center min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]">

                    {/* BACKGROUND PORTRAIT MONOLITH (Layered as an architectural portal) */}
                    {photoUrl && (
                        <div
                            style={portraitParallax}
                            className="pointer-events-none absolute right-4 sm:right-12 lg:right-24 top-1/2 -translate-y-1/2 z-0 w-[55%] sm:w-[45%] md:w-[38%] max-w-[420px] aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.65)] border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xs"
                        >
                            {/* Ambient Rim Lighting */}
                            <div
                                aria-hidden="true"
                                className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-[var(--primary)]/50 via-transparent to-[var(--forest)]/60 opacity-80"
                            />

                            {/* Monayem's Authentic Portrait Image */}
                            <img
                                src={photoUrl}
                                alt={photoAlt}
                                className="h-full w-full object-cover object-center filter contrast-105 brightness-95 scale-[1.02] transition-transform duration-700"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 60%, rgba(0,0,0,0.3) 85%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, rgba(0,0,0,0.3) 85%, transparent 100%)',
                                }}
                            />

                            {/* Base Gradient Fade into Space Floor */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent"
                            />

                            {/* Subtle Architectural Pill Label */}
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 backdrop-blur-md px-3 py-1 font-mono text-[10px] tracking-wider text-white uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                                <span>MONAYEM AZAM // ARCHITECT</span>
                            </div>
                        </div>
                    )}

                    {/* FOREGROUND MONUMENTAL TYPOGRAPHY */}
                    <div
                        style={textParallax}
                        className="relative z-10 flex flex-col justify-center space-y-2 sm:space-y-4 max-w-full"
                    >
                        {/* Eyebrow Role Chip */}
                        <div className="flex items-center gap-3 font-mono text-xs text-[var(--primary)] uppercase tracking-widest mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_6px_var(--primary)]" />
                            <span>{roles}</span>
                        </div>

                        {/* Line 1: I MAKE */}
                        <h1 className="font-display font-black leading-[0.84] tracking-tighter text-foreground uppercase text-[clamp(3.8rem,9.5vw,10.5rem)]">
                            <span className="block drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                                I MAKE
                            </span>
                            {/* Line 2: THE DIGITAL */}
                            <span className="block text-[var(--primary)] drop-shadow-[0_0_40px_rgba(241,90,36,0.3)]">
                                THE DIGITAL
                            </span>
                            {/* Line 3: FEEL REAL. */}
                            <span className="block drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                                FEEL REAL.
                            </span>
                        </h1>
                    </div>

                    {/* ACTION DECK & NARRATIVE (Cleanly positioned below headline with generous spacing) */}
                    <div className="relative z-20 mt-8 sm:mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-4xl">
                        {/* Narrative description */}
                        <p className="max-w-xl font-body text-base sm:text-lg text-foreground/85 leading-relaxed">
                            {settings?.site_tagline ||
                                'Architecting high-performance distributed web systems, scalable backend architectures, and immersive interactive digital experiences.'}
                        </p>

                        {/* Main CTA Controls */}
                        <div className="flex flex-wrap items-center gap-4 shrink-0">
                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.primary_button_url || '#projects').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group flex items-center gap-3 rounded-full bg-[var(--primary)] px-7 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-[0_0_25px_rgba(241,90,36,0.45)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                <span>{hero?.primary_button_label || 'EXPLORE UNIVERSE'}</span>
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
                                className="group flex items-center gap-3 rounded-full border border-border/80 bg-surface/70 backdrop-blur-md px-7 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                <span>{hero?.secondary_button_label || 'INITIATE CONTACT'}</span>
                                <span className="transition-transform group-hover:translate-x-0.5 font-sans">
                                    →
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Horizon Strip: Core Engineering Capabilities & Nav Prompt */}
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
                    <span>TYPESCRIPT</span>
                    <span className="text-border">·</span>
                    <span>THREE.JS</span>
                    <span className="text-border">·</span>
                    <span>MYSQL</span>
                </div>

                <button
                    type="button"
                    onClick={() => scrollTo('about')}
                    className="flex items-center gap-2 text-[var(--primary)] font-bold hover:underline transition-all cursor-pointer"
                >
                    <span>EXPLORE DOSSIER</span>
                    <span className="font-sans">↓</span>
                </button>
            </div>
        </section>
    );
}
