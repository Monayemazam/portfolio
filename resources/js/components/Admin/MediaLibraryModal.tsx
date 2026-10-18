import React, { useEffect, useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { MediaItem, PaginatedData } from '@/types/admin';
import EmptyState from './EmptyState';

interface MediaLibraryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (media: MediaItem) => void;
    acceptedType?: 'image' | 'video' | 'document' | 'all';
    title?: string;
}

export default function MediaLibraryModal({
    open,
    onOpenChange,
    onSelect,
    acceptedType = 'image',
    title = 'Media Library',
}: MediaLibraryModalProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>(
        acceptedType === 'all' ? '' : acceptedType,
    );
    const [altText, setAltText] = useState('');
    const [savingAlt, setSavingAlt] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (typeFilter) params.append('type', typeFilter);
            if (search) params.append('search', search);
            params.append('per_page', '40');

            const res = await fetch(`/admin/media?${params.toString()}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (res.ok) {
                const data: PaginatedData<MediaItem> = await res.json();
                setMediaItems(data.data);
                if (data.data.length > 0 && !selectedItem) {
                    setSelectedItem(data.data[0]);
                    setAltText(data.data[0].alt_text || '');
                }
            }
        } catch (error) {
            console.error('Failed to load media:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            void fetchMedia();
        }
    }, [open, typeFilter, search]);

    useEffect(() => {
        if (selectedItem) {
            setAltText(selectedItem.alt_text || '');
        }
    }, [selectedItem]);

    const handleUpload = async (files: FileList | File[]) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadProgress(10);

        const formData = new FormData();
        if (files.length === 1) {
            formData.append('file', files[0]);
        } else {
            Array.from(files).forEach((file) =>
                formData.append('files[]', file),
            );
        }

        try {
            const csrfToken =
                (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                )?.content || '';
            const res = await fetch('/admin/media', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });

            setUploadProgress(90);

            if (res.ok) {
                const result = await res.json();
                await fetchMedia();
                if (result.media && result.media.length > 0) {
                    setSelectedItem(result.media[0]);
                }
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Upload failed.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Check file size and type.');
        } finally {
            setUploading(false);
            setUploadProgress(null);
        }
    };

    const handleSaveAltText = async () => {
        if (!selectedItem) return;
        setSavingAlt(true);
        try {
            const csrfToken =
                (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                )?.content || '';
            const res = await fetch(`/admin/media/${selectedItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    alt_text: altText,
                    original_name: selectedItem.original_name,
                }),
            });

            if (res.ok) {
                const updated: { media: MediaItem } = await res.json();
                setSelectedItem(updated.media);
                setMediaItems((prev) =>
                    prev.map((item) =>
                        item.id === updated.media.id ? updated.media : item,
                    ),
                );
            }
        } catch (error) {
            console.error('Failed to update alt text:', error);
        } finally {
            setSavingAlt(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[90vh] max-h-[850px] w-[95vw] max-w-6xl flex-col border-[var(--surface-border)] bg-[var(--bg-elevated)] p-0 backdrop-blur-2xl">
                {/* Header */}
                <DialogHeader className="border-b border-[var(--surface-border)] px-6 py-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="font-['Orbitron',sans-serif] text-base font-bold text-[var(--text)]">
                            {title}
                        </DialogTitle>
                        <Button
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-xs font-semibold text-white shadow-md hover:opacity-90"
                        >
                            {uploading ? (
                                <Spinner className="mr-1.5 h-3.5 w-3.5" />
                            ) : (
                                '+ Upload File'
                            )}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                                e.target.files &&
                                void handleUpload(e.target.files)
                            }
                        />
                    </div>
                </DialogHeader>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--surface-border)] bg-[var(--surface)]/40 px-6 py-3">
                    <div className="flex items-center gap-1.5">
                        {['', 'image', 'video', 'document'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setTypeFilter(type)}
                                className={`rounded-lg px-3 py-1.5 font-['JetBrains_Mono',monospace] text-xs font-medium transition-colors ${
                                    typeFilter === type
                                        ? 'bg-[var(--primary)] text-white shadow-sm'
                                        : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                                }`}
                            >
                                {type === ''
                                    ? 'All Files'
                                    : type.toUpperCase() + 'S'}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full max-w-xs">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by filename or alt text..."
                            className="h-8 w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-[var(--secondary)] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Main Content: Grid + Details Side Panel */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Grid Area */}
                    <div
                        className={`relative flex-1 overflow-y-auto p-6 transition-colors ${
                            dragOver
                                ? 'border-2 border-dashed border-[var(--secondary)] bg-[var(--secondary)]/5'
                                : ''
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                            if (e.dataTransfer.files) {
                                void handleUpload(e.dataTransfer.files);
                            }
                        }}
                    >
                        {uploadProgress !== null && (
                            <div className="mb-4 overflow-hidden rounded-full bg-[var(--surface-border)]">
                                <div
                                    className="h-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}

                        {loading ? (
                            <div className="flex h-64 items-center justify-center">
                                <Spinner className="h-8 w-8 text-[var(--secondary)]" />
                            </div>
                        ) : mediaItems.length === 0 ? (
                            <EmptyState
                                title="No media files found"
                                description="Drag and drop image, video, or PDF files here to upload."
                                actionLabel="Select Files to Upload"
                                onAction={() => fileInputRef.current?.click()}
                            />
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {mediaItems.map((item) => {
                                    const isSelected =
                                        selectedItem?.id === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedItem(item)
                                            }
                                            className={`group relative aspect-square overflow-hidden rounded-xl border text-left transition-all ${
                                                isSelected
                                                    ? 'border-[var(--secondary)] shadow-md ring-2 ring-[var(--secondary)] ring-offset-2 ring-offset-[var(--bg)]'
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
                                                <div className="flex h-full w-full flex-col items-center justify-center p-3 text-center text-[var(--text-muted)]">
                                                    <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[var(--secondary)] uppercase">
                                                        {item.type}
                                                    </span>
                                                    <span className="mt-2 line-clamp-2 text-[11px]">
                                                        {item.original_name}
                                                    </span>
                                                </div>
                                            )}

                                            {item.is_in_use && (
                                                <span className="absolute top-2 left-2 rounded bg-[var(--primary)]/90 px-1.5 py-0.5 font-['JetBrains_Mono',monospace] text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                                                    In use
                                                </span>
                                            )}

                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                <p className="truncate font-medium">
                                                    {item.original_name}
                                                </p>
                                                <p className="text-[9px] text-slate-300">
                                                    {item.formatted_size}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Detail Inspection Side Panel */}
                    {selectedItem && (
                        <div className="flex w-80 shrink-0 flex-col justify-between overflow-y-auto border-l border-[var(--surface-border)] bg-[var(--surface)]/30 p-5">
                            <div className="space-y-4">
                                <h4 className="font-['Orbitron',sans-serif] text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">
                                    File Details
                                </h4>

                                <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--bg)]">
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
                                        <span className="font-['JetBrains_Mono',monospace] text-xs text-[var(--secondary)] uppercase">
                                            {selectedItem.type} Preview
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-[var(--text-muted)]">
                                            Name:{' '}
                                        </span>
                                        <span className="font-medium break-all text-[var(--text)]">
                                            {selectedItem.original_name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-muted)]">
                                            Size:{' '}
                                        </span>
                                        <span className="font-['JetBrains_Mono',monospace] text-[var(--text)]">
                                            {selectedItem.formatted_size}
                                        </span>
                                    </div>
                                    {selectedItem.width &&
                                        selectedItem.height && (
                                            <div>
                                                <span className="text-[var(--text-muted)]">
                                                    Dimensions:{' '}
                                                </span>
                                                <span className="font-['JetBrains_Mono',monospace] text-[var(--text)]">
                                                    {selectedItem.width} ×{' '}
                                                    {selectedItem.height} px
                                                </span>
                                            </div>
                                        )}
                                    <div>
                                        <span className="text-[var(--text-muted)]">
                                            MIME:{' '}
                                        </span>
                                        <span className="font-['JetBrains_Mono',monospace] text-[var(--text)]">
                                            {selectedItem.mime}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-muted)]">
                                            Status:{' '}
                                        </span>
                                        <span
                                            className={`font-['JetBrains_Mono',monospace] font-semibold ${
                                                selectedItem.is_in_use
                                                    ? 'text-[var(--accent)]'
                                                    : 'text-[var(--success)]'
                                            }`}
                                        >
                                            {selectedItem.is_in_use
                                                ? `In use (${selectedItem.reference_count} refs)`
                                                : 'Unused'}
                                        </span>
                                    </div>
                                </div>

                                {/* Alt text editor */}
                                {selectedItem.type === 'image' && (
                                    <div className="space-y-1.5 border-t border-[var(--surface-border)] pt-3">
                                        <label className="font-['JetBrains_Mono',monospace] text-[10px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                            Alt Text (Accessibility)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={altText}
                                            onChange={(e) =>
                                                setAltText(e.target.value)
                                            }
                                            placeholder="Describe image for screen readers..."
                                            className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] p-2 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-[var(--secondary)] focus:outline-none"
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            disabled={
                                                savingAlt ||
                                                altText ===
                                                    (selectedItem.alt_text ||
                                                        '')
                                            }
                                            onClick={() => {
                                                void handleSaveAltText();
                                            }}
                                            className="w-full border-[var(--surface-border)] text-xs hover:bg-[var(--surface)]"
                                        >
                                            {savingAlt && (
                                                <Spinner className="mr-1.5 h-3 w-3" />
                                            )}
                                            Save Alt Text
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[var(--surface-border)] pt-4">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onSelect(selectedItem);
                                        onOpenChange(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-xs font-semibold text-white shadow-md hover:opacity-90"
                                >
                                    Select This File
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
