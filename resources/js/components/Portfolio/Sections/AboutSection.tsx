import React, { useEffect, useRef, useState } from 'react';
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
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    const photoUrl = settings?.photo_media?.webp_url || settings?.photo_media?.url;
    const resumeUrl = settings?.resume_media?.url;

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const facts = about?.facts || [];
    const counterFacts = facts.filter((f) => f.kind === 'counter' || f.kind === 'stat');
    const standardFacts = facts.filter((f) => f.kind !== 'counter' && f.kind !== 'stat');

    return (
        <section
            ref={sectionRef}
            id={section.key}
            aria-label="Human Element Profile & Dossier"
            className="w-full border-b-2 border-foreground bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28 select-none"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* 1. Large Typographic Header Field */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="stamp-orange text-[10px] tracking-widest">
                            SEC. 02 // DOSSIER
                        </span>
                        <span className="font-bold text-foreground">
                            THE HUMAN BEHIND THE MACHINE
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--primary)] font-bold">
                            [IDENTITY: MONAYEM AZAM]
                        </span>
                    </div>
                </div>

                {/* Editorial Headline */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // ARCHIVAL BIOGRAPHY & PHILOSOPHY
                        </span>
                        <h2 className="mt-2 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground uppercase">
                            ARCHITECTURAL RIGOR.
                            <br />
                            EXPRESSIVE KINETICS.
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Disciplined full-stack engineering rooted in verified operational uptime,
                        clean system architecture, and an obsession with tactile, alive digital craft.
                    </p>
                </div>

                {/* 2. Rectangular Mask Shutter & Editorial Portrait Reveal */}
                <div className="mt-14 lg:mt-18 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Portrait Frame with Moving Crop & Geometric Mask */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="relative">
                            {/* Layered Deep-Forest Offset Backplate */}
                            <div
                                className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-5 sm:translate-y-5 border-2 border-foreground bg-[var(--forest)] select-none pointer-events-none"
                                aria-hidden="true"
                            >
                                <div className="absolute bottom-4 right-5 font-display text-6xl sm:text-8xl font-black text-white/10 tracking-tighter">
                                    MA.
                                </div>
                            </div>

                            {/* Rectangular Mask Shutter Panel */}
                            <div className="relative border-2 border-foreground bg-surface p-4 sm:p-6 shadow-sm overflow-hidden">
                                {/* Precision Calibration Marks */}
                                <span className="absolute top-2 left-2 font-mono text-xs font-bold text-[var(--primary)] select-none">
                                    + [ID.FRAME]
                                </span>
                                <span className="absolute top-2 right-2 font-mono text-xs font-bold text-[var(--primary)] select-none">
                                    [REC_2026] +
                                </span>
                                <span className="absolute bottom-2 left-2 font-mono text-xs font-bold text-[var(--primary)] select-none">
                                    + [001/ENG]
                                </span>
                                <span className="absolute bottom-2 right-2 font-mono text-xs font-bold text-[var(--primary)] select-none">
                                    [DHAKA_BD] +
                                </span>

                                {/* Editorial Image Crop with Controlled Mask Reveal */}
                                <div className="relative aspect-[4/5] w-full overflow-hidden border border-foreground bg-[#141712]">
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt={settings?.site_title || 'Monayem Azam'}
                                            className={`h-full w-full object-cover object-center transition-all duration-1000 ease-out ${
                                                inView || isOff
                                                    ? 'scale-100 filter-none opacity-100'
                                                    : 'scale-105 contrast-125 opacity-0'
                                            }`}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--surface-sand)] p-8 text-center font-mono">
                                            <span className="font-display text-6xl font-black text-foreground">
                                                MA.
                                            </span>
                                            <span className="mt-2 text-xs uppercase text-muted-foreground">
                                                PORTRAIT ARCHIVE
                                            </span>
                                        </div>
                                    )}

                                    {/* Shutter Reveal Transition Cover */}
                                    {!isOff && (
                                        <div
                                            className={`pointer-events-none absolute inset-0 bg-[var(--primary)] transition-transform duration-700 ease-out ${
                                                inView
                                                    ? '-translate-y-full'
                                                    : 'translate-y-0'
                                            }`}
                                            style={{
                                                transitionTimingFunction:
                                                    'cubic-bezier(0.16, 1, 0.3, 1)',
                                            }}
                                        />
                                    )}

                                    {/* Floating Calibration Ribbon */}
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between border border-foreground bg-background/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider backdrop-blur-xs text-foreground">
                                        <span>ARCHIVAL RECORD 01</span>
                                        <span className="text-[var(--primary)] font-bold">
                                            VERIFIED SUBJECT
                                        </span>
                                    </div>
                                </div>

                                {/* Portrait Caption Plate */}
                                <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase border-t border-border pt-3">
                                    <span>ROLE: PRINCIPAL FULL-STACK ENGINEER</span>
                                    <span className="font-bold text-foreground">
                                        DHAKA, BD · GLOBAL
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Resume Download Action */}
                        {resumeUrl && (
                            <div className="mt-6">
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex w-full items-center justify-center gap-3 border-2 border-foreground bg-background p-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
                                >
                                    <span>DOWNLOAD VERIFIED CURRICULUM VITAE</span>
                                    <span className="transition-transform group-hover:translate-x-1 font-sans">
                                        ↓
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Narrative Dossier, Principles, and Verified Counters */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                        {/* 4. Biography Content */}
                        <div className="border-2 border-foreground bg-surface p-6 sm:p-8 shadow-xs">
                            <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-xs text-muted-foreground uppercase">
                                <span className="font-bold text-[var(--primary)]">
                                    [CURATED PROFILE EXPOSITION]
                                </span>
                                <span>VERIFIED EDITORIAL RECORD</span>
                            </div>

                            <div className="mt-6 font-body text-base sm:text-lg leading-relaxed text-foreground/90 space-y-4">
                                {about?.bio ? (
                                    <p className="whitespace-pre-line">{about.bio}</p>
                                ) : (
                                    <>
                                        <p>
                                            I am an independent full-stack software engineer and creative technologist
                                            specializing in architecting mission-critical web applications, high-throughput
                                            e-commerce platforms, and experimental digital installations.
                                        </p>
                                        <p>
                                            Over the past eight years, my work has focused on pairing rock-solid backend
                                            systems built in Laravel and MySQL with responsive, expressive user experiences
                                            crafted in React, TypeScript, and modern kinetic motion.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 5. Real Profile Counters from Database */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {counterFacts.length > 0 ? (
                                counterFacts.map((fact) => (
                                    <div key={fact.id} className="border-2 border-foreground bg-surface p-5">
                                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                                            // {fact.label}
                                        </span>
                                        <div className="mt-2 flex items-baseline gap-1 font-mono text-3xl sm:text-4xl font-black text-foreground">
                                            <AnimatedCounter value={fact.value} isReducedMotion={isOff} />
                                            {fact.suffix && (
                                                <span className="text-xl text-[var(--primary)] font-bold">
                                                    {fact.suffix}
                                                </span>
                                            )}
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase block font-semibold">
                                            {fact.label}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="border-2 border-foreground bg-surface p-5">
                                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                                            // PRACTICE CONTINUITY
                                        </span>
                                        <div className="mt-2 flex items-baseline gap-1 font-mono text-3xl sm:text-4xl font-black text-foreground">
                                            <AnimatedCounter value="8" isReducedMotion={isOff} />
                                            <span className="text-xl text-[var(--primary)] font-bold">+</span>
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase block font-semibold">
                                            Years Active Craft
                                        </span>
                                    </div>

                                    <div className="border-2 border-foreground bg-surface p-5">
                                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                                            // DEPLOYED SYSTEMS
                                        </span>
                                        <div className="mt-2 flex items-baseline gap-1 font-mono text-3xl sm:text-4xl font-black text-foreground">
                                            <AnimatedCounter value="24" isReducedMotion={isOff} />
                                            <span className="text-xl text-[var(--primary)] font-bold">+</span>
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase block font-semibold">
                                            Production Releases
                                        </span>
                                    </div>

                                    <div className="border-2 border-foreground bg-surface p-5">
                                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                                            // CODE REVIEWS
                                        </span>
                                        <div className="mt-2 flex items-baseline gap-1 font-mono text-3xl sm:text-4xl font-black text-foreground">
                                            <AnimatedCounter value="1200" isReducedMotion={isOff} />
                                            <span className="text-xl text-[var(--accent)] font-bold">+</span>
                                        </div>
                                        <span className="mt-1 font-mono text-xs text-muted-foreground uppercase block font-semibold">
                                            Audits & Commits
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Real Database Facts & Verifications */}
                        {standardFacts.length > 0 && (
                            <div className="border-2 border-foreground bg-surface p-6">
                                <div className="border-b border-border pb-3 font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                                    OPERATIONAL PILLARS & FACTS
                                </div>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {standardFacts.map((fact) => (
                                        <div
                                            key={fact.id}
                                            className="border border-border p-3 font-mono text-xs bg-background"
                                        >
                                            <span className="font-bold text-[var(--primary)] block uppercase">
                                                {fact.label}
                                            </span>
                                            <span className="text-foreground text-sm font-bold block mt-1">
                                                {fact.value} {fact.suffix || ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
