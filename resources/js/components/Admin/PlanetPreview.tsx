import React from 'react';
import type { PlanetStyle } from '@/types/admin';

interface PlanetPreviewProps {
    styleKey: PlanetStyle;
    accentColor?: string | null;
    size?: number;
    className?: string;
    showLabel?: boolean;
}

export const PLANET_STYLE_OPTIONS: Array<{
    key: PlanetStyle;
    name: string;
    description: string;
    defaultAccent: string;
}> = [
    {
        key: 'rocky',
        name: 'Rocky (Mercury)',
        description: 'Cratered rock, silver-grey surface, thin sun glow',
        defaultAccent: '#94A3B8',
    },
    {
        key: 'station',
        name: 'Cargo Station (ASN)',
        description:
            'Steel-blue orbital station with 4 docking arms & cyan beacons',
        defaultAccent: '#22D3EE',
    },
    {
        key: 'amber',
        name: 'Amber (Tasa)',
        description: 'Warm amber leather grain with equator stitch detailing',
        defaultAccent: '#B45309',
    },
    {
        key: 'ringed',
        name: 'Ringed (Tazwar)',
        description: 'Gas giant banded sphere with tilted rings & orbit track',
        defaultAccent: '#A78BFA',
    },
    {
        key: 'ocean',
        name: 'Ocean (Sinbad)',
        description:
            'Deep blue water surface, cloud swirls & maritime starship route',
        defaultAccent: '#84CC16',
    },
    {
        key: 'desert',
        name: 'Desert (Ayra)',
        description:
            'Red-orange canyon chasm sphere with orbiting companion moon',
        defaultAccent: '#EF4444',
    },
    {
        key: 'generic',
        name: 'Generic Orbit',
        description:
            'Smooth atmospheric sphere illuminated by custom accent glow',
        defaultAccent: '#38BDF8',
    },
];

