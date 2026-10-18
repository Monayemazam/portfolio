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
import type { ProcessStepItem } from '@/types/admin';
import { Plus, GitMerge, Pencil, Trash2 } from 'lucide-react';

interface Props {
    processSteps: ProcessStepItem[];
}

export default function ProcessIndex({ processSteps: initialSteps }: Props) {
    const [processSteps, setProcessSteps] =
        useState<ProcessStepItem[]>(initialSteps);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStep, setEditingStep] = useState<ProcessStepItem | null>(
        null,
    );
    const [deletingStep, setDeletingStep] = useState<ProcessStepItem | null>(
        null,
    );
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    React.useEffect(() => {
        setProcessSteps(initialSteps);
    }, [initialSteps]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        is_published: true,
    });

    const openAddModal = () => {
        setEditingStep(null);
        reset();
        setData({
            title: '',
            description: '',
            is_published: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (step: ProcessStepItem) => {
        setEditingStep(step);
        setData({
            title: step.title,
            description: step.description,
            is_published: step.is_published,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingStep) {
            put(`/admin/process/${editingStep.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    setEditingStep(null);
                    reset();
                },
            });
        } else {
            post('/admin/process', {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleTogglePublish = (step: ProcessStepItem) => {
        router.patch(
            `/admin/process/${step.id}/toggle-publish`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReorder = (reordered: ProcessStepItem[]) => {
        setProcessSteps(reordered);
        const orders = reordered.map((item, index) => ({
            id: item.id,
            sort_order: index,
        }));

        router.post(
            '/admin/process/reorder',
            { orders },
            { preserveScroll: true, preserveState: true },
        );
    };

    const confirmDelete = (step: ProcessStepItem) => {
        setDeletingStep(step);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deletingStep) return;
        router.delete(`/admin/process/${deletingStep.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeletingStep(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Process Steps"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Process Steps' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-wider text-[var(--text)] sm:text-3xl">
                            MISSION PROTOCOL (PROCESS STEPS)
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Manage the sequential workflow and execution
                            lifecycle steps (Discover, Design, Build, Test,
                            Launch, Support).
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openAddModal}
                        className="bg-[var(--secondary)] font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-black hover:bg-[var(--secondary)]/90"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        ADD STEP
                    </Button>
                </div>

                {/* Steps List */}
                {processSteps.length === 0 ? (
                    <EmptyState
                        title="No process steps found"
                        description="Define the sequence of workflow stages followed for client solutions."
                        actionLabel="Add Step"
                        onAction={openAddModal}
                    />
                ) : (
                    <SortableList
                        items={processSteps}
                        onReorder={handleReorder}
                        className="space-y-3"
                        renderItem={(step, dragHandleProps) => (
                            <div className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 backdrop-blur-md transition-all duration-200 hover:border-[var(--secondary)]/40 hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <DragHandle {...dragHandleProps} />

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm">
                                        <GitMerge className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="truncate font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[var(--surface-border)] pt-2 sm:border-t-0 sm:pt-0">
                                    <PublishToggle
                                        checked={step.is_published}
                                        onChange={() =>
                                            handleTogglePublish(step)
                                        }
                                    />

                                    <div className="flex items-center gap-1 border-l border-[var(--surface-border)] pl-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditModal(step)}
                                            className="h-8 border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                        >
                                            <Pencil className="mr-1 h-3.5 w-3.5" />
                                            Edit
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => confirmDelete(step)}
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

            {/* Add / Edit Step Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)] backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--secondary)]">
                            {editingStep
                                ? `EDIT STEP: ${editingStep.title}`
                                : 'ADD NEW PROCESS STEP'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            label="Step Title"
                            required
                            error={errors.title}
                        >
                            <FormInput
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="e.g. 01 / Discovery & Architecture"
                                hasError={Boolean(errors.title)}
                            />
                        </FormField>

                        <FormField
                            label="Step Description"
                            required
                            error={errors.description}
                        >
                            <FormTextarea
                                rows={4}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Outline what occurs during this mission protocol stage..."
                                hasError={Boolean(errors.description)}
                            />
                        </FormField>

                        <div className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3">
                            <div>
                                <p className="text-xs font-semibold text-[var(--text)]">
                                    Published Status
                                </p>
                                <p className="text-[11px] text-[var(--text-muted)]">
                                    Display in the public Process section.
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
                                    : editingStep
                                      ? 'Save Changes'
                                      : 'Create Step'}
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
                title="Delete Process Step?"
                description={
                    deletingStep
                        ? `Are you sure you want to delete the step "${deletingStep.title}"?`
                        : ''
                }
            />
        </AdminLayout>
    );
}
