import { Filter } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export interface TableFilterProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
}

/** The filter bar a DataTable sets into its tray above the column headings; it keeps its own term so a debounced round trip never rewrites what is being typed. */
export function TableFilter({
    value = '',
    onChange,
    placeholder = 'Filter...',
    className,
    autoFocus,
}: TableFilterProps) {
    const [term, setTerm] = useState(value);

    return (
        <label
            data-slot="table-filter"
            className={cn(
                'flex h-11 cursor-text items-center gap-2.5 rounded-sm border border-table-border bg-card px-4 transition-[box-shadow,border-color] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
                className,
            )}
        >
            <Filter className="size-4 shrink-0 text-muted-foreground" />
            <input
                type="search"
                autoFocus={autoFocus}
                autoComplete="off"
                data-1p-ignore=""
                data-lpignore="true"
                placeholder={placeholder}
                value={term}
                onChange={(event) => {
                    setTerm(event.target.value);
                    onChange(event.target.value);
                }}
                className="h-full w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm [&::-webkit-search-cancel-button]:hidden"
            />
        </label>
    );
}
