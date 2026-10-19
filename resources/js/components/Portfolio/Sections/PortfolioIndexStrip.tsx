import React from 'react';
import { PortfolioSection } from '@/types/portfolio';

interface PortfolioIndexStripProps {
    sections?: PortfolioSection[];
    experiencesCount?: number;
    testimonialsCount?: number;
}

export default function PortfolioIndexStrip({
    sections = [],
    experiencesCount = 0,
    testimonialsCount = 0,
}: PortfolioIndexStripProps) {
    const candidateItems = [
        { id: 'about', title: 'ARCHIVAL PROFILE', desc: 'Background & Principles' },
        { id: 'skills', title: 'TECHNICAL FIELD GUIDE', desc: 'Languages & Systems' },
        { id: 'projects', title: 'CURATED EXHIBITION', desc: 'Case Studies & Production' },
        { id: 'services', title: 'CAPABILITIES DIRECTORY', desc: 'Architectural Offerings' },
        { id: 'experience', title: 'CHRONOLOGY OF PRACTICE', desc: 'Flight Log & Stations' },
        { id: 'process', title: 'METHODOLOGY SEQUENCE', desc: '6-Stage Delivery' },
        { id: 'testimonials', title: 'TRANSMISSIONS ARCHIVE', desc: 'Verified Observations' },
        { id: 'contact', title: 'DISPATCH & INQUIRY', desc: 'Initiate Communication' },
    ];

    const items = candidateItems
        .filter((item) => {
            if (item.id === 'experience' && experiencesCount === 0) return false;
            if (item.id === 'testimonials' && testimonialsCount === 0) return false;
            return (
                sections.length === 0 ||
                sections.some((s) => s.key === item.id && s.is_visible !== false)
            );
        })
        .map((item, idx) => ({
            ...item,
            num: (idx + 1).toString().padStart(2, '0'),
        }));

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            aria-label="Publication Contents Index"
            className="w-full border-b border-border bg-[var(--bg)]"
        >
            <div className="mx-auto max-w-[1440px] px-6 sm:px-8 xl:px-12 py-8 sm:py-10">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-6 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    <span>TABLE OF CONTENTS // ARCHIVE NAVIGATION</span>
                    <span className="hidden sm:inline">[CLICK TO JUMP SECTION]</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 divide-y md:divide-y-0 md:divide-x divide-border border border-border">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => scrollTo(item.id)}
                            className="group flex flex-col justify-between p-4 sm:p-5 text-left transition-colors hover:bg-foreground hover:text-background focus:outline-hidden"
                            data-field-tag={item.num}
                        >
                            <div>
                                <span className="font-mono text-2xl sm:text-3xl font-black text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                                    {item.num}
                                </span>
                                <h3 className="mt-2 font-display text-xs sm:text-sm font-bold tracking-tight uppercase line-clamp-1">
                                    {item.title}
                                </h3>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/40 group-hover:border-background/40">
                                <span className="font-mono text-[10px] text-muted-foreground group-hover:text-background/80 tracking-wider">
                                    {item.desc}
                                </span>
                                <span className="font-mono text-xs text-[var(--primary)] group-hover:text-white transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
