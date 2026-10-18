import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    TextInput,
    Textarea,
    SelectInput,
    SortableList,
    DeleteDialog,
} from '@/components/Admin';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { AboutContentItem, AboutFactItem, MediaItem } from '@/types/admin';
import {
    Plus,
    Pencil,
    Trash2,
    Save,
    Image as ImageIcon,
    FileText,
} from 'lucide-react';

interface Props {
    about: AboutContentItem;
    photoMedia: MediaItem | null;
    resumeMedia: MediaItem | null;
}

export default function AboutIndex({ about, photoMedia, resumeMedia }: Props) {
    const [facts, setFacts] = useState<AboutFactItem[]>(about.facts || []);
    const [factModalOpen, setFactModalOpen] = useState(false);
    const [editingFact, setEditingFact] = useState<AboutFactItem | null>(null);
    const [deletingFact, setDeletingFact] = useState<AboutFactItem | null>(
        null,
    );

    // Sync facts when about changes
    React.useEffect(() => {
        setFacts(about.facts || []);
    }, [about]);

    // About content form
    const {
        data: aboutData,
        setData: setAboutData,
        put: putAbout,
        processing: savingAbout,
        errors: aboutErrors,
        isDirty: aboutDirty,
    } = useForm({
        heading: about.heading || '',
        bio: about.bio || '',
    });

    // Fact / Counter form
    const {
        data: factData,
        setData: setFactData,
        post: postFact,
        put: putFact,
        processing: savingFact,
        errors: factErrors,
        reset: resetFact,
    } = useForm<{
        kind: 'fact' | 'counter';
        label: string;
        value: string;
        suffix: string;
    }>({
        kind: 'fact',
        label: '',
        value: '',
        suffix: '',
    });

    const handleSaveAboutContent = (e: React.FormEvent) => {
        e.preventDefault();
        putAbout('/admin/about', {
            preserveScroll: true,
        });
    };

    const openAddFactModal = () => {
        setEditingFact(null);
        setFactData({
            kind: 'fact',
            label: '',
            value: '',
            suffix: '',
        });
        setFactModalOpen(true);
    };

    const openEditFactModal = (fact: AboutFactItem) => {
        setEditingFact(fact);
        setFactData({
            kind: fact.kind,
            label: fact.label,
            value: fact.value,
            suffix: fact.suffix || '',
        });
        setFactModalOpen(true);
    };

    const handleSaveFact = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFact) {
            putFact(`/admin/about/facts/${editingFact.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setFactModalOpen(false);
                    resetFact();
                },
            });
        } else {
            postFact('/admin/about/facts', {
                preserveScroll: true,
                onSuccess: () => {
                    setFactModalOpen(false);
                    resetFact();
                },
            });
        }
    };

    const handleDeleteFact = () => {
        if (!deletingFact) return;
        router.delete(`/admin/about/facts/${deletingFact.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingFact(null),
        });
    };

    const handleReorderFacts = (newFacts: AboutFactItem[]) => {
        setFacts(newFacts);

        const orders = newFacts.map((f, index) => ({
            id: f.id,
            sort_order: index,
        }));

        router.post(
            '/admin/about/facts/reorder',
            { orders },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout title="About Section" breadcrumbs={[{ title: 'About' }]}>
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-tight text-[var(--text)]">
                            ABOUT & MISSION FACTS
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            Manage your astronaut biography, quick facts,
                            telemetry counters, and linked assets.
                        </p>
                    </div>
                </div>

                {/* Section 1: Biography & Header */}
                <form onSubmit={handleSaveAboutContent} className="space-y-6">
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl md:p-8">
                        <div className="mb-6 flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                            <div>
                                <h2 className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                                    BIOGRAPHY & OVERVIEW
                                </h2>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Displayed alongside your circular porthole
                                    portrait and quick facts grid.
                                </p>
                            </div>
                            <Button
                                type="submit"
                                disabled={savingAbout || !aboutDirty}
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-[var(--primary)]/20 shadow-md"
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                <span>Save Changes</span>
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <TextInput
                                label="Section Headline (Optional)"
                                value={aboutData.heading}
                                onChange={(val) => setAboutData('heading', val)}
                                error={aboutErrors.heading}
                                placeholder="e.g. Mission Specialist / About Monayem"
                            />

                            <Textarea
                                label="Biography & Philosophy"
                                value={aboutData.bio}
                                onChange={(val) => setAboutData('bio', val)}
                                error={aboutErrors.bio}
                                rows={5}
                                hint="Your full background story, core values, and approach to building modern web applications"
                                required
                            />
                        </div>

                        {/* Linked Assets Notice */}
                        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[var(--surface-border)] pt-6 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/40 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--secondary)]/10 text-[var(--secondary)]">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
                                        Porthole Photo
                                    </p>
                                    <p className="truncate text-xs font-medium text-[var(--text)]">
                                        {photoMedia
                                            ? photoMedia.original_name
                                            : 'Not configured'}
                                    </p>
                                </div>
                                <Link
                                    href="/admin/settings"
                                    className="text-xs text-[var(--secondary)] hover:underline"
                                >
                                    Change in Settings
                                </Link>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)]/40 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">
                                        Resume PDF
                                    </p>
                                    <p className="truncate text-xs font-medium text-[var(--text)]">
                                        {resumeMedia
                                            ? resumeMedia.original_name
                                            : 'Not configured'}
                                    </p>
                                </div>
                                <Link
                                    href="/admin/settings"
                                    className="text-xs text-[var(--accent)] hover:underline"
                                >
                                    Change in Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Section 2: Quick Facts & Telemetry Counters */}
                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-6 flex flex-col gap-3 border-b border-[var(--surface-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                                FACTS & ANIMATED COUNTERS
                            </h2>
                            <p className="text-xs text-[var(--text-muted)]">
                                Numbers animate into orbit on scroll; facts
                                highlight key strengths and locations.
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={openAddFactModal}
                            className="border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--secondary)]"
                        >
                            <Plus className="mr-1.5 h-4 w-4 text-[var(--secondary)]" />
                            <span>Add Fact or Counter</span>
                        </Button>
                    </div>

                    {facts.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[var(--surface-border)] p-8 text-center">
                            <p className="text-sm text-[var(--text-muted)]">
                                No facts or counters configured. Click &quot;Add
                                Fact or Counter&quot; above.
                            </p>
                        </div>
                    ) : (
                        <SortableList
                            items={facts}
                            onReorder={handleReorderFacts}
                            renderItem={(fact) => (
                                <div className="flex flex-1 items-center justify-between gap-4 py-1">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`rounded px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] font-bold tracking-wider uppercase ${
                                                fact.kind === 'counter'
                                                    ? 'bg-[var(--secondary)]/15 text-[var(--secondary)]'
                                                    : 'bg-[var(--primary)]/15 text-[var(--primary)]'
                                            }`}
                                        >
                                            {fact.kind}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-[var(--text)]">
                                                {fact.label}
                                            </span>
                                            <span className="font-['JetBrains_Mono',monospace] text-xs text-[var(--text-muted)]">
                                                {fact.value}
                                                {fact.suffix ? (
                                                    <span className="font-bold text-[var(--secondary)]">
                                                        {fact.suffix}
                                                    </span>
                                                ) : (
                                                    ''
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="flex items-center gap-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditFactModal(fact)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--secondary)] hover:text-[var(--text)]"
                                            title="Edit item"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeletingFact(fact)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
                                            title="Delete item"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>

            {/* Fact/Counter Modal */}
            <Dialog open={factModalOpen} onOpenChange={setFactModalOpen}>
                <DialogContent className="max-w-md border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)]">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                            {editingFact
                                ? 'Edit Fact / Counter'
                                : 'Add Fact or Counter'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveFact} className="space-y-4 pt-2">
                        <SelectInput
                            label="Item Kind"
                            value={factData.kind}
                            onChange={(val) =>
                                setFactData('kind', val as 'fact' | 'counter')
                            }
                            error={factErrors.kind}
                            options={[
                                {
                                    label: 'Quick Fact (Text badge)',
                                    value: 'fact',
                                },
                                {
                                    label: 'Animated Counter (Stat number)',
                                    value: 'counter',
                                },
                            ]}
                            required
                        />

                        <TextInput
                            label="Label"
                            value={factData.label}
                            onChange={(val) => setFactData('label', val)}
                            error={factErrors.label}
                            placeholder="e.g. Years of Experience or Location"
                            required
                        />

                        <TextInput
                            label={
                                factData.kind === 'counter'
                                    ? 'Target Number'
                                    : 'Fact Value'
                            }
                            value={factData.value}
                            onChange={(val) => setFactData('value', val)}
                            error={factErrors.value}
                            placeholder={
                                factData.kind === 'counter'
                                    ? '5'
                                    : 'Dhaka, Bangladesh'
                            }
                            required
                        />

                        {factData.kind === 'counter' && (
                            <TextInput
                                label="Number Suffix (Optional)"
                                value={factData.suffix}
                                onChange={(val) => setFactData('suffix', val)}
                                error={factErrors.suffix}
                                placeholder="e.g. + or % or k"
                                hint="Appended to the animated number once countdown completes"
                            />
                        )}

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFactModalOpen(false)}
                                className="border-[var(--surface-border)]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={savingFact}
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white"
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                <span>
                                    {editingFact ? 'Update Item' : 'Add Item'}
                                </span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Fact Confirmation Dialog */}
            <DeleteDialog
                open={deletingFact !== null}
                onOpenChange={(open) => !open && setDeletingFact(null)}
                title="Delete Fact or Counter"
                description={`Are you sure you want to delete "${deletingFact?.label}"?`}
                onConfirm={handleDeleteFact}
            />
        </AdminLayout>
    );
}
