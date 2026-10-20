import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle1,
    Envelope1,
    Facebook,
    Github,
    Linkedin,
    Phone,
    Whatsapp,
    X,
    Youtube,
} from '../Shared/Icons';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';

interface ContactSectionProps {
    section: PortfolioSection;
    settings: PortfolioSettings;
}

export default function ContactSection({
    section,
    settings,
}: ContactSectionProps) {
    const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            email: '',
            subject: '',
            message: '',
            company_hp: '', // Honeypot
        });

    const emailAddress = settings.contact_email;
    const phone = settings.contact_phone;
    const whatsapp = settings.whatsapp_number;
    const bookingUrl = settings.booking_url;

    const github = settings.github_url;
    const linkedin = settings.linkedin_url;
    const facebook = settings.facebook_url;
    const twitter = settings.x_url;
    const youtube = settings.youtube_url;

    const hasSocials = Boolean(
        github || linkedin || facebook || twitter || youtube,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubmittedSuccessfully(true);
            },
        });
    };

    return (
        <section
            id="contact"
            aria-label="Direct Deep-Space Communication Beacon"
            className="w-full border-b border-border/40 bg-[var(--bg)] px-6 sm:px-10 lg:px-16 py-24 lg:py-32 select-none relative overflow-hidden"
        >
            {/* Ambient Nebula Light & Beacon Rays */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-1/4 w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full bg-[var(--forest)] opacity-30 blur-[130px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 -left-20 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-[var(--primary)] opacity-10 blur-[120px]"
            />

            <div className="mx-auto max-w-[1440px] relative z-10">
                {/* Header Waypoint Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]" />
                        </span>
                        <span className="font-bold text-foreground">
                            {section?.title || 'COMMUNICATION BEACON'}
                        </span>
                        <span className="text-border">/</span>
                        <span>DIRECT SIGNAL INTERFACE</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        <span>SIGNAL STATUS: ONLINE · RESPONSE &lt; 24H</span>
                    </div>
                </div>

                {/* Closing Headline Spread */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 font-mono text-xs text-[var(--primary)] uppercase tracking-widest">
                            <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
                            <span>DEEP SPACE TRANSMISSION</span>
                        </div>
                        <h2 className="mt-3 font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-foreground uppercase leading-[0.92]">
                            HAVE AN IDEA?
                            <br />
                            <span className="text-[var(--primary)]">LET'S MAKE IT REAL.</span>
                        </h2>
                    </div>

                    {/* Beacon Signal Transmitter Visual Indicator */}
                    <div className="flex items-center gap-4 rounded-full border border-border/60 bg-surface/60 backdrop-blur-md px-6 py-3.5 font-mono text-xs text-foreground">
                        <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-70" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]" />
                        </div>
                        <span className="font-semibold uppercase tracking-wider text-[11px]">
                            BEACON ACTIVE // 1.420 GHz HYDROGEN LINE
                        </span>
                    </div>
                </div>

                {/* Main Spread: Coordinates & Channels on Left, Signal Console on Right */}
                <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Direct Dispatches & Channels */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                        <div>
                            <p className="font-body text-base sm:text-lg leading-relaxed text-foreground/80">
                                {section?.subtitle ||
                                    'Available for bespoke creative digital installations, complex distributed web platforms, and architectural consulting. All direct transmissions are received and evaluated promptly.'}
                            </p>

                            {/* Engagement Parameters Panel */}
                            <div className="mt-8 rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-md p-6">
                                <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase block pb-3 border-b border-border/40">
                                    ENGAGEMENT SCOPE //
                                </span>
                                <ul className="mt-4 space-y-3 font-mono text-xs text-foreground/85">
                                    <li className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                        <span>Full-Stack Web Platforms & High-Traffic Architecture</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                        <span>Laravel 11, React 19, TypeScript, Inertia.js</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                                        <span>Immersive 3D Experiences & Three.js Visual Systems</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                                        <span>Guaranteed Response SLA within 24 Hours</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Direct Communication Channels */}
                            <div className="mt-8 rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-md divide-y divide-border/40 font-mono text-xs overflow-hidden">
                                {emailAddress ? (
                                    <div className="p-4 flex items-center justify-between hover:bg-surface/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Envelope1 className="h-4 w-4 text-[var(--primary)]" />
                                            <span className="text-muted-foreground uppercase">EMAIL:</span>
                                        </div>
                                        <a
                                            href={`mailto:${emailAddress}`}
                                            className="font-bold text-foreground hover:text-[var(--primary)] transition-colors"
                                            data-field-tag="EMAIL"
                                        >
                                            {emailAddress}
                                        </a>
                                    </div>
                                ) : (
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Envelope1 className="h-4 w-4 text-[var(--primary)]" />
                                            <span className="text-muted-foreground uppercase">TRANSMISSION:</span>
                                        </div>
                                        <span className="font-bold text-[var(--primary)]">
                                            DISPATCH CONSOLE [ACTIVE]
                                        </span>
                                    </div>
                                )}

                                {phone && (
                                    <div className="p-4 flex items-center justify-between hover:bg-surface/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-[var(--primary)]" />
                                            <span className="text-muted-foreground uppercase">TEL:</span>
                                        </div>
                                        <a
                                            href={`tel:${phone}`}
                                            className="font-bold text-foreground hover:text-[var(--primary)] transition-colors"
                                            data-field-tag="TEL"
                                        >
                                            {phone}
                                        </a>
                                    </div>
                                )}

                                {whatsapp && (
                                    <div className="p-4 flex items-center justify-between hover:bg-surface/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Whatsapp className="h-4 w-4 text-[var(--primary)]" />
                                            <span className="text-muted-foreground uppercase">WHATSAPP:</span>
                                        </div>
                                        <a
                                            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-foreground hover:text-[var(--primary)] transition-colors"
                                            data-field-tag="WHATSAPP"
                                        >
                                            DIRECT COMMS [↗]
                                        </a>
                                    </div>
                                )}

                                {bookingUrl && (
                                    <div className="p-4 flex items-center justify-between hover:bg-surface/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="h-4 w-4 text-[var(--primary)]" />
                                            <span className="text-muted-foreground uppercase">CONSULTATION:</span>
                                        </div>
                                        <a
                                            href={bookingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-[var(--primary)] hover:underline"
                                            data-field-tag="CALENDAR"
                                        >
                                            SCHEDULE FLIGHT PLAN [↗]
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Social Link List */}
                            {hasSocials && (
                                <div className="mt-8">
                                    <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase block mb-3">
                                        COSMIC BEACON NETWORKS //
                                    </span>
                                    <div className="flex flex-wrap gap-2.5">
                                        {github && (
                                            <a
                                                href={github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full border border-border/60 bg-surface/50 px-4 py-2 font-mono text-xs uppercase hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center gap-2"
                                            >
                                                <Github className="h-3.5 w-3.5" />
                                                <span>GITHUB</span>
                                            </a>
                                        )}
                                        {linkedin && (
                                            <a
                                                href={linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full border border-border/60 bg-surface/50 px-4 py-2 font-mono text-xs uppercase hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center gap-2"
                                            >
                                                <Linkedin className="h-3.5 w-3.5" />
                                                <span>LINKEDIN</span>
                                            </a>
                                        )}
                                        {twitter && (
                                            <a
                                                href={twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full border border-border/60 bg-surface/50 px-4 py-2 font-mono text-xs uppercase hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center gap-2"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                                <span>X.COM</span>
                                            </a>
                                        )}
                                        {facebook && (
                                            <a
                                                href={facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full border border-border/60 bg-surface/50 px-4 py-2 font-mono text-xs uppercase hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center gap-2"
                                            >
                                                <Facebook className="h-3.5 w-3.5" />
                                                <span>FACEBOOK</span>
                                            </a>
                                        )}
                                        {youtube && (
                                            <a
                                                href={youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full border border-border/60 bg-surface/50 px-4 py-2 font-mono text-xs uppercase hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center gap-2"
                                            >
                                                <Youtube className="h-3.5 w-3.5" />
                                                <span>YOUTUBE</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-border/40 font-mono text-[11px] text-muted-foreground uppercase">
                            STAMP: ENCRYPTED HTTPS TRANSMISSION · RATE-LIMITED
                        </div>
                    </div>

                    {/* Right Column: Deep-Space Transmission Console Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl border border-border/60 bg-surface/60 backdrop-blur-xl p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.25)] relative overflow-hidden">
                            {/* Ambient Rim Light for Form */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--primary)] opacity-15 blur-3xl"
                            />

                            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                                    <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                                        TRANSMISSION CONSOLE //
                                    </span>
                                </div>
                                <span className="rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/40 px-3 py-1 font-mono text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                                    SECURE BEACON
                                </span>
                            </div>

                            {submittedSuccessfully ? (
                                <div className="rounded-2xl border border-[var(--primary)] bg-surface/80 p-10 text-center">
                                    <CheckCircle1 className="mx-auto h-14 w-14 text-[var(--primary)]" />
                                    <h3 className="mt-4 font-display text-3xl font-black text-foreground uppercase">
                                        TRANSMISSION RECEIVED.
                                    </h3>
                                    <p className="mt-3 font-mono text-xs text-muted-foreground uppercase leading-relaxed max-w-md mx-auto">
                                        Your dispatch has been logged to the database.
                                        I will evaluate your mission inquiry and establish contact within 24 hours.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSubmittedSuccessfully(false)}
                                        className="mt-8 rounded-full border border-border/80 bg-surface px-8 py-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all cursor-pointer"
                                    >
                                        TRANSMIT ANOTHER DISPATCH
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    {/* Honeypot field (hidden from genuine users) */}
                                    <div className="hidden" aria-hidden="true">
                                        <label htmlFor="company_hp">Do not fill this</label>
                                        <input
                                            id="company_hp"
                                            name="company_hp"
                                            type="text"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={data.company_hp}
                                            onChange={(e) => setData('company_hp', e.target.value)}
                                        />
                                    </div>

                                    {/* Name & Email Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="contact_name"
                                                className="block font-mono text-xs font-bold tracking-wider text-foreground uppercase mb-2"
                                            >
                                                NAME // IDENTIFIER <span className="text-[var(--primary)]">*</span>
                                            </label>
                                            <input
                                                id="contact_name"
                                                type="text"
                                                required
                                                placeholder="e.g. Commander Elena"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full rounded-xl border bg-background/60 px-4 py-3.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-hidden ${
                                                    errors.name ? 'border-red-500' : 'border-border/60'
                                                }`}
                                            />
                                            {errors.name && (
                                                <span className="font-mono text-[10px] text-red-500 mt-1 block">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="contact_email"
                                                className="block font-mono text-xs font-bold tracking-wider text-foreground uppercase mb-2"
                                            >
                                                ELECTRONIC MAIL <span className="text-[var(--primary)]">*</span>
                                            </label>
                                            <input
                                                id="contact_email"
                                                type="email"
                                                required
                                                placeholder="e.g. elena@observatory.org"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full rounded-xl border bg-background/60 px-4 py-3.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-hidden ${
                                                    errors.email ? 'border-red-500' : 'border-border/60'
                                                }`}
                                            />
                                            {errors.email && (
                                                <span className="font-mono text-[10px] text-red-500 mt-1 block">
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label
                                            htmlFor="contact_subject"
                                            className="block font-mono text-xs font-bold tracking-wider text-foreground uppercase mb-2"
                                        >
                                            SUBJECT // MISSION SCOPE
                                        </label>
                                        <input
                                            id="contact_subject"
                                            type="text"
                                            placeholder="e.g. Full-Stack Web Platform Architecture"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-hidden"
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label
                                            htmlFor="contact_message"
                                            className="block font-mono text-xs font-bold tracking-wider text-foreground uppercase mb-2"
                                        >
                                            DISPATCH MESSAGE <span className="text-[var(--primary)]">*</span>
                                        </label>
                                        <textarea
                                            id="contact_message"
                                            required
                                            rows={5}
                                            placeholder="Describe your initiative, goals, timeline, and architectural requirements..."
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            className={`w-full rounded-xl border bg-background/60 px-4 py-3.5 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-hidden ${
                                                errors.message ? 'border-red-500' : 'border-border/60'
                                            }`}
                                        />
                                        {errors.message && (
                                            <span className="font-mono text-[10px] text-red-500 mt-1 block">
                                                {errors.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rate limit error display if returned by backend */}
                                    {(errors as Record<string, string>).rate_limit && (
                                        <div className="rounded-xl border border-red-500 bg-red-500/10 p-3 font-mono text-xs text-red-500">
                                            {(errors as Record<string, string>).rate_limit}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-full bg-[var(--primary)] py-4 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-[0_0_25px_rgba(241,90,36,0.4)] disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                                        data-field-tag="SUBMIT"
                                    >
                                        {processing ? (
                                            <span>TRANSMITTING TO ORBIT...</span>
                                        ) : (
                                            <>
                                                <span>TRANSMIT DISPATCH</span>
                                                <span className="font-sans">→</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
