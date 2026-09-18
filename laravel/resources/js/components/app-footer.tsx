import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    activityIndex as ActivityIndex,
    monitoringStatusIndex as MonitoringStatusIndex,
} from '@/lib/design-routes';
import { appContainerPadded } from '@/lib/layout';
import { cn } from '@/lib/utils';

/**
 * Closes the shell below the content panel: brand line on the left, secondary
 * links on the right. It carries its own white background so the strip below the
 * panel stays white while the shell around it is #fafafa.
 */
export function AppFooter() {
    const appName = import.meta.env.VITE_APP_NAME ?? 'Rocketeers';
    const linkClasses = 'transition-colors hover:text-foreground';

    return (
        <footer className="w-full shrink-0 bg-background">
            <div
                className={cn(
                    appContainerPadded,
                    'flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
                )}
            >
                <div className="flex items-center gap-2">
                    <AppLogoIcon className="size-4 shrink-0" />
                    <span>
                        {appName} © {new Date().getFullYear()}
                    </span>
                </div>
                <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <Link
                        href={MonitoringStatusIndex()}
                        className={linkClasses}
                    >
                        Status
                    </Link>
                    <Link href={ActivityIndex()} className={linkClasses}>
                        Activity
                    </Link>
                    <a
                        href="https://rocketee.rs/knowledge"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClasses}
                    >
                        Docs
                    </a>
                </nav>
            </div>
        </footer>
    );
}