export default function PlanetPreview({
    styleKey,
    accentColor,
    size = 48,
    className = '',
    showLabel = false,
}: PlanetPreviewProps) {
    const accent =
        accentColor ||
        PLANET_STYLE_OPTIONS.find((p) => p.key === styleKey)?.defaultAccent ||
        'var(--secondary)';
    const info =
        PLANET_STYLE_OPTIONS.find((p) => p.key === styleKey) ||
        PLANET_STYLE_OPTIONS[6];

    return (
        <div
            className={`inline-flex flex-col items-center justify-center ${className}`}
        >
            <div
                className="relative flex shrink-0 items-center justify-center overflow-visible"
                style={{ width: `${size}px`, height: `${size}px` }}
                aria-label={`Planet style ${info.name}`}
            >
                {styleKey === 'rocky' && (
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full drop-shadow-md"
                    >
                        <defs>
                            <radialGradient
                                id="rocky-grad"
                                cx="35%"
                                cy="35%"
                                r="65%"
                            >
                                <stop offset="0%" stopColor="#E2E8F0" />
                                <stop offset="45%" stopColor="#94A3B8" />
                                <stop offset="85%" stopColor="#475569" />
                                <stop offset="100%" stopColor="#1E293B" />
                            </radialGradient>
                            <linearGradient
                                id="comet-trail"
                                x1="0%"
                                y1="100%"
                                x2="100%"
                                y2="0%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={accent}
                                    stopOpacity="0"
                                />
                                <stop
                                    offset="100%"
                                    stopColor={accent}
                                    stopOpacity="0.8"
                                />
                            </linearGradient>
                        </defs>
                        {/* Comet trail */}
                        <path
                            d="M 15 85 Q 25 55 45 40"
                            stroke="url(#comet-trail)"
                            strokeWidth="2.5"
                            fill="none"
                            strokeDasharray="3 3"
                        />
                        {/* Sun glow atmosphere */}
                        <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke={accent}
                            strokeWidth="1.5"
                            strokeOpacity="0.4"
                        />
                        {/* Planet body */}
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="url(#rocky-grad)"
                        />
                        {/* Craters */}
                        <circle
                            cx="40"
                            cy="38"
                            r="7"
                            fill="#64748B"
                            opacity="0.6"
                        />
                        <circle
                            cx="40"
                            cy="38"
                            r="6"
                            fill="#334155"
                            opacity="0.8"
                        />
                        <circle
                            cx="62"
                            cy="46"
                            r="5"
                            fill="#475569"
                            opacity="0.7"
                        />
                        <circle
                            cx="52"
                            cy="62"
                            r="8"
                            fill="#334155"
                            opacity="0.75"
                        />
                        <circle
                            cx="36"
                            cy="60"
                            r="4"
                            fill="#475569"
                            opacity="0.6"
                        />
                    </svg>
                )}

                {styleKey === 'station' && (
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full drop-shadow-md"
                    >
                        <defs>
                            <linearGradient
                                id="station-metal"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#0EA5E9" />
                                <stop offset="50%" stopColor="#0369A1" />
                                <stop offset="100%" stopColor="#082F49" />
                            </linearGradient>
                        </defs>
                        {/* Orbital ring */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={accent}
                            strokeWidth="2"
                            strokeDasharray="6 4"
                            opacity="0.5"
                        />
                        {/* Station ring */}
                        <circle
                            cx="50"
                            cy="50"
                            r="28"
                            fill="none"
                            stroke="url(#station-metal)"
                            strokeWidth="6"
                        />
                        {/* 4 Docking arms */}
                        <line
                            x1="50"
                            y1="12"
                            x2="50"
                            y2="88"
                            stroke="#38BDF8"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <line
                            x1="12"
                            y1="50"
                            x2="88"
                            y2="50"
                            stroke="#38BDF8"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Docking pods */}
                        <circle cx="50" cy="14" r="3" fill="#E0F2FE" />
                        <circle cx="50" cy="86" r="3" fill="#E0F2FE" />
                        <circle cx="14" cy="50" r="3" fill="#E0F2FE" />
                        <circle cx="86" cy="50" r="3" fill="#E0F2FE" />
                        {/* Core hub */}
                        <circle
                            cx="50"
                            cy="50"
                            r="14"
                            fill="#0C4A6E"
                            stroke={accent}
                            strokeWidth="2"
                        />
                        <circle cx="50" cy="50" r="5" fill="#38BDF8" />
                    </svg>
                )}

                {styleKey === 'amber' && (
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full drop-shadow-md"
                    >
                        <defs>
                            <radialGradient
                                id="amber-grad"
                                cx="30%"
                                cy="30%"
                                r="70%"
                            >
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="40%" stopColor="#D97706" />
                                <stop offset="80%" stopColor="#78350F" />
                                <stop offset="100%" stopColor="#451A03" />
                            </radialGradient>
                        </defs>
                        <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke={accent}
                            strokeWidth="1"
                            opacity="0.4"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="url(#amber-grad)"
                        />
                        {/* Equator stitch line */}
                        <path
                            d="M 15 50 Q 50 64 85 50"
                            fill="none"
                            stroke="#FDE68A"
                            strokeWidth="1.8"
                            strokeDasharray="3 2.5"
                            opacity="0.85"
                        />
                        {/* Grain lines */}
                        <path
                            d="M 22 36 Q 50 48 78 36"
                            fill="none"
                            stroke="#B45309"
                            strokeWidth="1.2"
                            opacity="0.6"
                        />
                        <path
                            d="M 24 64 Q 50 76 76 64"
                            fill="none"
                            stroke="#78350F"
                            strokeWidth="1.2"
                            opacity="0.7"
                        />
                    </svg>
                )}

                {styleKey === 'ringed' && (
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full overflow-visible drop-shadow-md"
                    >
                        <defs>
                            <radialGradient
                                id="ringed-grad"
                                cx="35%"
                                cy="35%"
                                r="65%"
                            >
                                <stop offset="0%" stopColor="#DDD6FE" />
                                <stop offset="35%" stopColor="#C4B5FD" />
                                <stop offset="70%" stopColor="#7C3AED" />
                                <stop offset="100%" stopColor="#4C1D95" />
                            </radialGradient>
                            <linearGradient
                                id="ring-grad"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#EDE9FE"
                                    stopOpacity="0.85"
                                />
                                <stop
                                    offset="50%"
                                    stopColor={accent}
                                    stopOpacity="0.75"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#A78BFA"
                                    stopOpacity="0.2"
                                />
                            </linearGradient>
                        </defs>
                        {/* Back segment of tilted ring */}
                        <ellipse
                            cx="50"
                            cy="50"
                            rx="46"
                            ry="14"
                            fill="none"
                            stroke="url(#ring-grad)"
                            strokeWidth="4.5"
                            transform="rotate(-24 50 50)"
                            strokeDasharray="140 140"
                            strokeDashoffset="140"
                        />
                        {/* Gas sphere */}
                        <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="url(#ringed-grad)"
                        />
                        {/* Atmospheric gas bands */}
                        <path
                            d="M 22 46 Q 50 54 78 46"
                            fill="none"
                            stroke="#EDE9FE"
                            strokeWidth="2.5"
                            opacity="0.4"
                        />
                        <path
                            d="M 20 54 Q 50 62 80 54"
                            fill="none"
                            stroke="#5B21B6"
                            strokeWidth="2"
                            opacity="0.5"
                        />
                        {/* Front segment of tilted ring */}
                        <ellipse
                            cx="50"
                            cy="50"
                            rx="46"
                            ry="14"
                            fill="none"
                            stroke="url(#ring-grad)"
                            strokeWidth="4.5"
                            transform="rotate(-24 50 50)"
                            strokeDasharray="140 140"
                            strokeDashoffset="0"
                        />
                        <ellipse
                            cx="50"
                            cy="50"
                            rx="41"
                            ry="11"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1"
                            transform="rotate(-24 50 50)"
                            opacity="0.4"
                        />
                    </svg>
                )}

                {styleKey === 'ocean' && (
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full drop-shadow-md"
                    >
                        <defs>
                            <radialGradient
                                id="ocean-grad"
                                cx="30%"
                                cy="30%"
                                r="70%"
                            >
                                <stop offset="0%" stopColor="#38BDF8" />
                                <stop offset="40%" stopColor="#0284C7" />
                                <stop offset="80%" stopColor="#0369A1" />
                                <stop offset="100%" stopColor="#082F49" />
                            </radialGradient>
                        </defs>
                        <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke={accent}
                            strokeWidth="1.5"
                            opacity="0.5"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="url(#ocean-grad)"
                        />
                        {/* Maritime cloud wisps */}
                        <path
                            d="M 24 35 Q 38 30 52 38 T 76 34"
                            fill="none"
                            stroke="#E0F2FE"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            opacity="0.65"
                        />
                        <path
                            d="M 20 56 Q 40 48 60 58 T 80 52"
                            fill="none"
                            stroke="#E0F2FE"
                            strokeWidth="3"
                            strokeLinecap="round"
                            opacity="0.5"
                        />
                        {/* Starship shipping route & beacon */}
                        <path
                            d="M 18 68 Q 50 78 82 62"
                            fill="none"
                            stroke={accent}
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                        />
                        <circle
                            cx="68"
                            cy="70"
                            r="2.5"
                            fill={accent}
                            className="animate-pulse"
                        />
                    </svg>
                )}

                {styleKey === 'desert' && (
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full overflow-visible drop-shadow-md"
                    >
                        <defs>
                            <radialGradient
                                id="desert-grad"
                                cx="30%"
                                cy="30%"
                                r="70%"
                            >
                                <stop offset="0%" stopColor="#FB923C" />
                                <stop offset="40%" stopColor="#EA580C" />
                                <stop offset="80%" stopColor="#9A3412" />
                                <stop offset="100%" stopColor="#431407" />
                            </radialGradient>
                        </defs>
                        {/* Orbiting moon track */}
                        <ellipse
                            cx="50"
                            cy="50"
                            rx="44"
                            ry="18"
                            fill="none"
                            stroke="#FED7AA"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                            transform="rotate(20 50 50)"
                            opacity="0.4"
                        />
                        {/* Planet body */}
                        <circle
                            cx="50"
                            cy="50"
                            r="33"
                            fill="url(#desert-grad)"
                        />
                        {/* Canyon chasms */}
                        <path
                            d="M 28 42 Q 42 48 55 40 T 72 48"
                            fill="none"
                            stroke="#7C2D12"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 32 60 Q 48 66 68 58"
                            fill="none"
                            stroke="#431407"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Orbiting tiny grey moon */}
                        <g transform="rotate(20 50 50)">
                            <circle
                                cx="88"
                                cy="50"
                                r="4.5"
                                fill="#E2E8F0"
                                stroke="#64748B"
                                strokeWidth="1"
                            />
                        </g>
                    </svg>
                )}

                {styleKey === 'generic' && (
                    <svg
                        viewBox="0 0 100 100"
                        className="h-full w-full drop-shadow-md"
                    >
                        <defs>
                            <radialGradient
                                id="generic-grad"
                                cx="35%"
                                cy="35%"
                                r="65%"
                            >
                                <stop offset="0%" stopColor="#F0F9FF" />
                                <stop offset="30%" stopColor={accent} />
                                <stop offset="75%" stopColor="#0F172A" />
                                <stop offset="100%" stopColor="#020617" />
                            </radialGradient>
                        </defs>
                        {/* Atmosphere ring */}
                        <circle
                            cx="50"
                            cy="50"
                            r="39"
                            fill="none"
                            stroke={accent}
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        {/* Sphere */}
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="url(#generic-grad)"
                        />
                        {/* Subtle highlight arc */}
                        <path
                            d="M 24 35 A 30 30 0 0 1 50 20"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            opacity="0.6"
                        />
                    </svg>
                )}
            </div>

            {showLabel && (
                <div className="mt-2 text-center">
                    <p className="font-['Orbitron',sans-serif] text-xs font-semibold text-[var(--text)]">
                        {info.name}
                    </p>
                </div>
            )}
        </div>
    );
}

