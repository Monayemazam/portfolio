import React, { useMemo } from 'react';
import { SkillItem } from '@/types/portfolio';
import SkillBrandIcon from './SkillBrandIcon';

interface SkillMarqueeRowProps {
    skills: SkillItem[];
    direction?: 'left' | 'right';
    isOff?: boolean;
    duration?: number;
    hoverBorderClass?: string;
    className?: string;
}

export default function SkillMarqueeRow({
    skills,
    direction = 'left',
    isOff = false,
    duration = 35,
    hoverBorderClass = 'hover:border-[var(--primary)]',
    className = '',
}: SkillMarqueeRowProps) {
    // Generate repeated sequence so track width is guaranteed to exceed wide screens (> 2500px)
    const repeatedSkills = useMemo(() => {
        if (!skills || skills.length === 0) return [];
        // Repeat smaller lists 3 times and larger lists 2 times for seamless wide-screen tracks
        const multiplier = skills.length < 8 ? 3 : 2;
        const result: SkillItem[] = [];
        for (let i = 0; i < multiplier; i++) {
            result.push(...skills);
        }
        return result;
    }, [skills]);

    if (!skills || skills.length === 0) return null;

    const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

    return (
        <div className={`relative overflow-hidden py-1 group select-none ${className}`}>
            {/* Subtle Gradient Edge Masks for Smooth Visual Fade */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/80 to-transparent z-10"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[var(--surface)] via-[var(--surface)]/80 to-transparent z-10"
            />

            {/* Seamless Infinite Marquee Track: Track 1 (Original) + Track 2 (Duplicate) */}
            <div className="flex w-max items-center">
                {/* Track 1 (Original Sequence - Accessible to Screen Readers & Keyboard Navigation) */}
                <div
                    className={`flex shrink-0 items-center gap-2.5 sm:gap-3 pr-2.5 sm:pr-3 ${
                        isOff ? '' : animationClass
                    } group-hover:[animation-play-state:paused]`}
                    style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
                >
                    {repeatedSkills.map((skill, idx) => (
                        <div
                            key={`orig-${skill.id}-${idx}`}
                            className={`group/chip inline-flex shrink-0 items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-3.5 py-2.5 font-mono text-xs font-semibold text-[var(--text)] transition-all duration-200 ${hoverBorderClass} hover:bg-[var(--surface)] hover:-translate-y-0.5 shadow-xs cursor-pointer`}
                        >
                            <SkillBrandIcon
                                name={skill.name}
                                icon={skill.icon}
                                className="h-4.5 w-4.5 shrink-0"
                            />
                            <span className="whitespace-nowrap">{skill.name}</span>
                        </div>
                    ))}
                </div>

                {/* Track 2 (Identical Duplicate - Seamless Loop & Screen Reader Hidden) */}
                <div
                    aria-hidden="true"
                    className={`flex shrink-0 items-center gap-2.5 sm:gap-3 pr-2.5 sm:pr-3 ${
                        isOff ? '' : animationClass
                    } group-hover:[animation-play-state:paused]`}
                    style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
                >
                    {repeatedSkills.map((skill, idx) => (
                        <div
                            key={`dup-${skill.id}-${idx}`}
                            tabIndex={-1}
                            className={`group/chip inline-flex shrink-0 items-center gap-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg)] px-3.5 py-2.5 font-mono text-xs font-semibold text-[var(--text)] transition-all duration-200 ${hoverBorderClass} hover:bg-[var(--surface)] hover:-translate-y-0.5 shadow-xs cursor-pointer pointer-events-auto`}
                        >
                            <SkillBrandIcon
                                name={skill.name}
                                icon={skill.icon}
                                className="h-4.5 w-4.5 shrink-0"
                            />
                            <span className="whitespace-nowrap">{skill.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

