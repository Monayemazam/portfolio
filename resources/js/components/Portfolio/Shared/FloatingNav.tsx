import React, { useEffect, useState } from 'react';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import { useTheme } from '@/hooks/use-theme';
import { Icons } from './Icons';

interface FloatingNavProps {
    sections: PortfolioSection[];
    activeSection: string;
    settings: PortfolioSettings;
    experiencesCount?: number;
    testimonialsCount?: number;
}

export default function FloatingNav({
    sections,
    activeSection,
    settings,
    experiencesCount = 0,
    testimonialsCount = 0,
}: FloatingNavProps) {
    const { isDark, toggleTheme } = useTheme(settings.default_theme);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dynamically filter to published and visible sections with sequential indices
    const candidateNavItems = [
        { key: 'about', label: 'ABOUT' },
        { key: 'skills', label: 'SKILLS' },
        { key: 'projects', label: 'EXHIBITS' },
        { key: 'services', label: 'SERVICES' },
        { key: 'experience', label: 'EXPERIENCE' },
        { key: 'process', label: 'PROCESS' },
        { key: 'testimonials', label: 'TESTIMONIALS' },
        { key: 'contact', label: 'CONTACT' },
    ];

    const navItems = candidateNavItems
        .filter((item) => {
            if (item.key === 'experience' && experiencesCount === 0) return false;
            if (item.key === 'testimonials' && testimonialsCount === 0) return false;
            return sections.some((s) => s.key === item.key && s.is_visible !== false);
        })
        .map((item, idx) => ({
            ...item,
            index: (idx + 1).toString().padStart(2, '0'),
        }));

    const scrollTo = (id: string) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header
            role="banner"
            className={`sticky top-0 z-50 w-full transition-colors duration-200 border-b ${
                scrolled
                    ? 'bg-[var(--bg)] border-border shadow-xs'
                    : 'bg-[var(--bg)] border-border'
            }`}
        >
            {/* Top publication ticker / masthead sub-bar */}
            <div className="hidden lg:flex items-center justify-between border-b border-border px-6 xl:px-12 py-1.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                <div className="flex items-center gap-4">
                    <span>INDEX NO. 2026 // MONAYEM AZAM ARCHIVE</span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1.5 text-foreground font-semibold">
                        <span className="inline-block h-1.5 w-1.5 bg-[var(--primary)]" />
                        AVAILABLE FOR SELECT COMMISSIONS
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span>TIMEZONE: UTC+6 · DHAKA</span>
                    <span className="text-border">|</span>
                    <span>EDITION: DIGITAL FIELD NOTES 01</span>
                </div>
            </div>

            {/* Main Publication Masthead */}
            <div className="mx-auto flex h-16 sm:h-20 max-w-[1440px] items-center justify-between px-6 sm:px-8 xl:px-12">
                {/* Wordmark */}
                <a
                    href="#hero"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollTo('hero');
                    }}
                    className="group flex flex-col focus:outline-hidden"
                >
                    <div className="flex items-center gap-2">
                        <span className="font-display text-lg sm:text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-[var(--primary)]">
                            MONAYEM AZAM
                        </span>
                        <span className="h-2 w-2 bg-[var(--primary)] transition-transform group-hover:scale-125" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase -mt-0.5">
                        INDEPENDENT DIGITAL BUILDER
                    </span>
                </a>

                {/* Desktop Editorial Navigation Grid */}
                <nav
                    role="navigation"
                    aria-label="Publication Sections"
                    className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-wider"
                >
                    {navItems.map((item) => {
                        const isActive = activeSection === item.key;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => scrollTo(item.key)}
                                className={`group flex items-center gap-1.5 transition-colors focus:outline-hidden py-1 ${
                                    isActive
                                        ? 'text-[var(--primary)] font-bold'
                                        : 'text-foreground/80 hover:text-foreground'
                                }`}
                            >
                                <span className="text-[10px] text-muted-foreground transition-colors group-hover:text-[var(--primary)]">
                                    {item.index}/
                                </span>
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="inline-block h-1 w-1 bg-[var(--primary)]" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Right controls: Theme toggle + Contact trigger */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Editorial theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${isDark ? 'Solar (Warm Paper)' : 'Deep Space (Charcoal)'} theme`}
                        className="flex items-center gap-2 border border-border px-2.5 sm:px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors hover:border-foreground hover:bg-muted"
                    >
                        <span className="inline-block h-2 w-2 rounded-none bg-[var(--primary)]" />
                        <span className="hidden sm:inline">
                            {isDark ? 'CHARCOAL' : 'PAPER'}
                        </span>
                    </button>

                    {/* Primary Contact Action */}
                    <button
                        type="button"
                        onClick={() => scrollTo('contact')}
                        className="hidden sm:flex items-center gap-2 bg-[var(--primary)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 active:scale-98"
                    >
                        <span>TALK</span>
                        <span>[→]</span>
                    </button>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-expanded={mobileOpen}
                        aria-label="Toggle publication menu"
                        className="flex lg:hidden items-center justify-center border border-border p-2 text-foreground transition-colors hover:border-foreground"
                    >
                        {mobileOpen ? (
                            <Icons.Close className="h-5 w-5" />
                        ) : (
                            <Icons.Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Publication Menu Overlay */}
            {mobileOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation Menu"
                    className="fixed inset-x-0 top-[65px] bottom-0 z-50 flex flex-col bg-[var(--bg)] border-t border-border px-6 py-8 overflow-y-auto"
                >
                    <div className="flex flex-col gap-6">
                        <div className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase border-b border-border pb-3">
                            CATALOGUE DIRECTORY // SELECT DISPATCH
                        </div>
                        {navItems.map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => scrollTo(item.key)}
                                className="flex items-baseline justify-between border-b border-border/50 py-3 text-left focus:outline-hidden"
                            >
                                <span className="font-display text-2xl font-black tracking-tight text-foreground">
                                    {item.label}
                                </span>
                                <span className="font-mono text-sm text-[var(--primary)]">
                                    {item.index} //
                                </span>
                            </button>
                        ))}

                        <div className="pt-6">
                            <button
                                type="button"
                                onClick={() => scrollTo('contact')}
                                className="w-full bg-[var(--primary)] py-3 font-mono text-sm font-bold uppercase tracking-wider text-white"
                            >
                                INITIATE DIALOGUE [→]
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
