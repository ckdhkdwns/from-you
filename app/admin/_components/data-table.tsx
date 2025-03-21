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
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TextLoader from '@/components/ui/text-loader';

// 타입 정의
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

type Action =
    | {
          label: string;
          onClick: () => void;
          type: 'button';
          icon?: React.ReactNode;
      }
    | {
          label: string;
          render: () => React.ReactNode;
          type: 'component';
      };

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (_row: TData) => void;
    searchField?: string[];
    searchPlaceholder?: string;
    actions?: Action[];
    onSelectedRowsChange?: (_rows: TData[]) => void;
    showCheckbox?: boolean;
    selectionActions?: SelectionAction<TData>[];
    storageKey?: string;
}

// 테이블 로직을 위한 커스텀 훅
function useDataTable<TData, TValue>({
    data,
    columns,
    searchField,
    onSelectedRowsChange,
    showCheckbox = true,
    storageKey,
}: Pick<
    DataTableProps<TData, TValue>,
    'data' | 'columns' | 'searchField' | 'onSelectedRowsChange' | 'showCheckbox' | 'storageKey'
> & { storageKey?: string }) {
    // 기본 페이지 크기
    const defaultPageSize = 10;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [rowSelection, setRowSelection] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [previousSelection, setPreviousSelection] = useState({});
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const updatePageSize = (newSize: number) => {
        setPageSize(newSize);

        if (storageKey && typeof window !== 'undefined') {
            try {
                localStorage.setItem(
                    `${process.env.NEXT_PUBLIC_LOCAL_STORAGE_KEY_PREFIX}table_page_size_${storageKey}`,
                    newSize.toString(),
                );
            } catch (error) {
                console.error('로컬 스토리지에 페이지 크기 저장 실패:', error);
            }
        }
    };

    // 테이블 인스턴스 생성
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
                pageSize,
                pageIndex,
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
        manualPagination: true,
    });

    // 초기화 및 로컬 스토리지에서 페이지 크기 불러오기
    useEffect(() => {
        if (typeof window !== 'undefined' && storageKey) {
            try {
                const storedValue = localStorage.getItem(
                    `${process.env.NEXT_PUBLIC_LOCAL_STORAGE_KEY_PREFIX}table_page_size_${storageKey}`,
                );
                if (storedValue) {
                    const parsedSize = parseInt(storedValue, 10);
                    setPageSize(parsedSize || defaultPageSize);
                }
            } catch (error) {
                console.error('로컬 스토리지에서 페이지 크기 불러오기 실패:', error);
                setPageSize(defaultPageSize);
            }
        }

        setIsInitialized(true);
    }, [storageKey, defaultPageSize]);

    // 검색어/데이터가 변경될 때만 페이지 인덱스 초기화
    // 초기화 후에만 실행되도록 함
    useEffect(() => {
        if (isInitialized && table) {
            setPageIndex(0);
            table.setPageIndex(0);
        }
    }, [searchValue, table, isInitialized]);

    // 선택 상태 변경 감지
    useEffect(() => {
        if (
            onSelectedRowsChange &&
            JSON.stringify(rowSelection) !== JSON.stringify(previousSelection)
        ) {
            const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
            onSelectedRowsChange(selectedRows);
            setPreviousSelection(rowSelection);
        }
    }, [rowSelection, onSelectedRowsChange, table, previousSelection]);

    return {
        table,
        pageSize,
        updatePageSize,
        pageIndex,
        setPageIndex,
        searchValue,
        setSearchValue,
        isInitialized,
    };
}

// 테이블 헤더 컴포넌트
const DataTableHeader = ({ table, showCheckbox }) => (
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
                            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="전체 선택"
                        />
                    </TableHead>
                )}
                {headerGroup.headers.map(header => (
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
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                                <div className="ml-1">
                                    {{
                                        asc: <ChevronUp className="h-4 w-4" />,
                                        desc: <ChevronDown className="h-4 w-4" />,
                                    }[header.column.getIsSorted() as string] ?? (
                                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                    )}
                                </div>
                            )}
                        </div>
                    </TableHead>
                ))}
            </TableRow>
        ))}
    </TableHeader>
);

