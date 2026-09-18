import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
    value: string;
    label: string;
    /** Unselectable option, e.g. an environment whose lock refuses the write anyway. */
    disabled?: boolean;
    // Callers hang their own metadata (provider_slug, lock reasons, …) off an option and
    // read it back at their own type, so this bag stays untyped.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
export interface ComboboxGroup {
    label: string;
    options: ComboboxOption[];
    // Callers hang their own metadata (provider_slug, lock reasons, …) off an option and
    // read it back at their own type, so this bag stays untyped.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
export interface ComboboxProps {
    value?: string | string[];
    onValueChange?: (value: string) => void;
    options: ComboboxOption[] | ComboboxGroup[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
    name?: string;
    multiple?: boolean;
    portal?: boolean;
    renderOption?: (props: { option: ComboboxOption; isSelected: boolean }) => React.ReactNode;
    renderValue?: (option: ComboboxOption) => React.ReactNode;
    renderGroupLabel?: (group: ComboboxGroup) => React.ReactNode;
    renderPill?: (option: ComboboxOption) => React.ReactNode;
    onSearch?: (query: string) => void;
    loading?: boolean;
}

/* --------------------------------------------------------------- */
/*  Helpers                                                       */
/* --------------------------------------------------------------- */
const isGrouped = (options: ComboboxOption[] | ComboboxGroup[]): options is ComboboxGroup[] =>
    Array.isArray(options) && options.length > 0 && "options" in options[0] && Array.isArray((options[0] as ComboboxGroup).options);

const toArray = (val: string | string[] | undefined): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return val ? val.split(",") : [];
    return [];
};
const toString = (arr: string[]) => arr.filter(Boolean).join(",");

/* --------------------------------------------------------------- */
/*  Combobox component                                            */
/* --------------------------------------------------------------- */
export function Combobox({
    value: externalValue = "",
    onValueChange,
    options = [],
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
    className,
    disabled = false,
    name,
    multiple = false,
    portal = true,
    renderOption,
    renderValue,
    renderGroupLabel,
    renderPill,
    onSearch,
    loading = false,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    /**
     * Normalised to the comma-joined string every internal write already stores. `value` also
     * accepts string[], and an array dependency compares by reference, so a parent rebuilding
     * its array each render re-fired this effect forever ("Maximum update depth exceeded").
     */
    const externalKey = toString(toArray(externalValue));
    const [internalValue, setInternalValue] = React.useState(externalKey);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => setInternalValue(externalKey), [externalKey]);

    const selectedValues = multiple ? toArray(internalValue) : [internalValue];
    const isGroupedOptions = isGrouped(options);

    // flatten for selection lookup
    const allFlatOptions: ComboboxOption[] = isGroupedOptions
        ? options.flatMap(g => g.options)
        : (options as ComboboxOption[]);

    const selectedOptions = allFlatOptions.filter(o => selectedValues.includes(o.value));

    const isSelectable = (option: ComboboxOption) => !multiple || !selectedValues.includes(option.value);
    const visibleGroups = isGroupedOptions
        ? options
            .map(group => ({ ...group, options: group.options.filter(isSelectable) }))
            .filter(group => group.options.length > 0)
        : [];
    const visibleOptions = isGroupedOptions ? [] : (options as ComboboxOption[]).filter(isSelectable);

    const toggleValue = (newValue: string) => {
        let next: string[];
        if (multiple) {
            const arr = toArray(internalValue);
            next = arr.includes(newValue) ? arr.filter(v => v !== newValue) : [...arr, newValue];
        } else {
            next = [newValue];
        }
        const final = toString(next);
        setInternalValue(final);
        onValueChange?.(final);
        if (!multiple) setOpen(false);
        else requestAnimationFrame(() => triggerRef.current?.focus());
    };

    const handleSearch = (query: string) => {
        onSearch?.(query);
        requestAnimationFrame(() => listRef.current?.scrollTo({ top: 0 }));
    };

    const removePill = (valueToRemove: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = toArray(internalValue).filter(v => v !== valueToRemove);
        setInternalValue(toString(next));
        onValueChange?.(toString(next));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between text-left font-normal h-auto min-h-9 py-1.5",
                        !internalValue && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <div className="flex flex-wrap items-center gap-1 flex-1 overflow-hidden">
                        {multiple && selectedOptions.length > 0 ? (
                            <>
                                {selectedOptions.map(opt => (
                                    <span
                                        key={opt.value}
                                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs"
                                    >
                                        {renderPill ? renderPill(opt) : opt.label}
                                        <span
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Remove ${opt.label}`}
                                            className="inline-flex h-4 w-4 items-center justify-center rounded-sm cursor-pointer hover:bg-primary/20"
                                            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removePill(opt.value)(e); }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removePill(opt.value)(e as unknown as React.MouseEvent);
                                                }
                                            }}
                                        >
                                            <X className="h-3 w-3 pointer-events-none" />
                                        </span>
                                    </span>
                                ))}
                            </>
                        ) : selectedOptions[0] ? (
                            renderValue ? (
                                renderValue(selectedOptions[0])
                            ) : (
                                selectedOptions[0].label
                            )
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-max min-w-[var(--radix-popover-trigger-width)] max-w-sm p-0 max-sm:w-screen max-sm:min-w-0 max-sm:max-w-none max-sm:rounded-none max-sm:border-x-0" align="start" portal={portal}>
                <Command shouldFilter={!onSearch}>
                    <CommandInput placeholder={searchPlaceholder} className="h-9" onValueChange={handleSearch} />
                    <CommandList ref={listRef}>
                        <CommandEmpty>{loading ? 'Searching...' : emptyMessage}</CommandEmpty>

                        {isGroupedOptions ? (
                            visibleGroups.map(group => (
                                <CommandGroup key={group.label} heading={renderGroupLabel ? renderGroupLabel(group) : group.label}>
                                    {group.options.map(option => {
                                        const isSelected = selectedValues.includes(option.value);

                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value} // Primary value (exact match)
                                                // Add keywords for fuzzy search
                                                keywords={[group.label, option.label]}
                                                disabled={option.disabled}
                                                onSelect={() => option.disabled || toggleValue(option.value)}
                                            // Optional: filter manually if needed, but Command handles it via keywords
                                            >
                                                {renderOption ? (
                                                    renderOption({ option, isSelected })
                                                ) : (
                                                    <>
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                isSelected ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {option.label}
                                                    </>
                                                )}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            ))
                        ) : (
                            <CommandGroup>
                                {visibleOptions.map(option => {
                                    const isSelected = selectedValues.includes(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            keywords={[option.label]}
                                            disabled={option.disabled}
                                            onSelect={() => option.disabled || toggleValue(option.value)}
                                        >
                                            {renderOption ? (
                                                renderOption({ option, isSelected })
                                            ) : (
                                                <>
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            isSelected ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {option.label}
                                                </>
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>

            {name && (multiple
                ? toArray(internalValue).map((v) => (
                    <input key={v} type="hidden" name={`${name}[]`} value={v} />
                ))
                : <input type="hidden" name={name} value={internalValue} />
            )}
        </Popover>
    );
}