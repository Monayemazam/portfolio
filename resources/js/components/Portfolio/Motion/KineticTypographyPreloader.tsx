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
    const headlineRef = useRef<HTMLHeadingElement | null>(null);
    const lineRef = useRef<HTMLDivElement | null>(null);
    const identityRef = useRef<HTMLDivElement | null>(null);
    const telemetryRef = useRef<HTMLDivElement | null>(null);

    const [isComplete, setIsComplete] = useState(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

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

        // Generate 45-60 restrained stars
        const starCount = Math.min(60, Math.max(35, Math.floor((width * height) / 28000)));
        const stars: CosmicStar[] = [];

        for (let i = 0; i < starCount; i++) {
            const rand = Math.random();
            let colorType: CosmicStar['colorType'] = 'warmWhite';
            if (rand > 0.92) {
                colorType = 'acidLime';
            } else if (rand > 0.82) {
                colorType = 'signalOrange';
            }

            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.2 + 0.6,
                baseAlpha: Math.random() * 0.5 + 0.3,
                alpha: 0.5,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2,
                vx: (Math.random() * 0.15 + 0.05) * -1,
                vy: (Math.random() - 0.5) * 0.05,
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
                    s.alpha = s.baseAlpha + Math.sin(s.phase) * 0.22;
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
                    ctx.fillStyle = `rgba(241, 90, 36, ${Math.max(0.2, s.alpha * 0.95)})`;
                } else if (s.colorType === 'acidLime') {
                    ctx.fillStyle = `rgba(213, 243, 74, ${Math.max(0.2, s.alpha * 0.85)})`;
                } else {
                    ctx.fillStyle = `rgba(242, 239, 230, ${Math.max(0.15, s.alpha * 0.75)})`;
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

    // 3. Coordinated Typographic Reveal Master Timeline
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
                        duration: reducedMotion ? 0.25 : 0.55,
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

                if (headlineRef.current) gsap.set(headlineRef.current, { opacity: 0 });
                if (identityRef.current) gsap.set(identityRef.current, { opacity: 0 });

                tl.to([headlineRef.current, identityRef.current], {
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power1.out',
                }).to({}, { duration: 0.8 }); // Brief steady hold

                return;
            }

            // Normal cinematic timeline (total ~1.8s)
            const masterTl = gsap.timeline({ onComplete: finishLoader });
            timelineRef.current = masterTl;

            // Initial staging
            if (headlineRef.current) {
                gsap.set(headlineRef.current.children, {
                    yPercent: 40,
                    opacity: 0,
                });
            }
            if (lineRef.current) {
                gsap.set(lineRef.current, {
                    scaleX: 0,
                    transformOrigin: 'center center',
                });
            }
            if (identityRef.current) {
                gsap.set(identityRef.current, {
                    y: 15,
                    opacity: 0,
                });
            }
            if (telemetryRef.current) {
                gsap.set(telemetryRef.current, {
                    opacity: 0,
                });
            }

            masterTl
                // Headline lines reveal in sequence
                .to(headlineRef.current?.children || [], {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.65,
                    stagger: 0.12,
                    ease: 'power3.out',
                })
                // Fine orange accent line draws outward
                .to(
                    lineRef.current,
                    {
                        scaleX: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '-=0.3',
                )
                // Identity statement & role fade up
                .to(
                    identityRef.current,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.45,
                        ease: 'power2.out',
                    },
                    '-=0.25',
                )
                // Telemetry status mark settles
                .to(
                    telemetryRef.current,
                    {
                        opacity: 1,
                        duration: 0.35,
                        ease: 'power1.out',
                    },
                    '-=0.2',
                )
                // Steady hold for user immersion
                .to({}, { duration: 0.85 });
        }, containerRef);

        // Failsafe timer (3.5s max) so the preloader can never hang indefinitely
        const failsafe = setTimeout(() => {
            setIsComplete(true);
            if (onComplete) onComplete();
        }, 3500);

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
            aria-label="Portfolio Introduction and Identity Sequence"
            aria-live="polite"
            className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden select-none bg-[#171914] text-[#F2EFE6]"
        >
            {/* Ambient Cosmic Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(23,60,50,0.5)_0%,rgba(23,25,20,0.95)_65%,#171914_100%)]"
            />

            {/* Restrained Atmospheric Forest-Green & Orange Volumetric Glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/4 -right-1/6 w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-[radial-gradient(circle,rgba(23,60,50,0.4)_0%,transparent_70%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1/4 -left-1/8 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[radial-gradient(circle,rgba(241,90,36,0.12)_0%,transparent_70%)]"
            />

            {/* Persistent Starfield Canvas */}
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-85"
            />

            {/* TOP TELEMETRY BAR */}
            <header className="relative z-10 flex items-center justify-between border-b border-[#F2EFE6]/10 px-6 sm:px-10 lg:px-16 py-4 font-mono text-[11px] sm:text-xs tracking-wider text-[#A7A59D] uppercase">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                    </span>
                    <span className="font-bold text-[#F2EFE6] tracking-widest">
                        MONAYEM AZAM
                    </span>
                    <span className="text-[#F2EFE6]/30 hidden sm:inline">/</span>
                    <span className="text-[#A7A59D] hidden sm:inline tracking-widest">
                        FULL-STACK WEB DEVELOPER
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] sm:text-xs text-[var(--accent)] tracking-widest font-semibold">
                        CALIBRATING WORKSPACE
                    </span>
                </div>
            </header>

            {/* MAIN TYPOGRAPHIC STAGE */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    
                    {/* Eyebrow marker */}
                    <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[var(--primary)] uppercase tracking-widest mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                        <span>MISSION CONTROL // DIGITAL ARCHITECTURE</span>
                    </div>

                    {/* Headline: I MAKE THE DIGITAL FEEL REAL */}
                    <h1
                        ref={headlineRef}
                        className="font-display font-black uppercase text-[#F2EFE6] text-center leading-[0.9] tracking-[-0.03em] text-[clamp(2.5rem,8.5vw,7.8rem)] drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                    >
                        <span className="block">I MAKE</span>
                        <span className="block text-[var(--primary)] drop-shadow-[0_0_40px_rgba(241,90,36,0.4)]">
                            THE DIGITAL
                        </span>
                        <span className="block">FEEL REAL.</span>
                    </h1>

                    {/* Fine Signal-Orange Line */}
                    <div
                        ref={lineRef}
                        className="h-[2px] w-36 sm:w-56 md:w-80 bg-[var(--primary)] mt-5 sm:mt-6 mb-4 sm:mb-5 shadow-[0_0_12px_var(--primary)]"
                    />

                    {/* Identity Statement */}
                    <div
                        ref={identityRef}
                        className="flex flex-col items-center gap-1.5"
                    >
                        <p className="font-mono text-xs sm:text-sm md:text-base text-[#DED8CB] uppercase tracking-[0.24em] font-medium">
                            MONAYEM AZAM · FULL-STACK WEB DEVELOPER
                        </p>
                    </div>

                    {/* Systems Telemetry Indicator */}
                    <div
                        ref={telemetryRef}
                        className="mt-6 flex items-center gap-2 font-mono text-[10px] sm:text-xs text-[#A7A59D] uppercase tracking-wider"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                        <span className="text-[var(--accent)] font-semibold">
                            SYSTEMS ONLINE · ENTERING PORTFOLIO
                        </span>
                    </div>

                </div>
            </main>

            {/* BOTTOM ARCHITECTURAL FOOTER & SKIP CONTROL */}
            <footer className="relative z-10 flex items-center justify-between border-t border-[#F2EFE6]/10 px-6 sm:px-10 lg:px-16 py-4 font-mono text-[10px] sm:text-[11px] text-[#A7A59D]">
                <div className="flex items-center gap-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                    <span className="tracking-widest uppercase">
                        DHAKA, BANGLADESH · 23.8103° N, 90.4125° E
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleSkip}
                    aria-label="Skip introduction animation"
                    className="pointer-events-auto flex items-center gap-2 tracking-[0.2em] uppercase text-[#A7A59D]/70 hover:text-[#F2EFE6] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--primary)] px-2 py-1 rounded-xs"
                >
                    <span>[ SKIP ]</span>
                    <span className="hidden sm:inline text-[9px] text-[#A7A59D]/50">(ESC)</span>
                </button>
            </footer>
        </aside>
    );
}
