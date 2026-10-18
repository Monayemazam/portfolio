import React, { useEffect, useState } from 'react';
import { MenuHamburger1, Xmark } from 'lineicons-react';
import { PortfolioSection } from '@/types/portfolio';
import ThemeToggle from './ThemeToggle';

interface MobileMenuProps {
    sections: PortfolioSection[];
    activeSection: string;
}

export default function MobileMenu({
    sections,
    activeSection,
}: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Trap Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleLinkClick = (key: string) => {
        setIsOpen(false);
        const el = document.getElementById(key);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', `#${key}`);
            }, 100);
        }
    };

    return (
        <div className="lg:hidden">
            {/* Floating Action Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={
                    isOpen ? 'Close navigation menu' : 'Open navigation menu'
                }
                aria-expanded={isOpen}
                className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
                style={{
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                }}
            >
                {isOpen ? (
                    <Xmark className="h-6 w-6 text-[var(--secondary)]" />
                ) : (
                    <MenuHamburger1 className="h-6 w-6 text-[var(--secondary)]" />
                )}
            </button>

            {/* Full-screen Glass Overlay */}
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile Navigation"
                    className="fixed inset-0 z-40 flex animate-in flex-col justify-between bg-[var(--bg)]/90 p-8 backdrop-blur-2xl transition-all duration-300 fade-in"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--secondary)]" />
                            <span className="font-mono text-xs font-bold tracking-[0.14em] text-[var(--secondary)] uppercase">
                                MISSION NAVIGATION
                            </span>
                        </div>
                        <ThemeToggle showLabel />
                    </div>

                    {/* Section Links */}
                    <nav className="my-auto flex max-h-[70vh] flex-col gap-3 overflow-y-auto py-6">
                        {sections.map((section, idx) => {
                            const isActive = activeSection === section.key;
                            const stepNumber = String(idx + 1).padStart(2, '0');

                            return (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => handleLinkClick(section.key)}
                                    className={`flex items-center gap-4 py-2.5 text-left transition-colors ${
                                        isActive
                                            ? 'text-[var(--secondary)]'
                                            : 'text-[var(--text)] hover:text-[var(--secondary)]'
                                    }`}
                                >
                                    <span className="font-mono text-xs text-[var(--text-muted)]">
                                        {stepNumber}
                                    </span>
                                    <span className="font-display text-xl font-bold tracking-tight">
                                        {section.nav_label}
                                    </span>
                                    {isActive && (
                                        <span className="ml-auto h-2 w-2 rounded-full bg-[var(--secondary)] shadow-[0_0_8px_var(--secondary)]" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer inside menu */}
                    <div className="border-t border-[var(--surface-border)] pt-4 text-center font-mono text-xs text-[var(--text-muted)]">
                        PRESS ESC OR TAP OUTSIDE TO RETURN
                    </div>
                </div>
            )}
        </div>
    );
}
