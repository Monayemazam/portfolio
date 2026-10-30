import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface EventHorizonPreloaderProps {
    onComplete?: () => void;
    reducedMotion?: boolean;
}

// Module-level guard: do not show preloader again during internal SPA navigation in the same session
let hasLoadedOnceInSession = false;

export default function EventHorizonPreloader({
    onComplete,
    reducedMotion = false,
}: EventHorizonPreloaderProps) {
    const [isComplete, setIsComplete] = useState<boolean>(() => hasLoadedOnceInSession);

    const containerRef = useRef<HTMLElement | null>(null);
    const eclipseGroupRef = useRef<SVGGElement | null>(null);
    const coronaAuraRef = useRef<SVGCircleElement | null>(null);
    const orbitalRingRef = useRef<SVGCircleElement | null>(null);
    const eclipseDiscRef = useRef<SVGCircleElement | null>(null);
    const maTextRef = useRef<SVGTextElement | null>(null);
    const maSweepRef = useRef<SVGRectElement | null>(null);
    const focalLightRef = useRef<SVGGElement | null>(null);

    const nameRef = useRef<HTMLHeadingElement | null>(null);
    const roleRef = useRef<HTMLParagraphElement | null>(null);
    const progressTrackRef = useRef<HTMLDivElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // 1. Lock document scrolling during preloader and clean up on exit
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

    // 2. Resource readiness detection (DOM + Webfonts)
    const checkReadiness = (): Promise<boolean> => {
        return new Promise((resolve) => {
            const isDocReady = document.readyState === 'complete';
            const fontsPromise = (document as any).fonts?.ready
                ? (document as any).fonts.ready
                : Promise.resolve();

            if (isDocReady) {
                fontsPromise.then(() => resolve(true)).catch(() => resolve(true));
            } else {
                const onLoad = () => {
                    window.removeEventListener('load', onLoad);
                    fontsPromise.then(() => resolve(true)).catch(() => resolve(true));
                };
                window.addEventListener('load', onLoad);
            }
        });
    };

    // 3. Skip handler (Escape key or click)
    const handleSkip = () => {
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        hasLoadedOnceInSession = true;
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

    // 4. Coordinated Master Timeline — ECLIPSE INTRODUCTION
    useEffect(() => {
        if (isComplete || !containerRef.current) return;

        let isAppReady = false;
        let isWaitingForReady = false;
        let masterTl: gsap.core.Timeline | null = null;

        const finishPreloader = () => {
            hasLoadedOnceInSession = true;
            if (containerRef.current) {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: reducedMotion ? 0.2 : 0.35,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        setIsComplete(true);
                        if (onComplete) onComplete();
                    },
                });
            } else {
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        };

        // Listen for real resource readiness in parallel
        checkReadiness().then(() => {
            isAppReady = true;
            if (isWaitingForReady && masterTl) {
                masterTl.play();
            }
        });

        const ctx = gsap.context(() => {
            // Accessible instant flow for reduced motion
            if (reducedMotion) {
                const tl = gsap.timeline({ onComplete: finishPreloader });
                timelineRef.current = tl;

                if (eclipseGroupRef.current) gsap.set(eclipseGroupRef.current, { opacity: 1, scale: 1 });
                if (orbitalRingRef.current) gsap.set(orbitalRingRef.current, { strokeDashoffset: 0 });
                if (focalLightRef.current) gsap.set(focalLightRef.current, { opacity: 1, scale: 1 });
                if (maTextRef.current) gsap.set(maTextRef.current, { opacity: 1 });
                if (nameRef.current) gsap.set(nameRef.current, { y: 0, opacity: 1 });
                if (roleRef.current) gsap.set(roleRef.current, { y: 0, opacity: 1 });
                if (progressBarRef.current) gsap.set(progressBarRef.current, { width: '100%' });

                tl.to({}, { duration: 0.25 });
                return;
            }

            // --- Full 4-Phase Cinematic Eclipse Sequence ---
            masterTl = gsap.timeline({ onComplete: finishPreloader });
            timelineRef.current = masterTl;

            if (typeof window !== 'undefined') {
                (window as any).__ECLIPSE_PRELOADER_TL__ = masterTl;
                (window as any).__ECLIPSE_PRELOADER_SEEK__ = (time: number) => {
                    masterTl?.pause();
                    masterTl?.seek(time);
                };
            }

            // Initial DOM states
            if (coronaAuraRef.current) gsap.set(coronaAuraRef.current, { opacity: 0, scale: 0.8, transformOrigin: '120px 120px' });
            if (orbitalRingRef.current) gsap.set(orbitalRingRef.current, { strokeDashoffset: 553, transformOrigin: '120px 120px' });
            if (eclipseDiscRef.current) gsap.set(eclipseDiscRef.current, { opacity: 0, scale: 0.92, transformOrigin: '120px 120px' });
            if (focalLightRef.current) gsap.set(focalLightRef.current, { opacity: 0, scale: 0.2, transformOrigin: '182.2px 57.8px' });
            if (maTextRef.current) gsap.set(maTextRef.current, { opacity: 0, scale: 0.92, transformOrigin: '120px 129px' });
            if (maSweepRef.current) gsap.set(maSweepRef.current, { x: -160 });

            if (nameRef.current) gsap.set(nameRef.current, { y: 18, opacity: 0 });
            if (roleRef.current) gsap.set(roleRef.current, { y: 10, opacity: 0 });
            if (progressTrackRef.current) gsap.set(progressTrackRef.current, { opacity: 0 });
            if (progressBarRef.current) gsap.set(progressBarRef.current, { width: '0%' });

            masterTl
                // ==========================================
                // PHASE 01 — THE AWAKENING (0.0s -> 0.45s)
                // ==========================================
                // Tiny orange focal light appears & grows in intensity
                .to(focalLightRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.42,
                    ease: 'power2.out',
                }, 0.04)
                // Corona aura emerges gently from the void
                .to(coronaAuraRef.current, {
                    opacity: 0.6,
                    scale: 1,
                    duration: 0.48,
                    ease: 'power2.out',
                }, 0.08)
                // Orbital arc begins precisely drawing around the perimeter
                .to(orbitalRingRef.current, {
                    strokeDashoffset: 210,
                    duration: 0.5,
                    ease: 'power2.inOut',
                }, 0.08)
                // Eclipse celestial body emerges from darkness
                .to(eclipseDiscRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.45,
                    ease: 'power2.out',
                }, 0.12)

                // ==========================================
                // PHASE 02 — IDENTITY REVEAL (0.45s -> 1.05s)
                // ==========================================
                // Initials MA reveal with gold-orange light
                .to(maTextRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.38,
                    ease: 'power3.out',
                }, 0.44)
                // Specular light sweep passes across the initials
                .to(maSweepRef.current, {
                    x: 160,
                    duration: 0.52,
                    ease: 'power2.inOut',
                }, 0.46)
                // Full name: MONAYEM AZAM
                .to(nameRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                }, 0.56)
                // Designation: FULL-STACK WEB DEVELOPER
                .to(roleRef.current, {
                    y: 0,
                    opacity: 0.85,
                    duration: 0.42,
                    ease: 'power2.out',
                }, 0.72)

                // ==========================================
                // PHASE 03 — LOADING INDICATOR (0.85s -> 1.30s)
                // ==========================================
                .to(progressTrackRef.current, {
                    opacity: 1,
                    duration: 0.22,
                    ease: 'power1.out',
                }, 0.85)
                .to(progressBarRef.current, {
                    width: '80%',
                    duration: 0.42,
                    ease: 'power2.out',
                }, 0.88)
                .to(orbitalRingRef.current, {
                    strokeDashoffset: 60,
                    duration: 0.42,
                    ease: 'power1.inOut',
                }, 0.88)

                // Readiness checkpoint: if resources still loading on slow networks, hold smoothly
                .add(() => {
                    if (!isAppReady) {
                        isWaitingForReady = true;
                        masterTl?.pause();
                    }
                }, 1.30)

                // Complete indicator to 100%
                .to(progressBarRef.current, {
                    width: '100%',
                    duration: 0.18,
                    ease: 'power2.out',
                }, 1.32)

                // ==========================================
                // PHASE 04 — CINEMATIC WEBSITE REVEAL (1.35s -> 1.75s)
                // ==========================================
                // Orbital ring locks and completes full circuit
                .to(orbitalRingRef.current, {
                    strokeDashoffset: 0,
                    duration: 0.22,
                    ease: 'power2.out',
                }, 1.35)
                // Focal light briefly intensifies in brilliance
                .to(focalLightRef.current, {
                    scale: 1.45,
                    duration: 0.16,
                    ease: 'power2.in',
                }, 1.35)
                .to(focalLightRef.current, {
                    scale: 1.0,
                    opacity: 0,
                    duration: 0.24,
                    ease: 'power2.out',
                }, 1.51)
                // Eclipse symbol expands and dissolves into the hero space
                .to(eclipseGroupRef.current, {
                    scale: 1.15,
                    opacity: 0,
                    duration: 0.36,
                    ease: 'power2.inOut',
                }, 1.42)
                // Typography softens
                .to([nameRef.current, roleRef.current, progressTrackRef.current], {
                    opacity: 0,
                    y: -6,
                    duration: 0.28,
                    ease: 'power2.in',
                }, 1.44)
                // Final clean dissolve into Hero section
                .to(containerRef.current, {
                    opacity: 0,
                    duration: 0.32,
                    ease: 'power2.inOut',
                }, 1.52);

            // Debug hold parameter support (?hold_preloader)
            if (typeof window !== 'undefined' && window.location.search.includes('hold_preloader')) {
                masterTl.pause();
                masterTl.seek(0.95);
            }
        }, containerRef);

        // Failsafe timeout (2.6s) ensures no user can ever become trapped
        const isDebugHold = typeof window !== 'undefined' && window.location.search.includes('hold_preloader');
        const failsafe = !isDebugHold ? setTimeout(() => {
            isAppReady = true;
            if (isWaitingForReady && masterTl) {
                masterTl.play();
            } else if (!isComplete) {
                finishPreloader();
            }
        }, 2600) : null;

        return () => {
            if (failsafe) clearTimeout(failsafe);
            ctx.revert();
        };
    }, [reducedMotion, isComplete, onComplete]);

    if (isComplete) {
        return null;
    }

    return (
        <aside
            ref={containerRef}
            onClick={handleSkip}
            aria-label="Eclipse — Monayem Azam Introduction"
            aria-live="polite"
            style={{ backgroundColor: '#0B0E14', color: '#F2EFE6' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none text-[#F2EFE6] cursor-pointer"
        >
            {/* Ambient Deep Near-Black Cosmic Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_44%,rgba(23,60,50,0.28)_0%,rgba(16,20,18,0.92)_55%,#0B0E14_100%)]"
            />

            {/* Central Eclipse Symbol & Visual Assembly */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
                
                {/* Custom Eclipse Symbol with Masked Initials & Orbital Ring */}
                <div className="relative flex items-center justify-center">
                    <svg
                        viewBox="0 0 240 240"
                        className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 overflow-visible drop-shadow-[0_0_30px_rgba(241,90,36,0.22)]"
                        aria-hidden="true"
                    >
                        <defs>
                            {/* Corona Atmospheric Aura */}
                            <radialGradient id="eclipseCorona" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#FFAA20" stopOpacity="0.45" />
                                <stop offset="36%" stopColor="#F15A24" stopOpacity="0.22" />
                                <stop offset="72%" stopColor="#173C32" stopOpacity="0.08" />
                                <stop offset="100%" stopColor="#0B0E14" stopOpacity="0" />
                            </radialGradient>

                            {/* Thin Orbital Ring Gradient */}
                            <linearGradient id="orbitalRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF" />
                                <stop offset="16%" stopColor="#FFAA20" />
                                <stop offset="55%" stopColor="#F15A24" />
                                <stop offset="100%" stopColor="rgba(241, 90, 36, 0.12)" />
                            </linearGradient>

                            {/* Initials Monogram Gradient */}
                            <linearGradient id="maGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#E6E2D8" />
                                <stop offset="38%" stopColor="#FFFFFF" />
                                <stop offset="70%" stopColor="#FFAA20" />
                                <stop offset="100%" stopColor="#F15A24" />
                            </linearGradient>

                            {/* Focal Light Blur Filter */}
                            <filter id="focalGlow" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="3.2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Diffuse Aura Filter */}
                            <filter id="diffuseGlow" x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="8" />
                            </filter>

                            {/* Monogram Mask with Light-Sweep */}
                            <mask id="maLightMask">
                                <rect x="0" y="0" width="240" height="240" fill="white" />
                                <rect
                                    ref={maSweepRef}
                                    x="40"
                                    y="70"
                                    width="45"
                                    height="100"
                                    fill="white"
                                    transform="rotate(25 120 120)"
                                    opacity="0.95"
                                />
                            </mask>
                        </defs>

                        {/* Whole Eclipse Group (for Phase 4 expansion) */}
                        <g ref={eclipseGroupRef} className="origin-[120px_120px]">
                            {/* Layer 1: Ambient Corona Aura */}
                            <circle
                                ref={coronaAuraRef}
                                cx="120"
                                cy="120"
                                r="112"
                                fill="url(#eclipseCorona)"
                                opacity="0"
                            />

                            {/* Layer 2: Subtle Geometric Guide Track */}
                            <circle
                                cx="120"
                                cy="120"
                                r="88"
                                fill="none"
                                stroke="rgba(241, 90, 36, 0.1)"
                                strokeWidth="1"
                                strokeDasharray="3 7"
                            />

                            {/* Layer 3: Thin Precisely Animated Orange Orbital Ring */}
                            <circle
                                ref={orbitalRingRef}
                                cx="120"
                                cy="120"
                                r="88"
                                fill="none"
                                stroke="url(#orbitalRingGrad)"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeDasharray="553"
                                strokeDashoffset="553"
                            />

                            {/* Layer 4: Central Celestial Dark Eclipse Disc */}
                            <circle
                                ref={eclipseDiscRef}
                                cx="120"
                                cy="120"
                                r="74"
                                fill="#0B0E14"
                                stroke="rgba(255, 170, 32, 0.35)"
                                strokeWidth="1"
                                opacity="0"
                            />

                            {/* Layer 5: Bold Initial Monogram MA (Dominant & Centered) */}
                            <text
                                ref={maTextRef}
                                x="120"
                                y="132"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                mask="url(#maLightMask)"
                                style={{ fontFamily: 'var(--font-display), Orbitron, Inter, sans-serif' }}
                                className="font-display font-black text-[42px] tracking-[0.04em] fill-[url(#maGrad)] select-none drop-shadow-[0_0_12px_rgba(241,90,36,0.45)]"
                            >
                                MA
                            </text>

                            {/* Layer 6: Small, Intense Golden-Orange Light Source (Diamond Ring Corona Flare) */}
                            {/* Positioned on the orbital perimeter at 45 degrees: (182.2, 57.8) */}
                            <g ref={focalLightRef} className="origin-[182.2px_57.8px]">
                                {/* Broad Diffuse Warm Halo */}
                                <circle
                                    cx="182.2"
                                    cy="57.8"
                                    r="22"
                                    fill="#F15A24"
                                    opacity="0.32"
                                    filter="url(#diffuseGlow)"
                                />
                                {/* Intense Golden Aura */}
                                <circle
                                    cx="182.2"
                                    cy="57.8"
                                    r="8.5"
                                    fill="#FFAA20"
                                    opacity="0.85"
                                    filter="url(#focalGlow)"
                                />
                                {/* Anamorphic Lens Flare Streak */}
                                <ellipse
                                    cx="182.2"
                                    cy="57.8"
                                    rx="18"
                                    ry="1.4"
                                    transform="rotate(-35 182.2 57.8)"
                                    fill="#FFE5A3"
                                    opacity="0.9"
                                />
                                {/* Secondary Soft Cross Flare */}
                                <ellipse
                                    cx="182.2"
                                    cy="57.8"
                                    rx="10"
                                    ry="1"
                                    transform="rotate(55 182.2 57.8)"
                                    fill="#FFAA20"
                                    opacity="0.55"
                                />
                                {/* Brilliant White Core Pinpoint */}
                                <circle
                                    cx="182.2"
                                    cy="57.8"
                                    r="2.6"
                                    fill="#FFFFFF"
                                />
                            </g>
                        </g>
                    </svg>
                </div>

                {/* Typography Stage — Strict Content & Editorial Spacing */}
                <div className="mt-8 sm:mt-10 flex flex-col items-center">
                    
                    {/* Full Name */}
                    <h1
                        ref={nameRef}
                        style={{ opacity: 0, transform: 'translateY(18px)' }}
                        className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.22em] text-[#F2EFE6] uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                    >
                        MONAYEM AZAM
                    </h1>

                    {/* Professional Designation */}
                    <p
                        ref={roleRef}
                        style={{ opacity: 0, transform: 'translateY(10px)' }}
                        className="mt-2.5 font-mono text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.38em] text-[#A7A59D] uppercase"
                    >
                        FULL-STACK WEB DEVELOPER
                    </p>

                    {/* Understated Minimal Loading Indicator */}
                    <div
                        ref={progressTrackRef}
                        aria-hidden="true"
                        style={{ opacity: 0 }}
                        className="mt-8 h-[1.5px] w-36 sm:w-48 overflow-hidden rounded-full bg-[#F2EFE6]/10"
                    >
                        <div
                            ref={progressBarRef}
                            style={{ width: '0%' }}
                            className="h-full bg-gradient-to-r from-transparent via-[#F15A24] to-[#FFAA20] shadow-[0_0_10px_#F15A24]"
                        />
                    </div>
                </div>
            </div>

            {/* Subtle Minimal Skip Hint in Bottom Right */}
            <div className="pointer-events-none absolute bottom-6 right-6 z-10 font-mono text-[10px] tracking-widest uppercase text-[#A7A59D]/30">
                <span>[ESC TO SKIP]</span>
            </div>
        </aside>
    );
}
