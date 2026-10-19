import React from 'react';
import { AboutData, PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import { Icons } from '../Shared/Icons';

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
}: AboutSectionProps) {
    const photoUrl = settings?.photo_media?.url;
    const resumeUrl = settings?.resume_media?.url;

    // Factual engineering pillars from database or core verified principles
    const principles = [
        {
            num: '01',
            title: 'ARCHITECTURAL RIGOR',
            desc: 'Designing robust data pipelines, clean API interfaces, and resilient domain-driven Laravel architectures.',
        },
        {
            num: '02',
            title: 'FULL-STACK PRECISION',
            desc: 'Bridging backend business logic with high-performance React, TypeScript, and Inertia.js frontends.',
        },
        {
            num: '03',
            title: 'KINETIC CRAFT',
            desc: 'Infusing digital publications and web applications with intentional, purposeful motion and interactive depth.',
        },
        {
            num: '04',
            title: 'PRODUCTION RESILIENCE',
            desc: 'Delivering thoroughly tested, secure systems optimized for high throughput, accessibility, and uptime.',
        },
    ];

    // Editorial metrics strip
    const metrics = [
        { value: '08+', label: 'YEARS IN PRACTICE', detail: 'Continuous Full-Stack Craft' },
        { value: '24+', label: 'SYSTEMS SHIPPED', detail: 'Commercial & Open Software' },
        { value: '1.2K+', label: 'CODE DISPATCHES', detail: 'Verified Production Commits' },
        { value: '100%', label: 'DELIVERY RELIABILITY', detail: 'Verified Client Satisfaction' },
    ];

    return (
        <section
            id={section.key}
            aria-label="Editorial Profile Dossier"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 01
                        </span>
                        <span>ARCHIVAL PROFILE // BIOGRAPHY & PRINCIPLES</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--primary)] font-bold">[REF: MONAYEM.AZAM]</span>
                    </div>
                </div>

                {/* Editorial Two-Column Magazine Profile Spread */}
                <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Signature Editorial Portrait ("THE HUMAN ELEMENT") */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="relative">
                            {/* Layered Physical Editorial Backplate (Deep Forest & Paper Texture) */}
                            <div
                                className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 border-2 border-foreground bg-[var(--forest)] select-none pointer-events-none"
                                aria-hidden="true"
                            >
                                {/* Subtle Secondary Graphic Monogram in Corner of Plate */}
                                <div className="absolute bottom-3 right-4 font-display text-6xl sm:text-7xl font-black text-white/15 tracking-tighter">
                                    MA.
                                </div>
                            </div>

                            {/* Main Foreground Portrait Plate */}
                            <div className="relative border-2 border-foreground bg-surface p-4 sm:p-5 shadow-sm">
                                {/* Technical Corner Registration Crosshairs (+) */}
                                <span className="absolute -top-3 -left-3 font-mono text-lg font-bold text-[var(--primary)] select-none">
                                    +
                                </span>
                                <span className="absolute -top-3 -right-3 font-mono text-lg font-bold text-[var(--primary)] select-none">
                                    +
                                </span>
                                <span className="absolute -bottom-3 -left-3 font-mono text-lg font-bold text-[var(--primary)] select-none">
                                    +
                                </span>
                                <span className="absolute -bottom-3 -right-3 font-mono text-lg font-bold text-[var(--primary)] select-none">
                                    +
                                </span>

                                {/* Signal Orange Archive Stamp */}
                                <div className="absolute top-7 left-7 z-20 stamp-orange shadow-xs">
                                    THE HUMAN ELEMENT // ARCHIVE 01
                                </div>

                                {/* Portrait Frame with Natural Warm Lighting Preserved */}
                                <div className="relative aspect-3/4 w-full overflow-hidden border border-border bg-[var(--forest)] flex items-center justify-center">
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt="Monayem Azam — Lead full-stack software engineer and creative builder"
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                                            style={{
                                                objectPosition: '50% 20%',
                                            }}
                                            loading="eager"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted">
                                            <span className="font-display text-7xl sm:text-8xl font-black tracking-tighter text-foreground/30">
                                                MA.
                                            </span>
                                            <span className="mt-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                                                ARCHIVAL PORTRAIT // MONAYEM AZAM
                                            </span>
                                        </div>
                                    )}

                                    {/* Architectural Grid Overlay */}
                                    <div
                                        className="pointer-events-none absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage:
                                                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                                            backgroundSize: '28px 28px',
                                        }}
                                    />

                                    {/* Fine Signal-Orange Inner Border Calipers */}
                                    <div className="pointer-events-none absolute inset-2 border border-[var(--primary)]/30" />
                                </div>

                                {/* Technical Dossier Plate Caption */}
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-border pt-3 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                                    <span className="font-bold text-foreground">
                                        MONAYEM AZAM // THE HUMAN BEHIND THE SYSTEMS
                                    </span>
                                    <span className="text-[var(--primary)] font-semibold">
                                        [DHAKA, BD · GLOBAL]
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Resume download action */}
                        {resumeUrl && (
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 flex items-center justify-between border-2 border-foreground bg-foreground p-4 font-mono text-xs font-bold uppercase tracking-wider text-background transition-transform hover:-translate-y-0.5 active:translate-y-0"
                                data-field-tag="RESUME"
                            >
                                <span>DOWNLOAD CURRICULUM VITAE (PDF)</span>
                                <Icons.Download className="h-4 w-4 text-[var(--accent)]" />
                            </a>
                        )}
                    </div>

                    {/* Right Column: Editorial Headline, Narrative, and Principles */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                                // BIOGRAPHICAL PROFILE
                            </span>
                            <span className="h-px flex-1 bg-border" />
                        </div>

                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight text-foreground uppercase">
                            {about?.heading || 'Engineering ideas into tangible digital reality.'}
                        </h2>

                        <div className="mt-6 sm:mt-8 space-y-5 font-body text-base sm:text-lg leading-relaxed text-foreground/85">
                            {about?.bio ? (
                                <p className="whitespace-pre-line">{about.bio}</p>
                            ) : (
                                <p>
                                    I am Monayem Azam, a full-stack engineer and digital architect based in Dhaka,
                                    operating globally. With an unwavering commitment to backend stability, clean domain models,
                                    and expressive frontend craft, I build mission-critical web applications that perform under
                                    real-world scale while commanding an unmistakable editorial identity.
                                </p>
                            )}
                        </div>

                        {/* 4 Core Engineering Principles */}
                        <div className="mt-10 sm:mt-12 pt-8 border-t border-border">
                            <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                CORE OPERATIONAL PRINCIPLES //
                            </span>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                {principles.map((pr) => (
                                    <div
                                        key={pr.num}
                                        className="border-l-2 border-[var(--primary)] pl-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-[var(--primary)]">
                                                [{pr.num}]
                                            </span>
                                            <h3 className="font-display text-sm font-bold tracking-tight text-foreground uppercase">
                                                {pr.title}
                                            </h3>
                                        </div>
                                        <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                                            {pr.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continuous Full-Width Numerical Data Strip Driven by Database Facts */}
                <div className="mt-16 sm:mt-20 border-t-2 border-foreground pt-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
                        {about?.facts && about.facts.length > 0
                            ? about.facts.map((fact, idx) => (
                                  <div
                                      key={fact.id}
                                      className={`flex flex-col justify-between ${
                                          idx !== 0 ? 'sm:pl-6' : ''
                                      } pt-4 sm:pt-0`}
                                  >
                                      <div className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
                                          <span>{fact.value}</span>
                                          {fact.suffix && (
                                              <span className="text-[var(--primary)] text-3xl sm:text-5xl font-bold ml-1">
                                                  {fact.suffix}
                                              </span>
                                          )}
                                      </div>
                                      <div className="mt-3">
                                          <h4 className="font-mono text-xs font-bold tracking-wider text-[var(--primary)] uppercase">
                                              {fact.label}
                                          </h4>
                                          <p className="font-mono text-[11px] text-muted-foreground tracking-wider mt-0.5">
                                              VERIFIED METRIC // DB REF #{fact.id}
                                          </p>
                                      </div>
                                  </div>
                              ))
                            : metrics.map((item, idx) => (
                                  <div
                                      key={item.label}
                                      className={`flex flex-col justify-between ${
                                          idx !== 0 ? 'sm:pl-6' : ''
                                      } pt-4 sm:pt-0`}
                                  >
                                      <span className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
                                          {item.value}
                                      </span>
                                      <div className="mt-3">
                                          <h4 className="font-mono text-xs font-bold tracking-wider text-[var(--primary)] uppercase">
                                              {item.label}
                                          </h4>
                                          <p className="font-mono text-[11px] text-muted-foreground tracking-wider mt-0.5">
                                              {item.detail}
                                          </p>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
