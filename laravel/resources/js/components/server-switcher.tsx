import { usePage } from '@inertiajs/react';
import { Server as ServerIcon } from 'lucide-react';
import { IconProvider } from '@/components/shared/icons/IconProvider';
import { SwitcherSegment } from '@/components/switcher-segment';
import { cn } from '@/lib/utils';
import type { NavigationServerOption, SharedData } from '@/types';

const MAX_STACKED_ICONS = 4;

function ProviderIcon({
    providerSlug,
    className,
}: {
    providerSlug: string | null;
    className?: string;
}) {
    if (!providerSlug) {
        return (
            <ServerIcon className={cn('text-muted-foreground', className)} />
        );
    }

    return <IconProvider iconType={providerSlug} className={className} />;
}

/**
 * One icon per server, overlapping. The ring is the background colour rather than a border so
 * the icon underneath is punched out cleanly on both themes.
 */
function ProviderStack({ providers }: { providers: (string | null)[] }) {
    return (
        <span className="flex shrink-0 items-center -space-x-1">
            {providers.slice(0, MAX_STACKED_ICONS).map((provider, index) => (
                <span
                    key={index}
                    className="flex rounded-[22%] bg-background ring-2 ring-background"
                >
                    <ProviderIcon
                        providerSlug={provider}
                        className="size-4 shrink-0"
                    />
                </span>
            ))}
        </span>
    );
}

/**
 * The server segment of the header path. It stands for a single server on the server pages and
 * for the whole set an environment is deployed across ("3 servers") on the environment pages.
 */
export function ServerSwitcher() {
    const { navigationContext, navigationOptions } =
        usePage<SharedData>().props;

    const segment = navigationContext?.server;

    if (!segment) {
        return null;
    }

    return (
        <SwitcherSegment<NavigationServerOption>
            url={segment.url}
            currentId={segment.current_id}
            options={navigationOptions?.server}
            ariaLabel="Switch server"
            searchPlaceholder="Search servers..."
            emptyMessage="No server found."
            keywordsFor={(server) => [server.name, server.provider_slug ?? '']}
            renderOption={(server) => (
                <span className="flex min-w-0 items-center gap-2">
                    <ProviderIcon
                        providerSlug={server.provider_slug}
                        className="size-5 shrink-0"
                    />
                    <span className="truncate">{server.name}</span>
                </span>
            )}
        >
            <ProviderStack providers={segment.providers} />
            <span className="truncate font-medium">{segment.name}</span>
        </SwitcherSegment>
    );
}
