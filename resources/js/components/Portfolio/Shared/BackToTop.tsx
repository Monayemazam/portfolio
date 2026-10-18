import React from 'react';
import { Rocket5 } from 'lineicons-react';

interface BackToTopProps {
    className?: string;
}

export default function BackToTop({ className = '' }: BackToTopProps) {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        history.pushState(null, '', '#hero');
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Launch back to top"
            className={`group inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5 font-mono text-xs text-[var(--text)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none ${className}`}
        >
            <span>LAUNCH TO TOP</span>
            <Rocket5 className="h-4 w-4 text-[var(--accent)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-12" />
        </button>
    );
}
