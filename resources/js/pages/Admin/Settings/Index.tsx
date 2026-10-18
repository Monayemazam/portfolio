import React, { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    TextInput,
    Textarea,
    SelectInput,
    StickySaveBar,
    UnsavedChangesWarning,
    MediaPicker,
} from '@/components/Admin';
import type { SettingItem, MediaItem } from '@/types/admin';
import {
    Sliders,
    Palette,
    Sparkles,
    Mail,
    Share2,
    FileText,
    BarChart3,
} from 'lucide-react';

interface Props {
    settings: SettingItem[];
    mediaItems: Record<string, MediaItem>;
}

const TAB_CONFIG: Record<
    string,
    { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
    general: { label: 'General', icon: Sliders },
    theme: { label: 'Theme & Colors', icon: Palette },
    effects: { label: 'Motion & Effects', icon: Sparkles },
    contact: { label: 'Contact Details', icon: Mail },
    social: { label: 'Social Orbit', icon: Share2 },
    files: { label: 'Documents & Files', icon: FileText },
    analytics: { label: 'Telemetry & Analytics', icon: BarChart3 },
};

export default function SettingsIndex({ settings, mediaItems }: Props) {
    const [activeTab, setActiveTab] = useState<string>('general');

    // Build initial form state: dictionary of key => value
    const initialValues = useMemo(() => {
        const map: Record<string, string | null> = {};
        for (const s of settings) {
            map[s.key] = s.value ?? '';
        }
        return map;
    }, [settings]);

    const { data, setData, put, processing, isDirty, errors, reset } = useForm({
        settings: initialValues,
    });

    const handleFieldChange = (key: string, value: string | null) => {
        setData('settings', {
            ...data.settings,
            [key]: value,
        });
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        put('/admin/settings', {
            preserveScroll: true,
        });
    };

    // Group settings by group
    const groups = useMemo(() => {
        const map: Record<string, SettingItem[]> = {};
        for (const s of settings) {
            const grp = s.group || 'general';
            if (!map[grp]) {
                map[grp] = [];
            }
            map[grp].push(s);
        }
        return map;
    }, [settings]);

    const currentSettings = groups[activeTab] || [];

    const renderSettingControl = (setting: SettingItem) => {
        const val = data.settings[setting.key] ?? '';
        const error = errors[`settings.${setting.key}` as keyof typeof errors];

        // Custom specialized controls based on setting key
        if (setting.key === 'default_theme') {
            return (
                <SelectInput
                    key={setting.key}
                    label={setting.label}
                    value={val}
                    onChange={(v) => handleFieldChange(setting.key, v)}
                    error={error}
                    hint="Preferred starting theme for new visitors to the public portfolio"
                    options={[
                        { label: 'System Preference', value: 'system' },
                        { label: 'Dark Mode (Deep Cosmos)', value: 'dark' },
                        { label: 'Light Mode (Solar White)', value: 'light' },
                    ]}
                />
            );
        }

        if (setting.key === 'animation_level') {
            return (
                <SelectInput
                    key={setting.key}
                    label={setting.label}
                    value={val}
                    onChange={(v) => handleFieldChange(setting.key, v)}
                    error={error}
                    hint="Global animation intensity across background 3D starfield, GSAP, and Framer Motion"
                    options={[
                        {
                            label: 'Full Cosmic (3D canvas, particles, smooth scroll)',
                            value: 'full',
                        },
                        {
                            label: 'Light Orbit (Optimized 2D canvas, no heavy shaders)',
                            value: 'light',
                        },
                        {
                            label: 'Off / Static (WCAG AA reduced-motion compliant)',
                            value: 'off',
                        },
                    ]}
                />
            );
        }

        if (setting.key === 'analytics_provider') {
            return (
                <SelectInput
                    key={setting.key}
                    label={setting.label}
                    value={val}
                    onChange={(v) => handleFieldChange(setting.key, v)}
                    error={error}
                    options={[
                        { label: 'None (Privacy Focused)', value: 'none' },
                        {
                            label: 'Plausible Analytics (Cookie-less)',
                            value: 'plausible',
                        },
                        { label: 'Google Analytics 4 (GA4)', value: 'ga4' },
                    ]}
                />
            );
        }

        // Render by type
        if (setting.type === 'color') {
            return (
                <div key={setting.key} className="space-y-1.5">
                    <label className="block text-xs font-medium tracking-wider text-[var(--text-muted)] uppercase">
                        {setting.label}
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="color"
                                value={val.startsWith('#') ? val : '#7C3AED'}
                                onChange={(e) =>
                                    handleFieldChange(
                                        setting.key,
                                        e.target.value,
                                    )
                                }
                                className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] p-1"
                            />
                        </div>
                        <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                                handleFieldChange(setting.key, e.target.value)
                            }
                            placeholder="#7C3AED"
                            className="w-36 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 font-['JetBrains_Mono',monospace] text-sm text-[var(--text)] uppercase transition-colors focus:border-[var(--secondary)] focus:outline-none"
                        />
                        <div
                            className="h-9 w-9 rounded-lg border border-[var(--surface-border)] shadow-inner"
                            style={{ backgroundColor: val || 'transparent' }}
                        />
                    </div>
                    {error && (
                        <p className="text-xs text-[var(--danger)]">{error}</p>
                    )}
                </div>
            );
        }

        if (setting.type === 'media') {
            const currentMedia = val ? mediaItems[val] || null : null;
            const acceptType =
                setting.key === 'resume_media_id' ? 'document' : 'image';

            return (
                <MediaPicker
                    key={setting.key}
                    label={setting.label}
                    value={currentMedia}
                    onChange={(media) =>
                        handleFieldChange(
                            setting.key,
                            media ? String(media.id) : null,
                        )
                    }
                    acceptedType={acceptType}
                    description={
                        setting.key === 'resume_media_id'
                            ? 'Upload or pick the public downloadable PDF resume'
                            : 'Upload or pick image from library'
                    }
                />
            );
        }

        if (setting.type === 'text') {
            return (
                <Textarea
                    key={setting.key}
                    label={setting.label}
                    value={val}
                    onChange={(v) => handleFieldChange(setting.key, v)}
                    error={error}
                    rows={3}
                />
            );
        }

        return (
            <TextInput
                key={setting.key}
                label={setting.label}
                value={val}
                onChange={(v) => handleFieldChange(setting.key, v)}
                error={error}
                type={
                    setting.type === 'email'
                        ? 'email'
                        : setting.type === 'url'
                          ? 'url'
                          : 'text'
                }
                hint={
                    setting.type === 'url'
                        ? 'Must be a secure https:// link'
                        : setting.key === 'whatsapp_number'
                          ? 'Digits only, including country code (e.g. 8801700000000)'
                          : undefined
                }
            />
        );
    };

    return (
        <AdminLayout
            title="Site Settings"
            breadcrumbs={[{ title: 'Site Settings' }]}
        >
            <UnsavedChangesWarning isDirty={isDirty} />

            <div className="mx-auto max-w-5xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-tight text-[var(--text)]">
                            SITE SETTINGS
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            Configure site metadata, celestial color tokens,
                            animation levels, and contact coordinates.
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-[var(--surface-border)] pb-2">
                    {Object.keys(groups).map((grpKey) => {
                        const config = TAB_CONFIG[grpKey] || {
                            label: grpKey.toUpperCase(),
                            icon: Sliders,
                        };
                        const Icon = config.icon;
                        const isActive = activeTab === grpKey;

                        return (
                            <button
                                key={grpKey}
                                type="button"
                                onClick={() => setActiveTab(grpKey)}
                                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-[var(--primary)]/20 shadow-lg'
                                        : 'border border-transparent bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--surface-border)] hover:text-[var(--text)]'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{config.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Settings Form Card */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl md:p-8">
                        <div className="mb-6 flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                            <div>
                                <h2 className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                                    {(
                                        TAB_CONFIG[activeTab]?.label ||
                                        activeTab
                                    ).toUpperCase()}
                                </h2>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Changes take effect immediately on save and
                                    automatically clear cached pages.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {currentSettings.map((setting) => (
                                <div
                                    key={setting.key}
                                    className={
                                        setting.type === 'text' ||
                                        setting.type === 'media'
                                            ? 'md:col-span-2'
                                            : ''
                                    }
                                >
                                    {renderSettingControl(setting)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <StickySaveBar
                        show={isDirty}
                        isSubmitting={processing}
                        onSave={() => handleSubmit()}
                        onDiscard={() => reset()}
                    />
                </form>
            </div>
        </AdminLayout>
    );
}
