import React from 'react';
import { ConstellationNode, SectorMeta } from './constellationGeometry';
import { resolveSkillIcon } from './iconResolver';

interface TechnologyMatrixProps {
    nodes: ConstellationNode[];
    sectors: SectorMeta[];
    selectedCategory: string;
    activeSkill: ConstellationNode | null;
    onSelectSkill: (skill: ConstellationNode) => void;
    onSelectCategory: (category: string) => void;
    isOff?: boolean;
}

export default function TechnologyMatrix({
    nodes,
    sectors,
    selectedCategory,
    activeSkill,
    onSelectSkill,
    onSelectCategory,
    isOff = false,
}: TechnologyMatrixProps) {
    const isAll = selectedCategory === 'ALL';

    return (
        <section
            aria-label="High-Contrast Technical Skills Index"
            className="mt-16 w-full"
        >
            {/* Index Section Masthead */}
            <div className="flex flex-col gap-2 border-b border-[var(--surface-border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                        // ACCESSIBLE CAPABILITY MATRIX
                    </span>
                    <h3 className="mt-1 font-display text-xl font-black uppercase tracking-tight text-[var(--text)] sm:text-2xl">
                        MASTER TECHNOLOGY INDEX
                    </h3>
                </div>
                <p className="font-mono text-xs text-[var(--text-muted)]">
                    All {nodes.length} technologies in active production deployments
                </p>
            </div>

            {/* Category Sector Columns */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sectors.map((sec) => {
                    const isSectorSelected =
                        isAll || selectedCategory === sec.category;
                    const catSkills = nodes.filter(
                        (n) => n.category === sec.category,
                    );

                    return (
                        <div
                            key={sec.category}
                            className={`flex flex-col rounded-2xl border bg-[var(--surface)]/60 p-6 backdrop-blur-xl transition-all duration-300 ${
                                isSectorSelected
                                    ? 'border-[var(--primary)] shadow-[0_0_24px_rgba(241,90,36,0.12)]'
                                    : 'border-[var(--surface-border)] opacity-60 hover:opacity-90'
                            }`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor: sec.accentVar,
                                        }}
                                    />
                                    <div>
                                        <h4 className="font-display text-base font-black uppercase tracking-tight text-[var(--text)]">
                                            {sec.category}
                                        </h4>
                                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                            {sec.sectorCode} · {sec.celestialName}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectCategory(
                                            selectedCategory === sec.category
                                                ? 'ALL'
                                                : sec.category,
                                        )
                                    }
                                    className="rounded-full border border-[var(--surface-border)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[10px] font-bold text-[var(--text)] transition-colors hover:border-[var(--primary)]"
                                    aria-label={`Filter constellation to ${sec.category}`}
                                >
                                    {catSkills.length} NODES
                                </button>
                            </div>

                            {/* Skills List in this Category */}
                            <div
                                role="list"
                                className="mt-4 flex flex-col gap-3"
                            >
                                {catSkills.map((skill) => {
                                    const IconComponent = resolveSkillIcon(
                                        skill.icon,
                                    );
                                    const isSelected =
                                        activeSkill?.id === skill.id;
                                    const level = skill.level ?? 80;
                                    const levelLabel =
                                        level >= 90
                                            ? 'LEAD'
                                            : level >= 85
                                              ? 'ADVANCED'
                                              : 'CORE';

                                    return (
                                        <button
                                            key={skill.id}
                                            type="button"
                                            onClick={() => onSelectSkill(skill)}
                                            className={`group flex items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                                                isSelected
                                                    ? 'border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_16px_rgba(241,90,36,0.2)]'
                                                    : 'border-[var(--surface-border)] bg-[var(--bg)]/50 hover:border-[var(--primary)] hover:bg-[var(--surface)]'
                                            }`}
                                            aria-label={`Select ${skill.name}, ${level}% proficiency`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                {/* Lineicon Box */}
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                                        isSelected
                                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--paper)]'
                                                            : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)]'
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
                                                    <span className="font-display text-sm font-black uppercase tracking-tight text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                                                        {skill.name}
                                                    </span>

                                                    {/* Progress bar representing skill.level */}
                                                    <div className="mt-1.5 flex items-center gap-2">
                                                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--surface-border)] sm:w-24">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500 ease-out"
                                                                style={{
                                                                    width: `${level}%`,
                                                                    backgroundColor:
                                                                        sec.accentVar,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                                            {level}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tier Badge */}
                                            <span
                                                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
                                                    level >= 90
                                                        ? 'border-[var(--accent)]/50 bg-[var(--accent)]/15 text-[var(--accent)]'
                                                        : 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text-muted)]'
                                                }`}
                                            >
                                                {levelLabel}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
