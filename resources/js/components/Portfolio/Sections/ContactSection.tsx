import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    ArrowAngularTopRight,
    CalendarDays,
    CheckCircle1,
    Envelope1,
    Facebook,
    Github,
    Linkedin,
    Phone,
    Sparkle,
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

    const eyebrow = section.eyebrow || 'START A CONVERSATION';
    const title =
        section.title || "Have an idea? Let's build something remarkable.";
    const subtitle =
        section.subtitle ||
        'Available for full-stack engineering, contract projects, architectural consulting, and technical advisory.';

    return (
        <section
            id="contact"
            aria-label="Contact Section"
            className="relative w-full overflow-hidden px-4 py-24 sm:px-6 sm:py-32 md:px-10 lg:px-16 lg:py-36 xl:px-20"
        >
            {/* Ambient Backlight Fields */}
            <div
                className="pointer-events-none absolute -bottom-20 left-1/3 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/10 blur-[150px]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute top-10 right-10 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[130px]"
                aria-hidden="true"
            />

            <div className="mx-auto w-full max-w-[1440px]">
                {/* Section Header */}
                <div className="mb-14 flex flex-col items-start max-w-3xl sm:mb-16">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                        <Sparkle className="h-3.5 w-3.5 text-[var(--secondary)]" />
                        <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[var(--secondary)] uppercase">
                            {eyebrow}
                        </span>
                    </div>

                    <h2 className="font-display text-[clamp(2.2rem,4.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight text-[var(--text)]">
                        {title}
                    </h2>

                    <p className="mt-4 font-sans text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                        {subtitle}
                    </p>
                </div>

                {/* Two-Column Contact Experience */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
                    {/* Left Column: Direct Invitation & Verified Channels */}
                    <div className="flex flex-col justify-between lg:col-span-5">
                        <div className="flex flex-col gap-6">
                            <p className="font-sans text-lg leading-relaxed text-[var(--text)]">
                                Whether you're exploring a new product launch,
                                scaling an enterprise platform, or seeking a
                                seasoned full-stack partner, I'm always open to
                                discussing high-impact digital initiatives.
                            </p>

                            {/* Direct Communication Channels */}
                            <div className="mt-4 flex flex-col gap-4">
                                {emailAddress && (
                                    <a
                                        href={`mailto:${emailAddress}`}
                                        className="group flex items-center gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--secondary)] hover:bg-[var(--surface-border)]/20"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] transition-transform group-hover:scale-110">
                                            <Envelope1 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                                Direct Email
                                            </div>
                                            <div className="font-display text-sm font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)] sm:text-base">
                                                {emailAddress}
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {phone && (
                                    <a
                                        href={`tel:${phone}`}
                                        className="group flex items-center gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--secondary)] hover:bg-[var(--surface-border)]/20"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] transition-transform group-hover:scale-110">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                                Phone Call
                                            </div>
                                            <div className="font-display text-sm font-bold text-[var(--text)] transition-colors group-hover:text-[var(--secondary)] sm:text-base">
                                                {phone}
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {whatsapp && (
                                    <a
                                        href={`https://wa.me/${whatsapp.replace(
                                            /\D/g,
                                            '',
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--success)] hover:bg-[var(--surface-border)]/20"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--success)] transition-transform group-hover:scale-110">
                                            <Whatsapp className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                                WhatsApp Chat
                                            </div>
                                            <div className="font-display text-sm font-bold text-[var(--text)] transition-colors group-hover:text-[var(--success)] sm:text-base">
                                                {whatsapp}
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {bookingUrl && (
                                    <a
                                        href={bookingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--surface-border)]/20"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--accent)] transition-transform group-hover:scale-110">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                                Schedule a Meeting
                                            </div>
                                            <div className="font-display text-sm font-bold text-[var(--text)] transition-colors group-hover:text-[var(--accent)] sm:text-base">
                                                Book a Strategy Call ↗
                                            </div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Social Profiles */}
                        {hasSocials && (
                            <div className="mt-8 border-t border-[var(--surface-border)]/40 pt-6">
                                <span className="block font-mono text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                    Verified Networks
                                </span>
                                <div className="mt-3 flex flex-wrap gap-2.5">
                                    {github && (
                                        <a
                                            href={github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="GitHub Profile"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--text)] hover:scale-105"
                                        >
                                            <Github className="h-4 w-4" />
                                        </a>
                                    )}
                                    {linkedin && (
                                        <a
                                            href={linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="LinkedIn Profile"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--text)] hover:scale-105"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {facebook && (
                                        <a
                                            href={facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook Profile"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--text)] hover:scale-105"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </a>
                                    )}
                                    {twitter && (
                                        <a
                                            href={twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="X Twitter Profile"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--text)] hover:scale-105"
                                        >
                                            <X className="h-4 w-4" />
                                        </a>
                                    )}
                                    {youtube && (
                                        <a
                                            href={youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="YouTube Channel"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-all hover:border-[var(--secondary)] hover:text-[var(--text)] hover:scale-105"
                                        >
                                            <Youtube className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Spacious, Beautifully Styled Form */}
                    <div className="lg:col-span-7">
                        <div className="relative rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                            {submittedSuccessfully ? (
                                <div className="flex flex-col items-center py-12 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--success)]/40 bg-[var(--success)]/20 text-[var(--success)] shadow-[0_0_30px_rgba(52,211,153,0.35)]">
                                        <CheckCircle1 className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-[var(--text)]">
                                        Message Dispatched
                                    </h3>
                                    <p className="mt-3 max-w-md font-sans text-base leading-relaxed text-[var(--text-muted)]">
                                        Thank you for reaching out! Your message
                                        has been securely stored. I review every
                                        dispatch and will get back to you
                                        within 24 hours.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSubmittedSuccessfully(false)
                                        }
                                        className="mt-8 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-6 py-2.5 font-sans text-sm font-semibold text-[var(--text)] transition-all hover:border-[var(--secondary)] hover:text-[var(--secondary)]"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-6"
                                >
                                    {/* Honeypot field (hidden from real users) */}
                                    <div
                                        className="absolute -top-[9999px] -left-[9999px] opacity-0 pointer-events-none"
                                        aria-hidden="true"
                                    >
                                        <input
                                            type="text"
                                            name="company_hp"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={data.company_hp}
                                            onChange={(e) =>
                                                setData(
                                                    'company_hp',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    {/* Name & Email */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="contact-name"
                                                className="font-mono text-xs font-semibold tracking-wider text-[var(--text)] uppercase"
                                            >
                                                Your Name{' '}
                                                <span className="text-[var(--accent)]">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                required
                                                placeholder="e.g. Sarah Jenkins"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-xl border bg-[var(--bg-elevated)] px-4 py-3 font-sans text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 transition-all focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none sm:text-base ${
                                                    errors.name
                                                        ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                                                        : 'border-[var(--surface-border)] focus:border-[var(--secondary)]'
                                                }`}
                                            />
                                            {errors.name && (
                                                <span className="font-mono text-xs text-[var(--danger)]">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="contact-email"
                                                className="font-mono text-xs font-semibold tracking-wider text-[var(--text)] uppercase"
                                            >
                                                Email Address{' '}
                                                <span className="text-[var(--accent)]">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id="contact-email"
                                                type="email"
                                                required
                                                placeholder="sarah@company.com"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`w-full rounded-xl border bg-[var(--bg-elevated)] px-4 py-3 font-sans text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 transition-all focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none sm:text-base ${
                                                    errors.email
                                                        ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                                                        : 'border-[var(--surface-border)] focus:border-[var(--secondary)]'
                                                }`}
                                            />
                                            {errors.email && (
                                                <span className="font-mono text-xs text-[var(--danger)]">
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="contact-subject"
                                            className="font-mono text-xs font-semibold tracking-wider text-[var(--text)] uppercase"
                                        >
                                            Subject / Project Scope
                                        </label>
                                        <input
                                            id="contact-subject"
                                            type="text"
                                            placeholder="e.g. Next-Gen Web Application Development"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    'subject',
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full rounded-xl border bg-[var(--bg-elevated)] px-4 py-3 font-sans text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 transition-all focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none sm:text-base ${
                                                errors.subject
                                                    ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                                                    : 'border-[var(--surface-border)] focus:border-[var(--secondary)]'
                                            }`}
                                        />
                                        {errors.subject && (
                                            <span className="font-mono text-xs text-[var(--danger)]">
                                                {errors.subject}
                                            </span>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="contact-message"
                                            className="font-mono text-xs font-semibold tracking-wider text-[var(--text)] uppercase"
                                        >
                                            Your Message{' '}
                                            <span className="text-[var(--accent)]">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            rows={5}
                                            required
                                            placeholder="Tell me about your project, timeline, deliverables, and architecture requirements..."
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    'message',
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full rounded-xl border bg-[var(--bg-elevated)] p-4 font-sans text-sm text-[var(--text)] placeholder-[var(--text-muted)]/50 transition-all focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none sm:text-base ${
                                                errors.message
                                                    ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                                                    : 'border-[var(--surface-border)] focus:border-[var(--secondary)]'
                                            }`}
                                        />
                                        {errors.message && (
                                            <span className="font-mono text-xs text-[var(--danger)]">
                                                {errors.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rate Limit Error */}
                                    {(errors as Record<string, string>).rate_limit && (
                                        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 font-mono text-xs text-[var(--danger)]">
                                            {(errors as Record<string, string>).rate_limit}
                                        </div>
                                    )}

                                    {/* Submit Action */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[#f59e0b] px-8 py-4 font-sans text-base font-bold text-[#080d1c] shadow-[0_0_25px_rgba(255,181,71,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,181,71,0.5)] active:scale-95 disabled:opacity-50 sm:w-auto"
                                        >
                                            {processing ? (
                                                <span>Transmitting...</span>
                                            ) : (
                                                <>
                                                    <span>Send Message</span>
                                                    <ArrowAngularTopRight className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
