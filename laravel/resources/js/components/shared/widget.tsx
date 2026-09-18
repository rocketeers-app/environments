import { Link, WhenVisible } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface WidgetProps {
    label: string;
    value: ReactNode;
    className?: string;
    /** Inertia partial reload key for deferred loading. If provided, shows skeleton until data loads. */
    deferKey?: string;
    link?: string;
    onClick?: () => void;
    active?: boolean;
}

export function WidgetGrid({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] *:min-w-36 *:shrink-0 *:grow *:basis-0 *:snap-start [&::-webkit-scrollbar]:hidden',
                className,
            )}
        >
            {children}
        </div>
    );
}

/** A stat sunk into the same grey tray as the tables: the label sits on the tray like a column heading, the value on the panel. */
export function Widget({
    label,
    value,
    className,
    deferKey,
    link,
    onClick,
    active = false,
}: WidgetProps) {
    const valueContent = deferKey ? (
        <WhenVisible
            data={deferKey}
            fallback={<Skeleton className="h-7 w-12" />}
        >
            {value}
        </WhenVisible>
    ) : (
        value
    );

    const card = (
        <div
            className={cn(
                'group flex h-full flex-col rounded-[var(--radius)] bg-table-header p-[3px]',
                className,
            )}
        >
            <div className="flex h-7 items-center justify-center truncate px-[calc(0.75rem+1px)] text-xs font-medium text-foreground">
                {label}
            </div>
            <div
                className={cn(
                    'flex flex-1 items-center justify-center rounded-sm border border-table-border bg-card px-5 py-5 text-center text-2xl font-semibold text-foreground tabular-nums transition-colors',
                    (link || onClick) &&
                        'group-hover:bg-[color-mix(in_oklab,var(--muted)_50%,var(--card))]',
                    active && 'border-primary',
                )}
            >
                {valueContent}
            </div>
        </div>
    );

    if (link) {
        return (
            <Link href={link} className="block h-full no-underline">
                {card}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button
                type="button"
                aria-pressed={active}
                onClick={onClick}
                className="grid rounded-[var(--radius)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {card}
            </button>
        );
    }

    return card;
}
