import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { TextInput, SortableList, DeleteDialog } from '@/components/Admin';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { HeroContentItem, HeroRoleItem } from '@/types/admin';
import { Sparkles, Plus, Pencil, Trash2, Save } from 'lucide-react';

interface Props {
    hero: HeroContentItem;
}

export default function HeroIndex({ hero }: Props) {
    const [roles, setRoles] = useState<HeroRoleItem[]>(hero.roles || []);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<HeroRoleItem | null>(null);
    const [deletingRole, setDeletingRole] = useState<HeroRoleItem | null>(null);

    // Sync roles when hero changes
    React.useEffect(() => {
        setRoles(hero.roles || []);
    }, [hero]);

    // Hero content form
    const {
        data: heroData,
        setData: setHeroData,
        put: putHero,
        processing: savingHero,
        errors: heroErrors,
        isDirty: heroDirty,
    } = useForm({
        eyebrow: hero.eyebrow || '',
        name: hero.name || '',
        primary_button_label: hero.primary_button_label || '',
        primary_button_url: hero.primary_button_url || '',
        secondary_button_label: hero.secondary_button_label || '',
        secondary_button_url: hero.secondary_button_url || '',
    });

    // Role form (create or edit)
    const {
        data: roleData,
        setData: setRoleData,
        post: postRole,
        put: putRole,
        processing: savingRole,
        errors: roleErrors,
        reset: resetRole,
    } = useForm({
        text: '',
    });

    const handleSaveHeroContent = (e: React.FormEvent) => {
        e.preventDefault();
        putHero('/admin/hero', {
            preserveScroll: true,
        });
    };

    const openAddRoleModal = () => {
        setEditingRole(null);
        setRoleData({ text: '' });
        setRoleModalOpen(true);
    };

    const openEditRoleModal = (role: HeroRoleItem) => {
        setEditingRole(role);
        setRoleData({ text: role.text });
        setRoleModalOpen(true);
    };

    const handleSaveRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            putRole(`/admin/hero/roles/${editingRole.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setRoleModalOpen(false);
                    resetRole();
                },
            });
        } else {
            postRole('/admin/hero/roles', {
                preserveScroll: true,
                onSuccess: () => {
                    setRoleModalOpen(false);
                    resetRole();
                },
            });
        }
    };

    const handleDeleteRole = () => {
        if (!deletingRole) return;
        router.delete(`/admin/hero/roles/${deletingRole.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingRole(null),
        });
    };

    const handleReorderRoles = (newRoles: HeroRoleItem[]) => {
        setRoles(newRoles);

        const orders = newRoles.map((r, index) => ({
            id: r.id,
            sort_order: index,
        }));

        router.post(
            '/admin/hero/roles/reorder',
            { orders },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout title="Hero Content" breadcrumbs={[{ title: 'Hero' }]}>
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-tight text-[var(--text)]">
                            HERO MISSION BRIEFING
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            Configure introduction headings, call-to-action
                            buttons, and rotating role lines.
                        </p>
                    </div>
                </div>

                {/* Section 1: Hero Main Content */}
                <form onSubmit={handleSaveHeroContent} className="space-y-6">
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl md:p-8">
                        <div className="mb-6 flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
                            <div>
                                <h2 className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                                    CORE INTRODUCTION
                                </h2>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Displays as the primary viewport focal point
                                    upon entering the space portfolio.
                                </p>
                            </div>
                            <Button
                                type="submit"
                                disabled={savingHero || !heroDirty}
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-[var(--primary)]/20 shadow-md"
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                <span>Save Changes</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <TextInput
                                label="Mission Eyebrow"
                                value={heroData.eyebrow}
                                onChange={(val) => setHeroData('eyebrow', val)}
                                error={heroErrors.eyebrow}
                                placeholder="e.g. MISSION 01 / LAUNCH"
                            />

                            <TextInput
                                label="Display Name"
                                value={heroData.name}
                                onChange={(val) => setHeroData('name', val)}
                                error={heroErrors.name}
                                placeholder="Monayem Azam"
                                required
                            />

                            <TextInput
                                label="Primary Button Label"
                                value={heroData.primary_button_label}
                                onChange={(val) =>
                                    setHeroData('primary_button_label', val)
                                }
                                error={heroErrors.primary_button_label}
                                placeholder="View projects"
                                required
                            />

                            <TextInput
                                label="Primary Button URL / Anchor"
                                value={heroData.primary_button_url}
                                onChange={(val) =>
                                    setHeroData('primary_button_url', val)
                                }
                                error={heroErrors.primary_button_url}
                                placeholder="#projects"
                                required
                            />

                            <TextInput
                                label="Secondary Button Label"
                                value={heroData.secondary_button_label}
                                onChange={(val) =>
                                    setHeroData('secondary_button_label', val)
                                }
                                error={heroErrors.secondary_button_label}
                                placeholder="Hire me"
                                required
                            />

                            <TextInput
                                label="Secondary Button URL / Anchor"
                                value={heroData.secondary_button_url}
                                onChange={(val) =>
                                    setHeroData('secondary_button_url', val)
                                }
                                error={heroErrors.secondary_button_url}
                                placeholder="#contact"
                                required
                            />
                        </div>
                    </div>
                </form>

                {/* Section 2: Rotating Role Lines */}
                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl md:p-8">
                    <div className="mb-6 flex flex-col gap-3 border-b border-[var(--surface-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                                ROTATING TYPED ROLES
                            </h2>
                            <p className="text-xs text-[var(--text-muted)]">
                                Animated typed subtitles cycled dynamically
                                below your name in the hero section.
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={openAddRoleModal}
                            className="border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--secondary)]"
                        >
                            <Plus className="mr-1.5 h-4 w-4 text-[var(--secondary)]" />
                            <span>Add Role Line</span>
                        </Button>
                    </div>

                    {roles.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[var(--surface-border)] p-8 text-center">
                            <Sparkles className="mx-auto h-8 w-8 text-[var(--text-muted)]" />
                            <p className="mt-2 text-sm text-[var(--text-muted)]">
                                No rotating role lines defined. Add your first
                                title!
                            </p>
                        </div>
                    ) : (
                        <SortableList
                            items={roles}
                            onReorder={handleReorderRoles}
                            renderItem={(role) => (
                                <div className="flex flex-1 items-center justify-between gap-4 py-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[var(--secondary)]">
                                            Role:
                                        </span>
                                        <span className="text-sm font-medium text-[var(--text)]">
                                            {role.text}
                                        </span>
                                    </div>

                                    <div
                                        className="flex items-center gap-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditRoleModal(role)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--secondary)] hover:text-[var(--text)]"
                                            title="Edit role"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeletingRole(role)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
                                            title="Delete role"
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

            {/* Role Modal (Add/Edit) */}
            <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
                <DialogContent className="max-w-md border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)]">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                            {editingRole
                                ? 'Edit Role Line'
                                : 'Add Rotating Role Line'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveRole} className="space-y-4 pt-2">
                        <TextInput
                            label="Role Title Text"
                            value={roleData.text}
                            onChange={(val) => setRoleData('text', val)}
                            error={roleErrors.text}
                            placeholder="e.g. Full-stack web developer"
                            required
                        />

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRoleModalOpen(false)}
                                className="border-[var(--surface-border)]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={savingRole}
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white"
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                <span>
                                    {editingRole ? 'Update Role' : 'Add Role'}
                                </span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Role Confirmation Dialog */}
            <DeleteDialog
                open={deletingRole !== null}
                onOpenChange={(open) => !open && setDeletingRole(null)}
                title="Delete Hero Role"
                description={`Are you sure you want to delete "${deletingRole?.text}"? This role will no longer cycle in the hero headline.`}
                onConfirm={handleDeleteRole}
            />
        </AdminLayout>
    );
}
