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
            aria-label="Planetary Technical Skills Universe"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none"
        >
            {/* Ambient Background Nebulae */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 right-10 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--forest)] opacity-25 blur-[140px]"
            />

            <div className="mx-auto max-w-[1440px]">
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                    <span>02 // SKILLS CONSTELLATION</span>
                    <span className="text-border">·</span>
                    <span className="text-foreground font-semibold">
                        PLANETARY TECHNICAL ARCHITECTURE
                    </span>
                </div>

                {/* Section Title & Manifesto */}
                <div className="mt-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // ORBITAL CAPABILITY SYSTEM
                        </span>
                        <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground uppercase leading-tight">
                            TECHNICAL EXPERTISE,
                            <br />
                            MAPPED AS A SOLAR SYSTEM.
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Explore core engineering sectors by switching orbital bands. Each planetary group
                        represents verified mastery in active production deployments.
                    </p>
                </div>

                {/* Planetary Category Waypoint Orbit Controls */}
                <div className="mt-14 flex flex-wrap gap-4 sm:gap-6">
                    {categories.map((cat, idx) => {
                        const isSelected = cat === selectedCategory;
                        const catNumber = (idx + 1).toString().padStart(2, '0');
                        const count = grouped[cat]?.length || 0;

                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`group flex items-center gap-4 rounded-full border px-6 py-3.5 transition-all focus:outline-hidden ${
                                    isSelected
                                        ? 'border-[var(--primary)] bg-[var(--primary)]/15 text-foreground shadow-[0_0_20px_rgba(241,90,36,0.25)]'
                                        : 'border-border/80 bg-surface/40 backdrop-blur-sm text-muted-foreground hover:border-foreground/50 hover:text-foreground'
                                }`}
                                aria-pressed={isSelected}
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                                        isSelected
                                            ? 'bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] scale-125'
                                            : 'bg-muted-foreground/60 group-hover:bg-foreground'
                                    }`}
                                />
                                <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                                    SECTOR {catNumber} // {cat.replace(/[_-]/g, ' ')}
                                </span>
                                <span className="rounded-full bg-surface px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/60">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Transformed Planetary Stage & Technical Constellation Panel */}
                <div className="mt-10 rounded-2xl border border-border/80 bg-surface/60 backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-rim-light">
                    {/* Stage Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
                        <div className="flex items-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_10px_var(--accent)]" />
                            <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
                                {formatCategoryName(selectedCategory)}
                            </h3>
                        </div>
                        <span className="font-mono text-xs text-[var(--primary)] font-semibold tracking-wider">
                            [{activeSkills.length} VERIFIED TECHNOLOGIES IN ORBIT]
                        </span>
                    </div>

                    {/* Skill Constellation Grid */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeSkills.map((skill, index) => {
                            const IconComponent = resolveLineicon(skill.icon);
                            const level = skill.level ?? 80;
                            const isHighLevel = level >= 90;
                            const levelLabel = level >= 90 ? 'LEAD' : level >= 80 ? 'ADVANCED' : 'CORE';

                            return (
                                <div
                                    key={skill.id}
                                    className={`group flex items-center justify-between rounded-xl border border-border/60 bg-surface/50 backdrop-blur-md p-5 transition-all duration-300 hover:border-[var(--primary)] hover:bg-surface/90 hover:shadow-[0_0_25px_rgba(241,90,36,0.15)] hover:-translate-y-1 ${
                                        !isOff
                                            ? 'animate-in fade-in slide-in-from-bottom-2 duration-300'
                                            : ''
                                    }`}
                                    style={{
                                        animationDelay: `${index * 40}ms`,
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon or Monogram */}
                                        {IconComponent ? (
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-surface text-foreground transition-colors group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]">
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                        ) : (
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-surface font-mono text-xs font-black text-foreground group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]">
                                                {skill.name.slice(0, 2).toUpperCase()}
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-display text-base sm:text-lg font-black tracking-tight text-foreground uppercase group-hover:text-[var(--primary)] transition-colors">
                                                {skill.name}
                                            </h4>
                                            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                                                CONFIDENCE: {level}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Level Pill */}
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
                                            isHighLevel
                                                ? 'border-[var(--accent)]/50 bg-[var(--accent)]/15 text-[var(--accent)]'
                                                : 'border-border bg-surface text-muted-foreground'
                                        }`}
                                    >
                                        {levelLabel}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
