import { Link } from '@inertiajs/react';
import { ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { Fragment } from 'react';
import { backLabelFromHref } from '@/components/nav-main';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavPath } from '@/hooks/use-nav-path';
import { isItemActive, resolveActivePath } from '@/lib/nav-active';
import { cn } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types';

/** The subject sidebar collapsed into one full-width dropdown for small screens, where a stacked link list pushes the page below the fold. */
export function AppSubjectNavDropdown({
    groups,
    backHref,
}: {
    groups: NavGroup[];
    backHref?: string;
}) {
    const currentPath = useNavPath();
    const activePath = resolveActivePath(groups, currentPath);
    const isActive = (item: NavItem) =>
        isItemActive(item, activePath, currentPath);
    const activeGroup = groups.find((group) => group.items.some(isActive));
    const activeItem = activeGroup?.items.find(isActive);
    const ActiveIcon = activeItem?.icon;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger
                className="flex h-11 w-full items-center gap-2.5 rounded-lg bg-background px-3 text-left text-sm shadow-sm ring-1 ring-border outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Section navigation"
            >
                {ActiveIcon && (
                    <ActiveIcon className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                    {activeGroup?.title && (
                        <span className="truncate text-[0.6875rem] leading-tight font-semibold tracking-wider text-muted-foreground uppercase">
                            {activeGroup.title}
                        </span>
                    )}
                    <span className="truncate font-medium">
                        {activeItem?.title ?? 'Navigate'}
                    </span>
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) overflow-y-auto"
            >
                {backHref && (
                    <>
                        <DropdownMenuItem asChild className="h-10">
                            <Link href={backHref}>
                                <ArrowLeft />
                                <span>{backLabelFromHref(backHref)}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                {groups.map((group, index) => (
                    <Fragment key={group.title ?? `untitled-${index}`}>
                        {index > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuGroup>
                            {group.title && (
                                <DropdownMenuLabel className="text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase">
                                    {group.title}
                                </DropdownMenuLabel>
                            )}
                            {group.items.map((item) => {
                                const active = isActive(item);

                                return (
                                    <DropdownMenuItem
                                        key={item.title}
                                        asChild
                                        className={cn(
                                            'h-10',
                                            active && 'bg-accent font-medium',
                                        )}
                                    >
                                        <Link
                                            href={item.href}
                                            aria-current={
                                                active ? 'page' : undefined
                                            }
                                        >
                                            {item.icon && <item.icon />}
                                            <span className="flex-1 truncate">
                                                {item.title}
                                            </span>
                                            {active && <Check />}
                                        </Link>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuGroup>
                    </Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
