import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFormattingPreferences } from '@/hooks/use-date-format';
import {
    formatAbsoluteWithZone,
    formatDateTime,
    formatRelative,
    relativeRefreshInterval,
    timezoneLabel,
    type DateTimeVariant,
} from '@/lib/datetime';
import { useEffect, useMemo, useState } from 'react';

export interface DateTimeProps {
    value: string | number | Date | null | undefined;
    variant?: DateTimeVariant;
    /** Shown when the value is missing or is not a parsable UTC timestamp. */
    fallback?: React.ReactNode;
    /** Reveal the absolute value with its timezone on hover. Defaults on for `variant="relative"`. */
    tooltip?: boolean;
    /**
     * Render in this zone instead of the user's. Only for values that belong to a zone
     * the user deliberately chose, such as a scheduled deployment.
     */
    timezone?: string;
    /** Append the short zone name, e.g. `CEST`. Useful alongside `timezone`. */
    showZone?: boolean;
    className?: string;
}

/**
 * The one way a timestamp reaches the screen. Renders a semantic `<time>` in the user's
 * timezone and locale; relative renderings re-tick on their own so "2 minutes ago" does
 * not go stale on a page left open.
 */
export function DateTime({ value, variant = 'datetime', fallback = '—', tooltip, timezone, showZone, className }: DateTimeProps) {
    const preferences = useFormattingPreferences();
    const [, setTick] = useState(0);

    const prefs = useMemo(
        () => (timezone ? { ...preferences, timezone } : preferences),
        [preferences, timezone],
    );

    const isRelative = variant === 'relative';
    const interval = isRelative ? relativeRefreshInterval(value) : null;

    useEffect(() => {
        if (!interval) {
            return;
        }

        const timer = window.setInterval(() => setTick((current) => current + 1), interval);

        return () => window.clearInterval(timer);
    }, [interval]);

    const text = isRelative ? formatRelative(value, prefs) : formatDateTime(value, variant, prefs);

    if (text === null) {
        return <>{fallback}</>;
    }

    const machineValue = value instanceof Date ? value.toISOString() : String(value);
    const absolute = formatAbsoluteWithZone(value, prefs);
    const element = (
        <time dateTime={machineValue} className={className}>
            {text}
            {showZone && ` (${timezoneLabel(prefs)})`}
        </time>
    );

    if (!(tooltip ?? isRelative) || !absolute) {
        return element;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{element}</TooltipTrigger>
            <TooltipContent>{absolute}</TooltipContent>
        </Tooltip>
    );
}
