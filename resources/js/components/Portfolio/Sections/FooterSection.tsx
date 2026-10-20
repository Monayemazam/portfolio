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
    experiencesCount?: number;
    testimonialsCount?: number;
}

const sectionLabels: Record<string, string> = {
    about: 'DOSSIER',
    skills: 'PLANETARY SKILLS',
    projects: 'PROJECT UNIVERSE',
    services: 'CAPABILITIES',
    experience: 'FLIGHT LOG',
    process: 'TRAJECTORY',
    testimonials: 'TRANSMISSIONS',
    contact: 'BEACON',
};

export default function FooterSection({
    sections = [],
    settings,
    experiencesCount = 0,
    testimonialsCount = 0,
}: FooterSectionProps) {
    const currentYear = new Date().getFullYear();
    const siteTitle = settings.site_title || 'MONAYEM AZAM';

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

    const navLinks = sections.filter((s) => {
        if (!s.is_visible || s.key === 'hero' || s.key === 'footer') return false;
        if (s.key === 'experience' && experiencesCount === 0) return false;
        if (s.key === 'testimonials' && testimonialsCount === 0) return false;
        return true;
    });

    const handleScrollTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            id="footer"
            aria-label="Universe Colophon"
            className="w-full border-t border-border/40 bg-[var(--bg)] px-6 sm:px-10 lg:px-16 py-20 relative overflow-hidden"
        >
            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* Colophon Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-14 border-b border-border/40">
                    {/* Brand Wordmark & Descriptor */}
                    <div className="md:col-span-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]" />
                                <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase">
                                    {siteTitle}
                                </span>
                            </div>
                            <p className="mt-4 font-body text-sm sm:text-base text-foreground/75 leading-relaxed max-w-sm">
                                Independent Full-Stack Software Engineer & Creative Technologist.
                                Constructing resilient architectural systems and immersive digital universes.
                            </p>
                        </div>

                        <div className="mt-8 font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            <span>MONAYEM // DEEP SPACE EXPERIENCE</span>
                        </div>
                    </div>

                    {/* Section Links */}
                    <div className="md:col-span-4">
                        <span className="font-mono text-xs font-bold text-foreground uppercase tracking-widest block mb-4">
                            CELESTIAL WAYPOINTS //
                        </span>
                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                            {navLinks.map((item, idx) => (
                                <a
                                    key={item.key}
                                    href={`#${item.key}`}
                                    className="text-muted-foreground hover:text-[var(--primary)] transition-colors uppercase py-1.5 flex items-center gap-2"
                                >
                                    <span className="text-[10px] text-border">
                                        {(idx + 1).toString().padStart(2, '0')}.
                                    </span>
                                    <span>{sectionLabels[item.key] || item.nav_label || item.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Socials & Actions */}
                    <div className="md:col-span-3 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-xs font-bold text-foreground uppercase tracking-widest block mb-4">
                                SIGNAL CHANNELS //
                            </span>
                            <div className="flex flex-col gap-2 font-mono text-xs">
                                {socialLinks.length > 0 ? (
                                    socialLinks.map((item) => (
                                        <a
                                            key={item.key}
                                            href={item.url as string}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-[var(--primary)] transition-colors uppercase flex items-center justify-between py-1"
                                        >
                                            <span>{item.label}</span>
                                            <span className="font-sans">↗</span>
                                        </a>
                                    ))
                                ) : (
                                    <>
                                        <a
                                            href="#contact"
                                            className="text-muted-foreground hover:text-[var(--primary)] transition-colors uppercase flex items-center justify-between py-1"
                                        >
                                            <span>DIRECT BEACON</span>
                                            <span className="font-sans">→</span>
                                        </a>
                                        <a
                                            href="https://github.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-[var(--primary)] transition-colors uppercase flex items-center justify-between py-1"
                                        >
                                            <span>REPOSITORY</span>
                                            <span className="font-sans">↗</span>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={handleScrollTop}
                                className="w-full rounded-full border border-border/80 bg-surface/60 backdrop-blur-md py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>RETURN TO APEX</span>
                                <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal & Colophon Dispatches */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    <span>© {currentYear} {siteTitle} · ALL RIGHTS RESERVED</span>
                    <span>BUILT WITH LARAVEL 12, REACT 19, THREE.JS & DEEP SPACE CRAFT</span>
                </div>
            </div>
        </footer>
    );
}
