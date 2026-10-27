import React from 'react';
import * as LineIcons from 'lineicons-react';
import { PortfolioSection, ServiceItem } from '@/types/portfolio';
import { ArrowRight } from '../Shared/Icons';

interface ServicesSectionProps {
    section: PortfolioSection;
    services: ServiceItem[];
    isOff?: boolean;
}

const iconMap = LineIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
>;

function resolveLineicon(iconName?: string | null) {
    if (!iconName) return null;
    if (iconMap[iconName]) return iconMap[iconName];
    const clean = iconName.replace(/^lni-/, '');
    const pascal = clean
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
    return iconMap[pascal] || iconMap[`Lni${pascal}`] || null;
}

export default function ServicesSection({
    section,
    services,
}: ServicesSectionProps) {
    const sortedServices = [...services].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

    return (
        <section
            id={section.key}
            aria-label="Services — Structured Editorial Layout"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none bg-[var(--bg)] border-t border-[var(--surface-border)]"
        >
            {/* Ambient Nebula Light in Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1/4 left-10 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-20 blur-[140px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* 1. Technical Coordinate Breadcrumb */}
                <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                    <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                        <span className="font-bold text-[var(--text)]">SERVICES</span>
                        <span className="text-[var(--surface-border)]">/</span>
                        <span>STRUCTURED EDITORIAL LAYOUT</span>
                    </div>
                    <span className="text-[11px] hidden sm:inline">
                        SOLUTIONS // {sortedServices.length} CORE CAPABILITIES
                    </span>
                </div>

                {/* 2. Section Heading & Narrative */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // 03 · SPECIALISED CAPABILITIES
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] uppercase leading-tight">
                            WHAT CLIENTS HIRE ME TO BUILD.
                        </h2>
                    </div>

                    <p className="max-w-md font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        Practical digital services built with clean architecture, thoughtful interface design, and solid full-stack engineering.
                    </p>
                </div>

                {/* 3. Numbered Architectural Rows List (Not Cards!) */}
                <div className="mt-14 divide-y divide-[var(--surface-border)] border-y border-[var(--surface-border)]">
                    {sortedServices.map((service, idx) => {
                        const IconComponent = resolveLineicon(service.icon);
                        const indexStr = (idx + 1).toString().padStart(2, '0');

                        return (
                            <div
                                key={service.id}
                                className="group relative flex flex-col lg:flex-row lg:items-center justify-between py-8 sm:py-10 transition-all duration-200 hover:bg-[var(--surface)]/50 px-4 sm:px-6 rounded-2xl -mx-4 sm:-mx-6"
                            >
                                {/* Left Side: Index & Icon & Title */}
                                <div className="flex items-start lg:items-center gap-5 sm:gap-8 max-w-xl">
                                    <span className="font-mono text-2xl sm:text-3xl font-black text-[var(--text-muted)] transition-colors duration-200 group-hover:text-[var(--primary)] shrink-0">
                                        {indexStr}
                                    </span>

                                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-200 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] shrink-0">
                                        {IconComponent ? (
                                            <IconComponent className="h-6 w-6" />
                                        ) : (
                                            <span className="font-mono text-xs font-bold">
                                                {indexStr}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                                            {service.title}
                                        </h3>
                                        <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mt-1">
                                            PRODUCTION SPEC // CAPABILITY {indexStr}
                                        </span>
                                    </div>
                                </div>

                                {/* Center: Concise Description */}
                                <div className="mt-4 lg:mt-0 lg:max-w-md lg:px-6">
                                    <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Right Side: Direct Action */}
                                <div className="mt-6 lg:mt-0 shrink-0">
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-200 group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] group-hover:shadow-[0_0_12px_rgba(241,90,36,0.2)]"
                                    >
                                        <span>Start a Project</span>
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
