import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export function useTheme(defaultConfigured: Theme = 'system') {
    const [theme, setThemeState] = useState<Theme>(() => {
        try {
            const saved = localStorage.getItem('theme') as Theme | null;
            if (saved && ['dark', 'light', 'system'].includes(saved)) {
                return saved;
            }
        } catch {
            // LocalStorage inaccessible
        }
        return defaultConfigured;
    });

    const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark')
                ? 'dark'
                : 'light';
        }
        return 'dark';
    });

    const applyTheme = useCallback((targetTheme: Theme) => {
        let isDark = false;
        if (targetTheme === 'system') {
            isDark =
                typeof window !== 'undefined' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = targetTheme === 'dark';
        }

        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            setResolvedTheme('dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
            setResolvedTheme('light');
        }
    }, []);

    const setTheme = useCallback(
        (newTheme: Theme) => {
            try {
                localStorage.setItem('theme', newTheme);
            } catch {
                // Ignore storage errors
            }
            setThemeState(newTheme);
            applyTheme(newTheme);
        },
        [applyTheme],
    );

    const toggleTheme = useCallback(() => {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }, [resolvedTheme, setTheme]);

    useEffect(() => {
        applyTheme(theme);

        if (theme === 'system' && typeof window !== 'undefined') {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');

            media.addEventListener('change', handleChange);
            return () => media.removeEventListener('change', handleChange);
        }
    }, [theme, applyTheme]);

    return {
        theme,
        resolvedTheme,
        isDark: resolvedTheme === 'dark',
        setTheme,
        toggleTheme,
    };
}
