import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Renders raw log text with lightweight syntax highlighting. Deliberately regex based rather
 * than a real grammar: the pane mixes nginx, php-fpm and Laravel formats in one view.
 */
const TOKEN_PATTERN = new RegExp(
    [
        '(?<timestamp>\\[\\d{4}-\\d{2}-\\d{2}[T ][\\d:.,]+(?:Z|[+-]\\d{2}:?\\d{2})?\\]|\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}(?:[.,]\\d+)?(?:Z|[+-]\\d{2}:?\\d{2})?|\\d{4}/\\d{2}/\\d{2} \\d{2}:\\d{2}:\\d{2}|\\d{2}/[A-Za-z]{3}/\\d{4}:\\d{2}:\\d{2}:\\d{2}(?: [+-]\\d{4})?)',
        '(?<url>https?://[^\\s"\'<>]+)',
        '(?<level>\\b(?:EMERGENCY|ALERT|CRITICAL|CRIT|FATAL|ERROR|WARNING|WARN|NOTICE|INFO|DEBUG|TRACE)\\b)',
        '(?<method>\\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\\b)',
        '(?<ip>\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b)',
        '(?<symbol>\\b[A-Za-z_]\\w*(?:\\\\[A-Za-z_]\\w*)+)',
        '(?<path>(?:/[\\w.@%+-]+){2,})',
        '(?<key>"[\\w.-]+"(?=\\s*:))',
        '(?<number>\\b\\d+(?:\\.\\d+)?\\b)',
    ].join('|'),
    'gi',
);

const TOKEN_CLASSES: Record<string, string> = {
    timestamp: 'text-muted-foreground',
    url: 'text-blue-600 underline-offset-2 dark:text-blue-400',
    method: 'font-semibold text-indigo-600 dark:text-indigo-400',
    ip: 'text-teal-600 dark:text-teal-300',
    symbol: 'text-rose-700 dark:text-rose-300',
    path: 'text-emerald-700 dark:text-emerald-400',
    key: 'text-orange-600 dark:text-orange-300',
    number: 'text-fuchsia-600 dark:text-fuchsia-400',
};

const LEVEL_CLASSES: Array<[RegExp, string]> = [
    [
        /^(?:emergency|alert|critical|crit|fatal|error)$/i,
        'font-semibold text-red-600 dark:text-red-400',
    ],
    [/^(?:warning|warn)$/i, 'font-semibold text-amber-600 dark:text-amber-400'],
    [/^(?:notice|info)$/i, 'font-semibold text-sky-600 dark:text-sky-400'],
    [
        /^(?:debug|trace)$/i,
        'font-semibold text-violet-600 dark:text-violet-400',
    ],
];

const SEVERITY_CLASSES: Array<[RegExp, string]> = [
    [/\b(?:emergency|alert|critical|crit|fatal|error)\b/i, 'bg-red-500/5'],
    [/\b(?:warning|warn)\b/i, 'bg-amber-500/5'],
];

interface Segment {
    text: string;
    className?: string;
}

const levelClass = (level: string): string | undefined =>
    LEVEL_CLASSES.find(([pattern]) => pattern.test(level))?.[1];

const severityClass = (line: string): string | undefined =>
    SEVERITY_CLASSES.find(([pattern]) => pattern.test(line))?.[1];

const classForMatch = (match: RegExpMatchArray): string | undefined => {
    const kind = Object.keys(match.groups ?? {}).find(
        (name) => match.groups?.[name] !== undefined,
    );

    if (!kind) {
        return undefined;
    }

    return kind === 'level' ? levelClass(match[0]) : TOKEN_CLASSES[kind];
};

const tokenize = (line: string): Segment[] => {
    const segments: Segment[] = [];
    let cursor = 0;

    for (const match of line.matchAll(TOKEN_PATTERN)) {
        const index = match.index ?? 0;

        if (index > cursor) {
            segments.push({ text: line.slice(cursor, index) });
        }

        segments.push({ text: match[0], className: classForMatch(match) });
        cursor = index + match[0].length;
    }

    if (cursor < line.length) {
        segments.push({ text: line.slice(cursor) });
    }

    return segments;
};

const markQuery = (text: string, query: string): ReactNode => {
    if (!query) {
        return text;
    }

    const haystack = text.toLowerCase();
    const parts: ReactNode[] = [];
    let cursor = 0;
    let index = haystack.indexOf(query);

    while (index !== -1) {
        if (index > cursor) {
            parts.push(text.slice(cursor, index));
        }

        parts.push(
            <mark
                key={index}
                className="rounded-[2px] bg-yellow-300/60 text-inherit dark:bg-yellow-500/30"
            >
                {text.slice(index, index + query.length)}
            </mark>,
        );

        cursor = index + query.length;
        index = haystack.indexOf(query, cursor);
    }

    if (cursor < text.length) {
        parts.push(text.slice(cursor));
    }

    return parts;
};

interface Props {
    content: string;
    /** Lowercased needle from the content filter; occurrences get a highlight mark. */
    query?: string;
    className?: string;
}

export function LogOutput({ content, query = '', className }: Props) {
    const lines = useMemo(() => content.split('\n'), [content]);
    const needle = query.trim().toLowerCase();

    return (
        <pre className={cn('font-mono text-sm whitespace-pre', className)}>
            {lines.map((line, lineIndex) => (
                <div
                    key={lineIndex}
                    className={cn(
                        '-mx-1 w-fit min-w-full rounded-sm px-1',
                        severityClass(line),
                    )}
                >
                    {tokenize(line).map((segment, segmentIndex) => (
                        <span key={segmentIndex} className={segment.className}>
                            {markQuery(segment.text, needle)}
                        </span>
                    ))}
                    {line === '' && '\n'}
                </div>
            ))}
        </pre>
    );
}
