import React from 'react';
import { AboutData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
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
    const photoUrl = settings?.photo_media?.webp_url || settings?.photo_media?.url;
    const resumeUrl = settings?.resume_media?.url;

    const facts = about?.facts || [];
    const counterFacts = facts.filter((f) => f.kind === 'counter' || f.kind === 'stat');
    const standardFacts = facts.filter((f) => f.kind !== 'counter' && f.kind !== 'stat');

    return (
        <section
            id={section.key}
            aria-label="About the Explorer"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none"
        >
            {/* Subtle Atmospheric Forest Nebula in Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 left-10 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-20 blur-[130px]"
            />

            <div className="mx-auto max-w-[1440px]">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    <span className="font-bold text-foreground">ABOUT</span>
                    <span className="text-border">/</span>
                    <span>BIOGRAPHY</span>
                </div>

                {/* Two-Column Spread */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Left Column: Portrait */}
                    <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
                        <div className="group relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl space-rim-light bg-[var(--surface)]">
                            {/* Ambient Glow behind portrait */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[var(--forest)] to-[var(--primary)] opacity-25 blur-xl group-hover:opacity-40 transition-opacity"
                            />

                            {/* Actual Portrait Image */}
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt={settings?.site_title || 'Monayem Azam'}
                                    className="relative z-10 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                                />
                            ) : (
                                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center bg-[var(--surface)] p-8 text-center font-mono">
                                    <span className="font-display text-7xl font-black text-foreground">
                                        MA
                                    </span>
                                    <span className="mt-3 text-xs uppercase text-muted-foreground">
                                        MONAYEM AZAM
                                    </span>
                                </div>
                            )}

                            {/* Floating Atmospheric Badge */}
                            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-lg border border-white/10 bg-black/60 backdrop-blur-md px-4 py-2 font-mono text-[11px] text-white">
                                <span className="font-bold tracking-wider">
                                    {settings?.site_title || 'MONAYEM AZAM'}
                                </span>
                                <span className="text-[var(--accent)] font-semibold">
                                    FULL-STACK WEB DEVELOPER
                                </span>
                            </div>
                        </div>

                        {/* Resume Download Action */}
                        {resumeUrl && (
                            <div className="mt-6 w-full max-w-[420px]">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl border border-border/80 bg-surface/60 backdrop-blur-md p-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:border-[var(--primary)] hover:bg-surface"
                                >
                                    <span>DOWNLOAD RESUME / CV</span>
                                    <span className="transition-transform group-hover:translate-y-0.5 font-sans">
                                        ↓
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Narrative Dossier & Verified Metrics */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-10">
                        <div>
                            <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                                // PROFESSIONAL BIOGRAPHY
                            </span>
                            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
                                {about?.heading || 'BUILT WITH PURPOSE.'}
                            </h2>

                            <div className="mt-6 font-body text-base sm:text-lg leading-relaxed text-foreground/80 space-y-4">
                                {about?.bio ? (
                                    <p className="whitespace-pre-line">{about.bio}</p>
                                ) : (
                                    <p>
                                        I'm Monayem Azam, a Full-Stack Web Developer with 6+ years of experience building digital experiences and web applications. I enjoy turning ideas into practical, reliable products, combining thoughtful design with solid engineering. With 50+ satisfied clients and 10+ live projects, I bring a passion for creating digital solutions that work in the real world.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Verified Personal Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border/40">
                            {counterFacts.length > 0 ? (
                                counterFacts.map((fact) => (
                                    <div key={fact.id} className="flex flex-col">
                                        <div className="flex items-baseline gap-1 font-display text-4xl sm:text-5xl font-black text-foreground">
                                            <AnimatedCounter value={fact.value} isReducedMotion={isOff} />
                                            {fact.suffix && (
                                                <span className="text-2xl text-[var(--primary)] font-bold">
                                                    {fact.suffix}
                                                </span>
                                            )}
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                            {fact.label}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-1 font-display text-4xl sm:text-5xl font-black text-foreground">
                                            <AnimatedCounter value="6" isReducedMotion={isOff} />
                                            <span className="text-2xl text-[var(--primary)] font-bold">+ years</span>
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                            Experience
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-1 font-display text-4xl sm:text-5xl font-black text-foreground">
                                            <AnimatedCounter value="50" isReducedMotion={isOff} />
                                            <span className="text-2xl text-[var(--primary)] font-bold">+</span>
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                            Satisfied Clients
                                        </span>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-baseline gap-1 font-display text-4xl sm:text-5xl font-black text-foreground">
                                            <AnimatedCounter value="10" isReducedMotion={isOff} />
                                            <span className="text-2xl text-[var(--accent)] font-bold">+</span>
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                            Live Projects
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Real Database Facts */}
                        {standardFacts.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {standardFacts.map((fact) => (
                                    <div
                                        key={fact.id}
                                        className="rounded-full border border-border/80 bg-surface/40 backdrop-blur-sm px-4 py-1.5 font-mono text-xs text-foreground/90 flex items-center gap-2"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                        <span className="font-semibold text-muted-foreground uppercase">
                                            {fact.label}:
                                        </span>
                                        <span className="font-bold text-foreground">
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
