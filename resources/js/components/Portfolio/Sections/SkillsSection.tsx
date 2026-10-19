import React, { useMemo, useState } from 'react';
import * as LineIcons from 'lineicons-react';
import { Sparkle, Terminal } from '../Shared/Icons';
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
    isOff = false,
    isDark = true,
}: SkillsSectionProps) {
    const [activeCategory, setActiveCategory] = useState<string>('all');

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

    const eyebrow = section.eyebrow || 'TECHNICAL ARSENAL';
    const title = section.title || 'Mastered Technologies & Frameworks';
    const subtitle =
        section.subtitle ||
        'Comprehensive architectural mastery across modern full-stack development, distributed databases, and high-performance UI systems.';

    // Key featured skills from database (e.g. Laravel, React, Vue.js, TypeScript)
    const featuredSkills = useMemo(() => {
        return skills.filter((s) => s.level >= 88).slice(0, 4);
    }, [skills]);

    return (
        <section
            id="skills"
            aria-label="Technical Skills Section"
            className="relative w-full overflow-hidden px-4 py-24 sm:px-6 sm:py-32 md:px-10 lg:px-16 lg:py-36 xl:px-20"
        >
            {/* Ambient Lighting */}
            <div
                className="pointer-events-none absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--secondary)]/10 blur-[140px]"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1440px]">
                {/* Header Section */}
                <div className="flex flex-col items-start max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                        <Sparkle className="h-3.5 w-3.5 text-[var(--secondary)]" />
                        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                            {eyebrow}
                        </span>
                    </div>

                    <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.12] tracking-tight text-[var(--text)]">
                        {title}
                    </h2>

                    <p className="mt-4 font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                        {subtitle}
                    </p>
                </div>

                {/* Featured Core Technologies Banner */}
                {featuredSkills.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                        <div className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                            <Terminal className="h-3.5 w-3.5 text-[var(--secondary)]" />
                            <span>Primary Engineering Specializations</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredSkills.map((skill) => {
                                const IconComponent = resolveLineicon(
                                    skill.icon,
                                );
                                return (
                                    <div
                                        key={`feat-${skill.id}`}
                                        className="group relative flex flex-col justify-between rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--secondary)] hover:shadow-[0_15px_35px_rgba(83,224,247,0.18)]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] transition-transform duration-300 group-hover:scale-110 group-hover:border-[var(--secondary)]">
                                                {IconComponent ? (
                                                    <IconComponent className="h-6 w-6" />
                                                ) : (
                                                    <span className="font-mono text-xs font-bold text-[var(--secondary)]">
                                                        {skill.name.slice(0, 2)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="rounded-full border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--secondary)]">
                                                {skill.level}%
                                            </span>
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="font-display text-lg font-bold text-[var(--text)] group-hover:text-[var(--secondary)] transition-colors">
                                                {skill.name}
                                            </h3>
                                            <span className="font-mono text-xs text-[var(--text-muted)] uppercase">
                                                {skill.category}
                                            </span>

                                            {/* Progress Bar */}
                                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-border)]">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] transition-all duration-700"
                                                    style={{
                                                        width: `${skill.level}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Categorized Skills Deep Dive */}
                <div className="mt-16 sm:mt-20">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => {
                            const categorySkills = groupedSkills[category];

                            return (
                                <div
                                    key={category}
                                    className="flex flex-col justify-between rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)]/80 p-6 shadow-xl backdrop-blur-xl sm:p-8"
                                >
                                    <div>
                                        {/* Category Header */}
                                        <div className="mb-6 flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                                            <div className="flex items-center gap-2.5">
                                                <span className="h-2.5 w-2.5 rounded-full bg-[var(--secondary)] shadow-[0_0_10px_var(--secondary)]" />
                                                <h3 className="font-display text-base font-bold tracking-wide text-[var(--text)] uppercase sm:text-lg">
                                                    {category}
                                                </h3>
                                            </div>
                                            <span className="rounded-full border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--text-muted)]">
                                                {categorySkills.length} Tools
                                            </span>
                                        </div>

                                        {/* Skills List with Proficiency Metrics */}
                                        <div className="flex flex-col gap-4">
                                            {categorySkills.map((skill) => {
                                                const IconComponent =
                                                    resolveLineicon(skill.icon);

                                                return (
                                                    <div
                                                        key={skill.id}
                                                        className="group flex flex-col rounded-xl border border-transparent p-2.5 transition-all duration-200 hover:border-[var(--surface-border)] hover:bg-[var(--bg-elevated)]/60"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] transition-colors group-hover:border-[var(--secondary)]">
                                                                    {IconComponent ? (
                                                                        <IconComponent className="h-4 w-4" />
                                                                    ) : (
                                                                        <span className="h-2 w-2 rounded-full bg-[var(--secondary)]" />
                                                                    )}
                                                                </div>
                                                                <span className="font-sans text-sm font-semibold text-[var(--text)] group-hover:text-[var(--secondary)] transition-colors">
                                                                    {skill.name}
                                                                </span>
                                                            </div>
                                                            <span className="font-mono text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--secondary)]">
                                                                {skill.level}%
                                                            </span>
                                                        </div>

                                                        {/* Linear Level Bar */}
                                                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-border)]/50">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] transition-all duration-500"
                                                                style={{
                                                                    width: `${skill.level}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Domain Footer Indicator */}
                                    <div className="mt-6 flex items-center justify-between border-t border-[var(--surface-border)]/40 pt-4 font-mono text-[10px] text-[var(--text-muted)] uppercase">
                                        <span>Architectural Domain</span>
                                        <span className="font-semibold text-[var(--secondary)]">
                                            Verified Production
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
