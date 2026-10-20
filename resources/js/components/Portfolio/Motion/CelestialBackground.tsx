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

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        };

        window.addEventListener('resize', handleResize, { passive: true });

        // Deterministic starfield creation
        let stars: Star[] = [];
        const numStars = width < 768 ? 60 : 140;

        const initStars = () => {
            stars = [];
            // Seeded distribution
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
                    size: isBright ? 1.8 : 0.8 + (i % 3) * 0.4,
                    alpha: 0.2 + (i % 5) * 0.15,
                    twinkleSpeed: 0.008 + (i % 4) * 0.004,
                    twinkleOffset: i * 0.5,
                    color,
                });
            }
        };

        initStars();

        let scrollY = window.scrollY;
        const handleScroll = () => {
            scrollY = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        let time = 0;
        const render = () => {
            time += 0.015;
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Atmospheric Nebula Glows
            if (isDark) {
                // Top-right forest green deep nebula
                const grad1 = ctx.createRadialGradient(
                    width * 0.8,
                    height * 0.25,
                    50,
                    width * 0.8,
                    height * 0.25,
                    width * 0.55
                );
                grad1.addColorStop(0, 'rgba(23, 60, 50, 0.22)');
                grad1.addColorStop(0.5, 'rgba(23, 60, 50, 0.08)');
                grad1.addColorStop(1, 'rgba(20, 23, 18, 0)');
                ctx.fillStyle = grad1;
                ctx.fillRect(0, 0, width, height);

                // Mid-left subtle amber/orange stellar glow
                const grad2 = ctx.createRadialGradient(
                    width * 0.15,
                    height * 0.65,
                    40,
                    width * 0.15,
                    height * 0.65,
                    width * 0.45
                );
                grad2.addColorStop(0, 'rgba(241, 90, 36, 0.12)');
                grad2.addColorStop(0.6, 'rgba(23, 60, 50, 0.04)');
                grad2.addColorStop(1, 'rgba(20, 23, 18, 0)');
                ctx.fillStyle = grad2;
                ctx.fillRect(0, 0, width, height);
            } else {
                // Solar theme: soft warm daylight haze
                const gradSolar = ctx.createRadialGradient(
                    width * 0.75,
                    height * 0.3,
                    60,
                    width * 0.75,
                    height * 0.3,
                    width * 0.6
                );
                gradSolar.addColorStop(0, 'rgba(241, 90, 36, 0.08)');
                gradSolar.addColorStop(0.5, 'rgba(222, 216, 203, 0.2)');
                gradSolar.addColorStop(1, 'rgba(242, 239, 230, 0)');
                ctx.fillStyle = gradSolar;
                ctx.fillRect(0, 0, width, height);
            }

            // 2. Draw Stars with subtle twinkle and parallax
            const parallaxShift = (scrollY * 0.04) % height;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                let currentY = (star.y - parallaxShift + height) % height;

                const twinkle = isReducedMotion
                    ? 1
                    : Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.3 + 0.7;

                ctx.save();
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.alpha * twinkle;
                ctx.beginPath();
                ctx.arc(star.x, currentY, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Subtle halo for brighter stars
                if (star.size > 1.4 && isDark) {
                    ctx.globalAlpha = star.alpha * twinkle * 0.3;
                    ctx.beginPath();
                    ctx.arc(star.x, currentY, star.size * 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            if (!isReducedMotion) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isDark, isReducedMotion]);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            style={{ backgroundColor: 'var(--bg)' }}
        >
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </div>
    );
}
