import React, { useState } from 'react';
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
    const [activeServiceId, setActiveServiceId] = useState<number | null>(
        services[0]?.id ?? null
    );

    const activeService =
        services.find((s) => s.id === activeServiceId) || services[0];

    const standardDeliverables = [
        'Production Deployment with Zero-Downtime Rollout',
        'High-Performance Relational Schema Design',
        'End-to-End Type Safety & API Interfaces',
        'Accessibility (WCAG AA) & Responsive Testing',
    ];

    return (
        <section
            id={section.key}
            aria-label="Interactive Capabilities System"
            className="w-full border-b-2 border-foreground bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28 select-none"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Calibration Eyebrow Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="stamp-orange text-[10px] tracking-widest">
                            SEC. 05 // SYSTEM
                        </span>
                        <span className="font-bold text-foreground">
                            CONNECTED CAPABILITIES MATRIX
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[var(--accent)] inline-block" />
                        <span>CATALOGUED DISCIPLINES: [{services.length.toString().padStart(2, '0')}]</span>
                    </div>
                </div>

                {/* Section Introduction */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // ARCHITECTURAL CAPABILITY SYSTEM
                        </span>
                        <h2 className="mt-2 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                            CONNECTED DISCIPLINE,
                            <br />
                            DELIVERED AT SCALE.
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Select a capability discipline to inspect verified engineering deliverables,
                        architectural focus areas, and technical implementation scopes.
                    </p>
                </div>

                {/* Main Connected Capabilities Console */}
                <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Typographic Capability Selector List */}
                    <div className="lg:col-span-6 border-2 border-foreground bg-surface divide-y-2 divide-foreground">
                        {services.map((service, idx) => {
                            const isSelected = service.id === activeService?.id;
                            const indexStr = (idx + 1).toString().padStart(2, '0');
                            const IconComponent = resolveLineicon(service.icon);

                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setActiveServiceId(service.id)}
                                    className={`group w-full p-6 sm:p-8 text-left transition-all flex items-start justify-between gap-4 ${
                                        isSelected
                                            ? 'bg-foreground text-background'
                                            : 'hover:bg-muted/30 text-foreground'
                                    }`}
                                    aria-expanded={isSelected}
                                >
                                    <div className="flex items-start gap-4">
                                        <span
                                            className={`font-mono text-xl sm:text-2xl font-black ${
                                                isSelected
                                                    ? 'text-[var(--accent)]'
                                                    : 'text-[var(--primary)]'
                                            }`}
                                        >
                                            {indexStr} //
                                        </span>

                                        <div>
                                            <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight">
                                                {service.title}
                                            </h3>
                                            <p
                                                className={`mt-2 font-body text-xs sm:text-sm line-clamp-2 max-w-md ${
                                                    isSelected
                                                        ? 'text-background/80'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {IconComponent && (
                                            <div
                                                className={`h-8 w-8 flex items-center justify-center border ${
                                                    isSelected
                                                        ? 'border-background/40 bg-background/20 text-background'
                                                        : 'border-border bg-background text-foreground'
                                                }`}
                                            >
                                                <IconComponent className="h-4 w-4" />
                                            </div>
                                        )}
                                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                                            {isSelected ? '● ACTIVE' : 'SELECT →'}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Focus Capability Display & Scope Matrix */}
                    {activeService && (
                        <div className="lg:col-span-6 border-2 border-foreground bg-surface p-6 sm:p-10 shadow-sm relative overflow-hidden">
                            {/* Caliper Registration Crosshairs */}
                            <span className="absolute top-3 left-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                                + [CAP.SPEC]
                            </span>
                            <span className="absolute top-3 right-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                                [DISCIPLINE] +
                            </span>
                            <span className="absolute bottom-3 left-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                                + [VERIFIED]
                            </span>
                            <span className="absolute bottom-3 right-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                                [PRODUCTION] +
                            </span>

                            {/* Service Details Header */}
                            <div className="flex items-center justify-between border-b-2 border-foreground pb-4 font-mono text-xs uppercase">
                                <div className="flex items-center gap-2">
                                    <span className="os-beacon" />
                                    <span className="font-bold text-foreground">
                                        FOCUSED CAPABILITY SCOPE
                                    </span>
                                </div>
                                <span className="stamp-orange text-[10px]">
                                    VERIFIED DISCIPLINE
                                </span>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground">
                                    {activeService.title}
                                </h4>
                                <p className="mt-4 font-body text-base sm:text-lg leading-relaxed text-foreground/85">
                                    {activeService.description}
                                </p>
                            </div>

                            {/* Deliverables & Technical Deliveries List */}
                            <div className="mt-8 border-t border-border pt-6">
                                <span className="font-mono text-xs font-bold uppercase text-[var(--primary)] tracking-wider block mb-4">
                                    // STANDARD ARCHITECTURAL DELIVERABLES
                                </span>

                                <div className="space-y-3 font-mono text-xs">
                                    {standardDeliverables.map((item, dIdx) => (
                                        <div
                                            key={dIdx}
                                            className="flex items-center gap-3 border border-border bg-background p-3.5"
                                        >
                                            <span className="h-1.5 w-1.5 bg-[var(--primary)] shrink-0" />
                                            <span className="font-bold text-foreground uppercase tracking-wide">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Direct Inquiry CTA button */}
                            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                                    READY TO COMMISSION THIS DISCIPLINE?
                                </span>
                                <a
                                    href="#contact"
                                    className="border-2 border-foreground bg-foreground text-background px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-colors"
                                >
                                    COMMISSION DISCIPLINE →
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
