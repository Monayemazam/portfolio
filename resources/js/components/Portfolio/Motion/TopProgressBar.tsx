import React, { useEffect, useRef } from 'react';

interface TopProgressBarProps {
    progress?: number;
}

export default function TopProgressBar({ progress }: TopProgressBarProps) {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // If progress is passed as a prop, apply directly
        if (typeof progress === 'number') {
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
            }
            return;
        }

        // Self-contained scroll tracking with RAF throttling to prevent root re-renders
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    const total = document.documentElement.scrollHeight - window.innerHeight;
                    const p = total > 0 ? window.scrollY / total : 0;
                    if (barRef.current) {
                        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
                    }
                    ticking = false;
                });
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [progress]);

    return (
        <aside
            aria-label="Celestial Traverse Progress"
            className="pointer-events-none fixed top-0 right-0 left-0 z-50 select-none"
        >
            <div className="h-[2px] w-full overflow-hidden bg-border/20">
                <div
                    ref={barRef}
                    className="h-full w-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] shadow-[0_0_8px_var(--primary)] origin-left will-change-transform"
                    style={{
                        transform: typeof progress === 'number' ? `scaleX(${progress})` : 'scaleX(0)',
                    }}
                />
            </div>
        </aside>
    );
}
