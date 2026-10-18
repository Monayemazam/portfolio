import React from 'react';
import { Download1, User4 } from 'lineicons-react';
import {
    AboutData,
    PortfolioSection,
    PortfolioSettings,
} from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';
import Button from '../Shared/Button';

interface AboutSectionProps {
    section: PortfolioSection;
    about: AboutData | null;
    settings: PortfolioSettings;
}

export default function AboutSection({
    section,
    about,
    settings,
}: AboutSectionProps) {
    if (!about) return null;

    const eyebrow = section.eyebrow || 'MISSION 02 / BRIEFING';
    const heading = about.heading || section.title || 'Mission Briefing';
    const bio = about.bio;
    const facts = about.facts || [];
    const photoUrl = settings.photo_media?.url;
    const resumeUrl = settings.resume_media?.url;

    return (
        <section
            id="about"
            aria-label="About Section"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    eyebrow={eyebrow}
                    title={heading}
                    subtitle={section.subtitle}
                    highlightWord="Briefing"
                />

                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left: Glowing Porthole Photo */}
                    <div className="flex justify-center lg:col-span-5">
                        <div className="group relative">
                            {/* Outer Glow Ring */}
                            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] opacity-30 blur-xl transition-opacity duration-500 group-hover:opacity-50" />

                            {/* Porthole Frame */}
                            <div className="relative h-64 w-64 rounded-full border-4 border-[var(--primary)]/40 bg-[var(--surface)] p-2.5 shadow-[0_0_35px_rgba(124,58,237,0.3)] backdrop-blur-md sm:h-72 sm:w-72 md:h-80 md:w-80">
                                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt={
                                                settings.site_title ||
                                                'Monayem Azam'
                                            }
                                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                                            <User4 className="h-20 w-20 text-[var(--secondary)]" />
                                            <span className="mt-2 font-mono text-xs uppercase">
                                                Commander
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Telemetry Indicator Badge */}
                            <div className="absolute right-4 bottom-2 flex items-center gap-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px] tracking-widest text-[var(--secondary)] uppercase shadow-lg backdrop-blur-md">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" />
                                <span>PILOT / ACTIVE</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Bio & Telemetry Counters */}
                    <div className="flex flex-col gap-6 lg:col-span-7">
                        <GlassPanel
                            variant="card"
                            className="border-[var(--surface-border)]"
                        >
                            <p className="font-sans text-base leading-relaxed whitespace-pre-line text-[var(--text)] md:text-lg">
                                {bio}
                            </p>
                        </GlassPanel>

                        {/* Facts & Counters Grid */}
                        {facts.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {facts.map((fact) => (
                                    <GlassPanel
                                        key={fact.id}
                                        variant="subtle"
                                        interactive
                                        className="flex flex-col items-center justify-center border-[var(--surface-border)] !p-4 text-center"
                                    >
                                        <div className="font-display text-2xl font-bold tracking-tight text-[var(--secondary)] md:text-3xl">
                                            {fact.value}
                                            {fact.suffix && (
                                                <span className="text-xl text-[var(--primary)]">
                                                    {fact.suffix}
                                                </span>
                                            )}
                                        </div>
                                        <span className="mt-1 font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase">
                                            {fact.label}
                                        </span>
                                    </GlassPanel>
                                ))}
                            </div>
                        )}

                        {/* Resume Download Action */}
                        {resumeUrl && (
                            <div className="pt-2">
                                <Button
                                    variant="secondary"
                                    href={resumeUrl}
                                    target="_blank"
                                    icon={
                                        <Download1 className="h-4 w-4 text-[var(--secondary)]" />
                                    }
                                    className="w-full sm:w-auto"
                                >
                                    Download Flight Resume
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
