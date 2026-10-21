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
    const accent = project.accent_color || '#F15A24';

    // If actual uploaded media exists, display it with clean architectural editorial treatment
    if (project.cover_media?.url) {
        return (
            <div
                className={`relative w-full h-full overflow-hidden bg-[var(--surface)] ${className}`}
            >
                {/* Real Media Image with smooth subtle scale on hover */}
                <img
                    src={project.cover_media.webp_url || project.cover_media.url}
                    alt={project.cover_media.alt_text || project.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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
                <div className="absolute bottom-3 left-3 z-10 bg-[var(--surface)]/90 border border-[var(--surface-border)] px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-[var(--text)] uppercase backdrop-blur-md flex items-center gap-2 shadow-sm">
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
            <span className="pointer-events-none absolute top-2.5 left-2.5 font-mono text-xs font-bold text-[#F15A24] z-20 select-none">
                +
            </span>
            <span className="pointer-events-none absolute top-2.5 right-2.5 font-mono text-xs font-bold text-[#F15A24] z-20 select-none">
                +
            </span>
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 font-mono text-xs font-bold text-[#F15A24] z-20 select-none">
                +
            </span>
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 font-mono text-xs font-bold text-[#F15A24] z-20 select-none">
                +
            </span>

            {/* Architectural Layout Variations by project style */}
            {style === 'station' && (
                /* Station: Deep forest green (#173C32) + Sand split canvas with geometric monogram and architectural grid */
                <div className="relative h-full w-full bg-[#173C32] text-[#F2EFE6] flex flex-col justify-between p-6 sm:p-8">
                    {/* Architectural grid lines */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-15"
                        style={{
                            backgroundImage: `linear-gradient(to right, #F2EFE6 1px, transparent 1px),
                                              linear-gradient(to bottom, #F2EFE6 1px, transparent 1px)`,
                            backgroundSize: '32px 32px',
                        }}
                    />

                    {/* Bold rectangular color block cutting across bottom right */}
                    <div className="absolute right-0 bottom-0 w-2/5 h-1/2 bg-[#DED8CB] border-t-2 border-l-2 border-[#171914] text-[#171914] p-3 flex flex-col justify-end font-mono text-[9px] font-bold tracking-widest uppercase">
                        <span>MODULE // {project.year || '2025'}</span>
                        <span className="text-[#F15A24]">ARCH. SYSTEM</span>
                    </div>

                    {/* Top Architectural Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#F2EFE6]/70 border-b border-[#F2EFE6]/20 pb-2">
                        <span>SYS: {project.business_type || 'ENTERPRISE PLATFORM'}</span>
                        <span className="text-[#D5F34A] font-bold">[ONLINE]</span>
                    </div>

                    {/* Oversized Cropped Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className="font-display font-black leading-[0.8] tracking-tighter text-[clamp(4.5rem,10vw,8rem)] text-[#F2EFE6] transition-transform duration-300 group-hover:translate-x-1">
                            {initials}
                            <span className="text-[#F15A24]">.</span>
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-widest text-[#D5F34A] uppercase">
                            // {project.title}
                        </div>
                    </div>

                    {/* Bottom Status Marker */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#F2EFE6]/60">
                        <span>EST. {project.year || '2025'}</span>
                        <span>PRODUCTION SPEC</span>
                    </div>
                </div>
            )}

            {style === 'rocky' && (
                /* Rocky: Stark ink black (#171914) with warm paper geometric cutout and signal-orange bar */
                <div className="relative h-full w-full bg-[#171914] text-[#F2EFE6] flex flex-col justify-between p-6 sm:p-8">
                    {/* Diagonal Architectural Split */}
                    <div
                        className="pointer-events-none absolute top-0 right-0 w-2/3 h-full bg-[#173C32]/40"
                        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    />

                    {/* Signal Orange Vertical Calibration Bar */}
                    <div className="absolute top-0 left-6 w-1 h-full bg-[#F15A24]" />

                    {/* Top Metadata */}
                    <div className="relative z-10 pl-6 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#F2EFE6]/70">
                        <span>INDEX // {project.slug.toUpperCase()}</span>
                        <span className="bg-[#F15A24] text-white px-1.5 py-0.5 font-bold">SPEC 01</span>
                    </div>

                    {/* Oversized Monogram */}
                    <div className="relative z-10 pl-6 my-auto">
                        <div className="font-display font-black leading-[0.8] tracking-tighter text-[clamp(4.5rem,10vw,8rem)] text-[#F2EFE6] transition-transform duration-300 group-hover:translate-x-1">
                            {initials}
                        </div>
                        <div className="mt-2 font-mono text-xs tracking-widest text-[#F15A24] uppercase font-bold">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Hairline */}
                    <div className="relative z-10 pl-6 flex items-center justify-between border-t border-[#F2EFE6]/20 pt-2 font-mono text-[10px] text-[#F2EFE6]/60 uppercase">
                        <span>{project.role || 'LEAD ARCHITECT'}</span>
                        <span>{project.year || '2025'}</span>
                    </div>
                </div>
            )}

            {style === 'amber' && (
                /* Amber: Warm Paper (#F2EFE6) surface with Deep Forest frame, signal-orange stamp, and debossed serif initials */
                <div className="relative h-full w-full bg-[#F2EFE6] text-[#171914] flex flex-col justify-between p-6 sm:p-8 border-4 border-[#173C32]">
                    {/* Top Archival Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#171914]/70 border-b border-[#171914]/20 pb-2">
                        <span>EDITION // ARCHIVAL</span>
                        <span className="font-bold text-[#F15A24]">{project.year || '2024'}</span>
                    </div>

                    {/* Geometric Architectural Monogram with Orange Accent Plate */}
                    <div className="relative z-10 my-auto">
                        <div className="inline-block relative">
                            <span className="absolute -inset-2 bg-[#F15A24]/15 transform -rotate-1 pointer-events-none" />
                            <div className="relative font-display font-black leading-[0.85] tracking-tighter text-[clamp(4.5rem,10vw,8rem)] text-[#171914] transition-transform duration-300 group-hover:translate-x-1">
                                {initials}
                                <span className="text-[#F15A24]">.</span>
                            </div>
                        </div>
                        <div className="mt-3 font-mono text-xs font-bold tracking-widest text-[#173C32] uppercase">
                            // {project.title}
                        </div>
                    </div>

                    {/* Barcode-inspired Rhythm Graphic at Bottom */}
                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#171914]/20 font-mono text-[10px] text-[#171914]/70 uppercase">
                        <div className="flex items-center gap-1">
                            <span className="h-3 w-1 bg-[#171914]" />
                            <span className="h-3 w-0.5 bg-[#171914]" />
                            <span className="h-3 w-1.5 bg-[#171914]" />
                            <span className="h-3 w-0.5 bg-[#171914]" />
                            <span className="h-3 w-2 bg-[#F15A24]" />
                        </div>
                        <span className="font-bold">{project.business_type || 'COMMERCE'}</span>
                    </div>
                </div>
            )}

            {style === 'ringed' && (
                /* Ringed: Pale Sand (#DED8CB) with Stark Ink Black blocks and vertical Swiss typographic column */
                <div className="relative h-full w-full bg-[#DED8CB] text-[#171914] flex flex-col justify-between p-6 sm:p-8">
                    {/* Left stark ink vertical bar */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[#171914] text-[#F2EFE6] p-4 flex flex-col justify-between font-mono text-[9px] uppercase tracking-widest">
                        <span className="text-[#D5F34A] font-bold">SWISS / 01</span>
                        <span className="rotate-90 origin-bottom-left whitespace-nowrap text-[#DED8CB]/60">
                            STRUCTURAL ARCHITECTURE
                        </span>
                        <span>{project.year || '2024'}</span>
                    </div>

                    {/* Top Reference */}
                    <div className="relative z-10 w-3/5 font-mono text-[10px] tracking-widest uppercase text-[#171914]/70 border-b border-[#171914]/20 pb-2">
                        <span>REF // {project.slug}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 w-3/5 my-auto">
                        <div className="font-display font-black leading-[0.8] tracking-tighter text-[clamp(4.5rem,10vw,8rem)] text-[#171914] transition-transform duration-300 group-hover:translate-x-1">
                            {initials}
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-widest text-[#F15A24] uppercase">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="relative z-10 w-3/5 font-mono text-[10px] text-[#171914]/70 uppercase">
                        <span>{project.business_type || 'ENTERPRISE'}</span>
                    </div>
                </div>
            )}

            {style === 'ocean' && (
                /* Ocean: Deep Marine Forest (#173C32) + Acid Lime (#D5F34A) with maritime datum lines and shipping coordinates */
                <div className="relative h-full w-full bg-[#173C32] text-[#F2EFE6] flex flex-col justify-between p-6 sm:p-8">
                    {/* Architectural horizontal datum lines */}
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-[#D5F34A]/30" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-[#D5F34A]/30" />

                    {/* Top Maritime Datum Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#D5F34A]">
                        <span>FLEET DISPATCH // LOGISTICS</span>
                        <span className="bg-[#D5F34A] text-[#171914] px-1.5 py-0.5 font-bold">PORT 01</span>
                    </div>

                    {/* Oversized Monogram with Marine Precision */}
                    <div className="relative z-10 my-auto">
                        <div className="font-display font-black leading-[0.8] tracking-tighter text-[clamp(4.5rem,10vw,8rem)] text-[#F2EFE6] transition-transform duration-300 group-hover:translate-x-1">
                            {initials}
                            <span className="text-[#D5F34A]">.</span>
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-widest text-[#D5F34A] uppercase">
                            // {project.title}
                        </div>
                    </div>

                    {/* Bottom Status */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[#F2EFE6]/70 uppercase border-t border-[#F2EFE6]/20 pt-2">
                        <span>COORDINATES: LAT 23°N</span>
                        <span className="text-[#F15A24] font-bold">ACTIVE ROUTE</span>
                    </div>
                </div>
            )}

            {style === 'desert' && (
                /* Desert: Signal Orange (#F15A24) stepped architectural frame on Ink Black (#171914) */
                <div className="relative h-full w-full bg-[#171914] text-[#F2EFE6] flex flex-col justify-between p-6 sm:p-8">
                    {/* Stepped Signal Orange Block on Top Right */}
                    <div className="absolute top-0 right-0 w-32 h-16 bg-[#F15A24] text-[#171914] p-2 flex items-center justify-center font-mono text-[10px] font-bold tracking-widest uppercase shadow-sm">
                        <span>DISPATCH // ESP</span>
                    </div>

                    {/* Top Reference */}
                    <div className="relative z-10 font-mono text-[10px] tracking-widest uppercase text-[#F2EFE6]/70 border-b border-[#F2EFE6]/20 pb-2 w-2/3">
                        <span>EXPEDITION // {project.slug.toUpperCase()}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className="font-display font-black leading-[0.8] tracking-tighter text-[clamp(4.5rem,10vw,8rem)] text-[#F2EFE6] transition-transform duration-300 group-hover:translate-x-1">
                            {initials}
                            <span className="text-[#F15A24]">.</span>
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-widest text-[#F15A24] uppercase">
                            // {project.title}
                        </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[#F2EFE6]/60 uppercase border-t border-[#F2EFE6]/20 pt-2">
                        <span>{project.business_type || 'COMMERCE'}</span>
                        <span className="text-[#F15A24] font-bold">{project.year || '2024'}</span>
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
                    <div className="relative h-full w-full bg-[#171914] text-[#F2EFE6] flex flex-col justify-between p-6 sm:p-8">
                        {/* Accent Color Field in Background */}
                        <div
                            className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-25"
                            style={{ backgroundColor: accent }}
                        />

                        {/* Top Header */}
                        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#F2EFE6]/70 border-b border-[#F2EFE6]/20 pb-2">
                            <span>CASE STUDY // {project.slug}</span>
                            <span className="font-bold text-[#F15A24]">{project.year || '2025'}</span>
                        </div>

                        {/* Monogram */}
                        <div className="relative z-10 my-auto">
                            <div className="font-display font-black leading-[0.8] tracking-tighter text-[clamp(4.5rem,10vw,8rem)] text-[#F2EFE6] transition-transform duration-300 group-hover:translate-x-1">
                                {initials}
                                <span style={{ color: accent }}>.</span>
                            </div>
                            <div className="mt-2 font-mono text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>
                                {project.title}
                            </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[#F2EFE6]/60 uppercase border-t border-[#F2EFE6]/20 pt-2">
                            <span>{project.business_type || 'DIGITAL SYSTEM'}</span>
                            <span>{project.role || 'FULL-STACK'}</span>
                        </div>
                    </div>
                )}

            {/* Subtle Hover Accent Bar along the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--primary)] transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 z-30" />
        </div>
    );
}
