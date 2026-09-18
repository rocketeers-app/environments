import { EnvironmentTypeBadge } from '@/components/environment-type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface EnvironmentOptionData {
    name?: string;
    domain?: string | null;
    label?: string;
}

export function faviconUrl(domain?: string | null) {
    if (!domain) {
        return undefined;
    }

    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

/**
 * Favicon of the environment's domain, falling back to the first letter of its name
 * when there is no domain or the favicon fails to load.
 */
export function EnvironmentAvatar({
    name,
    domain,
    className,
}: {
    name: string;
    domain?: string | null;
    className?: string;
}) {
    return (
        <Avatar className={cn('h-5 w-5 shrink-0 rounded-md', className)}>
            <AvatarImage src={faviconUrl(domain)} alt={name} />
            <AvatarFallback className="rounded-md bg-muted text-xs">
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}

/**
 * Renders an environment the same way the environments table name column does:
 * favicon avatar + name + environment-type badge. Used in the daemon and cron
 * form environment selectors.
 */
export function EnvironmentOption({
    environment,
}: {
    environment: EnvironmentOptionData;
}) {
    const name = environment.name ?? '';

    return (
        <span className="flex min-w-0 items-center gap-2">
            <EnvironmentAvatar name={name} domain={environment.domain} />
            <span className="truncate font-medium">{name}</span>
            {environment.label && (
                <EnvironmentTypeBadge
                    label={environment.label}
                    className="px-1.5 py-px text-[10px]"
                />
            )}
        </span>
    );
}
