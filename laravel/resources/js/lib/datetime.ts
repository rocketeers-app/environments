/**
 * The single place dates are turned into text. Everything on the wire is UTC ISO-8601;
 * every rendering decision (timezone, locale, style) is made here so the same timestamp
 * never reads two different ways in two different tables.
 */

/** An absolute instant, ISO-8601 with an explicit offset. */
export type IsoDateTime = string;

/** A calendar day with no instant attached, `YYYY-MM-DD`. Never timezone-converted. */
export type IsoDate = string;

export interface FormattingPreferences {
    timezone: string;
    locale: string;
}

export type DateTimeVariant =
    | 'date'
    | 'date-long'
    | 'month-year'
    | 'time'
    | 'datetime'
    | 'datetime-long'
    | 'relative';

export const DEFAULT_FORMATTING: FormattingPreferences = {
    timezone: 'UTC',
    locale: 'en-GB',
};

const OFFSET_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/i;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const VARIANT_OPTIONS: Record<
    Exclude<DateTimeVariant, 'relative'>,
    Intl.DateTimeFormatOptions
> = {
    date: { year: 'numeric', month: '2-digit', day: '2-digit' },
    'date-long': { year: 'numeric', month: 'short', day: 'numeric' },
    'month-year': { year: 'numeric', month: 'long' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    },
    'datetime-long': {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    },
};

const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();
const relativeFormatters = new Map<string, Intl.RelativeTimeFormat>();
const durationFormatters = new Map<string, Intl.NumberFormat>();

function dateTimeFormatter(
    prefs: FormattingPreferences,
    options: Intl.DateTimeFormatOptions,
    key: string,
): Intl.DateTimeFormat {
    const cacheKey = `${prefs.locale}|${prefs.timezone}|${key}`;
    let formatter = dateTimeFormatters.get(cacheKey);

    if (!formatter) {
        formatter = new Intl.DateTimeFormat(prefs.locale, {
            timeZone: prefs.timezone,
            ...options,
        });
        dateTimeFormatters.set(cacheKey, formatter);
    }

    return formatter;
}

function relativeFormatter(locale: string): Intl.RelativeTimeFormat {
    let formatter = relativeFormatters.get(locale);

    if (!formatter) {
        formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        relativeFormatters.set(locale, formatter);
    }

    return formatter;
}

function durationFormatter(
    locale: string,
    unit: ElapsedUnit,
): Intl.NumberFormat {
    const cacheKey = `${locale}|${unit}`;
    let formatter = durationFormatters.get(cacheKey);

    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, {
            style: 'unit',
            unit,
            unitDisplay: 'long',
            maximumFractionDigits: 0,
        });
        durationFormatters.set(cacheKey, formatter);
    }

    return formatter;
}

export function isDateOnly(value: string): value is IsoDate {
    return DATE_ONLY_PATTERN.test(value);
}

/**
 * Strict on purpose: a naive `2026-08-29 14:00:00` carries no offset, so the browser
 * would silently read it in its own timezone. Returning null here surfaces the bad
 * payload instead of rendering a plausible wrong hour.
 */
export function parseIso(
    value: string | number | Date | null | undefined,
): Date | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === 'number') {
        const fromNumber = new Date(value);

        return Number.isNaN(fromNumber.getTime()) ? null : fromNumber;
    }

    if (!OFFSET_PATTERN.test(value)) {
        if (import.meta.env.DEV) {
            console.warn(
                `[datetime] Ignoring "${value}" — timestamps must carry a UTC offset.`,
            );
        }

        return null;
    }

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Calendar days are rendered as written. Running them through a timezone would shift
 * them across midnight, which is what the old `+ 'T12:00:00'` workarounds were dodging.
 */
export function formatDateOnly(
    value: IsoDate,
    prefs: FormattingPreferences,
    variant: 'date' | 'date-long' | 'month-year' = 'date',
): string | null {
    if (!isDateOnly(value)) {
        return null;
    }

    const [year, month, day] = value.split('-').map(Number);
    const asUtc = new Date(Date.UTC(year, month - 1, day));

    return dateTimeFormatter(
        { locale: prefs.locale, timezone: 'UTC' },
        VARIANT_OPTIONS[variant],
        `dateonly-${variant}`,
    ).format(asUtc);
}

export function formatDateTime(
    value: string | number | Date | null | undefined,
    variant: Exclude<DateTimeVariant, 'relative'>,
    prefs: FormattingPreferences,
): string | null {
    if (typeof value === 'string' && isDateOnly(value)) {
        return formatDateOnly(value, prefs, dateOnlyVariant(variant));
    }

    const parsed = parseIso(value);

    if (!parsed) {
        return null;
    }

    return dateTimeFormatter(prefs, VARIANT_OPTIONS[variant], variant).format(
        parsed,
    );
}

function dateOnlyVariant(
    variant: Exclude<DateTimeVariant, 'relative'>,
): 'date' | 'date-long' | 'month-year' {
    if (variant === 'month-year') {
        return 'month-year';
    }

    return variant === 'date-long' || variant === 'datetime-long'
        ? 'date-long'
        : 'date';
}

