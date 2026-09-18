import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { useId } from 'react';
import { mainNavGroups } from '@/components/app-main-nav';
import { settingsSections } from '@/components/settings/settings-nav';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavPath } from '@/hooks/use-nav-path';
import { useScrollActiveIntoView } from '@/hooks/use-scroll-active-into-view';
import { appSectionItemX, appSectionRow } from '@/lib/layout';
import { isItemActive, resolveActivePath } from '@/lib/nav-active';
import { isTeamOwner } from '@/lib/roles';
import { cn } from '@/lib/utils';
import type { NavGroup, NavItem, SharedData } from '@/types';

type SectionItem = NavItem & { href: NonNullable<NavItem['href']> };

// The sections of whichever main-nav item is active, or of settings, which has no main-nav
// item, as the first row inside the content panel. It reads the same config the tab strip does, so a section is added by listing it
// under that item — pages carry no strip of their own. The strip above already wears the
// bevel cap, so this level stays a plain link and marks the active section with a filled
// pill. Page actions live beside the page's own heading, not here. The strip stays one row:
// a viewport too narrow for it scrolls sideways, never down.
interface AppSectionNavProps {
    groups?: NavGroup[];
}

export function AppSectionNav({
    groups: providedGroups,
}: AppSectionNavProps = {}) {
    const page = usePage<SharedData>();
    const stripRef = useScrollActiveIntoView<HTMLDivElement>();
    const indicatorId = useId();
    const currentPath = useNavPath();
    const groups =
        providedGroups ??
        mainNavGroups({
            hasLaravelEnvironments: page.props.hasLaravelEnvironments,
        });
    const activePath = resolveActivePath(groups, currentPath);
    const section = groups
        .flatMap((group) => group.items ?? [])
        .find((item) => isItemActive(item, activePath, currentPath));
    const settings = settingsSections(
        isTeamOwner(page.props.auth?.userRoles),
        page.props.auth?.can,
    );
    const inSettings =
        resolveActivePath([{ items: settings }], currentPath) !== null;
    const items = (section?.items ?? (inSettings ? settings : [])).filter(
        (item): item is SectionItem => item.href !== undefined,
    );
    const moreItems = (section?.more ?? []).filter(
        (item): item is SectionItem => item.href !== undefined,
    );

    if (items.length === 0) {
        return null;
    }

    const sectionActivePath = resolveActivePath(
        [{ items: [...items, ...moreItems] }],
        currentPath,
    );
    const moreActive = moreItems.some((item) =>
        isItemActive(item, sectionActivePath, currentPath),
    );

    return (
        <nav className="relative w-full shrink-0 bg-sidebar">
            <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-sidebar-border"
            />
            <div
                className={cn(
                    appSectionRow,
                    'relative flex min-h-[57px] items-center gap-3',
                )}
            >
                <motion.div
                    ref={stripRef}
                    layoutScroll
                    className="flex min-w-0 flex-1 items-center overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {items.map((item) => {
                        const active = isItemActive(
                            item,
                            sectionActivePath,
                            currentPath,
                        );

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'relative flex h-[57px] shrink-0 items-center text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground',
                                    appSectionItemX,
                                    active && 'font-semibold text-foreground',
                                )}
                            >
                                {active && (
                                    <motion.span
                                        aria-hidden
                                        layoutId={indicatorId}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 38,
                                        }}
                                        className="pointer-events-none absolute inset-x-1 inset-y-3 rounded-md bg-table-header dark:bg-background"
                                    />
                                )}
                                <span className="relative">{item.title}</span>
                            </Link>
                        );
                    })}
                    {moreItems.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className={cn(
                                    'relative flex h-[57px] shrink-0 items-center text-muted-foreground transition-colors outline-none hover:text-foreground data-[state=open]:text-foreground',
                                    appSectionItemX,
                                    moreActive && 'text-foreground',
                                )}
                            >
                                {moreActive && (
                                    <motion.span
                                        aria-hidden
                                        layoutId={indicatorId}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 38,
                                        }}
                                        className="pointer-events-none absolute inset-x-1 inset-y-3 rounded-md bg-table-header dark:bg-background"
                                    />
                                )}
                                <MoreHorizontal className="relative size-4" />
                                <span className="sr-only">More sections</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                {moreItems.map((item) => {
                                    const active = isItemActive(
                                        item,
                                        sectionActivePath,
                                        currentPath,
                                    );

                                    return (
                                        <DropdownMenuItem
                                            key={item.title}
                                            asChild
                                        >
                                            <Link
                                                href={item.href}
                                                aria-current={
                                                    active ? 'page' : undefined
                                                }
                                                className={cn(
                                                    active &&
                                                        'font-semibold text-foreground',
                                                )}
                                            >
                                                {item.icon && <item.icon />}
                                                {item.title}
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </motion.div>
            </div>
        </nav>
    );
}
