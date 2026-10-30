import React, { useEffect, useRef } from 'react';
import { registerGravityElement, GravityOptions } from '@/lib/gravity-engine';

export interface GravityItemProps extends GravityOptions {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    as?: React.ElementType;
    onClick?: React.MouseEventHandler;
    disabled?: boolean;
    role?: string;
    tabIndex?: number;
    'aria-label'?: string;
    'aria-selected'?: boolean;
}

export default function GravityItem({
    children,
    className = '',
    style = {},
    as: Component = 'div',
    onClick,
    disabled = false,
    strength,
    maxPull,
    radius,
    pushForce,
    stiffness,
    damping,
    role,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-selected': ariaSelected,
    ...rest
}: GravityItemProps) {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = elementRef.current;
        if (!el || disabled) return;

        const unregister = registerGravityElement(el, {
            strength,
            maxPull,
            radius,
            pushForce,
            stiffness,
            damping,
            disabled,
        });

        return unregister;
    }, [disabled, strength, maxPull, radius, pushForce, stiffness, damping]);

    return (
        <Component
            ref={elementRef}
            className={className}
            style={style}
            onClick={onClick}
            role={role}
            tabIndex={tabIndex}
            aria-label={ariaLabel}
            aria-selected={ariaSelected}
            {...rest}
        >
            {children}
        </Component>
    );
}

