import React from 'react';
import { ArrowRight } from './Icons';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'cta' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    target?: string;
    rel?: string;
    icon?: React.ReactNode;
    showArrow?: boolean;
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    href,
    target,
    rel,
    icon,
    showArrow = false,
    className = '',
    children,
    disabled,
    ...props
}: ButtonProps) {
    const sizeClasses = {
        sm: 'h-9 px-4 text-xs rounded-lg gap-1.5',
        md: 'h-12 px-6 text-sm font-medium rounded-xl gap-2',
        lg: 'h-14 px-8 text-base font-medium rounded-xl gap-2.5',
    }[size];

    let variantClasses = '';
    let styleObj: React.CSSProperties = {};

    switch (variant) {
        case 'primary':
            variantClasses =
                'text-white shadow-lg shadow-[var(--primary)]/25 hover:-translate-y-0.5 active:scale-[0.97] focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]';
            styleObj = {
                background:
                    'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            };
            break;
        case 'secondary':
            variantClasses =
                'border border-[var(--primary)] text-[var(--text)] hover:bg-[var(--primary)]/15 hover:-translate-y-0.5 active:scale-[0.97] focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]';
            styleObj = {
                backgroundColor: 'transparent',
            };
            break;
        case 'cta':
            variantClasses =
                'font-semibold text-slate-950 shadow-lg hover:-translate-y-0.5 hover:shadow-[0_0_24px_var(--accent)] active:scale-[0.97] focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]';
            styleObj = {
                backgroundColor: 'var(--accent)',
            };
            break;
        case 'ghost':
            variantClasses =
                'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] active:scale-[0.97]';
            break;
    }

    const disabledClasses = disabled
        ? 'opacity-40 cursor-not-allowed pointer-events-none'
        : 'cursor-pointer';

    const baseClasses = `inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 outline-none select-none ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`;

    const content = (
        <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
            {showArrow && (
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            )}
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={target === '_blank' ? rel || 'noopener noreferrer' : rel}
                className={`group ${baseClasses}`}
                style={styleObj}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type="button"
            disabled={disabled}
            className={`group ${baseClasses}`}
            style={styleObj}
            {...props}
        >
            {content}
        </button>
    );
}
