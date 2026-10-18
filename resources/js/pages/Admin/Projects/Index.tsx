import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    PlanetPreview,
    PublishToggle,
    SortableList,
    DragHandle,
    DeleteDialog,
    EmptyState,
} from '@/components/Admin';
import { Button } from '@/components/ui/button';
import type { ProjectItem } from '@/types/admin';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    RotateCcw,
    ExternalLink,
    Star,
    Globe,
} from 'lucide-react';

interface Props {
    projects: ProjectItem[];
    status: 'all' | 'published' | 'draft' | 'trash';
    search: string;
    counts: {
        all: number;
        published: number;
        draft: number;
        trash: number;
    };
}

export default function ProjectsIndex({
    projects: initialProjects,
    status,
    search: initialSearch,
    counts,
}: Props) {
    const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
    const [search, setSearch] = useState(initialSearch);
    const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(
        null,
    );
    const [projectToForceDelete, setProjectToForceDelete] =
        useState<ProjectItem | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);

    // Keep state in sync with server updates
    React.useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/projects',
            {
                status,
                q: search.trim() || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleTabChange = (
        newStatus: 'all' | 'published' | 'draft' | 'trash',
    ) => {
        router.get(
            '/admin/projects',
            {
                status: newStatus,
                q: search.trim() || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleReorder = (reordered: ProjectItem[]) => {
        setProjects(reordered);
        const orders = reordered.map((item, index) => ({
            id: item.id,
            sort_order: index,
        }));

        router.post(
            '/admin/projects/reorder',
            { orders },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleTogglePublish = (project: ProjectItem) => {
        router.patch(
            `/admin/projects/${project.id}/toggle-publish`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleToggleFeatured = (project: ProjectItem) => {
        router.patch(
            `/admin/projects/${project.id}/toggle-featured`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const confirmTrash = (project: ProjectItem) => {
        setProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const handleTrashConfirm = () => {
        if (!projectToDelete) return;
        router.delete(`/admin/projects/${projectToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setProjectToDelete(null);
            },
        });
    };

    const handleRestore = (project: ProjectItem) => {
        router.post(
            `/admin/projects/${project.id}/restore`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const confirmForceDelete = (project: ProjectItem) => {
        setProjectToForceDelete(project);
        setForceDeleteModalOpen(true);
    };

    const handleForceDeleteConfirm = () => {
        if (!projectToForceDelete) return;
        router.delete(
            `/admin/projects/${projectToForceDelete.id}/force-delete`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setForceDeleteModalOpen(false);
                    setProjectToForceDelete(null);
                },
            },
        );
    };

    const isReorderable = status !== 'trash' && !search;

    return (
        <AdminLayout
            title="Projects"
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Projects' },
            ]}
        >
            <div className="space-y-6">
                {/* Header banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-wider text-[var(--text)] sm:text-3xl">
                            SOLAR SYSTEM PROJECTS
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Manage the portfolio project celestial showcase,
                            orbiting bodies, features, and assets.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/projects/create">
                            <Button className="bg-[var(--secondary)] font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-black hover:bg-[var(--secondary)]/90">
                                <Plus className="mr-1.5 h-4 w-4" />
                                NEW PROJECT
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-1 backdrop-blur-md">
                        <button
                            type="button"
                            onClick={() => handleTabChange('all')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                status === 'all'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            <span>All Projects</span>
                            <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                                {counts.all}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTabChange('published')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                status === 'published'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--success)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                            <span>Published</span>
                            <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                                {counts.published}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTabChange('draft')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                status === 'draft'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--warning)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
                            <span>Drafts</span>
                            <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                                {counts.draft}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTabChange('trash')}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                status === 'trash'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--danger)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Trash</span>
                            <span className="rounded-md bg-[var(--surface-border)] px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px]">
                                {counts.trash}
                            </span>
                        </button>
                    </div>

                    {/* Search Form */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative max-w-md flex-1"
                    >
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search title, summary, business..."
                            className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] py-2 pr-4 pl-10 text-xs text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] focus:outline-none"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(
                                        '/admin/projects',
                                        { status },
                                        { preserveState: true },
                                    );
                                }}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Projects List Container */}
                {projects.length === 0 ? (
                    <EmptyState
                        title={
                            status === 'trash'
                                ? 'Trash is empty'
                                : search
                                  ? 'No matching projects found'
                                  : 'No projects found'
                        }
                        description={
                            status === 'trash'
                                ? 'Projects moved to trash will appear here for restoration or permanent deletion.'
                                : search
                                  ? `No projects match "${search}". Try clearing your search filter.`
                                  : 'Start by creating your first solar-system showcase project.'
                        }
                        actionLabel={
                            status !== 'trash' && !search
                                ? 'Create Project'
                                : undefined
                        }
                        actionHref={
                            status !== 'trash' && !search
                                ? '/admin/projects/create'
                                : undefined
                        }
                    />
                ) : isReorderable ? (
                    <SortableList
                        items={projects}
                        onReorder={handleReorder}
                        className="space-y-3"
                        renderItem={(project, dragHandleProps) => (
                            <ProjectCard
                                project={project}
                                dragHandleProps={dragHandleProps}
                                onTogglePublish={() =>
                                    handleTogglePublish(project)
                                }
                                onToggleFeatured={() =>
                                    handleToggleFeatured(project)
                                }
                                onTrash={() => confirmTrash(project)}
                                onRestore={() => handleRestore(project)}
                                onForceDelete={() =>
                                    confirmForceDelete(project)
                                }
                                inTrash={false}
                            />
                        )}
                    />
                ) : (
                    <div className="space-y-3">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onTogglePublish={() =>
                                    handleTogglePublish(project)
                                }
                                onToggleFeatured={() =>
                                    handleToggleFeatured(project)
                                }
                                onTrash={() => confirmTrash(project)}
                                onRestore={() => handleRestore(project)}
                                onForceDelete={() =>
                                    confirmForceDelete(project)
                                }
                                inTrash={status === 'trash'}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Move to Trash Dialog */}
            <DeleteDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleTrashConfirm}
                title="Move Project to Trash?"
                description={
                    projectToDelete
                        ? `Are you sure you want to move "${projectToDelete.title}" to the trash? You can restore it later.`
                        : ''
                }
            />

            {/* Permanent Force Delete Dialog */}
            <DeleteDialog
                open={forceDeleteModalOpen}
                onOpenChange={setForceDeleteModalOpen}
                onConfirm={handleForceDeleteConfirm}
                title="Permanently Delete Project?"
                description={
                    projectToForceDelete
                        ? `Warning: Permanently deleting "${projectToForceDelete.title}" cannot be undone. All features, gallery attachments, and tag links will be wiped.`
                        : ''
                }
            />
        </AdminLayout>
    );
}

interface ProjectCardProps {
    project: ProjectItem;
    dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
    onTogglePublish: () => void;
    onToggleFeatured: () => void;
    onTrash: () => void;
    onRestore: () => void;
    onForceDelete: () => void;
    inTrash?: boolean;
}

function ProjectCard({
    project,
    dragHandleProps,
    onTogglePublish,
    onToggleFeatured,
    onTrash,
    onRestore,
    onForceDelete,
    inTrash = false,
}: ProjectCardProps) {
    return (
        <div className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 backdrop-blur-md transition-all duration-200 hover:border-[var(--secondary)]/40 hover:bg-[var(--surface-hover)] md:flex-row md:items-center md:justify-between">
            {/* Left section: drag handle, visual planet, title & info */}
            <div className="flex min-w-0 flex-1 items-center gap-3.5">
                {dragHandleProps && !inTrash && (
                    <DragHandle {...dragHandleProps} />
                )}

                {/* Planet Visual Preview */}
                <div className="relative flex shrink-0 items-center justify-center rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-1">
                    <PlanetPreview
                        styleKey={project.planet_style}
                        accentColor={project.accent_color}
                        size={48}
                    />
                    {project.is_featured && (
                        <span
                            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--secondary)] text-black"
                            title="Featured Planet"
                        >
                            <Star className="h-2.5 w-2.5 fill-black" />
                        </span>
                    )}
                </div>

                {/* Title & Metadata */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-['Orbitron',sans-serif] text-sm font-bold text-[var(--text)]">
                            {project.title}
                        </h2>
                        <span className="rounded-md border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                            /{project.slug}
                        </span>
                        {project.year && (
                            <span className="font-['JetBrains_Mono',monospace] text-[10px] font-semibold text-[var(--secondary)]">
                                {project.year}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
                        {project.summary}
                    </p>

                    {/* Tags row */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {project.tags.map((t) => (
                                <span
                                    key={t.id}
                                    className="rounded-md border border-[var(--surface-border)] bg-[var(--bg-elevated)]/60 px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[9px] text-[var(--text)]"
                                >
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right section: live url, toggles, and actions */}
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-[var(--surface-border)] pt-2 md:border-t-0 md:pt-0">
                {/* Live URL link */}
                {project.live_url && (
                    <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--secondary)] hover:underline"
                        title="Open live website"
                    >
                        <Globe className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Live Site</span>
                        <ExternalLink className="h-3 w-3" />
                    </a>
                )}

                {/* Featured and Published Toggles (only when not in trash) */}
                {!inTrash ? (
                    <>
                        <button
                            type="button"
                            onClick={onToggleFeatured}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                                project.is_featured
                                    ? 'border-[var(--secondary)] bg-[var(--secondary)]/15 text-[var(--secondary)]'
                                    : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                            title="Toggle featured planet size"
                        >
                            <Star
                                className={`h-3.5 w-3.5 ${project.is_featured ? 'fill-current' : ''}`}
                            />
                            <span className="text-[11px]">Featured</span>
                        </button>

                        <div className="flex items-center">
                            <PublishToggle
                                checked={project.is_published}
                                onChange={onTogglePublish}
                            />
                        </div>

                        <div className="flex items-center gap-1 border-l border-[var(--surface-border)] pl-2">
                            <Link href={`/admin/projects/${project.id}/edit`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)] hover:text-[var(--text)]"
                                >
                                    <Edit3 className="mr-1 h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onTrash}
                                className="h-8 text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                                title="Move to Trash"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </>
                ) : (
                    /* In Trash actions: Restore and Permanent Delete */
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRestore}
                            className="h-8 border-[var(--surface-border)] text-xs text-[var(--success)] hover:bg-[var(--success)]/10 hover:text-[var(--success)]"
                        >
                            <RotateCcw className="mr-1 h-3.5 w-3.5" />
                            Restore
                        </Button>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onForceDelete}
                            className="h-8 bg-[var(--danger)] text-xs text-white hover:bg-[var(--danger)]/90"
                        >
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                            Delete Permanently
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
