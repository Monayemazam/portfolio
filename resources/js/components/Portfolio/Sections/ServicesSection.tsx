import React, { useEffect, useRef, useState } from 'react';
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

interface ServiceCardProps {
    service: ServiceItem;
    idx: number;
    isOff?: boolean;
    onSelect: () => void;
}

function MagneticServiceCard({ service, idx, isOff, onSelect }: ServiceCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [inView, setInView] = useState(false);
    const IconComponent = resolveLineicon(service.icon);
    const serviceNumber = (idx + 1).toString().padStart(2, '0');

    // Docking direction: left column from left, right column from right, middle from bottom
    const colPosition = idx % 3;
    const dockTranslateClass = colPosition === 0 ? '-translate-x-6' : colPosition === 2 ? 'translate-x-6' : 'translate-y-6';

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.05, rootMargin: '50px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isOff || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Subtle magnetic pull (max ~8px)
        const moveX = (e.clientX - centerX) * 0.08;
        const moveY = (e.clientY - centerY) * 0.08;
        setOffset({ x: moveX, y: moveY });
    };

    const handleMouseLeave = () => {
        setOffset({ x: 0, y: 0 });
    };

    const hasOffset = offset.x !== 0 || offset.y !== 0;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={
                hasOffset
                    ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
                    : undefined
            }
            className={`group relative flex flex-col justify-between border-2 border-foreground bg-surface p-6 sm:p-8 transition-all duration-500 hover:border-[var(--primary)] ${
                inView || isOff ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${dockTranslateClass}`
            }`}
            data-field-tag={`SRV-${serviceNumber}`}
        >
            {/* Top Bar: Serial Number & Technical Indicator */}
            <div>
                <div className="flex items-center justify-between border-b border-border pb-4 font-mono text-xs">
                    <span className="text-2xl sm:text-3xl font-black text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                        {serviceNumber} //
                    </span>
                    {IconComponent && (
                        <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-transform group-hover:scale-105 group-hover:border-[var(--primary)]">
                            <IconComponent className="h-5 w-5" />
                        </div>
                    )}
                </div>

                {/* Service Title */}
                <h3 className="mt-6 font-display text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase">
                    {service.title}
                </h3>

                <div className="mt-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    SPECIFICATION: FULL-CYCLE DELIVERY
                </div>

                {/* Description */}
                <p className="mt-4 font-body text-sm sm:text-base leading-relaxed text-foreground/80">
                    {service.description}
                </p>
            </div>

            {/* Bottom Commission Trigger */}
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    AVAILABLE
                </span>
                <button
                    type="button"
                    onClick={onSelect}
                    className="font-mono text-xs font-bold text-[var(--primary)] uppercase tracking-wider group-hover:underline flex items-center gap-1.5 focus:outline-hidden"
                >
                    <span>COMMISSION</span>
                    <span className="transition-transform group-hover:translate-x-1">[→]</span>
                </button>
            </div>
        </div>
    );
}

export default function ServicesSection({
    section,
    services,
    isOff,
}: ServicesSectionProps) {
    if (!services || services.length === 0) return null;

    const scrollToContact = () => {
        const el = document.getElementById('contact');
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
                            {section?.title || 'SERVICES'}
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Disciplined full-stack offerings from foundational database schema design
                        to production deployment, creative frontends, and mission-critical API architectures.
                    </p>
                </div>

                {/* 3 Columns Desktop, 2 Tablet, 1 Mobile per Design Section 6 */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {services.map((service, idx) => (
                        <MagneticServiceCard
                            key={service.id}
                            service={service}
                            idx={idx}
                            isOff={isOff}
                            onSelect={scrollToContact}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
