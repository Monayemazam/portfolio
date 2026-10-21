import React from 'react';
import * as LineIcons from 'lineicons-react';
import { PortfolioSection, ServiceItem } from '@/types/portfolio';

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
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );

    return (
        <section
            id={section.key}
            aria-label="Services and Solutions"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none"
        >
            {/* Subtle Ethereal Forest-Green Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1/4 left-10 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-20 blur-[130px]"
            />

            <div className="mx-auto max-w-[1440px]">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    <span className="font-bold text-foreground">SERVICES</span>
                    <span className="text-border">/</span>
                    <span>WHAT I DO</span>
                </div>

                {/* Section Title */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // CRAFT & CAPABILITIES
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
                            SERVICES &amp; SOLUTIONS
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Practical digital solutions built with clean architecture, thoughtful design, and solid engineering.
                    </p>
                </div>

                {/* Services Cards Grid */}
                <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {sortedServices.map((service, idx) => {
                        const IconComponent = resolveLineicon(service.icon);
                        const indexStr = (idx + 1).toString().padStart(2, '0');

                        return (
                            <div
                                key={service.id}
                                className="group relative rounded-2xl border border-border/60 bg-surface/40 backdrop-blur-md p-8 sm:p-10 transition-all duration-300 hover:border-[var(--primary)]/60 hover:bg-surface/70 hover:shadow-[0_0_30px_rgba(241,90,36,0.12)] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between pb-6 border-b border-border/30">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]">
                                            {IconComponent ? (
                                                <IconComponent className="h-6 w-6" />
                                            ) : (
                                                <span className="font-mono text-xs font-bold">
                                                    {indexStr}
                                                </span>
                                            )}
                                        </div>

                                        <span className="font-mono text-xs text-muted-foreground">
                                            {indexStr}
                                        </span>
                                    </div>

                                    <h3 className="mt-6 font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-4 border-t border-border/20 flex items-center justify-between">
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[var(--primary)] uppercase tracking-wider hover:underline"
                                    >
                                        <span>Discuss Project</span>
                                        <span className="font-sans">→</span>
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
