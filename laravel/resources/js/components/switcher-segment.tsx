import { Link, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { SwitcherTriangles } from '@/components/switcher-triangles';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export interface SwitcherOption {
    id: string;
    url: string;
}

/**
 * Items are keyed by id so two identically named environments stay distinct, which means the
 * default fuzzy filter would score the uuid instead of the name — match the keywords only.
 */
const matchKeywords = (_value: string, search: string, keywords?: string[]) =>
    (keywords ?? []).join(' ').toLowerCase().includes(search.toLowerCase())
        ? 1
        : 0;

/**
 * One segment of the header path: the leading `/`, a link to what the segment stands for and a
 * searchable switcher over its siblings. Team and project use a plain dropdown because their
 * lists are short; environments and servers run into the hundreds, so this one gets a filter.
 * `currentId` is null when the segment stands for a set rather than one row, and nothing ticks.
 * The options arrive on the optional `navigationOptions` prop, requested on hover or open, so the
 * sibling lists never ride along on an ordinary visit.
 */
export function SwitcherSegment<T extends SwitcherOption>({
    url,
    currentId,
    options,
    ariaLabel,
    searchPlaceholder,
    emptyMessage,
    keywordsFor,
    renderOption,
    children,
}: {
    url: string;
    currentId: string | null;
    options: T[] | undefined;
    ariaLabel: string;
    searchPlaceholder: string;
    emptyMessage: string;
    keywordsFor: (option: T) => string[];
    renderOption: (option: T) => ReactNode;
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadOptions = () => {
        if (options || loading) {
            return;
        }

        setLoading(true);
        router.reload({
            only: ['navigationOptions'],
            onFinish: () => setLoading(false),
        });
    };

    const toggle = (next: boolean) => {
        setOpen(next);

        if (next) {
            loadOptions();
        }
    };

    return (
        <>
            <span className="shrink-0 text-muted-foreground/50">/</span>
            <div className="flex min-w-0 items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="max-w-48 min-w-0 gap-2 pr-2"
                >
                    <Link href={url}>{children}</Link>
                </Button>
                <Popover open={open} onOpenChange={toggle}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label={ariaLabel}
                            onPointerEnter={loadOptions}
                            onFocus={loadOptions}
                            className="group shrink-0 px-1.5 has-[>svg]:px-1.5 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                        >
                            <SwitcherTriangles />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-72 rounded-lg p-0"
                        align="start"
                        sideOffset={4}
                    >
                        <Command filter={matchKeywords}>
                            <CommandInput placeholder={searchPlaceholder} />
                            <CommandList>
                                <CommandEmpty>
                                    {options ? emptyMessage : 'Loading...'}
                                </CommandEmpty>
                                <CommandGroup>
                                    {(options ?? []).map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            value={option.id}
                                            keywords={keywordsFor(option)}
                                            onSelect={() => {
                                                setOpen(false);

                                                if (option.id !== currentId) {
                                                    router.visit(option.url);
                                                }
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {renderOption(option)}
                                            {option.id === currentId && (
                                                <Check className="ml-auto size-4 shrink-0" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
}
