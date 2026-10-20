import React, { useMemo, useState } from 'react';
import * as LineIcons from 'lineicons-react';
import { PortfolioSection, SkillItem } from '@/types/portfolio';

interface SkillsSectionProps {
    section: PortfolioSection;
    skills: SkillItem[];
    isOff?: boolean;
    isDark?: boolean;
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

export default function SkillsSection({
    section,
    skills,
    isOff = false,
}: SkillsSectionProps) {
    // Group skills by category
    const grouped = useMemo(() => {
        return skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
            const cat = skill.category || 'Core Engineering';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {});
    }, [skills]);

    const categories = Object.keys(grouped);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        categories[0] || 'Backend Engineering'
    );

    const activeSkills = grouped[selectedCategory] || [];
    const activeCategoryIndex = categories.indexOf(selectedCategory);

    const formatCategoryName = (cat: string) => {
        const clean = cat.replace(/[_-]/g, ' ').toUpperCase();
        return clean.includes('DEVELOPMENT') || clean.includes('ENGINEERING')
            ? clean
            : `${clean} ENGINEERING`;
    };

    return (
        <section
            id={section.key}
            aria-label="Living Technical Skills Instrument"
            className="w-full border-b-2 border-foreground bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28 select-none"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Calibration Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="stamp-orange text-[10px] tracking-widest">
                            SEC. 03 // INSTRUMENT
                        </span>
                        <span className="font-bold text-foreground">
                            TECHNICAL FIELD GUIDE & CAPABILITIES
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[var(--accent)] inline-block" />
                        <span>CATALOGUE: [{skills.length} VERIFIED TECHNOLOGIES]</span>
                    </div>
                </div>

                {/* Section Introduction */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // RUNTIME CAPABILITIES
                        </span>
                        <h2 className="mt-2 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
                            LIVING TECHNICAL
                            <br />
                            INSTRUMENT PANEL.
                        </h2>
                    </div>
                    <p className="max-w-md font-mono text-xs text-muted-foreground leading-relaxed uppercase">
                        Select an engineering channel to transform the instrument stage.
                        Evaluated against verified production deployments, high-availability architecture,
                        and clean design patterns.
                    </p>
                </div>

                {/* Large Typographic Category Selectors (Instrument Channels) */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-foreground bg-surface">
                    {categories.map((cat, idx) => {
                        const isSelected = cat === selectedCategory;
                        const catNumber = (idx + 1).toString().padStart(2, '0');
                        const count = grouped[cat]?.length || 0;

                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`group relative flex flex-col justify-between p-6 sm:p-8 text-left transition-all border-b md:border-b-0 md:border-r border-foreground last:border-r-0 ${
                                    isSelected
                                        ? 'bg-foreground text-background'
                                        : 'hover:bg-muted/40 text-foreground'
                                }`}
                                aria-pressed={isSelected}
                            >
                                <div className="flex items-center justify-between w-full font-mono text-xs">
                                    <span
                                        className={`font-black tracking-wider ${
                                            isSelected ? 'text-[var(--accent)]' : 'text-[var(--primary)]'
                                        }`}
                                    >
                                        CHANNEL // {catNumber}
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 text-[10px] font-bold border ${
                                            isSelected
                                                ? 'border-background/40 bg-background/20 text-background'
                                                : 'border-border bg-background text-foreground'
                                        }`}
                                    >
                                        {count} STACKS
                                    </span>
                                </div>

                                <div className="mt-6 font-display text-xl sm:text-2xl font-black uppercase tracking-tight">
                                    {formatCategoryName(cat)}
                                </div>

                                <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase opacity-80">
                                    <span>STATUS: {isSelected ? 'ACTIVE CHANNEL' : 'STANDBY'}</span>
                                    <span className="font-sans font-bold">
                                        {isSelected ? '●' : '→'}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* The Transformed Instrument Stage */}
                <div className="mt-8 border-2 border-foreground bg-surface p-6 sm:p-10 shadow-sm relative overflow-hidden">
                    {/* Stage Caliper Markers */}
                    <span className="absolute top-3 left-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                        + [CH.{activeCategoryIndex + 1}]
                    </span>
                    <span className="absolute top-3 right-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                        [STAGE_ACTIVE] +
                    </span>
                    <span className="absolute bottom-3 left-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                        + [SYS_READY]
                    </span>
                    <span className="absolute bottom-3 right-3 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                        [VERIFIED] +
                    </span>

                    {/* Active Channel Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-foreground pb-4 font-mono text-xs uppercase">
                        <div className="flex items-center gap-3">
                            <span className="os-beacon" />
                            <span className="font-bold text-foreground text-sm">
                                ACTIVE SECTOR: {formatCategoryName(selectedCategory)}
                            </span>
                        </div>
                        <span className="stamp-orange text-[10px]">
                            {activeSkills.length} TECHNOLOGIES ENGAGED
                        </span>
                    </div>

                    {/* Dynamic Skill Roster with Kinetic Entry */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeSkills.map((skill, index) => {
                            const IconComponent = resolveLineicon(skill.icon);
                            const level = skill.level ?? 80;
                            const isHighLevel = level >= 90;
                            const levelLabel = level >= 90 ? 'LEAD' : level >= 80 ? 'ADVANCED' : 'CORE';

                            return (
                                <div
                                    key={skill.id}
                                    className={`group relative flex flex-col justify-between border-2 border-foreground bg-background p-5 transition-all duration-300 hover:border-[var(--primary)] hover:-translate-y-1 ${
                                        !isOff
                                            ? 'animate-in fade-in slide-in-from-bottom-2 duration-300'
                                            : ''
                                    }`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                    }}
                                >
                                    {/* Top Row: Icon + Skill Name + Level Badge */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {IconComponent ? (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-foreground bg-surface text-foreground transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                            ) : (
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-foreground bg-surface font-mono text-xs font-black text-foreground group-hover:bg-[var(--primary)] group-hover:text-white">
                                                    {skill.name.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="font-display text-lg font-black tracking-tight text-foreground uppercase group-hover:text-[var(--primary)] transition-colors">
                                                    {skill.name}
                                                </h3>
                                                <span className="font-mono text-[10px] text-muted-foreground uppercase">
                                                    RATING: {level}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <span
                                            className={`font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider border ${
                                                isHighLevel
                                                    ? 'bg-[var(--accent)] text-[#171914] border-foreground'
                                                    : 'bg-surface text-foreground border-border'
                                            }`}
                                        >
                                            {levelLabel}
                                        </span>
                                    </div>

                                    {/* Bottom Calibration Footnote */}
                                    <div className="mt-6 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] text-muted-foreground uppercase">
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-1.5 w-1.5 bg-[var(--primary)] inline-block" />
                                            STATION: 2026
                                        </span>
                                        <span className="font-bold text-foreground">
                                            VERIFIED PRODUCTION
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
