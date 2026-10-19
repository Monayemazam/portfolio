import React, { useEffect, useRef, useState } from 'react';

interface HeroTypographicSculptureProps {
    isOff?: boolean;
}

export default function HeroTypographicSculpture({
    isOff = false,
}: HeroTypographicSculptureProps) {
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOff) return;

        // Respect reduced motion & pointer coarse devices
        if (
            typeof window !== 'undefined' &&
            (window.matchMedia('(pointer: coarse)').matches ||
                window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        ) {
            return;
        }

        let frameId: number;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            targetX = (e.clientX / innerWidth - 0.5) * 16;
            targetY = (e.clientY / innerHeight - 0.5) * 16;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const loop = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            setMouseOffset({ x: currentX, y: currentY });
            frameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, [isOff]);

    return (
        <div
            ref={containerRef}
            aria-label="Monayem Azam Architectural Typographic Sculpture"
            className="group relative w-full max-w-[360px] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[560px] aspect-[4/5] select-none border-2 border-foreground bg-surface shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
        >
            {/* Outer Architectural Registration Hairline Marks (+) */}
            <span className="absolute top-2.5 left-2.5 font-mono text-sm font-bold text-[var(--primary)] z-30 select-none pointer-events-none">
                +
            </span>
            <span className="absolute top-2.5 right-2.5 font-mono text-sm font-bold text-[var(--primary)] z-30 select-none pointer-events-none">
                +
            </span>
            <span className="absolute bottom-2.5 left-2.5 font-mono text-sm font-bold text-[var(--primary)] z-30 select-none pointer-events-none">
                +
            </span>
            <span className="absolute bottom-2.5 right-2.5 font-mono text-sm font-bold text-[var(--primary)] z-30 select-none pointer-events-none">
                +
            </span>

            {/* Top Registration Calibration Header */}
            <div className="relative z-20 flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase bg-background/80 backdrop-blur-xs">
                <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 bg-[var(--primary)]" />
                    <span className="text-foreground font-bold tracking-wider">
                        POSTER // MA.01
                    </span>
                    <span className="text-border">/</span>
                    <span className="hidden sm:inline text-muted-foreground">
                        EDITION 2026
                    </span>
                </div>

                {/* Spot Ink Calibration Chips */}
                <div className="flex items-center gap-1.5" title="Physical Spot Ink Registration">
                    <span className="h-2 w-3 bg-[#171914] border border-border" title="Ink Black" />
                    <span className="h-2 w-3 bg-[#173C32] border border-border" title="Deep Forest" />
                    <span className="h-2 w-3 bg-[#F15A24] border border-border" title="Signal Orange" />
                    <span className="h-2 w-3 bg-[#D5F34A] border border-border" title="Acid Lime" />
                    <span className="h-2 w-3 bg-[#F2EFE6] border border-border" title="Warm Paper" />
                </div>
            </div>

            {/* Architectural Background Grid Texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Background Rectangular Color Field: Deep Forest Green (#173C32) */}
            <div
                className="absolute right-0 bottom-0 w-3/4 h-3/5 bg-[var(--forest)] border-t-2 border-l-2 border-foreground transition-transform duration-300"
                style={{
                    transform: isOff
                        ? 'none'
                        : `translate3d(${mouseOffset.x * 0.25}px, ${mouseOffset.y * 0.25}px, 0)`,
                }}
            >
                {/* Internal Tone-on-Tone Grid in Forest Panel */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            {/* Diagonal Architectural Line Cutting Through Field */}
            <div
                className="absolute top-14 -left-10 -right-10 h-px bg-border/80 pointer-events-none"
                style={{ transform: 'rotate(-10deg)' }}
            />

            {/* Signal Orange Accent Panel: SPEC // 01 */}
            <div
                className="absolute top-16 left-6 z-10 w-32 sm:w-40 h-8 sm:h-9 bg-[var(--primary)] text-white font-mono text-[10px] font-bold tracking-widest uppercase flex items-center justify-between px-3.5 shadow-sm border border-foreground/30"
                style={{
                    transform: isOff
                        ? 'none'
                        : `translate3d(${mouseOffset.x * -0.2}px, ${mouseOffset.y * -0.2}px, 0)`,
                }}
            >
                <span>SPEC // 01</span>
                <span className="font-sans text-xs">→</span>
            </div>

            {/* Acid Lime Architectural Tag */}
            <div
                className="absolute top-28 left-6 z-10 px-2 py-0.5 bg-[var(--accent)] text-black font-mono text-[9px] font-black tracking-widest uppercase border border-foreground/20"
                style={{
                    transform: isOff
                        ? 'none'
                        : `translate3d(${mouseOffset.x * -0.15}px, ${mouseOffset.y * -0.15}px, 0)`,
                }}
            >
                ARCHITECTURAL CORE
            </div>

            {/* Primary Layered Cropped Typography: "MA." */}
            <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-7 pb-14 sm:pb-16 overflow-hidden">
                {/* Under-plate (Risograph Screen-print Offset in Signal Orange) */}
                <div
                    aria-hidden="true"
                    className="absolute right-0 bottom-4 font-display font-black leading-[0.78] tracking-tighter text-[clamp(12rem,25vw,19rem)] text-[var(--primary)]/35 pointer-events-none select-none transition-transform duration-100 ease-out"
                    style={{
                        transform: isOff
                            ? 'translate(6px, -4px)'
                            : `translate3d(${6 + mouseOffset.x * 0.5}px, ${-4 + mouseOffset.y * 0.5}px, 0)`,
                    }}
                >
                    MA<span className="text-[var(--accent)]">.</span>
                </div>

                {/* Primary Key-plate (Deep Ink / Foreground Letterform) */}
                <div
                    className="relative font-display font-black leading-[0.78] tracking-tighter text-[clamp(12rem,25vw,19rem)] text-foreground pointer-events-none select-none transition-transform duration-100 ease-out"
                    style={{
                        transform: isOff
                            ? 'none'
                            : `translate3d(${mouseOffset.x * -0.2}px, ${mouseOffset.y * -0.2}px, 0)`,
                    }}
                >
                    MA<span className="text-[var(--primary)]">.</span>
                </div>
            </div>

            {/* Bottom Technical Seal & Calibration Footer */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between border-t border-border bg-background/95 backdrop-blur-xs px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase">
                {/* Architectural Stamp */}
                <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-black px-2 py-0.5 font-bold shadow-xs">
                    <span className="inline-block h-1.5 w-1.5 bg-black" />
                    <span>DIGITAL BUILDER / 01</span>
                </span>

                {/* Geo Coordinates */}
                <span className="text-muted-foreground font-semibold">
                    23°48'N · 90°24'E
                </span>
            </div>
        </div>
    );
}
