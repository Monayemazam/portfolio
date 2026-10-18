import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'card' | 'panel' | 'subtle';
    interactive?: boolean;
    as?: 'div' | 'article' | 'section';
}

export default function GlassPanel({
    children,
    className = '',
    variant = 'card',
    interactive = false,
    as: Component = 'div',
    ...props
}: GlassPanelProps) {
    const radiusClass = variant === 'panel' ? 'rounded-3xl' : 'rounded-2xl';
    const paddingClass = variant === 'panel' ? 'p-6 md:p-10' : 'p-6 md:p-8';

    const interactiveClass = interactive
        ? 'transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_0_24px_rgba(124,58,237,0.25)]'
        : '';

    return (
        <Component
            className={`glass-panel ${radiusClass} ${paddingClass} ${interactiveClass} ${className}`}
            style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--surface-border)',
            }}
            {...props}
        >
            {children}
        </Component>
    );
}
