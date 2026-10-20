import React, { useEffect, useState } from 'react';

interface MonayemOSBootProps {
    onComplete?: () => void;
    reducedMotion?: boolean;
}

export default function MonayemOSBoot({
    onComplete,
    reducedMotion = false,
}: MonayemOSBootProps) {
    const [phase, setPhase] = useState<number>(0); // 0: init, 1: mark, 2: line, 3: typographic expand, 4: reveal/exit
    const [isVisible, setIsVisible] = useState(true);

    const handleSkip = () => {
        try {
            sessionStorage.setItem('monayem_os_boot_completed', '1');
        } catch {
            // ignore if storage disabled
        }
        setIsVisible(false);
        onComplete?.();
    };

    useEffect(() => {
        // Fast-path: Check if already booted in this session
        try {
            if (sessionStorage.getItem('monayem_os_boot_completed') === '1') {
                setIsVisible(false);
                onComplete?.();
                return;
            }
        } catch {
            // ignore
        }

        if (reducedMotion) {
            handleSkip();
            return;
        }

        // Listen for ESC key to skip instantly
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleSkip();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        // Sequence timeline (~1.6s total)
        // 0ms: Initial paper/ink backdrop
        // 150ms: Phase 1 - Bold MA. monogram enters
        const t1 = setTimeout(() => setPhase(1), 120);

        // 500ms: Phase 2 - Signal orange calibration line draws across
        const t2 = setTimeout(() => setPhase(2), 520);

        // 950ms: Phase 3 - Typographic composition expands through clipping mask
        const t3 = setTimeout(() => setPhase(3), 960);

        // 1450ms: Phase 4 - Shutter opens, transitioning into main OS
        const t4 = setTimeout(() => setPhase(4), 1450);

        // 1750ms: Complete and unmount
        const t5 = setTimeout(() => {
            try {
                sessionStorage.setItem('monayem_os_boot_completed', '1');
            } catch {
                // ignore
            }
            setIsVisible(false);
            onComplete?.();
        }, 1750);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
            clearTimeout(t5);
        };
    }, [reducedMotion, onComplete]);

    if (!isVisible) return null;

    return (
        <div
            role="region"
            aria-label="Monayem OS Boot Sequence"
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--text)] transition-opacity duration-300 select-none ${
                phase >= 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            {/* Architectural Caliper Corner Marks */}
            <span className="absolute top-6 left-6 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                + [SYS.00]
            </span>
            <span className="absolute top-6 right-6 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                [INIT_2026] +
            </span>
            <span className="absolute bottom-6 left-6 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                + [23°48'N]
            </span>
            <span className="absolute bottom-6 right-6 font-mono text-xs font-bold text-[var(--primary)] pointer-events-none">
                [90°24'E] +
            </span>

            {/* Skip Action Button */}
            <button
                type="button"
                onClick={handleSkip}
                className="absolute bottom-8 right-8 z-30 flex items-center gap-2 border border-border bg-surface px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-[var(--primary)] hover:text-foreground active:scale-95 shadow-xs"
                title="Press Escape to bypass opening sequence"
            >
                <span>SKIP BOOT</span>
                <span className="border border-border px-1 text-[10px] text-[var(--primary)]">ESC</span>
            </button>

            {/* Stage Container */}
            <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-8">
                {/* 1. Bold Typographic Mark `MA.` */}
                <div
                    className={`transition-all duration-500 ease-out transform ${
                        phase >= 1
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-4 scale-95'
                    }`}
                >
                    <div className="flex items-baseline gap-2">
                        <span className="font-display text-7xl sm:text-9xl font-black tracking-tighter text-foreground">
                            MA
                        </span>
                        <span className="h-4 w-4 sm:h-6 sm:w-6 bg-[var(--primary)] inline-block mb-2 animate-pulse" />
                    </div>
                </div>

                {/* 2. Signal-Orange Drawing Line */}
                <div className="relative w-full my-6 sm:my-8 h-1 overflow-hidden">
                    <div
                        className={`h-full bg-[var(--primary)] transition-all duration-500 ease-out ${
                            phase >= 2 ? 'w-full opacity-100' : 'w-0 opacity-0'
                        }`}
                        style={{
                            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    />
                </div>

                {/* 3. Typographic Composition Emerging via Clipping Mask */}
                <div
                    className={`overflow-hidden transition-all duration-600 ease-out ${
                        phase >= 3
                            ? 'max-h-48 opacity-100 translate-y-0'
                            : 'max-h-0 opacity-0 translate-y-6'
                    }`}
                >
                    <div className="text-center font-display text-xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                        <span>I MAKE</span>
                        <span className="mx-2 text-[var(--primary)]">·</span>
                        <span className="text-[var(--primary)]">THE DIGITAL</span>
                        <span className="mx-2 text-[var(--primary)]">·</span>
                        <span>FEEL REAL.</span>
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-3 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                        <span className="h-1.5 w-1.5 bg-[var(--accent)] inline-block" />
                        <span>MONAYEM OS // RUNTIME INITIALIZED</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
