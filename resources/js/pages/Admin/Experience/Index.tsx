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
} from '@/components/Admin';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ExperienceItem } from '@/types/admin';
import { Plus, Briefcase, Pencil, Trash2, Building2 } from 'lucide-react';

interface Props {
    experiences: ExperienceItem[];
}

export default function ExperienceIndex({
    experiences: initialExperiences,
}: Props) {
    const [experiences, setExperiences] =
        useState<ExperienceItem[]>(initialExperiences);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
    const [deletingExp, setDeletingExp] = useState<ExperienceItem | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    React.useEffect(() => {
        setExperiences(initialExperiences);
    }, [initialExperiences]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        role: '',
        company: '',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        is_published: true,
    });

    const openAddModal = () => {
        setEditingExp(null);
        reset();
        setData({
            role: '',
            company: '',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            is_current: false,
            description: '',
            is_published: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (exp: ExperienceItem) => {
        setEditingExp(exp);
        setData({
            role: exp.role,
            company: exp.company,
            start_date: exp.start_date ? exp.start_date.split('T')[0] : '',
            end_date: exp.end_date ? exp.end_date.split('T')[0] : '',
            is_current: Boolean(exp.is_current),
            description: exp.description || '',
            is_published: exp.is_published,
        });
        setModalOpen(true);
    };

    const handleCurrentChange = (checked: boolean) => {
        setData((prev) => ({
            ...prev,
            is_current: checked,
            end_date: checked ? '' : prev.end_date,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...data,
            end_date: data.is_current ? null : data.end_date || null,
        };

        if (editingExp) {
            put(`/admin/experience/${editingExp.id}`, {
                ...payload,
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    setEditingExp(null);
                    reset();
                },
            });
        } else {
            post('/admin/experience', {
                ...payload,
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleTogglePublish = (exp: ExperienceItem) => {
        router.patch(
            `/admin/experience/${exp.id}/toggle-publish`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReorder = (reordered: ExperienceItem[]) => {
        setExperiences(reordered);
        const orders = reordered.map((item, index) => ({
            id: item.id,
            sort_order: index,
        }));

        router.post(
            '/admin/experience/reorder',
            { orders },
            { preserveScroll: true, preserveState: true },
        );
    };

    const confirmDelete = (exp: ExperienceItem) => {
        setDeletingExp(exp);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deletingExp) return;
        router.delete(`/admin/experience/${deletingExp.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeletingExp(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Experience"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Experience' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-wider text-[var(--text)] sm:text-3xl">
                            CAREER FLIGHT LOG (EXPERIENCE)
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Manage the chronological flight path, professional
                            engineering roles, and achievements.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openAddModal}
                        className="bg-[var(--secondary)] font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-black hover:bg-[var(--secondary)]/90"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        ADD EXPERIENCE
                    </Button>
                </div>

                {/* Experience Timeline List */}
                {experiences.length === 0 ? (
                    <EmptyState
                        title="No experience records"
                        description="Start by adding your engineering milestones and professional roles."
                        actionLabel="Add Experience"
                        onAction={openAddModal}
                    />
                ) : (
                    <SortableList
                        items={experiences}
                        onReorder={handleReorder}
                        className="space-y-3"
                        renderItem={(exp, dragHandleProps) => (
                            <div className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 backdrop-blur-md transition-all duration-200 hover:border-[var(--secondary)]/40 hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <DragHandle {...dragHandleProps} />

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm">
                                        <Briefcase className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="truncate font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                                {exp.role}
                                            </h3>
                                            <span className="flex items-center gap-1 font-['JetBrains_Mono',monospace] text-xs font-semibold text-[var(--secondary)]">
                                                <Building2 className="h-3 w-3" />
                                                {exp.company}
                                            </span>
                                            {exp.is_current ? (
                                                <span className="rounded-md border border-[var(--success)]/40 bg-[var(--success)]/10 px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[var(--success)]">
                                                    PRESENT
                                                </span>
                                            ) : (
                                                <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                    {exp.start_date.slice(0, 7)}{' '}
                                                    —{' '}
                                                    {exp.end_date?.slice(
                                                        0,
                                                        7,
                                                    ) || 'Present'}
                                                </span>
                                            )}
                                        </div>
                                        {exp.description && (
                                            <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[var(--surface-border)] pt-2 sm:border-t-0 sm:pt-0">
                                    <PublishToggle
                                        checked={exp.is_published}
                                        onChange={() =>
                                            handleTogglePublish(exp)
                                        }
                                    />

                                    <div className="flex items-center gap-1 border-l border-[var(--surface-border)] pl-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditModal(exp)}
                                            className="h-8 border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                        >
                                            <Pencil className="mr-1 h-3.5 w-3.5" />
                                            Edit
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => confirmDelete(exp)}
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

            {/* Add / Edit Experience Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)] backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--secondary)]">
                            {editingExp
                                ? `EDIT ROLE: ${editingExp.role}`
                                : 'ADD CAREER EXPERIENCE'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                label="Role / Title"
                                required
                                error={errors.role}
                            >
                                <FormInput
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    placeholder="e.g. Lead Full-Stack Engineer"
                                    hasError={Boolean(errors.role)}
                                />
                            </FormField>

                            <FormField
                                label="Company / Organisation"
                                required
                                error={errors.company}
                            >
                                <FormInput
                                    value={data.company}
                                    onChange={(e) =>
                                        setData('company', e.target.value)
                                    }
                                    placeholder="e.g. Orbitron Dynamics"
                                    hasError={Boolean(errors.company)}
                                />
                            </FormField>
                        </div>

                        {/* Dates row with Present checkbox */}
                        <div className="space-y-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3.5">
                            <div className="flex items-center justify-between">
                                <label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_current}
                                        onChange={(e) =>
                                            handleCurrentChange(
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-[var(--surface-border)] text-[var(--secondary)] focus:ring-[var(--secondary)]"
                                    />
                                    <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[var(--text)]">
                                        I currently work here (Present)
                                    </span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <FormField
                                    label="Start Date"
                                    required
                                    error={errors.start_date}
                                >
                                    <FormInput
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                'start_date',
                                                e.target.value,
                                            )
                                        }
                                        hasError={Boolean(errors.start_date)}
                                    />
                                </FormField>

                                <FormField
                                    label="End Date"
                                    error={errors.end_date}
                                    hint={
                                        data.is_current
                                            ? 'Disabled (Present)'
                                            : undefined
                                    }
                                >
                                    <FormInput
                                        type="date"
                                        disabled={data.is_current}
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData('end_date', e.target.value)
                                        }
                                        hasError={Boolean(errors.end_date)}
                                    />
                                </FormField>
                            </div>
                        </div>

                        <FormField
                            label="Role Description & Deliverables"
                            error={errors.description}
                        >
                            <FormTextarea
                                rows={4}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Key achievements, architectural design, technologies scaled..."
                                hasError={Boolean(errors.description)}
                            />
                        </FormField>

                        <div className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3">
                            <div>
                                <p className="text-xs font-semibold text-[var(--text)]">
                                    Published Status
                                </p>
                                <p className="text-[11px] text-[var(--text-muted)]">
                                    Display on the public Experience timeline.
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
                                    : editingExp
                                      ? 'Save Changes'
                                      : 'Create Record'}
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
                title="Delete Experience Record?"
                description={
                    deletingExp
                        ? `Are you sure you want to delete "${deletingExp.role} at ${deletingExp.company}"?`
                        : ''
                }
            />
        </AdminLayout>
    );
}
