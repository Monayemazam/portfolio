import { useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    itemName?: string;
    description?: string;
    isDeleting?: boolean;
    onConfirm: () => void;
}

export default function DeleteDialog({
    open,
    onOpenChange,
    title = 'Confirm Deletion',
    itemName,
    description,
    isDeleting = false,
    onConfirm,
}: DeleteDialogProps) {
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => cancelButtonRef.current?.focus(), 50);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-[var(--surface-border)] bg-[var(--bg-elevated)] p-6 backdrop-blur-xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-['Orbitron',sans-serif] text-lg font-bold text-[var(--danger)]">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-sm text-[var(--text-muted)]">
                        {description || (
                            <>
                                Are you sure you want to delete{' '}
                                {itemName ? (
                                    <span className="font-semibold text-[var(--text)]">
                                        "{itemName}"
                                    </span>
                                ) : (
                                    'this item'
                                )}
                                ? This action cannot be undone.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-3">
                    <Button
                        ref={cancelButtonRef}
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="border-[var(--surface-border)] text-[var(--text)] hover:bg-[var(--surface)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-[var(--danger)] text-white hover:opacity-90"
                    >
                        {isDeleting && <Spinner className="mr-2 h-4 w-4" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
