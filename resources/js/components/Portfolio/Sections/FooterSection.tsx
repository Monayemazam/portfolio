import React from 'react';
import {
    ArrowUp,
    Facebook,
    Github,
    Linkedin,
    X,
    Youtube,
} from '../Shared/Icons';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';

interface FooterSectionProps {
    section?: PortfolioSection;
    sections?: PortfolioSection[];
    settings: PortfolioSettings;
}

export default function FooterSection({
    sections = [],
    settings,
}: FooterSectionProps) {
    const siteTitle = settings.site_title || 'MONAYEM AZAM';
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            key: 'github_url',
            label: 'GITHUB',
            icon: Github,
            url: settings.github_url,
        },
        {
            key: 'linkedin_url',
            label: 'LINKEDIN',
            icon: Linkedin,
            url: settings.linkedin_url,
        },
        {
            key: 'facebook_url',
            label: 'FACEBOOK',
            icon: Facebook,
            url: settings.facebook_url,
        },
        { key: 'x_url', label: 'X (TWITTER)', icon: X, url: settings.x_url },
        {
            key: 'youtube_url',
            label: 'YOUTUBE',
            icon: Youtube,
            url: settings.youtube_url,
        },
    ].filter((item) => Boolean(item.url));

    const navLinks = sections.filter(
        (s) => s.is_visible && s.key !== 'hero' && s.key !== 'footer',
    );

    const handleScrollTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            id="footer"
            aria-label="Publication Colophon"
            className="w-full border-t-2 border-foreground bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-16 sm:py-20"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Colophon Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-12 border-b border-border">
                    {/* Brand Wordmark & Descriptor */}
                    <div className="md:col-span-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase">
                                    {siteTitle}
                                </span>
                                <span className="h-2 w-2 bg-[var(--primary)]" />
                            </div>
                            <p className="mt-3 font-mono text-xs text-muted-foreground uppercase leading-relaxed max-w-sm">
                                Independent Full-Stack Software Engineer & Digital Creator.
                                Engineered for architectural integrity, performance, and expressive interactive craft.
                            </p>
                        </div>

                        <div className="mt-6 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                            COLOPHON // ISSUE 2026 · EDITION 01
                        </div>
                    </div>

                    {/* Section Links */}
                    <div className="md:col-span-4">
                        <span className="font-mono text-xs font-bold text-foreground uppercase tracking-widest block mb-4">
                            INDEX DIRECTORY //
                        </span>
                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                            {navLinks.map((item, idx) => (
                                <a
                                    key={item.key}
                                    href={`#${item.key}`}
                                    className="text-muted-foreground hover:text-foreground transition-colors uppercase py-1"
                                >
                                    {(idx + 1).toString().padStart(2, '0')} / {item.nav_label || item.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Socials & Colophon Tech Specs */}
                    <div className="md:col-span-3 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-xs font-bold text-foreground uppercase tracking-widest block mb-4">
                                DISPATCH CHANNELS //
                            </span>
                            <div className="flex flex-col gap-2 font-mono text-xs">
                                {socialLinks.map((item) => (
                                    <a
                                        key={item.key}
                                        href={item.url as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-[var(--primary)] transition-colors uppercase flex items-center justify-between"
                                    >
                                        <span>{item.label}</span>
                                        <span>[↗]</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleScrollTop}
                                className="w-full border border-foreground py-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
                            >
                                <span>RETURN TO TOP</span>
                                <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal & Colophon Dispatches */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    <span>© {currentYear} MONAYEM AZAM · ALL RIGHTS RESERVED</span>
                    <span>BUILT WITH LARAVEL 12, REACT 19, TYPESCRIPT & SWISS EDITORIAL CRAFT</span>
                </div>
            </div>
        </footer>
    );
}
