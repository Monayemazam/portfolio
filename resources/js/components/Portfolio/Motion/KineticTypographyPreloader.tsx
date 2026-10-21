import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface KineticTypographyPreloaderProps {
    onComplete?: () => void;
    reducedMotion?: boolean;
}

interface CosmicStar {
    x: number;
    y: number;
    size: number;
    baseAlpha: number;
    alpha: number;
    twinkleSpeed: number;
    phase: number;
    vx: number;
    vy: number;
    colorType: 'warmWhite' | 'signalOrange' | 'acidLime';
}

export default function KineticTypographyPreloader({
    onComplete,
    reducedMotion = false,
}: KineticTypographyPreloaderProps) {
    const containerRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const counterRef = useRef<HTMLSpanElement | null>(null);
    const ringRef = useRef<SVGCircleElement | null>(null);
    const statusTextRef = useRef<HTMLParagraphElement | null>(null);

    const [isComplete, setIsComplete] = useState(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const [progressPercent, setProgressPercent] = useState(0);

    // 1. Lock body scroll during preloader, restore on completion
    useEffect(() => {
        if (isComplete) {
            document.body.style.overflow = '';
            return;
        }

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isComplete]);

    // 2. Continuous, lightweight 2D Cosmic Starfield Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Generate 40-50 restrained stars
        const starCount = Math.min(50, Math.max(30, Math.floor((width * height) / 32000)));
        const stars: CosmicStar[] = [];

        for (let i = 0; i < starCount; i++) {
            const rand = Math.random();
            let colorType: CosmicStar['colorType'] = 'warmWhite';
            if (rand > 0.9) {
                colorType = 'acidLime';
            } else if (rand > 0.8) {
                colorType = 'signalOrange';
            }

            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.2 + 0.6,
                baseAlpha: Math.random() * 0.4 + 0.25,
                alpha: 0.4,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2,
                vx: (Math.random() * 0.12 + 0.04) * -1,
                vy: (Math.random() - 0.5) * 0.04,
                colorType,
            });
        }

        let lastTime = performance.now();

        const render = (currentTime: number) => {
            const dt = Math.min(currentTime - lastTime, 48) / 16.666;
            lastTime = currentTime;

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];

                if (!reducedMotion) {
                    s.phase += s.twinkleSpeed * dt;
                    s.alpha = s.baseAlpha + Math.sin(s.phase) * 0.2;
                    s.x += s.vx * dt;
                    s.y += s.vy * dt;

                    if (s.x < 0) s.x = width;
                    if (s.x > width) s.x = 0;
                    if (s.y < 0) s.y = height;
                    if (s.y > height) s.y = 0;
                } else {
                    s.alpha = s.baseAlpha;
                }

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);

                if (s.colorType === 'signalOrange') {
                    ctx.fillStyle = `rgba(241, 90, 36, ${Math.max(0.15, s.alpha * 0.9)})`;
                } else if (s.colorType === 'acidLime') {
                    ctx.fillStyle = `rgba(213, 243, 74, ${Math.max(0.15, s.alpha * 0.8)})`;
                } else {
                    ctx.fillStyle = `rgba(242, 239, 230, ${Math.max(0.12, s.alpha * 0.7)})`;
                }

                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, [reducedMotion]);

    // 3. Coordinated Calibration Master Timeline
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const finishLoader = () => {
                const exitTl = gsap.timeline({
                    onComplete: () => {
                        setIsComplete(true);
                        if (onComplete) onComplete();
                    },
                });

                if (containerRef.current) {
                    exitTl.to(containerRef.current, {
                        opacity: 0,
                        duration: reducedMotion ? 0.2 : 0.45,
                        ease: 'power2.inOut',
                    });
                } else {
                    setIsComplete(true);
                    if (onComplete) onComplete();
                }
            };

            if (reducedMotion) {
                // Accessible immediate fade for reduced motion
                const tl = gsap.timeline({ onComplete: finishLoader });
                timelineRef.current = tl;
                tl.to({}, { duration: 0.35 });
                return;
            }

            // Normal cinematic telemetry sequence (Total ~1.5s)
            const masterTl = gsap.timeline({ onComplete: finishLoader });
            timelineRef.current = masterTl;

            const progressObj = { value: 0 };
            const circumference = 2 * Math.PI * 44; // r = 44 => ~276.46

            if (ringRef.current) {
                gsap.set(ringRef.current, {
                    strokeDasharray: circumference,
                    strokeDashoffset: circumference,
                });
            }

            masterTl
                // Count up telemetry from 0 to 100%
                .to(progressObj, {
                    value: 100,
                    duration: 1.15,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        const val = Math.round(progressObj.value);
                        setProgressPercent(val);
                        if (counterRef.current) {
                            counterRef.current.textContent = `${val}%`;
                        }
                        if (ringRef.current) {
                            const offset = circumference - (val / 100) * circumference;
                            ringRef.current.style.strokeDashoffset = `${offset}`;
                        }
                    },
                })
                // Status confirmation
                .call(() => {
                    if (statusTextRef.current) {
                        statusTextRef.current.textContent = 'SYSTEMS ONLINE · ENTERING WORKSPACE';
                    }
                })
                // Short steady hold for perception
                .to({}, { duration: 0.25 });
        }, containerRef);

        // Failsafe timer (2.8s max) so the preloader can never hang indefinitely
        const failsafe = setTimeout(() => {
            setIsComplete(true);
            if (onComplete) onComplete();
        }, 2800);

        return () => {
            clearTimeout(failsafe);
            ctx.revert();
        };
    }, [reducedMotion, onComplete]);

    // Skip handler (click or Escape key)
    const handleSkip = () => {
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        setIsComplete(true);
        if (onComplete) onComplete();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleSkip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (isComplete) {
        return null;
    }

    return (
        <aside
            ref={containerRef}
            aria-label="Portfolio Systems Initialization"
            aria-live="polite"
            className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none bg-[#171914] text-[#F2EFE6]"
        >
            {/* Ambient Cosmic Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(23,60,50,0.45)_0%,rgba(23,25,20,0.92)_65%,#171914_100%)]"
            />

            {/* Restrained Atmospheric Forest-Green & Orange Volumetric Glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/4 -right-1/6 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle,rgba(23,60,50,0.35)_0%,transparent_70%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1/4 -left-1/8 w-[38vw] h-[38vw] max-w-[450px] max-h-[450px] rounded-full bg-[radial-gradient(circle,rgba(241,90,36,0.1)_0%,transparent_70%)]"
            />

            {/* Persistent Starfield Canvas */}
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-80"
            />

            {/* TOP TELEMETRY BAR */}
            <header className="relative z-10 flex items-center justify-between border-b border-[#F2EFE6]/10 px-6 sm:px-10 lg:px-16 py-4 font-mono text-[11px] sm:text-xs tracking-wider text-[#A7A59D] uppercase">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F15A24] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F15A24] shadow-[0_0_8px_#F15A24]" />
                    </span>
                    <span className="font-bold text-[#F2EFE6] tracking-widest">
                        MONAYEM AZAM
                    </span>
                    <span className="text-[#F2EFE6]/30 hidden sm:inline">/</span>
                    <span className="text-[#A7A59D] hidden sm:inline tracking-widest">
                        FULL-STACK WEB DEVELOPER
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D5F34A] shadow-[0_0_6px_#D5F34A]" />
                    <span className="font-mono text-[10px] sm:text-xs text-[#D5F34A] tracking-widest font-semibold">
                        CALIBRATING WORKSPACE
                    </span>
                </div>
            </header>

            {/* CENTER TELEMETRY & CALIBRATION STAGE */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 text-center">
                <div className="max-w-md mx-auto flex flex-col items-center">
                    
                    {/* Mission Header */}
                    <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[#F15A24] uppercase tracking-widest mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F15A24] shadow-[0_0_8px_#F15A24]" />
                        <span>MISSION CONTROL // DIGITAL ARCHITECTURE</span>
                    </div>

                    {/* Circular Calibration Gauge */}
                    <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 my-2">
                        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                            {/* Track Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="44"
                                fill="none"
                                stroke="rgba(242, 239, 230, 0.08)"
                                strokeWidth="3"
                            />
                            {/* Active Progress Circle */}
                            <circle
                                ref={ringRef}
                                cx="50"
                                cy="50"
                                r="44"
                                fill="none"
                                stroke="#F15A24"
                                strokeWidth="3"
                                strokeLinecap="round"
                                style={{
                                    filter: 'drop-shadow(0 0 6px rgba(241, 90, 36, 0.6))',
                                }}
                            />
                        </svg>

                        {/* Centered Percentage Display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                ref={counterRef}
                                className="font-mono text-2xl sm:text-3xl font-black text-[#F2EFE6] tracking-tighter"
                            >
                                {progressPercent}%
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-widest text-[#A7A59D]">
                                SYNC
                            </span>
                        </div>
                    </div>

                    {/* Fine Signal-Orange Divider */}
                    <div className="h-[1px] w-28 sm:w-36 bg-[#F15A24]/60 mt-6 mb-4 shadow-[0_0_8px_#F15A24]" />

                    {/* Telemetry Status Line */}
                    <div className="flex flex-col items-center gap-1.5">
                        <p
                            ref={statusTextRef}
                            className="font-mono text-xs sm:text-sm text-[#DED8CB] uppercase tracking-[0.2em] font-medium transition-all"
                        >
                            ALIGNING CELESTIAL COORDINATES
                        </p>
                        <span className="font-mono text-[10px] text-[#A7A59D] uppercase tracking-wider">
                            VERIFIED DIGITAL PORTFOLIO · PRODUCTION ARCHIVE
                        </span>
                    </div>

                </div>
            </main>

            {/* BOTTOM ARCHITECTURAL FOOTER & SKIP CONTROL */}
            <footer className="relative z-10 flex items-center justify-between border-t border-[#F2EFE6]/10 px-6 sm:px-10 lg:px-16 py-4 font-mono text-[10px] sm:text-[11px] text-[#A7A59D]">
                <div className="flex items-center gap-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F15A24]" />
                    <span className="tracking-widest uppercase">
                        DHAKA, BANGLADESH · 23.8103° N, 90.4125° E
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleSkip}
                    aria-label="Skip introduction sequence"
                    className="pointer-events-auto flex items-center gap-2 tracking-[0.2em] uppercase text-[#A7A59D]/70 hover:text-[#F2EFE6] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F15A24] px-2 py-1 rounded-xs"
                >
                    <span>[ SKIP ]</span>
                    <span className="hidden sm:inline text-[9px] text-[#A7A59D]/50">(ESC)</span>
                </button>
            </footer>
        </aside>
    );
}
