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
            aria-label="Capabilities System"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none"
        >
            {/* Ambient Nebula */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1/4 left-10 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-20 blur-[130px]"
            />

            <div className="mx-auto max-w-[1440px]">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    <span>04 // CAPABILITY SYSTEMS</span>
                    <span className="text-border">·</span>
                    <span className="text-foreground font-semibold">
                        CONNECTED DISCIPLINE MATRIX
                    </span>
                </div>

                {/* Section Title */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // ARCHITECTURAL DISCIPLINES
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
                            ENGINEERED CAPABILITIES,
                            <br />
                            DELIVERED AT SCALE.
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Select a capability to inspect verified engineering deliverables,
                        architectural focus areas, and technical implementation scopes.
                    </p>
                </div>

                {/* Connected Capability System Spread */}
                <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Capability Selector Items */}
                    <div className="lg:col-span-5 space-y-4">
                        {services.map((service, idx) => {
                            const isSelected = service.id === activeService?.id;
                            const IconComponent = resolveLineicon(service.icon);
                            const indexStr = (idx + 1).toString().padStart(2, '0');

                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setActiveServiceId(service.id)}
                                    className={`group w-full rounded-2xl border p-6 text-left transition-all flex items-center justify-between gap-4 focus:outline-hidden ${
                                        isSelected
                                            ? 'border-[var(--primary)] bg-surface shadow-[0_0_30px_rgba(241,90,36,0.2)]'
                                            : 'border-border/60 bg-surface/40 backdrop-blur-md hover:border-foreground/40 hover:bg-surface/70'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                                                isSelected
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]'
                                                    : 'border-border bg-surface text-muted-foreground group-hover:text-foreground'
                                            }`}
                                        >
                                            {IconComponent ? (
                                                <IconComponent className="h-6 w-6" />
                                            ) : (
                                                <span className="font-mono text-xs font-bold">
                                                    {indexStr}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-foreground">
                                                {service.title}
                                            </h3>
                                            <span className="font-mono text-xs text-muted-foreground uppercase">
                                                DISCIPLINE {indexStr}
                                            </span>
                                        </div>
                                    </div>

                                    <span
                                        className={`font-sans text-xl transition-transform ${
                                            isSelected
                                                ? 'text-[var(--primary)] translate-x-1 font-bold'
                                                : 'text-muted-foreground group-hover:text-foreground'
                                        }`}
                                    >
                                        →
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Column: Active Capability Focus Presentation */}
                    {activeService && (
                        <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-surface/60 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl relative space-rim-light">
                            {/* Focus Header */}
                            <div className="flex items-center justify-between border-b border-border/40 pb-5">
                                <div className="flex items-center gap-3">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
                                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                        ACTIVE CAPABILITY SCOPE
                                    </span>
                                </div>
                                <span className="rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[var(--primary)]">
                                    VERIFIED DISCIPLINE
                                </span>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-display text-2xl sm:text-4xl font-black uppercase text-foreground leading-tight">
                                    {activeService.title}
                                </h4>
                                <p className="mt-4 font-body text-base sm:text-lg leading-relaxed text-foreground/80">
                                    {activeService.description}
                                </p>
                            </div>

                            {/* Standard Deliverables Scope */}
                            <div className="mt-8 pt-6 border-t border-border/40">
                                <span className="font-mono text-xs font-bold uppercase text-[var(--primary)] tracking-wider block mb-4">
                                    // ARCHITECTURAL DELIVERABLES & INTEGRATION
                                </span>

                                <div className="space-y-3 font-mono text-xs">
                                    {standardDeliverables.map((item, dIdx) => (
                                        <div
                                            key={dIdx}
                                            className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface/50 p-3.5"
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                                            <span className="text-foreground uppercase tracking-wide">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Commission CTA */}
                            <div className="mt-8 pt-6 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
                                <span className="font-mono text-xs text-muted-foreground uppercase">
                                    READY TO COMMISSION THIS DISCIPLINE?
                                </span>
                                <a
                                    href="#contact"
                                    className="flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[var(--primary)]/90 hover:shadow-[0_0_20px_rgba(241,90,36,0.3)] transition-all"
                                >
                                    <span>COMMISSION DISCIPLINE</span>
                                    <span className="font-sans">→</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
