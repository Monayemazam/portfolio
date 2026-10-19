import React from 'react';
import * as LineIcons from 'lineicons-react';
import { ArrowAngularTopRight, Sparkle } from '../Shared/Icons';
import { PortfolioSection, ServiceItem } from '@/types/portfolio';

interface ServicesSectionProps {
    section: PortfolioSection;
    services: ServiceItem[];
}

export default function ServicesSection({
    section,
    services,
}: ServicesSectionProps) {
    if (!services || services.length === 0) return null;

    const iconMap = LineIcons as unknown as Record<
        string,
        React.ComponentType<{ className?: string }>
    >;

    const resolveLineicon = (iconName?: string | null) => {
        if (!iconName) return null;
        if (iconMap[iconName]) return iconMap[iconName];
        const clean = iconName.replace(/^lni-/, '');
        const pascal = clean
            .split(/[-_]/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
        return iconMap[pascal] || null;
    };

    const eyebrow = section.eyebrow || 'CAPABILITIES & SPECIALIZATIONS';
    const title = section.title || 'What I Can Build';
    const subtitle =
        section.subtitle ||
        'Engineered for speed, scale, and longevity. Tailored solutions from architecture to production deployment.';

    return (
        <section
            id="services"
            aria-label="Services Section"
            className="relative w-full overflow-hidden px-4 py-24 sm:px-6 sm:py-32 md:px-10 lg:px-16 lg:py-36 xl:px-20"
        >
            {/* Ambient Lighting */}
            <div
                className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[140px]"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1440px]">
                {/* Header Section */}
                <div className="flex flex-col items-start max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                        <Sparkle className="h-3.5 w-3.5 text-[var(--secondary)]" />
                        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                            {eyebrow}
                        </span>
                    </div>

                    <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight text-[var(--text)]">
                        {title}
                    </h2>

                    <p className="mt-4 font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                        {subtitle}
                    </p>
                </div>

                {/* Services Grid: 3 columns desktop, 2 tablet, 1 mobile */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const IconComponent = resolveLineicon(service.icon);
                        const serviceNumber = String(index + 1).padStart(
                            2,
                            '0',
                        );

                        return (
                            <div
                                key={service.id}
                                className="group relative flex flex-col justify-between rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--secondary)] hover:shadow-[0_20px_45px_rgba(83,224,247,0.12)]"
                            >
                                <div>
                                    {/* Icon & Index Number */}
                                    <div className="mb-8 flex items-center justify-between">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-[var(--secondary)] group-hover:shadow-[0_0_20px_rgba(83,224,247,0.3)]">
                                            {IconComponent ? (
                                                <IconComponent className="h-7 w-7" />
                                            ) : (
                                                <span className="font-mono text-base font-bold">
                                                    {serviceNumber}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-mono text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--secondary)] transition-colors">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="font-display text-2xl font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)]">
                                        {service.title}
                                    </h3>

                                    <p className="mt-4 font-sans text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Bottom Contact CTA */}
                                <div className="mt-8 border-t border-[var(--surface-border)]/50 pt-5">
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[var(--secondary)] transition-transform duration-200 group-hover:translate-x-1"
                                    >
                                        <span>Start a project like this</span>
                                        <ArrowAngularTopRight className="h-3.5 w-3.5" />
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
