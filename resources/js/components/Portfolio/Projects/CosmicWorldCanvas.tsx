import React from 'react';
import { ProjectItem } from '@/types/portfolio';
import ProjectArchitecturalCover from './ProjectArchitecturalCover';

interface CosmicWorldCanvasProps {
    project: ProjectItem;
    sectorNumber: string;
    totalSectors: string;
    onExplore: () => void;
    isOff?: boolean;
}

export default function CosmicWorldCanvas({
    project,
    sectorNumber,
    totalSectors,
    onExplore,
    isOff = false,
}: CosmicWorldCanvasProps) {
    const accent = project.accent_color || '#F15A24';

    return (
        <div className="relative w-full overflow-hidden rounded-3xl border border-border/80 bg-[#121510] shadow-[0_20px_50px_rgba(0,0,0,0.4)] group">
            {/* Aspect Ratio Container: Cinematic Wide Surface */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
                {/* The Primary Architectural Visual */}
                <ProjectArchitecturalCover
                    project={project}
                    isFeatured={project.is_featured}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Subtle Ambient Cosmic Rim Wash at bottom */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-30 transition-opacity duration-500 group-hover:opacity-45"
                    style={{
                        background: `linear-gradient(to top, ${accent}, transparent)`,
                    }}
                />

                {/* Top Corner Registration Marks */}
                <span className="pointer-events-none absolute top-4 left-4 z-20 font-mono text-xs font-bold text-foreground/40 select-none">
                    +
                </span>
                <span className="pointer-events-none absolute top-4 right-4 z-20 font-mono text-xs font-bold text-foreground/40 select-none">
                    +
                </span>
                <span className="pointer-events-none absolute bottom-4 left-4 z-20 font-mono text-xs font-bold text-foreground/40 select-none">
                    +
                </span>
                <span className="pointer-events-none absolute bottom-4 right-4 z-20 font-mono text-xs font-bold text-foreground/40 select-none">
                    +
                </span>

                {/* Live Sector Badge */}
                <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5 rounded-full bg-black/70 backdrop-blur-md px-4 py-2 font-mono text-[11px] text-white border border-white/10 shadow-lg">
                    <span
                        className="h-2 w-2 rounded-full animate-pulse"
                        style={{
                            backgroundColor: accent,
                            boxShadow: `0 0 8px ${accent}`,
                        }}
                    />
                    <span className="tracking-widest font-bold">
                        SECTOR {sectorNumber} // {totalSectors}
                    </span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/80 uppercase">
                        {project.is_featured ? 'PRIME ARCHITECTURE' : 'VERIFIED SYSTEM'}
                    </span>
                </div>

                {/* Coordinates & Style Watermark */}
                <div className="absolute top-5 right-5 z-20 hidden sm:flex items-center gap-3 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 font-mono text-[10px] text-white/70 border border-white/10">
                    <span>STYLE: {project.planet_style?.toUpperCase() || 'GENERIC'}</span>
                    <span className="text-white/40">·</span>
                    <span>YEAR: {project.year || '2025'}</span>
                </div>

                {/* Quick Dossier Hover Overlay with Click-to-Explore */}
                <button
                    type="button"
                    onClick={onExplore}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 cursor-pointer focus:opacity-100 focus:outline-hidden"
                    aria-label={`Open dossier for ${project.title}`}
                >
                    <div className="flex items-center gap-3 rounded-full bg-surface px-6 py-3 font-mono text-xs font-bold tracking-widest text-foreground shadow-2xl border border-border transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: accent }}
                        />
                        <span>OPEN MISSION DOSSIER</span>
                        <span className="font-sans">→</span>
                    </div>
                </button>
            </div>
        </div>
    );
}
