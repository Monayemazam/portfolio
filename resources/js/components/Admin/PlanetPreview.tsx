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
        key: 'station',
        name: 'Architectural Station',
        description: 'Deep forest green and pale sand split canvas with architectural grid lines',
        defaultAccent: '#F15A24',
    },
    {
        key: 'rocky',
        name: 'Stark Monochrome',
        description: 'Stark ink black with warm paper diagonal slash and signal-orange bar',
        defaultAccent: '#F15A24',
    },
    {
        key: 'amber',
        name: 'Editorial Archival',
        description: 'Warm paper plate with deep forest frame and barcode rhythm graphic',
        defaultAccent: '#F15A24',
    },
    {
        key: 'ringed',
        name: 'Swiss Typographic',
        description: 'Pale sand background with ink black block and vertical Swiss column',
        defaultAccent: '#D5F34A',
    },
    {
        key: 'ocean',
        name: 'Marine Datum',
        description: 'Deep marine forest with acid-lime maritime datum rules and coordinates',
        defaultAccent: '#D5F34A',
    },
    {
        key: 'desert',
        name: 'Stepped Geometric',
        description: 'Signal orange stepped geometric frame on ink black with dispatch stamp',
        defaultAccent: '#F15A24',
    },
    {
        key: 'generic',
        name: 'Minimalist Plate',
        description: 'Balanced Swiss architectural grid highlighted with custom accent field',
        defaultAccent: '#F15A24',
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
        '#F15A24';
    const info =
        PLANET_STYLE_OPTIONS.find((p) => p.key === styleKey) ||
        PLANET_STYLE_OPTIONS[0];

    return (
        <div
            className={`inline-flex flex-col items-center justify-center ${className}`}
        >
            <div
                className="relative flex shrink-0 items-center justify-center overflow-hidden border border-border select-none"
                style={{ width: `${size}px`, height: `${size * 0.75}px` }}
                aria-label={`Style ${info.name}`}
            >
                {styleKey === 'station' && (
                    <div className="relative h-full w-full bg-[#173C32] text-[#F2EFE6] flex items-center justify-center p-1">
                        <div className="absolute right-0 bottom-0 w-2/5 h-1/2 bg-[#DED8CB]" />
                        <span className="relative z-10 font-display font-black text-xs text-white">
                            ST<span className="text-[#F15A24]">.</span>
                        </span>
                    </div>
                )}

                {styleKey === 'rocky' && (
                    <div className="relative h-full w-full bg-[#171914] text-[#F2EFE6] flex items-center justify-center p-1">
                        <div className="absolute top-0 left-1 w-0.5 h-full bg-[#F15A24]" />
                        <span className="font-display font-black text-xs text-[#F2EFE6]">
                            RC
                        </span>
                    </div>
                )}

                {styleKey === 'amber' && (
                    <div className="relative h-full w-full bg-[#F2EFE6] text-[#171914] flex items-center justify-center p-1 border-2 border-[#173C32]">
                        <span className="font-display font-black text-xs text-[#171914]">
                            AM<span className="text-[#F15A24]">.</span>
                        </span>
                    </div>
                )}

                {styleKey === 'ringed' && (
                    <div className="relative h-full w-full bg-[#DED8CB] text-[#171914] flex items-center justify-center p-1">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#171914]" />
                        <span className="relative z-10 font-display font-black text-xs text-[#171914]">
                            RG
                        </span>
                    </div>
                )}

                {styleKey === 'ocean' && (
                    <div className="relative h-full w-full bg-[#173C32] text-[#F2EFE6] flex items-center justify-center p-1">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#D5F34A]/40" />
                        <span className="relative z-10 font-display font-black text-xs text-[#F2EFE6]">
                            OC<span className="text-[#D5F34A]">.</span>
                        </span>
                    </div>
                )}

                {styleKey === 'desert' && (
                    <div className="relative h-full w-full bg-[#171914] text-[#F2EFE6] flex items-center justify-center p-1">
                        <div className="absolute top-0 right-0 w-2 h-2 bg-[#F15A24]" />
                        <span className="font-display font-black text-xs text-[#F2EFE6]">
                            DS<span className="text-[#F15A24]">.</span>
                        </span>
                    </div>
                )}

                {styleKey === 'generic' && (
                    <div className="relative h-full w-full bg-[#171914] text-[#F2EFE6] flex items-center justify-center p-1">
                        <div
                            className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-30"
                            style={{ backgroundColor: accent }}
                        />
                        <span className="relative z-10 font-display font-black text-xs text-[#F2EFE6]">
                            GN<span style={{ color: accent }}>.</span>
                        </span>
                    </div>
                )}
            </div>

            {showLabel && (
                <div className="mt-2 text-center">
                    <p className="font-mono text-xs font-semibold text-foreground">
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
                        className={`group relative flex flex-col items-center border p-3 text-center transition-all duration-200 focus:outline-hidden ${
                            isSelected
                                ? 'border-[var(--primary)] bg-surface shadow-xs ring-2 ring-[var(--primary)]'
                                : 'border-border bg-background hover:border-foreground/40'
                        }`}
                    >
                        <PlanetPreview
                            styleKey={style.key}
                            accentColor={accentColor}
                            size={56}
                        />
                        <div className="mt-2 flex flex-col items-center">
                            <span
                                className={`font-mono text-[11px] font-bold tracking-wider uppercase ${
                                    isSelected
                                        ? 'text-[var(--primary)]'
                                        : 'text-foreground'
                                }`}
                            >
                                {style.name.split(' ')[0]}
                            </span>
                            <span className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">
                                {style.description.split(',')[0]}
                            </span>
                        </div>
                        {isSelected && (
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                <span className="h-2 w-2 bg-[var(--primary)]" />
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
