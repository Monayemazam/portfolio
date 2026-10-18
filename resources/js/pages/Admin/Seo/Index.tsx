import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    FormField,
    FormInput,
    FormTextarea,
    MediaPicker,
    StickySaveBar,
} from '@/components/Admin';
import { Button } from '@/components/ui/button';
import type { SeoMetaItem, MediaItem } from '@/types/admin';
import { Globe, Plus, Trash2, Search, Share2 } from 'lucide-react';

interface Props {
    seo: SeoMetaItem;
}

export default function SeoIndex({ seo }: Props) {
    const [selectedOgImage, setSelectedOgImage] = useState<MediaItem | null>(
        seo.og_image ?? null,
    );

    const initialSameAs = Array.isArray(seo.person_same_as)
        ? seo.person_same_as
        : [];

    const { data, setData, put, processing, errors, isDirty } = useForm({
        meta_title: seo.meta_title || '',
        meta_description: seo.meta_description || '',
        og_image_media_id: seo.og_image_media_id,
        canonical_url: seo.canonical_url || '',
        person_job_title: seo.person_job_title || '',
        person_same_as:
            initialSameAs.length > 0 ? initialSameAs : ['https://github.com/'],
        robots: seo.robots || 'index,follow',
    });

    const handleAddSameAs = () => {
        setData('person_same_as', [...data.person_same_as, 'https://']);
    };

    const handleUpdateSameAs = (index: number, val: string) => {
        const updated = [...data.person_same_as];
        updated[index] = val;
        setData('person_same_as', updated);
    };

    const handleRemoveSameAs = (index: number) => {
        const updated = data.person_same_as.filter((_, idx) => idx !== index);
        setData('person_same_as', updated);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const payload = {
            ...data,
            og_image_media_id: selectedOgImage?.id ?? null,
            person_same_as: data.person_same_as.filter((u) => u.trim() !== ''),
        };

        put('/admin/seo', {
            ...payload,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            title="SEO & Structured Data"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'SEO & Meta' },
            ]}
        >
            <form onSubmit={handleSubmit} className="space-y-6 pb-24">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-wider text-[var(--text)] sm:text-3xl">
                            SEO & STRUCTURED METADATA
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Configure Open Graph cards, Google SERP snippets,
                            canonical directives, and JSON-LD Person schema.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Form: 2 Cols */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Meta Title and Description */}
                        <div className="space-y-5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                SEARCH ENGINE INDEXING
                            </h2>

                            {/* Title with 70 max counter */}
                            <FormField
                                label="Page Meta Title"
                                required
                                error={errors.meta_title}
                                hint={`${data.meta_title.length}/70 characters`}
                            >
                                <div className="space-y-1">
                                    <FormInput
                                        maxLength={70}
                                        value={data.meta_title}
                                        onChange={(e) =>
                                            setData(
                                                'meta_title',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Monayem Azam | Full-Stack Web Developer & Solutions Architect"
                                        hasError={Boolean(errors.meta_title)}
                                    />
                                    <div className="flex justify-end">
                                        <span
                                            className={`font-['JetBrains_Mono',monospace] text-[10px] ${
                                                data.meta_title.length > 60
                                                    ? 'font-bold text-[var(--warning)]'
                                                    : 'text-[var(--text-muted)]'
                                            }`}
                                        >
                                            {70 - data.meta_title.length} chars
                                            remaining
                                        </span>
                                    </div>
                                </div>
                            </FormField>

                            {/* Description with 170 max counter */}
                            <FormField
                                label="Page Meta Description"
                                required
                                error={errors.meta_description}
                                hint={`${data.meta_description.length}/170 characters`}
                            >
                                <div className="space-y-1">
                                    <FormTextarea
                                        rows={3}
                                        maxLength={170}
                                        value={data.meta_description}
                                        onChange={(e) =>
                                            setData(
                                                'meta_description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Summary indexed by search engines and displayed under SERP links..."
                                        hasError={Boolean(
                                            errors.meta_description,
                                        )}
                                    />
                                    <div className="flex justify-end">
                                        <span
                                            className={`font-['JetBrains_Mono',monospace] text-[10px] ${
                                                data.meta_description.length >
                                                150
                                                    ? 'font-bold text-[var(--warning)]'
                                                    : 'text-[var(--text-muted)]'
                                            }`}
                                        >
                                            {170 - data.meta_description.length}{' '}
                                            chars remaining
                                        </span>
                                    </div>
                                </div>
                            </FormField>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField
                                    label="Canonical URL"
                                    error={errors.canonical_url}
                                >
                                    <FormInput
                                        type="url"
                                        value={data.canonical_url}
                                        onChange={(e) =>
                                            setData(
                                                'canonical_url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://monayem.space"
                                        hasError={Boolean(errors.canonical_url)}
                                    />
                                </FormField>

                                <FormField
                                    label="Robots Directive"
                                    required
                                    error={errors.robots}
                                >
                                    <select
                                        value={data.robots}
                                        onChange={(e) =>
                                            setData('robots', e.target.value)
                                        }
                                        className="h-12 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-3 text-xs text-[var(--text)] focus:outline-none"
                                    >
                                        <option value="index,follow">
                                            index, follow (Standard Public)
                                        </option>
                                        <option value="noindex,follow">
                                            noindex, follow (Staging / Private)
                                        </option>
                                        <option value="noindex,nofollow">
                                            noindex, nofollow (Complete
                                            Disallow)
                                        </option>
                                    </select>
                                </FormField>
                            </div>
                        </div>

                        {/* Open Graph Image */}
                        <div className="space-y-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                OPEN GRAPH & SOCIAL SHARE CARD (1200 × 630 PX)
                            </h2>
                            <p className="text-xs text-[var(--text-muted)]">
                                High-contrast share graphic loaded when
                                portfolio links are sent on LinkedIn, Twitter,
                                or Discord.
                            </p>
                            <MediaPicker
                                value={selectedOgImage}
                                onChange={(med) => setSelectedOgImage(med)}
                                acceptedType="image"
                                label="Select Share Image (1200×630)"
                            />
                        </div>

                        {/* JSON-LD Structured Data (Person Schema) */}
                        <div className="space-y-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                        JSON-LD PERSON SCHEMA (STRUCTURED DATA)
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                        Helps Google build knowledge panels and
                                        associate Monayem's developer identity.
                                    </p>
                                </div>
                            </div>

                            <FormField
                                label="Professional Job Title"
                                error={errors.person_job_title}
                            >
                                <FormInput
                                    value={data.person_job_title}
                                    onChange={(e) =>
                                        setData(
                                            'person_job_title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Full-Stack Web Developer & Solutions Architect"
                                    hasError={Boolean(errors.person_job_title)}
                                />
                            </FormField>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[var(--text-muted)] uppercase">
                                        SameAs Profiles & Social Identifiers:
                                    </label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={handleAddSameAs}
                                        className="h-7 border-[var(--surface-border)] text-xs"
                                    >
                                        <Plus className="mr-1 h-3 w-3" />
                                        Add Link
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {data.person_same_as.map((url, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2"
                                        >
                                            <FormInput
                                                type="url"
                                                value={url}
                                                onChange={(e) =>
                                                    handleUpdateSameAs(
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="https://github.com/monayem"
                                                className="text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSameAs(idx)
                                                }
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--surface-border)] text-[var(--danger)] hover:bg-[var(--danger)]/10"
                                                title="Remove profile link"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Live Visual Previews: 1 Col */}
                    <div className="space-y-6">
                        {/* SERP Snippet Preview */}
                        <div className="space-y-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-[var(--secondary)]" />
                                <h3 className="font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-[var(--text)]">
                                    SERP PREVIEW (GOOGLE)
                                </h3>
                            </div>

                            <div className="space-y-1 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-4 font-sans">
                                <p className="truncate text-[11px] text-[var(--text-muted)]">
                                    {data.canonical_url ||
                                        'https://monayem.space'}
                                </p>
                                <h4 className="line-clamp-1 cursor-pointer text-sm font-semibold text-[var(--secondary)] hover:underline">
                                    {data.meta_title ||
                                        'Monayem Azam | Portfolio'}
                                </h4>
                                <p className="line-clamp-3 text-xs text-[var(--text-muted)]">
                                    {data.meta_description ||
                                        'Page meta description indexed by search engine crawlers.'}
                                </p>
                            </div>
                        </div>

                        {/* Social Share Preview Card */}
                        <div className="space-y-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-[var(--secondary)]" />
                                <h3 className="font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-[var(--text)]">
                                    SOCIAL CARD PREVIEW
                                </h3>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                                <div className="flex h-36 w-full items-center justify-center overflow-hidden border-b border-[var(--surface-border)] bg-[var(--surface)]">
                                    {selectedOgImage?.url ? (
                                        <img
                                            src={selectedOgImage.url}
                                            alt={
                                                selectedOgImage.alt_text ||
                                                'Share Preview'
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 text-center text-[var(--text-muted)]">
                                            <Globe className="h-8 w-8 text-[var(--secondary)]/50" />
                                            <span className="mt-2 font-['Orbitron',sans-serif] text-[10px]">
                                                NO SHARE IMAGE ATTACHED
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 p-3">
                                    <p className="font-['JetBrains_Mono',monospace] text-[9px] tracking-wider text-[var(--secondary)] uppercase">
                                        MONAYEM.SPACE
                                    </p>
                                    <h5 className="line-clamp-1 font-['Orbitron',sans-serif] text-xs font-bold text-[var(--text)]">
                                        {data.meta_title || 'Monayem Azam'}
                                    </h5>
                                    <p className="line-clamp-2 text-[11px] text-[var(--text-muted)]">
                                        {data.meta_description ||
                                            'Meta description.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <StickySaveBar
                    isDirty={isDirty}
                    isSaving={processing}
                    onSave={() => handleSubmit()}
                    onDiscard={() => window.history.back()}
                    saveLabel="Save SEO Metadata"
                />
            </form>
        </AdminLayout>
    );
}
