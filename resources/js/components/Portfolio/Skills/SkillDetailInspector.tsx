import React, { useEffect } from 'react';
import { SkillItem } from '@/types/portfolio';
import SkillBrandIcon from './SkillBrandIcon';

interface SkillDetailInspectorProps {
    skill: SkillItem | null;
    onClose: () => void;
    isOff?: boolean;
}

export default function SkillDetailInspector({
    skill,
    onClose,
    isOff = false,
}: SkillDetailInspectorProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!skill) return null;

    const level = skill.level ?? 80;

    return (
        <div
            role="region"
            aria-label={`Selected skill details for ${skill.name}`}
            className={`my-8 w-full rounded-2xl border border-[var(--primary)] bg-[var(--surface)]/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 md:p-8 ${
                !isOff ? 'animate-in fade-in slide-in-from-top-2 duration-200' : ''
            }`}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-4">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                        ATLAS INSPECTOR // {skill.category.toUpperCase()} · SORT #{skill.sort_order}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-[var(--surface-border)] bg-[var(--bg)] px-3 py-1 font-mono text-xs font-semibold text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    aria-label="Close skill details"
                >
                    ESC / CLOSE ✕
                </button>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5">
                    {/* Icon container */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/90 p-3 shadow-inner">
                        <SkillBrandIcon
                            name={skill.name}
                            icon={skill.icon}
                            className="h-10 w-10"
                        />
                    </div>

                    <div>
                        <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                            CAPABILITY ITEM
                        </span>
                        <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text)]">
                            {skill.name}
                        </h3>
                        <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--accent)]">
                            ✓ ACTIVE PRODUCTION CAPABILITY
                        </span>
                    </div>
                </div>

                {/* Level / Verification Indicator */}
                <div className="flex flex-col sm:items-end">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        PRODUCTION CONFIDENCE
                    </span>
                    <div className="mt-1 flex items-center gap-3">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-[var(--surface-border)]">
                            <div
                                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 ease-out"
                                style={{ width: `${level}%` }}
                            />
                        </div>
                        <span className="font-mono text-sm font-black text-[var(--text)]">
                            {level}%
                        </span>
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
                        {level >= 90
                            ? 'Lead Architecture Standard'
                            : 'Production Active Deployment'}
                    </span>
                </div>
            </div>
        </div>
    );
}
