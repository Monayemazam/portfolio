import React, { useEffect, useState } from 'react';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import { useTheme } from '@/hooks/use-theme';
import MobileMenu from './MobileMenu';
import GravityItem from '@/components/Portfolio/Motion/GravityItem';

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
    const logoSrc = settings?.logo_media?.webp_url || settings?.logo_media?.url || '/logo.webp';

    useEffect(() => {
        let ticking = false;
        let lastScrolled = window.scrollY > 30;
        setScrolled(lastScrolled);

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    const isPassed = window.scrollY > 30;
                    if (isPassed !== lastScrolled) {
                        lastScrolled = isPassed;
                        setScrolled(isPassed);
                    }
                    ticking = false;
                });
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const candidateNavItems = [
        { key: 'about', label: 'ABOUT' },
        { key: 'skills', label: 'SKILLS' },
        { key: 'projects', label: 'PROJECTS' },
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
        });

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
            className={`sticky top-0 z-40 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-[var(--bg)]/85 backdrop-blur-md border-b border-border/50 shadow-lg'
                    : 'bg-transparent border-b border-border/20'
            }`}
        >
            <div className="mx-auto flex h-18 sm:h-20 max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16">
                {/* Brand Wordmark with Celestial Star Point */}
                <GravityItem radius={90} maxPull={4} strength={0.16} pushForce={4}>
                    <a
                        href="#hero"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo('hero');
                        }}
                        className="group flex items-center gap-3 focus:outline-hidden"
                    >
                        <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <img
                                src={logoSrc}
                                alt="Monayem Azam Logo"
                                className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(241,90,36,0.35)]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display text-lg sm:text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-[var(--primary)]">
                                MONAYEM AZAM
                            </span>
                            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase -mt-0.5">
                                FULL-STACK WEB DEVELOPER
                            </span>
                        </div>
                    </a>
                </GravityItem>

                {/* Desktop Celestial Navigation */}
                <nav
                    role="navigation"
                    aria-label="Celestial Destinations"
                    className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-wider"
                >
                    {navItems.map((item) => {
                        const isActive = activeSection === item.key;
                        return (
                            <GravityItem key={item.key} radius={70} maxPull={3.5} strength={0.16} pushForce={4}>
                                <button
                                    type="button"
                                    onClick={() => scrollTo(item.key)}
                                    className={`group relative py-2 transition-colors focus:outline-hidden cursor-pointer ${
                                        isActive
                                            ? 'text-foreground font-bold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                                    )}
                                </button>
                            </GravityItem>
                        );
                    })}
                </nav>

                {/* Right Controls: Theme Toggle + Contact Action */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Theme Switcher */}
                    <GravityItem radius={80} maxPull={4} strength={0.18} pushForce={5}>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            suppressHydrationWarning
                            aria-label={`Switch to ${isDark ? 'Solar' : 'Deep Space'} theme`}
                            className="flex items-center gap-2 rounded-full border border-border/80 bg-surface/60 backdrop-blur-sm px-3.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-all hover:border-[var(--primary)] hover:bg-surface cursor-pointer"
                        >
                            <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                            <span className="hidden sm:inline font-semibold" suppressHydrationWarning>
                                {isDark ? 'DEEP SPACE' : 'SOLAR'}
                            </span>
                        </button>
                    </GravityItem>

                    {/* Contact Action */}
                    <GravityItem radius={100} maxPull={5} strength={0.20} pushForce={6}>
                        <button
                            type="button"
                            onClick={() => scrollTo('contact')}
                            className="hidden sm:flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:shadow-[0_0_20px_rgba(241,90,36,0.4)] hover:bg-[var(--primary)]/90 cursor-pointer"
                        >
                            <span>GET IN TOUCH</span>
                            <span className="font-sans">→</span>
                        </button>
                    </GravityItem>

                    {/* Mobile Navigation Trigger */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open Navigation Menu"
                        className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            <MobileMenu
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sections={sections}
                activeSection={activeSection}
                settings={settings}
                experiencesCount={experiencesCount}
                testimonialsCount={testimonialsCount}
            />
        </header>
    );
}
