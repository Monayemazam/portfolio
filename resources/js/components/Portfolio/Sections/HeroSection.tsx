import React from 'react';
import { motion } from 'framer-motion';
import { HeroData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import CinematicCosmosCanvas from '@/components/Portfolio/Motion/CinematicCosmosCanvas';
import { ArrowRight } from '../Shared/Icons';

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

    const roles =
        hero?.roles && hero.roles.length > 0
            ? hero.roles.map((r) => r.text).join(' · ')
            : 'Full-Stack Web Developer · Creative Technologist';

    return (
        <section
            id={section.key}
            aria-label="Hero — Cinematic Deep Space"
            className="relative min-h-[96svh] w-full flex flex-col justify-between overflow-hidden px-6 sm:px-10 lg:px-16 pt-8 pb-12 select-none bg-[var(--bg)]"
        >
            {/* Multi-Layer Celestial Canvas Background */}
            <CinematicCosmosCanvas
                isDark={isDark}
                isReducedMotion={isOff}
            />

            {/* Atmospheric Volumetric Lighting Glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 -right-16 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-30 blur-[150px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1/4 -left-16 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--primary)] opacity-12 blur-[130px]"
            />

            {/* Top Telemetry Strip: Identity & Live Status */}
            <div className="relative z-20 flex items-center justify-between border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    </span>
                    <span className="font-bold text-[var(--text)] tracking-wider">
                        {hero?.name || 'MONAYEM AZAM'}
                    </span>
                    <span className="text-[var(--surface-border)]">/</span>
                    <span className="text-[var(--text-muted)] hidden sm:inline">
                        {hero?.eyebrow || 'FULL-STACK WEB DEVELOPER'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                    <span className="font-semibold tracking-wider text-[11px] text-[var(--text)]">
                        AVAILABLE FOR PROJECTS
                    </span>
                </div>
            </div>

            {/* Main Asymmetrical Hero Composition */}
            <div className="relative z-10 my-auto py-10 sm:py-14 mx-auto max-w-[1440px] w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Monumental Headline & Narrative (Col 7) */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        {/* Kicker */}
                        <motion.div
                            initial={isOff ? false : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-2.5 font-mono text-xs text-[var(--primary)] uppercase tracking-widest mb-4 sm:mb-6 font-semibold"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                            <span>{roles}</span>
                        </motion.div>

                        {/* Monumental Headline */}
                        <motion.h1
                            initial={isOff ? false : { opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: isOff ? 0 : 0.08 }}
                            className="font-display font-black leading-[0.88] tracking-tighter uppercase text-[clamp(3.4rem,7.8vw,8.5rem)] text-[var(--text)]"
                        >
                            <span className="block drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                                I MAKE
                            </span>
                            <span className="block text-[var(--primary)] drop-shadow-[0_0_35px_rgba(241,90,36,0.3)]">
                                THE DIGITAL
                            </span>
                            <span className="block drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                                FEEL REAL.
                            </span>
                        </motion.h1>

                        {/* Narrative & Concise Tagline */}
                        <motion.p
                            initial={isOff ? false : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: isOff ? 0 : 0.16 }}
                            className="mt-6 sm:mt-8 max-w-xl font-body text-base sm:text-lg text-[var(--text-muted)] leading-relaxed font-normal"
                        >
                            {settings?.site_tagline ||
                                "Full-stack web developer passionate about creating useful, reliable, and well-crafted digital experiences with solid engineering and thoughtful design."}
                        </motion.p>

                        {/* Verified Credential Milestones */}
                        <motion.div
                            initial={isOff ? false : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: isOff ? 0 : 0.22 }}
                            className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-xs"
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/80 px-3 py-1 text-[var(--text)]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                <strong>6+ Years</strong> Experience
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/80 px-3 py-1 text-[var(--text)]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                                <strong>50+</strong> Satisfied Clients
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/80 px-3 py-1 text-[var(--text)]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                <strong>10+</strong> Live Projects
                            </span>
                        </motion.div>

                        {/* High-Conversion Actions */}
                        <motion.div
                            initial={isOff ? false : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: isOff ? 0 : 0.28 }}
                            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.primary_button_url || '#projects').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group inline-flex items-center gap-3 rounded-xl bg-[var(--primary)] px-7 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_25px_rgba(241,90,36,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[46px]"
                            >
                                <span>{hero?.primary_button_label || 'Explore Selected Work'}</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const target = (hero?.secondary_button_url || '#contact').replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group inline-flex items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/80 backdrop-blur-sm px-6 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[46px]"
                            >
                                <span>{hero?.secondary_button_label || 'Start a Conversation'}</span>
                                <span className="font-sans text-xs">→</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Distinctive Celestial Artwork (Col 5) */}
                    <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
                        <div className="relative w-[380px] h-[380px] flex items-center justify-center select-none pointer-events-none">
                            {/* Deep Forest-Green Ambient Corona */}
                            <div className="absolute inset-0 rounded-full bg-[var(--forest)] opacity-40 blur-[70px]" />
                            <div className="absolute inset-8 rounded-full bg-[var(--primary)] opacity-20 blur-[50px]" />

                            {/* Outer Orbital Datum Ring */}
                            <div className="absolute inset-2 rounded-full border border-[var(--surface-border)] opacity-60 animate-[spin_60s_linear_infinite]" />
                            <div className="absolute inset-8 rounded-full border border-dashed border-[var(--primary)]/30 opacity-70 animate-[spin_40s_linear_infinite_reverse]" />

                            {/* Celestial Eclipse Core Disc */}
                            <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-[var(--bg)] via-[var(--forest)]/50 to-[var(--surface)] border border-[var(--surface-border)] shadow-[0_0_60px_rgba(23,60,50,0.5)] overflow-hidden flex items-center justify-center">
                                {/* Subtle Cosmic Rim Light on Edge */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[var(--primary)]/20 to-[var(--accent)]/30" />
                                
                                {/* Inner Telemetry Crosshairs & Coordinates */}
                                <div className="relative z-10 flex flex-col items-center text-center p-6 font-mono">
                                    <span className="text-[10px] tracking-widest text-[var(--accent)] font-bold uppercase">
                                        // CELESTIAL BEACON
                                    </span>
                                    <span className="font-display text-3xl font-black text-[var(--text)] tracking-wider mt-2">
                                        MZ · 2026
                                    </span>
                                    <span className="text-[10px] text-[var(--text-muted)] tracking-wider mt-1">
                                        LAT 22.35° N · LON 91.83° E
                                    </span>
                                    <span className="mt-3 inline-block rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-2.5 py-0.5 text-[9px] font-bold text-[var(--primary)] uppercase">
                                        PRODUCTION READY
                                    </span>
                                </div>

                                {/* Floating Coordinate Crosshairs */}
                                <span className="absolute top-3 left-3 text-[10px] font-mono text-[var(--primary)]/60 font-bold">+</span>
                                <span className="absolute top-3 right-3 text-[10px] font-mono text-[var(--primary)]/60 font-bold">+</span>
                                <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[var(--primary)]/60 font-bold">+</span>
                                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-[var(--primary)]/60 font-bold">+</span>
                            </div>

                            {/* Orbiting Beacon Dot */}
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_25s_linear_infinite]">
                                <div className="w-3 h-3 rounded-full bg-[var(--primary)] shadow-[0_0_14px_var(--primary)] translate-x-[190px]" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Horizon Strip: Core Engineering Stack & Navigation Prompt */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--surface-border)] pt-4 font-mono text-xs text-[var(--text-muted)] uppercase">
                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                    <span className="flex items-center gap-2 text-[var(--text)] font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        CORE STACK
                    </span>
                    <span>LARAVEL</span>
                    <span className="text-[var(--surface-border)]">·</span>
                    <span>PHP</span>
                    <span className="text-[var(--surface-border)]">·</span>
                    <span>VUE.JS</span>
                    <span className="text-[var(--surface-border)]">·</span>
                    <span>TAILWIND CSS</span>
                    <span className="text-[var(--surface-border)]">·</span>
                    <span>WORDPRESS</span>
                    <span className="text-[var(--surface-border)]">·</span>
                    <span>MYSQL</span>
                </div>

                <button
                    type="button"
                    onClick={() => scrollTo('about')}
                    className="flex items-center gap-2 text-[var(--primary)] font-bold hover:underline transition-all cursor-pointer"
                >
                    <span>BIOGRAPHY &amp; PROFILE</span>
                    <span className="font-sans">↓</span>
                </button>
            </div>
        </section>
    );
}
