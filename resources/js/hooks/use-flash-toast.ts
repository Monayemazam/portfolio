import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

interface PageFlashProps {
    flash?: {
        success?: string | null;
        error?: string | null;
        info?: string | null;
        toast?: FlashToast | null;
    };
}

export function useFlashToast(): void {
    useEffect(() => {
        const unregisterSuccess = router.on('success', (event) => {
            const pageProps = event.detail.page.props as PageFlashProps;
            const flash = pageProps.flash;

            if (flash?.success) {
                toast.success(flash.success);
            }
            if (flash?.error) {
                toast.error(flash.error);
            }
            if (flash?.info) {
                toast.info(flash.info);
            }
            if (flash?.toast) {
                toast[flash.toast.type](flash.toast.message);
            }
        });

        const unregisterFlash = router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (data) {
                toast[data.type](data.message);
            }
        });

        return () => {
            unregisterSuccess();
            unregisterFlash();
        };
    }, []);
}
