import { useCallback, useEffect, useState } from 'react';

export type AnimationLevel = 'full' | 'light' | 'off';

interface UseMotionLevelOptions {
    adminLevel?: AnimationLevel;
}

export function useMotionLevel({
    adminLevel = 'full',
}: UseMotionLevelOptions = {}) {
    // Visitor's local reduce effects toggle preference
    const [reduceEffects, setReduceEffectsState] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('reduce_effects');
            if (saved !== null) {
                return saved === 'true';
            }
        } catch {
            // LocalStorage inaccessible
        }
        return false;
    });

    // OS prefers-reduced-motion
    const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
        () => {
            if (typeof window !== 'undefined' && window.matchMedia) {
                return (
                    window.matchMedia('(prefers-color-scheme: reduce)')
                        .matches ||
                    window.matchMedia('(prefers-reduced-motion: reduce)')
                        .matches
                );
            }
            return false;
        },
    );

    // Detect low-power / weak devices
    const [isWeakDevice] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const nav = window.navigator as {
                hardwareConcurrency?: number;
                deviceMemory?: number;
            };
            const lowCores = nav.hardwareConcurrency
                ? nav.hardwareConcurrency <= 4
                : false;
            const lowMemory = nav.deviceMemory ? nav.deviceMemory < 4 : false;
            return lowCores || lowMemory;
        }
        return false;
    });

    // Listen to OS prefers-reduced-motion changes
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;

        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e: MediaQueryListEvent) =>
            setPrefersReducedMotion(e.matches);

        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
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
