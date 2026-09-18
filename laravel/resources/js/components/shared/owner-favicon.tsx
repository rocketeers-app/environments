import { Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Favicon of a site or app as the same rounded rectangle the environment header shows,
 * falling back to the owner-type icon when no environment has a domain yet.
 */
export function OwnerFavicon({
    url,
    owner,
    className,
}: {
    url?: string | null;
    owner: 'site' | 'app';
    className?: string;
}) {
    if (!url) {
        const Icon = owner === 'app' ? Zap : Globe;

        return (
            <Icon
                className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground',
                    className,
                )}
            />
        );
    }

    return (
        <img
            src={url}
            alt=""
            width={16}
            height={16}
            loading="lazy"
            className={cn('h-4 w-4 shrink-0 rounded-md', className)}
        />
    );
}
