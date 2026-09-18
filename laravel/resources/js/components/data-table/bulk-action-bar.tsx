import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface BulkActionBarProps {
    count: number;
    onClear: () => void;
    /** Offers to widen the selection to every matching row, `total` of them, beyond the current page. */
    onSelectAll?: () => void;
    total?: number;
    children: ReactNode;
}

const pinOffset = 32;

interface PinnedBounds {
    left: number;
    width: number;
    bottom: number;
}

function clippingAncestors(element: HTMLElement): HTMLElement[] {
    const ancestors: HTMLElement[] = [];

    for (
        let parent = element.parentElement;
        parent;
        parent = parent.parentElement
    ) {
        if (getComputedStyle(parent).overflowY !== 'visible') {
            ancestors.push(parent);
        }
    }

    return ancestors;
}

/**
 * Floats centred on the table's bottom edge, and once that edge nears the visible bottom it is pinned
 * there instead. The visible bottom is the tightest clipping ancestor, not the window: the app scrolls
 * inside an inset pane, and page wrappers carry `overflow-x-auto`, which also clips vertically and
 * keeps `position: sticky` from ever sticking.
 */
export function BulkActionBar({
    count,
    onClear,
    onSelectAll,
    total,
    children,
}: BulkActionBarProps) {
    const anchorRef = useRef<HTMLDivElement>(null);
    const [pinned, setPinned] = useState<PinnedBounds | null>(null);

    useEffect(() => {
        const anchor = anchorRef.current;

        if (!anchor) {
            return;
        }

        const clippers = clippingAncestors(anchor);

        const update = () => {
            const rect = anchor.getBoundingClientRect();
            const visibleBottom = clippers.reduce(
                (bottom, clipper) =>
                    Math.min(bottom, clipper.getBoundingClientRect().bottom),
                window.innerHeight,
            );

            setPinned((previous) => {
                if (rect.top <= visibleBottom - pinOffset) {
                    return null;
                }

                const bottom = window.innerHeight - visibleBottom + pinOffset;

                return previous?.left === rect.left &&
                    previous.width === rect.width &&
                    previous.bottom === bottom
                    ? previous
                    : { left: rect.left, width: rect.width, bottom };
            });
        };

        update();

        const observer = new ResizeObserver(update);

        observer.observe(anchor);

        if (anchor.parentElement) {
            observer.observe(anchor.parentElement);
        }

        window.addEventListener('scroll', update, {
            capture: true,
            passive: true,
        });
        window.addEventListener('resize', update);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', update, { capture: true });
            window.removeEventListener('resize', update);
        };
    }, []);

    return (
        <div ref={anchorRef} className="h-0">
            <div
                className={cn(
                    'pointer-events-none z-30 flex h-0 items-center justify-center',
                    pinned && 'fixed',
                )}
                style={
                    pinned
                        ? {
                              left: pinned.left,
                              width: pinned.width,
                              bottom: pinned.bottom,
                          }
                        : undefined
                }
            >
                <div
                    role="toolbar"
                    aria-label="Bulk actions"
                    className="pointer-events-auto flex animate-in items-center gap-1 rounded-xl border bg-popover p-1.5 pl-3 text-popover-foreground shadow-lg duration-150 fade-in slide-in-from-bottom-2"
                >
                    <span className="text-sm font-medium whitespace-nowrap tabular-nums">
                        {count} selected
                    </span>
                    {onSelectAll && total !== undefined && (
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            onClick={onSelectAll}
                            className="h-7 px-2 tabular-nums"
                        >
                            Select all {total}
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Clear selection"
                        onClick={onClear}
                        className="size-7 text-muted-foreground"
                    >
                        <X />
                    </Button>
                    <Separator orientation="vertical" className="mx-1 h-5!" />
                    <div className="flex items-center gap-1.5">{children}</div>
                </div>
            </div>
        </div>
    );
}
