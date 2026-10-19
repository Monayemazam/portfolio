import React, { useEffect, useRef, useState } from 'react';

interface ParticleNameProps {
    name: string;
    isFull?: boolean;
    isDark?: boolean;
    className?: string;
}

interface Particle {
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    size: number;
    color: string;
    delay: number;
}

export default function ParticleName({
    name,
    isFull = true,
    isDark = true,
    className = '',
}: ParticleNameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [useFallback, setUseFallback] = useState(false);

    useEffect(() => {
        // Fallback conditions: not full effects, mobile screen (< 768px), or reduced motion
        const prefersReduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile =
            typeof window !== 'undefined' && window.innerWidth < 768;

        if (!isFull || prefersReduced || isMobile) {
            setUseFallback(true);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setUseFallback(true);
            return;
        }

        let animationFrameId: number;
        let isCancelled = false;

        // Obtain CSS color tokens from document root
        const rootStyles = getComputedStyle(document.documentElement);
        const primaryColor =
            rootStyles.getPropertyValue('--primary').trim() ||
            (isDark ? '#7c3aed' : '#6d28d9');
        const secondaryColor =
            rootStyles.getPropertyValue('--secondary').trim() ||
            (isDark ? '#22d3ee' : '#0e7490');
        const starWhite = isDark
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(30, 27, 75, 0.9)';

        const colorPalette = [
            secondaryColor,
            secondaryColor,
            primaryColor,
            starWhite,
        ];

        // Ensure display font is ready before measurement
        const initParticles = async () => {
            if (document.fonts) {
                await document.fonts.ready;
            }
            if (isCancelled) return;

            // Dimensions matching hero container
            const containerWidth = Math.min(
                window.innerWidth - 48,
                canvas.parentElement?.clientWidth || 960,
            );
            const containerHeight = 160;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = containerWidth * dpr;
            canvas.height = containerHeight * dpr;
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${containerHeight}px`;

            ctx.scale(dpr, dpr);

            // Responsive font size
            const fontSize = Math.max(
                36,
                Math.min(78, Math.floor(containerWidth / (name.length * 0.72))),
            );

            // Offscreen canvas for pixel sampling
            const offscreen = document.createElement('canvas');
            offscreen.width = containerWidth;
            offscreen.height = containerHeight;
            const offCtx = offscreen.getContext('2d');
            if (!offCtx) {
                setUseFallback(true);
                return;
            }

            offCtx.fillStyle = '#ffffff';
            offCtx.font = `900 ${fontSize}px "Orbitron", sans-serif`;
            offCtx.textAlign = 'center';
            offCtx.textBaseline = 'middle';
            offCtx.fillText(
                name.toUpperCase(),
                containerWidth / 2,
                containerHeight / 2,
            );

            const imgData = offCtx.getImageData(
                0,
                0,
                containerWidth,
                containerHeight,
            ).data;
            const particles: Particle[] = [];
            const step = containerWidth > 800 ? 4 : 3;

            for (let y = 0; y < containerHeight; y += step) {
                for (let x = 0; x < containerWidth; x += step) {
                    const idx = (y * containerWidth + x) * 4 + 3;
                    if (imgData[idx] > 140) {
                        const targetX = x;
                        const targetY = y;
                        // Scattered initial position across space
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 150 + Math.random() * 450;
                        const startX = targetX + Math.cos(angle) * distance;
                        const startY = targetY + Math.sin(angle) * distance;

                        particles.push({
                            startX,
                            startY,
                            targetX,
                            targetY,
                            size: Math.random() * 1.8 + 1.2,
                            color: colorPalette[
                                Math.floor(Math.random() * colorPalette.length)
                            ],
                            delay: Math.random() * 0.35,
                        });
                    }
                }
            }

            if (particles.length === 0) {
                setUseFallback(true);
                return;
            }

            const startTime = performance.now();
            const totalDuration = 2200; // 2.2s total hero entrance
            const moveDuration = 1800; // 1.8s individual particle travel

            const render = (now: number) => {
                if (isCancelled) return;

                const elapsed = now - startTime;
                ctx.clearRect(0, 0, containerWidth, containerHeight);

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    const pElapsed = elapsed - p.delay * 1000;
                    const progress = Math.max(
                        0,
                        Math.min(1, pElapsed / moveDuration),
                    );

                    // Cubic ease-out: 1 - (1 - t)^3
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const currX = p.startX + (p.targetX - p.startX) * ease;
                    const currY = p.startY + (p.targetY - p.startY) * ease;

                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (elapsed < totalDuration) {
                    animationFrameId = requestAnimationFrame(render);
                } else {
                    setIsComplete(true);
                }
            };

            animationFrameId = requestAnimationFrame(render);
        };

        void initParticles();

        return () => {
            isCancelled = true;
            cancelAnimationFrame(animationFrameId);
        };
    }, [name, isFull, isDark]);

    if (useFallback) {
        return (
            <h1
                className={`text-gradient max-w-5xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] font-extrabold tracking-[0.02em] uppercase transition-opacity duration-700 ease-out ${className}`}
            >
                {name}
            </h1>
        );
    }

    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            role="heading"
            aria-level={1}
            aria-label={name}
        >
            {/* Screen-reader accessible label */}
            <span className="sr-only">{name}</span>

            {/* Particle Assembly Canvas (2.2s animation) */}
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className={`transition-opacity duration-500 ${
                    isComplete ? 'opacity-0' : 'opacity-100'
                }`}
            />

            {/* Crisp Typography Overlay seamlessly revealed upon assembly completion */}
            <h1
                aria-hidden="true"
                className={`text-gradient absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] font-extrabold tracking-[0.02em] uppercase transition-opacity duration-500 select-none ${
                    isComplete ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            >
                {name}
            </h1>
        </div>
    );
}
