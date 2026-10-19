import React, { useEffect, useRef, useState } from 'react';

interface CometCursorProps {
    enabled?: boolean;
}

interface Point {
    x: number;
    y: number;
}

export default function CometCursor({ enabled = true }: CometCursorProps) {
    const [isPointerFine, setIsPointerFine] = useState(false);
    const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);
    const mousePos = useRef<Point>({ x: -100, y: -100 });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Verify fine-pointer desktop mouse device
        const fineQuery = window.matchMedia('(pointer: fine)');
        setIsPointerFine(fineQuery.matches);

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsPointerFine(e.matches);
        };
        fineQuery.addEventListener('change', handleMediaChange);

        return () => fineQuery.removeEventListener('change', handleMediaChange);
    }, []);

    useEffect(() => {
        if (!enabled || !isPointerFine) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (!isVisible) setIsVisible(true);

            // Check if hovering interactive element
            const target = e.target as HTMLElement | null;
            if (target) {
                const isInteractive = Boolean(
                    target.closest(
                        'a, button, [role="button"], input, textarea, select, .interactive',
                    ),
                );
                setIsHoveringInteractive(isInteractive);
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', handleMouseMove, {
            passive: true,
        });
        document.addEventListener('mouseleave', handleMouseLeave);

        let animationFrameId: number;
        const maxTrailPoints = 14;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            if (isVisible) {
                // Add current mouse point
                pointsRef.current.push({ ...mousePos.current });
                if (pointsRef.current.length > maxTrailPoints) {
                    pointsRef.current.shift();
                }

                // Draw comet particle trail
                const points = pointsRef.current;
                for (let i = 0; i < points.length; i++) {
                    const point = points[i];
                    const progress = i / points.length; // 0 (tail) to 1 (head)
                    const radius = isHoveringInteractive
                        ? progress * 6 + 1
                        : progress * 4 + 1;
                    const opacity = progress * 0.45;

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = i % 2 === 0 ? '#22d3ee' : '#7c3aed';
                    ctx.globalAlpha = opacity;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#22d3ee';
                    ctx.fill();
                }

                // Update leading cursor element position
                if (cursorRef.current) {
                    cursorRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enabled, isPointerFine, isVisible, isHoveringInteractive]);

    if (!enabled || !isPointerFine) {
        return null;
    }

    return (
        <aside
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[110] overflow-hidden"
        >
            {/* Comet Trail Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full"
            />

            {/* Leading Comet Orb */}
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 ease-out ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                } ${
                    isHoveringInteractive
                        ? 'h-6 w-6 border-2 border-[var(--secondary)] bg-[var(--secondary)]/20 shadow-[0_0_20px_var(--secondary)]'
                        : 'h-3 w-3 bg-[var(--secondary)] shadow-[0_0_12px_var(--secondary)]'
                }`}
            />
        </aside>
    );
}
