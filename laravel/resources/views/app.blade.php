<!DOCTYPE html>
{{-- translate="no" is load-bearing: Google Translate rewrites text nodes underneath React,
     which makes it crash on removeChild. The class and meta cover older Chrome builds. --}}
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" translate="no"
      @class(['notranslate', 'dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <meta name="google" content="notranslate">

        {{-- Tints the browser UI (e.g. Safari's toolbar) to match the app background. Kept in sync with use-appearance's applyTheme. --}}
        <meta name="theme-color" content="#ffffff">

        {{-- Applies the stored appearance before first paint, so a dark-mode reload never flashes white. --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

                if (isDark) {
                    document.documentElement.classList.add('dark');
                }

                document
                    .querySelector('meta[name="theme-color"]')
                    ?.setAttribute('content', isDark ? '#0a0a0a' : '#ffffff');
            })();
        </script>

        {{-- The html background comes from the same theme values as app.css. --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" type="image/png" href="/favicon.png" sizes="512x512">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

        {{-- Self-hosted, so the body font no longer waits on a third-party connection.
             Inter (body) and Space Grotesk (headings) render on every page, so both are
             preloaded; JetBrains Mono loads on demand with font-display: swap. --}}
        <link rel="preload" as="font" type="font/woff2" href="{{ Vite::asset('resources/fonts/inter-var-latin.woff2') }}" crossorigin>
        <link rel="preload" as="font" type="font/woff2" href="{{ Vite::asset('resources/fonts/space-grotesk-var-latin.woff2') }}" crossorigin>

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
