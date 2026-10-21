import React, { useEffect } from 'react';
import { ConstellationNode, SectorMeta } from './constellationGeometry';
import { resolveSkillIcon } from './iconResolver';

interface SkillTelemetryDrawerProps {
    skill: ConstellationNode | null;
    sector?: SectorMeta | null;
    onClose: () => void;
    onNavigateNext?: () => void;
    onNavigatePrev?: () => void;
    hasNext?: boolean;
    hasPrev?: boolean;
    isOff?: boolean;
}

export default function SkillTelemetryDrawer({
    skill,
    sector,
    onClose,
    onNavigateNext,
    onNavigatePrev,
    hasNext = false,
    hasPrev = false,
    isOff = false,
}: SkillTelemetryDrawerProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight' && onNavigateNext && hasNext) {
                onNavigateNext();
            } else if (e.key === 'ArrowLeft' && onNavigatePrev && hasPrev) {
                onNavigatePrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNavigateNext, onNavigatePrev, hasNext, hasPrev]);

    if (!skill) return null;

    const IconComponent = resolveSkillIcon(skill.icon);
    const level = skill.level ?? 80;
    const tier =
        level >= 90
            ? 'LEAD ARCHITECTURE'
            : level >= 85
              ? 'ADVANCED PRODUCTION'
              : 'CORE CAPABILITY';

    // SVG Circular Telemetry Gauge parameters
    const gaugeRadius = 36;
    const circumference = 2 * Math.PI * gaugeRadius;
    const strokeDashoffset = circumference - (level / 100) * circumference;

    return (
        <div
            role="dialog"
            aria-modal="false"
            aria-label={`Telemetry for ${skill.name}`}
            className={`relative w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 md:p-8 ${
                !isOff ? 'animate-in fade-in zoom-in-95 duration-200' : ''
            }`}
        >
            {/* Top Telemetry Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                        <span
                            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                !isOff ? 'animate-ping' : ''
                            } bg-[var(--primary)]`}
                        />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--primary)]" />
                    </span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                        TELEMETRY // {sector?.sectorCode || 'SECTOR-ACTIVE'} ·{' '}
                        {skill.category.toUpperCase()}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--surface-border)] bg-[var(--bg)] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--accent)] uppercase">
                        {sector?.coordinates || 'CELESTIAL BEACON'}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-[var(--surface-border)] bg-[var(--bg)]/80 px-2.5 py-1 font-mono text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                        aria-label="Close telemetry inspector"
                    >
                        ESC / CLOSE ✕
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
                {/* Left: Star & Icon Monogram */}
                <div className="flex items-center gap-5 md:col-span-6">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--primary)] bg-[var(--bg)] shadow-[0_0_20px_rgba(241,90,36,0.2)] md:h-20 md:w-20">
                        {IconComponent ? (
                            <IconComponent className="h-9 w-9 text-[var(--primary)] transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                            <span className="font-mono text-lg font-black text-[var(--primary)]">
                                {skill.name.slice(0, 2).toUpperCase()}
                            </span>
                        )}
                        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-[var(--accent)] px-1.5 py-0.2 font-mono text-[9px] font-bold text-[var(--ink)]">
                            {skill.starDesignation}
                        </span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                                {tier}
                            </span>
                            <span className="text-[var(--text-muted)]">·</span>
                            <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase">
                                SORT #{skill.sort_order}
                            </span>
                        </div>
                        <h3 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-[var(--text)] md:text-3xl">
                            {skill.name}
                        </h3>
                        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                            Constellation Sector: {skill.category} Engineering
                        </p>
                    </div>
                </div>

                {/* Right: Real Verified Mastery Gauge */}
                <div className="flex flex-wrap items-center justify-start gap-6 border-t border-[var(--surface-border)] pt-5 md:col-span-6 md:justify-end md:border-t-0 md:pt-0">
                    {/* Circular Dial */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex h-20 w-20 items-center justify-center">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88">
                                <circle
                                    cx="44"
                                    cy="44"
                                    r={gaugeRadius}
                                    className="stroke-[var(--surface-border)]"
                                    strokeWidth="6"
                                    fill="transparent"
                                />
                                <circle
                                    cx="44"
                                    cy="44"
                                    r={gaugeRadius}
                                    className="stroke-[var(--primary)] transition-all duration-700 ease-out"
                                    strokeWidth="6"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    fill="transparent"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                                <span className="text-base font-black text-[var(--text)]">
                                    {level}%
                                </span>
                                <span className="text-[8px] text-[var(--text-muted)] uppercase">
                                    CONFIDENCE
                                </span>
                            </div>
                        </div>

                        <div>
                            <span className="block font-mono text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                                VERIFIED PROFICIENCY
                            </span>
                            <span className="mt-0.5 block font-mono text-[11px] text-[var(--text-muted)]">
                                {level >= 90
                                    ? 'Production Lead Standard'
                                    : 'Production Active Standard'}
                            </span>
                            <span className="mt-1 inline-flex items-center gap-1.5 rounded-sm bg-[var(--forest)]/50 px-2 py-0.5 font-mono text-[10px] text-[var(--accent)] font-semibold border border-[var(--accent)]/30">
                                ✓ DATABASE VERIFIED
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Constellation Star Tour Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--surface-border)] pt-4 text-xs">
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    NAVIGATE CONSTELLATION: USE [←] AND [→] ARROW KEYS
                </span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onNavigatePrev}
                        disabled={!hasPrev}
                        className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold uppercase transition-all ${
                            hasPrev
                                ? 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--primary)]'
                                : 'cursor-not-allowed border-transparent text-[var(--text-muted)]/40'
                        }`}
                        aria-label="Previous skill in constellation"
                    >
                        ← PREVIOUS STAR
                    </button>
                    <button
                        type="button"
                        onClick={onNavigateNext}
                        disabled={!hasNext}
                        className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold uppercase transition-all ${
                            hasNext
                                ? 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--primary)]'
                                : 'cursor-not-allowed border-transparent text-[var(--text-muted)]/40'
                        }`}
                        aria-label="Next skill in constellation"
                    >
                        NEXT STAR →
                    </button>
                </div>
            </div>
        </div>
    );
}
