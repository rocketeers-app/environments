import * as React from 'react';

import { TableFrame } from '@/components/ui/table';
import { cn } from '@/lib/utils';

/* The table's chrome for content that is not a table: a heading on the grey tray with a bordered
   card set into it. The heading matches TableHead — h-11 and the tray's extra pixel of padding. */
function Panel({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <TableFrame
            data-slot="panel"
            className={cn('flex flex-col', className)}
            {...props}
        />
    );
}

function PanelHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="panel-header"
            className={cn(
                'flex h-11 shrink-0 items-center gap-2 px-[calc(1rem+1px)] text-sm font-medium text-foreground',
                className,
            )}
            {...props}
        />
    );
}

function PanelContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="panel-content"
            className={cn(
                'rounded-sm border border-table-border bg-card p-4',
                className,
            )}
            {...props}
        />
    );
}

export { Panel, PanelContent, PanelHeader };
