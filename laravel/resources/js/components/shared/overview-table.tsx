import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { columnSize } from '@/components/data-table/column-sizes';
import { DateTime } from '@/components/ui/date-time';

/**
 * Shared cells for the compact tables on the Hosting, Monitoring and Automation overviews. The
 * "View all" link heads the last, right-aligned column: a capped flex column gets a spacer after
 * it, so a link inside the title's own header would stop short of the table's right edge.
 */
export function ViewAllLink({ href }: { href: string }) {
    return (
        <Link
            href={href}
            className="text-xs font-normal whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            onClick={(event) => event.stopPropagation()}
        >
            View all
        </Link>
    );
}

export function viewAllColumn<TData>(href: string): ColumnDef<TData> {
    return {
        id: 'view_all',
        header: () => <ViewAllLink href={href} />,
        cell: () => null,
        size: columnSize.number,
        meta: { align: 'right' },
    };
}

export function TitleWithWhen({
    label,
    title,
    when,
}: {
    label?: string | null;
    title: string;
    when: string | null;
}) {
    return (
        <span className="flex min-w-0 items-baseline gap-2">
            {label && (
                <span className="shrink-0 text-sm text-muted-foreground">
                    {label}
                </span>
            )}
            <span className="truncate text-sm font-medium">{title}</span>
            {when && (
                <span className="shrink-0 text-xs text-muted-foreground">
                    <DateTime value={when} variant="relative" />
                </span>
            )}
        </span>
    );
}
