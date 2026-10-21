<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to eliminate theme flashing before first paint --}}
        <script>
            (function() {
                try {
                    const defaultTheme = {!! json_encode($themeSettings['default_theme'] ?? 'system') !!};
                    window.__PORTFOLIO_DEFAULT_THEME__ = defaultTheme;

                    const stored = localStorage.getItem('theme');
                    const activeTheme = (stored === 'dark' || stored === 'light' || stored === 'system') ? stored : defaultTheme;
                    const isDark = activeTheme === 'dark' || (activeTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                    if (isDark) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.setAttribute('data-theme', 'dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.setAttribute('data-theme', 'light');
                    }
                } catch (e) {
                    // Fallback to system preference if localStorage access fails
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.setAttribute('data-theme', 'dark');
                    }
                }
            })();
        </script>

        {{-- Background and font color baseline to match Design Guideline Section 2 (Paper & Charcoal) --}}
        <style>
            html {
                background-color: #F2EFE6;
                color: #171914;
            }

            html.dark, html[data-theme="dark"] {
                background-color: #171914;
                color: #F2EFE6;
            }
        </style>

        {{-- Custom database theme token overrides --}}
        @if(isset($themeSettings) && !empty($themeSettings))
        <style id="custom-theme-vars">
            :root {
                @if(!empty($themeSettings['light_primary'])) --primary: {{ $themeSettings['light_primary'] }}; @endif
                @if(!empty($themeSettings['light_secondary'])) --secondary: {{ $themeSettings['light_secondary'] }}; @endif
                @if(!empty($themeSettings['light_accent'])) --accent: {{ $themeSettings['light_accent'] }}; @endif
            }
            .dark, [data-theme="dark"] {
                @if(!empty($themeSettings['dark_primary'])) --primary: {{ $themeSettings['dark_primary'] }}; @endif
                @if(!empty($themeSettings['dark_secondary'])) --secondary: {{ $themeSettings['dark_secondary'] }}; @endif
                @if(!empty($themeSettings['dark_accent'])) --accent: {{ $themeSettings['dark_accent'] }}; @endif
            }
        </style>
        @endif

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Monayem Azam - Space Portfolio') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased overflow-x-hidden selection:bg-[var(--primary)] selection:text-white">
        <x-inertia::app />
    </body>
</html>
