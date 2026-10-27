import React, { useEffect, useRef } from 'react';

interface CelestialBackgroundProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

interface Star {
    x: number;
    y: number;
    size: number;
    alpha: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    color: string;
}

export default function CelestialBackground({
    isDark = true,
    isReducedMotion = false,
}: CelestialBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number | null = null;
        let isRunning = false;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Pre-rendered offscreen nebula canvas so full-screen gradients are computed once, not 60 times/sec
        let nebulaCanvas: HTMLCanvasElement | null = document.createElement('canvas');
        let nebulaCtx = nebulaCanvas.getContext('2d');

        const updateNebula = () => {
            if (!nebulaCanvas || !nebulaCtx) return;
            nebulaCanvas.width = width;
            nebulaCanvas.height = height;

            if (isDark) {
                // Top-right forest green deep nebula
                const grad1 = nebulaCtx.createRadialGradient(
                    width * 0.8,
                    height * 0.25,
                    50,
                    width * 0.8,
                    height * 0.25,
                    width * 0.55
                );
                grad1.addColorStop(0, 'rgba(23, 60, 50, 0.20)');
                grad1.addColorStop(0.5, 'rgba(23, 60, 50, 0.06)');
                grad1.addColorStop(1, 'rgba(20, 23, 18, 0)');
                nebulaCtx.fillStyle = grad1;
                nebulaCtx.fillRect(0, 0, width, height);

                // Mid-left subtle amber/orange stellar glow
                const grad2 = nebulaCtx.createRadialGradient(
                    width * 0.15,
                    height * 0.65,
                    40,
                    width * 0.15,
                    height * 0.65,
                    width * 0.45
                );
                grad2.addColorStop(0, 'rgba(241, 90, 36, 0.10)');
                grad2.addColorStop(0.6, 'rgba(23, 60, 50, 0.03)');
                grad2.addColorStop(1, 'rgba(20, 23, 18, 0)');
                nebulaCtx.fillStyle = grad2;
                nebulaCtx.fillRect(0, 0, width, height);
            } else {
                // Solar theme: soft warm daylight haze
                const gradSolar = nebulaCtx.createRadialGradient(
                    width * 0.75,
                    height * 0.3,
                    60,
                    width * 0.75,
                    height * 0.3,
                    width * 0.6
                );
                gradSolar.addColorStop(0, 'rgba(241, 90, 36, 0.06)');
                gradSolar.addColorStop(0.5, 'rgba(222, 216, 203, 0.16)');
                gradSolar.addColorStop(1, 'rgba(242, 239, 230, 0)');
                nebulaCtx.fillStyle = gradSolar;
                nebulaCtx.fillRect(0, 0, width, height);
            }
        };

        let stars: Star[] = [];
        const numStars = width < 768 ? 45 : 90;

        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                const seedX = (Math.sin(i * 997.3) * 0.5 + 0.5) * width;
                const seedY = (Math.cos(i * 613.7) * 0.5 + 0.5) * height;
                const isBright = i % 8 === 0;
                const isOrange = i % 15 === 0;
                const isLime = i % 25 === 0;

                const color = isDark
                    ? isOrange
                        ? '#F15A24'
                        : isLime
                        ? '#D5F34A'
                        : '#F2EFE6'
                    : isOrange
                    ? '#F15A24'
                    : '#173C32';

                stars.push({
                    x: seedX,
                    y: seedY,
                    size: isBright ? 1.6 : 0.8 + (i % 3) * 0.3,
                    alpha: 0.2 + (i % 5) * 0.12,
                    twinkleSpeed: 0.008 + (i % 4) * 0.004,
                    twinkleOffset: i * 0.5,
                    color,
                });
            }
        };

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            updateNebula();
            initStars();
        };

        window.addEventListener('resize', handleResize, { passive: true });
        updateNebula();
        initStars();

        let scrollY = window.scrollY;
        let tickingScroll = false;
        const handleScroll = () => {
            if (!tickingScroll) {
                tickingScroll = true;
                requestAnimationFrame(() => {
                    scrollY = window.scrollY;
                    tickingScroll = false;
                });
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        let time = 0;
        const render = () => {
            if (!isRunning) return;

            time += 0.015;
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Cached Pre-rendered Nebula
            if (nebulaCanvas) {
                ctx.drawImage(nebulaCanvas, 0, 0);
            }

            // 2. Draw Stars (Optimized without context save/restore state thrashing)
            const parallaxShift = (scrollY * 0.03) % height;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                let currentY = (star.y - parallaxShift + height) % height;

                const twinkle = isReducedMotion
                    ? 1
                    : Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.3 + 0.7;

                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.alpha * twinkle;
                ctx.beginPath();
                ctx.arc(star.x, currentY, star.size, 0, Math.PI * 2);
                ctx.fill();

                if (star.size > 1.4 && isDark) {
                    ctx.globalAlpha = star.alpha * twinkle * 0.25;
                    ctx.beginPath();
                    ctx.arc(star.x, currentY, star.size * 2.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1.0;

            if (!isReducedMotion) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        const startLoop = () => {
            if (isRunning || document.hidden) return;
            isRunning = true;
            render();
        };

        const stopLoop = () => {
            if (!isRunning) return;
            isRunning = false;
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopLoop();
            } else {
                startLoop();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        startLoop();

        return () => {
            stopLoop();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            nebulaCanvas = null;
            nebulaCtx = null;
        };
    }, [isDark, isReducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 h-full w-full select-none"
            style={{ zIndex: 0 }}
        />
    );
}
