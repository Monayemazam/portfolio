import React from 'react';

export type SkillCategoryFilter =
    | 'ALL'
    | 'Engineering'
    | 'Deployment & Growth'
    | 'Creative & Marketing';

interface SkillAtlasNavProps {
    activeCategory: SkillCategoryFilter;
    onSelectCategory: (cat: SkillCategoryFilter) => void;
    engineeringCount: number;
    deploymentCount: number;
    creativeCount: number;
    totalCount: number;
}

export default function SkillAtlasNav({
    activeCategory,
    onSelectCategory,
    engineeringCount,
    deploymentCount,
    creativeCount,
    totalCount,
}: SkillAtlasNavProps) {
    const tabs: Array<{
        key: SkillCategoryFilter;
        label: string;
        count: number;
        code: string;
    }> = [
        {
            key: 'ALL',
            label: 'ALL CAPABILITIES',
            count: totalCount,
            code: 'VIEW ALL',
        },
        {
            key: 'Engineering',
            label: 'ENGINEERING',
            count: engineeringCount,
            code: '01',
        },
        {
            key: 'Deployment & Growth',
            label: 'DEPLOYMENT & GROWTH',
            count: deploymentCount,
            code: '02',
        },
        {
            key: 'Creative & Marketing',
            label: 'CREATIVE & MARKETING',
            count: creativeCount,
            code: '03',
        },
    ];

    return (
        <nav
            role="tablist"
            aria-label="Filter skills by capability group"
            className="my-10 flex flex-wrap items-center gap-3 border-b border-[var(--surface-border)] pb-8"
        >
            {tabs.map((tab) => {
                const isSelected = activeCategory === tab.key;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => onSelectCategory(tab.key)}
                        className={`group flex items-center gap-3 rounded-full border px-5 py-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                            isSelected
                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--paper)] shadow-[0_0_20px_rgba(241,90,36,0.25)] ring-2 ring-[var(--primary)]/20'
                                : 'border-[var(--surface-border)] bg-[var(--surface)]/50 text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)]'
                        }`}
                    >
                        <span
                            className={`font-mono text-[10px] font-bold tracking-wider transition-colors ${
                                isSelected
                                    ? 'text-[var(--accent)]'
                                    : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                            }`}
                        >
                            {tab.code}
                        </span>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                            {tab.label}
                        </span>
                        <span
                            className={`rounded-full px-2 py-0.2 font-mono text-[10px] font-bold ${
                                isSelected
                                    ? 'bg-[var(--paper)] text-[var(--ink)]'
                                    : 'bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--surface-border)]'
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
