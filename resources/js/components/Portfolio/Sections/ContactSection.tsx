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
            aria-label="Direct Dispatch & Communication"
            className="w-full border-b border-border bg-[var(--bg)] px-6 sm:px-8 xl:px-12 py-20 lg:py-28"
        >
            <div className="mx-auto max-w-[1440px]">
                {/* Section Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <div className="flex items-center gap-3">
                        <span className="bg-[var(--primary)] text-white px-2 py-0.5 font-bold">
                            SEC. 06
                        </span>
                        <span>DIRECT DISPATCH // INITIATE DIALOGUE</span>
                    </div>
                    <span>RESPONSE TIME: &lt; 24 HOURS</span>
                </div>

                {/* Closing Headline Spread */}
                <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                            // FINAL INTERACTION // RUNTIME DISPATCH
                        </span>
                        <h2 className="mt-2 font-display text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-foreground uppercase leading-[0.88]">
                            HAVE AN IDEA?
                            <br />
                            <span className="text-[var(--primary)]">LET'S MAKE IT REAL.</span>
                        </h2>
                    </div>

                    {/* Signal-Orange Directional Vector Beam Guiding the Eye to the Form */}
                    <div className="hidden lg:flex items-center gap-4 border-2 border-foreground bg-[var(--primary)] px-6 py-4 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-xs">
                        <span>INITIATE TRANSMISSION</span>
                        <span className="font-sans text-xl animate-bounce">↓</span>
                    </div>
                </div>

                {/* Two-Column Editorial Spread */}
                <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Direct Dispatches & Channels */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                        <div>
                            <p className="font-body text-base sm:text-lg leading-relaxed text-foreground/80">
                                {section?.subtitle ||
                                    'Open for architectural consulting, senior full-stack development, and bespoke creative digital installations. Direct channels are monitored daily.'}
                            </p>

                            {/* Commissioning Checklist / Field Notes */}
                            <div className="mt-8 border-2 border-foreground bg-surface p-6">
                                <span className="font-mono text-xs font-bold tracking-widest text-[var(--primary)] uppercase block pb-3 border-b border-border">
                                    ENGAGEMENT PARAMETERS //
                                </span>
                                <ul className="mt-4 space-y-2.5 font-mono text-xs text-foreground/80">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--primary)] font-bold">01.</span>
                                        <span>Full-Stack Web Platforms & Distributed Systems</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--primary)] font-bold">02.</span>
                                        <span>Laravel 11, React 19, TypeScript, Tailwind</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--primary)] font-bold">03.</span>
                                        <span>High-Conversion Editorial UX & Performance Audits</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--primary)] font-bold">04.</span>
                                        <span>Guaranteed Response SLA within 24 Hours</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Direct Communication Channels */}
                            <div className="mt-8 divide-y divide-border border-y border-border font-mono text-xs">
                                {emailAddress ? (
                                    <div className="py-4 flex items-center justify-between">
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
                                    <div className="py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Envelope1 className="h-4 w-4 text-[var(--primary)]" />
                                            <span className="text-muted-foreground uppercase">TRANSMISSION:</span>
                                        </div>
                                        <span className="font-bold text-[var(--primary)]">
                                            DISPATCH FORM [MONITORED]
                                        </span>
                                    </div>
                                )}

                                {phone && (
                                    <div className="py-4 flex items-center justify-between">
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
                                    <div className="py-4 flex items-center justify-between">
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
                                            DIRECT CHAT [↗]
                                        </a>
                                    </div>
                                )}

                                {bookingUrl && (
                                    <div className="py-4 flex items-center justify-between">
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
                                            SCHEDULE CALL [↗]
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Social Link List */}
                            {hasSocials && (
                                <div className="mt-8">
                                    <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase block mb-3">
                                        DIGITAL NETWORKS //
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {github && (
                                            <a
                                                href={github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="border border-border px-3 py-1 font-mono text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-1.5"
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
                                                className="border border-border px-3 py-1 font-mono text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-1.5"
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
                                                className="border border-border px-3 py-1 font-mono text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-1.5"
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
                                                className="border border-border px-3 py-1 font-mono text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-1.5"
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
                                                className="border border-border px-3 py-1 font-mono text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-1.5"
                                            >
                                                <Youtube className="h-3.5 w-3.5" />
                                                <span>YOUTUBE</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-border font-mono text-[10px] text-muted-foreground uppercase">
                            STAMP: ENCRYPTED HTTPS TRANSMISSION · RATE-LIMITED
                        </div>
                    </div>

                    {/* Right Column: Clean Ink-on-Paper Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="border-2 border-foreground bg-surface p-6 sm:p-10 shadow-sm">
                            <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-8">
                                <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                                    TRANSMISSION DISPATCH FORM //
                                </span>
                                <span className="stamp-orange text-[10px]">
                                    SECURE CHANNEL
                                </span>
                            </div>

                            {submittedSuccessfully ? (
                                <div className="border-2 border-[var(--primary)] bg-background p-8 text-center">
                                    <CheckCircle1 className="mx-auto h-12 w-12 text-[var(--primary)]" />
                                    <h3 className="mt-4 font-display text-2xl font-black text-foreground uppercase">
                                        TRANSMISSION RECEIVED.
                                    </h3>
                                    <p className="mt-2 font-mono text-xs text-muted-foreground uppercase leading-relaxed">
                                        Your dispatch has been written to the production database.
                                        I will evaluate your inquiry and respond within 24 hours.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSubmittedSuccessfully(false)}
                                        className="mt-6 border border-foreground px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                                    >
                                        TRANSMIT ANOTHER DISPATCH
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
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
                                                placeholder="e.g. Elena Rostova"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full border-2 bg-background px-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--primary)] focus:outline-hidden ${
                                                    errors.name ? 'border-red-500' : 'border-border'
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
                                                className={`w-full border-2 bg-background px-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--primary)] focus:outline-hidden ${
                                                    errors.email ? 'border-red-500' : 'border-border'
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
                                            SUBJECT // ARCHITECTURAL SCOPE
                                        </label>
                                        <input
                                            id="contact_subject"
                                            type="text"
                                            placeholder="e.g. Full-Stack Web Architecture Commission"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            className="w-full border-2 border-border bg-background px-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--primary)] focus:outline-hidden"
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
                                            className={`w-full border-2 bg-background px-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-[var(--primary)] focus:outline-hidden ${
                                                errors.message ? 'border-red-500' : 'border-border'
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
                                        <div className="border border-red-500 bg-red-500/10 p-3 font-mono text-xs text-red-500">
                                            {(errors as Record<string, string>).rate_limit}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[var(--primary)] py-4 font-mono text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                                        data-field-tag="SUBMIT"
                                    >
                                        {processing ? (
                                            <span>ENCRYPTING & TRANSMITTING...</span>
                                        ) : (
                                            <>
                                                <span>TRANSMIT DISPATCH</span>
                                                <span>[→]</span>
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
