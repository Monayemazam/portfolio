import React, { useState } from 'react';
import * as LineIcons from 'lineicons-react';
import { SkillItem } from '@/types/portfolio';

interface ConstellationMapProps {
    category: string;
    skills: SkillItem[];
    activeSkill: SkillItem | null;
    onSelectSkill: (skill: SkillItem | null) => void;
    isOff?: boolean;
    isDark?: boolean;
}

function getConstellationCoordinates(
    count: number,
    width = 380,
    height = 220,
): Array<{ x: number; y: number }> {
    if (count <= 0) return [];
    if (count === 1) return [{ x: width / 2, y: height / 2 }];
    if (count === 2)
        return [
            { x: width * 0.28, y: height * 0.5 },
            { x: width * 0.72, y: height * 0.5 },
        ];
    if (count === 3)
        return [
            { x: width * 0.22, y: height * 0.68 },
            { x: width * 0.5, y: height * 0.28 },
            { x: width * 0.78, y: height * 0.62 },
        ];
    if (count === 4)
        return [
            { x: width * 0.18, y: height * 0.55 },
            { x: width * 0.42, y: height * 0.25 },
            { x: width * 0.58, y: height * 0.75 },
            { x: width * 0.82, y: height * 0.38 },
        ];
    if (count === 5)
        return [
            { x: width * 0.14, y: height * 0.65 },
            { x: width * 0.34, y: height * 0.28 },
            { x: width * 0.52, y: height * 0.68 },
            { x: width * 0.7, y: height * 0.32 },
            { x: width * 0.86, y: height * 0.58 },
        ];

    const coords: Array<{ x: number; y: number }> = [];
    const padX = 45;
    const padY = 40;
    const stepX = (width - padX * 2) / (count - 1);
    for (let i = 0; i < count; i++) {
        const x = padX + i * stepX;
        const wave = Math.sin((i / (count - 1)) * Math.PI) * 0.4;
        const y =
            padY +
            (i % 2 === 0 ? 0.25 : 0.72) * (height - padY * 2) +
            wave * 20;
        coords.push({ x: Math.round(x), y: Math.round(y) });
    }
    return coords;
}

function getConstellationLines(count: number): Array<[number, number]> {
    if (count <= 1) return [];
    const lines: Array<[number, number]> = [];

    // Primary chain
    for (let i = 0; i < count - 1; i++) {
        lines.push([i, i + 1]);
    }

    // Celestial cross-links for organic constellation graphs
    if (count === 3) {
        lines.push([0, 2]);
    } else if (count === 4) {
        lines.push([0, 2]);
        lines.push([1, 3]);
    } else if (count >= 5) {
        lines.push([1, 3]);
        if (count >= 6) {
            lines.push([2, 4]);
        }
    }

    return lines;
}

