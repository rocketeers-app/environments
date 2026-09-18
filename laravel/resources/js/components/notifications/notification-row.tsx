import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Bell, BotIcon, Server, TriangleAlert } from 'lucide-react';
import { DateTime } from '@/components/ui/date-time';
import { cn } from '@/lib/utils';
import type { AppNotification } from '@/types';

const ICONS: Record<string, LucideIcon> = {
    server: Server,
    incident: TriangleAlert,
    agent: BotIcon,
};

const TONES: Record<string, string> = {
    success: 'bg-emerald-500/15 text-emerald-500',
    destructive: 'bg-destructive/15 text-destructive',
    info: 'bg-sky-500/15 text-sky-500',
    default: 'bg-muted text-muted-foreground',
};

export function NotificationRow({
    notification,
    href,
    onOpen,
}: {
    notification: AppNotification;
    href: string;
    onOpen: (notification: AppNotification) => void;
}) {
    const Icon = ICONS[notification.icon] ?? Bell;

    return (
        <Link
            href={href}
            onClick={() => onOpen(notification)}
            className="flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent"
        >
            <span
                className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    TONES[notification.tone] ?? TONES.default,
                )}
            >
                <Icon className="size-4.5" />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-sm leading-snug text-foreground">
                    <span className="font-medium">{notification.subject}</span>{' '}
                    <span className="text-muted-foreground">
                        {notification.message}
                    </span>
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                    <DateTime
                        value={notification.created_at}
                        variant="relative"
                    />
                </span>
            </span>

            {!notification.read_at && (
                <span
                    aria-label="Unread"
                    className="mt-3 size-2 shrink-0 rounded-full bg-primary"
                />
            )}
        </Link>
    );
}
