import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MediaLibraryModal from './MediaLibraryModal';
import type { MediaItem } from '@/types/admin';

interface MediaPickerProps {
    value?: MediaItem | null;
    onChange: (media: MediaItem | null) => void;
    label?: string;
    acceptedType?: 'image' | 'video' | 'document' | 'all';
    description?: string;
}

export default function MediaPicker({
    value,
    onChange,
    label = 'Select Media',
    acceptedType = 'image',
    description,
}: MediaPickerProps) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="space-y-2">
            {value ? (
                <div className="group relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-3 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--bg)]">
                            {value.type === 'image' ? (
                                <img
                                    src={
                                        value.thumb_url ||
                                        value.webp_url ||
                                        value.url
                                    }
                                    alt={value.alt_text || value.original_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center font-['JetBrains_Mono',monospace] text-xs font-bold text-[var(--secondary)] uppercase">
                                    {value.type}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <p className="truncate text-xs font-semibold text-[var(--text)]">
                                {value.original_name}
                            </p>
                            <div className="flex items-center gap-2 font-['JetBrains_Mono',monospace] text-[10px] text-[var(--text-muted)]">
                                <span>{value.formatted_size}</span>
                                {value.width && value.height && (
                                    <>
                                        <span>•</span>
                                        <span>
                                            {value.width}×{value.height}
                                        </span>
                                    </>
                                )}
                            </div>
                            {value.alt_text && (
                                <p className="truncate text-[10px] text-[var(--text-muted)] italic">
                                    Alt: "{value.alt_text}"
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setModalOpen(true)}
                                className="border-[var(--surface-border)] text-xs text-[var(--text)] hover:bg-[var(--surface-border)]"
                            >
                                Replace
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(null)}
                                className="text-xs text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => setModalOpen(true)}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--surface-border)] bg-[var(--surface)]/50 p-6 text-center transition-all hover:border-[var(--secondary)]/80 hover:bg-[var(--surface)]"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-elevated)] text-[var(--secondary)] shadow-sm">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-[var(--text)]">
                        {label}
                    </p>
                    {description && (
                        <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <MediaLibraryModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSelect={(media) => {
                    onChange(media);
                    setModalOpen(false);
                }}
                acceptedType={acceptedType}
                title={`Select ${label}`}
            />
        </div>
    );
}
