import React from 'react';
import { PortfolioSection, SkillItem } from '@/types/portfolio';

interface SkillsSectionProps {
    section: PortfolioSection;
    skills: SkillItem[];
    isOff?: boolean;
    isDark?: boolean;
}

export default function SkillsSection({
    section,
    skills,
}: SkillsSectionProps) {
    // Group skills strictly by their actual database category
    const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
        const cat = skill.category || 'General Engineering';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    const categories = Object.keys(grouped);

    // Dynamic category labels & index numbers
    const formatCategoryName = (cat: string) => {
        const clean = cat.replace(/[_-]/g, ' ').toUpperCase();
        return clean.includes('DEVELOPMENT') ? clean : `${clean} ENGINEERING`;
    };

    return (
        <section
            id={section.key}
            aria-label="Technical Field Guide"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 02
                        </span>
                        <span>TECHNICAL FIELD GUIDE // VERIFIED COMPETENCIES</span>
                    </div>
                    <div>
                        <span>TOTAL TECHNOLOGIES CATALOGUED: [{skills.length}]</span>
                    </div>
                </div>

                {/* Editorial Section Introduction */}
                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // METHODICAL TOOLING
                        </span>
                        <h2 className="mt-2 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                            AN ESTIMATE OF TECHNICAL MASTERY.
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Disciplined full-stack competence measured across active production deployments,
                        clean architectural patterns, and verified operational delivery.
                    </p>
                </div>

                {/* Primary Technology Anchor Banner */}
                <div className="mt-12 border-2 border-foreground bg-foreground p-6 sm:p-8 text-background">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-background/20 pb-4">
                        <span className="font-mono text-xs font-bold tracking-widest uppercase text-[var(--accent)]">
                            FEATURED TECHNICAL FOUNDATION //
                        </span>
                        <span className="font-mono text-[10px] tracking-widest opacity-80 uppercase">
                            DAILY PRODUCTION RUNTIME
                        </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { name: 'LARAVEL 12', role: 'Enterprise Backend Core' },
                            { name: 'REACT 19', role: 'Interactive Client Core' },
                            { name: 'TYPESCRIPT', role: 'End-to-End Type Safety' },
                            { name: 'THREE.JS', role: 'WebGL & Creative Canvas' },
                            { name: 'MYSQL', role: 'Relational Data Stores' },
                        ].map((tech) => (
                            <div
                                key={tech.name}
                                className="border border-background/20 p-4 transition-colors hover:border-[var(--accent)]"
                            >
                                <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white uppercase block">
                                    {tech.name}
                                </span>
                                <span className="font-mono text-[10px] text-background/70 tracking-wider mt-1 block uppercase">
                                    {tech.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categorized Technical Field Guide Cards with Alternating Sand/Paper Backdrops */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map((category, catIdx) => {
                        const items = grouped[category];
                        const indexNum = (catIdx + 1).toString().padStart(2, '0');
                        const isEven = catIdx % 2 === 1;

                        return (
                            <div
                                key={category}
                                className={`border-2 border-foreground p-6 sm:p-8 transition-transform hover:-translate-y-1 ${
                                    isEven ? 'bg-[var(--surface-sand)]/60 dark:bg-muted/30' : 'bg-surface'
                                }`}
                            >
                                {/* Category Header */}
                                <div className="flex items-start justify-between border-b-2 border-foreground pb-4">
                                    <div>
                                        <span className="font-mono text-2xl sm:text-3xl font-black text-[var(--primary)]">
                                            {indexNum} //
                                        </span>
                                        <h3 className="mt-1 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground uppercase">
                                            {formatCategoryName(category)}
                                        </h3>
                                    </div>
                                    <span className="stamp-ink text-[10px]">
                                        {items.length} {items.length === 1 ? 'RECORD' : 'RECORDS'}
                                    </span>
                                </div>

                                {/* Skills Tabular Field List */}
                                <div className="mt-6 divide-y divide-border">
                                    {items.map((skill) => {
                                        const level = skill.level ?? 85;
                                        return (
                                            <div
                                                key={skill.id}
                                                className="py-3.5 flex items-center justify-between gap-4 font-mono text-xs"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="h-1.5 w-1.5 bg-[var(--primary)] inline-block" />
                                                    <span className="font-display font-bold text-foreground text-sm tracking-tight">
                                                        {skill.name}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {/* Restrained Technical Level Indicator */}
                                                    <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-muted-foreground tracking-widest">
                                                        <span>[</span>
                                                        <span className="text-[var(--primary)] font-bold">
                                                            {level}%
                                                        </span>
                                                        <span>]</span>
                                                    </div>

                                                    <span className="border border-border px-2 py-0.5 text-[10px] font-bold text-foreground uppercase tracking-wider bg-background">
                                                        {level >= 90 ? 'LEAD' : level >= 80 ? 'ADVANCED' : 'CORE'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
