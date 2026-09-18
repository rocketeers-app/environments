import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import type { FormattingPreferences } from '@/lib/datetime';
import {
    browserFormattingPreferences,
    DEFAULT_FORMATTING,
    formatAbsoluteWithZone,
    formatDateTime,
    formatDuration,
    formatDurationBetween,
    formatRelative,
    timezoneLabel,
    toDateTimeLocalInput,
} from '@/lib/datetime';
import type { SharedData } from '@/types';

/**
 * Resolves the preferences every rendering uses. Signed-in users get their stored
 * timezone and locale; unauthenticated pages (the public status pages) get the browser's,
 * because there is no user whose preference we could honour there.
 */
export function useFormattingPreferences(): FormattingPreferences {
    const page = usePage<SharedData>();
    const shared = page.props.formatting;
    const authenticated = Boolean(page.props.auth?.user);

    return useMemo(() => {
        if (authenticated && shared) {
            return shared;
        }

        return browserFormattingPreferences();
    }, [authenticated, shared]);
}

export function useDateFormat() {
    const prefs = useFormattingPreferences();

    return useMemo(
        () => ({
            preferences: prefs,
            timezone: prefs.timezone,
            locale: prefs.locale,
            date: (value: string | number | Date | null | undefined) =>
                formatDateTime(value, 'date', prefs),
            dateLong: (value: string | number | Date | null | undefined) =>
                formatDateTime(value, 'date-long', prefs),
            time: (value: string | number | Date | null | undefined) =>
                formatDateTime(value, 'time', prefs),
            dateTime: (value: string | number | Date | null | undefined) =>
                formatDateTime(value, 'datetime', prefs),
            dateTimeLong: (value: string | number | Date | null | undefined) =>
                formatDateTime(value, 'datetime-long', prefs),
            relative: (
                value: string | number | Date | null | undefined,
                now?: Date,
            ) => formatRelative(value, prefs, now),
            duration: (milliseconds: number) =>
                formatDuration(milliseconds, prefs),
            durationBetween: (
                start: string | number | Date | null | undefined,
                end: string | number | Date | null | undefined,
            ) => formatDurationBetween(start, end, prefs),
            absoluteWithZone: (
                value: string | number | Date | null | undefined,
            ) => formatAbsoluteWithZone(value, prefs),
            zoneLabel: () => timezoneLabel(prefs),
            toLocalInput: (
                value: string | number | Date | null | undefined,
                timezone?: string,
            ) => toDateTimeLocalInput(value, timezone ?? prefs.timezone),
        }),
        [prefs],
    );
}

export { DEFAULT_FORMATTING };
