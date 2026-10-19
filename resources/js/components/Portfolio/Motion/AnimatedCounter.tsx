import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    value: string;
    suffix?: string | null;
    isReducedMotion?: boolean;
    className?: string;
}

export default function AnimatedCounter({
    value,
    suffix,
    isReducedMotion = false,
    className = '',
}: AnimatedCounterProps) {
    const numericTarget = parseFloat(value);
    const isNumeric = !isNaN(numericTarget) && isFinite(numericTarget);

    const [count, setCount] = useState(
        isNumeric && !isReducedMotion ? 0 : numericTarget,
    );
    const containerRef = useRef<HTMLSpanElement>(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (!isNumeric || isReducedMotion || hasAnimatedRef.current) {
            setCount(numericTarget);
            return;
        }

        const el = containerRef.current;
        if (!el) return;

        let animationFrameId: number;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry && entry.isIntersecting && !hasAnimatedRef.current) {
                    hasAnimatedRef.current = true;
                    observer.disconnect();

                    const duration = 1400; // 1.4s count up
                    const startTime = performance.now();
                    const isDecimal = value.includes('.');
                    const decimalPlaces = isDecimal
                        ? value.split('.')[1]?.length || 1
                        : 0;

                    const step = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(1, elapsed / duration);
                        // Cubic ease-out
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const current = numericTarget * ease;

                        if (isDecimal) {
                            setCount(
                                parseFloat(current.toFixed(decimalPlaces)),
                            );
                        } else {
                            setCount(Math.round(current));
                        }

                        if (progress < 1) {
                            animationFrameId = requestAnimationFrame(step);
                        } else {
                            setCount(numericTarget);
                        }
                    };

                    animationFrameId = requestAnimationFrame(step);
                }
            },
            {
                threshold: 0.15,
            },
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [isNumeric, isReducedMotion, numericTarget, value]);

    if (!isNumeric) {
        return (
            <span ref={containerRef} className={className}>
                {value}
                {suffix && (
                    <span className="text-[var(--primary)]">{suffix}</span>
                )}
            </span>
        );
    }

    return (
        <span ref={containerRef} className={className}>
            {isReducedMotion ? value : count}
            {suffix && <span className="text-[var(--primary)]">{suffix}</span>}
        </span>
    );
}
