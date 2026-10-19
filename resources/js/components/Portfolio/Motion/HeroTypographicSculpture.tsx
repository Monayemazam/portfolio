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

        // Disable mouse tracking on touch devices
        if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        let frameId: number;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            targetX = (e.clientX / innerWidth - 0.5) * 20;
            targetY = (e.clientY / innerHeight - 0.5) * 20;
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
            className="group relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] aspect-[4/5] select-none border-2 border-foreground bg-surface shadow-xs overflow-hidden"
        >
            {/* Architectural Registration Marks (Corner Hairlines) */}
            <span className="absolute top-2 left-2 font-mono text-xs font-bold text-[var(--primary)] z-30 select-none">
                +
            </span>
            <span className="absolute top-2 right-2 font-mono text-xs font-bold text-[var(--primary)] z-30 select-none">
                +
            </span>
            <span className="absolute bottom-2 left-2 font-mono text-xs font-bold text-[var(--primary)] z-30 select-none">
                +
            </span>
            <span className="absolute bottom-2 right-2 font-mono text-xs font-bold text-[var(--primary)] z-30 select-none">
                +
            </span>

            {/* Top Registration Calibration Header */}
            <div className="relative z-20 flex items-center justify-between border-b border-border/80 px-4 py-2.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase bg-background/60 backdrop-blur-xs">
                <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 bg-[var(--primary)]" />
                    <span className="text-foreground font-bold">TYPE SCULPTURE // MA.</span>
                </div>
                {/* CMYK / Spot Ink Calibration Chips */}
                <div className="flex items-center gap-1">
                    <span className="h-2 w-3 bg-[#171914] border border-border" title="Ink Black" />
                    <span className="h-2 w-3 bg-[#173C32] border border-border" title="Deep Forest" />
                    <span className="h-2 w-3 bg-[#F15A24] border border-border" title="Signal Orange" />
                    <span className="h-2 w-3 bg-[#D5F34A] border border-border" title="Acid Lime" />
                    <span className="h-2 w-3 bg-[#F2EFE6] border border-border" title="Warm Paper" />
                </div>
            </div>

            {/* Background Rectangular Color Field: Deep Forest Green (#173C32) */}
            <div
                className="absolute -right-8 bottom-0 w-3/4 h-3/5 bg-[var(--bg-forest)] border-t-2 border-l-2 border-foreground transition-transform duration-300"
                style={{
                    transform: isOff
                        ? 'none'
                        : `translate3d(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px, 0)`,
                }}
            />

            {/* Diagonal Architectural Line Cutting Through */}
            <div
                className="absolute top-12 left-0 right-0 h-px bg-border/80"
                style={{ transform: 'rotate(-12deg)' }}
            />

            {/* Secondary Color Field: Signal Orange Graphic Block */}
            <div
                className="absolute top-16 left-6 z-10 w-28 sm:w-36 h-7 sm:h-9 bg-[var(--primary)] text-white font-mono text-[10px] font-bold tracking-widest uppercase flex items-center justify-between px-3 shadow-xs"
                style={{
                    transform: isOff
                        ? 'none'
                        : `translate3d(${mouseOffset.x * -0.2}px, ${mouseOffset.y * -0.2}px, 0)`,
                }}
            >
                <span>SPEC // 01</span>
                <span>[→]</span>
            </div>

            {/* Primary Layered Cropped Typography: "MA." */}
            <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 pb-12 sm:pb-16 overflow-hidden">
                {/* Under-plate (Risograph / Screen-print offset plate in Signal Orange) */}
                <div
                    aria-hidden="true"
                    className="absolute right-0 bottom-4 font-display font-black leading-[0.8] tracking-tighter text-[clamp(11rem,22vw,18rem)] text-[var(--primary)]/40 pointer-events-none transition-transform duration-100 ease-out"
                    style={{
                        transform: isOff
                            ? 'translate(6px, -4px)'
                            : `translate3d(${6 + mouseOffset.x * 0.6}px, ${-4 + mouseOffset.y * 0.6}px, 0)`,
                    }}
                >
                    MA<span className="text-[var(--accent)]">.</span>
                </div>

                {/* Primary Key-plate (Deep Ink / Crisp Foreground Type) */}
                <div
                    className="relative font-display font-black leading-[0.8] tracking-tighter text-[clamp(11rem,22vw,18rem)] text-foreground pointer-events-none transition-transform duration-100 ease-out"
                    style={{
                        transform: isOff
                            ? 'none'
                            : `translate3d(${mouseOffset.x * -0.25}px, ${mouseOffset.y * -0.25}px, 0)`,
                    }}
                >
                    MA<span className="text-[var(--primary)]">.</span>
                </div>
            </div>

            {/* Bottom Technical Seal & Acid-Lime Stamp */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between border-t border-border bg-background/90 px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase">
                {/* Architectural Stamp */}
                <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-black px-2 py-0.5 font-bold shadow-xs">
                    <span>DIGITAL BUILDER / 01</span>
                </span>

                {/* Geo Coordinates */}
                <span className="text-muted-foreground hidden sm:inline">
                    23°48'N · 90°24'E
                </span>
            </div>
        </div>
    );
}
