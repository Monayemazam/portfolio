import React, { useEffect, useRef, useState } from 'react';

interface UnknownSignalPreloaderProps {
    onComplete?: () => void;
    reducedMotion?: boolean;
}

type Scene =
    | 'void'            // Scene 01: The Deep Void (0 - 1800ms)
    | 'emergence'       // Scene 02: Something Emerges (1800 - 3800ms)
    | 'transmission'    // Scene 03: The Transmission (3800 - 5400ms)
    | 'identity'        // Scene 04: The Identity Reveal (5400 - 7000ms)
    | 'synchronisation' // Scene 05: System Synchronisation (7000 - 8200ms)
    | 'portal'          // Scene 06: The Portal Opens (8200 - 9200ms)
    | 'complete';       // Unmounted

export default function UnknownSignalPreloader({
    onComplete,
    reducedMotion = false,
}: UnknownSignalPreloaderProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [scene, setScene] = useState<Scene>('void');
    const [statusLabel, setStatusLabel] = useState('DETECTING UNKNOWN SIGNAL');
    const [activeSegments, setActiveSegments] = useState(1);
    const [portalProgress, setPortalProgress] = useState(0); // 0 to 100 for expanding portal wipe
    const [isAppReady, setIsAppReady] = useState(false);
    const [monogramStroke, setMonogramStroke] = useState(0); // 0 to 1 stroke draw progress
    const [isUnmounted, setIsUnmounted] = useState(false);

    // 1. Lock Body Scroll during Preloader
    useEffect(() => {
        if (isUnmounted || scene === 'complete') {
            document.body.style.overflow = '';
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isUnmounted, scene]);

    // 2. Real Readiness Signals (DOM + Fonts)
    useEffect(() => {
        let domReady = document.readyState === 'complete';
        let fontsReady = false;

        const checkReadiness = () => {
            if (domReady && fontsReady) {
                setIsAppReady(true);
            }
        };

        if (domReady) {
            checkReadiness();
        } else {
            const handleLoad = () => {
                domReady = true;
                checkReadiness();
            };
            window.addEventListener('load', handleLoad, { once: true });
        }

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready
                .then(() => {
                    fontsReady = true;
                    checkReadiness();
                })
                .catch(() => {
                    fontsReady = true;
                    checkReadiness();
                });
        } else {
            fontsReady = true;
            checkReadiness();
        }

        // Hard failsafe timer (10s max)
        const safetyTimer = setTimeout(() => {
            setIsAppReady(true);
        }, 10000);

        return () => clearTimeout(safetyTimer);
    }, []);

    // 3. Cinematic Pacing & Scene Choreography
    useEffect(() => {
        if (reducedMotion) {
            // Calm, shortened accessibility progression (~2.2s total)
            const t1 = setTimeout(() => {
                setScene('emergence');
                setStatusLabel('SIGNAL ACQUIRED');
                setActiveSegments(3);
            }, 500);

            const t2 = setTimeout(() => {
                setScene('identity');
                setStatusLabel('DECODING IDENTITY');
                setActiveSegments(5);
                setMonogramStroke(1);
            }, 1100);

            const t3 = setTimeout(() => {
                setScene('synchronisation');
                setStatusLabel('TRANSMISSION COMPLETE');
                setActiveSegments(8);
            }, 1700);

            const t4 = setTimeout(() => {
                setScene('portal');
                setPortalProgress(100);
                setTimeout(() => {
                    setScene('complete');
                    setIsUnmounted(true);
                    onComplete?.();
                }, 350);
            }, 2200);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
                clearTimeout(t4);
            };
        }

        // ====================================================
        // FULL CINEMATIC CHOREOGRAPHY (7–8.5 seconds total)
        // ====================================================

        // Scene 01 -> Scene 02: Emergence at 1800ms
        const tEmergence = setTimeout(() => {
            setScene('emergence');
            setStatusLabel('CELESTIAL PHENOMENON DETECTED');
            setActiveSegments(2);
        }, 1800);

        // Scene 02 -> Scene 03: Transmission at 3800ms
        const tTransmission = setTimeout(() => {
            setScene('transmission');
            setStatusLabel('INTERCEPTING TRANSMISSION');
            setActiveSegments(4);
        }, 3800);

        // Scene 03 -> Scene 04: Identity Reveal at 5400ms
        const tIdentity = setTimeout(() => {
            setScene('identity');
            setStatusLabel('DECODING IDENTITY');
            setActiveSegments(6);

            // Animate monogram stroke resolve
            const strokeStart = performance.now();
            const strokeDuration = 800;
            const animateStroke = (now: number) => {
                const p = Math.min(1, (now - strokeStart) / strokeDuration);
                setMonogramStroke(p);
                if (p < 1) {
                    requestAnimationFrame(animateStroke);
                }
            };
            requestAnimationFrame(animateStroke);
        }, 5400);

        // Scene 04 -> Scene 05: Synchronisation at 7000ms
        const tSync = setTimeout(() => {
            setScene('synchronisation');
            setStatusLabel('SYNCHRONISING EXPERIENCE');
            setActiveSegments(7);
        }, 7000);

        return () => {
            clearTimeout(tEmergence);
            clearTimeout(tTransmission);
            clearTimeout(tIdentity);
            clearTimeout(tSync);
        };
    }, [reducedMotion, onComplete]);

    // Handle transition from Scene 05 (Synchronisation) to Scene 06 (Portal) when App is Ready
    useEffect(() => {
        if (reducedMotion) return;

        if (scene === 'synchronisation') {
            setStatusLabel('TRANSMISSION COMPLETE');
            setActiveSegments(8);

            // Wait a minimum graceful beat for the user to absorb the completed synchronisation (1000ms),
            // or as soon as isAppReady is verified
            const proceedToPortal = () => {
                setScene('portal');

                const startTime = performance.now();
                const portalDuration = 700; // 700ms majestic radial portal expansion

                const animatePortal = (now: number) => {
                    const elapsed = now - startTime;
                    const p = Math.min(1, elapsed / portalDuration);
                    // Quintic ease out for a cinematic, breath-taking expansion
                    const eased = 1 - Math.pow(1 - p, 4);
                    setPortalProgress(eased * 100);

                    if (p < 1) {
                        requestAnimationFrame(animatePortal);
                    } else {
                        setScene('complete');
                        setIsUnmounted(true);
                        onComplete?.();
                    }
                };

                requestAnimationFrame(animatePortal);
            };

            const portalTimer = setTimeout(proceedToPortal, isAppReady ? 900 : 1600);
            return () => clearTimeout(portalTimer);
        }
    }, [scene, isAppReady, reducedMotion, onComplete]);

    // 4. High-Performance Canvas Rendering (Procedural Space, Anomaly, Monolith, Laser Beam)
    useEffect(() => {
        if (isUnmounted || scene === 'complete') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        let dpr = 1;

        const resize = () => {
            if (!canvas) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener('resize', resize);

        // Pre-compute multi-depth star coordinates (3 layers of depth)
        const starLayers: { x: number; y: number; r: number; alpha: number; pulseSpeed: number; depth: number }[] = [];
        for (let i = 0; i < 54; i++) {
            const depth = (i % 3) + 1; // 1: distant, 2: mid, 3: foreground
            starLayers.push({
                x: ((i * 197.3) % 100) / 100,
                y: ((i * 311.9) % 100) / 100,
                r: Math.max(0.4, (0.4 * depth)),
                alpha: 0.12 * depth,
                pulseSpeed: 0.0008 + (i % 5) * 0.0004,
                depth,
            });
        }

        // Pre-compute nebulous cloud clusters
        const nebulae = [
            { x: 0.25, y: 0.35, r: 240, color: 'rgba(23, 60, 50, 0.09)' },
            { x: 0.75, y: 0.65, r: 320, color: 'rgba(23, 60, 50, 0.07)' },
            { x: 0.85, y: 0.2, r: 200, color: 'rgba(241, 90, 36, 0.035)' },
        ];

        const startTime = performance.now();

        const render = (now: number) => {
            const elapsed = now - startTime;
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            // Deep Void Base (#141712)
            ctx.fillStyle = '#141712';
            ctx.fillRect(0, 0, width, height);

            // ==========================================
            // LAYER 1: DRIFTING NEBULOUS FOREST CLOUDS
            // ==========================================
            nebulae.forEach((n, idx) => {
                const shiftX = Math.sin(elapsed * 0.0003 + idx) * 30;
                const shiftY = Math.cos(elapsed * 0.0002 + idx) * 20;
                const nx = n.x * width + shiftX;
                const ny = n.y * height + shiftY;
                const radius = Math.max(10, n.r);

                const grad = ctx.createRadialGradient(nx, ny, 10, nx, ny, radius);
                grad.addColorStop(0, n.color);
                grad.addColorStop(1, 'rgba(20, 23, 18, 0)');

                ctx.beginPath();
                ctx.arc(nx, ny, radius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            });

            // ==========================================
            // LAYER 2: MULTI-DEPTH STARS
            // ==========================================
            starLayers.forEach((s, idx) => {
                // Subtle parallax drift
                const drift = (elapsed * 0.003 * s.depth) % height;
                const sx = s.x * width;
                const sy = (s.y * height + drift) % height;

                const twinkle = Math.sin(elapsed * s.pulseSpeed + idx) * 0.15;
                const alpha = Math.max(0.04, Math.min(0.7, s.alpha + twinkle));

                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0.4, s.r), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(242, 239, 230, ${alpha})`;
                ctx.fill();
            });

            // ====================================================
            // SCENE 01: THE UNUSUAL OFF-CENTER SIGNAL & RIPPLE
            // ====================================================
            if (scene === 'void') {
                // Off-center coordinate for signal genesis (upper-right quadrant)
                const signalX = cx + Math.min(width * 0.22, 260);
                const signalY = cy - Math.min(height * 0.18, 160);

                // Flickering behavior: appears, dims, returns with power
                let signalAlpha = 0;
                if (elapsed > 400 && elapsed < 850) {
                    signalAlpha = Math.sin((elapsed - 400) * 0.008) * 0.8;
                } else if (elapsed >= 950) {
                    signalAlpha = Math.min(1, (elapsed - 950) * 0.003);
                }

                if (signalAlpha > 0) {
                    // Central bright orange point
                    ctx.beginPath();
                    ctx.arc(signalX, signalY, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(241, 90, 36, ${signalAlpha})`;
                    ctx.shadowColor = '#F15A24';
                    ctx.shadowBlur = 12;
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Expanding wave pulse traveling through darkness
                    if (elapsed >= 1100) {
                        const waveProgress = ((elapsed - 1100) % 900) / 900;
                        const waveR = Math.max(1, waveProgress * 220);
                        const waveA = Math.max(0, (1 - waveProgress) * 0.5 * signalAlpha);

                        ctx.beginPath();
                        ctx.arc(signalX, signalY, waveR, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(241, 90, 36, ${waveA})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        // Coordinate ticks around the signal
                        ctx.strokeStyle = `rgba(213, 243, 74, ${waveA * 0.8})`;
                        ctx.beginPath();
                        ctx.moveTo(signalX - 10, signalY);
                        ctx.lineTo(signalX + 10, signalY);
                        ctx.moveTo(signalX, signalY - 10);
                        ctx.lineTo(signalX, signalY + 10);
                        ctx.stroke();
                    }
                }
            }

            // ====================================================
            // SCENE 02: SOMETHING EMERGES — MASSIVE SCULPTURAL BODY
            // ====================================================
            if (scene === 'emergence' || scene === 'transmission') {
                const emergenceProgress = Math.min(1, Math.max(0, (elapsed - 1800) / 1600));
                // Massive celestial structure positioned partially off-screen on the right
                const monolithX = cx + Math.min(width * 0.28, 380) * emergenceProgress;
                const monolithY = cy - 40 + Math.sin(elapsed * 0.0006) * 15;
                const monolithRadius = Math.max(10, Math.min(width * 0.32, 280));

                ctx.save();
                ctx.translate(monolithX, monolithY);
                ctx.rotate(elapsed * 0.0003);

                // Deep charcoal/ink core with forest-green ambient reflections
                const coreGrad = ctx.createRadialGradient(
                    -monolithRadius * 0.3,
                    -monolithRadius * 0.3,
                    10,
                    0,
                    0,
                    monolithRadius,
                );
                coreGrad.addColorStop(0, '#173C32'); // forest green reflection
                coreGrad.addColorStop(0.4, '#10140F');
                coreGrad.addColorStop(1, '#090B08'); // deep dark shadow

                ctx.beginPath();
                ctx.arc(0, 0, monolithRadius, 0, Math.PI * 2);
                ctx.fillStyle = coreGrad;
                ctx.fill();

                // Procedural faceted contours traversing the structure
                ctx.strokeStyle = 'rgba(242, 239, 230, 0.12)';
                ctx.lineWidth = 1;
                for (let c = 1; c <= 4; c++) {
                    const contourR = Math.max(5, (monolithRadius / 5) * c);
                    ctx.beginPath();
                    ctx.arc(0, 0, contourR, 0, Math.PI * 1.6);
                    ctx.stroke();
                }

                // Thin intense orange energy boundary catching light
                ctx.beginPath();
                ctx.arc(0, 0, monolithRadius, -Math.PI * 0.6, Math.PI * 0.4);
                ctx.strokeStyle = '#F15A24';
                ctx.lineWidth = 2.5;
                ctx.shadowColor = '#F15A24';
                ctx.shadowBlur = 18;
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Acid lime telemetry vertices (#D5F34A)
                for (let k = 0; k < 4; k++) {
                    const angle = (k * Math.PI) / 2 + elapsed * 0.0005;
                    const vx = Math.cos(angle) * (monolithRadius + 14);
                    const vy = Math.sin(angle) * (monolithRadius + 14);

                    ctx.fillStyle = '#D5F34A';
                    ctx.beginPath();
                    ctx.arc(vx, vy, 2.5, 0, Math.PI * 2);
                    ctx.fill();

                    // Vertex bracket
                    ctx.strokeStyle = 'rgba(213, 243, 74, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(vx - 4, vy - 4, 8, 8);
                }

                ctx.restore();
            }

            // ====================================================
            // SCENE 03: THE TRANSMISSION — NARROW SWEEPING LASER BEAM
            // ====================================================
            if (scene === 'transmission') {
                const transTime = elapsed - 3800;
                const beamSweepAngle = (transTime * 0.0016) % (Math.PI * 2);

                ctx.save();
                ctx.translate(cx, cy);

                // Laser transmission beam shooting across the canvas
                const beamLength = Math.max(width, height) * 1.2;
                const beamX = Math.cos(beamSweepAngle) * beamLength;
                const beamY = Math.sin(beamSweepAngle) * beamLength;

                const beamGrad = ctx.createLinearGradient(0, 0, beamX, beamY);
                beamGrad.addColorStop(0, '#FFFFFF');
                beamGrad.addColorStop(0.2, '#F15A24');
                beamGrad.addColorStop(1, 'rgba(241, 90, 36, 0)');

                ctx.strokeStyle = beamGrad;
                ctx.lineWidth = 2;
                ctx.shadowColor = '#F15A24';
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.moveTo(-beamX * 0.3, -beamY * 0.3);
                ctx.lineTo(beamX, beamY);
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Concentric decoding arcs lit by the transmission
                const numArcs = 3;
                for (let a = 1; a <= numArcs; a++) {
                    const arcR = a * 65;
                    ctx.strokeStyle = `rgba(242, 239, 230, ${0.25 - a * 0.05})`;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([12 * a, 8 * a, 24 * a, 12 * a]);
                    ctx.beginPath();
                    ctx.arc(0, 0, Math.max(10, arcR), 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.setLineDash([]);

                // Fragmented pulse waves spreading through the space
                const pulseR = Math.max(10, (transTime % 1000) * 0.35);
                const pulseA = Math.max(0, 1 - (transTime % 1000) / 1000) * 0.4;
                ctx.strokeStyle = `rgba(213, 243, 74, ${pulseA})`;
                ctx.beginPath();
                ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // ====================================================
            // SCENE 04 & 05: CONVERGENCE & STABILISATION
            // ====================================================
            if (scene === 'identity' || scene === 'synchronisation') {
                ctx.save();
                ctx.translate(cx, cy);

                // Harmonic precision rings stabilizing around the identity
                const rot = elapsed * 0.0004;

                // Inner calibrated ring
                ctx.save();
                ctx.rotate(rot);
                ctx.strokeStyle = 'rgba(241, 90, 36, 0.35)';
                ctx.lineWidth = 1;
                ctx.setLineDash([32, 16, 64, 20]);
                ctx.beginPath();
                ctx.arc(0, 0, 120, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                // Outer delicate coordinate circle
                ctx.save();
                ctx.rotate(-rot * 0.8);
                ctx.strokeStyle = 'rgba(242, 239, 230, 0.15)';
                ctx.lineWidth = 0.75;
                ctx.setLineDash([6, 6]);
                ctx.beginPath();
                ctx.arc(0, 0, 155, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();

                // 4 Cardinal precision tick marks
                ctx.strokeStyle = '#F15A24';
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 4; i++) {
                    const angle = (i * Math.PI) / 2;
                    const x1 = Math.cos(angle) * 115;
                    const y1 = Math.sin(angle) * 115;
                    const x2 = Math.cos(angle) * 125;
                    const y2 = Math.sin(angle) * 125;

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }

                ctx.restore();
            }

            // ====================================================
            // SCENE 06: THE PORTAL EXPANSION
            // ====================================================
            if (scene === 'portal') {
                const maxPortalR = Math.hypot(width, height) * 0.8;
                const currentPortalR = Math.max(1, (portalProgress / 100) * maxPortalR);

                // Luminous orange shockwave ring expanding outward
                ctx.beginPath();
                ctx.arc(cx, cy, currentPortalR, 0, Math.PI * 2);
                ctx.strokeStyle = '#F15A24';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#F15A24';
                ctx.shadowBlur = 24;
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Faint secondary acid-lime trailing ring
                if (currentPortalR > 40) {
                    ctx.beginPath();
                    ctx.arc(cx, cy, Math.max(1, currentPortalR - 20), 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(213, 243, 74, 0.4)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [scene, isUnmounted, portalProgress]);

    if (isUnmounted || scene === 'complete') {
        return null;
    }

    // Expanding circular iris clip-path for Scene 06 (The Portal Opens)
    const overlayClipPath =
        scene === 'portal'
            ? {
                  clipPath: `circle(${Math.max(0, 100 - portalProgress)}% at 50% 50%)`,
                  transition: 'none',
              }
            : undefined;

    return (
        <aside
            role="status"
            aria-live="polite"
            aria-label="Monayem Azam cosmic transmission preloader"
            style={overlayClipPath}
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#141712] select-none pointer-events-auto overflow-hidden"
        >
            {/* Background Canvas: procedural deep void, stars, monolith, and laser transmission */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full pointer-events-none"
            />

            {/* Perimeter Telemetry Calipers */}
            <div className="pointer-events-none absolute top-6 sm:top-8 left-6 sm:left-10 font-mono text-[10px] tracking-widest text-[#F2EFE6]/40 uppercase flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>SIGNAL // FREQ: 1420.405 MHz</span>
                <span className="hidden sm:inline text-[var(--accent)] font-bold">
                    [RA 14h 29m // MONAYEM-01]
                </span>
            </div>

            <div className="pointer-events-none absolute top-6 sm:top-8 right-6 sm:left-auto sm:right-10 font-mono text-[10px] tracking-widest text-[#F2EFE6]/40 uppercase text-right">
                <span className="hidden sm:inline">COORDINATES: LAT 23°N 90°E // </span>
                <span className="text-[var(--accent)] font-bold">STAGE: {scene.toUpperCase()}</span>
            </div>

            {/* Corner Precision Marks */}
            <span className="pointer-events-none absolute bottom-6 left-6 font-mono text-xs font-bold text-[var(--primary)] opacity-40 select-none">
                +
            </span>
            <span className="pointer-events-none absolute bottom-6 right-6 font-mono text-xs font-bold text-[var(--primary)] opacity-40 select-none">
                +
            </span>

            {/* ====================================================
                SCENE 04 & 05: THE IDENTITY REVEAL
                ==================================================== */}
            {(scene === 'identity' || scene === 'synchronisation' || scene === 'portal') && (
                <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none transition-all duration-700">
                    {/* MA Monogram with SVG Contour & Laser Shimmer */}
                    <div className="relative flex items-center justify-center">
                        {/* Dominant MA Typography */}
                        <div
                            className="font-display text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#F2EFE6] transition-all duration-500"
                            style={{
                                opacity: scene === 'portal' ? 0.3 : 1,
                                transform: scene === 'portal' ? 'scale(0.85)' : 'scale(1)',
                                filter: 'drop-shadow(0 0 20px rgba(241, 90, 36, 0.4))',
                            }}
                        >
                            MA
                            <span className="text-[var(--primary)] font-normal">.</span>
                        </div>

                        {/* Traveling Horizontal Laser Scanline */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-[-24px] h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
                            style={{
                                top: `${monogramStroke * 100}%`,
                                opacity: monogramStroke < 1 ? 1 : 0.2,
                                transition: 'top 0.8s ease-out',
                            }}
                        />
                    </div>

                    {/* Monayem Azam — Editorial Name & Title */}
                    <div className="mt-4 flex flex-col items-center text-center">
                        <span className="font-display text-sm sm:text-base font-black uppercase tracking-[0.25em] text-[#F2EFE6]">
                            MONAYEM AZAM
                        </span>
                        <span className="mt-1 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#DED8CB]/80">
                            FULL-STACK WEB DEVELOPER
                        </span>
                    </div>
                </div>
            )}

            {/* ====================================================
                SCENE 05: SYSTEM SYNCHRONISATION HUD
                ==================================================== */}
            <div className="absolute bottom-12 sm:bottom-16 z-10 flex flex-col items-center gap-3.5 pointer-events-none">
                {/* Precision Segmented Telemetry Indicator (8 cells) */}
                <div
                    className="flex items-center gap-1.5"
                    role="progressbar"
                    aria-valuenow={activeSegments}
                    aria-valuemin={1}
                    aria-valuemax={8}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                        <div
                            key={cell}
                            className={`h-1 w-4 sm:w-6 rounded-xs transition-all duration-500 ${
                                cell <= activeSegments
                                    ? 'bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]'
                                    : 'bg-[#F2EFE6]/15'
                            }`}
                        />
                    ))}
                </div>

                {/* Status Message */}
                <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#F2EFE6]/80">
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
                    <span>{statusLabel}</span>
                </div>
            </div>
        </aside>
    );
}
