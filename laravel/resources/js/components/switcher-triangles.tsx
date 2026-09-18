import { cn } from '@/lib/utils';

/** Up and down triangles marking a breadcrumb switcher; they turn black (logo colour in dark mode) when the parent `group` is hovered or open. */
export function SwitcherTriangles({ className }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'flex flex-col items-center gap-0.5 text-neutral-400 transition-colors group-hover:text-neutral-950 group-data-[state=open]:text-neutral-950 dark:text-muted-foreground dark:group-hover:text-emerald-400 dark:group-data-[state=open]:text-emerald-400',
                className,
            )}
        >
            <svg
                viewBox="0 0 6 4"
                width={6}
                height={4}
                style={{ width: 6, height: 4 }}
                className="fill-current stroke-current"
                strokeWidth={1}
                strokeLinejoin="round"
            >
                <path d="M3 .6 5.5 3.5H.5Z" />
            </svg>
            <svg
                viewBox="0 0 6 4"
                width={6}
                height={4}
                style={{ width: 6, height: 4 }}
                className="fill-current stroke-current"
                strokeWidth={1}
                strokeLinejoin="round"
            >
                <path d="M.5 .5h5L3 3.4Z" />
            </svg>
        </span>
    );
}
