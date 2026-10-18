import React, { useState, useRef } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import DeleteDialog from '@/components/Admin/DeleteDialog';
import EmptyState from '@/components/Admin/EmptyState';
import {
    UploadCloud,
    Search,
    AlertCircle,
    Check,
    Trash2,
    RefreshCw,
    ExternalLink,
} from 'lucide-react';
import type { MediaItem, PaginatedData } from '@/types/admin';

interface MediaIndexProps {
    media: PaginatedData<MediaItem>;
    filters: {
        type: string;
        search: string;
        sort: string;
    };
}

export default function MediaIndex({ media, filters }: MediaIndexProps) {
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(
        media.data[0] || null,
    );
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [sort, setSort] = useState(filters.sort || 'newest');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [dragOver, setDragOver] = useState(false);

    // Edit state
    const [editingAlt, setEditingAlt] = useState('');
    const [editingName, setEditingName] = useState('');
    const [isSavingMeta, setIsSavingMeta] = useState(false);
    const [isReplacing, setIsReplacing] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);

    // Synchronize editing inputs on selection change
    React.useEffect(() => {
        if (selectedItem) {
            setEditingAlt(selectedItem.alt_text || '');
            setEditingName(selectedItem.original_name);
        }
    }, [selectedItem]);

    const applyFilters = (
        newType?: string,
        newSearch?: string,
        newSort?: string,
    ) => {
        router.get(
            '/admin/media',
            {
                type: newType !== undefined ? newType : typeFilter,
                search: newSearch !== undefined ? newSearch : search,
                sort: newSort !== undefined ? newSort : sort,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(typeFilter, search, sort);
    };

    const handleUploadFiles = (files: FileList | File[]) => {
        if (!files || files.length === 0) return;

        // Client-side size & type pre-validation
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const sizeMb = file.size / (1024 * 1024);
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const isPdf = file.type === 'application/pdf';

            if (isImage && sizeMb > 5) {
                alert(`File "${file.name}" exceeds the 5 MB limit for images.`);
                return;
            }
            if ((isVideo || isPdf) && sizeMb > 10) {
                alert(
                    `File "${file.name}" exceeds the 10 MB limit for videos and PDFs.`,
                );
                return;
            }
        }

        setIsUploading(true);
        setUploadProgress(15);

        const formData = new FormData();
        if (files.length === 1) {
            formData.append('file', files[0]);
        } else {
            Array.from(files).forEach((f) => formData.append('files[]', f));
        }

        router.post('/admin/media', formData, {
            forceFormData: true,
            onProgress: (p) => {
                if (p && p.percentage) {
                    setUploadProgress(p.percentage);
                }
            },
            onSuccess: () => {
                setIsUploading(false);
                setUploadProgress(null);
            },
            onError: (errs) => {
                setIsUploading(false);
                setUploadProgress(null);
                const firstError = Object.values(errs)[0];
                alert(firstError || 'Upload failed.');
            },
        });
    };

    const handleSaveMetadata = () => {
        if (!selectedItem) return;
        setIsSavingMeta(true);

        router.put(
            `/admin/media/${selectedItem.id}`,
            {
                alt_text: editingAlt,
                original_name: editingName,
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsSavingMeta(false),
                onError: () => setIsSavingMeta(false),
            },
        );
    };

    const handleReplaceFile = (file: File) => {
        if (!selectedItem) return;
        setIsReplacing(true);

        const formData = new FormData();
        formData.append('file', file);

        router.post(`/admin/media/${selectedItem.id}/replace`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setIsReplacing(false),
            onError: () => setIsReplacing(false),
        });
    };

    const handleDeleteConfirm = () => {
        if (!selectedItem) return;
        setIsDeleting(true);

        router.delete(`/admin/media/${selectedItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setSelectedItem(null);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AdminLayout
            title="Media Library"
            breadcrumbs={[{ title: 'Media Library', href: '/admin/media' }]}
        >
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-['Orbitron',sans-serif] text-2xl font-bold tracking-tight text-[var(--text)]">
                        Media Library
                    </h1>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Upload and manage images, videos, and portfolio PDFs
                        with automatic WebP generation.
                    </p>
                </div>

                <div>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-semibold text-white shadow-[var(--primary)]/20 shadow-lg hover:opacity-90"
                    >
                        {isUploading ? (
                            <>
                                <Spinner className="mr-2 h-4 w-4" />{' '}
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="mr-2 h-4 w-4" /> Upload
                                Media
                            </>
                        )}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                            e.target.files && handleUploadFiles(e.target.files)
                        }
                    />
                </div>
            </div>

            {/* Drag & Drop Upload Zone Bar */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files) {
                        handleUploadFiles(e.dataTransfer.files);
                    }
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                    dragOver
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
                        : 'border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--secondary)]/60'
                }`}
            >
                <UploadCloud className="h-8 w-8 text-[var(--secondary)]" />
                <p className="mt-2 text-xs font-semibold text-[var(--text)]">
                    Drag and drop files here to upload
                </p>
                <p className="mt-0.5 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                    Images: JPG, PNG, WebP, GIF, SVG (max 5 MB) • Videos: MP4,
                    WebM (max 10 MB) • Docs: PDF (max 10 MB)
                </p>

                {uploadProgress !== null && (
                    <div className="mt-4 w-full max-w-md overflow-hidden rounded-full bg-[var(--surface-border)]">
                        <div
                            className="h-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                {/* Type Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {[
                        { label: 'All Types', value: '' },
                        { label: 'Images', value: 'image' },
                        { label: 'Videos', value: 'video' },
                        { label: 'Documents', value: 'document' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setTypeFilter(tab.value);
                                applyFilters(tab.value, search, sort);
                            }}
                            className={`rounded-xl px-3 py-1.5 font-['JetBrains_Mono',monospace] text-xs font-semibold tracking-wider uppercase transition-all ${
                                typeFilter === tab.value
                                    ? 'bg-[var(--primary)] text-white shadow-sm'
                                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-border)] hover:text-[var(--text)]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex items-center gap-2">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative w-full sm:w-56"
                    >
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search media..."
                            className="h-9 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] pr-3 pl-9 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-[var(--secondary)] focus:outline-none"
                        />
                        <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-[var(--text-muted)]" />
                    </form>

                    <select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            applyFilters(typeFilter, search, e.target.value);
                        }}
                        className="h-9 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-3 font-['JetBrains_Mono',monospace] text-xs text-[var(--text)] focus:ring-1 focus:ring-[var(--secondary)] focus:outline-none"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name">Name A-Z</option>
                        <option value="size">Largest Size</option>
                    </select>
                </div>
            </div>

            {/* Media Content Area: Grid + Side Detail Drawer */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Media Grid (2 columns on lg) */}
                <div className="space-y-4 lg:col-span-2">
                    {media.data.length === 0 ? (
                        <EmptyState
                            title="No media assets found"
                            description="Upload your project screenshots, Monayem porthole photo, or resume PDF."
                            actionLabel="Upload Files"
                            onAction={() => fileInputRef.current?.click()}
                        />
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {media.data.map((item) => {
                                const isSelected = selectedItem?.id === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedItem(item)}
                                        className={`group relative aspect-square overflow-hidden rounded-2xl border text-left transition-all ${
                                            isSelected
                                                ? 'border-[var(--secondary)] shadow-[var(--primary)]/10 shadow-lg ring-2 ring-[var(--secondary)] ring-offset-2 ring-offset-[var(--bg)]'
                                                : 'border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--secondary)]/60'
                                        }`}
                                    >
                                        {item.type === 'image' ? (
                                            <img
                                                src={
                                                    item.thumb_url ||
                                                    item.webp_url ||
                                                    item.url
                                                }
                                                alt={
                                                    item.alt_text ||
                                                    item.original_name
                                                }
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center">
                                                <span className="rounded bg-[var(--secondary)]/10 px-2 py-1 font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[var(--secondary)] uppercase">
                                                    {item.type}
                                                </span>
                                                <span className="mt-2 line-clamp-2 text-[11px] font-medium text-[var(--text)]">
                                                    {item.original_name}
                                                </span>
                                            </div>
                                        )}

                                        {item.is_in_use && (
                                            <span className="absolute top-2.5 left-2.5 rounded-md bg-[var(--primary)]/90 px-2 py-0.5 font-['JetBrains_Mono',monospace] text-[9px] font-bold tracking-wider text-white uppercase shadow-sm backdrop-blur-sm">
                                                In use
                                            </span>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                            <p className="truncate text-xs font-semibold">
                                                {item.original_name}
                                            </p>
                                            <p className="font-['JetBrains_Mono',monospace] text-[10px] text-slate-300">
                                                {item.formatted_size}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {media.links && media.links.length > 3 && (
                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] px-6 py-4 sm:flex-row">
                            <span className="font-['JetBrains_Mono',monospace] text-xs text-[var(--text-muted)]">
                                Showing {media.from ?? 0} to {media.to ?? 0} of{' '}
                                {media.total} files
                            </span>
                            <div className="flex items-center gap-1">
                                {media.links.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-[var(--primary)] text-white shadow-sm'
                                                    : 'border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-[var(--text)] hover:bg-[var(--surface-border)]'
                                            }`}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            className="inline-flex h-8 items-center justify-center px-2 text-xs text-[var(--text-muted)]/50"
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side File Detail Inspection Panel (1 column on lg) */}
                <div className="space-y-4">
                    {selectedItem ? (
                        <div className="sticky top-6 space-y-5 rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">
                                    Asset Telemetry
                                </h3>
                                <span
                                    className={`rounded-full px-2.5 py-0.5 font-['JetBrains_Mono',monospace] text-[10px] font-bold tracking-wider uppercase ${
                                        selectedItem.is_in_use
                                            ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                                            : 'bg-[var(--success)]/15 text-[var(--success)]'
                                    }`}
                                >
                                    {selectedItem.is_in_use
                                        ? `In use (${selectedItem.reference_count} refs)`
                                        : 'Unreferenced'}
                                </span>
                            </div>

                            {/* Large Image Preview */}
                            <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--bg)]">
                                {selectedItem.type === 'image' ? (
                                    <img
                                        src={selectedItem.url}
                                        alt={
                                            selectedItem.alt_text ||
                                            selectedItem.original_name
                                        }
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="p-4 text-center">
                                        <p className="font-['Orbitron',sans-serif] text-sm font-bold text-[var(--secondary)]">
                                            {selectedItem.type.toUpperCase()}
                                        </p>
                                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                                            {selectedItem.original_name}
                                        </p>
                                    </div>
                                )}
                                <a
                                    href={selectedItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    title="Open original file"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>

                            {/* Reference Warning Notice if In Use */}
                            {selectedItem.is_in_use && (
                                <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-3 text-xs text-[var(--text)]">
                                    <div className="flex items-center gap-1.5 font-semibold text-[var(--accent)]">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>Protected from deletion</span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                                        This file is referenced by active
                                        portfolio entities (
                                        {selectedItem.reference_count} total).
                                        To delete, remove all references first.
                                    </p>
                                </div>
                            )}

                            {/* Metadata Specs */}
                            <div className="space-y-2 border-y border-[var(--surface-border)] py-3 font-['JetBrains_Mono',monospace] text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">
                                        File Size:
                                    </span>
                                    <span className="text-[var(--text)]">
                                        {selectedItem.formatted_size}
                                    </span>
                                </div>
                                {selectedItem.width && selectedItem.height && (
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-muted)]">
                                            Dimensions:
                                        </span>
                                        <span className="text-[var(--text)]">
                                            {selectedItem.width} ×{' '}
                                            {selectedItem.height} px
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">
                                        MIME Type:
                                    </span>
                                    <span className="text-[var(--text)]">
                                        {selectedItem.mime}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">
                                        WebP Form:
                                    </span>
                                    <span
                                        className={
                                            selectedItem.webp_path
                                                ? 'text-[var(--success)]'
                                                : 'text-[var(--text-muted)]'
                                        }
                                    >
                                        {selectedItem.webp_path
                                            ? 'Generated'
                                            : 'None'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">
                                        Thumbnail:
                                    </span>
                                    <span
                                        className={
                                            selectedItem.thumb_path
                                                ? 'text-[var(--success)]'
                                                : 'text-[var(--text-muted)]'
                                        }
                                    >
                                        {selectedItem.thumb_path
                                            ? '400px Ready'
                                            : 'None'}
                                    </span>
                                </div>
                            </div>

                            {/* Form: Editable Name & Alt text */}
                            <div className="space-y-3">
                                <div>
                                    <label className="font-['JetBrains_Mono',monospace] text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                        Display Filename
                                    </label>
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) =>
                                            setEditingName(e.target.value)
                                        }
                                        className="mt-1 h-9 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] px-3 text-xs text-[var(--text)] focus:ring-1 focus:ring-[var(--secondary)] focus:outline-none"
                                    />
                                </div>

                                {selectedItem.type === 'image' && (
                                    <div>
                                        <label className="font-['JetBrains_Mono',monospace] text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                            Alt Text (Accessibility)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={editingAlt}
                                            onChange={(e) =>
                                                setEditingAlt(e.target.value)
                                            }
                                            placeholder="Screen reader description..."
                                            className="mt-1 w-full rounded-xl border border-[var(--surface-border)] bg-[var(--bg-elevated)] p-2.5 text-xs text-[var(--text)] focus:ring-1 focus:ring-[var(--secondary)] focus:outline-none"
                                        />
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={isSavingMeta}
                                    onClick={handleSaveMetadata}
                                    className="w-full border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                >
                                    {isSavingMeta ? (
                                        <>
                                            <Spinner className="mr-1.5 h-3.5 w-3.5" />{' '}
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--success)]" />{' '}
                                            Save Metadata
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Actions: Replace & Delete */}
                            <div className="flex items-center gap-2 border-t border-[var(--surface-border)] pt-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    disabled={isReplacing}
                                    onClick={() =>
                                        replaceInputRef.current?.click()
                                    }
                                    className="flex-1 border border-[var(--surface-border)] bg-[var(--bg-elevated)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                                >
                                    {isReplacing ? (
                                        <Spinner className="mr-1.5 h-3.5 w-3.5" />
                                    ) : (
                                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                                    )}
                                    Replace File
                                </Button>
                                <input
                                    ref={replaceInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                        e.target.files &&
                                        e.target.files[0] &&
                                        handleReplaceFile(e.target.files[0])
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={selectedItem.is_in_use}
                                    onClick={() => setDeleteDialogOpen(true)}
                                    title={
                                        selectedItem.is_in_use
                                            ? 'Cannot delete media currently in use'
                                            : 'Delete media file'
                                    }
                                    className="text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] disabled:opacity-40"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 text-center text-xs text-[var(--text-muted)]">
                            Select a media file from the grid to inspect details
                            and edit metadata.
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {selectedItem && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete Media File"
                    itemName={selectedItem.original_name}
                    description={`Are you sure you want to delete "${selectedItem.original_name}"? The database record, original file, WebP version, and thumbnail will be permanently removed from disk.`}
                    isDeleting={isDeleting}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </AdminLayout>
    );
}
