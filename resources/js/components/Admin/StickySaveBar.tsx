import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface StickySaveBarProps {
    isDirty: boolean;
    isSaving?: boolean;
    onSave: () => void;
    onSaveAndClose?: () => void;
    onCancel?: () => void;
    saveLabel?: string;
}

export default function StickySaveBar({
    isDirty,
    isSaving = false,
    onSave,
    onSaveAndClose,
    onCancel,
    saveLabel = 'Save changes',
}: StickySaveBarProps) {
    if (!isDirty && !isSaving) {
        return null;
    }

    return (
        <aside
            aria-label="Save actions bar"
            className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-elevated)]/95 px-6 py-3 shadow-2xl backdrop-blur-xl sm:min-w-[480px]"
        >
            <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                </span>
                <span className="font-['JetBrains_Mono',monospace] text-xs font-medium text-[var(--text)]">
                    Unsaved changes
                </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSaving}
                        onClick={onCancel}
                        className="border-[var(--surface-border)] text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                        Cancel
                    </Button>
                )}

                {onSaveAndClose && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={isSaving}
                        onClick={onSaveAndClose}
                        className="border border-[var(--surface-border)] bg-[var(--surface)] text-xs text-[var(--text)] hover:bg-[var(--surface)]/80"
                    >
                        Save & Close
                    </Button>
                )}

                <Button
                    type="button"
                    size="sm"
                    disabled={isSaving}
                    onClick={onSave}
                    className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-xs font-semibold text-white shadow-md hover:opacity-90"
                >
                    {isSaving && <Spinner className="mr-1.5 h-3.5 w-3.5" />}
                    {saveLabel}
                </Button>
            </div>
        </aside>
    );
}
