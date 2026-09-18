import { Check, Copy } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useClipboard } from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';

const copySizes = {
    sm: { button: 'size-5', icon: 'size-3' },
    default: { button: 'size-7', icon: 'size-3.5' },
    lg: { button: 'size-9', icon: 'size-4' },
};

type CopyValue = string | (() => string | null | undefined);

type CopyButtonProps = Omit<
    React.ComponentProps<typeof Button>,
    'value' | 'size'
> & {
    value: CopyValue;
    label?: string;
    copiedLabel?: string;
    size?: keyof typeof copySizes;
    alwaysVisible?: boolean;
    toastMessage?: string;
    onCopied?: (value: string) => void;
};

/**
 * The single copy affordance in the app: an icon that appears on hover and turns
 * into a green check for two seconds after copying. Reveal-on-hover keys off a
 * `group/copy` ancestor, so wrap the value and this button in one, or pass
 * `alwaysVisible` when the button stands on its own. A function `value` is
 * resolved on click and copies nothing when it yields null, which is how a value
 * that first has to be revealed stays out of the clipboard. Children turn it into
 * a labelled button rather than a bare icon.
 */
export function CopyButton({
    value,
    label = 'Copy',
    copiedLabel = 'Copied',
    size = 'default',
    alwaysVisible = false,
    toastMessage,
    onCopied,
    className,
    onClick,
    variant = 'ghost',
    children,
    ...props
}: CopyButtonProps) {
    const { copied, copy } = useClipboard();

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.(event);

        const text = typeof value === 'function' ? value() : value;

        if (text === null || text === undefined) {
            return;
        }

        if (!(await copy(text))) {
            toast.error('Could not copy to clipboard');

            return;
        }

        if (toastMessage) {
            toast.success(toastMessage);
        }

        onCopied?.(text);
    };

    const button = (
        <Button
            type="button"
            variant={variant}
            size={children ? size : 'icon'}
            data-copied={copied ? '' : undefined}
            aria-label={copied ? copiedLabel : label}
            className={cn(
                'shrink-0 transition-[color,opacity]',
                !children &&
                    cn(
                        'rounded-md p-0 text-muted-foreground hover:text-foreground',
                        copySizes[size].button,
                    ),
                !alwaysVisible &&
                    'opacity-0 group-focus-within/copy:opacity-100 group-hover/copy:opacity-100 focus-visible:opacity-100 data-[copied]:opacity-100 pointer-coarse:opacity-100',
                className,
            )}
            onClick={handleClick}
            {...props}
        >
            {copied ? (
                <Check className={cn(copySizes[size].icon, 'text-green-500')} />
            ) : (
                <Copy className={copySizes[size].icon} />
            )}
            {children}
        </Button>
    );

    if (children) {
        return button;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{copied ? copiedLabel : label}</TooltipContent>
        </Tooltip>
    );
}
