import React from 'react';
import { motion } from 'framer-motion';
import { AboutData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import AnimatedCounter from '../Motion/AnimatedCounter';
import { Download1 } from '../Shared/Icons';

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
    const photoUrl = settings?.photo_media?.webp_url || settings?.photo_media?.url;
    const resumeUrl = settings?.resume_media?.url;

    const facts = about?.facts || [];
    const counterFacts = facts.filter((f) => f.kind === 'counter' || f.kind === 'stat');
    const standardFacts = facts.filter((f) => f.kind !== 'counter' && f.kind !== 'stat');

    return (
        <section
            id={section.key}
            aria-label="About Monayem Azam — Editorial Profile"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none bg-[var(--bg)]"
        >
            {/* Atmospheric Volumetric Nebula Lighting */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 left-10 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-25 blur-[150px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* 1. Technical Coordinate Breadcrumb */}
                <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                        <span className="font-bold text-[var(--text)]">ABOUT</span>
                        <span className="text-[var(--surface-border)]">/</span>
                        <span>EDITORIAL PROFILE</span>
                    </div>
                    <span className="text-[11px] hidden sm:inline">DOSSIER // MONAYEM AZAM</span>
                </div>

                {/* 2. Editorial Broadsheet Layout */}
                <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column: Portrait in Architectural Viewport Frame */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
                        <motion.div
                            initial={isOff ? false : { opacity: 0, scale: 0.96 }}
                            whileInView={isOff ? undefined : { opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.45 }}
                            className="group relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[var(--surface-border)] bg-[var(--surface)]"
                        >
                            {/* Corner Registration Crosshairs */}
                            <span className="pointer-events-none absolute top-3 left-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                                +
                            </span>
                            <span className="pointer-events-none absolute top-3 right-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                                +
                            </span>
                            <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                                +
                            </span>
                            <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                                +
                            </span>

                            {/* Actual Portrait Image */}
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt={settings?.site_title || 'Monayem Azam — Full-Stack Web Developer'}
                                    loading="lazy"
                                    className="relative z-10 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                />
                            ) : (
                                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center bg-[var(--surface)] p-8 text-center font-mono">
                                    <span className="font-display text-7xl font-black text-[var(--text)]">
                                        MA
                                    </span>
                                    <span className="mt-3 text-xs uppercase text-[var(--text-muted)]">
                                        MONAYEM AZAM
                                    </span>
                                </div>
                            )}

                            {/* Architectural Metadata Badge */}
                            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--bg)]/90 backdrop-blur-md px-4 py-2.5 font-mono text-[11px] shadow-lg">
                                <span className="font-bold tracking-wider text-[var(--text)]">
                                    MONAYEM AZAM
                                </span>
                                <span className="text-[var(--primary)] font-semibold uppercase">
                                    FULL-STACK DEVELOPER
                                </span>
                            </div>
                        </motion.div>

                        {/* Resume / CV Download Action */}
                        {resumeUrl && (
                            <div className="mt-6 w-full max-w-[420px]">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm min-h-[46px]"
                                >
                                    <Download1 className="h-4 w-4 text-[var(--primary)]" />
                                    <span>Download Resume / CV</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Editorial Narrative & Verified Milestone Metrics */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:space-y-10">
                        <div>
                            <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                                // 01 · PROFESSIONAL BIOGRAPHY
                            </span>
                            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] uppercase leading-tight">
                                {about?.heading || 'BUILT WITH PURPOSE.'}
                            </h2>

                            <div className="mt-6 font-body text-base sm:text-lg leading-relaxed text-[var(--text)]/85 space-y-4">
                                <p>
                                    I'm Monayem Azam, a full-stack web developer passionate about creating useful, reliable, and well-crafted digital experiences. With over six years of experience, I have worked with more than 50 clients and delivered 10+ live projects.
                                </p>
                                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                                    I enjoy turning ideas into practical, reliable products, combining thoughtful user interfaces with solid engineering. Whether architecting full-stack web applications with Laravel, Vue.js, and MySQL or developing custom WordPress and WooCommerce platforms, I focus on clean systems that deliver real-world business results.
                                </p>
                            </div>
                        </div>

                        {/* Architectural Milestone Metrics (Horizontal Bar, Not Cards) */}
                        <div className="pt-6 border-t border-[var(--surface-border)]">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1 font-display text-4xl sm:text-5xl font-black text-[var(--text)]">
                                        <AnimatedCounter value="6" isReducedMotion={isOff} />
                                        <span className="text-2xl text-[var(--primary)] font-bold">+</span>
                                    </div>
                                    <span className="mt-1 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                                        Years Experience
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1 font-display text-4xl sm:text-5xl font-black text-[var(--text)]">
                                        <AnimatedCounter value="50" isReducedMotion={isOff} />
                                        <span className="text-2xl text-[var(--primary)] font-bold">+</span>
                                    </div>
                                    <span className="mt-1 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                                        Satisfied Clients
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-1 font-display text-4xl sm:text-5xl font-black text-[var(--text)]">
                                        <AnimatedCounter value="10" isReducedMotion={isOff} />
                                        <span className="text-2xl text-[var(--accent)] font-bold">+</span>
                                    </div>
                                    <span className="mt-1 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                                        Live Projects
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Verified Facts from Database (if configured in CMS) */}
                        {standardFacts.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 pt-2">
                                {standardFacts.map((fact) => (
                                    <div
                                        key={fact.id}
                                        className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-1.5 font-mono text-xs text-[var(--text)] flex items-center gap-2"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                        <span className="text-[var(--text-muted)] uppercase">
                                            {fact.label}:
                                        </span>
                                        <span className="font-bold text-[var(--text)]">
                                            {fact.value} {fact.suffix || ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
