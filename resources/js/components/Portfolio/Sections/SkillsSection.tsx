import React, { useMemo, useState } from 'react';
import { PortfolioSection, SkillItem } from '@/types/portfolio';
import {
    buildConstellationGraph,
    ConstellationNode,
} from '../Skills/constellationGeometry';
import ConstellationCanvas from '../Skills/ConstellationCanvas';
import SkillTelemetryDrawer from '../Skills/SkillTelemetryDrawer';
import TechnologyMatrix from '../Skills/TechnologyMatrix';

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
    // 1. Group skills by actual CMS-managed category
    const categories = useMemo(() => {
        const unique = new Set<string>();
        skills.forEach((s) => {
            if (s.is_published) {
                unique.add(s.category || 'Core');
            }
        });
        return Array.from(unique);
    }, [skills]);

    // 2. Compute celestial graph
    const { nodes, edges, sectors } = useMemo(() => {
        return buildConstellationGraph(skills, categories);
    }, [skills, categories]);

    // 3. Selection state
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [activeSkill, setActiveSkill] = useState<ConstellationNode | null>(
        nodes[0] || null,
    );

    // Derived statistics from actual data
    const totalSkills = nodes.length;
    const totalCategories = sectors.length;
    const averageMastery = useMemo(() => {
        if (totalSkills === 0) return 0;
        const sum = nodes.reduce((acc, curr) => acc + (curr.level ?? 80), 0);
        return Math.round(sum / totalSkills);
    }, [nodes, totalSkills]);

    // Active Sector Meta
    const activeSector = useMemo(() => {
        if (!activeSkill) return null;
        return (
            sectors.find((s) => s.category === activeSkill.category) || null
        );
    }, [activeSkill, sectors]);

    // Navigation for Active Skill
    const activeSkillList = useMemo(() => {
        if (selectedCategory === 'ALL') return nodes;
        return nodes.filter((n) => n.category === selectedCategory);
    }, [nodes, selectedCategory]);

    const activeSkillIndex = activeSkill
        ? activeSkillList.findIndex((n) => n.id === activeSkill.id)
        : -1;

    const handleNavigateNext = () => {
        if (activeSkillIndex >= 0 && activeSkillIndex < activeSkillList.length - 1) {
            setActiveSkill(activeSkillList[activeSkillIndex + 1]);
        } else if (activeSkillList.length > 0) {
            setActiveSkill(activeSkillList[0]);
        }
    };

    const handleNavigatePrev = () => {
        if (activeSkillIndex > 0) {
            setActiveSkill(activeSkillList[activeSkillIndex - 1]);
        } else if (activeSkillList.length > 0) {
            setActiveSkill(activeSkillList[activeSkillList.length - 1]);
        }
    };

    return (
        <section
            id={section.key}
            aria-label="Technical Skills Constellation"
            className="relative w-full overflow-hidden px-4 sm:px-8 lg:px-16 py-20 lg:py-32"
        >
            {/* Ambient Background Nebula Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 right-0 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-[var(--forest)] opacity-20 blur-[160px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1/4 left-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--signal-orange)] opacity-10 blur-[180px]"
            />

            <div className="relative mx-auto max-w-[1440px]">
                {/* 1. Technical Telemetry Eyebrow Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--surface-border)] pb-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span
                                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                    !isOff ? 'animate-ping' : ''
                                } bg-[var(--accent)]`}
                            />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                        </span>
                        <span className="font-bold text-[var(--accent)]">
                            {section.eyebrow || '02 // TECHNICAL CONSTELLATION'}
                        </span>
                        <span className="text-[var(--surface-border)]">·</span>
                        <span className="text-[var(--text)] font-semibold">
                            CELESTIAL ARCHITECTURE
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                        <span>COORDINATES: RA 14h 22m // DEC +19°</span>
                        <span className="hidden sm:inline text-[var(--surface-border)]">
                            |
                        </span>
                        <span className="hidden sm:inline text-[var(--accent)]">
                            STATUS: TELEMETRY ACTIVE
                        </span>
                    </div>
                </div>

                {/* 2. Section Heading & Manifesto */}
                <div className="mt-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-3xl">
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                            // ORBITAL CAPABILITY SYSTEM
                        </span>
                        <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl leading-tight">
                            {section.title || 'TECHNICAL EXPERTISE, MAPPED AS A CONSTELLATION.'}
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                        {section.subtitle ||
                            'Explore core engineering sectors across connected orbital bands. Every node represents verified mastery in active production deployments.'}
                    </p>
                </div>

                {/* 3. Capability Summary HUD Strip (Derived dynamically from CMS data) */}
                <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/70 p-4 sm:grid-cols-4 sm:p-6 backdrop-blur-xl shadow-lg">
                    <div className="border-r border-[var(--surface-border)] pr-4 last:border-r-0">
                        <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                            VERIFIED TECHNOLOGIES
                        </span>
                        <span className="mt-1 block font-display text-2xl font-black text-[var(--text)] sm:text-3xl">
                            {totalSkills}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--accent)]">
                            100% IN PRODUCTION
                        </span>
                    </div>

                    <div className="border-r border-[var(--surface-border)] pr-4 sm:pl-4 last:border-r-0">
                        <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                            ACTIVE CONSTELLATIONS
                        </span>
                        <span className="mt-1 block font-display text-2xl font-black text-[var(--text)] sm:text-3xl">
                            {totalCategories}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                            ENGINEERING SECTORS
                        </span>
                    </div>

                    <div className="border-r border-[var(--surface-border)] pr-4 last:border-r-0 sm:pl-4">
                        <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                            AVG PROFICIENCY
                        </span>
                        <span className="mt-1 block font-display text-2xl font-black text-[var(--primary)] sm:text-3xl">
                            {averageMastery}%
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                            PRODUCTION MASTERY
                        </span>
                    </div>

                    <div className="sm:pl-4">
                        <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                            ACTIVE CELESTIAL VIEW
                        </span>
                        <span className="mt-1 block font-display text-lg sm:text-xl font-black text-[var(--text)] uppercase truncate">
                            {selectedCategory === 'ALL'
                                ? 'ALL SECTORS'
                                : selectedCategory}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--accent)] uppercase truncate block">
                            {selectedCategory === 'ALL'
                                ? 'COMPLETE SKY MAP'
                                : `${nodes.filter((n) => n.category === selectedCategory).length} STARS ILLUMINATED`}
                        </span>
                    </div>
                </div>

                {/* 4. Interactive Waypoint Category Selector */}
                <div
                    role="tablist"
                    aria-label="Constellation Category Filter"
                    className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
                >
                    {/* All Constellations Button */}
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'ALL'}
                        onClick={() => setSelectedCategory('ALL')}
                        className={`group flex items-center gap-3 rounded-full border px-5 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                            selectedCategory === 'ALL'
                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--paper)] shadow-[0_0_24px_rgba(241,90,36,0.3)] ring-2 ring-[var(--primary)]/30'
                                : 'border-[var(--surface-border)] bg-[var(--surface)]/60 text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
                        }`}
                    >
                        <span
                            className={`h-2.5 w-2.5 rounded-full transition-all ${
                                selectedCategory === 'ALL'
                                    ? 'bg-[var(--accent)] scale-125'
                                    : 'bg-[var(--text-muted)] group-hover:bg-[var(--text)]'
                            }`}
                        />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                            ALL CONSTELLATIONS
                        </span>
                        <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                                selectedCategory === 'ALL'
                                    ? 'bg-[var(--paper)] text-[var(--ink)]'
                                    : 'bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--surface-border)]'
                            }`}
                        >
                            {totalSkills}
                        </span>
                    </button>

                    {/* Individual Sector Category Buttons */}
                    {sectors.map((sec, idx) => {
                        const isSelected = selectedCategory === sec.category;
                        const count = nodes.filter(
                            (n) => n.category === sec.category,
                        ).length;

                        return (
                            <button
                                key={sec.category}
                                type="button"
                                role="tab"
                                aria-selected={isSelected}
                                onClick={() => setSelectedCategory(sec.category)}
                                className={`group flex items-center gap-3 rounded-full border px-5 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                                    isSelected
                                        ? 'border-[var(--accent)] bg-[var(--surface)] text-[var(--text)] shadow-[0_0_24px_rgba(213,243,74,0.25)] ring-2 ring-[var(--accent)]/30'
                                        : 'border-[var(--surface-border)] bg-[var(--surface)]/60 text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
                                }`}
                            >
                                <span
                                    className="h-2.5 w-2.5 rounded-full transition-all"
                                    style={{
                                        backgroundColor: isSelected
                                            ? 'var(--accent)'
                                            : sec.accentVar,
                                    }}
                                />
                                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                                    SECTOR 0{idx + 1} // {sec.category}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                                        isSelected
                                            ? 'bg-[var(--accent)] text-[var(--ink)]'
                                            : 'bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--surface-border)]'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 5. Centerpiece Visual: The Technical Constellation Canvas */}
                <div className="mt-8">
                    <ConstellationCanvas
                        nodes={nodes}
                        edges={edges}
                        sectors={sectors}
                        selectedCategory={selectedCategory}
                        activeSkill={activeSkill}
                        onSelectSkill={(skill) => setActiveSkill(skill)}
                        isOff={isOff}
                    />
                </div>

                {/* 6. Mission Control Telemetry Inspector Panel */}
                {activeSkill && (
                    <div className="mt-8">
                        <SkillTelemetryDrawer
                            skill={activeSkill}
                            sector={activeSector}
                            onClose={() => setActiveSkill(null)}
                            onNavigateNext={handleNavigateNext}
                            onNavigatePrev={handleNavigatePrev}
                            hasNext={activeSkillList.length > 1}
                            hasPrev={activeSkillList.length > 1}
                            isOff={isOff}
                        />
                    </div>
                )}

                {/* 7. Accessible High-Contrast Master Technology Matrix (Index) */}
                <TechnologyMatrix
                    nodes={nodes}
                    sectors={sectors}
                    selectedCategory={selectedCategory}
                    activeSkill={activeSkill}
                    onSelectSkill={(skill) => {
                        setActiveSkill(skill);
                        // Smoothly scroll constellation into view if needed
                        const el = document.getElementById(section.key);
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    isOff={isOff}
                />
            </div>
        </section>
    );
}
