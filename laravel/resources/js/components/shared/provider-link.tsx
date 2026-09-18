import type { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Deep-links a provider icon (or favicon) to the resource on the provider. `href` is empty for
// providers that expose no console URL, so the icon degrades to plain markup instead of a dead link.
type Props = {
    href?: string | null;
    label: string;
    className?: string;
    children: ReactNode;
};

export function ProviderLink({ href, label, className, children }: Props) {
    if (!href) {
        return <>{children}</>;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={(event) => event.stopPropagation()}
                    className={cn(
                        'inline-flex shrink-0 rounded-md transition-opacity hover:opacity-80',
                        className,
                    )}
                >
                    {children}
                </a>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}
