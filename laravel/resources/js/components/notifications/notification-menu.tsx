import { router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NotificationRow } from '@/components/notifications/notification-row';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormattingPreferences } from '@/hooks/use-date-format';
import type { FormattingPreferences } from '@/lib/datetime';
import { formatDateTime } from '@/lib/datetime';
import {
    notificationsReadAll as readAll,
    notificationsShow as show,
} from '@/lib/design-routes';
import { cn } from '@/lib/utils';
import type { AppNotification, SharedData } from '@/types';

const DAY_IN_MS = 86_400_000;

function groupLabel(value: string, preferences: FormattingPreferences): string {
    const day = formatDateTime(value, 'date', preferences);

    if (day === formatDateTime(new Date(), 'date', preferences)) {
        return 'Today';
    }

    if (
        day ===
        formatDateTime(new Date(Date.now() - DAY_IN_MS), 'date', preferences)
    ) {
        return 'Yesterday';
    }

    return formatDateTime(value, 'date-long', preferences) ?? '';
}

function groupByDay(
    notifications: AppNotification[],
    preferences: FormattingPreferences,
): Array<[string, AppNotification[]]> {
    const groups = new Map<string, AppNotification[]>();

    for (const notification of notifications) {
        const label = groupLabel(notification.created_at, preferences);
        groups.set(label, [...(groups.get(label) ?? []), notification]);
    }

    return [...groups.entries()];
}

/**
 * The bell menu in the app navbar. Its rows arrive on the optional `notifications` prop,
 * fetched only once the menu opens; the unread badge rides along on every visit so it
 * stays current without carrying the whole feed on each response.
 */
export function NotificationMenu() {
    const { notificationCount = 0, notifications } =
        usePage<SharedData>().props;
    const preferences = useFormattingPreferences();

    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState('unread');
    const [items, setItems] = useState<AppNotification[] | null>(null);
    const [unread, setUnread] = useState(notificationCount);

    useEffect(() => setUnread(notificationCount), [notificationCount]);

    useEffect(() => {
        if (notifications) {
            setItems(notifications);
        }
    }, [notifications]);

    const unreadItems = useMemo(
        () => (items ?? []).filter((item) => !item.read_at),
        [items],
    );

    const openMenu = (next: boolean) => {
        setOpen(next);

        if (next) {
            router.reload({ only: ['notifications'] });
        }
    };

    const markAsRead = (ids: string[]) => {
        const now = new Date().toISOString();

        setItems((current) =>
            (current ?? []).map((item) =>
                ids.includes(item.id)
                    ? { ...item, read_at: item.read_at ?? now }
                    : item,
            ),
        );
        setUnread((current) => Math.max(0, current - ids.length));
    };

    const markAllAsRead = () => {
        markAsRead(unreadItems.map((item) => item.id));
        setUnread(0);
        router.post(
            readAll().url,
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const list = (visible: AppNotification[]) => {
        if (visible.length === 0) {
            return (
                <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                    {items === null
                        ? 'Loading notifications…'
                        : "You're all caught up"}
                </div>
            );
        }

        return (
            <div className="max-h-[26rem] overflow-y-auto overscroll-contain">
                <div className="p-2">
                    {groupByDay(visible, preferences).map(([label, group]) => (
                        <div key={label}>
                            <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground">
                                {label}
                            </p>
                            {group.map((notification) => (
                                <NotificationRow
                                    key={notification.id}
                                    notification={notification}
                                    href={
                                        show({ notification: notification.id })
                                            .url
                                    }
                                    onOpen={() => {
                                        markAsRead([notification.id]);
                                        setOpen(false);
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Popover open={open} onOpenChange={openMenu}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                        unread > 0
                            ? `Open notifications, ${unread} unread`
                            : 'Open notifications'
                    }
                    data-test="notification-menu-button"
                    className={cn(
                        'relative shrink-0 rounded-full data-[state=open]:bg-accent',
                        unread > 0
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                    )}
                >
                    <Bell className="size-5" />
                    {unread > 0 && (
                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-[26rem] p-0">
                <Tabs value={tab} onValueChange={setTab}>
                    <div className="flex items-center justify-between gap-2 border-b p-2">
                        <TabsList>
                            <TabsTrigger value="unread" count={unread}>
                                Unread
                            </TabsTrigger>
                            <TabsTrigger value="all">All</TabsTrigger>
                        </TabsList>
                        <Button
                            variant="link"
                            size="sm"
                            disabled={unread === 0}
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    </div>

                    <TabsContent value="unread" className="mt-0">
                        {list(unreadItems)}
                    </TabsContent>
                    <TabsContent value="all" className="mt-0">
                        {list(items ?? [])}
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
