import React from 'react';
import { Github, Linkedin, Facebook, X, Youtube } from 'lineicons-react';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import BackToTop from '../Shared/BackToTop';

interface FooterSectionProps {
    section?: PortfolioSection;
    settings: PortfolioSettings;
}

export default function FooterSection({
    section: _section,
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

    return (
        <footer
            id="footer"
            aria-label="Portfolio Footer"
            className="w-full border-t border-[var(--surface-border)] bg-[var(--bg-elevated)]/60 px-4 py-12 backdrop-blur-md md:px-8 lg:px-16"
        >
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
                {/* Copyright & Mission Log */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <span className="font-display text-sm font-bold tracking-wider text-[var(--text)] uppercase">
                        {siteTitle}
                    </span>
                    <span className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                        © {currentYear} • MISSION CONTROL • ALL SYSTEMS NOMINAL
                    </span>
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <div className="flex items-center gap-3">
                        {socialLinks.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <a
                                    key={item.key}
                                    href={item.url as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:scale-110 hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:shadow-[0_0_12px_var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
                                >
                                    <IconComponent className="h-4 w-4" />
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Back to top rocket button */}
                <div>
                    <BackToTop />
                </div>
            </div>
        </footer>
    );
}
