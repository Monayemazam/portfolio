import React from 'react';

interface TagChipProps {
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function TagChip({
    children,
    icon,
    className = '',
    onClick,
}: TagChipProps) {
    const Component = onClick ? 'button' : 'span';

    return (
        <Component
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`inline-flex h-7 items-center gap-1.5 rounded-full border border-[var(--primary)]/25 bg-[var(--primary)]/15 px-3 font-mono text-xs text-[var(--text)] transition-colors duration-200 ${
                onClick
                    ? 'cursor-pointer hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/30'
                    : ''
            } ${className}`}
        >
            {icon && (
                <span className="flex-shrink-0 text-[var(--secondary)]">
                    {icon}
                </span>
            )}
            <span className="truncate">{children}</span>
        </Component>
    );
}
