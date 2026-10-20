import React, { useEffect, useRef, useState } from 'react';

interface TypographicMachineProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

export default function TypographicMachine({
    isDark = false,
    isReducedMotion = false,
}: TypographicMachineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [machineCycle, setMachineCycle] = useState(0);

    // Mechanical stepping states
    const modes = [
        { code: 'MODE_01', label: 'SYSTEMS_DESIGN', tag: 'LARAVEL.12' },
        { code: 'MODE_02', label: 'CLIENT_KINETICS', tag: 'REACT.19' },
        { code: 'MODE_03', label: 'TYPE_COMPOSITION', tag: 'TYPESCRIPT' },
        { code: 'MODE_04', label: 'HIGH_THROUGHPUT', tag: 'MYSQL.STORES' },
    ];

    // Pointer-responsive parallax
    useEffect(() => {
        if (isReducedMotion) return;

        // Check if device supports fine pointer
        if (
            typeof window !== 'undefined' &&
            window.matchMedia('(pointer: coarse)').matches
        ) {
            return;
        }

        let frameId: number;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            targetX = Math.max(-1, Math.min(1, relX)) * 14;
            targetY = Math.max(-1, Math.min(1, relY)) * 14;
        };

        const loop = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            setMouseOffset({ x: currentX, y: currentY });
            frameId = requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        loop();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, [isReducedMotion]);

    // Mechanical cycle timer: stepping movement every 3.5s
    useEffect(() => {
        if (isReducedMotion) return;
        const interval = setInterval(() => {
            setMachineCycle((prev) => (prev + 1) % modes.length);
        }, 3600);
        return () => clearInterval(interval);
    }, [isReducedMotion, modes.length]);

    const activeMode = modes[machineCycle];

    return (
        <div
            ref={containerRef}
            aria-label="Monayem OS Signature Typographic Machine"
            className="group relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px] xl:max-w-[580px] aspect-[4/5] select-none border-2 border-foreground bg-surface shadow-md overflow-hidden transition-all duration-300"
            style={{
                transform: isReducedMotion
                    ? 'none'
                    : `perspective(1000px) rotateY(${mouseOffset.x * 0.4}deg) rotateX(${-mouseOffset.y * 0.4}deg)`,
            }}
        >
            {/* Corner Caliper Precision Registration Crosses */}
            <span className="absolute top-2.5 left-2.5 font-mono text-xs font-bold text-[var(--primary)] z-30 pointer-events-none">
                + [MA.01]
            </span>
            <span className="absolute top-2.5 right-2.5 font-mono text-xs font-bold text-[var(--primary)] z-30 pointer-events-none">
                [MACH.SYS] +
            </span>
            <span className="absolute bottom-2.5 left-2.5 font-mono text-xs font-bold text-[var(--primary)] z-30 pointer-events-none">
                + [23.8°N]
            </span>
            <span className="absolute bottom-2.5 right-2.5 font-mono text-xs font-bold text-[var(--primary)] z-30 pointer-events-none">
                [90.4°E] +
            </span>

            {/* Top Instrument Control Bar */}
            <div className="relative z-20 flex items-center justify-between border-b-2 border-foreground bg-background px-4 py-2 font-mono text-[10px] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                    <span className="os-beacon" />
                    <span className="font-bold text-foreground">TYPOGRAPHIC ENGINE</span>
                    <span className="text-border">/</span>
                    <span className="text-[var(--primary)] font-bold">{activeMode.code}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground">
                    <span className="stamp-orange text-[9px] px-1.5 py-0.5">
                        {activeMode.tag}
                    </span>
                </div>
            </div>

            {/* Inner Architectural Work Canvas */}
            <div className="relative h-[calc(100%-80px)] w-full overflow-hidden p-6 flex flex-col justify-between">
                {/* Background Coordinate Grid */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-15 dark:opacity-25"
                    style={{
                        backgroundImage: `linear-gradient(to right, var(--text) 1px, transparent 1px),
                                          linear-gradient(to bottom, var(--text) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Layer 1: Top Sliding Ticker Band (Moving Right to Left) */}
                <div className="relative z-10 overflow-hidden border-y border-border py-1.5 bg-background/50 backdrop-blur-xs font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    <div className="animate-ticker-h gap-8">
                        <span>MONAYEM AZAM</span>
                        <span className="text-[var(--primary)] font-bold">///</span>
                        <span>CREATIVE OPERATING SYSTEM</span>
                        <span className="text-[var(--primary)] font-bold">///</span>
                        <span>BESPOKE DIGITAL WORLDS</span>
                        <span className="text-[var(--primary)] font-bold">///</span>
                        <span>HIGH PERFORMANCE LARAVEL & REACT</span>
                        <span className="text-[var(--primary)] font-bold">///</span>
                        <span>MONAYEM AZAM</span>
                        <span className="text-[var(--primary)] font-bold">///</span>
                        <span>CREATIVE OPERATING SYSTEM</span>
                        <span className="text-[var(--primary)] font-bold">///</span>
                        <span>BESPOKE DIGITAL WORLDS</span>
                    </div>
                </div>

                {/* Layer 2: Core Monumental Letterform Structure (M and A) */}
                <div className="relative my-auto flex items-center justify-center py-2">
                    {/* Shadow Offset Mask Plate */}
                    <div
                        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-20 dark:opacity-30 translate-x-3 translate-y-3"
                        style={{
                            transform: isReducedMotion
                                ? 'translate(8px, 8px)'
                                : `translate(${8 + mouseOffset.x * 0.6}px, ${8 + mouseOffset.y * 0.6}px)`,
                        }}
                    >
                        <span className="font-display text-[140px] sm:text-[180px] lg:text-[210px] font-black tracking-tighter text-[var(--forest)] leading-none">
                            MA.
                        </span>
                    </div>

                    {/* Main Monogram Frame with Stencil Cuts & Accent Highlights */}
                    <div
                        className="relative z-10 flex items-baseline justify-center select-none"
                        style={{
                            transform: isReducedMotion
                                ? 'none'
                                : `translate(${-mouseOffset.x * 0.5}px, ${-mouseOffset.y * 0.5}px)`,
                        }}
                    >
                        <div className="relative">
                            <span className="font-display text-[130px] sm:text-[170px] lg:text-[200px] font-black tracking-tighter text-foreground leading-none">
                                MA
                            </span>
                            {/* Signal Orange Precision Period */}
                            <span className="inline-block h-6 w-6 sm:h-8 sm:w-8 bg-[var(--primary)] ml-1 border-2 border-foreground align-baseline" />

                            {/* Geometric Cutout Ruler Lines Across the Letterforms */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--bg)] border-y border-border" />
                            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-[var(--primary)]/60" />

                            {/* Floating Mechanical Dial Overlay */}
                            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 border border-foreground bg-[var(--accent)] text-[#171914] px-2 py-0.5 font-mono text-[9px] font-black tracking-wider uppercase shadow-xs">
                                CALIBRATED
                            </div>
                        </div>
                    </div>
                </div>

                {/* Layer 3: Dynamic Stepping Mode Readout */}
                <div className="relative z-10 border border-foreground bg-background p-3.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="font-mono text-[10px] font-bold uppercase text-[var(--primary)]">
                            CURRENT SEQUENCE
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                            [0{machineCycle + 1} / 04]
                        </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="font-display text-sm sm:text-base font-black uppercase tracking-tight text-foreground">
                            {activeMode.label.replace('_', ' ')}
                        </span>
                        <span className="stamp-lime text-[9px] px-1.5 py-0.5 font-mono font-bold">
                            ONLINE
                        </span>
                    </div>
                </div>

                {/* Layer 4: Bottom Sliding Reverse Ticker Band */}
                <div className="relative z-10 overflow-hidden border-y border-border py-1.5 bg-background/50 backdrop-blur-xs font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                    <div className="animate-ticker-h-reverse gap-8">
                        <span>ARCHITECTURAL RIGOR</span>
                        <span className="text-[var(--accent)] font-bold">+++</span>
                        <span>END-TO-END TYPE SAFETY</span>
                        <span className="text-[var(--accent)] font-bold">+++</span>
                        <span>INTERACTIVE INSTALLATION</span>
                        <span className="text-[var(--accent)] font-bold">+++</span>
                        <span>SUB-MILLISECOND RESPONSE</span>
                        <span className="text-[var(--accent)] font-bold">+++</span>
                        <span>ARCHITECTURAL RIGOR</span>
                        <span className="text-[var(--accent)] font-bold">+++</span>
                        <span>END-TO-END TYPE SAFETY</span>
                    </div>
                </div>
            </div>

            {/* Bottom Calibration Footnotes */}
            <div className="relative z-20 flex items-center justify-between border-t-2 border-foreground bg-background px-4 py-2 font-mono text-[10px] uppercase text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[var(--primary)] inline-block" />
                    <span>SPEC: EDITORIAL KINETIC SYSTEM</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-foreground">
                    <span>STATUS: 100% OPERATIONAL</span>
                </div>
            </div>
        </div>
    );
}
