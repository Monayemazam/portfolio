import React, { useEffect, useState } from 'react';
import { MenuHamburger1, Xmark } from './Icons';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import ThemeToggle from './ThemeToggle';

interface MobileMenuProps {
    sections: PortfolioSection[];
    activeSection: string;
    isOpen?: boolean;
    onClose?: () => void;
    settings?: PortfolioSettings;
    experiencesCount?: number;
    testimonialsCount?: number;
}

export default function MobileMenu({
    sections,
    activeSection,
    isOpen: controlledOpen,
    onClose,
}: MobileMenuProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (val: boolean) => {
        if (isControlled) {
            if (!val) onClose?.();
        } else {
            setInternalOpen(val);
        }
    };

    // Trap Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        if (open) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    const handleLinkClick = (key: string) => {
        setOpen(false);
        const el = document.getElementById(key);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', `#${key}`);
            }, 100);
        }
    };

    const visibleSections = sections.filter(
        (s) => s.is_visible !== false && s.key !== 'footer'
    );

    return (
        <div className="lg:hidden">
            {/* Floating Action Button (Only rendered in uncontrolled mode) */}
            {!isControlled && (
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    aria-label={
                        open ? 'Close navigation menu' : 'Open navigation menu'
                    }
                    aria-expanded={open}
                    className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border/80 bg-surface/80 text-foreground shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-hidden"
                >
                    {open ? (
                        <Xmark className="h-6 w-6 text-[var(--primary)]" />
                    ) : (
                        <MenuHamburger1 className="h-6 w-6 text-[var(--primary)]" />
                    )}
                </button>
            )}

            {/* Full-screen Glass Overlay */}
            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile Celestial Navigation"
                    className="fixed inset-0 z-50 flex flex-col justify-between bg-[var(--bg)]/95 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                            <span className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">
                                MONAYEM AZAM
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle showLabel />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-surface text-foreground hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                aria-label="Close menu"
                            >
                                <Xmark className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Section Links */}
                    <nav className="my-auto flex max-h-[70vh] flex-col gap-3 overflow-y-auto py-6">
                        {visibleSections.map((section, idx) => {
                            const isActive = activeSection === section.key;
                            const stepNumber = String(idx + 1).padStart(2, '0');

                            return (
                                <button
                                    key={section.key}
                                    type="button"
                                    onClick={() => handleLinkClick(section.key)}
                                    className={`flex items-center gap-4 py-3 text-left transition-colors border-b border-border/20 ${
                                        isActive
                                            ? 'text-[var(--primary)]'
                                            : 'text-foreground hover:text-[var(--primary)]'
                                    }`}
                                >
                                    <span className="font-mono text-xs text-muted-foreground">
                                        {stepNumber}
                                    </span>
                                    <span className="font-display text-2xl font-bold tracking-tight uppercase">
                                        {section.nav_label || section.title || section.key}
                                    </span>
                                    {isActive && (
                                        <span className="ml-auto h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer inside menu */}
                    <div className="border-t border-border/40 pt-4 flex items-center justify-between font-mono text-xs text-muted-foreground uppercase">
                        <span>PORTFOLIO</span>
                        <span>MONAYEM AZAM</span>
                    </div>
                </div>
            )}
        </div>
    );
}
