import type { ComponentType, CSSProperties, ReactNode } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

/** A table row's state after its name: a spinner while work runs (`ActivityLabel`), an icon once it settled (`StatusLabel`). */
export function ActivityLabel({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-xs leading-none whitespace-nowrap text-muted-foreground',
                className,
            )}
        >
            <Spinner style={{ '--spinner-size': '12px' } as CSSProperties} />
            {children}
        </span>
    );
}

export function StatusLabel({
    icon: Icon,
    children,
    className,
}: {
    icon: ComponentType<{ className?: string; strokeWidth?: number }>;
    children: ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-xs leading-none whitespace-nowrap text-muted-foreground',
                className,
            )}
        >
            <Icon className="size-3 shrink-0" strokeWidth={2.5} />
            {children}
        </span>
    );
}
