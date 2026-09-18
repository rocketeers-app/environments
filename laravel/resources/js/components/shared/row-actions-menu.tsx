import { MoreHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** The "…" actions menu on table rows and cards, so every trigger, screen reader label and alignment is identical. */
export function RowActionsMenu({
    children,
    label = 'Open menu',
    open,
    onOpenChange,
}: {
    children: ReactNode;
    label?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontal />
                    <span className="sr-only">{label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{children}</DropdownMenuContent>
        </DropdownMenu>
    );
}
