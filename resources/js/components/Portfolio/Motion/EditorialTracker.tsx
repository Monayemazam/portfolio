import React, { useEffect, useState } from 'react';

interface EditorialTrackerProps {
    enabled?: boolean;
}

export default function EditorialTracker({ enabled = true }: EditorialTrackerProps) {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [targetTag, setTargetTag] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!enabled) return;
        // Check for touch or coarse pointer
        if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
            if (!visible) setVisible(true);

            // Check if hovering over interactive element
            const target = e.target as HTMLElement | null;
            if (target) {
                const clickable = target.closest('a, button, [role="button"], input, textarea, .exhibit-card');
                if (clickable) {
                    const tag = clickable.getAttribute('data-field-tag') ||
                                (clickable.tagName === 'A' ? 'LINK' :
                                 clickable.tagName === 'BUTTON' ? 'ACTION' :
                                 clickable.classList.contains('exhibit-card') ? 'EXHIBIT' : 'INPUT');
                    setTargetTag(tag);
                } else {
                    setTargetTag(null);
                }
            }
        };

        const handleMouseLeave = () => setVisible(false);

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enabled, visible]);

    if (!enabled || !visible) return null;

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-100 overflow-hidden"
        >
            {/* Fine drafting crosshair lines */}
            <div
                className="absolute top-0 bottom-0 w-px bg-foreground/10 transition-transform duration-75"
                style={{ transform: `translateX(${pos.x}px)` }}
            />
            <div
                className="absolute left-0 right-0 h-px bg-foreground/10 transition-transform duration-75"
                style={{ transform: `translateY(${pos.y}px)` }}
            />

            {/* Pointer indicator / framing bracket */}
            <div
                className="absolute transition-transform duration-75 ease-out"
                style={{
                    transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                }}
            >
                {targetTag ? (
                    <div className="relative -top-3 -left-3 flex items-center gap-2">
                        <div className="h-6 w-6 border-2 border-[var(--primary)] bg-[var(--primary)]/10" />
                        <div className="bg-[var(--primary)] px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-white shadow-xs uppercase">
                            [{targetTag}]
                        </div>
                    </div>
                ) : (
                    <div className="relative top-3 left-3 flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-muted-foreground uppercase opacity-75">
                        <span className="text-[var(--primary)]">+</span>
                        <span>
                            {Math.round(pos.x).toString().padStart(4, '0')}.
                            {Math.round(pos.y).toString().padStart(4, '0')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
