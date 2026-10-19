import React from 'react';
import { ArrowAngularTopRight, ArrowDownward, Sparkle } from '../Shared/Icons';
import {
    HeroData,
    PortfolioSection,
    PortfolioSettings,
} from '@/types/portfolio';
import HeroCenterpiece from '../Motion/HeroCenterpiece';
import TypewriterRoles from '../Motion/TypewriterRoles';

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
    isFull = true,
    isOff = false,
    isDark = true,
}: HeroSectionProps) {
    const roles = hero?.roles || [];
    const eyebrow =
        hero?.eyebrow ||
        section.eyebrow ||
        'FULL-STACK DEVELOPER · DIGITAL CREATOR';
    const primaryLabel = hero?.primary_button_label || 'Explore My Work';
    const primaryUrl = hero?.primary_button_url || '#projects';
    const secondaryLabel = hero?.secondary_button_label || "Let's Talk";
    const secondaryUrl = hero?.secondary_button_url || '#contact';

    const handleScrollTo = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string,
    ) => {
        e.preventDefault();
        const el = document.getElementById(targetId.replace(/^#/, ''));
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (typeof window !== 'undefined' && window.history?.pushState) {
                window.history.pushState(null, '', targetId);
            }
        }
    };

    return (
        <section
            id="hero"
            aria-label="Hero Section"
            className="relative flex min-h-[92svh] w-full items-center justify-center overflow-hidden px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-16 md:px-10 lg:min-h-screen lg:px-16 lg:pt-20 lg:pb-12 xl:px-20"
        >
            {/* Atmospheric Background Glow Fields */}
            <div
                className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/15 blur-[140px]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute top-1/3 -right-40 h-[550px] w-[550px] rounded-full bg-[var(--secondary)]/12 blur-[130px]"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1440px]">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-14">
                    {/* Left Column: Editorial Typography & Intentional Storytelling */}
                    <div className="flex flex-col items-start lg:col-span-7">
                        {/* Eyebrow & Live Availability Badge */}
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                                <Sparkle className="h-3.5 w-3.5 text-[var(--secondary)]" />
                                <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                                    {eyebrow}
                                </span>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--success)]/25 bg-[var(--success)]/10 px-3 py-1 font-mono text-[11px] font-medium text-[var(--success)] backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
                                </span>
                                <span>AVAILABLE FOR NEW PROJECTS</span>
                            </div>
                        </div>

                        {/* Monumental Headline */}
                        <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold leading-[1.04] tracking-tight text-[var(--text)]">
                            <span className="block">I BUILD DIGITAL</span>
                            <span className="mt-1 block">
                                <span className="bg-gradient-to-r from-[var(--secondary)] via-[#a78bfa] to-[var(--primary)] bg-clip-text text-transparent drop-shadow-sm">
                                    EXPERIENCES
                                </span>
                            </span>
                            <span className="mt-1 block text-[var(--text)]">
                                THAT MOVE YOU.
                            </span>
                        </h1>

                        {/* Subtitle / Role Typewriter */}
                        <div className="mt-5 flex items-center gap-2 font-mono text-sm font-medium text-[var(--text-muted)] sm:text-base md:text-lg">
                            <span>Focus:</span>
                            <TypewriterRoles
                                roles={roles}
                                isReducedMotion={isOff}
                                className="font-semibold text-[var(--secondary)]"
                            />
                        </div>

                        {/* Editorial Narrative Bio */}
                        <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                            {settings.site_tagline ||
                                'Architecting high-performance web applications, scalable backends, and award-winning digital interfaces with precision engineering.'}
                        </p>

                        {/* CTAs */}
                        <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
                            <a
                                href={primaryUrl}
                                onClick={(e) => handleScrollTo(e, primaryUrl)}
                                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-7 py-3.5 font-sans text-sm font-bold text-white shadow-[0_0_25px_rgba(139,108,255,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(83,224,247,0.45)] active:scale-95"
                            >
                                <span>{primaryLabel}</span>
                                <ArrowAngularTopRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>

                            <a
                                href={secondaryUrl}
                                onClick={(e) => handleScrollTo(e, secondaryUrl)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-7 py-3.5 font-sans text-sm font-semibold text-[var(--text)] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/10 hover:text-[var(--secondary)] active:scale-95"
                            >
                                <span>{secondaryLabel}</span>
                            </a>
                        </div>

                        {/* Tech Tag Badges */}
                        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[var(--surface-border)]/40 pt-6">
                            <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Stack:
                            </span>
                            {['Laravel', 'React', 'TypeScript', 'Three.js', 'MySQL', 'Tailwind'].map(
                                (tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-md border border-[var(--surface-border)] bg-[var(--surface)]/70 px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--text-muted)]"
                                    >
                                        {tech}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Right Column: 3D Celestial Centerpiece Sculpture */}
                    <div className="relative flex items-center justify-center lg:col-span-5">
                        <div className="relative h-[360px] w-full max-w-[500px] sm:h-[440px] lg:h-[560px]">
                            {/* Inner Atmosphere Soft Radial Aura */}
                            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--primary)]/20 via-[var(--secondary)]/15 to-transparent blur-3xl" />
                            <HeroCenterpiece
                                isDark={isDark}
                                isReducedMotion={isOff}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Scroll Indicator */}
                <div className="mt-12 flex justify-center lg:mt-6">
                    <a
                        href="#about"
                        onClick={(e) => handleScrollTo(e, '#about')}
                        aria-label="Scroll down to About section"
                        className="group inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/60 px-4 py-1.5 font-mono text-[11px] text-[var(--text-muted)] backdrop-blur-md transition-all duration-300 hover:border-[var(--secondary)] hover:text-[var(--secondary)]"
                    >
                        <span className="tracking-widest uppercase">
                            EXPLORE UNIVERSE
                        </span>
                        <ArrowDownward className="h-3.5 w-3.5 text-[var(--secondary)] transition-transform group-hover:translate-y-0.5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
