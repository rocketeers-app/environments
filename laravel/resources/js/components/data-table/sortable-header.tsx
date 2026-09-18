import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SortableHeaderProps<TData, TValue> {
    column: Column<TData, TValue>;
    children: ReactNode;
    className?: string;
}

/**
 * Header button for a column the server can order by. Toggling it hands the new sorting to
 * DataTable, which routes it through Inertia — the column id must match a key the model
 * whitelists in its `$sortable`, or the server falls back to its default order. Its left inset
 * cancels its own padding (`has-[>svg]:` included, since the sort arrow always trips it),
 * so the label sits exactly where the cells below it start, while the right padding stays to
 * keep the arrow clear of the next column.
 */
export function SortableHeader<TData, TValue>({
    column,
    children,
    className,
}: SortableHeaderProps<TData, TValue>) {
    const sorted = column.getIsSorted();

    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === 'asc')}
            className={cn('-ml-2 h-8 gap-1 px-2 has-[>svg]:px-2', className)}
        >
            {children}
            {sorted === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
            ) : sorted === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
            ) : (
                <ArrowUpDown className="h-4 w-4" />
            )}
        </Button>
    );
}
