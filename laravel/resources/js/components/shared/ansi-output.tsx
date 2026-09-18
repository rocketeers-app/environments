import Anser from 'anser';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';

function styleForSegment(seg: Anser.AnserJsonEntry): CSSProperties {
    const decorations = seg.decorations ?? [];
    const textDecoration = [
        decorations.includes('underline') && 'underline',
        decorations.includes('strikethrough') && 'line-through',
    ]
        .filter(Boolean)
        .join(' ');

    return {
        color: seg.fg ? `rgb(${seg.fg})` : undefined,
        backgroundColor: seg.bg ? `rgb(${seg.bg})` : undefined,
        fontWeight: decorations.includes('bold') ? 'bold' : undefined,
        fontStyle: decorations.includes('italic') ? 'italic' : undefined,
        textDecoration: textDecoration || undefined,
        opacity: decorations.includes('dim') ? 0.7 : undefined,
    };
}

export function AnsiOutput({ children }: { children: string }) {
    const segments = useMemo(
        () =>
            Anser.ansiToJson(children, {
                use_classes: false,
                remove_empty: true,
            }),
        [children],
    );

    return (
        <pre className="whitespace-pre-wrap">
            {segments.map((seg, i) => (
                <span key={i} style={styleForSegment(seg)}>
                    {seg.content}
                </span>
            ))}
        </pre>
    );
}
