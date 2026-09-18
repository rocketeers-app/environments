import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * The one page title every page renders, so headings share a size app-wide. `addon`
 * sits beside the title (badges, spinners); `truncate` keeps long subject names on one line.
 */
export function PageTitle({
    title,
    subtitle,
    addon,
    truncate = false,
    centered = false,
    className,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    addon?: ReactNode;
    truncate?: boolean;
    centered?: boolean;
    className?: string;
}) {
    return (
        <div className={cn('min-w-0', centered && 'text-center', className)}>
            <div
                className={cn(
                    'flex min-w-0 items-center gap-2',
                    !truncate && 'flex-wrap',
                    centered && 'justify-center',
                )}
            >
                <h1
                    className={cn(
                        'min-w-0 text-2xl font-bold',
                        truncate ? 'truncate' : 'break-words',
                    )}
                >
                    {title}
                </h1>
                {addon}
            </div>
            {subtitle && (
                <div className="mt-1 text-sm text-muted-foreground">
                    {subtitle}
                </div>
            )}
        </div>
    );
}
