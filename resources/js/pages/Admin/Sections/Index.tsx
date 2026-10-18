import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    SortableList,
    PublishToggle,
    TextInput,
    Textarea,
} from '@/components/Admin';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { SectionItem } from '@/types/admin';
import { Layers, Lock, Pencil, Save } from 'lucide-react';

interface Props {
    sections: SectionItem[];
}

export default function SectionsIndex({ sections: initialSections }: Props) {
    const [sections, setSections] = useState<SectionItem[]>(initialSections);
    const [editingSection, setEditingSection] = useState<SectionItem | null>(
        null,
    );

    // Sync when props change
    React.useEffect(() => {
        setSections(initialSections);
    }, [initialSections]);

    const {
        data: editData,
        setData: setEditData,
        put: putSection,
        processing: savingEdit,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        nav_label: '',
        eyebrow: '',
        title: '',
        subtitle: '',
        is_visible: true,
    });

    const openEditModal = (sec: SectionItem) => {
        setEditingSection(sec);
        setEditData({
            nav_label: sec.nav_label,
            eyebrow: sec.eyebrow || '',
            title: sec.title || '',
            subtitle: sec.subtitle || '',
            is_visible: sec.is_visible,
        });
    };

    const handleSaveSection = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSection) return;

        putSection(`/admin/sections/${editingSection.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingSection(null);
                resetEdit();
            },
        });
    };

    const handleToggleVisibility = (sec: SectionItem) => {
        if (sec.key === 'hero' || sec.key === 'footer') {
            return;
        }

        router.patch(
            `/admin/sections/${sec.id}/toggle-visibility`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReorder = (newItems: SectionItem[]) => {
        setSections(newItems);

        const orders = newItems.map((item, index) => ({
            id: item.id,
            sort_order: index,
        }));

        router.post(
            '/admin/sections/reorder',
            { orders },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout
            title="Portfolio Sections"
            breadcrumbs={[{ title: 'Sections' }]}
        >
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-tight text-[var(--text)]">
                            PORTFOLIO SECTIONS
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            Manage orbital order, visibility, and section
                            headers across your 10 cosmic zones.
                        </p>
                    </div>
                </div>

                {/* Section List Card */}
                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl">
                    <div className="mb-4 flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                        <span className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                            Drag handle to reorder orbit
                        </span>
                        <span className="font-['JetBrains_Mono',monospace] text-xs text-[var(--text-muted)]">
                            {sections.length} SECTIONS
                        </span>
                    </div>

                    <SortableList
                        items={sections}
                        onReorder={handleReorder}
                        renderItem={(sec) => {
                            const isLocked =
                                sec.key === 'hero' || sec.key === 'footer';

                            return (
                                <div className="flex flex-1 items-center justify-between gap-4 py-1">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                                {sec.nav_label}
                                            </span>
                                            <span className="rounded bg-[var(--surface-border)] px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                #{sec.key}
                                            </span>
                                            {isLocked && (
                                                <span className="flex items-center gap-1 rounded bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                                                    <Lock className="h-3 w-3" />{' '}
                                                    Core Anchor
                                                </span>
                                            )}
                                        </div>
                                        {sec.title && (
                                            <span className="line-clamp-1 text-xs text-[var(--text-muted)]">
                                                {sec.eyebrow
                                                    ? `${sec.eyebrow} · `
                                                    : ''}
                                                {sec.title}
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className="flex items-center gap-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {isLocked ? (
                                            <div
                                                className="flex items-center gap-1.5 opacity-60"
                                                title="Hero and footer cannot be hidden"
                                            >
                                                <PublishToggle
                                                    published={true}
                                                    onChange={() => {}}
                                                    disabled={true}
                                                />
                                            </div>
                                        ) : (
                                            <PublishToggle
                                                published={sec.is_visible}
                                                onChange={() =>
                                                    handleToggleVisibility(sec)
                                                }
                                            />
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => openEditModal(sec)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--secondary)] hover:text-[var(--text)]"
                                            title="Edit section titles"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>

            {/* Edit Section Modal */}
            <Dialog
                open={editingSection !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingSection(null);
                }}
            >
                <DialogContent className="max-w-md border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                            <Layers className="h-4 w-4 text-[var(--secondary)]" />
                            <span>
                                Edit Section: {editingSection?.nav_label}
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    {editingSection && (
                        <form
                            onSubmit={handleSaveSection}
                            className="space-y-4 pt-2"
                        >
                            <TextInput
                                label="Navigation Orbit Label"
                                value={editData.nav_label}
                                onChange={(val) =>
                                    setEditData('nav_label', val)
                                }
                                error={editErrors.nav_label}
                                required
                            />

                            <TextInput
                                label="Eyebrow Text (Optional)"
                                value={editData.eyebrow}
                                onChange={(val) => setEditData('eyebrow', val)}
                                error={editErrors.eyebrow}
                                placeholder="e.g. MISSION 02 / BRIEFING"
                            />

                            <TextInput
                                label="Section Title"
                                value={editData.title}
                                onChange={(val) => setEditData('title', val)}
                                error={editErrors.title}
                                placeholder="e.g. Core Telemetry & Specializations"
                            />

                            <Textarea
                                label="Section Subtitle / Description"
                                value={editData.subtitle}
                                onChange={(val) => setEditData('subtitle', val)}
                                error={editErrors.subtitle}
                                rows={3}
                            />

                            <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
                                <span className="text-xs font-medium text-[var(--text)]">
                                    Section Visibility
                                </span>
                                {editingSection.key === 'hero' ||
                                editingSection.key === 'footer' ? (
                                    <span className="flex items-center gap-1 text-xs text-[var(--primary)]">
                                        <Lock className="h-3 w-3" /> Core Anchor
                                        (Always Visible)
                                    </span>
                                ) : (
                                    <PublishToggle
                                        published={editData.is_visible}
                                        onChange={(v) =>
                                            setEditData('is_visible', v)
                                        }
                                    />
                                )}
                            </div>
                            {editErrors.is_visible && (
                                <p className="text-xs text-[var(--danger)]">
                                    {editErrors.is_visible}
                                </p>
                            )}

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingSection(null)}
                                    className="border-[var(--surface-border)]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={savingEdit}
                                    className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white"
                                >
                                    <Save className="mr-1.5 h-4 w-4" />
                                    <span>Save Changes</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