export default function ConstellationMap({
    category,
    skills,
    activeSkill,
    onSelectSkill,
    isOff = false,
}: ConstellationMapProps) {
    const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
    const [focusedSkill, setFocusedSkill] = useState<SkillItem | null>(null);

    const currentSkill = activeSkill || hoveredSkill || focusedSkill;
    const isCategoryIlluminated = Boolean(currentSkill);

    const width = 380;
    const height = 220;
    const coordinates = getConstellationCoordinates(
        skills.length,
        width,
        height,
    );
    const lines = getConstellationLines(skills.length);

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

    const ActiveIconComponent = resolveLineicon(currentSkill?.icon);

    return (
        <div className="relative flex flex-col items-center">
            {/* SVG Constellation Chart */}
            <div className="relative w-full overflow-hidden rounded-xl bg-[var(--bg-elevated)]/40 p-2">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-auto w-full select-none"
                    role="img"
                    aria-label={`${category} constellation graph`}
                >
                    <defs>
                        {/* Glow Filter */}
                        <filter
                            id={`glow-${category}`}
                            x="-40%"
                            y="-40%"
                            width="180%"
                            height="180%"
                        >
                            <feGaussianBlur
                                stdDeviation="3.5"
                                result="coloredBlur"
                            />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Connecting Constellation Lines */}
                    {lines.map(([fromIdx, toIdx], lineIdx) => {
                        const from = coordinates[fromIdx];
                        const to = coordinates[toIdx];
                        if (!from || !to) return null;

                        return (
                            <line
                                key={`line-${lineIdx}`}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                stroke={
                                    isCategoryIlluminated
                                        ? 'var(--secondary)'
                                        : 'var(--surface-border)'
                                }
                                strokeWidth={isCategoryIlluminated ? 2 : 1.25}
                                strokeDasharray={
                                    isCategoryIlluminated ? 'none' : '4 3'
                                }
                                opacity={isCategoryIlluminated ? 0.9 : 0.4}
                                filter={
                                    isCategoryIlluminated && !isOff
                                        ? `url(#glow-${category})`
                                        : undefined
                                }
                                className="transition-all duration-300"
                            />
                        );
                    })}

                    {/* Constellation Stars (Nodes) */}
                    {skills.map((skill, index) => {
                        const coord = coordinates[index];
                        if (!coord) return null;

                        const isSelected = activeSkill?.id === skill.id;
                        const isHovered = hoveredSkill?.id === skill.id;
                        const isFocused = focusedSkill?.id === skill.id;
                        const isStarActive =
                            isSelected || isHovered || isFocused;

                        const baseRadius = 4.5 + (skill.level / 100) * 2.5;

                        return (
                            <g
                                key={skill.id}
                                tabIndex={0}
                                role="button"
                                aria-label={`${skill.name}, Level: ${skill.level}%`}
                                className="cursor-pointer focus:outline-none"
                                onMouseEnter={() => setHoveredSkill(skill)}
                                onMouseLeave={() => setHoveredSkill(null)}
                                onFocus={() => setFocusedSkill(skill)}
                                onBlur={() => setFocusedSkill(null)}
                                onClick={() =>
                                    onSelectSkill(isSelected ? null : skill)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSelectSkill(
                                            isSelected ? null : skill,
                                        );
                                    }
                                }}
                            >
                                {/* Outer Pulsing Halo when active or hovered */}
                                {isStarActive && (
                                    <circle
                                        cx={coord.x}
                                        cy={coord.y}
                                        r={baseRadius + 8}
                                        fill="var(--secondary)"
                                        opacity={0.25}
                                        className={!isOff ? 'animate-ping' : ''}
                                    />
                                )}

                                {/* Keyboard Focus Indicator Ring (3px secondary focus ring per design rules) */}
                                {isFocused && (
                                    <circle
                                        cx={coord.x}
                                        cy={coord.y}
                                        r={baseRadius + 7}
                                        fill="none"
                                        stroke="var(--secondary)"
                                        strokeWidth={3}
                                    />
                                )}

                                {/* Secondary Outer Glow Circle */}
                                <circle
                                    cx={coord.x}
                                    cy={coord.y}
                                    r={
                                        isStarActive
                                            ? baseRadius + 4
                                            : baseRadius + 2
                                    }
                                    fill={
                                        isStarActive
                                            ? 'var(--secondary)'
                                            : 'var(--primary)'
                                    }
                                    opacity={isStarActive ? 0.5 : 0.25}
                                    filter={
                                        isStarActive && !isOff
                                            ? `url(#glow-${category})`
                                            : undefined
                                    }
                                    className="transition-all duration-300"
                                />

                                {/* Core Star Body */}
                                <circle
                                    cx={coord.x}
                                    cy={coord.y}
                                    r={baseRadius}
                                    fill={
                                        isStarActive
                                            ? 'var(--secondary)'
                                            : 'var(--text)'
                                    }
                                    className="transition-all duration-200"
                                />

                                {/* Skill Name Label in Star Field */}
                                <text
                                    x={coord.x}
                                    y={coord.y + baseRadius + 14}
                                    textAnchor="middle"
                                    fill={
                                        isStarActive
                                            ? 'var(--secondary)'
                                            : 'var(--text-muted)'
                                    }
                                    fontSize={10.5}
                                    fontFamily="monospace"
                                    fontWeight={
                                        isStarActive ? 'bold' : 'normal'
                                    }
                                    className="pointer-events-none transition-colors duration-200"
                                >
                                    {skill.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Glass Tooltip Overlay displaying skill name, level, and Lineicons icon */}
                {currentSkill && (
                    <div
                        role="tooltip"
                        className="pointer-events-none absolute right-3 bottom-3 left-3 flex animate-in items-center justify-between gap-3 rounded-lg border border-[var(--secondary)] bg-[var(--surface)]/95 px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.25)] backdrop-blur-md transition-all duration-200 fade-in"
                    >
                        <div className="flex items-center gap-2.5">
                            {ActiveIconComponent ? (
                                <ActiveIconComponent className="h-5 w-5 flex-shrink-0 text-[var(--secondary)]" />
                            ) : (
                                <span className="h-2 w-2 rounded-full bg-[var(--secondary)] shadow-[0_0_8px_var(--secondary)]" />
                            )}
                            <div>
                                <div className="font-display text-xs font-bold text-[var(--text)]">
                                    {currentSkill.name}
                                </div>
                                <div className="font-mono text-[10px] text-[var(--text-muted)]">
                                    Proficiency: {currentSkill.level}%
                                </div>
                            </div>
                        </div>

                        {/* Telemetry Progress Bar */}
                        <div className="flex w-24 flex-col items-end gap-1">
                            <span className="font-mono text-[10px] font-bold text-[var(--secondary)]">
                                {currentSkill.level}%
                            </span>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-border)]">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${currentSkill.level}%`,
                                        background:
                                            'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
