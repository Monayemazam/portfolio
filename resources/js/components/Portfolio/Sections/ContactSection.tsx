import React, { useState } from 'react';
import {
    Envelope1,
    Phone,
    Whatsapp,
    CalendarDays,
    ArrowRight,
    CheckCircle1,
} from 'lineicons-react';
import { PortfolioSection, PortfolioSettings } from '@/types/portfolio';
import GlassPanel from '../Shared/GlassPanel';
import SectionHeading from '../Shared/SectionHeading';
import Button from '../Shared/Button';
import { FormInput, FormTextarea } from '../Shared/FormInput';

interface ContactSectionProps {
    section: PortfolioSection;
    settings: PortfolioSettings;
}

export default function ContactSection({
    section,
    settings,
}: ContactSectionProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const emailAddress = settings.contact_email;
    const phone = settings.contact_phone;
    const whatsapp = settings.whatsapp_number;
    const bookingUrl = settings.booking_url;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Fallback mailto action if contact submission API is not built until Prompt 10
        if (emailAddress) {
            const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
                subject || 'Mission Inquiry',
            )}&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}`,
            )}`;
            window.location.href = mailtoUrl;
        }
        setSubmitted(true);
    };

    return (
        <section
            id="contact"
            aria-label="Contact Open Channel"
            className="w-full px-4 py-16 md:px-8 md:py-24 lg:px-16"
        >
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    eyebrow={section.eyebrow || 'MISSION 09 / OPEN CHANNEL'}
                    title={section.title || 'Establish Direct Communication'}
                    subtitle={
                        section.subtitle ||
                        'Open channel for engineering inquiries, mission briefings, architecture consultations, or contract missions.'
                    }
                    highlightWord="Communication"
                />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left: Contact Form */}
                    <div className="section-reveal lg:col-span-7">
                        <GlassPanel
                            variant="card"
                            className="border-[var(--surface-border)]"
                        >
                            {submitted ? (
                                <div className="flex flex-col items-center py-12 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--success)]/40 bg-[var(--success)]/20 text-[var(--success)] shadow-[0_0_20px_var(--success)]">
                                        <CheckCircle1 className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-display text-xl font-bold text-[var(--text)]">
                                        Transmission Initiated
                                    </h3>
                                    <p className="mt-2 max-w-md font-sans text-sm text-[var(--text-muted)]">
                                        Your message dispatch has been prepared.
                                        We will establish connection within 24
                                        standard solar hours.
                                    </p>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6"
                                    >
                                        Send Another Transmission
                                    </Button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormInput
                                            label="Flight Call-Sign / Name"
                                            placeholder="Commander Jane Doe"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                        />
                                        <FormInput
                                            label="Transmission Frequency / Email"
                                            type="email"
                                            placeholder="jane@enterprise.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <FormInput
                                        label="Mission Subject"
                                        placeholder="Full-Stack Application Development"
                                        value={subject}
                                        onChange={(e) =>
                                            setSubject(e.target.value)
                                        }
                                        required
                                    />

                                    <FormTextarea
                                        label="Dispatch Payload / Message"
                                        placeholder="Describe your architectural scope, timeline, and goals..."
                                        rows={4}
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        required
                                    />

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            variant="cta"
                                            size="lg"
                                            icon={
                                                <ArrowRight className="h-4 w-4" />
                                            }
                                            className="w-full sm:w-auto"
                                        >
                                            Transmit Message
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </GlassPanel>
                    </div>

                    {/* Right: Direct Telemetry Links */}
                    <div className="section-reveal flex flex-col gap-4 lg:col-span-5">
                        {emailAddress && (
                            <GlassPanel
                                variant="subtle"
                                interactive
                                className="flex items-center gap-4 border-[var(--surface-border)] !p-5"
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/15 text-[var(--secondary)]">
                                    <Envelope1 className="h-6 w-6 text-[var(--secondary)]" />
                                </div>
                                <div className="overflow-hidden">
                                    <span className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                        DIRECT COMMS / EMAIL
                                    </span>
                                    <a
                                        href={`mailto:${emailAddress}`}
                                        className="block truncate font-mono text-sm text-[var(--text)] transition-colors hover:text-[var(--secondary)]"
                                    >
                                        {emailAddress}
                                    </a>
                                </div>
                            </GlassPanel>
                        )}

                        {phone && (
                            <GlassPanel
                                variant="subtle"
                                interactive
                                className="flex items-center gap-4 border-[var(--surface-border)] !p-5"
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/15 text-[var(--secondary)]">
                                    <Phone className="h-6 w-6 text-[var(--secondary)]" />
                                </div>
                                <div>
                                    <span className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                        VOICE FREQUENCY / PHONE
                                    </span>
                                    <a
                                        href={`tel:${phone}`}
                                        className="font-mono text-sm text-[var(--text)] transition-colors hover:text-[var(--secondary)]"
                                    >
                                        {phone}
                                    </a>
                                </div>
                            </GlassPanel>
                        )}

                        {whatsapp && (
                            <GlassPanel
                                variant="subtle"
                                interactive
                                className="flex items-center gap-4 border-[var(--surface-border)] !p-5"
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/15 text-[var(--success)]">
                                    <Whatsapp className="h-6 w-6 text-[var(--success)]" />
                                </div>
                                <div>
                                    <span className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                        INSTANT TELEMETRY / WHATSAPP
                                    </span>
                                    <a
                                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-sm text-[var(--text)] transition-colors hover:text-[var(--success)]"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </GlassPanel>
                        )}

                        {bookingUrl && (
                            <GlassPanel
                                variant="subtle"
                                interactive
                                className="flex items-center gap-4 border-[var(--surface-border)] !p-5"
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/15 text-[var(--accent)]">
                                    <CalendarDays className="h-6 w-6 text-[var(--accent)]" />
                                </div>
                                <div>
                                    <span className="block font-mono text-[10px] tracking-wider text-[var(--text-muted)] uppercase">
                                        ORBITAL BRIEFING / BOOK A CALL
                                    </span>
                                    <a
                                        href={bookingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-sm text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                                    >
                                        Schedule Flight Consultation
                                    </a>
                                </div>
                            </GlassPanel>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
