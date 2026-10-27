import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface FloatingObservationWindowProps {
    isOff?: boolean;
    isDark?: boolean;
    className?: string;
}

export default function FloatingObservationWindow({
    isOff = false,
    isDark = true,
    className = '',
}: FloatingObservationWindowProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Mouse coordinates mapped to springs for silky fluid tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 24, stiffness: 130, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-9, 9]);
    const glareX = useTransform(springX, [-0.5, 0.5], [15, 85]);
    const glareY = useTransform(springY, [-0.5, 0.5], [15, 85]);

    useEffect(() => {
        if (isOff) return;

        const handleMouseMove = (e: MouseEvent) => {
            const card = cardRef.current;
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = Math.max(
                -0.5,
                Math.min(0.5, (e.clientX - centerX) / window.innerWidth),
            );
            const dy = Math.max(
                -0.5,
                Math.min(0.5, (e.clientY - centerY) / window.innerHeight),
            );

            mouseX.set(dx);
            mouseY.set(dy);
        };

        const handleMouseLeave = () => {
            mouseX.set(0);
            mouseY.set(0);
        };

        window.addEventListener('mousemove', handleMouseMove, {
            passive: true,
        });
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isOff, mouseX, mouseY]);

    return (
        <div
            ref={cardRef}
            className={`perspective-1000 relative flex items-center justify-center select-none ${className}`}
        >
            {/* Ambient Volumetric Backlight Halo mirroring Celestial Horizon */}
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-8 rounded-3xl bg-[var(--forest)] ${
                    isDark ? 'opacity-25' : 'opacity-8'
                } blur-[70px] transition-opacity duration-1000`}
            />
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-4 -right-4 h-56 w-56 rounded-full bg-[var(--primary)] ${
                    isDark ? 'opacity-20' : 'opacity-8'
                } blur-[60px] transition-opacity duration-1000`}
            />

            {/* Floating Glass Viewport Frame with Chamfered Silhouette */}
            <motion.div
                style={
                    isOff
                        ? undefined
                        : {
                              rotateX,
                              rotateY,
                              transformStyle: 'preserve-3d',
                          }
                }
                animate={
                    isOff
                        ? undefined
                        : {
                              y: [0, -8, 0],
                          }
                }
                transition={
                    isOff
                        ? undefined
                        : {
                              y: {
                                  duration: 6.5,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                              },
                          }
                }
                className="group relative w-full max-w-[470px] overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/15 p-6 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[var(--primary)]/60 sm:p-7"
            >
                {/* 1. Grazing Light Rim Reflection along the top-right edge */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--primary)]/70 to-[var(--accent)]/50"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-[1.5px] bg-gradient-to-b from-[var(--primary)]/60 via-transparent to-transparent"
                />

                {/* 2. Physical Glass Surface Caustic Glare Sheen */}
                <motion.div
                    aria-hidden="true"
                    style={{
                        background: isOff
                            ? 'radial-gradient(circle at 65% 25%, rgba(255,255,255,0.08) 0%, transparent 60%)'
                            : useTransform(
                                  [glareX, glareY],
                                  ([gx, gy]) =>
                                      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,${
                                          isDark ? 0.1 : 0.22
                                      }) 0%, transparent 65%)`,
                              ),
                    }}
                    className="pointer-events-none absolute inset-0"
                />

                {/* 3. Precision Architectural Corner Datum Brackets */}
                <span className="absolute top-2 left-2 h-2.5 w-2.5 border-t border-l border-[var(--surface-border)]" />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 border-t border-r border-[var(--primary)]" />
                <span className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l border-[var(--surface-border)]" />
                <span className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r border-[var(--primary)]" />

                {/* 4. Top Telemetry Strip */}
                <div className="relative z-10 flex items-center justify-between border-b border-[var(--surface-border)]/60 pb-3 font-mono text-[10px] tracking-wider uppercase">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                        <span className="font-bold text-[var(--text)]">
                            VIEWPORT // 01
                        </span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span className="text-[var(--text-muted)]">
                            CHITTAGONG 22.35° N
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[var(--accent)]">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        </span>
                        <span className="font-semibold">ACTIVE OPTICS</span>
                    </div>
                </div>

                {/* 5. Center Astrometric Observation Reticle & Optical Horizon Aperture */}
                <div className="relative my-6 flex flex-col items-center justify-center sm:my-8">
                    {/* Outer Etched Calibration Ring */}
                    <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--bg)]/15 sm:h-44 sm:w-44">
                        {/* Inner Dashed Orbital Guideline */}
                        <div className="absolute inset-2.5 rounded-full border border-dashed border-[var(--primary)]/30" />

                        {/* Four Compass Datum Crosshair Ticks */}
                        <span className="absolute -top-2.5 h-4 w-[1px] bg-[var(--primary)]" />
                        <span className="absolute -bottom-2.5 h-4 w-[1px] bg-[var(--primary)]" />
                        <span className="absolute -left-2.5 h-[1px] w-4 bg-[var(--primary)]" />
                        <span className="absolute -right-2.5 h-[1px] w-4 bg-[var(--primary)]" />

                        {/* Central Luminous Beacon Core */}
                        <div className="relative z-10 flex flex-col items-center text-center font-mono">
                            <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_14px_var(--primary)]" />
                            <span className="mt-2.5 font-display text-lg font-black tracking-widest text-[var(--text)] uppercase sm:text-xl">
                                MZ · 2026
                            </span>
                            <span className="text-[9px] font-semibold tracking-widest text-[var(--text-muted)]">
                                EVENT HORIZON
                            </span>
                        </div>
                    </div>
                </div>

                {/* 6. Bottom System Status & Core Engineering Indicators */}
                <div className="relative z-10 flex items-center justify-between border-t border-[var(--surface-border)]/60 pt-3 font-mono text-[10px] text-[var(--text-muted)] uppercase">
                    <div className="flex items-center gap-2">
                        <span className="text-[var(--text)] font-semibold">
                            ENGINE:
                        </span>
                        <span>LARAVEL &amp; REACT</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                        <span className="text-[var(--text)] font-semibold">
                            LIVE HORIZON
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
