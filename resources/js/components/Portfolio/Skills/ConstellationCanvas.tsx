import React, { useId, useMemo, useState } from 'react';
import {
    ConstellationEdge,
    ConstellationNode,
    SectorMeta,
} from './constellationGeometry';
import { resolveSkillIcon } from './iconResolver';

interface ConstellationCanvasProps {
    nodes: ConstellationNode[];
    edges: ConstellationEdge[];
    sectors: SectorMeta[];
    selectedCategory: string; // 'ALL' or specific category
    activeSkill: ConstellationNode | null;
    onSelectSkill: (skill: ConstellationNode) => void;
    isOff?: boolean;
}

export default function ConstellationCanvas({
    nodes,
    edges,
    sectors,
    selectedCategory,
    activeSkill,
    onSelectSkill,
    isOff = false,
}: ConstellationCanvasProps) {
    const [hoveredSkillId, setHoveredSkillId] = useState<number | null>(null);
    const filterId = useId();

    const hoveredSkill = useMemo(
        () => nodes.find((n) => n.id === hoveredSkillId) || null,
        [nodes, hoveredSkillId],
    );

    const isAll = selectedCategory === 'ALL';

    // Static celestial background stars
    const backgroundStars = useMemo(() => {
        const stars = [];
        const seeds = [
            [80, 110, 1.2],
            [160, 80, 1.5],
            [320, 90, 0.9],
            [410, 180, 1.4],
            [120, 520, 1.1],
            [280, 560, 1.6],
            [480, 80, 1.0],
            [540, 240, 1.3],
            [680, 110, 1.8],
            [790, 90, 1.1],
            [620, 580, 1.2],
            [740, 560, 1.5],
            [860, 120, 1.3],
            [1020, 140, 1.6],
            [1120, 220, 1.0],
            [1140, 480, 1.4],
            [990, 570, 1.1],
            [840, 360, 0.8],
        ];
        for (let i = 0; i < seeds.length; i++) {
            stars.push({
                x: seeds[i][0],
                y: seeds[i][1],
                r: seeds[i][2],
                opacity: 0.35 + (i % 5) * 0.12,
            });
        }
        return stars;
    }, []);

    return (
        <div className="relative w-full overflow-hidden rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)]/40 backdrop-blur-md shadow-2xl">
            {/* Aspect container for 1200 x 640 celestial coordinate space */}
            <div className="relative w-full aspect-[1200/640] min-h-[440px] sm:min-h-[520px] lg:min-h-[600px] select-none">
                {/* 1. LAYER ONE: SVG Celestial Cartography, Grids, Nebulae & Luminous Constellation Lines */}
                <svg
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    viewBox="0 0 1200 640"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                >
                    <defs>
                        {/* Nebulae Radial Gradients */}
                        <radialGradient
                            id={`nebula-backend-${filterId}`}
                            cx="20%"
                            cy="50%"
                            r="35%"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--signal-orange)"
                                stopOpacity="0.14"
                            />
                            <stop
                                offset="60%"
                                stopColor="var(--forest)"
                                stopOpacity="0.08"
                            />
                            <stop
                                offset="100%"
                                stopColor="transparent"
                                stopOpacity="0"
                            />
                        </radialGradient>

                        <radialGradient
                            id={`nebula-frontend-${filterId}`}
                            cx="50%"
                            cy="45%"
                            r="38%"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--acid-lime)"
                                stopOpacity="0.12"
                            />
                            <stop
                                offset="60%"
                                stopColor="var(--forest)"
                                stopOpacity="0.08"
                            />
                            <stop
                                offset="100%"
                                stopColor="transparent"
                                stopOpacity="0"
                            />
                        </radialGradient>

                        <radialGradient
                            id={`nebula-platforms-${filterId}`}
                            cx="80%"
                            cy="52%"
                            r="35%"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--sand)"
                                stopOpacity="0.12"
                            />
                            <stop
                                offset="60%"
                                stopColor="var(--forest)"
                                stopOpacity="0.08"
                            />
                            <stop
                                offset="100%"
                                stopColor="transparent"
                                stopOpacity="0"
                            />
                        </radialGradient>

                        {/* Glow Filter */}
                        <filter
                            id={`constellation-glow-${filterId}`}
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >
                            <feGaussianBlur
                                stdDeviation="3"
                                result="blur"
                            />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Nebulae Field Fill */}
                    <rect
                        width="1200"
                        height="640"
                        fill={`url(#nebula-backend-${filterId})`}
                    />
                    <rect
                        width="1200"
                        height="640"
                        fill={`url(#nebula-frontend-${filterId})`}
                    />
                    <rect
                        width="1200"
                        height="640"
                        fill={`url(#nebula-platforms-${filterId})`}
                    />

                    {/* Astronomical Coordinate Rings & Crosshairs */}
                    <g
                        className="stroke-[var(--surface-border)]"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.6"
                    >
                        {/* Concentric Declination Rings */}
                        <circle
                            cx="600"
                            cy="320"
                            r="180"
                            strokeDasharray="4 8"
                        />
                        <circle
                            cx="600"
                            cy="320"
                            r="340"
                            strokeDasharray="6 10"
                        />
                        <circle
                            cx="600"
                            cy="320"
                            r="520"
                            strokeDasharray="8 12"
                        />

                        {/* Equatorial and Meridian Lines */}
                        <line
                            x1="60"
                            y1="320"
                            x2="1140"
                            y2="320"
                            strokeDasharray="2 4"
                        />
                        <line
                            x1="600"
                            y1="40"
                            x2="600"
                            y2="600"
                            strokeDasharray="2 4"
                        />

                        {/* Sector Separator Guides */}
                        <line
                            x1="410"
                            y1="60"
                            x2="410"
                            y2="580"
                            strokeDasharray="3 6"
                            opacity="0.4"
                        />
                        <line
                            x1="790"
                            y1="60"
                            x2="790"
                            y2="580"
                            strokeDasharray="3 6"
                            opacity="0.4"
                        />
                    </g>

                    {/* Celestial Degree Markings */}
                    <g
                        className="fill-[var(--text-muted)] font-mono text-[9px] uppercase tracking-widest"
                        opacity="0.5"
                    >
                        <text x="610" y="55">
                            +60° N // POLARIS
                        </text>
                        <text x="610" y="600">
                            -60° S // NADIR
                        </text>
                        <text x="70" y="315">
                            RA 00h // EQUINOX
                        </text>
                        <text x="1050" y="315">
                            RA 24h // HORIZON
                        </text>
                        <text x="420" y="80">
                            // MERIDIAN ALPHA-BETA
                        </text>
                        <text x="800" y="80">
                            // MERIDIAN BETA-GAMMA
                        </text>
                    </g>

                    {/* Static Micro-Stars */}
                    <g className="fill-[var(--text)]">
                        {backgroundStars.map((star, idx) => (
                            <circle
                                key={idx}
                                cx={star.x}
                                cy={star.y}
                                r={star.r}
                                opacity={star.opacity}
                            />
                        ))}
                    </g>

                    {/* Sector Coordinate Labels in Celestial Sky */}
                    {sectors.map((sec) => {
                        const isSectorSelected =
                            isAll || selectedCategory === sec.category;
                        return (
                            <g
                                key={sec.category}
                                className="transition-opacity duration-500"
                                opacity={isSectorSelected ? 0.9 : 0.25}
                            >
                                <text
                                    x={sec.centerX}
                                    y={85}
                                    textAnchor="middle"
                                    className="font-mono text-[11px] font-bold tracking-widest fill-[var(--text)] uppercase"
                                >
                                    {sec.sectorCode} · {sec.celestialName}
                                </text>
                                <text
                                    x={sec.centerX}
                                    y={102}
                                    textAnchor="middle"
                                    className="font-mono text-[9px] fill-[var(--accent)] tracking-wider"
                                >
                                    {sec.coordinates}
                                </text>
                            </g>
                        );
                    })}

                    {/* Constellation Highway Lines (Between categories) */}
                    {edges
                        .filter((e) => e.isHighway)
                        .map((edge) => (
                            <line
                                key={edge.id}
                                x1={edge.fromX}
                                y1={edge.fromY}
                                x2={edge.toX}
                                y2={edge.toY}
                                stroke="var(--accent)"
                                strokeWidth="1"
                                strokeDasharray="3 6"
                                opacity={isAll ? 0.35 : 0.1}
                                className="transition-opacity duration-500"
                            />
                        ))}

                    {/* Intra-Constellation Connecting Lines */}
                    {edges
                        .filter((e) => !e.isHighway)
                        .map((edge) => {
                            const isEdgeActive =
                                isAll || selectedCategory === edge.category;
                            const isEdgeHighlighted =
                                hoveredSkill?.category === edge.category ||
                                activeSkill?.category === edge.category;

                            return (
                                <g key={edge.id}>
                                    {/* Ambient Glow Line */}
                                    <line
                                        x1={edge.fromX}
                                        y1={edge.fromY}
                                        x2={edge.toX}
                                        y2={edge.toY}
                                        stroke={
                                            edge.category === 'Backend'
                                                ? 'var(--signal-orange)'
                                                : edge.category === 'Frontend'
                                                  ? 'var(--acid-lime)'
                                                  : 'var(--sand)'
                                        }
                                        strokeWidth={
                                            isEdgeHighlighted ? 3 : 1.5
                                        }
                                        strokeOpacity={
                                            isEdgeActive
                                                ? isEdgeHighlighted
                                                    ? 0.8
                                                    : 0.5
                                                : 0.15
                                        }
                                        filter={`url(#constellation-glow-${filterId})`}
                                        className="transition-all duration-300"
                                    />
                                    {/* Crisp Center Spine */}
                                    <line
                                        x1={edge.fromX}
                                        y1={edge.fromY}
                                        x2={edge.toX}
                                        y2={edge.toY}
                                        stroke="var(--text)"
                                        strokeWidth="1"
                                        strokeOpacity={
                                            isEdgeActive
                                                ? isEdgeHighlighted
                                                    ? 0.95
                                                    : 0.7
                                                : 0.2
                                        }
                                        strokeDasharray={
                                            !isOff && isEdgeHighlighted
                                                ? '6 4'
                                                : undefined
                                        }
                                        className="transition-all duration-300"
                                    />
                                </g>
                            );
                        })}

                    {/* Star Node Ambient Glow Rings (In SVG Layer for depth behind HTML badges) */}
                    {nodes.map((node) => {
                        const isNodeActive =
                            isAll || selectedCategory === node.category;
                        const isSelected = activeSkill?.id === node.id;
                        const isHovered = hoveredSkillId === node.id;
                        const radius = node.isLeader ? 22 : 16;

                        return (
                            <g
                                key={`glow-${node.id}`}
                                className="transition-opacity duration-500"
                                opacity={isNodeActive ? 1 : 0.25}
                            >
                                {/* Outer Orbital Radar Ring */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={radius + (isSelected ? 8 : 4)}
                                    fill="none"
                                    stroke={
                                        isSelected
                                            ? 'var(--primary)'
                                            : 'var(--surface-border)'
                                    }
                                    strokeWidth={isSelected ? '2' : '1'}
                                    strokeDasharray={
                                        node.isLeader ? '3 3' : undefined
                                    }
                                    opacity={
                                        isSelected ? 0.9 : isHovered ? 0.7 : 0.4
                                    }
                                />

                                {/* Glowing Star Core */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.isLeader ? 7 : 5}
                                    fill={
                                        node.category === 'Backend'
                                            ? 'var(--signal-orange)'
                                            : node.category === 'Frontend'
                                              ? 'var(--acid-lime)'
                                              : 'var(--sand)'
                                    }
                                    filter={`url(#constellation-glow-${filterId})`}
                                    opacity={
                                        isSelected ? 1 : isHovered ? 0.9 : 0.75
                                    }
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* 2. LAYER TWO: Interactive HTML Star Nodes & High-Contrast Typography Badges */}
                <div className="absolute inset-0 pointer-events-none">
                    {nodes.map((node) => {
                        const IconComponent = resolveSkillIcon(node.icon);
                        const isNodeActive =
                            isAll || selectedCategory === node.category;
                        const isSelected = activeSkill?.id === node.id;
                        const isHovered = hoveredSkillId === node.id;
                        const level = node.level ?? 80;

                        // Percentage coordinates relative to 1200 x 640
                        const leftPercent = (node.x / 1200) * 100;
                        const topPercent = (node.y / 640) * 100;

                        return (
                            <div
                                key={node.id}
                                style={{
                                    left: `${leftPercent}%`,
                                    top: `${topPercent}%`,
                                }}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300 ${
                                    isNodeActive
                                        ? 'opacity-100'
                                        : 'opacity-25 hover:opacity-80'
                                } ${isSelected ? 'z-30 scale-105' : 'z-20'}`}
                            >
                                <button
                                    type="button"
                                    onClick={() => onSelectSkill(node)}
                                    onMouseEnter={() =>
                                        setHoveredSkillId(node.id)
                                    }
                                    onMouseLeave={() => setHoveredSkillId(null)}
                                    onFocus={() => setHoveredSkillId(node.id)}
                                    onBlur={() => setHoveredSkillId(null)}
                                    className={`group flex items-center gap-2.5 rounded-full border px-3 py-1.5 shadow-lg backdrop-blur-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                                        isSelected
                                            ? 'border-[var(--primary)] bg-[var(--surface)] text-[var(--text)] shadow-[0_0_24px_rgba(241,90,36,0.35)] ring-2 ring-[var(--primary)]/40'
                                            : isHovered
                                              ? 'border-[var(--accent)] bg-[var(--surface)] text-[var(--text)] shadow-[0_0_18px_rgba(213,243,74,0.25)]'
                                              : 'border-[var(--surface-border)] bg-[var(--surface)]/90 text-[var(--text)] hover:border-[var(--primary)]'
                                    }`}
                                    aria-label={`Inspect ${node.name}, ${node.category} engineering, proficiency ${level}%`}
                                >
                                    {/* Star Reticle / Icon Monogram */}
                                    <div
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                                            isSelected
                                                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--paper)] scale-110'
                                                : isHovered
                                                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]'
                                                  : 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text)] group-hover:border-[var(--primary)]'
                                        }`}
                                    >
                                        {IconComponent ? (
                                            <IconComponent className="h-3.5 w-3.5" />
                                        ) : (
                                            <span className="font-mono text-[9px] font-black">
                                                {node.name
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Technology Name (High-Contrast, Bold, Never Hidden) */}
                                    <span className="font-display text-xs sm:text-sm font-black tracking-tight text-[var(--text)] uppercase whitespace-nowrap">
                                        {node.name}
                                    </span>

                                    {/* Real Database Level Pill */}
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border ${
                                            node.level >= 90
                                                ? 'border-[var(--accent)]/60 bg-[var(--accent)]/15 text-[var(--accent)]'
                                                : 'border-[var(--surface-border)] bg-[var(--bg)] text-[var(--text-muted)]'
                                        }`}
                                    >
                                        {level}%
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom HUD Legend & Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--surface-border)] bg-[var(--bg)]/70 px-6 py-3 font-mono text-xs text-[var(--text-muted)]">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 font-bold uppercase text-[var(--text)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--signal-orange)]" />
                        BACKEND
                    </span>
                    <span className="flex items-center gap-1.5 font-bold uppercase text-[var(--text)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--acid-lime)]" />
                        FRONTEND
                    </span>
                    <span className="flex items-center gap-1.5 font-bold uppercase text-[var(--text)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--sand)]" />
                        PLATFORMS
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-wider text-[var(--accent)]">
                        ★ CLICK ANY STAR TO INSPECT TELEMETRY
                    </span>
                </div>
            </div>
        </div>
    );
}
