import React, { useEffect, useState } from 'react';
import { HeroRole } from '@/types/portfolio';

interface TypewriterRolesProps {
    roles: HeroRole[];
    isReducedMotion?: boolean;
    className?: string;
}

export default function TypewriterRoles({
    roles,
    isReducedMotion = false,
    className = '',
}: TypewriterRolesProps) {
    const roleList =
        roles && roles.length > 0
            ? roles
            : ([
                  { id: 0, text: 'Full-Stack Developer', sort_order: 1 },
              ] as HeroRole[]);

    const [roleIndex, setRoleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Reduced motion mode: simple periodic text swap without typing or backspacing
    useEffect(() => {
        if (!isReducedMotion) return;

        setDisplayedText(roleList[roleIndex]?.text || '');

        if (roleList.length <= 1) return;

        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % roleList.length);
        }, 3600);

        return () => clearInterval(interval);
    }, [isReducedMotion, roleList.length, roleIndex, roleList]);

    // Normal motion mode: typewriter typing and backspacing animation
    useEffect(() => {
        if (isReducedMotion) return;

        const currentRole = roleList[roleIndex]?.text || '';

        if (!isDeleting && displayedText === currentRole) {
            // Full role reached: pause for 2.2s before deleting
            const pauseTimeout = setTimeout(() => {
                setIsDeleting(true);
            }, 2200);
            return () => clearTimeout(pauseTimeout);
        }

        if (isDeleting && displayedText === '') {
            // Deleted completely: advance to next role and pause briefly
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % roleList.length);
            return;
        }

        const typingSpeed = isDeleting ? 30 : 65;

        const timer = setTimeout(() => {
            setDisplayedText((prev) => {
                if (isDeleting) {
                    return currentRole.slice(0, prev.length - 1);
                } else {
                    return currentRole.slice(0, prev.length + 1);
                }
            });
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, roleIndex, roleList, isReducedMotion]);

    const activeRole = roleList[roleIndex]?.text || '';

    return (
        <div
            className={`flex items-center justify-center font-sans font-medium text-[var(--text-muted)] ${className}`}
            aria-live="polite"
        >
            <span>Specializing in&nbsp;</span>
            <span className="text-gradient font-bold">
                {isReducedMotion ? activeRole : displayedText}
            </span>
            {!isReducedMotion && (
                <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[1.1em] w-[2px] animate-pulse rounded-full bg-[var(--secondary)] align-middle shadow-[0_0_8px_var(--secondary)]"
                />
            )}
        </div>
    );
}
