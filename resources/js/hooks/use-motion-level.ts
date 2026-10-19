import { useCallback, useEffect, useState } from 'react';

export type AnimationLevel = 'full' | 'light' | 'off';

interface UseMotionLevelOptions {
    adminLevel?: AnimationLevel;
}

export function useMotionLevel({
    adminLevel = 'full',
}: UseMotionLevelOptions = {}) {
    // Visitor's local reduce effects toggle preference
    const [reduceEffects, setReduceEffectsState] = useState<boolean>(false);
    const [prefersReducedMotion, setPrefersReducedMotion] =
        useState<boolean>(false);
    const [isWeakDevice, setIsWeakDevice] = useState<boolean>(false);

    useEffect(() => {
        // Safe client initialization after hydration
        try {
            const saved = localStorage.getItem('reduce_effects');
            if (saved !== null) {
                setReduceEffectsState(saved === 'true');
            }
        } catch {
            // LocalStorage inaccessible
        }

        if (typeof window !== 'undefined' && window.matchMedia) {
            const media = window.matchMedia('(prefers-reduced-motion: reduce)');
            setPrefersReducedMotion(media.matches);

            const handler = (e: MediaQueryListEvent) =>
                setPrefersReducedMotion(e.matches);
            media.addEventListener('change', handler);
            return () => media.removeEventListener('change', handler);
        }

        const nav = window.navigator as {
            hardwareConcurrency?: number;
            deviceMemory?: number;
        };
        const lowCores = nav.hardwareConcurrency
            ? nav.hardwareConcurrency <= 2
            : false;
        const lowMemory = nav.deviceMemory ? nav.deviceMemory < 4 : false;
        if (lowCores || lowMemory) {
            setIsWeakDevice(true);
        }
    }, []);

    const toggleReduceEffects = useCallback(() => {
        setReduceEffectsState((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('reduce_effects', String(next));
            } catch {
                // Ignore storage errors
            }
            return next;
        });
    }, []);

    // Calculate effective level
    let effectiveLevel: AnimationLevel = adminLevel;

    // Hard overrides: prefers-reduced-motion or user explicitly reduced effects
    if (prefersReducedMotion || reduceEffects || adminLevel === 'off') {
        effectiveLevel = 'off';
    } else if (adminLevel === 'light' || isWeakDevice) {
        effectiveLevel = 'light';
    } else {
        effectiveLevel = 'full';
    }

    return {
        adminLevel,
        effectiveLevel,
        reduceEffects,
        prefersReducedMotion,
        isWeakDevice,
        isFull: effectiveLevel === 'full',
        isLight: effectiveLevel === 'light',
        isOff: effectiveLevel === 'off',
        toggleReduceEffects,
    };
}
