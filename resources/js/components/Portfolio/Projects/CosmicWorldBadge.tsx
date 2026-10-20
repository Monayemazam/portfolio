import React from 'react';
import { ProjectItem } from '@/types/portfolio';

interface CosmicWorldBadgeProps {
    project: ProjectItem;
    index: number;
    isActive: boolean;
    onSelect: () => void;
    isOff?: boolean;
}

export default function CosmicWorldBadge({
    project,
    index,
    isActive,
    onSelect,
    isOff = false,
}: CosmicWorldBadgeProps) {
    const accent = project.accent_color || '#F15A24';
    const style = project.planet_style || 'generic';
    const num = (index + 1).toString().padStart(2, '0');

    // Distinct SVG silhouettes based on visual style
    const renderSilhouette = () => {
        switch (style) {
            case 'station':
                // Luminous orbital spaceframe
                return (
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                        <polygon
                            points="24,6 40,15 40,33 24,42 8,33 8,15"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                            className="transition-colors duration-300"
                        />
                        <polygon
                            points="24,14 33,19 33,29 24,34 15,29 15,19"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            className="opacity-70 transition-colors duration-300"
                        />
                        <circle cx="24" cy="24" r="3" fill={accent} />
                        <line x1="24" y1="6" x2="24" y2="14" stroke={accent} strokeWidth="1" />
                        <line x1="24" y1="34" x2="24" y2="42" stroke={accent} strokeWidth="1" />
                    </svg>
                );
            case 'ocean':
                // Maritime bathymetric contours & beacon pulse
                return (
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                        <path
                            d="M8,28 C14,24 18,32 24,28 C30,24 34,32 40,28"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                        />
                        <path
                            d="M8,34 C14,30 18,38 24,34 C30,30 34,38 40,34"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1"
                            className="opacity-50"
                        />
                        <path
                            d="M8,22 C14,18 18,26 24,22 C30,18 34,26 40,22"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1"
                            className="opacity-70"
                        />
                        <circle cx="24" cy="14" r="3.5" fill={accent} />
                        <line x1="24" y1="8" x2="24" y2="10.5" stroke={accent} strokeWidth="1.5" />
                    </svg>
                );
            case 'rocky':
                // Brutalist geological monolith
                return (
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                        <rect
                            x="14"
                            y="8"
                            width="20"
                            height="32"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                        />
                        <line
                            x1="20"
                            y1="8"
                            x2="20"
                            y2="40"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1"
                            strokeDasharray="2 2"
                        />
                        <rect x="17" y="14" width="6" height="4" fill={accent} />
                        <line x1="8" y1="24" x2="14" y2="24" stroke={accent} strokeWidth="1" />
                        <line x1="34" y1="24" x2="40" y2="24" stroke={accent} strokeWidth="1" />
                    </svg>
                );
            case 'amber':
                // Warm archival vault & debossed geometry
                return (
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                        <rect
                            x="10"
                            y="10"
                            width="28"
                            height="28"
                            rx="2"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                        />
                        <rect
                            x="16"
                            y="16"
                            width="16"
                            height="16"
                            stroke={accent}
                            strokeWidth="1"
                            fill={isActive ? `${accent}20` : 'none'}
                        />
                        <circle cx="24" cy="24" r="2.5" fill={accent} />
                        <line x1="10" y1="10" x2="16" y2="16" stroke={accent} strokeWidth="1" />
                        <line x1="38" y1="10" x2="32" y2="16" stroke={accent} strokeWidth="1" />
                    </svg>
                );
            case 'ringed':
                // Cantilevered structural grid with coronal ring
                return (
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                        <ellipse
                            cx="24"
                            cy="24"
                            rx="18"
                            ry="7"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                            transform="rotate(-15 24 24)"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="8"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                            fill={isActive ? `${accent}25` : 'none'}
                        />
                        <line x1="6" y1="24" x2="12" y2="24" stroke={accent} strokeWidth="1" />
                        <line x1="36" y1="24" x2="42" y2="24" stroke={accent} strokeWidth="1" />
                    </svg>
                );
            case 'desert':
                // Terraced solar citadel / angular stepped plateau
                return (
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                        <polygon
                            points="24,8 38,38 10,38"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                        />
                        <line
                            x1="15"
                            y1="28"
                            x2="33"
                            y2="28"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1"
                        />
                        <line
                            x1="19"
                            y1="18"
                            x2="29"
                            y2="18"
                            stroke={accent}
                            strokeWidth="1"
                        />
                        <circle cx="24" cy="13" r="2" fill={accent} />
                    </svg>
                );
            default:
                // Sleek geometric prism
                return (
                    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                        <polygon
                            points="24,6 40,24 24,42 8,24"
                            stroke={isActive ? accent : 'currentColor'}
                            strokeWidth="1.5"
                        />
                        <circle cx="24" cy="24" r="3" fill={accent} />
                    </svg>
                );
        }
    };

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left focus:outline-hidden min-w-[150px] sm:min-w-[170px] lg:min-w-[180px] shrink-0 ${
                isActive
                    ? 'border-foreground/80 bg-surface text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.3)] scale-102 ring-1 ring-foreground/20'
                    : 'border-border/60 bg-surface/30 backdrop-blur-md text-muted-foreground hover:border-foreground/40 hover:text-foreground hover:bg-surface/50'
            }`}
            aria-label={`Enter world: ${project.title}`}
            aria-selected={isActive}
            role="tab"
        >
            {/* Ambient Backlight for Active World */}
            {isActive && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 blur-md transition-opacity"
                    style={{ backgroundColor: accent }}
                />
            )}

            {/* Top Telemetry Row */}
            <div className="relative z-10 w-full flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
                <span className="font-bold text-foreground">SECTOR {num}</span>
                {project.is_featured ? (
                    <span
                        className="rounded-full px-2 py-0.5 font-bold text-[9px] border"
                        style={{
                            borderColor: `${accent}60`,
                            backgroundColor: `${accent}20`,
                            color: accent,
                        }}
                    >
                        PRIME
                    </span>
                ) : (
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                )}
            </div>

            {/* Central World Silhouette */}
            <div className="relative z-10 my-3 w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {renderSilhouette()}
            </div>

            {/* Bottom Project Name & Classification */}
            <div className="relative z-10 w-full border-t border-border/40 pt-2.5">
                <div className="font-display text-xs font-bold uppercase tracking-tight text-foreground truncate">
                    {project.title}
                </div>
                <div className="mt-0.5 font-mono text-[9px] text-muted-foreground truncate uppercase">
                    {project.business_type || 'DIGITAL SYSTEM'}
                </div>
            </div>

            {/* Active Pointer Mark at bottom */}
            {isActive && (
                <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
                />
            )}
        </button>
    );
}
