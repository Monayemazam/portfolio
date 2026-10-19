import React from 'react';

export default function PortfolioIndexStrip() {
    const items = [
        { id: 'about', num: '01', title: 'ARCHIVAL PROFILE', desc: 'Background & Principles' },
        { id: 'skills', num: '02', title: 'TECHNICAL FIELD GUIDE', desc: 'Languages & Systems' },
        { id: 'projects', num: '03', title: 'CURATED EXHIBITION', desc: 'Case Studies & Production' },
        { id: 'services', num: '04', title: 'CAPABILITIES DIRECTORY', desc: 'Architectural Offerings' },
        { id: 'process', num: '05', title: 'METHODOLOGY SEQUENCE', desc: '6-Stage Delivery' },
        { id: 'contact', num: '06', title: 'DISPATCH & INQUIRY', desc: 'Initiate Communication' },
    ];

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
