import React, { useState } from 'react';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export default function Tooltip({
    content,
    children,
    position = 'top',
    className = '',
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }[position];

    return (
        <div
            className={`relative inline-flex ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    role="tooltip"
                    className={`pointer-events-none absolute z-50 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1 font-mono text-xs whitespace-nowrap text-[var(--text)] shadow-xl backdrop-blur-md transition-opacity duration-150 ${positionClasses}`}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
