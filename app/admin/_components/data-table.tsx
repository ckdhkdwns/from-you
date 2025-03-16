'use client';

import React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

import { Separator } from '@/components/ui/separator';

// 선택 액션 타입 정의
type SelectionAction<TData> =
    | {
          type: 'button';
          label: string;
          onClick: (_selectedRows: TData[]) => void;
      }
    | {
          type: 'component';
          render: (_selectedRows: TData[]) => React.ReactNode;
      };

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (_row: TData) => void;
    searchField?: string[];
    searchPlaceholder?: string;
    actions?: React.ReactNode[];
    onSelectedRowsChange?: (_rows: TData[]) => void;
    showCheckbox?: boolean;
    selectionActions?: SelectionAction<TData>[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onRowClick,
    searchField,
    searchPlaceholder = '검색...',
    actions,
    onSelectedRowsChange,
    showCheckbox = true,
    selectionActions,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pageSize, setPageSize] = useState<number>(50);
    const [rowSelection, setRowSelection] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [previousSelection, setPreviousSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageSize: pageSize,
                pageIndex: 0,
            },
            globalFilter: searchValue,
        },
        onSortingChange: setSorting,
        enableRowSelection: showCheckbox,
        onGlobalFilterChange: setSearchValue,
        globalFilterFn: (row, columnId, filterValue) => {
            if (!searchField || !filterValue) return true;

            const searchTermLower = filterValue.toLowerCase();

            // 모든 검색 필드에 대해 검색
            return searchField.some(field => {
                const value = String(row.getValue(field) || '').toLowerCase();
                return value.includes(searchTermLower);
            });
        },
    });

    useEffect(() => {
        // 실제로 선택 상태가 변경된 경우에만 onSelectedRowsChange 호출
        if (
            onSelectedRowsChange &&
            JSON.stringify(rowSelection) !== JSON.stringify(previousSelection)
        ) {
            const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
            onSelectedRowsChange(selectedRows);
            setPreviousSelection(rowSelection);
        }
    }, [rowSelection, onSelectedRowsChange, table, previousSelection]);

    return (
        <div>
            <div
                className={`flex items-center justify-between py-4 gap-4 ${
                    data &&
                    data.length < 10 &&
                    (!searchField || searchField.length === 0) &&
                    !actions &&
                    !selectionActions
                        ? 'hidden'
                        : ''
                }`}
            >
                <div className="flex items-center gap-2">
                    {showCheckbox && table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-medium">
                                {table.getFilteredSelectedRowModel().rows.length}개 선택됨
                            </div>

                            {selectionActions && selectionActions.length > 0 && (
                                <div className="flex items-center gap-2">
                                    {selectionActions.map((action, index) => {
                                        const selectedRows = table
                                            .getFilteredSelectedRowModel()
                                            .rows.map(row => row.original);

                                        if (action.type === 'component') {
                                            return (
                                                <React.Fragment key={index}>
                                                    {action.render(selectedRows)}
                                                </React.Fragment>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                onClick={() => action.onClick(selectedRows)}
                                            >
                                                {action.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.resetRowSelection()}
                                >
                                    선택 해제
                                </Button> */}
                            <Separator orientation="vertical" className="h-4 mr-2" />
                        </div>
                    )}
                    {searchField && searchField.length > 0 && (
                        <div className="flex items-center gap-2">
                            <input
                                placeholder={searchPlaceholder}
                                value={(table.getState().globalFilter as string) ?? ''}
                                onChange={event => {
                                    table.setGlobalFilter(event.target.value);
                                }}
                                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-none ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                            />
                        </div>
                    )}
                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions.map((action, index) => (
                                <div key={index}>{action}</div>
                            ))}
                        </div>
                    )}
                </div>

                {data && data.length > 10 && (
                    <div className="flex items-center gap-2 ml-auto">
                        <Select
                            value={pageSize.toString()}
                            onValueChange={value => {
                                setPageSize(Number(value));
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-9 w-[140px] border-gray-300">
                                <SelectValue placeholder="페이지당 항목 수" />
                            </SelectTrigger>
                            <SelectContent>
                                {data.length > 10 && (
                                    <SelectItem value="10">10개씩 보기</SelectItem>
                                )}
                                {data.length > 50 && (
                                    <SelectItem value="50">50개씩 보기</SelectItem>
                                )}
                                {data.length > 100 && (
                                    <SelectItem value="100">100개씩 보기</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {showCheckbox && (
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                table.getIsAllPageRowsSelected()
                                                    ? true
                                                    : table.getIsSomePageRowsSelected()
                                                      ? 'indeterminate'
                                                      : false
                                            }
                                            onCheckedChange={value =>
                                                table.toggleAllPageRowsSelected(!!value)
                                            }
                                            aria-label="전체 선택"
                                        />
                                    </TableHead>
                                )}
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-center"
                                            onClick={
                                                header.column.getCanSort()
                                                    ? header.column.getToggleSortingHandler()
                                                    : undefined
                                            }
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext(),
                                                      )}
                                                {header.column.getCanSort() && (
                                                    <div className="ml-1">
                                                        {{
                                                            asc: <ChevronUp className="h-4 w-4" />,
                                                            desc: (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ),
                                                        }[
                                                            header.column.getIsSorted() as string
                                                        ] ?? (
                                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className={
                                        onRowClick
                                            ? 'cursor-pointer hover:bg-gray-50'
                                            : 'hover:bg-gray-50'
                                    }
                                >
                                    {showCheckbox && (
                                        <TableCell
                                            className="w-12"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <Checkbox
                                                checked={row.getIsSelected()}
                                                onCheckedChange={value =>
                                                    row.toggleSelected(!!value)
                                                }
                                                aria-label="행 선택"
                                            />
                                        </TableCell>
                                    )}
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className="text-center"
                                            onClick={() => onRowClick && onRowClick(row.original)}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={showCheckbox ? columns.length + 1 : columns.length}
                                    className="h-24 text-center"
                                >
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    총 {table.getFilteredRowModel().rows.length}개의 항목
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        이전
                    </Button>
                    <div className="text-sm font-medium">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        다음
                    </Button>
                </div>
            </div>
        </div>
    );
}
