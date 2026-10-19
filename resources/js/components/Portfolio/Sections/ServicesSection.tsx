import React from 'react';
import * as LineIcons from 'lineicons-react';
import { PortfolioSection, ServiceItem } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';

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

    return (
        <section
            id="services"
            aria-label="Services Space Stations"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    eyebrow={section.eyebrow || 'MISSION 05 / SPACE STATIONS'}
                    title={
                        section.title || 'Engineering Services & Capabilities'
                    }
                    subtitle={
                        section.subtitle ||
                        'Specialized orbital architectures, high-performance web systems, and full-stack solutions.'
                    }
                    highlightWord="Capabilities"
                />

                {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const IconComponent = service.icon
                            ? iconMap[service.icon]
                            : null;
                        const stationNumber = String(index + 1).padStart(
                            2,
                            '0',
                        );

                        return (
                            <GlassPanel
                                key={service.id}
                                variant="card"
                                interactive
                                className="section-reveal group flex flex-col justify-between border-[var(--surface-border)]"
                            >
                                <div>
                                    {/* Icon & Station Index Header */}
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--secondary)] transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--secondary)] group-hover:shadow-[0_0_16px_var(--secondary)]">
                                            {IconComponent ? (
                                                <IconComponent className="h-6 w-6 text-[var(--secondary)]" />
                                            ) : (
                                                <span className="font-mono text-sm font-bold text-[var(--secondary)]">
                                                    #{stationNumber}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-mono text-xs tracking-wider text-[var(--text-muted)]">
                                            STATION {stationNumber}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="font-display text-xl font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)]">
                                        {service.title}
                                    </h3>
                                    <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--text-muted)]">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Station Telemetry Footer */}
                                <div className="mt-6 flex items-center justify-between border-t border-[var(--surface-border)]/50 pt-4 font-mono text-[10px] text-[var(--text-muted)]">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                                        <span>SYSTEM DEPLOYABLE</span>
                                    </div>
                                    <span className="font-semibold text-[var(--primary)]">
                                        DOCK READY
                                    </span>
                                </div>
                            </GlassPanel>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
