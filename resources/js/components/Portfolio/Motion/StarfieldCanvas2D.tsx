import React, { useEffect, useRef } from 'react';

interface StarfieldCanvas2DProps {
    isDark?: boolean;
}

interface Star2D {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    twinkleSpeed: number;
    color: string;
}

export default function StarfieldCanvas2D({
    isDark = true,
}: StarfieldCanvas2DProps) {
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
        };

        window.addEventListener('resize', handleResize);

        // Palette according to theme
        const starColors = isDark
            ? ['#ffffff', '#e2e8f0', '#22d3ee', '#7c3aed']
            : ['#6d28d9', '#0e7490', '#7c3aed', '#8b5cf6'];

        const numStars = Math.min(180, Math.floor((width * height) / 8000));
        const stars: Star2D[] = [];

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.2 + 0.05,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                color: starColors[
                    Math.floor(Math.random() * starColors.length)
                ],
            });
        }

        let isRunning = true;
        const handleVisibilityChange = () => {
            isRunning = !document.hidden;
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const render = () => {
            if (isRunning) {
                ctx.clearRect(0, 0, width, height);

                for (let i = 0; i < stars.length; i++) {
                    const star = stars[i];

                    // Slow drift upward
                    star.y -= star.speed;
                    if (star.y < 0) {
                        star.y = height;
                        star.x = Math.random() * width;
                    }

                    // Twinkle
                    star.opacity +=
                        Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
                    const clampedOpacity = Math.max(
                        0.15,
                        Math.min(0.95, star.opacity),
                    );

                    ctx.fillStyle = star.color;
                    ctx.globalAlpha = clampedOpacity;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.globalAlpha = 1.0;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
            style={{ backgroundColor: 'transparent' }}
        />
    );
}
