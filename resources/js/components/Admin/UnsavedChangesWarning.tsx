import { useEffect } from 'react';
import { router } from '@inertiajs/react';

interface UnsavedChangesWarningProps {
    isDirty: boolean;
    message?: string;
}

export default function UnsavedChangesWarning({
    isDirty,
    message = 'You have unsaved changes. Are you sure you want to discard them and leave?',
}: UnsavedChangesWarningProps) {
    useEffect(() => {
        if (!isDirty) {
            return;
        }

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        const removeInertiaListener = router.on('before', (event) => {
            if (isDirty && !window.confirm(message)) {
                event.preventDefault();
            }
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            removeInertiaListener();
        };
    }, [isDirty, message]);

    return null;
}
