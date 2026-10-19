import React, { useEffect, useState } from 'react';
import { ArrowDownward, Rocket5 } from '../Shared/Icons';
import {
    HeroData,
    PortfolioSection,
    PortfolioSettings,
} from '@/types/portfolio';
import Button from '../Shared/Button';
import ThemeToggle from '../Shared/ThemeToggle';

interface HeroSectionProps {
    section: PortfolioSection;
    hero: HeroData | null;
    settings: PortfolioSettings;
}

export default function HeroSection({
    section,
    hero,
    settings,
}: HeroSectionProps) {
    const roles = hero?.roles || [];
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

    // Rotate through roles
    useEffect(() => {
        if (roles.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [roles]);

    const activeRoleText =
        roles.length > 0
            ? roles[currentRoleIndex]?.text
            : 'Full-Stack Developer';

    const eyebrow = hero?.eyebrow || section.eyebrow || 'MISSION 01 / LAUNCH';
    const name = hero?.name || 'MONAYEM AZAM';
    const primaryLabel = hero?.primary_button_label || 'View Projects';
    const primaryUrl = hero?.primary_button_url || '#projects';
    const secondaryLabel = hero?.secondary_button_label || 'Hire Me';
    const secondaryUrl = hero?.secondary_button_url || '#contact';

    const siteTitle = settings.site_title || 'Monayem Azam';
    const logoUrl = settings.logo_media?.url;

    return (
        <section
            id="hero"
            aria-label="Hero Section"
            className="relative flex min-h-screen w-full flex-col justify-between px-4 py-8 md:px-8 lg:px-16"
        >
            {/* Top Navigation Bar inside Hero */}
            <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-2">
                <a
                    href="#hero"
                    className="flex items-center gap-3 transition-opacity hover:opacity-85"
                >
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={siteTitle}
                            className="h-9 w-auto object-contain"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] font-mono text-sm font-bold text-[var(--secondary)] shadow-md">
                                MA
                            </span>
                            <span className="font-display text-sm font-bold tracking-wider text-[var(--text)] md:text-base">
                                {siteTitle}
                            </span>
                        </div>
                    )}
                </a>

                <div className="flex items-center gap-4">
                    <ThemeToggle showLabel={false} />
                </div>
            </header>

            {/* Central Hero Content */}
            <div className="section-reveal mx-auto my-auto flex w-full max-w-5xl flex-col items-center py-12 text-center md:py-20">
                {/* Eyebrow */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-1.5 backdrop-blur-md">
                    <Rocket5 className="h-3.5 w-3.5 animate-bounce text-[var(--secondary)]" />
                    <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                        {eyebrow}
                    </span>
                </div>

                {/* Hero Name with Fluid Sizing */}
                <h1 className="max-w-5xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] font-extrabold tracking-[0.02em] text-[var(--text)] uppercase">
                    {name}
                </h1>

                {/* Rotating Role Line */}
                <div className="mt-6 flex h-8 items-center justify-center font-sans text-[clamp(1.125rem,2.5vw,1.5rem)] font-medium text-[var(--text-muted)]">
                    <span>Specializing in&nbsp;</span>
                    <span
                        key={activeRoleText}
                        className="text-gradient animate-in font-bold transition-all duration-500 fade-in slide-in-from-bottom-2"
                    >
                        {activeRoleText}
                    </span>
                </div>

                {/* Tagline */}
                {settings.site_tagline && (
                    <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                        {settings.site_tagline}
                    </p>
                )}

                {/* Call to Actions */}
                <div className="mt-10 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        variant="primary"
                        size="lg"
                        href={primaryUrl}
                        showArrow
                        className="w-full sm:w-auto"
                    >
                        {primaryLabel}
                    </Button>
                    <Button
                        variant="cta"
                        size="lg"
                        href={secondaryUrl}
                        className="w-full sm:w-auto"
                    >
                        {secondaryLabel}
                    </Button>
                </div>
            </div>

            {/* Scroll Cue (Rocket/Arrow) */}
            <div className="mx-auto flex flex-col items-center pb-4 text-center">
                <a
                    href="#about"
                    aria-label="Scroll down to mission briefing"
                    className="group inline-flex flex-col items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--secondary)]"
                >
                    <span className="text-[10px] tracking-widest uppercase">
                        FLIGHT DESCENT
                    </span>
                    <ArrowDownward className="h-4 w-4 text-[var(--secondary)] transition-transform duration-300 group-hover:translate-y-1" />
                </a>
            </div>
        </section>
    );
}
