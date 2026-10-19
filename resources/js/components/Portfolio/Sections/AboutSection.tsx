import React from 'react';
import {
    ArrowAngularTopRight,
    Download1,
    Sparkle,
    Verified,
} from '../Shared/Icons';
import {
    AboutData,
    PortfolioSection,
    PortfolioSettings,
} from '@/types/portfolio';
import AnimatedCounter from '../Motion/AnimatedCounter';

interface AboutSectionProps {
    section: PortfolioSection;
    about: AboutData | null;
    settings: PortfolioSettings;
    isOff?: boolean;
}

export default function AboutSection({
    section,
    about,
    settings,
    isOff = false,
}: AboutSectionProps) {
    if (!about) return null;

    const eyebrow = section.eyebrow || 'A LITTLE ABOUT ME';
    const heading =
        about.heading ||
        section.title ||
        'Engineering ideas into digital reality.';
    const bio = about.bio;
    const facts = about.facts || [];
    const photoUrl = settings.photo_media?.url;
    const resumeUrl = settings.resume_media?.url;
    const siteTitle = settings.site_title || 'Monayem Azam';

    return (
        <section
            id="about"
            aria-label="About Section"
            className="relative w-full overflow-hidden px-4 py-24 sm:px-6 sm:py-32 md:px-10 lg:px-16 lg:py-36 xl:px-20"
        >
            {/* Subtle Atmospheric Light Behind Section */}
            <div
                className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[130px]"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1440px]">
                {/* Two-Column Editorial Profile Layout */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
                    {/* Left Column: Professionally Framed Avatar & Orbital Aesthetics */}
                    <div className="flex justify-center lg:col-span-5">
                        <div className="group relative flex w-full max-w-[420px] flex-col items-center">
                            {/* Outer Atmosphere Glow */}
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[var(--primary)]/25 via-[var(--secondary)]/20 to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-90" />

                            {/* Main Frame */}
                            <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 shadow-2xl backdrop-blur-xl">
                                {photoUrl ? (
                                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[var(--bg-elevated)]">
                                        <img
                                            src={photoUrl}
                                            alt={siteTitle}
                                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent" />
                                    </div>
                                ) : (
                                    /* Refined Digital Universe Monogram Visual when Photo Not Configured */
                                    <div className="relative flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg)] p-8 text-center">
                                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[var(--secondary)]/30 bg-[var(--surface)] shadow-[0_0_40px_rgba(83,224,247,0.2)]">
                                            <span className="font-display text-4xl font-extrabold text-[var(--secondary)]">
                                                MA
                                            </span>
                                            {/* Orbital Ring detail */}
                                            <div className="absolute -inset-2.5 rounded-full border border-dashed border-[var(--primary)]/40 animate-spin [animation-duration:30s]" />
                                        </div>
                                        <span className="mt-6 font-display text-lg font-bold tracking-wider text-[var(--text)]">
                                            Monayem Azam
                                        </span>
                                        <span className="mt-1 font-mono text-xs text-[var(--secondary)]">
                                            Full-Stack Creative Engineer
                                        </span>
                                    </div>
                                )}

                                {/* Floating Role / Status Tag */}
                                <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/90 px-4 py-2.5 backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
                                        <span className="font-mono text-xs font-semibold tracking-wider text-[var(--text)] uppercase">
                                            Active Engineer
                                        </span>
                                    </div>
                                    <span className="font-mono text-[11px] text-[var(--secondary)]">
                                        Worldwide
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Narrative Biography & Expertise Highlights */}
                    <div className="flex flex-col items-start lg:col-span-7">
                        {/* Eyebrow */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                            <Sparkle className="h-3.5 w-3.5 text-[var(--secondary)]" />
                            <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                                {eyebrow}
                            </span>
                        </div>

                        {/* Large Headline */}
                        <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.12] tracking-tight text-[var(--text)]">
                            {heading}
                        </h2>

                        {/* Biography Paragraphs */}
                        <div className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                            <p className="whitespace-pre-line">{bio}</p>
                        </div>

                        {/* Key Pillars / Expertise Highlights */}
                        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                                {
                                    title: 'End-to-End Architecture',
                                    desc: 'From high-concurrency databases to slick reactive UIs.',
                                },
                                {
                                    title: 'Creative Interaction',
                                    desc: 'Three.js, physics-based motion, and micro-delights.',
                                },
                                {
                                    title: 'Production Reliability',
                                    desc: 'Robust test coverage, strict typing, and clean code.',
                                },
                                {
                                    title: 'Business Alignment',
                                    desc: 'Direct focus on conversion, speed, and real metrics.',
                                },
                            ].map((pillar) => (
                                <div
                                    key={pillar.title}
                                    className="flex items-start gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-4 backdrop-blur-sm transition-all hover:border-[var(--secondary)]/40 hover:bg-[var(--surface)]"
                                >
                                    <Verified className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--secondary)]" />
                                    <div>
                                        <h4 className="font-display text-sm font-bold text-[var(--text)]">
                                            {pillar.title}
                                        </h4>
                                        <p className="mt-1 font-sans text-xs text-[var(--text-muted)]">
                                            {pillar.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resume Download Action (Displayed only if configured) */}
                        {resumeUrl && (
                            <div className="mt-8">
                                <a
                                    href={resumeUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-6 py-3 font-sans text-sm font-semibold text-[var(--text)] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--secondary)] hover:bg-[var(--secondary)]/10 hover:text-[var(--secondary)] active:scale-95"
                                >
                                    <Download1 className="h-4 w-4 text-[var(--secondary)] transition-transform group-hover:translate-y-0.5" />
                                    <span>Download Professional Resume</span>
                                    <ArrowAngularTopRight className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row: Important Metrics Grid */}
                {facts.length > 0 && (
                    <div className="mt-16 sm:mt-20">
                        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)]/70 p-6 shadow-xl backdrop-blur-xl sm:grid-cols-4 sm:p-8">
                            {facts.map((fact, idx) => (
                                <div
                                    key={fact.id}
                                    className={`flex flex-col items-center justify-center p-4 text-center ${
                                        idx !== facts.length - 1
                                            ? 'sm:border-r sm:border-[var(--surface-border)]/40'
                                            : ''
                                    }`}
                                >
                                    <div className="font-display text-3xl font-extrabold tracking-tight text-[var(--secondary)] sm:text-4xl md:text-5xl">
                                        {fact.kind === 'counter' ? (
                                            <AnimatedCounter
                                                value={fact.value}
                                                suffix={fact.suffix}
                                                isReducedMotion={isOff}
                                            />
                                        ) : (
                                            <>
                                                {fact.value}
                                                {fact.suffix && (
                                                    <span className="text-2xl text-[var(--primary)] sm:text-3xl">
                                                        {fact.suffix}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <span className="mt-2 font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase sm:text-sm">
                                        {fact.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
