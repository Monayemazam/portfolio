import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    FormField,
    FormInput,
    FormTextarea,
    PublishToggle,
    SortableList,
    DragHandle,
    DeleteDialog,
    EmptyState,
    MediaPicker,
} from '@/components/Admin';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TestimonialItem, MediaItem } from '@/types/admin';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Props {
    testimonials: TestimonialItem[];
    projects: Array<{ id: number; title: string; slug: string }>;
}

export default function TestimonialsIndex({
    testimonials: initialTestimonials,
    projects,
}: Props) {
    const [testimonials, setTestimonials] =
        useState<TestimonialItem[]>(initialTestimonials);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] =
        useState<TestimonialItem | null>(null);
    const [deletingTestimonial, setDeletingTestimonial] =
        useState<TestimonialItem | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);

    React.useEffect(() => {
        setTestimonials(initialTestimonials);
    }, [initialTestimonials]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        quote: '',
        author_name: '',
        author_role: '',
        company: '',
        photo_media_id: null as number | null,
        project_id: null as number | null,
        is_published: false,
    });

    const openAddModal = () => {
        setEditingTestimonial(null);
        setSelectedPhoto(null);
        reset();
        setData({
            quote: '',
            author_name: '',
            author_role: '',
            company: '',
            photo_media_id: null,
            project_id: null,
            is_published: false, // Default unpublished
        });
        setModalOpen(true);
    };

    const openEditModal = (t: TestimonialItem) => {
        setEditingTestimonial(t);
        setSelectedPhoto(t.photo ?? null);
        setData({
            quote: t.quote,
            author_name: t.author_name,
            author_role: t.author_role || '',
            company: t.company || '',
            photo_media_id: t.photo_media_id,
            project_id: t.project_id,
            is_published: t.is_published,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...data,
            photo_media_id: selectedPhoto?.id ?? null,
            project_id: data.project_id ? Number(data.project_id) : null,
        };

        if (editingTestimonial) {
            put(`/admin/testimonials/${editingTestimonial.id}`, {
                ...payload,
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    setEditingTestimonial(null);
                    reset();
                },
            });
        } else {
            post('/admin/testimonials', {
                ...payload,
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleTogglePublish = (t: TestimonialItem) => {
        router.patch(
            `/admin/testimonials/${t.id}/toggle-publish`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReorder = (reordered: TestimonialItem[]) => {
        setTestimonials(reordered);
        const orders = reordered.map((item, index) => ({
            id: item.id,
            sort_order: index,
        }));

        router.post(
            '/admin/testimonials/reorder',
            { orders },
            { preserveScroll: true, preserveState: true },
        );
    };

    const confirmDelete = (t: TestimonialItem) => {
        setDeletingTestimonial(t);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deletingTestimonial) return;
        router.delete(`/admin/testimonials/${deletingTestimonial.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeletingTestimonial(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Testimonials"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Testimonials' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-wider text-[var(--text)] sm:text-3xl">
                            TESTIMONIALS & ENDORSEMENTS
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Manage genuine verified client feedback and peer
                            endorsements. Default to unpublished until approved.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openAddModal}
                        className="bg-[var(--secondary)] font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-black hover:bg-[var(--secondary)]/90"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        ADD TESTIMONIAL
                    </Button>
                </div>

                {/* Testimonials List */}
                {testimonials.length === 0 ? (
                    <EmptyState
                        title="No testimonials found"
                        description="Real testimonials will be listed here. They default to unpublished until approved."
                        actionLabel="Add Testimonial"
                        onAction={openAddModal}
                    />
                ) : (
                    <SortableList
                        items={testimonials}
                        onReorder={handleReorder}
                        className="space-y-3"
                        renderItem={(t, dragHandleProps) => (
                            <div className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 backdrop-blur-md transition-all duration-200 hover:border-[var(--secondary)]/40 hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                                    <DragHandle {...dragHandleProps} />

                                    {/* Author Avatar or Initial */}
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--surface-border)] bg-[var(--bg-elevated)]">
                                        {t.photo?.thumb_url || t.photo?.url ? (
                                            <img
                                                src={
                                                    t.photo.thumb_url ||
                                                    t.photo.url
                                                }
                                                alt={t.author_name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-['Orbitron',sans-serif] text-xs font-bold text-[var(--secondary)]">
                                                {t.author_name.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                                {t.author_name}
                                            </h3>
                                            {(t.author_role || t.company) && (
                                                <span className="font-['JetBrains_Mono',monospace] text-xs text-[var(--text-muted)]">
                                                    {t.author_role}
                                                    {t.author_role && t.company
                                                        ? ' at '
                                                        : ''}
                                                    <span className="font-semibold text-[var(--secondary)]">
                                                        {t.company}
                                                    </span>
                                                </span>
                                            )}
                                            {t.project && (
                                                <span className="rounded-md border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                    Project: {t.project.title}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)] italic">
                                            "{t.quote}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[var(--surface-border)] pt-2 sm:border-t-0 sm:pt-0">
                                    <PublishToggle
                                        checked={t.is_published}
                                        onChange={() => handleTogglePublish(t)}
                                    />

                                    <div className="flex items-center gap-1 border-l border-[var(--surface-border)] pl-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditModal(t)}
                                            className="h-8 border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                        >
                                            <Pencil className="mr-1 h-3.5 w-3.5" />
                                            Edit
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => confirmDelete(t)}
                                            className="h-8 text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                )}
            </div>

            {/* Add / Edit Testimonial Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)] backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--secondary)]">
                            {editingTestimonial
                                ? `EDIT TESTIMONIAL: ${editingTestimonial.author_name}`
                                : 'ADD REAL TESTIMONIAL'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            label="Quote / Recommendation"
                            required
                            error={errors.quote}
                        >
                            <FormTextarea
                                rows={4}
                                value={data.quote}
                                onChange={(e) =>
                                    setData('quote', e.target.value)
                                }
                                placeholder="Paste the verified client quote or endorsement text..."
                                hasError={Boolean(errors.quote)}
                            />
                        </FormField>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                label="Author Name"
                                required
                                error={errors.author_name}
                            >
                                <FormInput
                                    value={data.author_name}
                                    onChange={(e) =>
                                        setData('author_name', e.target.value)
                                    }
                                    placeholder="e.g. Elena Rostova"
                                    hasError={Boolean(errors.author_name)}
                                />
                            </FormField>

                            <FormField
                                label="Author Role / Title"
                                error={errors.author_role}
                            >
                                <FormInput
                                    value={data.author_role}
                                    onChange={(e) =>
                                        setData('author_role', e.target.value)
                                    }
                                    placeholder="e.g. Chief Technology Officer"
                                    hasError={Boolean(errors.author_role)}
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField label="Company" error={errors.company}>
                                <FormInput
                                    value={data.company}
                                    onChange={(e) =>
                                        setData('company', e.target.value)
                                    }
                                    placeholder="e.g. ASN Freight International"
                                    hasError={Boolean(errors.company)}
                                />
                            </FormField>

                            <FormField
                                label="Linked Project (Optional)"
                                error={errors.project_id}
                            >
                                <select
                                    value={data.project_id || ''}
                                    onChange={(e) =>
                                        setData(
                                            'project_id',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        )
                                    }
                                    className="h-12 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-3 text-xs text-[var(--text)] focus:outline-none"
                                >
                                    <option value="">No linked project</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.title}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        </div>

                        {/* Photo Picker */}
                        <FormField
                            label="Author Photo (Porthole Frame)"
                            error={errors.photo_media_id}
                        >
                            <MediaPicker
                                value={selectedPhoto}
                                onChange={(med) => setSelectedPhoto(med)}
                                acceptedType="image"
                                label="Select Author Photo"
                            />
                        </FormField>

                        {/* Publication Toggle (Defaults to unpublished) */}
                        <div className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3">
                            <div>
                                <p className="text-xs font-semibold text-[var(--text)]">
                                    Published Status
                                </p>
                                <p className="text-[11px] text-[var(--text-muted)]">
                                    Only published testimonials appear publicly
                                    on the site.
                                </p>
                            </div>
                            <PublishToggle
                                checked={data.is_published}
                                onChange={(checked) =>
                                    setData('is_published', checked)
                                }
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setModalOpen(false)}
                                className="border-[var(--surface-border)] text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-[var(--secondary)] text-xs font-semibold text-black hover:bg-[var(--secondary)]/90"
                            >
                                {processing
                                    ? 'Saving...'
                                    : editingTestimonial
                                      ? 'Save Changes'
                                      : 'Create Testimonial'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <DeleteDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Testimonial?"
                description={
                    deletingTestimonial
                        ? `Are you sure you want to delete the testimonial from "${deletingTestimonial.author_name}"?`
                        : ''
                }
            />
        </AdminLayout>
    );
}
