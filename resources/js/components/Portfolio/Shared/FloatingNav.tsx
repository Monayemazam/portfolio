import React, { useEffect, useState } from 'react';
import { ArrowAngularTopRight, Cross, Menu } from './Icons';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import ThemeToggle from './ThemeToggle';

interface FloatingNavProps {
    sections: PortfolioSection[];
    activeSection: string;
    settings: PortfolioSettings;
    onContactClick?: () => void;
}

export default function FloatingNav({
    sections,
    activeSection,
    settings,
    onContactClick,
}: FloatingNavProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter valid navigation links (exclude hero and footer, include only visible sections)
    const navItems = sections.filter(
        (s) => s.is_visible && s.key !== 'hero' && s.key !== 'footer',
    );

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        key: string,
    ) => {
        e.preventDefault();
        setMobileOpen(false);
        const element = document.getElementById(key);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (typeof window !== 'undefined' && window.history?.pushState) {
                window.history.pushState(null, '', `#${key}`);
            }
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'py-3 sm:py-4'
                        : 'py-5 sm:py-7'
                }`}
            >
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16">
                    <nav
                        aria-label="Main Navigation"
                        className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-6 ${
                            scrolled
                                ? 'glass-nav border border-[var(--surface-border)] shadow-2xl backdrop-blur-xl'
                                : 'bg-transparent border border-transparent'
                        }`}
                    >
                        {/* Left: Brand Monogram & Name */}
                        <a
                            href="#hero"
                            onClick={(e) => handleNavClick(e, 'hero')}
                            className="group flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:outline-none rounded-xl"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] font-mono text-sm font-extrabold tracking-wider text-[var(--secondary)] shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-[var(--secondary)] group-hover:shadow-[0_0_15px_rgba(83,224,247,0.3)]">
                                MA.
                            </span>
                            <div className="flex flex-col">
                                <span className="font-display text-sm font-bold tracking-wider text-[var(--text)] transition-colors group-hover:text-[var(--secondary)] sm:text-base">
                                    Monayem Azam
                                </span>
                                <span className="hidden font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase md:block">
                                    Full-Stack Engineer
                                </span>
                            </div>
                        </a>

                        {/* Center: Desktop Navigation Links */}
                        <div className="hidden items-center gap-1 lg:flex">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.key;
                                return (
                                    <a
                                        key={item.key}
                                        href={`#${item.key}`}
                                        onClick={(e) =>
                                            handleNavClick(e, item.key)
                                        }
                                        className={`relative rounded-lg px-3.5 py-1.5 font-sans text-xs font-medium tracking-wide transition-all duration-200 xl:text-sm ${
                                            isActive
                                                ? 'font-semibold text-[var(--text)]'
                                                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                        }`}
                                    >
                                        {item.nav_label || item.title}
                                        {isActive && (
                                            <span className="absolute right-3.5 bottom-0 left-3.5 h-[2px] rounded-full bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] shadow-[0_0_8px_var(--secondary)]" />
                                        )}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Right: Actions (Theme Toggle & Contact CTA) */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle showLabel={false} />

                            <a
                                href="#contact"
                                onClick={(e) => {
                                    handleNavClick(e, 'contact');
                                    onContactClick?.();
                                }}
                                className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[#f59e0b] px-4 py-2 font-sans text-xs font-bold text-[#080d1c] shadow-[0_0_20px_rgba(255,181,71,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,181,71,0.45)] active:scale-95 sm:inline-flex md:text-sm"
                            >
                                <span>Let's Talk</span>
                                <ArrowAngularTopRight className="h-3.5 w-3.5" />
                            </a>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                type="button"
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle navigation menu"
                                aria-expanded={mobileOpen}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] transition-colors hover:border-[var(--secondary)] hover:text-[var(--secondary)] lg:hidden"
                            >
                                {mobileOpen ? (
                                    <Cross className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Slide-down Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 flex flex-col bg-[var(--bg)]/95 px-6 pt-24 pb-8 backdrop-blur-2xl transition-all duration-300 lg:hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile Navigation"
                >
                    <div className="flex flex-col gap-3 py-6">
                        {navItems.map((item, idx) => {
                            const isActive = activeSection === item.key;
                            return (
                                <a
                                    key={item.key}
                                    href={`#${item.key}`}
                                    onClick={(e) =>
                                        handleNavClick(e, item.key)
                                    }
                                    className={`flex items-center justify-between border-b border-[var(--surface-border)]/40 py-3.5 font-display text-lg tracking-wide transition-colors ${
                                        isActive
                                            ? 'font-bold text-[var(--secondary)]'
                                            : 'text-[var(--text)] hover:text-[var(--secondary)]'
                                    }`}
                                >
                                    <span>{item.nav_label || item.title}</span>
                                    <span className="font-mono text-xs text-[var(--text-muted)]">
                                        0{idx + 1}
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                    <div className="mt-auto flex flex-col gap-4 pt-6">
                        <a
                            href="#contact"
                            onClick={(e) => {
                                handleNavClick(e, 'contact');
                                onContactClick?.();
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[#f59e0b] py-3.5 font-sans text-sm font-bold text-[#080d1c] shadow-lg transition-transform active:scale-95"
                        >
                            <span>Let's Talk</span>
                            <ArrowAngularTopRight className="h-4 w-4" />
                        </a>
                        <p className="text-center font-mono text-[11px] text-[var(--text-muted)]">
                            Monayem Azam · Digital Universe
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
