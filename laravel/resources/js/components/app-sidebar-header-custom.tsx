import { usePage } from '@inertiajs/react';
import { EllipsisVertical, Search } from 'lucide-react';
import { useMemo } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { EnvironmentSwitcher } from '@/components/environment-switcher';
import { NotificationMenu } from '@/components/notifications/notification-menu';
import { ProjectSwitcher } from '@/components/project-switcher';
import { ServerSwitcher } from '@/components/server-switcher';
import { TeamSwitcher } from '@/components/team-switcher';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/user-menu';
import { openCommandPalette } from '@/lib/command-palette-store';
import { dashboard } from '@/lib/design-routes';
import { appContainerPadded } from '@/lib/layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType, SharedData } from '@/types';
export type { BreadcrumbItemType };

export function AppSidebarHeaderCustom(_props: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage<SharedData>();
    const isAuthenticated = !!page.props.auth?.user;

    const isMac = useMemo(() => {
        if (typeof navigator === 'undefined') {
            return true;
        }

        return (
            navigator.platform?.toUpperCase().includes('MAC') ??
            navigator.userAgent?.includes('Mac')
        );
    }, []);

    return (
        <header className="w-full shrink-0 bg-background">
            <div
                className={cn(
                    appContainerPadded,
                    'flex h-16 items-center justify-between gap-2',
                )}
            >
                <div className="flex min-w-0 items-center gap-1 select-none sm:gap-2">
                    <a
                        href={dashboard().url}
                        className="-ml-2 flex h-8 shrink-0 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-accent hover:text-accent-foreground sm:mr-2 sm:-ml-3 sm:px-3"
                    >
                        <AppLogoIcon className="size-6 shrink-0" />
                        <span className="hidden text-base font-semibold tracking-tight sm:inline">
                            {import.meta.env.VITE_APP_NAME ?? 'Rocketeers'}
                        </span>
                    </a>
                    <TeamSwitcher />
                    <ProjectSwitcher />
                    <div className="hidden min-w-0 items-center gap-2 lg:flex">
                        <ServerSwitcher />
                        <EnvironmentSwitcher />
                    </div>
                </div>

                {isAuthenticated && (
                    <div className="flex min-w-0 shrink-[100] items-center gap-2">
                        <button
                            type="button"
                            onClick={openCommandPalette}
                            className="@container mr-2 hidden h-9 w-[280px] min-w-28 items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
                        >
                            <Search className="h-4 w-4 shrink-0" />
                            <span className="truncate">Search</span>
                            <kbd className="pointer-events-none ml-auto hidden shrink-0 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground select-none @[13rem]:inline-block">
                                {isMac ? '⌘' : 'Ctrl+'}K
                            </kbd>
                        </button>
                        <NotificationMenu />
                        <div className="hidden h-9 shrink-0 items-center md:flex">
                            <UserMenu />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={(event) => {
                                if (event.detail > 0) {
                                    event.currentTarget.blur();
                                }

                                openCommandPalette();
                            }}
                            aria-label="Open command & search"
                            className="w-11 shrink-0 bg-muted/40 text-muted-foreground hover:bg-muted md:hidden"
                        >
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
