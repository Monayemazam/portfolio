import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseSmoothScrollOptions {
    enabled?: boolean;
    lerp?: number;
}

export function useSmoothScroll({
    enabled = true,
    lerp = 0.1,
}: UseSmoothScrollOptions = {}) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (!enabled) {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
            return;
        }

        const lenis = new Lenis({
            lerp,
            smoothWheel: true,
            syncTouch: false,
        });

        lenisRef.current = lenis;

        // Connect Lenis with GSAP ScrollTrigger
        lenis.on('scroll', () => ScrollTrigger.update());

        let animationFrameId: number;

        function raf(time: number) {
            lenis.raf(time);
            animationFrameId = requestAnimationFrame(raf);
        }

        animationFrameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(animationFrameId);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [enabled, lerp]);

    return lenisRef;
}
