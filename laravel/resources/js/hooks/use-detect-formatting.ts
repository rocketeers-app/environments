import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { browserFormattingPreferences } from '@/lib/datetime';
import { detectedFormatting } from '@/lib/design-routes';
import type { SharedData } from '@/types';

/**
 * Adopts the browser's timezone and locale the first time a user lands without either
 * stored, so the common case needs no trip to the profile page. Fires at most once per
 * page load; the server refuses to overwrite a column the user has already set.
 */
export function useDetectFormatting(): void {
    const user = usePage<SharedData>().props.auth?.user;
    const submitted = useRef(false);

    const needsDetection = Boolean(user) && (!user?.timezone || !user?.locale);

    useEffect(() => {
        if (!needsDetection || submitted.current) {
            return;
        }

        submitted.current = true;

        const detected = browserFormattingPreferences();

        router.post(
            detectedFormatting().url,
            { timezone: detected.timezone, locale: detected.locale },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['formatting', 'auth'],
            },
        );
    }, [needsDetection]);
}
