import React, { useMemo, useState } from 'react';
import * as LineIcons from 'lineicons-react';
import { PortfolioSection, SkillItem } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';
import ConstellationMap from './ConstellationMap';

interface SkillsSectionProps {
    section: PortfolioSection;
    skills: SkillItem[];
    isOff?: boolean;
    isDark?: boolean;
}

export default function SkillsSection({
    section,
    skills,
    isOff = false,
    isDark = true,
}: SkillsSectionProps) {
    const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

    // Group skills by category respecting sort_order
    const groupedSkills = useMemo(() => {
        const groups: Record<string, SkillItem[]> = {};
        for (const skill of skills) {
            const cat = skill.category || 'General';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(skill);
        }
        return groups;
    }, [skills]);

    const categories = Object.keys(groupedSkills);
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

    return (
        <section
            id="skills"
            aria-label="Skills Constellations"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    eyebrow={section.eyebrow || 'MISSION 03 / CONSTELLATIONS'}
                    title={section.title || 'Technical Skills & Arsenal'}
                    subtitle={
                        section.subtitle ||
                        'Star systems of engineering proficiencies grouped by architectural domain.'
                    }
                    highlightWord="Arsenal"
                />

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const categorySkills = groupedSkills[category];

                        return (
                            <GlassPanel
                                key={category}
                                variant="card"
                                className="section-reveal flex flex-col justify-between border-[var(--surface-border)]"
                            >
                                <div>
                                    {/* Category Header */}
                                    <div className="mb-4 flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-[var(--secondary)] shadow-[0_0_8px_var(--secondary)]" />
                                            <h3 className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--secondary)] uppercase">
                                                {category}
                                            </h3>
                                        </div>
                                        <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                                            {categorySkills.length} STARS
                                        </span>
                                    </div>

                                    {/* DESKTOP & TABLET: SVG Constellation Map with connecting lines & tooltips */}
                                    <div className="hidden md:block">
                                        <ConstellationMap
                                            category={category}
                                            skills={categorySkills}
                                            activeSkill={selectedSkill}
                                            onSelectSkill={setSelectedSkill}
                                            isOff={isOff}
                                            isDark={isDark}
                                        />
                                    </div>

                                    {/* MOBILE (< 768px): Grouped Glowing Chips where tapping reveals skill level */}
                                    <div className="block md:hidden">
                                        <div className="flex flex-wrap gap-2.5">
                                            {categorySkills.map((skill) => {
                                                const isSelected =
                                                    selectedSkill?.id ===
                                                    skill.id;
                                                const IconComponent =
                                                    resolveLineicon(skill.icon);

                                                return (
                                                    <button
                                                        key={skill.id}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedSkill(
                                                                isSelected
                                                                    ? null
                                                                    : skill,
                                                            )
                                                        }
                                                        aria-expanded={
                                                            isSelected
                                                        }
                                                        aria-label={`${skill.name}, Level: ${skill.level}%`}
                                                        className={`group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none ${
                                                            isSelected
                                                                ? 'border-[var(--secondary)] bg-[var(--secondary)]/20 text-[var(--secondary)] shadow-[0_0_14px_rgba(34,211,238,0.4)]'
                                                                : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/15 active:scale-95'
                                                        }`}
                                                    >
                                                        {IconComponent ? (
                                                            <IconComponent className="h-4 w-4 flex-shrink-0 text-[var(--secondary)]" />
                                                        ) : (
                                                            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--secondary)] shadow-[0_0_6px_var(--secondary)]" />
                                                        )}
                                                        <span className="font-medium">
                                                            {skill.name}
                                                        </span>
                                                        {isSelected ? (
                                                            <span className="rounded-full bg-[var(--secondary)]/25 px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--secondary)] shadow-[0_0_8px_var(--secondary)]">
                                                                {skill.level}%
                                                            </span>
                                                        ) : (
                                                            <span className="font-mono text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text)]">
                                                                ▶
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Telemetry Indicator on Card Bottom */}
                                <div className="mt-6 flex items-center justify-between border-t border-[var(--surface-border)]/50 pt-3 font-mono text-[10px] text-[var(--text-muted)]">
                                    <span>CONSTELLATION / ONLINE</span>
                                    <span className="text-[var(--secondary)]">
                                        ★ DOMAIN ACTIVE
                                    </span>
                                </div>
                            </GlassPanel>
                        );
                    })}
                </div>

                {/* Selected Skill Telemetry Drawer */}
                {selectedSkill && (
                    <div className="mx-auto mt-8 max-w-xl animate-in fade-in slide-in-from-bottom-2">
                        <GlassPanel
                            variant="subtle"
                            className="flex flex-col items-center justify-between gap-4 border-[var(--secondary)] !p-5 shadow-[0_0_24px_rgba(34,211,238,0.2)] sm:flex-row"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--secondary)]/40 bg-[var(--secondary)]/15 font-mono text-sm font-bold text-[var(--secondary)] shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                                    {selectedSkill.level}%
                                </div>
                                <div>
                                    <h4 className="font-display text-base font-bold text-[var(--text)]">
                                        {selectedSkill.name}
                                    </h4>
                                    <p className="font-mono text-xs text-[var(--text-muted)]">
                                        Category: {selectedSkill.category} •
                                        Proficiency Node
                                    </p>
                                </div>
                            </div>

                            {/* Level Progress Bar & Dismiss */}
                            <div className="flex w-full items-center gap-3 sm:w-56">
                                <div className="h-2 flex-1 overflow-hidden rounded-full border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${selectedSkill.level}%`,
                                            background:
                                                'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedSkill(null)}
                                    aria-label="Close skill telemetry"
                                    className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none"
                                >
                                    ✕
                                </button>
                            </div>
                        </GlassPanel>
                    </div>
                )}
            </div>
        </section>
    );
}
