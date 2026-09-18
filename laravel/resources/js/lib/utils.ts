import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Fetches the custom-scheme URL from the backend and navigates directly to it.
// A server-side 302 strips credentials in Safari (HTTP Location header
// canonicalisation). Setting window.location.href directly from JS bypasses
// that pipeline and passes the raw URL to macOS Launch Services.
export async function openExternalApp(routeUrl: string): Promise<void> {
    const { url } = await fetch(routeUrl, {
        headers: { Accept: 'application/json' },
    }).then((r) => r.json());
    window.location.href = url;
}
