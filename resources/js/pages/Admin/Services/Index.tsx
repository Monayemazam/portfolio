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
    IconPicker,
} from '@/components/Admin';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ServiceItem } from '@/types/admin';
import { Plus, Wrench, Pencil, Trash2 } from 'lucide-react';

interface Props {
    services: ServiceItem[];
}

export default function ServicesIndex({ services: initialServices }: Props) {
    const [services, setServices] = useState<ServiceItem[]>(initialServices);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceItem | null>(
        null,
    );
    const [deletingService, setDeletingService] = useState<ServiceItem | null>(
        null,
    );
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    React.useEffect(() => {
        setServices(initialServices);
    }, [initialServices]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        icon: '',
        is_published: true,
    });

    const openAddModal = () => {
        setEditingService(null);
        reset();
        setData({
            title: '',
            description: '',
            icon: 'lni-code',
            is_published: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (service: ServiceItem) => {
        setEditingService(service);
        setData({
            title: service.title,
            description: service.description,
            icon: service.icon || '',
            is_published: service.is_published,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingService) {
            put(`/admin/services/${editingService.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    setEditingService(null);
                    reset();
                },
            });
        } else {
            post('/admin/services', {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleTogglePublish = (service: ServiceItem) => {
        router.patch(
            `/admin/services/${service.id}/toggle-publish`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReorder = (reordered: ServiceItem[]) => {
        setServices(reordered);
        const orders = reordered.map((item, index) => ({
            id: item.id,
            sort_order: index,
        }));

        router.post(
            '/admin/services/reorder',
            { orders },
            { preserveScroll: true, preserveState: true },
        );
    };

    const confirmDelete = (service: ServiceItem) => {
        setDeletingService(service);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!deletingService) return;
        router.delete(`/admin/services/${deletingService.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setDeletingService(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Services"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Services' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-wider text-[var(--text)] sm:text-3xl">
                            SERVICES & CAPABILITIES
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Manage the service offerings, architectural
                            specialisations, and technical solutions.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openAddModal}
                        className="bg-[var(--secondary)] font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-black hover:bg-[var(--secondary)]/90"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        ADD SERVICE
                    </Button>
                </div>

                {/* Services List */}
                {services.length === 0 ? (
                    <EmptyState
                        title="No services found"
                        description="Start by adding your architectural and development service offerings."
                        actionLabel="Add Service"
                        onAction={openAddModal}
                    />
                ) : (
                    <SortableList
                        items={services}
                        onReorder={handleReorder}
                        className="space-y-3"
                        renderItem={(service, dragHandleProps) => (
                            <div className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 backdrop-blur-md transition-all duration-200 hover:border-[var(--secondary)]/40 hover:bg-[var(--surface-hover)] sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <DragHandle {...dragHandleProps} />

                                    {/* Icon Badge */}
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm">
                                        <Wrench className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="truncate font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                                                {service.title}
                                            </h3>
                                            {service.icon && (
                                                <span className="rounded-md border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                    {service.icon}
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Controls */}
                                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[var(--surface-border)] pt-2 sm:border-t-0 sm:pt-0">
                                    <PublishToggle
                                        checked={service.is_published}
                                        onChange={() =>
                                            handleTogglePublish(service)
                                        }
                                    />

                                    <div className="flex items-center gap-1 border-l border-[var(--surface-border)] pl-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                openEditModal(service)
                                            }
                                            className="h-8 border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                        >
                                            <Pencil className="mr-1 h-3.5 w-3.5" />
                                            Edit
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                confirmDelete(service)
                                            }
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

            {/* Add / Edit Service Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)] backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--secondary)]">
                            {editingService
                                ? `EDIT SERVICE: ${editingService.title}`
                                : 'ADD NEW SERVICE'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <FormField
                            label="Service Title"
                            required
                            error={errors.title}
                        >
                            <FormInput
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="e.g. Full-Stack Web Applications"
                                hasError={Boolean(errors.title)}
                            />
                        </FormField>

                        <FormField
                            label="Service Description"
                            required
                            error={errors.description}
                        >
                            <FormTextarea
                                rows={4}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Describe the engineering scope, tech stack, and deliverable..."
                                hasError={Boolean(errors.description)}
                            />
                        </FormField>

                        <FormField
                            label="Lineicon Identifier"
                            error={errors.icon}
                            hint="Optional icon name or picker"
                        >
                            <IconPicker
                                value={data.icon}
                                onChange={(val) => setData('icon', val)}
                            />
                        </FormField>

                        <div className="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-3">
                            <div>
                                <p className="text-xs font-semibold text-[var(--text)]">
                                    Published Status
                                </p>
                                <p className="text-[11px] text-[var(--text-muted)]">
                                    Display on the public Services section.
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
                                    : editingService
                                      ? 'Save Changes'
                                      : 'Create Service'}
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
                title="Delete Service?"
                description={
                    deletingService
                        ? `Are you sure you want to delete the service "${deletingService.title}"?`
                        : ''
                }
            />
        </AdminLayout>
    );
}
