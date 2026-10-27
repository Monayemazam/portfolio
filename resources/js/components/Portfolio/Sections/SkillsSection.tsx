import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioSection, SkillItem } from '@/types/portfolio';
import SkillBrandIcon from '../Skills/SkillBrandIcon';

interface SkillsSectionProps {
    section: PortfolioSection;
    skills: SkillItem[];
    isOff?: boolean;
    isDark?: boolean;
}

type SkillCategory = 'ALL' | 'ENGINEERING' | 'DEPLOYMENT' | 'CREATIVE';

export default function SkillsSection({
    section,
    skills,
    isOff = false,
}: SkillsSectionProps) {
    // 1. Organize verified skills from database into the 3 canonical editorial groups
    const { engineering, deployment, creative } = useMemo(() => {
        const published = skills.filter((s) => s.is_published);

        const eng: SkillItem[] = [];
        const dep: SkillItem[] = [];
        const cre: SkillItem[] = [];

        published.forEach((skill) => {
            const cat = (skill.category || '').toLowerCase();
            const name = skill.name.toLowerCase();

            if (
                cat.includes('engineer') ||
                name === 'php' ||
                name === 'laravel' ||
                name === 'javascript' ||
                name === 'vue.js' ||
                name === 'react' ||
                name === 'typescript' ||
                name.includes('html') ||
                name.includes('tailwind') ||
                name === 'mysql' ||
                name.includes('wordpress') ||
                name.includes('woocommerce')
            ) {
                if (name.includes('ui/ux')) {
                    cre.push(skill);
                } else {
                    eng.push(skill);
                }
            } else if (
                cat.includes('deploy') ||
                cat.includes('growth') ||
                name.includes('cpanel') ||
                name.includes('hpanel') ||
                name.includes('seo') ||
                name.includes('hosting') ||
                name.includes('github') ||
                name.includes('ecommerce')
            ) {
                dep.push(skill);
            } else if (
                cat.includes('creative') ||
                cat.includes('market') ||
                name.includes('pixel') ||
                name.includes('ads') ||
                name.includes('content') ||
                name.includes('video') ||
                name.includes('graphic') ||
                name.includes('ui/ux')
            ) {
                cre.push(skill);
            } else {
                eng.push(skill);
            }
        });

        eng.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        dep.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        cre.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        return {
            engineering: eng,
            deployment: dep,
            creative: cre,
        };
    }, [skills]);

    const [activeTab, setActiveTab] = useState<SkillCategory>('ALL');

    const totalSkills = engineering.length + deployment.length + creative.length;

    const categories = [
        { key: 'ALL' as SkillCategory, label: 'All Capabilities', count: totalSkills },
        { key: 'ENGINEERING' as SkillCategory, label: 'Engineering', count: engineering.length },
        { key: 'DEPLOYMENT' as SkillCategory, label: 'Deployment & Growth', count: deployment.length },
        { key: 'CREATIVE' as SkillCategory, label: 'Creative & Marketing', count: creative.length },
    ];

    const showEng = activeTab === 'ALL' || activeTab === 'ENGINEERING';
    const showDep = activeTab === 'ALL' || activeTab === 'DEPLOYMENT';
    const showCre = activeTab === 'ALL' || activeTab === 'CREATIVE';

    return (
        <section
            id={section.key}
            aria-label="Skills & Capabilities — Technical Index"
            className="relative w-full overflow-hidden px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none bg-[var(--bg)] border-t border-[var(--surface-border)]"
        >
            {/* Ambient Nebula Light in Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 -right-20 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-25 blur-[150px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-10 left-10 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--primary)] opacity-10 blur-[130px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* Section Heading & Narrative */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] uppercase leading-tight">
                            WHAT I KNOW.
                            <br />
                            <span className="text-[var(--text-muted)]">WHAT I BUILD.</span>
                        </h2>
                    </div>

                    <p className="max-w-md font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        A focused, practical toolkit for engineering resilient web applications, managing cloud deployments, and driving digital growth.
                    </p>
                </div>

                {/* Compact Category Filter Switcher */}
                <div className="mt-10 border-y border-[var(--surface-border)] py-3">
                    <div
                        className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1"
                        role="tablist"
                        aria-label="Skill categories"
                    >
                        {categories.map((cat) => {
                            const isCurrent = activeTab === cat.key;
                            return (
                                <button
                                    key={cat.key}
                                    type="button"
                                    role="tab"
                                    aria-selected={isCurrent}
                                    onClick={() => setActiveTab(cat.key)}
                                    className={`group flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)] min-h-[44px] ${
                                        isCurrent
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_12px_rgba(241,90,36,0.3)]'
                                            : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)]'
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                            isCurrent
                                                ? 'bg-white/20 text-white'
                                                : 'bg-[var(--muted)] text-[var(--text-muted)]'
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Structured Technical Categories */}
                <div className="mt-12 space-y-8 sm:space-y-10">
                    {/* Category 1: Engineering */}
                    {showEng && engineering.length > 0 && (
                        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--surface-border)]">
                                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                                <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--text)]">
                                    Engineering &amp; Core Stack
                                </h3>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                                {engineering.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="group inline-flex items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-3.5 py-2.5 font-mono text-xs font-semibold text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--surface)] hover:-translate-y-0.5 shadow-xs"
                                    >
                                        <SkillBrandIcon
                                            name={skill.name}
                                            icon={skill.icon}
                                            className="h-4.5 w-4.5 shrink-0"
                                        />
                                        <span>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category 2: Deployment & Growth */}
                    {showDep && deployment.length > 0 && (
                        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--surface-border)]">
                                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                                <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--text)]">
                                    Deployment &amp; Growth
                                </h3>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                                {deployment.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="group inline-flex items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-3.5 py-2.5 font-mono text-xs font-semibold text-[var(--text)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--surface)] hover:-translate-y-0.5 shadow-xs"
                                    >
                                        <SkillBrandIcon
                                            name={skill.name}
                                            icon={skill.icon}
                                            className="h-4.5 w-4.5 shrink-0"
                                        />
                                        <span>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category 3: Creative & Marketing */}
                    {showCre && creative.length > 0 && (
                        <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 sm:p-8">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--surface-border)]">
                                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                                <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[var(--text)]">
                                    Creative &amp; Marketing
                                </h3>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                                {creative.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="group inline-flex items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-3.5 py-2.5 font-mono text-xs font-semibold text-[var(--text)] transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--surface)] hover:-translate-y-0.5 shadow-xs"
                                    >
                                        <SkillBrandIcon
                                            name={skill.name}
                                            icon={skill.icon}
                                            className="h-4.5 w-4.5 shrink-0"
                                        />
                                        <span>{skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
