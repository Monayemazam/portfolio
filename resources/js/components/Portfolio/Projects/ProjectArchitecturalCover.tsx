import React from 'react';
import { ProjectItem } from '@/types/portfolio';

interface ProjectArchitecturalCoverProps {
    project: ProjectItem;
    isFeatured?: boolean;
    className?: string;
}

// Extract deterministic initials or monogram from project title
function getProjectInitials(title: string): string {
    const words = title.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.slice(0, 3).toUpperCase();
}

export default function ProjectArchitecturalCover({
    project,
    isFeatured = false,
    className = '',
}: ProjectArchitecturalCoverProps) {
    const initials = getProjectInitials(project.title);
    const style = project.planet_style || 'generic';
    const accent = project.accent_color || 'var(--primary)';

    const paddingClass = isFeatured ? 'p-6 sm:p-8' : 'p-4 sm:p-5';
    const monogramClass = isFeatured
        ? 'text-[clamp(4.5rem,10vw,8rem)]'
        : 'text-4xl sm:text-5xl';

    // If actual uploaded media exists, display it with clean architectural editorial treatment
    if (project.cover_media?.url) {
        return (
            <div
                className={`relative w-full h-full overflow-hidden bg-[var(--surface)] ${className}`}
            >
                {/* Real Media Image with smooth subtle scale on hover */}
                <img
                    src={project.cover_media.webp_url || project.cover_media.url}
                    alt={project.cover_media.alt_text || `${project.title} screenshot`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />

                {/* Corner Hairline Registration Marks */}
                <span className="pointer-events-none absolute top-2 left-2 font-mono text-xs font-bold text-[var(--primary)] z-10 select-none opacity-70">
                    +
                </span>
                <span className="pointer-events-none absolute top-2 right-2 font-mono text-xs font-bold text-[var(--primary)] z-10 select-none opacity-70">
                    +
                </span>
                <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-xs font-bold text-[var(--primary)] z-10 select-none opacity-70">
                    +
                </span>
                <span className="pointer-events-none absolute bottom-2 right-2 font-mono text-xs font-bold text-[var(--primary)] z-10 select-none opacity-70">
                    +
                </span>

                {/* Architectural Caption Strip */}
                <div className="absolute bottom-3 left-3 z-10 bg-[var(--surface)]/90 border border-[var(--surface-border)] px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-[var(--text)] uppercase backdrop-blur-md flex items-center gap-2 shadow-sm rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                    <span>{project.slug} // ARCHIVE</span>
                </div>
            </div>
        );
    }

    // Deterministic architectural poster fallback when media is null
    return (
        <div
            className={`relative w-full h-full select-none overflow-hidden transition-all duration-300 ${className}`}
        >
            {/* Corner Registration Marks */}
            <span className="pointer-events-none absolute top-2 left-2 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                +
            </span>
            <span className="pointer-events-none absolute top-2 right-2 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                +
            </span>
            <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                +
            </span>
            <span className="pointer-events-none absolute bottom-2 right-2 font-mono text-xs font-bold text-[var(--primary)] z-20 select-none opacity-80">
                +
            </span>

            {/* Architectural Layout Variations by project style */}
            {style === 'station' && (
                /* Station: Deep forest green + Sand split canvas with geometric monogram and architectural grid */
                <div className={`relative h-full w-full bg-[var(--forest)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Architectural grid lines */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-15"
                        style={{
                            backgroundImage: `linear-gradient(to right, var(--paper) 1px, transparent 1px),
                                              linear-gradient(to bottom, var(--paper) 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                        }}
                    />

                    {/* Bold rectangular color block cutting across bottom right */}
                    <div className="absolute right-0 bottom-0 w-2/5 h-2/5 bg-[var(--sand)] border-t border-l border-[var(--ink)] text-[var(--ink)] p-2.5 flex flex-col justify-end font-mono text-[8px] sm:text-[9px] font-bold tracking-widest uppercase">
                        <span>MODULE // {project.year || '2025'}</span>
                        <span className="text-[var(--primary)]">ARCH. SYSTEM</span>
                    </div>

                    {/* Top Architectural Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--paper)]/70 border-b border-[var(--paper)]/20 pb-1.5">
                        <span className="truncate max-w-[70%]">SYS: {project.business_type || 'ENTERPRISE PLATFORM'}</span>
                        <span className="text-[var(--accent)] font-bold">[ONLINE]</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                            <span className="text-[var(--primary)]">.</span>
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[var(--accent)] uppercase truncate">
                            // {project.title}
                        </div>
                    </div>

                    {/* Bottom Status Marker */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-widest uppercase text-[var(--paper)]/60">
                        <span>EST. {project.year || '2025'}</span>
                        <span>PRODUCTION SPEC</span>
                    </div>
                </div>
            )}

            {style === 'rocky' && (
                /* Rocky: Stark ink black with warm paper cutout and signal-orange bar */
                <div className={`relative h-full w-full bg-[var(--ink)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Diagonal Architectural Split */}
                    <div
                        className="pointer-events-none absolute top-0 right-0 w-2/3 h-full bg-[var(--forest)]/40"
                        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    />

                    {/* Signal Orange Vertical Calibration Bar */}
                    <div className="absolute top-0 left-4 w-1 h-full bg-[var(--primary)]" />

                    {/* Top Metadata */}
                    <div className="relative z-10 pl-4 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--paper)]/70">
                        <span>INDEX // {project.slug.toUpperCase()}</span>
                        <span className="bg-[var(--primary)] text-white px-1.5 py-0.5 font-bold text-[8px]">SPEC 01</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 pl-4 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] sm:text-xs tracking-widest text-[var(--primary)] uppercase font-bold truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Hairline */}
                    <div className="relative z-10 pl-4 flex items-center justify-between border-t border-[var(--paper)]/20 pt-1.5 font-mono text-[9px] text-[var(--paper)]/60 uppercase">
                        <span className="truncate max-w-[60%]">{project.role || 'LEAD ARCHITECT'}</span>
                        <span>{project.year || '2025'}</span>
                    </div>
                </div>
            )}

            {style === 'amber' && (
                /* Amber: Warm Paper surface with Deep Forest frame, signal-orange stamp, and debossed initials */
                <div className={`relative h-full w-full bg-[var(--paper)] text-[var(--ink)] flex flex-col justify-between ${paddingClass} border-2 sm:border-4 border-[var(--forest)]`}>
                    {/* Top Archival Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--ink)]/70 border-b border-[var(--ink)]/20 pb-1.5">
                        <span>EDITION // ARCHIVAL</span>
                        <span className="font-bold text-[var(--primary)]">{project.year || '2024'}</span>
                    </div>

                    {/* Geometric Architectural Monogram with Orange Accent Plate */}
                    <div className="relative z-10 my-auto">
                        <div className="inline-block relative">
                            <span className="absolute -inset-1.5 bg-[var(--primary)]/15 transform -rotate-1 pointer-events-none" />
                            <div className={`relative font-display font-black leading-[0.85] tracking-tighter ${monogramClass} text-[var(--ink)] transition-transform duration-300 group-hover:translate-x-1`}>
                                {initials}
                                <span className="text-[var(--primary)]">.</span>
                            </div>
                        </div>
                        <div className="mt-2 font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[var(--forest)] uppercase truncate">
                            // {project.title}
                        </div>
                    </div>

                    {/* Barcode-inspired Rhythm Graphic at Bottom */}
                    <div className="relative z-10 flex items-center justify-between pt-1.5 border-t border-[var(--ink)]/20 font-mono text-[9px] text-[var(--ink)]/70 uppercase">
                        <div className="flex items-center gap-1">
                            <span className="h-2.5 w-1 bg-[var(--ink)]" />
                            <span className="h-2.5 w-0.5 bg-[var(--ink)]" />
                            <span className="h-2.5 w-1.5 bg-[var(--ink)]" />
                            <span className="h-2.5 w-0.5 bg-[var(--ink)]" />
                            <span className="h-2.5 w-2 bg-[var(--primary)]" />
                        </div>
                        <span className="font-bold truncate max-w-[60%]">{project.business_type || 'COMMERCE'}</span>
                    </div>
                </div>
            )}

            {style === 'ringed' && (
                /* Ringed: Pale Sand with Stark Ink Black blocks and vertical Swiss typographic column */
                <div className={`relative h-full w-full bg-[var(--sand)] text-[var(--ink)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Left stark ink vertical bar */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--ink)] text-[var(--paper)] p-3 flex flex-col justify-between font-mono text-[8px] uppercase tracking-widest">
                        <span className="text-[var(--accent)] font-bold">SWISS / 01</span>
                        <span className="rotate-90 origin-bottom-left whitespace-nowrap text-[var(--sand)]/60">
                            ARCHITECTURE
                        </span>
                        <span>{project.year || '2024'}</span>
                    </div>

                    {/* Top Reference */}
                    <div className="relative z-10 w-3/5 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--ink)]/70 border-b border-[var(--ink)]/20 pb-1.5">
                        <span className="truncate block">REF // {project.slug}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 w-3/5 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--ink)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[var(--primary)] uppercase truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="relative z-10 w-3/5 font-mono text-[9px] text-[var(--ink)]/70 uppercase">
                        <span className="truncate block">{project.business_type || 'ENTERPRISE'}</span>
                    </div>
                </div>
            )}

            {style === 'ocean' && (
                /* Ocean: Deep Marine Forest + Acid Lime with maritime datum lines */
                <div className={`relative h-full w-full bg-[var(--forest)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Architectural horizontal datum lines */}
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-[var(--accent)]/30" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-[var(--accent)]/30" />

                    {/* Top Maritime Datum Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--accent)]">
                        <span className="truncate max-w-[70%]">FLEET DISPATCH // LOGISTICS</span>
                        <span className="bg-[var(--accent)] text-[var(--ink)] px-1.5 py-0.5 font-bold text-[8px]">PORT 01</span>
                    </div>

                    {/* Oversized Monogram with Marine Precision */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                            <span className="text-[var(--accent)]">.</span>
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[var(--accent)] uppercase truncate">
                            // {project.title}
                        </div>
                    </div>

                    {/* Bottom Status */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-[var(--paper)]/70 uppercase border-t border-[var(--paper)]/20 pt-1.5">
                        <span>LAT 23°N</span>
                        <span className="text-[var(--primary)] font-bold">ACTIVE ROUTE</span>
                    </div>
                </div>
            )}

            {style === 'desert' && (
                /* Desert: Signal Orange stepped architectural frame on Ink Black */
                <div className={`relative h-full w-full bg-[var(--ink)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Stepped Signal Orange Block on Top Right */}
                    <div className="absolute top-0 right-0 w-24 sm:w-28 h-12 sm:h-14 bg-[var(--primary)] text-[var(--ink)] p-2 flex items-center justify-center font-mono text-[9px] font-bold tracking-widest uppercase shadow-sm">
                        <span>DISPATCH</span>
                    </div>

                    {/* Top Reference */}
                    <div className="relative z-10 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--paper)]/70 border-b border-[var(--paper)]/20 pb-1.5 w-2/3">
                        <span className="truncate block">EXPEDITION // {project.slug.toUpperCase()}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                            <span className="text-[var(--primary)]">.</span>
                        </div>
                        <div className="mt-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[var(--primary)] uppercase truncate">
                            // {project.title}
                        </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-[var(--paper)]/60 uppercase border-t border-[var(--paper)]/20 pt-1.5">
                        <span className="truncate max-w-[60%]">{project.business_type || 'COMMERCE'}</span>
                        <span className="text-[var(--primary)] font-bold">{project.year || '2024'}</span>
                    </div>
                </div>
            )}

            {style !== 'station' &&
                style !== 'rocky' &&
                style !== 'amber' &&
                style !== 'ringed' &&
                style !== 'ocean' &&
                style !== 'desert' && (
                    /* Generic / Default: Architectural Swiss poster using project accent color */
                    <div className={`relative h-full w-full bg-[var(--ink)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                        {/* Accent Color Field in Background */}
                        <div
                            className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-25"
                            style={{ backgroundColor: accent }}
                        />

                        {/* Top Header */}
                        <div className="relative z-10 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--paper)]/70 border-b border-[var(--paper)]/20 pb-1.5">
                            <span className="truncate max-w-[70%]">CASE STUDY // {project.slug}</span>
                            <span className="font-bold text-[var(--primary)]">{project.year || '2025'}</span>
                        </div>

                        {/* Monogram */}
                        <div className="relative z-10 my-auto">
                            <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                                {initials}
                                <span style={{ color: accent }}>.</span>
                            </div>
                            <div className="mt-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase truncate" style={{ color: accent }}>
                                {project.title}
                            </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-[var(--paper)]/60 uppercase border-t border-[var(--paper)]/20 pt-1.5">
                            <span className="truncate max-w-[60%]">{project.business_type || 'DIGITAL SYSTEM'}</span>
                            <span>{project.role || 'FULL-STACK'}</span>
                        </div>
                    </div>
                )}

            {/* Subtle Hover Accent Bar along the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--primary)] transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 z-30" />
        </div>
    );
}
