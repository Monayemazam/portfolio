import React from 'react';
import * as LineIcons from 'lineicons-react';
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

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="services"
            aria-label="Capabilities Directory"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 04
                        </span>
                        <span>CAPABILITIES DIRECTORY // TECHNICAL OFFERINGS</span>
                    </div>
                    <span>TOTAL SERVICES: [{services.length.toString().padStart(2, '0')}]</span>
                </div>

                {/* Section Title */}
                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // WHAT I CAN BUILD
                        </span>
                        <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground uppercase">
                            SYSTEM CAPABILITIES.
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Disciplined full-stack offerings from foundational database schema design
                        to production deployment, creative frontends, and mission-critical API architectures.
                    </p>
                </div>

                {/* Structured Editorial Capabilities Grid with 1px Rules */}
                <div className="mt-12 divide-y-2 divide-foreground border-y-2 border-foreground">
                    {services.map((service, idx) => {
                        const IconComponent = resolveLineicon(service.icon);
                        const num = (idx + 1).toString().padStart(2, '0');

                        return (
                            <div
                                key={service.id}
                                className="group grid grid-cols-1 md:grid-cols-12 gap-6 py-8 sm:py-10 transition-colors hover:bg-surface px-4 sm:px-6"
                            >
                                {/* Numeral & Icon */}
                                <div className="md:col-span-2 flex items-center justify-between md:flex-col md:items-start md:justify-start gap-4">
                                    <span className="font-mono text-3xl sm:text-4xl font-black text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                                        {num} //
                                    </span>
                                    {IconComponent && (
                                        <div className="border border-border p-2 bg-background text-foreground">
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>

                                {/* Title & Scope */}
                                <div className="md:col-span-4">
                                    <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase">
                                        {service.title}
                                    </h3>
                                    <span className="mt-2 inline-block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                        SCOPE: ARCHITECTURE & DEPLOYMENT
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-4 flex items-center">
                                    <p className="font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Action */}
                                <div className="md:col-span-2 flex items-center md:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => scrollTo('contact')}
                                        className="font-mono text-xs font-bold text-[var(--primary)] uppercase tracking-wider hover:underline flex items-center gap-1.5"
                                        data-field-tag="SERVICE"
                                    >
                                        <span>COMMISSION [→]</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
