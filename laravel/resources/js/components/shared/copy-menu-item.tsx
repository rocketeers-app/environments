import { Check, Copy } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useClipboard } from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';

type CopyMenuItemProps = Omit<
    React.ComponentProps<typeof DropdownMenuItem>,
    'onSelect'
> & {
    value: string;
    icon?: React.ReactNode;
    toastMessage?: string;
};

/** Dropdown entry that copies a value: the copy icon turns into a green check, and the menu stays open long enough to see it. Give `icon` when the entry already carries its own leading icon; the indicator then moves to the trailing edge. */
export function CopyMenuItem({
    value,
    icon,
    toastMessage,
    className,
    children,
    ...props
}: CopyMenuItemProps) {
    const { copied, copy } = useClipboard();

    const handleSelect = async (event: Event) => {
        event.preventDefault();

        if (!(await copy(value))) {
            toast.error('Could not copy to clipboard');

            return;
        }

        if (toastMessage) {
            toast.success(toastMessage);
        }
    };

    const indicator = copied ? (
        <Check className={cn('text-green-500', icon && 'ml-auto')} />
    ) : (
        <Copy className={cn(icon && 'ml-auto')} />
    );

    return (
        <DropdownMenuItem
            className={className}
            onSelect={handleSelect}
            {...props}
        >
            {icon}
            {icon ? (
                <>
                    {children}
                    {indicator}
                </>
            ) : (
                <>
                    {indicator}
                    {children}
                </>
            )}
        </DropdownMenuItem>
    );
}
