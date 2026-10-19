import React, { useMemo, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import ProjectDetailPanel from '@/components/Portfolio/Projects/ProjectDetailPanel';
import {
    FormField,
    FormInput,
    FormTextarea,
    MediaPicker,
    MediaLibraryModal,
    PlanetPreview,
    PlanetStyleSelector,
    PublishToggle,
    StickySaveBar,
    PLANET_STYLE_OPTIONS,
} from '@/components/Admin';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type {
    ProjectItem,
    PlanetStyle,
    TagItem,
    ProjectFeatureItem,
    ProjectMediaItem,
    MediaItem,
} from '@/types/admin';
import {
    ArrowLeft,
    Plus,
    Trash2,
    MoveUp,
    MoveDown,
    FileText,
    Image as ImageIcon,
    Sliders,
    Eye,
    Globe,
    X,
    Star,
    Clipboard,
    Search,
    Video,
} from 'lucide-react';

interface Props {
    project: ProjectItem | null;
    availableTags: TagItem[];
}

export default function ProjectForm({ project, availableTags }: Props) {
    const isEdit = Boolean(project?.id);
    const [activeTab, setActiveTab] = useState<
        'details' | 'features' | 'media' | 'seo'
    >('details');

    // Media library modal for gallery attachments
    const [mediaModalOpen, setMediaModalOpen] = useState(false);

    // Bulk features parser modal
    const [bulkFeaturesModalOpen, setBulkFeaturesModalOpen] = useState(false);
    const [bulkPasteText, setBulkPasteText] = useState('');
    const [bulkDefaultGroup, setBulkDefaultGroup] =
        useState('Core Architecture');

    // Preview panel placeholder modal
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

    // Tag creation input
    const [tagSearch, setTagSearch] = useState('');
    const [tagSuggestionsOpen, setTagSuggestionsOpen] = useState(false);

    // Slug auto-generation state
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);

    const initialFeatures: ProjectFeatureItem[] =
        project?.features?.map((f, idx) => ({
            id: f.id,
            project_id: f.project_id,
            group_label: f.group_label || 'General',
            text: f.text,
            sort_order: f.sort_order ?? idx,
        })) ?? [];

    const initialMedia: ProjectMediaItem[] =
        project?.project_media?.map((m, idx) => ({
            id: m.id,
            project_id: m.project_id,
            media_id: m.media_id,
            kind: m.kind || 'desktop',
            caption: m.caption || '',
            sort_order: m.sort_order ?? idx,
            media: m.media,
        })) ?? [];

    const initialTags: TagItem[] =
        project?.tags?.map((t, idx) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            sort_order: t.pivot?.sort_order ?? idx,
        })) ?? [];

    const { data, setData, post, put, processing, errors, isDirty } = useForm({
        title: project?.title ?? '',
        slug: project?.slug ?? '',
        summary: project?.summary ?? '',
        description: project?.description ?? '',
        business_type: project?.business_type ?? '',
        role: project?.role ?? '',
        year: project?.year ?? new Date().getFullYear(),
        live_url: project?.live_url ?? 'https://',
        planet_style: (project?.planet_style ?? 'generic') as PlanetStyle,
        accent_color: project?.accent_color ?? '#22D3EE',
        cover_media_id: project?.cover_media_id ?? null,
        show_live_preview: project?.show_live_preview ?? false,
        is_featured: project?.is_featured ?? false,
        is_published: project?.is_published ?? true,
        sort_order: project?.sort_order ?? 0,
        tags: initialTags,
        features: initialFeatures,
        media: initialMedia,
    });

    const [coverMediaObject, setCoverMediaObject] = useState<MediaItem | null>(
        project?.cover_media ?? null,
    );

    const previewProjectItem = useMemo(() => {
        const mappedMedia: MediaItem[] = data.media
            .map((m) => m.media)
            .filter((m): m is MediaItem => Boolean(m));

        return {
            id: project?.id ?? 99999,
            title: data.title || 'Untitled Project',
            slug: data.slug || 'preview-project',
            summary: data.summary || 'Project summary preview...',
            description: data.description || '',
            business_type: data.business_type || null,
            role: data.role || null,
            year: Number(data.year) || new Date().getFullYear(),
            live_url: data.live_url || 'https://',
            planet_style: data.planet_style || 'generic',
            accent_color: data.accent_color || '#22D3EE',
            cover_media_id: data.cover_media_id,
            cover_media: coverMediaObject,
            show_live_preview: Boolean(data.show_live_preview),
            is_featured: Boolean(data.is_featured),
            is_published: Boolean(data.is_published),
            sort_order: Number(data.sort_order) || 0,
            tags: data.tags,
            features: data.features.map((f, i) => ({
                id: f.id ?? i + 1,
                project_id: project?.id ?? 99999,
                group_label: f.group_label || 'General',
                text: f.text,
                sort_order: f.sort_order ?? i,
            })),
            media:
                mappedMedia.length > 0
                    ? mappedMedia
                    : coverMediaObject
                      ? [coverMediaObject]
                      : [],
        };
    }, [data, project?.id, coverMediaObject]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            title: val,
            slug: !slugManuallyEdited ? generateSlug(val) : prev.slug,
        }));
    };

    // Tag management
    const handleAddExistingTag = (tag: TagItem) => {
        if (
            data.tags.some(
                (t) =>
                    t.id === tag.id ||
                    t.name.toLowerCase() === tag.name.toLowerCase(),
            )
        ) {
            setTagSearch('');
            setTagSuggestionsOpen(false);
            return;
        }

        const updated = [
            ...data.tags,
            { ...tag, sort_order: data.tags.length },
        ];
        setData('tags', updated);
        setTagSearch('');
        setTagSuggestionsOpen(false);
    };

    const handleCreateNewTag = () => {
        const trimmed = tagSearch.trim();
        if (!trimmed) return;

        if (
            data.tags.some(
                (t) => t.name.toLowerCase() === trimmed.toLowerCase(),
            )
        ) {
            setTagSearch('');
            setTagSuggestionsOpen(false);
            return;
        }

        const newTag: TagItem = {
            id: 0,
            name: trimmed,
            slug: generateSlug(trimmed),
            sort_order: data.tags.length,
        };

        setData('tags', [...data.tags, newTag]);
        setTagSearch('');
        setTagSuggestionsOpen(false);
    };

    const handleRemoveTag = (index: number) => {
        const updated = data.tags.filter((_, idx) => idx !== index);
        setData('tags', updated);
    };

    // Features management
    const handleAddFeature = () => {
        const defaultGroup =
            data.features.length > 0
                ? data.features[data.features.length - 1].group_label
                : 'Core Features';

        const newItem: ProjectFeatureItem = {
            group_label: defaultGroup,
            text: '',
            sort_order: data.features.length,
        };
        setData('features', [...data.features, newItem]);
    };

    const handleUpdateFeature = (
        index: number,
        field: 'group_label' | 'text',
        val: string,
    ) => {
        const updated = [...data.features];
        updated[index] = {
            ...updated[index],
            [field]: val,
        };
        setData('features', updated);
    };

    const handleRemoveFeature = (index: number) => {
        const updated = data.features.filter((_, idx) => idx !== index);
        setData('features', updated);
    };

    const handleParseBulkFeatures = (mode: 'append' | 'replace') => {
        if (!bulkPasteText.trim()) return;

        const lines = bulkPasteText.split('\n');
        let currentGroup = bulkDefaultGroup.trim() || 'General';
        const parsed: ProjectFeatureItem[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.endsWith(':')) {
                currentGroup = trimmed.slice(0, -1).trim() || currentGroup;
                continue;
            }

            const cleanText = trimmed.replace(/^[-*•\d+.]\s*/, '');
            if (cleanText) {
                parsed.push({
                    group_label: currentGroup,
                    text: cleanText,
                    sort_order: parsed.length,
                });
            }
        }

        if (mode === 'replace') {
            setData(
                'features',
                parsed.map((item, idx) => ({ ...item, sort_order: idx })),
            );
        } else {
            const combined = [
                ...data.features,
                ...parsed.map((item, idx) => ({
                    ...item,
                    sort_order: data.features.length + idx,
                })),
            ];
            setData('features', combined);
        }

        setBulkPasteText('');
        setBulkFeaturesModalOpen(false);
    };

    // Media management
    const handleAttachMedia = (media: MediaItem) => {
        const kind: 'desktop' | 'mobile' | 'video' | 'other' =
            media.type === 'video'
                ? 'video'
                : data.media.some((m) => m.kind === 'desktop')
                  ? 'mobile'
                  : 'desktop';

        const newItem: ProjectMediaItem = {
            media_id: media.id,
            kind,
            caption: media.alt_text || '',
            sort_order: data.media.length,
            media,
        };

        setData('media', [...data.media, newItem]);
        setMediaModalOpen(false);
    };

    const handleUpdateMediaKind = (
        index: number,
        kind: 'desktop' | 'mobile' | 'video' | 'other',
    ) => {
        const updated = [...data.media];
        updated[index] = { ...updated[index], kind };
        setData('media', updated);
    };

    const handleUpdateMediaCaption = (index: number, caption: string) => {
        const updated = [...data.media];
        updated[index] = { ...updated[index], caption };
        setData('media', updated);
    };

    const handleRemoveMedia = (index: number) => {
        const updated = data.media.filter((_, idx) => idx !== index);
        setData('media', updated);
    };

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Sanitize tags payload
        const formattedTags = data.tags.map((t, idx) => ({
            id: t.id > 0 ? t.id : undefined,
            name: t.name,
            sort_order: idx,
        }));

        const payload = {
            ...data,
            tags: formattedTags,
            year: data.year ? Number(data.year) : null,
            cover_media_id: coverMediaObject?.id ?? null,
        };

        if (isEdit && project) {
            put(`/admin/projects/${project.id}`, {
                ...payload,
                preserveScroll: true,
            });
        } else {
            post('/admin/projects', {
                ...payload,
                preserveScroll: true,
            });
        }
    };

    const filteredSuggestions = availableTags.filter(
        (t) =>
            t.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
            !data.tags.some(
                (selected) =>
                    selected.name.toLowerCase() === t.name.toLowerCase(),
            ),
    );

    return (
        <AdminLayout
            title={isEdit ? `Edit: ${project?.title}` : 'New Project'}
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Projects', href: '/admin/projects' },
                { title: isEdit ? 'Edit Project' : 'New Project' },
            ]}
        >
            <form onSubmit={handleSubmit} className="space-y-6 pb-24">
                {/* Header with back button, title, and preview panel trigger */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/projects"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--secondary)] hover:text-[var(--text)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="font-['Orbitron',sans-serif] text-xl font-bold tracking-wider text-[var(--text)] sm:text-2xl">
                                {isEdit
                                    ? `EDIT PROJECT: ${project?.title}`
                                    : 'CREATE CELESTIAL PROJECT'}
                            </h1>
                            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                Configure the 3D celestial body, orbital
                                attributes, grouped features, and media
                                showcase.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPreviewModalOpen(true)}
                            className="border-[var(--secondary)] font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-[var(--secondary)] hover:bg-[var(--secondary)]/15"
                        >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            PREVIEW PANEL
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-[var(--surface-border)]">
                    <button
                        type="button"
                        onClick={() => setActiveTab('details')}
                        className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all ${
                            activeTab === 'details'
                                ? 'border-[var(--secondary)] text-[var(--secondary)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                    >
                        <Sliders className="h-4 w-4" />
                        <span>Details & Style</span>
                        {errors.title ||
                        errors.slug ||
                        errors.summary ||
                        errors.live_url ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
                        ) : null}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('features')}
                        className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all ${
                            activeTab === 'features'
                                ? 'border-[var(--secondary)] text-[var(--secondary)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        <span>Features</span>
                        <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                            {data.features.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('media')}
                        className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all ${
                            activeTab === 'media'
                                ? 'border-[var(--secondary)] text-[var(--secondary)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                    >
                        <ImageIcon className="h-4 w-4" />
                        <span>Media Gallery</span>
                        <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                            {data.media.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('seo')}
                        className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all ${
                            activeTab === 'seo'
                                ? 'border-[var(--secondary)] text-[var(--secondary)]'
                                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                    >
                        <Globe className="h-4 w-4" />
                        <span>SEO & Previews</span>
                    </button>
                </div>

                {/* ===================== TAB 1: DETAILS ===================== */}
                {activeTab === 'details' && (
                    <div className="space-y-6">
                        {/* Core Identification Card */}
                        <div className="space-y-5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                CORE METADATA
                            </h2>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {/* Title */}
                                <FormField
                                    label="Project Title"
                                    required
                                    error={errors.title}
                                    hint="Displayed prominently across orbits & sheets"
                                >
                                    <FormInput
                                        value={data.title}
                                        onChange={(e) =>
                                            handleTitleChange(e.target.value)
                                        }
                                        placeholder="e.g. Mercury Bangladesh"
                                        hasError={Boolean(errors.title)}
                                    />
                                </FormField>

                                {/* Slug */}
                                <FormField
                                    label="URL Slug (Anchor Link)"
                                    required
                                    error={errors.slug}
                                    hint="Used for /#slug deep linking"
                                >
                                    <div className="relative">
                                        <FormInput
                                            value={data.slug}
                                            onChange={(e) => {
                                                setSlugManuallyEdited(true);
                                                setData('slug', e.target.value);
                                            }}
                                            placeholder="e.g. mercury-bangladesh"
                                            hasError={Boolean(errors.slug)}
                                        />
                                    </div>
                                </FormField>
                            </div>

                            {/* Summary with 300 char counter */}
                            <FormField
                                label="Summary (Max 300 Characters)"
                                required
                                error={errors.summary}
                                hint={`${data.summary.length}/300 characters`}
                            >
                                <div className="space-y-1">
                                    <FormTextarea
                                        rows={3}
                                        maxLength={300}
                                        value={data.summary}
                                        onChange={(e) =>
                                            setData('summary', e.target.value)
                                        }
                                        placeholder="Brief overview shown on planet hover card and solar orbit inspection..."
                                        hasError={Boolean(errors.summary)}
                                    />
                                    <div className="flex justify-end">
                                        <span
                                            className={`font-['JetBrains_Mono',monospace] text-[10px] ${
                                                data.summary.length > 280
                                                    ? 'font-bold text-[var(--warning)]'
                                                    : 'text-[var(--text-muted)]'
                                            }`}
                                        >
                                            {300 - data.summary.length} chars
                                            remaining
                                        </span>
                                    </div>
                                </div>
                            </FormField>

                            {/* Description */}
                            <FormField
                                label="Full Project Narrative (Detail Panel Description)"
                                error={errors.description}
                                hint="Detailed background, challenges solved, and architectural decisions"
                            >
                                <FormTextarea
                                    rows={5}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Comprehensive description rendered inside the slide-in drawer panel..."
                                    hasError={Boolean(errors.description)}
                                />
                            </FormField>

                            {/* Business Type, Role, Year, Live URL */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <FormField
                                    label="Business Type"
                                    error={errors.business_type}
                                >
                                    <FormInput
                                        value={data.business_type}
                                        onChange={(e) =>
                                            setData(
                                                'business_type',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Logistics & Freight"
                                        hasError={Boolean(errors.business_type)}
                                    />
                                </FormField>

                                <FormField
                                    label="Monayem's Role"
                                    error={errors.role}
                                >
                                    <FormInput
                                        value={data.role}
                                        onChange={(e) =>
                                            setData('role', e.target.value)
                                        }
                                        placeholder="e.g. Full-Stack Lead"
                                        hasError={Boolean(errors.role)}
                                    />
                                </FormField>

                                <FormField
                                    label="Launch Year"
                                    error={errors.year}
                                >
                                    <FormInput
                                        type="number"
                                        min={2000}
                                        max={2100}
                                        value={data.year || ''}
                                        onChange={(e) =>
                                            setData(
                                                'year',
                                                Number(e.target.value),
                                            )
                                        }
                                        placeholder="2024"
                                        hasError={Boolean(errors.year)}
                                    />
                                </FormField>

                                <FormField
                                    label="Live HTTPS URL"
                                    required
                                    error={errors.live_url}
                                    hint="Must start with https://"
                                >
                                    <FormInput
                                        type="url"
                                        value={data.live_url}
                                        onChange={(e) =>
                                            setData('live_url', e.target.value)
                                        }
                                        placeholder="https://client-domain.com"
                                        hasError={Boolean(errors.live_url)}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Planet Appearance & Celestial Customization */}
                        <div className="space-y-5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                        PLANET VISUAL STYLE & ACCENTS
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                        Select the procedural 3D celestial
                                        archetype for the solar system scene.
                                    </p>
                                </div>

                                {/* Dynamic Accent Color Picker */}
                                <div className="flex items-center gap-3">
                                    <label className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[var(--text-muted)]">
                                        ACCENT GLOW:
                                    </label>
                                    <div className="flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-1.5">
                                        <input
                                            type="color"
                                            value={
                                                data.accent_color || '#22D3EE'
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'accent_color',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                                            title="Choose Accent Hex"
                                        />
                                        <input
                                            type="text"
                                            maxLength={7}
                                            value={data.accent_color || ''}
                                            onChange={(e) =>
                                                setData(
                                                    'accent_color',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-20 bg-transparent font-['JetBrains_Mono',monospace] text-xs text-[var(--text)] uppercase focus:outline-none"
                                            placeholder="#22D3EE"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 7 Planet Styles Selector */}
                            <PlanetStyleSelector
                                value={data.planet_style}
                                onChange={(style) => {
                                    setData('planet_style', style);
                                    // If user hasn't explicitly set custom accent color or it matches previous style default, suggest style default
                                    const defaultAcc =
                                        PLANET_STYLE_OPTIONS.find(
                                            (s: { key: PlanetStyle }) =>
                                                s.key === style,
                                        )?.defaultAccent;
                                    if (defaultAcc) {
                                        setData((prev) => ({
                                            ...prev,
                                            planet_style: style,
                                            accent_color: defaultAcc,
                                        }));
                                    }
                                }}
                                accentColor={data.accent_color}
                            />
                            {errors.planet_style && (
                                <p className="font-['JetBrains_Mono',monospace] text-xs text-[var(--danger)]">
                                    {errors.planet_style}
                                </p>
                            )}
                        </div>

                        {/* Cover Image & Visibility Toggles */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Cover Image Picker */}
                            <div className="space-y-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                                <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                    COVER IMAGE
                                </h2>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Primary 16:10 screenshot displayed on cards
                                    and detail panel headers.
                                </p>
                                <MediaPicker
                                    value={coverMediaObject}
                                    onChange={(med) => {
                                        setCoverMediaObject(med);
                                        setData(
                                            'cover_media_id',
                                            med?.id ?? null,
                                        );
                                    }}
                                    acceptedType="image"
                                    label="Select Cover Image"
                                />
                            </div>

                            {/* Status Toggles Card */}
                            <div className="space-y-5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                                <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                    DISPLAY ATTRIBUTES
                                </h2>

                                <div className="space-y-4 divide-y divide-[var(--surface-border)]">
                                    {/* Published toggle */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div>
                                            <p className="text-xs font-semibold text-[var(--text)]">
                                                Published Status
                                            </p>
                                            <p className="text-[11px] text-[var(--text-muted)]">
                                                Visible on the public 3D solar
                                                system portfolio.
                                            </p>
                                        </div>
                                        <PublishToggle
                                            checked={data.is_published}
                                            onChange={(checked) =>
                                                setData('is_published', checked)
                                            }
                                        />
                                    </div>

                                    {/* Featured toggle */}
                                    <div className="flex items-center justify-between pt-4">
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-xs font-semibold text-[var(--text)]">
                                                    Featured Planet
                                                </p>
                                                <Star className="h-3.5 w-3.5 fill-[var(--secondary)] text-[var(--secondary)]" />
                                            </div>
                                            <p className="text-[11px] text-[var(--text-muted)]">
                                                Renders with enlarged radius
                                                (200px) and orbital prominence.
                                            </p>
                                        </div>
                                        <PublishToggle
                                            checked={data.is_featured}
                                            onChange={(checked) =>
                                                setData('is_featured', checked)
                                            }
                                            showStatusText={false}
                                        />
                                    </div>

                                    {/* Live preview iframe toggle */}
                                    <div className="flex items-center justify-between pt-4">
                                        <div>
                                            <p className="text-xs font-semibold text-[var(--text)]">
                                                Live Preview Iframe
                                            </p>
                                            <p className="text-[11px] text-[var(--text-muted)]">
                                                Enables interactive live site
                                                preview iframe in the detail
                                                drawer.
                                            </p>
                                        </div>
                                        <PublishToggle
                                            checked={data.show_live_preview}
                                            onChange={(checked) =>
                                                setData(
                                                    'show_live_preview',
                                                    checked,
                                                )
                                            }
                                            showStatusText={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags Management */}
                        <div className="space-y-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                        TECH STACK & TAGS
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                        Attach technologies and skills powering
                                        this project (saved in project_tag).
                                    </p>
                                </div>
                            </div>

                            {/* Active Tags Pills */}
                            <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]/50 p-2">
                                {data.tags.length === 0 ? (
                                    <span className="px-2 text-xs text-[var(--text-muted)] italic">
                                        No tags selected yet. Use the search
                                        input below to add tags.
                                    </span>
                                ) : (
                                    data.tags.map((tag, idx) => (
                                        <span
                                            key={`${tag.id}-${idx}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--secondary)]/40 bg-[var(--secondary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--text)]"
                                        >
                                            <span>{tag.name}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveTag(idx)
                                                }
                                                className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                                                title="Remove tag"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>

                            {/* Search and Select or Create Tag */}
                            <div className="relative">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            value={tagSearch}
                                            onChange={(e) => {
                                                setTagSearch(e.target.value);
                                                setTagSuggestionsOpen(true);
                                            }}
                                            onFocus={() =>
                                                setTagSuggestionsOpen(true)
                                            }
                                            placeholder="Search existing tags or type a new technology name..."
                                            className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] py-2.5 pr-4 pl-10 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--secondary)] focus:outline-none"
                                        />
                                    </div>

                                    {tagSearch.trim() && (
                                        <Button
                                            type="button"
                                            onClick={handleCreateNewTag}
                                            className="bg-[var(--secondary)] text-xs font-semibold text-black hover:bg-[var(--secondary)]/90"
                                        >
                                            <Plus className="mr-1 h-3.5 w-3.5" />
                                            Add "{tagSearch.trim()}"
                                        </Button>
                                    )}
                                </div>

                                {/* Autocomplete dropdown */}
                                {tagSuggestionsOpen &&
                                    filteredSuggestions.length > 0 && (
                                        <div className="absolute z-30 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-1.5 shadow-xl backdrop-blur-xl">
                                            {filteredSuggestions
                                                .slice(0, 10)
                                                .map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() =>
                                                            handleAddExistingTag(
                                                                tag,
                                                            )
                                                        }
                                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-[var(--text)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--secondary)]"
                                                    >
                                                        <span>{tag.name}</span>
                                                        <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                            /{tag.slug}
                                                        </span>
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===================== TAB 2: FEATURES ===================== */}
                {activeTab === 'features' && (
                    <div className="space-y-6 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                    GROUPED PROJECT FEATURES
                                </h2>
                                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                    Add, edit, reorder, and group feature bullet
                                    points shown in the detail inspection panel.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setBulkFeaturesModalOpen(true)
                                    }
                                    className="border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                >
                                    <Clipboard className="mr-1.5 h-3.5 w-3.5" />
                                    Bulk Paste Parser
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="bg-[var(--secondary)] text-xs font-semibold text-black hover:bg-[var(--secondary)]/90"
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    Add Feature Item
                                </Button>
                            </div>
                        </div>

                        {data.features.length === 0 ? (
                            <div className="space-y-3 rounded-xl border border-dashed border-[var(--surface-border)] p-10 text-center">
                                <FileText className="mx-auto h-8 w-8 text-[var(--text-muted)]" />
                                <p className="text-xs font-semibold text-[var(--text)]">
                                    No feature items added yet
                                </p>
                                <p className="mx-auto max-w-sm text-[11px] text-[var(--text-muted)]">
                                    You can either add features individually or
                                    use the Bulk Paste Parser to paste
                                    multi-line grouped bullet points.
                                </p>
                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <Button
                                        type="button"
                                        onClick={handleAddFeature}
                                        size="sm"
                                        className="bg-[var(--secondary)] text-black hover:bg-[var(--secondary)]/90"
                                    >
                                        <Plus className="mr-1 h-3.5 w-3.5" />
                                        Add First Feature
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setBulkFeaturesModalOpen(true)
                                        }
                                        className="border-[var(--surface-border)]"
                                    >
                                        Open Bulk Parser
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data.features.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-start gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-3.5 md:flex-row md:items-center"
                                    >
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[var(--secondary)]">
                                                #{idx + 1}
                                            </span>

                                            {/* Group Label Input */}
                                            <input
                                                type="text"
                                                value={feature.group_label}
                                                onChange={(e) =>
                                                    handleUpdateFeature(
                                                        idx,
                                                        'group_label',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Group Label"
                                                className="w-36 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                                            />
                                        </div>

                                        {/* Feature Text */}
                                        <div className="w-full flex-1">
                                            <input
                                                type="text"
                                                value={feature.text}
                                                onChange={(e) =>
                                                    handleUpdateFeature(
                                                        idx,
                                                        'text',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Feature description or capability..."
                                                className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] focus:border-[var(--secondary)] focus:outline-none"
                                            />
                                        </div>

                                        {/* Actions: Reorder up/down and remove */}
                                        <div className="flex shrink-0 items-center gap-1 self-end md:self-center">
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => {
                                                    if (idx === 0) return;
                                                    const updated = [
                                                        ...data.features,
                                                    ];
                                                    const temp = updated[idx];
                                                    updated[idx] =
                                                        updated[idx - 1];
                                                    updated[idx - 1] = temp;
                                                    setData(
                                                        'features',
                                                        updated,
                                                    );
                                                }}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-30"
                                                title="Move up"
                                            >
                                                <MoveUp className="h-3.5 w-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    idx ===
                                                    data.features.length - 1
                                                }
                                                onClick={() => {
                                                    if (
                                                        idx ===
                                                        data.features.length - 1
                                                    )
                                                        return;
                                                    const updated = [
                                                        ...data.features,
                                                    ];
                                                    const temp = updated[idx];
                                                    updated[idx] =
                                                        updated[idx + 1];
                                                    updated[idx + 1] = temp;
                                                    setData(
                                                        'features',
                                                        updated,
                                                    );
                                                }}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-30"
                                                title="Move down"
                                            >
                                                <MoveDown className="h-3.5 w-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveFeature(idx)
                                                }
                                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--surface-border)] text-[var(--danger)] hover:bg-[var(--danger)]/10"
                                                title="Delete feature"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===================== TAB 3: MEDIA GALLERY ===================== */}
                {activeTab === 'media' && (
                    <div className="space-y-6 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                    ATTACHED SHOWCASE MEDIA
                                </h2>
                                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                    Attach screenshots and videos from the media
                                    library (`desktop`, `mobile`, `video`, or
                                    `other`).
                                </p>
                            </div>

                            <Button
                                type="button"
                                onClick={() => setMediaModalOpen(true)}
                                className="bg-[var(--secondary)] text-xs font-semibold text-black hover:bg-[var(--secondary)]/90"
                            >
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Attach From Library
                            </Button>
                        </div>

                        {data.media.length === 0 ? (
                            <div className="space-y-3 rounded-xl border border-dashed border-[var(--surface-border)] p-10 text-center">
                                <ImageIcon className="mx-auto h-8 w-8 text-[var(--text-muted)]" />
                                <p className="text-xs font-semibold text-[var(--text)]">
                                    No media attachments yet
                                </p>
                                <p className="mx-auto max-w-sm text-[11px] text-[var(--text-muted)]">
                                    Attach high-resolution desktop and mobile
                                    viewport screenshots or project
                                    demonstration loops.
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => setMediaModalOpen(true)}
                                    size="sm"
                                    className="bg-[var(--secondary)] text-black hover:bg-[var(--secondary)]/90"
                                >
                                    Browse Media Library
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {data.media.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="relative flex flex-col gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Preview Thumbnail */}
                                            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--bg)]">
                                                {item.media?.type ===
                                                'video' ? (
                                                    <div className="flex h-full w-full items-center justify-center bg-black/40 text-[var(--secondary)]">
                                                        <Video className="h-6 w-6" />
                                                    </div>
                                                ) : item.media?.thumb_url ||
                                                  item.media?.url ? (
                                                    <img
                                                        src={
                                                            item.media
                                                                .thumb_url ||
                                                            item.media.url
                                                        }
                                                        alt={
                                                            item.caption ||
                                                            item.media
                                                                .original_name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
                                                        Media #{item.media_id}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Kind Selector & File Name */}
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <p className="truncate text-xs font-semibold text-[var(--text)]">
                                                    {item.media
                                                        ?.original_name ??
                                                        `Media #${item.media_id}`}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                                                        Kind:
                                                    </label>
                                                    <select
                                                        value={item.kind}
                                                        onChange={(e) =>
                                                            handleUpdateMediaKind(
                                                                idx,
                                                                e.target
                                                                    .value as
                                                                    | 'desktop'
                                                                    | 'mobile'
                                                                    | 'video'
                                                                    | 'other',
                                                            )
                                                        }
                                                        className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--text)] focus:outline-none"
                                                    >
                                                        <option value="desktop">
                                                            Desktop Screenshot
                                                        </option>
                                                        <option value="mobile">
                                                            Mobile Viewport
                                                        </option>
                                                        <option value="video">
                                                            Loop Video
                                                        </option>
                                                        <option value="other">
                                                            Other Asset
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveMedia(idx)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] text-[var(--danger)] hover:bg-[var(--danger)]/10"
                                                title="Remove media attachment"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Caption input */}
                                        <div>
                                            <input
                                                type="text"
                                                value={item.caption || ''}
                                                onChange={(e) =>
                                                    handleUpdateMediaCaption(
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Caption (e.g. Real-time cargo tracking interface)..."
                                                className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--secondary)] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===================== TAB 4: SEO & PREVIEWS ===================== */}
                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        {/* SERP Search Preview Card */}
                        <div className="space-y-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                SEARCH ENGINE SNIPPET PREVIEW (SERP)
                            </h2>
                            <p className="text-xs text-[var(--text-muted)]">
                                Visual representation of how this project URL
                                renders in search engine results.
                            </p>

                            <div className="max-w-2xl rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-4 font-sans">
                                <p className="text-xs text-[var(--text-muted)]">
                                    https://monayem.space/projects/
                                    {data.slug || 'slug'}
                                </p>
                                <h3 className="mt-1 cursor-pointer text-base font-semibold text-[var(--secondary)] hover:underline">
                                    {data.title || 'Project Title'} | Monayem
                                    Azam - Full-Stack Engineer
                                </h3>
                                <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">
                                    {data.summary ||
                                        'Summary description of the project, technical architecture, and impact...'}
                                </p>
                            </div>
                        </div>

                        {/* Social Share (Open Graph) Preview Card */}
                        <div className="space-y-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                SOCIAL SHARE PREVIEW (OPEN GRAPH)
                            </h2>
                            <p className="text-xs text-[var(--text-muted)]">
                                Preview rendered when this celestial project
                                link is shared across social platforms.
                            </p>

                            <div className="max-w-md overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                                <div className="flex h-44 w-full items-center justify-center overflow-hidden border-b border-[var(--surface-border)] bg-[var(--surface)]">
                                    {coverMediaObject ? (
                                        <img
                                            src={coverMediaObject.url}
                                            alt={
                                                coverMediaObject.alt_text ||
                                                'Cover'
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-[var(--text-muted)]">
                                            <PlanetPreview
                                                styleKey={data.planet_style}
                                                accentColor={data.accent_color}
                                                size={64}
                                            />
                                            <span className="mt-2 font-['Orbitron',sans-serif] text-[10px]">
                                                NO COVER IMAGE SELECTED
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 p-4">
                                    <p className="font-['JetBrains_Mono',monospace] text-[10px] tracking-wider text-[var(--secondary)] uppercase">
                                        MONAYEM.SPACE • CELESTIAL PORTFOLIO
                                    </p>
                                    <h4 className="font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                        {data.title || 'Untitled Project'}
                                    </h4>
                                    <p className="line-clamp-2 text-xs text-[var(--text-muted)]">
                                        {data.summary ||
                                            'Project overview and technical summary.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Planet Detail Inspection Panel Preview Action */}
                        <div className="space-y-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                        INTERACTIVE DETAIL PANEL PREVIEW
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                        Simulate the public drawer panel that
                                        slides in when visitors click this
                                        celestial planet.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => setPreviewModalOpen(true)}
                                    className="bg-[var(--secondary)] font-['Orbitron',sans-serif] text-xs font-bold text-black hover:bg-[var(--secondary)]/90"
                                >
                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                    Launch Preview
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sticky Save Bar */}
                <StickySaveBar
                    isDirty={isDirty}
                    isSaving={processing}
                    onSave={() =>
                        handleSubmit({
                            preventDefault: () => {},
                        } as React.FormEvent)
                    }
                    onDiscard={() => window.history.back()}
                    saveLabel={isEdit ? 'Save Changes' : 'Create Project'}
                />
            </form>

            {/* Media Library Modal for gallery attachments */}
            <MediaLibraryModal
                open={mediaModalOpen}
                onOpenChange={setMediaModalOpen}
                onSelect={handleAttachMedia}
                acceptedType="all"
                title="Attach Media to Project Showcase"
            />

            {/* Bulk Features Parser Modal */}
            <Dialog
                open={bulkFeaturesModalOpen}
                onOpenChange={setBulkFeaturesModalOpen}
            >
                <DialogContent className="max-w-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)]">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--secondary)]">
                            BULK PASTE FEATURE PARSER
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-xs text-[var(--text-muted)]">
                            <p className="font-semibold text-[var(--text)]">
                                Format Guide:
                            </p>
                            <p>• Each line creates a single feature item.</p>
                            <p>
                                • A line ending with a colon (
                                <code className="text-[var(--secondary)]">
                                    :
                                </code>
                                ) starts a new group label for all subsequent
                                lines.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[var(--text-muted)] uppercase">
                                Default Starting Group:
                            </label>
                            <FormInput
                                value={bulkDefaultGroup}
                                onChange={(e) =>
                                    setBulkDefaultGroup(e.target.value)
                                }
                                placeholder="Core Architecture"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[var(--text-muted)] uppercase">
                                Paste Feature Lines:
                            </label>
                            <FormTextarea
                                rows={8}
                                value={bulkPasteText}
                                onChange={(e) =>
                                    setBulkPasteText(e.target.value)
                                }
                                placeholder={`Public Site:\nHigh-performance 3D planet orbit\nReal-time search filtering\n\nAdmin Operations:\nDrag-and-drop ordering system\nSoft delete and restore flow`}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setBulkFeaturesModalOpen(false)}
                            className="border-[var(--surface-border)]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleParseBulkFeatures('append')}
                            className="text-xs font-semibold"
                        >
                            Append to Existing
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleParseBulkFeatures('replace')}
                            className="bg-[var(--secondary)] text-xs font-semibold text-black hover:bg-[var(--secondary)]/90"
                        >
                            Replace All Features
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Interactive Preview Panel */}
            <ProjectDetailPanel
                isOpen={previewModalOpen}
                onClose={() => setPreviewModalOpen(false)}
                project={previewProjectItem as any}
            />
        </AdminLayout>
    );
}
