/**
 * The one width scale every DataTable column picks from. A table states a width for each
 * column that holds a bounded value and leaves exactly one content column sizeless, so the
 * slack lands there instead of being spread over every column (see DataTable).
 */
export const columnSize = {
    /** Row checkbox. */
    select: 44,
    /** A single icon, dot or avatar with no label — fits a `size-8` avatar inside `px-4`. */
    indicator: 64,
    /** A count, port or status code. */
    number: 88,
    /** One short badge: severity, state, TTL, role. */
    badge: 120,
    /** A short value: version, duration, byte size, frequency. */
    short: 144,
    /** A timestamp, absolute or relative. */
    date: 176,
    /** A secondary label: user, branch, repository, storage. */
    label: 224,
    /** An entity with an icon and a sub-label: environment, server, provider. */
    entity: 288,
} as const;

/**
 * Floor for the sizeless column that absorbs the slack: it has no width of its own to add to
 * the table's min-width, so it counts for this much (see DataTable).
 */
export const flexColumnMinSize = 224;

/**
 * Width of a trailing actions cell holding `buttons` icon buttons — `size-8` each, `gap-2`
 * between them, inside the cell's `px-4`.
 */
export function actionsSize(buttons: number): number {
    return buttons * 32 + Math.max(buttons - 1, 0) * 8 + 32;
}
