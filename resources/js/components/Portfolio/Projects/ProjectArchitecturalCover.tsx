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
            </div>
        );
    }

    // Deterministic poster fallback when media is null
    return (
        <div
            className={`relative w-full h-full select-none overflow-hidden transition-all duration-300 ${className}`}
        >
            {/* Clean Layout Variations by project style */}
            {style === 'station' && (
                <div className={`relative h-full w-full bg-[var(--forest)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Subtle grid pattern */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(to right, var(--paper) 1px, transparent 1px),
                                              linear-gradient(to bottom, var(--paper) 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                        }}
                    />

                    {/* Top Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--paper)]/70 border-b border-[var(--paper)]/15 pb-2">
                        <span className="truncate max-w-[70%]">{project.business_type || 'Web Application'}</span>
                        <span className="text-[var(--accent)] font-semibold">{project.year || '2024'}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                            <span className="text-[var(--primary)]">.</span>
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-wider text-[var(--accent)] uppercase truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--paper)]/60 pt-2 border-t border-[var(--paper)]/15">
                        <span>{project.role || 'Full-Stack'}</span>
                        <span>{project.year || '2024'}</span>
                    </div>
                </div>
            )}

            {style === 'rocky' && (
                <div className={`relative h-full w-full bg-[var(--ink)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Diagonal Accent Split */}
                    <div
                        className="pointer-events-none absolute top-0 right-0 w-2/3 h-full bg-[var(--forest)]/40"
                        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    />

                    {/* Top Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--paper)]/70 border-b border-[var(--paper)]/15 pb-2">
                        <span className="truncate max-w-[70%]">{project.business_type || 'Web Application'}</span>
                        <span className="text-[var(--primary)] font-semibold">{project.year || '2024'}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                        </div>
                        <div className="mt-2 font-mono text-xs tracking-wider text-[var(--primary)] uppercase font-bold truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 flex items-center justify-between border-t border-[var(--paper)]/15 pt-2 font-mono text-[10px] text-[var(--paper)]/60 uppercase">
                        <span className="truncate max-w-[60%]">{project.role || 'Full-Stack Developer'}</span>
                        <span>{project.year || '2024'}</span>
                    </div>
                </div>
            )}

            {style === 'amber' && (
                <div className={`relative h-full w-full bg-[var(--paper)] text-[var(--ink)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Top Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--ink)]/70 border-b border-[var(--ink)]/15 pb-2">
                        <span className="truncate max-w-[70%]">{project.business_type || 'E-Commerce'}</span>
                        <span className="font-bold text-[var(--primary)]">{project.year || '2024'}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.85] tracking-tighter ${monogramClass} text-[var(--ink)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                            <span className="text-[var(--primary)]">.</span>
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-wider text-[var(--forest)] uppercase truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[var(--ink)]/15 font-mono text-[10px] text-[var(--ink)]/70 uppercase">
                        <span>{project.role || 'Full-Stack'}</span>
                        <span className="font-bold">{project.year || '2024'}</span>
                    </div>
                </div>
            )}

            {style === 'ringed' && (
                <div className={`relative h-full w-full bg-[var(--sand)] text-[var(--ink)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Top Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--ink)]/70 border-b border-[var(--ink)]/15 pb-2">
                        <span className="truncate max-w-[70%]">{project.business_type || 'Corporate Website'}</span>
                        <span className="font-bold text-[var(--ink)]">{project.year || '2024'}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--ink)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-wider text-[var(--primary)] uppercase truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[var(--ink)]/70 uppercase pt-2 border-t border-[var(--ink)]/15">
                        <span>{project.role || 'Lead Developer'}</span>
                        <span>{project.year || '2024'}</span>
                    </div>
                </div>
            )}

            {style === 'ocean' && (
                <div className={`relative h-full w-full bg-[var(--forest)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Top Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--accent)] border-b border-[var(--paper)]/15 pb-2">
                        <span className="truncate max-w-[70%]">{project.business_type || 'Logistics & Supply'}</span>
                        <span className="text-[var(--paper)] font-bold">{project.year || '2024'}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                            <span className="text-[var(--accent)]">.</span>
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-wider text-[var(--accent)] uppercase truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[var(--paper)]/70 uppercase border-t border-[var(--paper)]/15 pt-2">
                        <span>{project.role || 'Full-Stack Developer'}</span>
                        <span className="text-[var(--primary)] font-bold">{project.year || '2024'}</span>
                    </div>
                </div>
            )}

            {style === 'desert' && (
                <div className={`relative h-full w-full bg-[var(--ink)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                    {/* Top Header */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--paper)]/70 border-b border-[var(--paper)]/15 pb-2">
                        <span className="truncate max-w-[70%]">{project.business_type || 'Web Application'}</span>
                        <span className="text-[var(--primary)] font-bold">{project.year || '2024'}</span>
                    </div>

                    {/* Monogram */}
                    <div className="relative z-10 my-auto">
                        <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                            {initials}
                            <span className="text-[var(--primary)]">.</span>
                        </div>
                        <div className="mt-2 font-mono text-xs font-bold tracking-wider text-[var(--primary)] uppercase truncate">
                            {project.title}
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[var(--paper)]/60 uppercase border-t border-[var(--paper)]/15 pt-2">
                        <span className="truncate max-w-[60%]">{project.role || 'Full-Stack Developer'}</span>
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
                    <div className={`relative h-full w-full bg-[var(--ink)] text-[var(--paper)] flex flex-col justify-between ${paddingClass}`}>
                        {/* Accent Field */}
                        <div
                            className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-25"
                            style={{ backgroundColor: accent }}
                        />

                        {/* Top Header */}
                        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[var(--paper)]/70 border-b border-[var(--paper)]/15 pb-2">
                            <span className="truncate max-w-[70%]">{project.business_type || 'Digital System'}</span>
                            <span className="font-bold text-[var(--primary)]">{project.year || '2024'}</span>
                        </div>

                        {/* Monogram */}
                        <div className="relative z-10 my-auto">
                            <div className={`font-display font-black leading-[0.8] tracking-tighter ${monogramClass} text-[var(--paper)] transition-transform duration-300 group-hover:translate-x-1`}>
                                {initials}
                                <span style={{ color: accent }}>.</span>
                            </div>
                            <div className="mt-2 font-mono text-xs font-bold tracking-wider uppercase truncate" style={{ color: accent }}>
                                {project.title}
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-[var(--paper)]/60 uppercase border-t border-[var(--paper)]/15 pt-2">
                            <span className="truncate max-w-[60%]">{project.role || 'Full-Stack'}</span>
                            <span>{project.year || '2024'}</span>
                        </div>
                    </div>
                )}

            {/* Subtle Hover Accent Bar along the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--primary)] transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 z-30" />
        </div>
    );
}
