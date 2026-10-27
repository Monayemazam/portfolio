import React from 'react';
import { motion } from 'framer-motion';
import {
    HeroData,
    PortfolioSection,
    PortfolioSettings,
} from '@/types/portfolio';
import CelestialHorizonCanvas from '@/components/Portfolio/Motion/CelestialHorizonCanvas';
import FloatingObservationWindow from '@/components/Portfolio/Motion/FloatingObservationWindow';
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
            className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-x-clip bg-[var(--bg)] px-6 pt-8 pb-12 select-none sm:px-10 lg:overflow-hidden lg:px-16"
        >
            {/* Multi-Layer Cinematic Celestial Horizon Canvas Background */}
            <CelestialHorizonCanvas isDark={isDark} isReducedMotion={isOff} />

            {/* Subtle Ambient Spatial Glow on Bottom-Left to Balance Composition */}
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-1/4 -left-16 h-[28vw] max-h-[380px] w-[28vw] max-w-[380px] rounded-full bg-[var(--primary)] ${isDark ? 'opacity-8' : 'opacity-3'} blur-[90px] transition-opacity duration-700`}
            />

            {/* Top Telemetry Strip: Identity & Live Status */}
            <div className="relative z-20 flex items-center justify-between border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    </span>
                    <span className="font-bold tracking-wider text-[var(--text)]">
                        {hero?.name || 'MONAYEM AZAM'}
                    </span>
                    <span className="text-[var(--surface-border)]">/</span>
                    <span className="hidden text-[var(--text-muted)] sm:inline">
                        {hero?.eyebrow || 'FULL-STACK WEB DEVELOPER'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                    <span className="text-[11px] font-semibold tracking-wider text-[var(--text)]">
                        AVAILABLE FOR PROJECTS
                    </span>
                </div>
            </div>

            {/* Main Asymmetrical Hero Composition */}
            <div className="relative z-10 mx-auto my-auto w-full max-w-[1440px] py-6 sm:py-10">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
                    {/* Left Column: Monumental Headline & Narrative (Col 7) */}
                    <div className="flex flex-col justify-center lg:col-span-7">
                        {/* Kicker */}
                        <motion.div
                            initial={isOff ? false : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-4 flex items-center gap-2.5 font-mono text-xs font-semibold tracking-widest text-[var(--primary)] uppercase sm:mb-6"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                            <span>{roles}</span>
                        </motion.div>

                        {/* Monumental Headline */}
                        <motion.h1
                            initial={isOff ? false : { opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: isOff ? 0 : 0.08,
                            }}
                            className="font-display text-[clamp(3.4rem,7.8vw,8.5rem)] leading-[0.88] font-black tracking-tighter text-[var(--text)] uppercase"
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
                            transition={{
                                duration: 0.4,
                                delay: isOff ? 0 : 0.16,
                            }}
                            className="mt-6 max-w-xl font-body text-base leading-relaxed font-normal text-[var(--text-muted)] sm:mt-8 sm:text-lg"
                        >
                            {settings?.site_tagline ||
                                'Full-stack web developer passionate about creating useful, reliable, and well-crafted digital experiences with solid engineering and thoughtful design.'}
                        </motion.p>

                        {/* Verified Credential Milestones */}
                        <motion.div
                            initial={isOff ? false : { opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: isOff ? 0 : 0.22,
                            }}
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
                            transition={{
                                duration: 0.4,
                                delay: isOff ? 0 : 0.28,
                            }}
                            className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    const target = (
                                        hero?.primary_button_url || '#projects'
                                    ).replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group inline-flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl bg-[var(--primary)] px-7 py-3.5 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(241,90,36,0.4)] hover:brightness-110 active:translate-y-0 sm:text-sm"
                            >
                                <span>
                                    {hero?.primary_button_label ||
                                        'Explore Selected Work'}
                                </span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const target = (
                                        hero?.secondary_button_url || '#contact'
                                    ).replace('#', '');
                                    scrollTo(target);
                                }}
                                className="group inline-flex min-h-[46px] cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/80 px-6 py-3.5 font-mono text-xs font-bold tracking-wider text-[var(--text)] uppercase backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface)] hover:text-[var(--primary)] active:translate-y-0 sm:text-sm"
                            >
                                <span>
                                    {hero?.secondary_button_label ||
                                        'Start a Conversation'}
                                </span>
                                <span className="font-sans text-xs">→</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Floating Translucent Observation Interface (Col 5) */}
                    <div className="relative mt-8 flex items-center justify-center lg:col-span-5 lg:mt-0">
                        <motion.div
                            initial={
                                isOff ? false : { opacity: 0, y: 24, scale: 0.96 }
                            }
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.85,
                                delay: isOff ? 0 : 0.2,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="flex w-full items-center justify-center"
                        >
                            <FloatingObservationWindow
                                isOff={isOff}
                                isDark={isDark}
                                className="w-full"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Horizon Strip: Core Engineering Stack & Navigation Prompt */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--surface-border)] pt-4 font-mono text-xs text-[var(--text-muted)] uppercase">
                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                    <span className="flex items-center gap-2 font-semibold text-[var(--text)]">
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
                    className="flex cursor-pointer items-center gap-2 font-bold text-[var(--primary)] transition-all hover:underline"
                >
                    <span>BIOGRAPHY &amp; PROFILE</span>
                    <span className="font-sans">↓</span>
                </button>
            </div>
        </section>
    );
}