interface PlanetStyleSelectorProps {
    value: PlanetStyle;
    onChange: (value: PlanetStyle) => void;
    accentColor?: string | null;
}

export function PlanetStyleSelector({
    value,
    onChange,
    accentColor,
}: PlanetStyleSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {PLANET_STYLE_OPTIONS.map((style) => {
                const isSelected = value === style.key;
                return (
                    <button
                        key={style.key}
                        type="button"
                        onClick={() => onChange(style.key)}
                        className={`group relative flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-200 focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none ${
                            isSelected
                                ? 'border-[var(--secondary)] bg-[var(--surface-active)] shadow-sm'
                                : 'border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--secondary)]/50 hover:bg-[var(--surface-hover)]'
                        }`}
                    >
                        <PlanetPreview
                            styleKey={style.key}
                            accentColor={accentColor}
                            size={56}
                        />
                        <div className="mt-2 flex flex-col items-center">
                            <span
                                className={`font-['Orbitron',sans-serif] text-[11px] font-bold tracking-wider uppercase ${
                                    isSelected
                                        ? 'text-[var(--secondary)]'
                                        : 'text-[var(--text)]'
                                }`}
                            >
                                {style.name.split(' ')[0]}
                            </span>
                            <span className="mt-0.5 line-clamp-1 text-[10px] text-[var(--text-muted)]">
                                {style.description.split(',')[0]}
                            </span>
                        </div>
                        {isSelected && (
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--secondary)] opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--secondary)]" />
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
