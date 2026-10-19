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
            className={`inline-flex items-center gap-1.5 border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground uppercase tracking-wider transition-colors ${
                onClick ? 'cursor-pointer hover:border-foreground hover:bg-muted' : ''
            } ${className}`}
        >
            {icon && (
                <span className="flex-shrink-0 text-[var(--primary)]">
                    {icon}
                </span>
            )}
            <span className="truncate">{children}</span>
        </Component>
    );
}
