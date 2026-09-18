import type { PropsWithChildren } from 'react';
import { usePageActionsSlot } from '@/contexts/page-actions-context';
import { cn } from '@/lib/utils';

/**
 * The page's title row. Its right edge is the slot every `PageActions` portals into,
 * so a page's buttons line up with its heading however far down the file they sit.
 * Below `sm` the row stacks and the buttons drop under the title, where there is width.
 */
export function PageHeader({
    children,
    className,
}: PropsWithChildren<{ className?: string }>) {
    const { setContainer } = usePageActionsSlot();

    return (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between',
                className,
            )}
        >
            <div className="min-w-0 sm:flex-1">{children}</div>
            <div
                ref={setContainer}
                className="flex flex-wrap items-center gap-2 self-start rounded-xl bg-tab-strip p-1.5 empty:hidden sm:shrink-0 sm:justify-end sm:self-auto"
            />
        </div>
    );
}
