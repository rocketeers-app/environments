import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Fragment, useEffect, useId, useMemo, useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import {
    isItemActive,
    normalizePath,
    resolveActivePath,
} from '@/lib/nav-active';
import type { NavGroup, NavItem } from '@/types';

export function backLabelFromHref(href: string): string {
    const segment = href.replace(/\/+$/, '').split('/').pop() || '';
    const labels: Record<string, string> = {
        servers: 'Servers',
        domains: 'Domains',
        projects: 'Projects',
        mail: 'Mail',
        clients: 'Clients',
        dashboard: 'Dashboard',
        settings: 'Settings',
    };

    return labels[segment] ? `Back to ${labels[segment]}` : 'Back';
}

export function NavMain({
    groups = [],
    collapsible = true,
    backHref,
}: {
    groups: NavGroup[];
    collapsible?: boolean;
    backHref?: string;
}) {
    const page = usePage();
    const indicatorId = useId();
    const [clicked, setClicked] = useState<{
        href?: string;
        path: string;
    } | null>(null);

    const currentPath = normalizePath(page.url);

    const activePath = useMemo(
        () => resolveActivePath(groups, currentPath),
        [groups, currentPath],
    );

    const isActive = (item: NavItem) =>
        isItemActive(item, activePath, currentPath);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
        () => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('nav-groups-state');

                if (saved) {
                    try {
                        return JSON.parse(saved);
                    } catch (e) {
                        console.error('Failed to parse nav-groups-state', e);
                    }
                }
            }

            // Initialize all groups as open by default
            const initial: Record<string, boolean> = {};
            groups.forEach((group) => {
                if (group.title) {
                    initial[group.title] = true;
                }
            });

            return initial;
        },
    );

    useEffect(() => {
        localStorage.setItem('nav-groups-state', JSON.stringify(openGroups));
    }, [openGroups]);

    const toggleGroup = (groupTitle: string) => {
        setOpenGroups((prev) => ({
            ...prev,
            [groupTitle]: !prev[groupTitle],
        }));
    };

    const renderNavItems = (items: NavItem[]) => (
        <SidebarMenu className="gap-1.5">
            {items.map((item) => {
                const active = isActive(item);
                const href =
                    typeof item.href === 'string' ? item.href : item.href?.url;
                const pending =
                    clicked?.path === currentPath && clicked.href === href;

                return (
                    <SidebarMenuItem key={item.title}>
                        {active && (
                            <motion.span
                                aria-hidden
                                layoutId={indicatorId}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 38,
                                }}
                                className="pointer-events-none absolute inset-0 rounded-md bg-background shadow-sm ring-1 ring-border"
                            />
                        )}
                        <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={{ children: item.title }}
                            data-pending={pending || undefined}
                            className="relative h-9 px-2.5 transition-shadow hover:bg-transparent hover:ring-1 hover:ring-border active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:ring-1 data-[active=true]:ring-border data-[pending=true]:ring-1 data-[pending=true]:ring-border"
                        >
                            <Link
                                href={item.href}
                                onClick={() =>
                                    setClicked({ href, path: currentPath })
                                }
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );

    const renderGroup = (group: NavGroup) => {
        if (!group.title) {
            return (
                <SidebarGroup className="px-2 py-0">
                    {renderNavItems(group.items)}
                </SidebarGroup>
            );
        }

        if (!collapsible) {
            return (
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel className="mb-1 px-2.5 text-[0.6875rem] font-semibold tracking-wider text-sidebar-foreground/60 uppercase">
                        {group.title}
                    </SidebarGroupLabel>
                    {renderNavItems(group.items)}
                </SidebarGroup>
            );
        }

        return (
            <SidebarGroup className="px-2 py-0">
                <Collapsible
                    open={openGroups[group.title]}
                    onOpenChange={() => toggleGroup(group.title!)}
                >
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel className="cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                            <div className="flex w-full items-center justify-between">
                                <span>{group.title}</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        openGroups[group.title]
                                            ? 'rotate-180'
                                            : ''
                                    }`}
                                />
                            </div>
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {renderNavItems(group.items)}
                    </CollapsibleContent>
                </Collapsible>
            </SidebarGroup>
        );
    };

    return (
        <>
            {backHref && (
                <SidebarGroup className="mb-2 px-2 py-0">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className="h-9 px-2.5 text-neutral-600 transition-shadow hover:bg-transparent hover:text-neutral-800 hover:ring-1 hover:ring-border active:bg-transparent dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                <Link href={backHref}>
                                    <ArrowLeft className="h-5 w-5" />
                                    <span>{backLabelFromHref(backHref)}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            )}
            {groups.map((group, index) => (
                <Fragment key={group.title ?? `untitled-${index}`}>
                    {index > 0 && <SidebarSeparator className="my-3" />}
                    {renderGroup(group)}
                </Fragment>
            ))}
        </>
    );
}
