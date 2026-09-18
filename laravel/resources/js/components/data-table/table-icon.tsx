import type { ComponentType } from 'react';
import { useState } from 'react';

import { IconProvider } from '@/components/shared/icons/IconProvider';
import { ProviderLink } from '@/components/shared/provider-link';
import { cn } from '@/lib/utils';

const failedFavicons = new Set<string>();

type Glyph = ComponentType<{ className?: string; strokeWidth?: number }>;

type Props = {
    provider?: string | null;
    favicon?: string | null;
    icon?: Glyph;
    iconClassName?: string;
    href?: string | null;
    label?: string;
    dimmed?: boolean;
    className?: string;
};

/**
 * The leading icon of a table row: one `size-4` slot for a provider icon, a favicon or a
 * muted glyph, so every table's first icon lines up. A failed favicon falls back to `icon`.
 */
export function TableIcon({
    provider,
    favicon,
    icon: Icon,
    iconClassName,
    href,
    label,
    dimmed = false,
    className,
}: Props) {
    const [failedFavicon, setFailedFavicon] = useState<string | null>(null);
    const faviconSrc =
        favicon && favicon !== failedFavicon && !failedFavicons.has(favicon)
            ? favicon
            : null;

    const content = provider ? (
        <IconProvider iconType={provider} className="size-4" />
    ) : faviconSrc ? (
        <img
            src={faviconSrc}
            alt=""
            width={16}
            height={16}
            loading="lazy"
            className="size-4 rounded-[22%] object-contain"
            onError={() => {
                failedFavicons.add(faviconSrc);
                setFailedFavicon(faviconSrc);
            }}
        />
    ) : (
        Icon && (
            <Icon
                className={cn('size-4 text-muted-foreground', iconClassName)}
            />
        )
    );

    return (
        <span
            className={cn(
                'flex size-4 shrink-0',
                dimmed && 'opacity-50',
                className,
            )}
        >
            {label ? (
                <ProviderLink href={href} label={label}>
                    {content}
                </ProviderLink>
            ) : (
                content
            )}
        </span>
    );
}
