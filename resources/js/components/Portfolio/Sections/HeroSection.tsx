import React from 'react';
import { motion } from 'framer-motion';
import {
    HeroData,
    PortfolioSection,
    PortfolioSettings,
} from '@/types/portfolio';
import BurningBlackHoleCanvas from '@/components/Portfolio/Motion/BurningBlackHoleCanvas';
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

    return (
        <section
            id={section.key}
            aria-label="Hero — Full-Screen Burning Black Hole"
            className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-x-clip bg-[var(--bg)] px-6 py-20 select-none sm:px-10 lg:overflow-hidden lg:px-14 xl:px-16"
        >
            {/* Full-Screen Living Burning Black Hole WebGL Environment */}
            <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
                <BurningBlackHoleCanvas isDark={isDark} isOff={isOff} className="h-full w-full" />
            </div>

            {/* Subtle Localized Space Vignette for Pristine Typography Contrast on Left */}
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 left-0 z-0 w-full max-w-[960px] ${
                    isDark
                        ? 'bg-gradient-to-r from-[var(--bg)]/90 via-[var(--bg)]/50 to-transparent'
                        : 'bg-gradient-to-r from-[var(--bg)]/85 via-[var(--bg)]/45 to-transparent'
                } transition-opacity duration-700`}
            />

            {/* Main Hero Composition — Uncluttered, Monumental Left-Aligned Headline */}
            <div className="relative z-10 mx-auto w-full max-w-[1560px]">
                <div className="max-w-2xl xl:max-w-3xl">
                    {/* Monumental Headline */}
                    <motion.h1
                        initial={isOff ? false : { opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.55,
                            delay: isOff ? 0 : 0.08,
                        }}
                        className="font-display text-[clamp(3.2rem,7.5vw,8.5rem)] leading-[0.88] font-black tracking-tighter text-[var(--text)] uppercase"
                    >
                        <span className="block drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                            I MAKE
                        </span>
                        <span className="block text-[var(--primary)] drop-shadow-[0_0_40px_rgba(241,90,36,0.4)]">
                            THE DIGITAL
                        </span>
                        <span className="block drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                            FEEL REAL.
                        </span>
                    </motion.h1>

                    {/* Narrative & Concise Tagline */}
                    <motion.p
                        initial={isOff ? false : { opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.45,
                            delay: isOff ? 0 : 0.16,
                        }}
                        className="mt-6 max-w-xl font-body text-base leading-relaxed font-normal text-[var(--text-muted)] sm:mt-8 sm:text-lg drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                    >
                        {settings?.site_tagline ||
                            'Full-stack web developer passionate about creating useful, reliable, and well-crafted digital experiences with solid engineering and thoughtful design.'}
                    </motion.p>

                    {/* Primary Actions */}
                    <motion.div
                        initial={isOff ? false : { opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.45,
                            delay: isOff ? 0 : 0.24,
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
                            className="group inline-flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl bg-[var(--primary)] px-7 py-3.5 font-mono text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(241,90,36,0.5)] hover:brightness-110 active:translate-y-0 sm:text-sm"
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
                            className="group inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/80 px-6 py-3.5 font-mono text-xs font-bold tracking-wider text-[var(--text)] uppercase backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--surface)] hover:text-[var(--primary)] active:translate-y-0 sm:text-sm"
                        >
                            <span>
                                {hero?.secondary_button_label ||
                                    'Start a Conversation'}
                            </span>
                            <span className="font-sans text-xs">→</span>
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