type ElapsedUnit =
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'year';

const ELAPSED_THRESHOLDS: Array<{
    limit: number;
    divisor: number;
    unit: ElapsedUnit;
}> = [
    { limit: 60_000, divisor: 1_000, unit: 'second' },
    { limit: 3_600_000, divisor: 60_000, unit: 'minute' },
    { limit: 86_400_000, divisor: 3_600_000, unit: 'hour' },
    { limit: 604_800_000, divisor: 86_400_000, unit: 'day' },
    { limit: 2_592_000_000, divisor: 604_800_000, unit: 'week' },
    { limit: 31_536_000_000, divisor: 2_592_000_000, unit: 'month' },
    { limit: Infinity, divisor: 31_536_000_000, unit: 'year' },
];

function elapsedStep(magnitude: number) {
    return (
        ELAPSED_THRESHOLDS.find((threshold) => magnitude < threshold.limit) ??
        ELAPSED_THRESHOLDS[ELAPSED_THRESHOLDS.length - 1]
    );
}

/**
 * A span of time as its largest whole unit — `20 seconds`, `1 minute`, `3 hours`,
 * `2 days`, `3 weeks`, `1 month`, `1 year`. Truncated rather than rounded, so a
 * ticking counter never claims a unit the incident has not actually reached.
 */
export function formatDuration(
    milliseconds: number,
    prefs: FormattingPreferences,
): string {
    const magnitude = Math.max(0, milliseconds);
    const { divisor, unit } = elapsedStep(magnitude);

    return durationFormatter(prefs.locale, unit).format(
        Math.floor(magnitude / divisor),
    );
}

/** The same span, read off two instants; null when either one is unusable. */
export function formatDurationBetween(
    start: string | number | Date | null | undefined,
    end: string | number | Date | null | undefined,
    prefs: FormattingPreferences,
): string | null {
    const from = parseIso(start);
    const to = parseIso(end);

    if (!from || !to) {
        return null;
    }

    return formatDuration(to.getTime() - from.getTime(), prefs);
}

export function formatRelative(
    value: string | number | Date | null | undefined,
    prefs: FormattingPreferences,
    now: Date = new Date(),
): string | null {
    const parsed = parseIso(value);

    if (!parsed) {
        return null;
    }

    const elapsed = parsed.getTime() - now.getTime();
    const { divisor, unit } = elapsedStep(Math.abs(elapsed));

    return relativeFormatter(prefs.locale).format(
        Math.round(elapsed / divisor),
        unit,
    );
}

/** How often a relative rendering has to be recomputed to stay honest, in ms. */
export function relativeRefreshInterval(
    value: string | number | Date | null | undefined,
    now: Date = new Date(),
): number | null {
    const parsed = parseIso(value);

    if (!parsed) {
        return null;
    }

    const magnitude = Math.abs(parsed.getTime() - now.getTime());

    if (magnitude < 3_600_000) {
        return 30_000;
    }

    if (magnitude < 86_400_000) {
        return 300_000;
    }

    return null;
}

/** The short timezone name, e.g. `CEST`, for disambiguating an absolute rendering. */
export function timezoneLabel(
    prefs: FormattingPreferences,
    at: Date = new Date(),
): string {
    const part = dateTimeFormatter(prefs, { timeZoneName: 'short' }, 'tzlabel')
        .formatToParts(at)
        .find((candidate) => candidate.type === 'timeZoneName');

    return part?.value ?? prefs.timezone;
}

/** The absolute rendering used in tooltips behind relative timestamps. */
export function formatAbsoluteWithZone(
    value: string | number | Date | null | undefined,
    prefs: FormattingPreferences,
): string | null {
    const formatted = formatDateTime(value, 'datetime-long', prefs);

    if (!formatted) {
        return null;
    }

    const parsed = parseIso(value);

    return `${formatted} (${timezoneLabel(prefs, parsed ?? new Date())})`;
}

/** Local `YYYY-MM-DDTHH:mm` for a `datetime-local` input, in the given zone. */
export function toDateTimeLocalInput(
    value: string | number | Date | null | undefined,
    timezone: string,
): string {
    const parsed = parseIso(value);

    if (!parsed) {
        return '';
    }

    const parts = dateTimeFormatter(
        { locale: 'en-CA', timezone },
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        },
        'datetime-local-input',
    )
        .formatToParts(parsed)
        .reduce<Record<string, string>>(
            (acc, part) => ({ ...acc, [part.type]: part.value }),
            {},
        );

    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function browserFormattingPreferences(): FormattingPreferences {
    if (typeof Intl === 'undefined') {
        return DEFAULT_FORMATTING;
    }

    const resolved = Intl.DateTimeFormat().resolvedOptions();

    return {
        timezone: resolved.timeZone || DEFAULT_FORMATTING.timezone,
        locale:
            (typeof navigator !== 'undefined' && navigator.language) ||
            resolved.locale ||
            DEFAULT_FORMATTING.locale,
    };
}
