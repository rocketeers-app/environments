import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';

/**
 * The vertical rail every chronological list in the app renders on: one line, a dot per
 * event, an optional muted second line for its timestamp.
 */
export function Timeline({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('relative min-w-0 pl-6', className)}>
            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />
            {children}
        </div>
    );
}

export function TimelineItem({
    href,
    className,
    dotClassName,
    meta,
    children,
}: {
    href?: string | null;
    className?: string;
    dotClassName?: string;
    meta?: ReactNode;
    children: ReactNode;
}) {
    const Wrapper = href ? Link : 'div';
    const wrapperProps = href ? { href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={cn(
                'group relative block min-w-0 py-2 no-underline',
                href || 'last:pb-0',
                className,
            )}
        >
            <span
                className={cn(
                    'absolute top-3 -left-6 size-2.5 rounded-full border-2 border-background bg-border transition-[background-color,scale] duration-200 ease-out',
                    href && 'scale-75 group-hover:scale-100 group-hover:bg-foreground',
                    dotClassName,
                )}
            />

            <div
                className={cn(
                    'text-sm leading-snug wrap-anywhere text-foreground',
                    href &&
                        '-mx-2 -my-1 w-fit max-w-[calc(100%+1rem)] rounded-md px-2 py-1 transition-colors group-hover:bg-table-header',
                )}
            >
                {children}
            </div>

            {meta && (
                <div className="mt-0.5 text-xs text-muted-foreground">
                    {meta}
                </div>
            )}
        </Wrapper>
    );
}
