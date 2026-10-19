import React, { useRef, useState } from 'react';

interface MagneticHoverProps {
    children: React.ReactNode;
    strength?: number;
    enabled?: boolean;
    className?: string;
}

export default function MagneticHover({
    children,
    strength = 0.25,
    enabled = true,
    className = '',
}: MagneticHoverProps) {
    const itemRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    if (!enabled) {
        return <div className={className}>{children}</div>;
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const item = itemRef.current;
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        setOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setOffset({ x: 0, y: 0 });
    };

    return (
        <div
            ref={itemRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`inline-block ${className}`}
            style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                transition: isHovered
                    ? 'transform 0.1s ease-out'
                    : 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
        >
            {children}
        </div>
    );
}
