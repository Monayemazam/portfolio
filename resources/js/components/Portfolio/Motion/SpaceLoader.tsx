import React, { useEffect, useState } from 'react';

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
            }, 50);
            return () => clearTimeout(timeout);
        }

        const startTime = Date.now();
        const duration = 900; // Snappy 900ms editorial entrance

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
                }, 300);
            }
        }, 20);

        const maxSafetyTimer = setTimeout(() => {
            clearInterval(interval);
            setProgress(100);
            setIsFading(true);
            setTimeout(() => {
                setIsVisible(false);
                onComplete?.();
            }, 150);
        }, 1500);

        return () => {
            clearInterval(interval);
            clearTimeout(maxSafetyTimer);
        };
    }, [reducedMotion, onComplete]);

    if (!isVisible) return null;

    return (
        <div
            aria-label="Editorial publication initialization"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)] transition-opacity duration-300 ${
                isFading ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
        >
            {/* Architectural Registration Caliper Box */}
            <div className="relative flex w-[320px] sm:w-[380px] flex-col border-2 border-foreground bg-surface p-6 sm:p-8 shadow-sm">
                {/* Corner Hairline Registration Marks */}
                <span className="absolute -top-3 -left-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                    +
                </span>
                <span className="absolute -top-3 -right-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                    +
                </span>
                <span className="absolute -bottom-3 -left-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                    +
                </span>
                <span className="absolute -bottom-3 -right-3 font-mono text-base font-bold text-[var(--primary)] select-none">
                    +
                </span>

                {/* Top Masthead Strip */}
                <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <span className="h-1.5 w-1.5 bg-[var(--primary)] inline-block" />
                        MONAYEM AZAM
                    </span>
                    <span>VOL. 26</span>
                </div>

                {/* Main Typographic Monogram & Counter */}
                <div className="my-6 flex items-baseline justify-between">
                    <div>
                        <span className="font-mono text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                            INITIALIZING //
                        </span>
                        <div className="font-display text-2xl font-black uppercase text-foreground tracking-tight">
                            DIGITAL FIELD NOTES
                        </div>
                    </div>
                    <div className="font-mono text-3xl font-black text-foreground">
                        {progress.toString().padStart(2, '0')}
                        <span className="text-sm font-bold text-[var(--primary)]">%</span>
                    </div>
                </div>

                {/* Editorial Progress Bar */}
                <div className="relative h-2 w-full overflow-hidden border border-foreground bg-background">
                    <div
                        className="h-full bg-[var(--primary)] transition-all duration-75 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Bottom Status Text */}
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    <span>STATUS: {progress < 100 ? 'COMPILING CATALOGUE' : 'ARCHIVE READY'}</span>
                    <span>23°48'N · 90°24'E</span>
                </div>
            </div>
        </div>
    );
}
