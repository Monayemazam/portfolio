import React, { useEffect, useRef } from 'react';

interface CosmicCanvasSceneProps {
    isDark?: boolean;
    isReducedMotion?: boolean;
}

interface Particle {
    x: number;
    y: number;
    z: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
}

export default function CosmicCanvasScene({
    isDark = true,
    isReducedMotion = false,
}: CosmicCanvasSceneProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', handleResize);

        // Interactive pointer tracking with smooth lerp
        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = mouseX;
        let targetMouseY = mouseY;

        const handlePointerMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
        };
        window.addEventListener('mousemove', handlePointerMove, { passive: true });

        // Deterministic particle generation
        const particleCount = isReducedMotion ? 40 : 120;
        const particles: Particle[] = [];

        const colors = isDark
            ? [
                  'rgba(242, 239, 230, 0.8)', // Warm off-white
                  'rgba(241, 90, 36, 0.75)',  // Signal orange
                  'rgba(213, 243, 74, 0.7)',   // Acid lime
                  'rgba(222, 216, 203, 0.6)',  // Pale sand
                  'rgba(23, 60, 50, 0.85)',   // Deep forest
              ]
            : [
                  'rgba(23, 25, 20, 0.7)',
                  'rgba(241, 90, 36, 0.65)',
                  'rgba(23, 60, 50, 0.7)',
                  'rgba(140, 130, 115, 0.5)',
              ];

        for (let i = 0; i < particleCount; i++) {
            const z = Math.random() * 0.85 + 0.15; // 0.15 (far) to 1.0 (near)
            const x = Math.random() * width;
            const y = Math.random() * height;
            particles.push({
                x,
                y,
                z,
                baseX: x,
                baseY: y,
                vx: (Math.random() - 0.5) * 0.3 * z,
                vy: (Math.random() - 0.5) * 0.3 * z,
                size: (Math.random() * 2 + 0.8) * z,
                alpha: Math.random() * 0.6 + 0.2,
                color: colors[i % colors.length],
            });
        }

        // Draw loop
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth pointer lerp
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            const pointerDeltaX = (mouseX - width / 2) / (width / 2);
            const pointerDeltaY = (mouseY - height / 2) / (height / 2);

            // Draw ethereal cosmic landscape nebula glows
            const grad1 = ctx.createRadialGradient(
                width * 0.7 + pointerDeltaX * -40,
                height * 0.35 + pointerDeltaY * -40,
                40,
                width * 0.7,
                height * 0.35,
                width * 0.45
            );
            grad1.addColorStop(0, isDark ? 'rgba(23, 60, 50, 0.28)' : 'rgba(23, 60, 50, 0.12)');
            grad1.addColorStop(0.6, isDark ? 'rgba(241, 90, 36, 0.08)' : 'rgba(241, 90, 36, 0.04)');
            grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad1;
            ctx.fillRect(0, 0, width, height);

            // Draw and update celestial particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!isReducedMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Parallax depth shift based on mouse
                    const px = p.x + pointerDeltaX * p.z * 35;
                    const py = p.y + pointerDeltaY * p.z * 35;

                    // Wrap bounds
                    if (p.x < -20) p.x = width + 20;
                    if (p.x > width + 20) p.x = -20;
                    if (p.y < -20) p.y = height + 20;
                    if (p.y > height + 20) p.y = -20;

                    ctx.beginPath();
                    ctx.arc(px, py, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.baseX, p.baseY, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;

            if (!isReducedMotion) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handlePointerMove);
        };
    }, [isDark, isReducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
        />
    );
}
