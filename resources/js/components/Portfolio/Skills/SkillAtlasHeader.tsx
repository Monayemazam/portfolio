import React from 'react';

interface SkillAtlasHeaderProps {
    eyebrow?: string | null;
    title?: string | null;
    subtitle?: string | null;
    totalSkills: number;
    engineeringCount: number;
    deploymentCount: number;
    creativeCount: number;
    isOff?: boolean;
}

export default function SkillAtlasHeader({
    eyebrow,
    title,
    subtitle,
    totalSkills,
    engineeringCount,
    deploymentCount,
    creativeCount,
    isOff = false,
}: SkillAtlasHeaderProps) {
    const displayEyebrow = eyebrow || 'CAPABILITIES / 01';
    const displayTitle = title || 'WHAT I KNOW.\nWHAT I BUILD.';
    const displaySubtitle =
        subtitle ||
        'A focused toolkit for engineering, launching, and growing digital products.';

    const titleLines = displayTitle.split('\n');

    return (
        <header className="relative w-full border-b border-[var(--surface-border)] pb-12 sm:pb-16">
            {/* Top Coordinate & Category Eyebrow */}
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
                <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                        <span
                            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                !isOff ? 'animate-ping' : ''
                            } bg-[var(--accent)]`}
                        />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                    </span>
                    <span className="font-bold text-[var(--text)] tracking-[0.16em]">
                        SKILLS
                    </span>
                    <span className="text-[var(--surface-border)]">/</span>
                    <span className="text-[var(--text-muted)]">TECHNICAL EXPERTISE</span>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[11px] text-[var(--accent)] font-semibold">
                    <span>{totalSkills} VERIFIED TECHNOLOGIES</span>
                </div>
            </div>

            {/* Main Editorial Headline & Introduction */}
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-8">
                    <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[var(--text)] leading-[0.95]">
                        {titleLines.map((line, idx) => (
                            <React.Fragment key={idx}>
                                <span className="block">{line}</span>
                            </React.Fragment>
                        ))}
                    </h2>
                </div>

                <div className="lg:col-span-4">
                    <p className="max-w-md font-body text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
                        {displaySubtitle}
                    </p>
                </div>
            </div>

            {/* Data-Driven Capability Summary Row */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[var(--surface-border)] pt-6 sm:grid-cols-4 sm:gap-6">
                <div>
                    <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                        TOTAL TECHNOLOGIES
                    </span>
                    <span className="mt-1 block font-display text-2xl sm:text-3xl font-black text-[var(--text)]">
                        {totalSkills}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--accent)] uppercase">
                        PUBLISHED CAPABILITIES
                    </span>
                </div>

                <div>
                    <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                        01. CORE ENGINEERING
                    </span>
                    <span className="mt-1 block font-display text-2xl sm:text-3xl font-black text-[var(--text)]">
                        {engineeringCount}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                        LANGUAGES & FRAMEWORKS
                    </span>
                </div>

                <div>
                    <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                        02. DEPLOYMENT & GROWTH
                    </span>
                    <span className="mt-1 block font-display text-2xl sm:text-3xl font-black text-[var(--text)]">
                        {deploymentCount}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                        INFRASTRUCTURE & SEO
                    </span>
                </div>

                <div>
                    <span className="block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                        03. CREATIVE & MARKETING
                    </span>
                    <span className="mt-1 block font-display text-2xl sm:text-3xl font-black text-[var(--primary)]">
                        {creativeCount}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
                        DESIGN & PERFORMANCE
                    </span>
                </div>
            </div>
        </header>
    );
}
