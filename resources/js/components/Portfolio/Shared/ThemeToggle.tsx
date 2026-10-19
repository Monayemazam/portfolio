import React from 'react';
import { Sun1, MoonHalfRight5 } from './Icons';
import { useTheme } from '@/hooks/use-theme';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export default function ThemeToggle({
    className = '',
    showLabel = false,
}: ThemeToggleProps) {
    const { isDark, toggleTheme, resolvedTheme } = useTheme();

    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label={`Switch to ${isDark ? 'Solar (light)' : 'Deep Space (dark)'} theme`}
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-10 flex-shrink-0 cursor-pointer rounded-full border border-[var(--surface-border)] bg-[var(--surface)] p-0.5 transition-colors duration-300 focus:ring-2 focus:ring-[var(--secondary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] focus:outline-none"
                title={`Active theme: ${resolvedTheme === 'dark' ? 'Deep Space (Dark)' : 'Solar (Light)'}. Click to switch.`}
            >
                <span className="sr-only">Toggle theme</span>
                {/* Thumb */}
                <span
                    className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                        isDark
                            ? 'translate-x-4 bg-[var(--primary)] text-white'
                            : 'translate-x-0 bg-[var(--accent)] text-slate-950'
                    }`}
                >
                    {isDark ? (
                        <MoonHalfRight5 className="h-3 w-3" />
                    ) : (
                        <Sun1 className="h-3 w-3" />
                    )}
                </span>
            </button>
            {showLabel && (
                <span className="font-mono text-xs tracking-wider text-[var(--text-muted)] uppercase select-none">
                    {isDark ? 'Deep Space' : 'Solar'}
                </span>
            )}
        </div>
    );
}
