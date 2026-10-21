import React, { useMemo, useState } from 'react';
import { PortfolioSection, SkillItem } from '@/types/portfolio';
import SkillAtlasHeader from '../Skills/SkillAtlasHeader';
import SkillAtlasNav, { SkillCategoryFilter } from '../Skills/SkillAtlasNav';
import SkillDetailInspector from '../Skills/SkillDetailInspector';
import { resolveSkillIcon } from '../Skills/iconResolver';

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
}: SkillsSectionProps) {
    // 1. Group skills into the 3 canonical editorial groups
    const { engineering, deployment, creative, allPublished } = useMemo(() => {
        const published = skills.filter((s) => s.is_published);

        const eng: SkillItem[] = [];
        const dep: SkillItem[] = [];
        const cre: SkillItem[] = [];

        published.forEach((skill) => {
            const cat = (skill.category || '').toLowerCase();
            const name = skill.name.toLowerCase();

            if (
                cat.includes('engineer') ||
                cat.includes('backend') ||
                cat.includes('frontend') ||
                name.includes('php') ||
                name.includes('laravel') ||
                name.includes('script') ||
                name.includes('vue') ||
                name.includes('react') ||
                name.includes('html') ||
                name.includes('css') ||
                name.includes('tailwind') ||
                name.includes('mysql') ||
                name.includes('wordpress') ||
                name.includes('woocommerce')
            ) {
                // If it's UI/UX, place in creative
                if (name.includes('ui/ux')) {
                    cre.push(skill);
                } else {
                    eng.push(skill);
                }
            } else if (
                cat.includes('deploy') ||
                cat.includes('growth') ||
                cat.includes('platform') ||
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
                cat.includes('design') ||
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

        eng.sort((a, b) => a.sort_order - b.sort_order);
        dep.sort((a, b) => a.sort_order - b.sort_order);
        cre.sort((a, b) => a.sort_order - b.sort_order);

        return {
            engineering: eng,
            deployment: dep,
            creative: cre,
            allPublished: published,
        };
    }, [skills]);

    // 2. Interactive Navigation & Selection State
    const [activeCategory, setActiveCategory] =
        useState<SkillCategoryFilter>('ALL');
    const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

    const showEngineering =
        activeCategory === 'ALL' || activeCategory === 'Engineering';
    const showDeployment =
        activeCategory === 'ALL' || activeCategory === 'Deployment & Growth';
    const showCreative =
        activeCategory === 'ALL' || activeCategory === 'Creative & Marketing';

    return (
        <section
            id={section.key}
            aria-label="The Skill Atlas"
            className="relative w-full overflow-hidden px-4 sm:px-8 lg:px-16 py-20 lg:py-32 select-none"
        >
            {/* Subtle Celestial Ambient Tint */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/3 right-0 w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-[var(--forest)] opacity-15 blur-[160px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1/4 left-0 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--signal-orange)] opacity-10 blur-[180px]"
            />

            <div className="relative mx-auto max-w-[1440px]">
                {/* 1. Master Editorial Section Header & Capability Highlights */}
                <SkillAtlasHeader
                    eyebrow={section.eyebrow}
                    title={section.title}
                    subtitle={section.subtitle}
                    totalSkills={allPublished.length}
                    engineeringCount={engineering.length}
                    deploymentCount={deployment.length}
                    creativeCount={creative.length}
                    isOff={isOff}
                />

                {/* 2. Restrained Editorial Group Selector Navigation */}
                <SkillAtlasNav
                    activeCategory={activeCategory}
                    onSelectCategory={(cat) => {
                        setActiveCategory(cat);
                        setSelectedSkill(null);
                    }}
                    engineeringCount={engineering.length}
                    deploymentCount={deployment.length}
                    creativeCount={creative.length}
                    totalCount={allPublished.length}
                />

                {/* 3. Compact Detail Inspector (Shown when a skill is clicked) */}
                {selectedSkill && (
                    <SkillDetailInspector
                        skill={selectedSkill}
                        onClose={() => setSelectedSkill(null)}
                        isOff={isOff}
                    />
                )}

                {/* 4. The Three Primary Capability Groups */}
                <div className="flex flex-col gap-16 lg:gap-24">
                    {/* ========================================================= */}
                    {/* GROUP 01 — ENGINEERING                                     */}
                    {/* ========================================================= */}
                    {showEngineering && (
                        <article
                            aria-labelledby="group-01-heading"
                            className="relative grid grid-cols-1 gap-8 border-b border-[var(--surface-border)] pb-16 lg:grid-cols-12 lg:gap-12"
                        >
                            {/* Left Column: Group Editorial Metadata & Index Signature */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-28 flex flex-col">
                                    <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                                        <span>GROUP 01 // ARCHITECTURE & SYSTEMS</span>
                                    </div>

                                    <div className="relative mt-2">
                                        <h3
                                            id="group-01-heading"
                                            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text)] leading-tight"
                                        >
                                            ENGINEERING
                                        </h3>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -bottom-6 -left-2 font-display text-7xl sm:text-8xl font-black text-[var(--surface-border)] opacity-35 select-none"
                                        >
                                            01
                                        </span>
                                    </div>

                                    <p className="mt-8 font-body text-sm text-[var(--text-muted)] leading-relaxed">
                                        Technologies I use to develop web applications, interfaces, APIs, and data-driven systems.
                                    </p>

                                    <div className="mt-6 flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
                                        <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--text)]">
                                            {engineering.length} VERIFIED STACKS
                                        </span>
                                        <span>RA 05h // SYSTEM CORE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Refined Typographic Index Grid */}
                            <div className="lg:col-span-8">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {engineering.map((skill, idx) => {
                                        const IconComponent = resolveSkillIcon(
                                            skill.icon,
                                        );
                                        const isSelected =
                                            selectedSkill?.id === skill.id;
                                        const itemCode = `01.${(idx + 1)
                                            .toString()
                                            .padStart(2, '0')}`;

                                        return (
                                            <button
                                                key={skill.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedSkill(
                                                        isSelected ? null : skill,
                                                    )
                                                }
                                                className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                                                    isSelected
                                                        ? 'border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_20px_rgba(241,90,36,0.2)] ring-1 ring-[var(--primary)]'
                                                        : 'border-[var(--surface-border)] bg-[var(--surface)]/40 hover:border-[var(--primary)] hover:bg-[var(--surface)]'
                                                }`}
                                                aria-label={`Inspect ${skill.name}`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    {/* Minimalist Lineicon Box */}
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                                            isSelected
                                                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--paper)]'
                                                                : 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]'
                                                        }`}
                                                    >
                                                        {IconComponent ? (
                                                            <IconComponent className="h-5 w-5" />
                                                        ) : (
                                                            <span className="font-mono text-xs font-black">
                                                                {skill.name
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <span className="block font-display text-base sm:text-lg font-black tracking-tight text-[var(--text)] uppercase group-hover:text-[var(--primary)] transition-colors">
                                                            {skill.name}
                                                        </span>
                                                        <span className="block font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
                                                            {itemCode} · PRODUCTION STACK
                                                        </span>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                                                        isSelected
                                                            ? 'bg-[var(--primary)] scale-150'
                                                            : 'bg-transparent group-hover:bg-[var(--primary)]'
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </article>
                    )}

                    {/* ========================================================= */}
                    {/* GROUP 02 — DEPLOYMENT & GROWTH                             */}
                    {/* ========================================================= */}
                    {showDeployment && (
                        <article
                            aria-labelledby="group-02-heading"
                            className="relative grid grid-cols-1 gap-8 border-b border-[var(--surface-border)] pb-16 lg:grid-cols-12 lg:gap-12"
                        >
                            {/* Left Column: Group Metadata & Index */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-28 flex flex-col">
                                    <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                        <span>GROUP 02 // LAUNCH & SCALE</span>
                                    </div>

                                    <div className="relative mt-2">
                                        <h3
                                            id="group-02-heading"
                                            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text)] leading-tight"
                                        >
                                            DEPLOYMENT
                                            <br />
                                            & GROWTH
                                        </h3>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -bottom-6 -left-2 font-display text-7xl sm:text-8xl font-black text-[var(--surface-border)] opacity-35 select-none"
                                        >
                                            02
                                        </span>
                                    </div>

                                    <p className="mt-8 font-body text-sm text-[var(--text-muted)] leading-relaxed">
                                        Tools and practices I use to deploy, launch, optimise, and grow digital products.
                                    </p>

                                    <div className="mt-6 flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
                                        <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--text)]">
                                            {deployment.length} PLATFORMS & TOOLS
                                        </span>
                                        <span>HOSTING & VISIBILITY</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Distinct Two-Column Split (Hosting vs SEO/Growth) */}
                            <div className="lg:col-span-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {deployment.map((skill, idx) => {
                                        const IconComponent = resolveSkillIcon(
                                            skill.icon,
                                        );
                                        const isSelected =
                                            selectedSkill?.id === skill.id;
                                        const isHosting =
                                            skill.name.toLowerCase().includes('panel') ||
                                            skill.name.toLowerCase().includes('hosting') ||
                                            skill.name.toLowerCase().includes('git');
                                        const roleTag = isHosting
                                            ? 'INFRASTRUCTURE'
                                            : 'GROWTH & COMMERCE';

                                        return (
                                            <button
                                                key={skill.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedSkill(
                                                        isSelected ? null : skill,
                                                    )
                                                }
                                                className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                                                    isSelected
                                                        ? 'border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_20px_rgba(241,90,36,0.2)] ring-1 ring-[var(--primary)]'
                                                        : 'border-[var(--surface-border)] bg-[var(--surface)]/40 hover:border-[var(--primary)] hover:bg-[var(--surface)]'
                                                }`}
                                                aria-label={`Inspect ${skill.name}`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                                            isSelected
                                                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--paper)]'
                                                                : 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]'
                                                        }`}
                                                    >
                                                        {IconComponent ? (
                                                            <IconComponent className="h-5 w-5" />
                                                        ) : (
                                                            <span className="font-mono text-xs font-black">
                                                                {skill.name
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <span className="block font-display text-base font-black tracking-tight text-[var(--text)] uppercase group-hover:text-[var(--primary)] transition-colors">
                                                            {skill.name}
                                                        </span>
                                                        <span className="block font-mono text-[10px] text-[var(--accent)] tracking-wider">
                                                            {roleTag}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className="rounded-full bg-[var(--bg)] px-2 py-0.5 font-mono text-[9px] font-bold text-[var(--text-muted)] border border-[var(--surface-border)]">
                                                    02.0{idx + 1}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </article>
                    )}

                    {/* ========================================================= */}
                    {/* GROUP 03 — CREATIVE & MARKETING                           */}
                    {/* ========================================================= */}
                    {showCreative && (
                        <article
                            aria-labelledby="group-03-heading"
                            className="relative grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12 lg:gap-12"
                        >
                            {/* Left Column: Group Metadata & Index */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-28 flex flex-col">
                                    <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-[var(--sand)]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--sand)]" />
                                        <span>GROUP 03 // PRODUCTION & PERFORMANCE</span>
                                    </div>

                                    <div className="relative mt-2">
                                        <h3
                                            id="group-03-heading"
                                            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text)] leading-tight"
                                        >
                                            CREATIVE
                                            <br />
                                            & MARKETING
                                        </h3>
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -bottom-6 -left-2 font-display text-7xl sm:text-8xl font-black text-[var(--surface-border)] opacity-35 select-none"
                                        >
                                            03
                                        </span>
                                    </div>

                                    <p className="mt-8 font-body text-sm text-[var(--text-muted)] leading-relaxed">
                                        Creative production and digital marketing capabilities that complement my engineering work.
                                    </p>

                                    <div className="mt-6 flex items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
                                        <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--text)]">
                                            {creative.length} CREATIVE CAPABILITIES
                                        </span>
                                        <span>DESIGN & ACQUISITION</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Creative & Marketing Cards */}
                            <div className="lg:col-span-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {creative.map((skill, idx) => {
                                        const IconComponent = resolveSkillIcon(
                                            skill.icon,
                                        );
                                        const isSelected =
                                            selectedSkill?.id === skill.id;
                                        const isAd =
                                            skill.name.toLowerCase().includes('pixel') ||
                                            skill.name.toLowerCase().includes('ads');
                                        const creativeTag = isAd
                                            ? 'PERFORMANCE MARKETING'
                                            : 'CREATIVE PRODUCTION';

                                        return (
                                            <button
                                                key={skill.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedSkill(
                                                        isSelected ? null : skill,
                                                    )
                                                }
                                                className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                                                    isSelected
                                                        ? 'border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_20px_rgba(241,90,36,0.2)] ring-1 ring-[var(--primary)]'
                                                        : 'border-[var(--surface-border)] bg-[var(--surface)]/40 hover:border-[var(--primary)] hover:bg-[var(--surface)]'
                                                }`}
                                                aria-label={`Inspect ${skill.name}`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                                            isSelected
                                                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--paper)]'
                                                                : 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]'
                                                        }`}
                                                    >
                                                        {IconComponent ? (
                                                            <IconComponent className="h-5 w-5" />
                                                        ) : (
                                                            <span className="font-mono text-xs font-black">
                                                                {skill.name
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <span className="block font-display text-base font-black tracking-tight text-[var(--text)] uppercase group-hover:text-[var(--primary)] transition-colors">
                                                            {skill.name}
                                                        </span>
                                                        <span className="block font-mono text-[10px] text-[var(--sand)] tracking-wider">
                                                            {creativeTag}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className="rounded-full bg-[var(--bg)] px-2 py-0.5 font-mono text-[9px] font-bold text-[var(--text-muted)] border border-[var(--surface-border)]">
                                                    03.0{idx + 1}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </article>
                    )}
                </div>
            </div>
        </section>
    );
}
