import React, { useState, useMemo } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    TextInput,
    PublishToggle,
    SortableList,
    DeleteDialog,
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
import type { SkillItem } from '@/types/admin';
import {
    Plus,
    Pencil,
    Trash2,
    Save,
    Sparkles,
    Search,
    Layers,
} from 'lucide-react';
import * as LineIcons from 'lineicons-react';

interface Props {
    skills: SkillItem[];
    categories: string[];
}

export default function SkillsIndex({
    skills: initialSkills,
    categories: initialCategories,
}: Props) {
    const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [skillModalOpen, setSkillModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
    const [deletingSkill, setDeletingSkill] = useState<SkillItem | null>(null);
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

    // Sync with props
    React.useEffect(() => {
        setSkills(initialSkills);
    }, [initialSkills]);

    // Categories list (existing distinct categories)
    const allCategories = useMemo(() => {
        const set = new Set(initialCategories);
        for (const s of skills) {
            if (s.category) set.add(s.category);
        }
        return Array.from(set);
    }, [initialCategories, skills]);

    // Form
    const {
        data: skillData,
        setData: setSkillData,
        processing: savingSkill,
        errors: skillErrors,
        reset: resetSkill,
    } = useForm({
        name: '',
        category: '',
        new_category: '',
        level: 80,
        icon: '',
        is_published: true,
    });

    const openAddSkillModal = () => {
        setEditingSkill(null);
        setIsCreatingNewCategory(false);
        setSkillData({
            name: '',
            category:
                selectedCategory !== 'all'
                    ? selectedCategory
                    : allCategories[0] || 'Backend',
            new_category: '',
            level: 80,
            icon: '',
            is_published: true,
        });
        setSkillModalOpen(true);
    };

    const openEditSkillModal = (skill: SkillItem) => {
        setEditingSkill(skill);
        setIsCreatingNewCategory(false);
        setSkillData({
            name: skill.name,
            category: skill.category,
            new_category: '',
            level: skill.level,
            icon: skill.icon || '',
            is_published: skill.is_published,
        });
        setSkillModalOpen(true);
    };

    const handleSaveSkill = (e: React.FormEvent) => {
        e.preventDefault();

        const finalCategory = isCreatingNewCategory
            ? skillData.new_category.trim()
            : skillData.category;

        const payload = {
            name: skillData.name,
            category: finalCategory,
            level: Number(skillData.level),
            icon: skillData.icon || null,
            is_published: skillData.is_published,
        };

        if (editingSkill) {
            router.put(`/admin/skills/${editingSkill.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setSkillModalOpen(false);
                    resetSkill();
                },
            });
        } else {
            router.post('/admin/skills', payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setSkillModalOpen(false);
                    resetSkill();
                },
            });
        }
    };

    const handleDeleteSkill = () => {
        if (!deletingSkill) return;
        router.delete(`/admin/skills/${deletingSkill.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeletingSkill(null),
        });
    };

    const handleTogglePublish = (skill: SkillItem) => {
        router.patch(
            `/admin/skills/${skill.id}/toggle-publish`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReorderCategory = (
        categoryName: string,
        reorderedItems: SkillItem[],
    ) => {
        // Update local state
        const otherSkills = skills.filter((s) => s.category !== categoryName);
        const updated = [...otherSkills, ...reorderedItems];
        setSkills(updated);

        const orders = reorderedItems.map((item, index) => ({
            id: item.id,
            sort_order: index,
        }));

        router.post(
            '/admin/skills/reorder',
            { orders },
            { preserveScroll: true },
        );
    };

    // Filter skills by category and search
    const filteredByCategory = useMemo(() => {
        if (selectedCategory === 'all') return skills;
        return skills.filter((s) => s.category === selectedCategory);
    }, [skills, selectedCategory]);

    const displayedSkills = useMemo(() => {
        if (!searchQuery.trim()) return filteredByCategory;
        const q = searchQuery.toLowerCase();
        return filteredByCategory.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q),
        );
    }, [filteredByCategory, searchQuery]);

    // Group displayed skills by category for reordering
    const groupedSkills = useMemo(() => {
        const groups: Record<string, SkillItem[]> = {};
        for (const s of displayedSkills) {
            if (!groups[s.category]) {
                groups[s.category] = [];
            }
            groups[s.category].push(s);
        }
        return groups;
    }, [displayedSkills]);

    // Icon renderer helper
    const renderSkillIcon = (iconName: string | null) => {
        if (!iconName) {
            return <Sparkles className="h-4 w-4 text-[var(--secondary)]" />;
        }
        const IconsDict = LineIcons as unknown as Record<
            string,
            React.ComponentType<{ className?: string }>
        >;
        const IconComp = IconsDict[iconName];
        if (IconComp) {
            return <IconComp className="h-4 w-4 text-[var(--secondary)]" />;
        }
        return <Sparkles className="h-4 w-4 text-[var(--secondary)]" />;
    };

    return (
        <AdminLayout
            title="Technical Skills"
            breadcrumbs={[{ title: 'Skills' }]}
        >
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-tight text-[var(--text)]">
                            TECHNICAL SKILLS CONSTELLATION
                        </h1>
                        <p className="text-sm text-[var(--text-muted)]">
                            Manage competencies, proficiency percentages
                            (0–100%), Lineicons emblems, and orbital groupings.
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={openAddSkillModal}
                        className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-[var(--primary)]/20 shadow-md"
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        <span>Add Skill</span>
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Category tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                                selectedCategory === 'all'
                                    ? 'bg-[var(--secondary)] text-[var(--bg)] shadow-sm'
                                    : 'border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            ALL CATEGORIES ({skills.length})
                        </button>
                        {allCategories.map((cat) => {
                            const count = skills.filter(
                                (s) => s.category === cat,
                            ).length;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-[var(--secondary)] text-[var(--bg)] shadow-sm'
                                            : 'border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
                                    }`}
                                >
                                    {cat.toUpperCase()} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search skills..."
                            className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] py-1.5 pr-3 pl-8 text-xs text-[var(--text)] transition-colors focus:border-[var(--secondary)] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Categories and Sortable Lists */}
                {Object.keys(groupedSkills).length === 0 ? (
                    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-12 text-center backdrop-blur-xl">
                        <Layers className="mx-auto h-10 w-10 text-[var(--text-muted)]" />
                        <h3 className="mt-3 font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                            No skills found
                        </h3>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                            {searchQuery
                                ? 'No skills matched your search filter.'
                                : 'No competencies found in this category. Click "Add Skill" above.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedSkills).map(
                            ([categoryName, catSkills]) => (
                                <div
                                    key={categoryName}
                                    className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/60 p-6 backdrop-blur-xl"
                                >
                                    <div className="mb-4 flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-['Orbitron',sans-serif] text-sm font-bold tracking-wider text-[var(--secondary)]">
                                                {categoryName.toUpperCase()}
                                            </span>
                                            <span className="rounded bg-[var(--surface-border)] px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                                {catSkills.length} competencies
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-[var(--text-muted)]">
                                            Drag handle to reorder within
                                            category
                                        </span>
                                    </div>

                                    <SortableList
                                        items={catSkills}
                                        onReorder={(newItems) =>
                                            handleReorderCategory(
                                                categoryName,
                                                newItems,
                                            )
                                        }
                                        renderItem={(skill) => (
                                            <div className="flex flex-1 items-center justify-between gap-4 py-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] shadow-inner">
                                                        {renderSkillIcon(
                                                            skill.icon,
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[var(--text)]">
                                                            {skill.name}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--surface-border)]">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                                                                    style={{
                                                                        width: `${skill.level}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="font-['JetBrains_Mono',monospace] text-[10px] font-medium text-[var(--text-muted)]">
                                                                {skill.level}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className="flex items-center gap-3"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <PublishToggle
                                                        published={
                                                            skill.is_published
                                                        }
                                                        onChange={() =>
                                                            handleTogglePublish(
                                                                skill,
                                                            )
                                                        }
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditSkillModal(
                                                                skill,
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:border-[var(--secondary)] hover:text-[var(--text)]"
                                                        title="Edit skill"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeletingSkill(
                                                                skill,
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
                                                        title="Delete skill"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            ),
                        )}
                    </div>
                )}
            </div>

            {/* Add / Edit Skill Modal */}
            <Dialog open={skillModalOpen} onOpenChange={setSkillModalOpen}>
                <DialogContent className="max-w-md border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)]">
                    <DialogHeader>
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveSkill} className="space-y-4 pt-2">
                        <TextInput
                            label="Skill Name"
                            value={skillData.name}
                            onChange={(val) => setSkillData('name', val)}
                            error={skillErrors.name}
                            placeholder="e.g. Laravel or TypeScript"
                            required
                        />

                        {/* Category selection */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium tracking-wider text-[var(--text-muted)] uppercase">
                                    Category
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsCreatingNewCategory(
                                            !isCreatingNewCategory,
                                        )
                                    }
                                    className="text-[10px] font-semibold text-[var(--secondary)] hover:underline"
                                >
                                    {isCreatingNewCategory
                                        ? 'Select existing'
                                        : '+ New category'}
                                </button>
                            </div>

                            {isCreatingNewCategory ? (
                                <TextInput
                                    label=""
                                    value={skillData.new_category}
                                    onChange={(val) =>
                                        setSkillData('new_category', val)
                                    }
                                    error={skillErrors.category}
                                    placeholder="Type new category name (e.g. Cloud, Mobile)"
                                    required
                                />
                            ) : (
                                <select
                                    value={skillData.category}
                                    onChange={(e) =>
                                        setSkillData('category', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] transition-colors focus:border-[var(--secondary)] focus:outline-none"
                                >
                                    {allCategories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Level slider */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium tracking-wider text-[var(--text-muted)] uppercase">
                                    Proficiency Level (0–100%)
                                </label>
                                <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[var(--secondary)]">
                                    {skillData.level}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={skillData.level}
                                onChange={(e) =>
                                    setSkillData(
                                        'level',
                                        parseInt(e.target.value, 10),
                                    )
                                }
                                className="w-full accent-[var(--secondary)]"
                            />
                            {skillErrors.level && (
                                <p className="text-xs text-[var(--danger)]">
                                    {skillErrors.level}
                                </p>
                            )}
                        </div>

                        {/* Icon Picker */}
                        <IconPicker
                            label="Lineicons Outline Icon"
                            value={skillData.icon}
                            onChange={(icon) => setSkillData('icon', icon)}
                            error={skillErrors.icon}
                        />

                        {/* Publish state */}
                        <div className="flex items-center justify-between border-t border-[var(--surface-border)] pt-4">
                            <span className="text-xs font-medium text-[var(--text)]">
                                Publish Status
                            </span>
                            <PublishToggle
                                published={skillData.is_published}
                                onChange={(val) =>
                                    setSkillData('is_published', val)
                                }
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSkillModalOpen(false)}
                                className="border-[var(--surface-border)]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={savingSkill}
                                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white"
                            >
                                <Save className="mr-1.5 h-4 w-4" />
                                <span>
                                    {editingSkill
                                        ? 'Save Changes'
                                        : 'Create Skill'}
                                </span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Skill Confirmation Dialog */}
            <DeleteDialog
                open={deletingSkill !== null}
                onOpenChange={(open) => !open && setDeletingSkill(null)}
                title="Delete Technical Skill"
                description={`Are you sure you want to delete "${deletingSkill?.name}" from ${deletingSkill?.category}?`}
                onConfirm={handleDeleteSkill}
            />
        </AdminLayout>
    );
}
