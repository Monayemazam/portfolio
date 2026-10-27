import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface EventHorizonPreloaderProps {
    onComplete?: () => void;
    reducedMotion?: boolean;
}

interface Star {
    x: number;
    y: number;
    size: number;
    baseAlpha: number;
    alpha: number;
    twinkleSpeed: number;
    phase: number;
    color: string;
}

export default function EventHorizonPreloader({
    onComplete,
    reducedMotion = false,
}: EventHorizonPreloaderProps) {
    const containerRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nameRef = useRef<HTMLHeadingElement | null>(null);
    const roleRef = useRef<HTMLParagraphElement | null>(null);
    const lightSweepRef = useRef<HTMLDivElement | null>(null);
    const progressTrackRef = useRef<HTMLDivElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    const [isComplete, setIsComplete] = useState(false);
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

    // 2. Physics state driven by GSAP timeline for the Canvas rendering
    const physicsRef = useRef({
        sparkScale: 0,
        sparkAlpha: 0,
        coreRadius: 0,
        ringIntensity: 0,
        ringScale: 1,
        rotationAngle: 0,
        waveRadius: 0,
        waveAlpha: 0,
        dissolveGlow: 0,
    });

    // 3. Canvas 2D Event Horizon & Starfield Animation Engine
    useEffect(() => {
        if (reducedMotion) return;

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

        // Generate 35-45 restrained, subtle stars
        const starCount = Math.min(45, Math.max(25, Math.floor((width * height) / 36000)));
        const stars: Star[] = [];

        for (let i = 0; i < starCount; i++) {
            const isOrange = Math.random() > 0.85;
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.1 + 0.5,
                baseAlpha: Math.random() * 0.35 + 0.15,
                alpha: 0.25,
                twinkleSpeed: Math.random() * 0.02 + 0.008,
                phase: Math.random() * Math.PI * 2,
                color: isOrange ? 'rgba(241, 90, 36, ' : 'rgba(242, 239, 230, ',
            });
        }

        let lastTime = performance.now();

        const render = (currentTime: number) => {
            const dt = Math.min(currentTime - lastTime, 48) / 16.666;
            lastTime = currentTime;

            ctx.clearRect(0, 0, width, height);

            const p = physicsRef.current;
            p.rotationAngle += 0.04 * dt;

            // Center of Event Horizon in upper third of screen
            const cx = width / 2;
            const cy = height < 600 ? height * 0.32 : height * 0.36;
            const targetCoreRadius = width < 640 ? 24 : 32;

            // --- A. Background Stars ---
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.phase += s.twinkleSpeed * dt;
                s.alpha = s.baseAlpha + Math.sin(s.phase) * 0.15;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `${s.color}${Math.max(0.08, s.alpha)})`;
                ctx.fill();
            }

            // --- B. Phase 1: Tiny central spark in the void ---
            if (p.sparkScale > 0 && p.sparkAlpha > 0) {
                // Atmospheric ambient halo
                const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140 * p.sparkScale);
                haloGrad.addColorStop(0, `rgba(241, 90, 36, ${0.2 * p.sparkAlpha})`);
                haloGrad.addColorStop(0.35, `rgba(23, 60, 50, ${0.15 * p.sparkAlpha})`);
                haloGrad.addColorStop(1, 'rgba(16, 20, 18, 0)');

                ctx.fillStyle = haloGrad;
                ctx.beginPath();
                ctx.arc(cx, cy, 140 * p.sparkScale, 0, Math.PI * 2);
                ctx.fill();

                // Central intense pinpoint of warm light
                const sparkRadius = Math.max(1.5, 9 * p.sparkScale);
                const sparkGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sparkRadius);
                sparkGrad.addColorStop(0, `rgba(255, 255, 255, ${p.sparkAlpha})`);
                sparkGrad.addColorStop(0.3, `rgba(255, 220, 150, ${0.9 * p.sparkAlpha})`);
                sparkGrad.addColorStop(0.7, `rgba(241, 90, 36, ${0.6 * p.sparkAlpha})`);
                sparkGrad.addColorStop(1, 'rgba(241, 90, 36, 0)');

                ctx.fillStyle = sparkGrad;
                ctx.beginPath();
                ctx.arc(cx, cy, sparkRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            // --- C. Phase 2-5: Event Horizon Core & Burning Accretion Ring ---
            if (p.coreRadius > 0) {
                const currentCoreR = p.coreRadius * targetCoreRadius;
                const ringScale = p.ringScale;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.scale(ringScale, ringScale * 0.9); // Subtle 3D tilt

                // 1. Broad outer plasma heat glow
                if (p.ringIntensity > 0) {
                    const outerGlowR = currentCoreR * 2.8;
                    const glowGrad = ctx.createRadialGradient(0, 0, currentCoreR * 0.9, 0, 0, outerGlowR);
                    glowGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * p.ringIntensity})`);
                    glowGrad.addColorStop(0.12, `rgba(255, 175, 70, ${0.85 * p.ringIntensity})`);
                    glowGrad.addColorStop(0.35, `rgba(241, 90, 36, ${0.65 * p.ringIntensity})`);
                    glowGrad.addColorStop(0.75, `rgba(180, 50, 10, ${0.2 * p.ringIntensity})`);
                    glowGrad.addColorStop(1, 'rgba(241, 90, 36, 0)');

                    ctx.fillStyle = glowGrad;
                    ctx.beginPath();
                    ctx.arc(0, 0, outerGlowR, 0, Math.PI * 2);
                    ctx.fill();

                    // 2. Swirling orbital plasma streams (restrained, fluid arcs)
                    ctx.save();
                    ctx.rotate(p.rotationAngle);

                    for (let j = 0; j < 3; j++) {
                        const streamAngle = (j * (Math.PI * 2)) / 3;
                        const arcR = currentCoreR * (1.18 + j * 0.18);

                        ctx.beginPath();
                        ctx.arc(0, 0, arcR, streamAngle, streamAngle + 1.2);
                        ctx.lineWidth = (2.2 - j * 0.4) * p.ringIntensity;
                        ctx.strokeStyle = j === 0
                            ? `rgba(255, 240, 200, ${0.85 * p.ringIntensity})`
                            : `rgba(241, 90, 36, ${0.7 * p.ringIntensity})`;
                        ctx.lineCap = 'round';
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                // 3. Pitch-black central event horizon singularity
                ctx.beginPath();
                ctx.arc(0, 0, currentCoreR, 0, Math.PI * 2);
                ctx.fillStyle = '#0a0d0a';
                ctx.fill();

                // 4. Razor-sharp luminous photon ring at the boundary
                if (p.ringIntensity > 0) {
                    ctx.beginPath();
                    ctx.arc(0, 0, currentCoreR, 0, Math.PI * 2);
                    ctx.lineWidth = 1.6;
                    ctx.strokeStyle = `rgba(255, 250, 235, ${0.92 * p.ringIntensity})`;
                    ctx.stroke();
                }

                ctx.restore();
            }

            // --- D. Phase 4: Gravitational Shockwave Wave ---
            if (p.waveRadius > 0 && p.waveAlpha > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, p.waveRadius, 0, Math.PI * 2);
                const maxDim = Math.max(width, height);
                const progressRatio = Math.min(1, p.waveRadius / (maxDim * 0.9));
                ctx.lineWidth = Math.max(1, 3.5 * (1 - progressRatio));
                ctx.strokeStyle = `rgba(241, 90, 36, ${p.waveAlpha})`;
                ctx.shadowColor = '#F15A24';
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.restore();
            }

            // --- E. Phase 5: Soft expansion field dissolving into Hero ---
            if (p.dissolveGlow > 0) {
                const maxGlowR = Math.max(width, height) * 0.75;
                const dissolveGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxGlowR);
                dissolveGrad.addColorStop(0, `rgba(241, 90, 36, ${0.25 * p.dissolveGlow})`);
                dissolveGrad.addColorStop(0.35, `rgba(23, 60, 50, ${0.18 * p.dissolveGlow})`);
                dissolveGrad.addColorStop(1, 'rgba(16, 20, 18, 0)');

                ctx.fillStyle = dissolveGrad;
                ctx.beginPath();
                ctx.arc(cx, cy, maxGlowR, 0, Math.PI * 2);
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

    // 4. Coordinated Master Timeline
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const finishPreloader = () => {
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

            // Accessible instant version for reduced motion
            if (reducedMotion) {
                const tl = gsap.timeline({ onComplete: finishPreloader });
                timelineRef.current = tl;

                if (nameRef.current) gsap.set(nameRef.current, { y: 0, opacity: 1 });
                if (roleRef.current) gsap.set(roleRef.current, { y: 0, opacity: 1 });
                if (progressBarRef.current) gsap.set(progressBarRef.current, { width: '100%' });

                tl.to({}, { duration: 0.25 });
                return;
            }

            // Cinematic 5-Phase Sequence (~2.2s total)
            const masterTl = gsap.timeline({ onComplete: finishPreloader });
            timelineRef.current = masterTl;

            if (typeof window !== 'undefined') {
                (window as any).__PRELOADER_TL__ = masterTl;
                (window as any).__PRELOADER_SEEK__ = (time: number) => {
                    masterTl.pause();
                    masterTl.seek(time);
                };
            }

            const physics = physicsRef.current;
            const maxDimension = typeof window !== 'undefined'
                ? Math.max(window.innerWidth, window.innerHeight)
                : 1200;

            // Initial DOM setup
            if (nameRef.current) gsap.set(nameRef.current, { y: '105%', opacity: 0 });
            if (roleRef.current) gsap.set(roleRef.current, { y: 8, opacity: 0 });
            if (lightSweepRef.current) gsap.set(lightSweepRef.current, { x: '-100%', opacity: 0 });
            if (progressTrackRef.current) gsap.set(progressTrackRef.current, { opacity: 0 });
            if (progressBarRef.current) gsap.set(progressBarRef.current, { width: '0%' });

            masterTl
                // PHASE 1 — THE VOID (0.0s -> 0.4s)
                .to(physics, {
                    sparkScale: 1,
                    sparkAlpha: 1,
                    duration: 0.38,
                    ease: 'power2.out',
                }, 0.05)

                // PHASE 2 — GRAVITATIONAL IGNITION (0.4s -> 0.85s)
                .to(physics, {
                    sparkScale: 0.3,
                    sparkAlpha: 0.4,
                    coreRadius: 1,
                    ringIntensity: 1,
                    duration: 0.45,
                    ease: 'power3.out',
                }, 0.4)

                // PHASE 3 — BOLD TYPOGRAPHIC REVEAL (0.8s -> 1.4s)
                .to(nameRef.current, {
                    y: '0%',
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                }, 0.8)
                .to(lightSweepRef.current, {
                    x: '250%',
                    opacity: 0.85,
                    duration: 0.65,
                    ease: 'power2.inOut',
                }, 0.82)
                .to(lightSweepRef.current, {
                    opacity: 0,
                    duration: 0.2,
                }, 1.25)
                .to(roleRef.current, {
                    y: 0,
                    opacity: 0.85,
                    duration: 0.42,
                    ease: 'power2.out',
                }, 1.05)

                // PHASE 4 — SIGNATURE MOMENT: PULSE, WAVE & PROGRESS LINE (1.35s -> 1.85s)
                .to(physics, {
                    ringScale: 0.88,
                    duration: 0.14,
                    ease: 'power2.in',
                }, 1.35)
                .to(physics, {
                    ringScale: 1.0,
                    duration: 0.16,
                    ease: 'power2.out',
                }, 1.49)
                .to(physics, {
                    waveRadius: maxDimension * 0.85,
                    waveAlpha: 0.8,
                    duration: 0.5,
                    ease: 'power2.out',
                }, 1.49)
                .to(physics, {
                    waveAlpha: 0,
                    duration: 0.2,
                }, 1.75)
                // Progress Line appears and fills with the wave
                .to(progressTrackRef.current, {
                    opacity: 1,
                    duration: 0.2,
                    ease: 'power1.out',
                }, 1.45)
                .to(progressBarRef.current, {
                    width: '100%',
                    duration: 0.42,
                    ease: 'power2.inOut',
                }, 1.48)

                // PHASE 5 — SEAMLESS HANDOFF (1.85s -> 2.25s)
                .to(physics, {
                    ringScale: 3.2,
                    dissolveGlow: 1,
                    duration: 0.4,
                    ease: 'power2.inOut',
                }, 1.85)
                .to(containerRef.current, {
                    opacity: 0,
                    duration: 0.32,
                    ease: 'power2.inOut',
                }, 1.95);

            if (typeof window !== 'undefined' && window.location.search.includes('hold_preloader')) {
                masterTl.pause();
                masterTl.seek(1.2);
            }
        }, containerRef);

        // Failsafe timer (2.6s max) so the preloader can never hang indefinitely in production
        const isDebugHold = typeof window !== 'undefined' && window.location.search.includes('hold_preloader');
        const failsafe = !isDebugHold ? setTimeout(() => {
            setIsComplete(true);
            if (onComplete) onComplete();
        }, 2600) : null;

        return () => {
            if (failsafe) clearTimeout(failsafe);
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
            onClick={handleSkip}
            aria-label="Welcome to Monayem Azam's Portfolio"
            aria-live="polite"
            style={{ backgroundColor: '#101412', color: '#F2EFE6' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none text-[#F2EFE6] cursor-pointer"
        >
            {/* Ambient Deep Space Radial Gradient Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(23,60,50,0.38)_0%,rgba(16,20,18,0.95)_65%,#101412_100%)]"
            />

            {/* Canvas 2D: Physics Starfield, Spark, Event Horizon & Shockwave */}
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
            />

            {/* Central Typography & Progress Stage */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 mt-28 sm:mt-32 max-w-2xl">
                
                {/* Name Reveal with Radiant Moving Mask */}
                <div className="relative overflow-hidden py-1">
                    <h1
                        ref={nameRef}
                        style={{ opacity: 0, transform: 'translateY(105%)' }}
                        className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#F2EFE6] uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
                    >
                        MONAYEM AZAM
                    </h1>

                    {/* Radiant Orange Light Sweep Beam passing across the text */}
                    <div
                        ref={lightSweepRef}
                        aria-hidden="true"
                        style={{ opacity: 0, transform: 'translateX(-100%)' }}
                        className="pointer-events-none absolute inset-0 w-2/5 bg-gradient-to-r from-transparent via-[#F15A24]/90 to-transparent mix-blend-screen"
                    />
                </div>

                {/* Subtitle Reveal */}
                <p
                    ref={roleRef}
                    style={{ opacity: 0, transform: 'translateY(8px)' }}
                    className="mt-3 font-mono text-xs sm:text-sm font-semibold tracking-[0.32em] text-[#A7A59D] uppercase"
                >
                    FULL-STACK WEB DEVELOPER
                </p>

                {/* Signature Minimalist Progress Line */}
                <div
                    ref={progressTrackRef}
                    aria-hidden="true"
                    style={{ opacity: 0 }}
                    className="mt-8 h-[1.5px] w-40 sm:w-56 overflow-hidden rounded-full bg-[#F2EFE6]/10"
                >
                    <div
                        ref={progressBarRef}
                        style={{ width: '0%' }}
                        className="h-full bg-gradient-to-r from-[#F15A24] via-[#FFA040] to-[#FFFFFF] shadow-[0_0_10px_#F15A24]"
                    />
                </div>
            </div>

            {/* Subtle Minimal Skip Hint in Bottom Right */}
            <div className="pointer-events-none absolute bottom-6 right-6 z-10 font-mono text-[10px] tracking-widest uppercase text-[#A7A59D]/40">
                <span>[ESC TO SKIP]</span>
            </div>
        </aside>
    );
}
