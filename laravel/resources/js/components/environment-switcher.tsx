import { usePage } from '@inertiajs/react';
import { EnvironmentTypeBadge } from '@/components/environment-type';
import { EnvironmentAvatar } from '@/components/shared/environment-option';
import { SwitcherSegment } from '@/components/switcher-segment';
import type { NavigationEnvironmentOption, SharedData } from '@/types';

/** The environment segment of the header path — present on every page that hangs under one. */
export function EnvironmentSwitcher() {
    const { navigationContext, navigationOptions } =
        usePage<SharedData>().props;

    const segment = navigationContext?.environment;

    if (!segment) {
        return null;
    }

    return (
        <SwitcherSegment<NavigationEnvironmentOption>
            url={segment.url}
            currentId={segment.current_id}
            options={navigationOptions?.environment}
            ariaLabel="Switch environment"
            searchPlaceholder="Search environments..."
            emptyMessage="No environment found."
            keywordsFor={(environment) => [
                environment.name,
                environment.label ?? '',
            ]}
            renderOption={(environment) => (
                <span className="flex min-w-0 items-center gap-2">
                    <EnvironmentAvatar
                        name={environment.name}
                        domain={environment.domain}
                    />
                    <span className="truncate">{environment.name}</span>
                    {environment.label && (
                        <EnvironmentTypeBadge
                            label={environment.label}
                            className="shrink-0 px-1.5 py-px text-[10px]"
                        />
                    )}
                </span>
            )}
        >
            <EnvironmentAvatar
                name={segment.name}
                domain={segment.domain}
                className="size-4"
            />
            <span className="truncate font-medium">{segment.name}</span>
        </SwitcherSegment>
    );
}
