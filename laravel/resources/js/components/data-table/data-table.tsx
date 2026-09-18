'use client';

import { Link } from '@inertiajs/react';
import type {
    Column,
    ColumnDef,
    Row,
    RowSelectionState,
    SortingState,
} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Filter } from 'lucide-react';
import type { CSSProperties } from 'react';
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import type { EmptyStateProps } from '@/components/shared/empty-state';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableFrame,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { TabsCount } from '@/components/ui/tabs';
import { Tabs, TabsDivider, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

import { BulkActionBar } from './bulk-action-bar';
import { columnSize, flexColumnMinSize } from './column-sizes';
import type { TableFilterProps } from './table-filter';
import { TableFilter } from './table-filter';

interface CellMeta {
    align?: 'right' | 'center';
    className?: string;
    /** Forces a column that does declare a `size` to absorb the slack anyway. */
    flex?: boolean;
    hideOnMobile?: boolean;
}

const isFlexColumn = <TData, TValue>(column: Column<TData, TValue>) =>
    column.columnDef.size === undefined ||
    !!(column.columnDef.meta as CellMeta | undefined)?.flex;

type ContentWidths = Record<string, number>;

const cellClasses = (meta?: CellMeta) =>
    cn(
        meta?.align === 'right' && 'text-right',
        meta?.align === 'center' && 'text-center',
        meta?.className,
    );

/**
 * A column that states a `size` (pick one from `columnSize`) gets exactly that width; one
 * that states none stays auto and takes every pixel the sized columns leave over, which is
 * what the name column of a listing is for. TanStack's own `getSize()` is deliberately not
 * used: it reports its 150px default for a column that never asked for a width, which under
 * `table-fixed` spreads the slack across every column and is why counts and action columns
 * used to render as wide as a name. A column whose content cannot wrap or truncate is
 * widened to that content, so it never spills over its neighbour.
 */
const columnStyle = <TData, TValue>(
    column: Column<TData, TValue>,
    contentWidths: ContentWidths,
): CSSProperties | undefined => {
    const { size, minSize, maxSize } = column.columnDef;
    const contentWidth = contentWidths[column.id] ?? 0;

    if (isFlexColumn(column)) {
        return minSize || maxSize
            ? { minWidth: minSize, maxWidth: maxSize }
            : undefined;
    }

    return { width: Math.max(size ?? 0, contentWidth) };
};

/**
 * A `table-fixed` table that is only `w-full` scales its declared column widths down to fit
 * its container, so on a phone the columns collapse into each other and the scroll container
 * around them has nothing to scroll. Summing the declared widths into the table's `min-width`
 * keeps every column at its stated size and hands the overflow to that scroller instead.
 */
const columnMinWidth = <TData, TValue>(
    column: Column<TData, TValue>,
): number => {
    const { size, minSize } = column.columnDef;

    if (isFlexColumn(column)) {
        return minSize ?? size ?? flexColumnMinSize;
    }

    return size ?? 0;
};

const columnWidth = <TData, TValue>(
    column: Column<TData, TValue>,
    contentWidths: ContentWidths,
): number => Math.max(columnMinWidth(column), contentWidths[column.id] ?? 0);

const overflowingWidths = (table: HTMLTableElement): ContentWidths => {
    const widths: ContentWidths = {};

    table.querySelectorAll<HTMLElement>('[data-column-id]').forEach((cell) => {
        if (cell.scrollWidth <= cell.clientWidth + 1) {
            return;
        }

        const id = cell.dataset.columnId as string;
        const width = Math.ceil(
            cell.scrollWidth + parseFloat(getComputedStyle(cell).paddingRight),
        );

        widths[id] = Math.max(widths[id] ?? 0, width);
    });

    return widths;
};

/**
 * Index the spacer column is rendered at when a table declares a width for every column and
 * so has nothing to absorb the slack: ahead of the trailing run of right-aligned columns, so
 * row actions stay against the right edge.
 */
const spacerIndex = <TData, TValue>(
    columns: Column<TData, TValue>[],
): number => {
    let index = columns.length;

    while (
        index > 0 &&
        (columns[index - 1].columnDef.meta as CellMeta | undefined)?.align ===
            'right'
    ) {
        index--;
    }

    return index;
};

const withSpacer = (
    cells: React.ReactNode[],
    index: number | null,
    spacer: React.ReactNode,
) =>
    index === null
        ? cells
        : [...cells.slice(0, index), spacer, ...cells.slice(index)];

const selectColumn = <TData, TValue>(): ColumnDef<TData, TValue> => ({
    id: 'select',
    header: ({ table }) => (
        <div className="flex items-center">
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                disabled={
                    !table.getRowModel().rows.some((row) => row.getCanSelect())
                }
                aria-label="Select all rows"
            />
        </div>
    ),
    cell: ({ row }) => (
        <div
            className="flex items-center"
            onClick={(event) => event.stopPropagation()}
        >
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                disabled={!row.getCanSelect()}
                aria-label="Select row"
            />
        </div>
    ),
    size: columnSize.select,
    enableSorting: false,
});

export interface BulkActionsContext<TData> {
    rows: TData[];
    /** Every row matching the current filter is selected, not only the `rows` on this page. */
    allSelected: boolean;
    count: number;
    clearSelection: () => void;
}

export interface PaginationData {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total: number;
    from?: number | null;
    to?: number | null;
    data: unknown[];
    links?: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url?: string | null;
    prev_page_url?: string | null;
}

/** A Laravel paginator as Inertia serialises it, typed by the rows it carries. */
export type Paginated<T> = Omit<PaginationData, 'data'> & { data: T[] };

interface DataTableTab {
    value: string;
    label: React.ReactNode;
    count?: TabsCount;
    /** Recolours the count badge, e.g. the critical-severity red a tab wears while something is down. */
    countClassName?: string;
    /** Sets this tab apart from the ones before it with a divider on its left. */
    dividerBefore?: boolean;
    disabled?: boolean;
    href?: string;
}

interface DataTableTabs {
    value: string;
    onChange?: (value: string) => void;
    items: DataTableTab[];
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tabs?: DataTableTabs;
    /** Extra content at the toolbar's left, beside the tabs — e.g. bulk actions for the current selection. */
    toolbarStart?: React.ReactNode;
    pagination?: PaginationData;
    onPageChange?: (page: number, perPage?: number) => void;
    onRowClick?: (row: TData) => void;
    onRowHover?: (row: TData) => void;
    /** Extra classes per row, e.g. the muted tint on rows of a locked environment. */
    rowClassName?: (row: TData) => string | undefined;
    renderExpandedRow?: (row: TData) => React.ReactNode;
    sorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: (selection: RowSelectionState) => void;
    getRowId?: (row: TData) => string;
    /** Prepends a checkbox column; once rows are ticked `bulkActions` floats over the table's bottom edge. */
    selectable?: boolean;
    /** Rows that may not be ticked, e.g. servers still installing. */
    canSelectRow?: (row: TData) => boolean;
    bulkActions?: (context: BulkActionsContext<TData>) => React.ReactNode;
    /** Once a whole page is ticked, offers to select every row across all pages; `bulkActions` must then honour `allSelected`. */
    selectAllRows?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    emptyState?: EmptyStateProps;
    /** A filter bar set into the table's tray above the column headings. */
    filter?: TableFilterProps;
}

/**
 * Renders exactly the rows the server sent: sorting and pagination are both manual, so a
 * header click or a page click is an Inertia visit (see useTableQuery) rather than a
 * reshuffle of the current page. Without `sorting`/`onSortingChange` a header cannot sort,
 * and without `pagination`/`onPageChange` no pager is rendered. Column widths come from
 * `columnSize`; leave one content column sizeless so it absorbs the leftover width.
 */
export function DataTable<TData, TValue>({
    columns,
    data,
    tabs,
    toolbarStart,
    pagination,
    onPageChange,
    onRowClick,
    onRowHover,
    rowClassName,
    renderExpandedRow,
    sorting: controlledSorting,
    onSortingChange,
    rowSelection: controlledRowSelection,
    onRowSelectionChange,
    getRowId,
    selectable = false,
    canSelectRow,
    bulkActions,
    selectAllRows = false,
    loading = false,
    loadingLabel,
    emptyState,
    filter,
}: DataTableProps<TData, TValue>) {
    const [internalRowSelection, setInternalRowSelection] =
        useState<RowSelectionState>({});
    const [allRowsSelected, setAllRowsSelected] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(!!filter?.value);
    const [tableWidth, setTableWidth] = useState(0);
    const [contentWidths, setContentWidths] = useState<ContentWidths>({});
    const [measuredData, setMeasuredData] = useState(data);
    const tableRef = useRef<HTMLTableElement | null>(null);
    const isMobile = useIsMobile();

    if (measuredData !== data) {
        setMeasuredData(data);
        setContentWidths({});
        setAllRowsSelected(false);
    }

    useLayoutEffect(() => {
        if (!tableRef.current) {
            return;
        }

        const grown = Object.entries(overflowingWidths(tableRef.current));

        if (grown.length === 0) {
            return;
        }

        setContentWidths((previous) => {
            const wider = grown.filter(
                ([id, width]) => width > (previous[id] ?? 0),
            );

            return wider.length === 0
                ? previous
                : { ...previous, ...Object.fromEntries(wider) };
        });
    }, [data, columns, tableWidth, contentWidths, isMobile]);

    const measureTable = useCallback((element: HTMLTableElement | null) => {
        tableRef.current = element;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver(([entry]) =>
            setTableWidth(entry.contentRect.width),
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);
    const columnVisibility = isMobile
        ? Object.fromEntries(
              columns
                  .filter(
                      (column) =>
                          (column.meta as CellMeta | undefined)?.hideOnMobile,
                  )
                  .map((column) => [column.id, false]),
          )
        : {};
    const sorting = controlledSorting ?? [];
    const isServerPaginated =
        pagination !== undefined && onPageChange !== undefined;

    const handleSortingChange = (
        updater: SortingState | ((old: SortingState) => SortingState),
    ) => {
        onSortingChange?.(
            typeof updater === 'function' ? updater(sorting) : updater,
        );
    };

    const tabsNav = tabs ? (
        <Tabs value={tabs.value} onValueChange={tabs.onChange}>
            <TabsList>
                {tabs.items.map((item) => (
                    <React.Fragment key={item.value}>
                        {item.dividerBefore && <TabsDivider />}
                        <TabsTrigger
                            value={item.value}
                            count={item.count}
                            countClassName={item.countClassName}
                            disabled={item.disabled}
                            asChild={!!item.href}
                        >
                            {item.href ? (
                                <Link href={item.href} prefetch>
                                    {item.label}
                                </Link>
                            ) : (
                                item.label
                            )}
                        </TabsTrigger>
                    </React.Fragment>
                ))}
            </TabsList>
        </Tabs>
    ) : null;

    const toggleFilter = () => {
        if (filterOpen && filter?.value) {
            filter.onChange('');
        }

        setFilterOpen(!filterOpen);
    };

    const filterToggle = filter ? (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={filterOpen ? 'Hide filter' : 'Show filter'}
            aria-pressed={filterOpen}
            onClick={toggleFilter}
            className={cn(
                'ml-auto size-8 text-muted-foreground',
                filterOpen && 'bg-accent text-accent-foreground',
            )}
        >
            <Filter />
        </Button>
    ) : null;

    const toolbar =
        tabsNav || toolbarStart || filterToggle ? (
            <div className="flex items-center gap-2">
                {tabsNav}
                {toolbarStart}
                {filterToggle}
            </div>
        ) : null;

    const rowSelection =
        controlledRowSelection ??
        (selectable ? internalRowSelection : undefined);

    const handleRowSelectionChange = (
        updater:
            | RowSelectionState
            | ((old: RowSelectionState) => RowSelectionState),
    ) => {
        const newSelection =
            typeof updater === 'function'
                ? updater(rowSelection ?? {})
                : updater;

        if (controlledRowSelection === undefined) {
            setInternalRowSelection(newSelection);
        }

        onRowSelectionChange?.(newSelection);
    };

    const table = useReactTable({
        data,
        columns: selectable
            ? [selectColumn<TData, TValue>(), ...columns]
            : columns,
        defaultColumn: {
            size: undefined,
            minSize: undefined,
            maxSize: undefined,
        },
        onSortingChange: handleSortingChange,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        ...(rowSelection !== undefined
            ? {
                  onRowSelectionChange: handleRowSelectionChange,
                  enableRowSelection: canSelectRow
                      ? (row: Row<TData>) => canSelectRow(row.original)
                      : true,
              }
            : {}),
        ...(getRowId ? { getRowId } : {}),
        state: {
            sorting,
            columnVisibility,
            ...(rowSelection !== undefined ? { rowSelection } : {}),
        },
        columnResizeMode: 'onChange',
    });

    const handleRowClick = (row: TData, rowId: string) => {
        if (renderExpandedRow) {
            setExpandedRowId((prev) => (prev === rowId ? null : rowId));
        } else if (onRowClick) {
            onRowClick(row);
        }
    };

    const currentPage = isServerPaginated ? pagination.current_page || 1 : 1;
    const lastPage = isServerPaginated
        ? pagination.last_page ||
          Math.ceil((pagination.total || 0) / (pagination.per_page || 15))
        : 1;
    const canPreviousPage = currentPage > 1;
    const canNextPage = currentPage < lastPage;

    const visibleColumns = table.getVisibleLeafColumns();
    const minTableWidth = visibleColumns.reduce(
        (total, column) => total + columnWidth(column, contentWidths),
        0,
    );
    // A flex column takes the slack itself. Only a table that sizes every one of its columns
    // needs the spacer, because `table-fixed` would otherwise spread the leftover over all of
    // them and none would land on its stated width.
    const spacerAt = visibleColumns.some(isFlexColumn)
        ? null
        : spacerIndex(visibleColumns);
    const columnCount = visibleColumns.length + (spacerAt === null ? 0 : 1);

    const handlePageNav = (page: number) => {
        if (isServerPaginated) {
            onPageChange(page, pagination.per_page || 15);
        }
    };

    const isEmpty = !loading && data.length === 0 && !!emptyState;

    const selectedRows = selectable
        ? table
              .getSelectedRowModel()
              .rows.filter((row) => row.getCanSelect())
              .map((row) => row.original)
        : [];

    const pageSelectableCount = selectable
        ? table.getRowModel().rows.filter((row) => row.getCanSelect()).length
        : 0;
    const wholePageSelected =
        selectedRows.length > 0 && selectedRows.length === pageSelectableCount;
    const totalRows = isServerPaginated ? pagination.total : data.length;
    const canSelectAllRows =
        selectAllRows && wholePageSelected && totalRows > selectedRows.length;
    const allSelected = canSelectAllRows && allRowsSelected;
    const selectedCount = allSelected ? totalRows : selectedRows.length;

    const clearSelection = () => {
        setAllRowsSelected(false);
        table.resetRowSelection(true);
    };

    const lockedSelectionIds = selectable
        ? table
              .getSelectedRowModel()
              .rows.filter((row) => !row.getCanSelect())
              .map((row) => row.id)
              .join(',')
        : '';

    useEffect(() => {
        if (lockedSelectionIds === '') {
            return;
        }

        table.setRowSelection((current) =>
            Object.fromEntries(
                Object.entries(current).filter(
                    ([id]) => !lockedSelectionIds.split(',').includes(id),
                ),
            ),
        );
    }, [lockedSelectionIds, table]);

    const bulkActionBar =
        bulkActions && !loading && !isEmpty && selectedRows.length > 0 ? (
            <BulkActionBar
                count={selectedCount}
                onClear={clearSelection}
                total={totalRows}
                onSelectAll={
                    canSelectAllRows && !allSelected
                        ? () => setAllRowsSelected(true)
                        : undefined
                }
            >
                {bulkActions({
                    rows: selectedRows,
                    allSelected,
                    count: selectedCount,
                    clearSelection,
                })}
            </BulkActionBar>
        ) : null;

    const loadingPanel = (
        <div className="flex flex-col items-center justify-center rounded-sm border border-table-border bg-card py-12">
            <Spinner className="text-muted-foreground" />
            {loadingLabel && (
                <p className="mt-4 text-sm text-muted-foreground">
                    Loading {loadingLabel}...
                </p>
            )}
        </div>
    );

    const tableElement = (
        <Table
            ref={measureTable}
            className="table-fixed"
            style={{ minWidth: minTableWidth }}
        >
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {withSpacer(
                            headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    data-column-id={header.column.id}
                                    style={columnStyle(
                                        header.column,
                                        contentWidths,
                                    )}
                                    className={cellClasses(
                                        header.column.columnDef.meta,
                                    )}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            )),
                            spacerAt,
                            <TableHead key="spacer" data-spacer aria-hidden />,
                        )}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                        const isClickable = !!onRowClick || !!renderExpandedRow;
                        const isExpanded = expandedRowId === row.id;

                        return (
                            <React.Fragment key={row.id}>
                                <TableRow
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    data-clickable={isClickable || undefined}
                                    data-expanded={isExpanded || undefined}
                                    className={cn(
                                        'group group/copy transition-colors',
                                        isClickable && 'cursor-pointer',
                                        rowClassName?.(row.original),
                                    )}
                                    onClick={() =>
                                        handleRowClick(row.original, row.id)
                                    }
                                    onMouseEnter={
                                        onRowHover
                                            ? () => onRowHover(row.original)
                                            : undefined
                                    }
                                >
                                    {withSpacer(
                                        row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                data-column-id={cell.column.id}
                                                style={columnStyle(
                                                    cell.column,
                                                    contentWidths,
                                                )}
                                                className={cellClasses(
                                                    cell.column.columnDef.meta,
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        )),
                                        spacerAt,
                                        <TableCell key="spacer" aria-hidden />,
                                    )}
                                </TableRow>
                                {isExpanded && renderExpandedRow && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columnCount}
                                            className="max-w-0 overflow-hidden p-0"
                                        >
                                            {renderExpandedRow(row.original)}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columnCount}
                            className="h-24 text-center"
                        >
                            No data available.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    const pager =
        lastPage > 1 &&
        (() => {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(lastPage, startPage + 4);

            const showFirst = startPage > 1;
            const showFirstEllipsis = startPage > 2;
            const showLast = endPage < lastPage;
            const showLastEllipsis = endPage < lastPage - 1;

            const pages = [];

            for (let page = startPage; page <= endPage; page++) {
                pages.push(page);
            }

            return (
                <div className="flex items-center justify-end space-x-2 px-1 py-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        handlePageNav(currentPage - 1)
                                    }
                                    className={
                                        !canPreviousPage
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>

                            {showFirst && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() => handlePageNav(1)}
                                            className="cursor-pointer"
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    {showFirstEllipsis && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                </>
                            )}

                            {pages.map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => handlePageNav(page)}
                                        isActive={page === currentPage}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {showLast && (
                                <>
                                    {showLastEllipsis && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink
                                            onClick={() =>
                                                handlePageNav(lastPage)
                                            }
                                            className="cursor-pointer"
                                        >
                                            {lastPage}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        handlePageNav(currentPage + 1)
                                    }
                                    className={
                                        !canNextPage
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            );
        })();

    const body = loading ? (
        <TableFrame>{loadingPanel}</TableFrame>
    ) : isEmpty ? (
        <EmptyState {...emptyState} />
    ) : (
        <TableFrame>{tableElement}</TableFrame>
    );

    return (
        <div className="flex flex-col gap-2">
            {toolbar}

            <div className="space-y-6">
                <div>
                    {filter && filterOpen ? (
                        <TableFrame>
                            <TableFilter
                                {...filter}
                                autoFocus={!filter.value}
                            />
                            {body}
                        </TableFrame>
                    ) : (
                        body
                    )}

                    {bulkActionBar}
                </div>

                {!loading && !isEmpty && pager}
            </div>
        </div>
    );
}