// 테이블 바디 컴포넌트
const DataTableBody = ({ table, columns, showCheckbox, onRowClick }) => {
    // 현재 페이지에 표시할 행
    const paginatedRows = table.getRowModel().rows;

    return (
        <TableBody>
            {paginatedRows.length ? (
                paginatedRows.map(row => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn('hover:bg-gray-50', onRowClick && 'cursor-pointer')}
                    >
                        {showCheckbox && (
                            <TableCell className="w-12" onClick={e => e.stopPropagation()}>
                                <Checkbox
                                    checked={row.getIsSelected()}
                                    onCheckedChange={value => row.toggleSelected(!!value)}
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
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    );
};

// 페이지 크기 옵션 계산 함수
const getPageSizeOptions = (dataLength: number) => {
    // 기본 페이지 크기 옵션
    const baseOptions = [5, 10, 20, 50, 100];

    // 데이터 길이보다 작은 옵션만 반환
    return baseOptions.filter(size => dataLength >= size);
};

// 테이블 툴바 컴포넌트
const DataTableToolbar = ({
    table,
    searchField,
    searchPlaceholder,
    actions,
    data,
    pageSize,
    pageIndex,
    setPageIndex,
    selectionActions,
    showCheckbox,
    updatePageSize,
}) => {
    const shouldShowToolbar =
        data &&
        (data.length >= 5 ||
            (searchField && searchField.length > 0) ||
            actions ||
            selectionActions);

    if (!shouldShowToolbar) return null;

    return (
        <div className="flex items-center justify-between py-4 gap-4">
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
                                            size="sm"
                                            variant="outline"
                                            onClick={() => action.onClick(selectedRows)}
                                        >
                                            {action.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}
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
                            <Button
                                key={index}
                                size="sm"
                                variant="default"
                                onClick={() => action.type === 'button' && action.onClick()}
                            >
                                {action.type === 'button' && action.icon && action.icon}
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {data && data.length > 5 && (
                <div className="flex items-center gap-2 ml-auto">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 text-xs border-gray-300 flex justify-between items-center"
                            >
                                {pageSize}개씩 보기
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {getPageSizeOptions(data.length).map(size => (
                                <DropdownMenuItem
                                    key={size}
                                    onClick={() => updatePageSize(size)}
                                    className={`text-xs cursor-pointer ${
                                        pageSize === size ? 'bg-gray-100 font-medium' : ''
                                    }`}
                                >
                                    {size}개씩 보기
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

// 테이블 페이지네이션 컴포넌트
const DataTablePagination = ({ table, pageIndex, pageSize }) => {
    const totalItems = table.getFilteredRowModel().rows.length;
    const currentPage = pageIndex + 1;
    const totalPages = table.getPageCount();

    if (totalItems === 0) return null;

    // 페이지 이동 핸들러
    const handlePrevPage = () => {
        if (!table.getCanPreviousPage()) return;
        const newPageIndex = Math.max(0, pageIndex - 1);
        table.setPageIndex(newPageIndex);
    };

    const handleNextPage = () => {
        if (!table.getCanNextPage()) return;
        const newPageIndex = Math.min(totalPages - 1, pageIndex + 1);
        table.setPageIndex(newPageIndex);
    };

    return (
        <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">총 {totalItems}개의 항목</div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!table.getCanPreviousPage()}
                >
                    이전
                </Button>
                <div className="text-sm font-medium">
                    {currentPage} / {totalPages || 1}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!table.getCanNextPage()}
                >
                    다음
                </Button>
            </div>
        </div>
    );
};

// 메인 데이터 테이블 컴포넌트
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
    storageKey,
}: DataTableProps<TData, TValue>) {
    const { table, pageSize, pageIndex, setPageIndex, updatePageSize, isInitialized } =
        useDataTable({
            data,
            columns,
            searchField,
            onSelectedRowsChange,
            showCheckbox,
            storageKey: storageKey,
        });

    if (!isInitialized)
        return (
            <div className="mt-24">
                <TextLoader text="데이터를 불러오고 있습니다..." />
            </div>
        );
    return (
        <div>
            <DataTableToolbar
                table={table}
                searchField={searchField}
                searchPlaceholder={searchPlaceholder}
                actions={actions}
                data={data}
                pageSize={pageSize}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                selectionActions={selectionActions}
                showCheckbox={showCheckbox}
                updatePageSize={updatePageSize}
            />

            <div className="rounded-md border">
                <Table>
                    <DataTableHeader table={table} showCheckbox={showCheckbox} />
                    <DataTableBody
                        table={table}
                        columns={columns}
                        showCheckbox={showCheckbox}
                        onRowClick={onRowClick}
                    />
                </Table>
            </div>

            <DataTablePagination table={table} pageIndex={pageIndex} pageSize={pageSize} />
        </div>
    );
}
