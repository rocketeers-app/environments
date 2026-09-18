import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { CopyButton } from '@/components/shared/copy-button';
import { cn } from '@/lib/utils';

interface SecretFieldProps {
    value?: string;
    className?: string;
    isVisible?: boolean;
    onVisibilityChange?: (isVisible: boolean) => void;
}

export function SecretField({
    value,
    className,
    isVisible: propsIsVisible,
    onVisibilityChange,
}: SecretFieldProps) {
    const [internalIsVisible, setInternalIsVisible] = useState(false);

    const isVisible =
        propsIsVisible !== undefined ? propsIsVisible : internalIsVisible;
    const setIsVisible = onVisibilityChange || setInternalIsVisible;

    if (!value) {
        return <span className="text-muted-foreground">—</span>;
    }

    const maskedValue =
        value.length > 3
            ? '•'.repeat(Math.min(value.length - 3, 24)) + value.slice(-3)
            : value;

    return (
        <div className={cn('group/copy flex items-center gap-1', className)}>
            <button
                type="button"
                className="cursor-pointer text-left font-mono text-sm break-all"
                onClick={() => setIsVisible(!isVisible)}
            >
                {isVisible ? value : maskedValue}
            </button>
            <button
                type="button"
                aria-label={isVisible ? 'Hide value' : 'Show value'}
                onClick={() => setIsVisible(!isVisible)}
                className="ml-1 p-1 text-muted-foreground opacity-0 transition-[color,opacity] group-focus-within/copy:opacity-100 group-hover/copy:opacity-100 hover:text-foreground focus-visible:opacity-100 pointer-coarse:opacity-100"
            >
                {isVisible ? (
                    <EyeOff className="h-3 w-3" />
                ) : (
                    <Eye className="h-3 w-3" />
                )}
            </button>
            <CopyButton
                value={value}
                size="sm"
                label="Copy value"
                copiedLabel="Value copied"
            />
        </div>
    );
}
