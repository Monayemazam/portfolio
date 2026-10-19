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
    section: _section,
    sections = [],
    settings,
}: FooterSectionProps) {
    const siteTitle = settings.site_title || 'Monayem Azam';
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            key: 'github_url',
            label: 'GitHub',
            icon: Github,
            url: settings.github_url,
        },
        {
            key: 'linkedin_url',
            label: 'LinkedIn',
            icon: Linkedin,
            url: settings.linkedin_url,
        },
        {
            key: 'facebook_url',
            label: 'Facebook',
            icon: Facebook,
            url: settings.facebook_url,
        },
        { key: 'x_url', label: 'X (Twitter)', icon: X, url: settings.x_url },
        {
            key: 'youtube_url',
            label: 'YouTube',
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
            aria-label="Portfolio Footer"
            className="relative w-full border-t border-[var(--surface-border)] bg-[var(--bg-elevated)]/70 px-4 py-16 backdrop-blur-xl sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-20"
        >
            <div className="mx-auto w-full max-w-[1440px]">
                <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
                    {/* Brand Info */}
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] font-mono text-sm font-extrabold text-[var(--secondary)]">
                                MA.
                            </span>
                            <span className="font-display text-lg font-bold tracking-wider text-[var(--text)]">
                                {siteTitle}
                            </span>
                        </div>
                        <p className="max-w-md font-sans text-xs text-[var(--text-muted)] sm:text-sm">
                            Full-Stack Software Engineer & Digital Product
                            Builder specializing in high-performance web
                            ecosystems.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    {navLinks.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            {navLinks.map((item) => (
                                <a
                                    key={item.key}
                                    href={`#${item.key}`}
                                    className="font-sans text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--secondary)]"
                                >
                                    {item.nav_label || item.title}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Socials & Back to Top */}
                    <div className="flex items-center gap-4">
                        {socialLinks.length > 0 && (
                            <div className="flex items-center gap-2.5">
                                {socialLinks.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <a
                                            key={item.key}
                                            href={item.url as string}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={item.label}
                                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:scale-105 hover:border-[var(--secondary)] hover:text-[var(--text)]"
                                        >
                                            <IconComponent className="h-4 w-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleScrollTop}
                            aria-label="Back to top of page"
                            className="group flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] shadow-sm transition-all hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:scale-105 active:scale-95"
                        >
                            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                        </button>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--surface-border)]/40 pt-8 sm:flex-row">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                        © {currentYear} Monayem Azam · All rights reserved.
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                        Crafted with Laravel, React & Three.js
                    </span>
                </div>
            </div>
        </footer>
    );
}
