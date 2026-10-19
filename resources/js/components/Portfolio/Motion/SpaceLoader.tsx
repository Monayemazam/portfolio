import React, { useEffect, useState } from 'react';
import { Rocket5 } from '../Shared/Icons';

interface SpaceLoaderProps {
    onComplete?: () => void;
    reducedMotion?: boolean;
}

export default function SpaceLoader({
    onComplete,
    reducedMotion = false,
}: SpaceLoaderProps) {
    const [progress, setProgress] = useState(reducedMotion ? 100 : 0);
    const [isFading, setIsFading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Fast-path for reduced motion: never block the user
        if (reducedMotion) {
            const timeout = setTimeout(() => {
                setIsVisible(false);
                onComplete?.();
            }, 100);
            return () => clearTimeout(timeout);
        }

        const startTime = Date.now();
        const duration = 1400; // 1.4 seconds, strictly within the 1.2s to 2.0s spec

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const currentProgress = Math.min(
                100,
                Math.floor((elapsed / duration) * 100),
            );
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setIsFading(true);
                setTimeout(() => {
                    setIsVisible(false);
                    onComplete?.();
                }, 400); // 400ms fade transition
            }
        }, 30);

        // Safety hard limit: never hold the visitor longer than 2000ms
        const maxSafetyTimer = setTimeout(() => {
            clearInterval(interval);
            setProgress(100);
            setIsFading(true);
            setTimeout(() => {
                setIsVisible(false);
                onComplete?.();
            }, 200);
        }, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(maxSafetyTimer);
        };
    }, [reducedMotion, onComplete]);

    if (!isVisible) return null;

    // Rocket vertical offset based on percentage
    const rocketBottom = `${Math.min(85, Math.max(15, progress * 0.7 + 15))}%`;

    return (
        <div
            aria-label="Mission loading sequence"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)] transition-opacity duration-400 ${
                isFading ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
        >
            <div className="relative flex h-64 w-48 flex-col items-center justify-end">
                {/* Vertical Launch Trajectory Line */}
                <div className="absolute top-4 bottom-12 w-0.5 bg-gradient-to-t from-[var(--secondary)] via-[var(--primary)] to-transparent opacity-40" />

                {/* Ascending Rocket */}
                <div
                    className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center transition-all duration-75"
                    style={{ bottom: rocketBottom }}
                >
                    <div className="relative">
                        <Rocket5 className="h-8 w-8 animate-pulse text-[var(--accent)] drop-shadow-[0_0_12px_var(--accent)]" />
                        {/* Rocket flame/thrust */}
                        <div className="absolute -bottom-2 left-1/2 h-4 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-[var(--accent)] to-transparent blur-[1px]" />
                    </div>
                </div>

                {/* Counter & Telemetry Line */}
                <div className="relative z-10 flex flex-col items-center text-center">
                    <span className="font-display text-4xl font-extrabold tracking-wider text-[var(--text)]">
                        {progress}
                        <span className="text-xl text-[var(--secondary)]">
                            %
                        </span>
                    </span>
                    <span className="mt-2 font-mono text-xs font-semibold tracking-[0.2em] text-[var(--secondary)] uppercase">
                        {progress < 100
                            ? 'PRE-FLIGHT SYSTEMS CHECK'
                            : 'ALL SYSTEMS GO'}
                    </span>
                </div>
            </div>
        </div>
    );
}
