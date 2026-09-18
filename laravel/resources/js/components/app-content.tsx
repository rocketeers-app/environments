import * as React from 'react';
import { cn } from '@/lib/utils';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    className,
    children,
    ...props
}: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <main
                className={cn(
                    'relative flex min-h-0 max-w-full flex-1 flex-col bg-sidebar',
                    className,
                )}
                {...props}
            >
                {children}
            </main>
        );
    }

    return (
        <main
            className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl"
            {...props}
        >
            {children}
        </main>
    );
}
