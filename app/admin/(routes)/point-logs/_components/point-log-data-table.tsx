'use client';

import { DataTable } from '../../../_components/data-table';
import { columns } from './columns';
import { usePointLogContext } from '../_contexts/point-log-provider';
import TextLoader from '@/components/ui/text-loader';
import { PointLogPublic } from '@/models/types/point-log';
import { ColumnDef } from '@tanstack/react-table';

interface PointLogDataTableProps<TData = PointLogPublic> {
    data?: TData[];
    isLoading?: boolean;
    customColumns?: ColumnDef<TData>[];
    searchField?: string[];
    searchPlaceholder?: string;
    showCheckbox?: boolean;
    onRowClick?: (_row: TData) => void;
    loadingText?: string;
}

export default function PointLogDataTable<TData = PointLogPublic>({
    data,
    isLoading,
    customColumns,
    searchField = ['user.PK', 'reason'],
    searchPlaceholder = '포인트 내역 검색...',
    showCheckbox = true,
    onRowClick,
    loadingText = '포인트 내역을 불러오고 있습니다...',
}: PointLogDataTableProps<TData>) {
    // 기본 컨텍스트 사용 (제공된 데이터가 없는 경우)
    const pointLogContext = usePointLogContext();

    // props로 받은 값이 없는 경우 컨텍스트에서 가져옴
    const pointLogs = data || pointLogContext.pointLogs;
    const loading = isLoading !== undefined ? isLoading : pointLogContext.isLoading;
    const tableColumns = (customColumns || columns) as ColumnDef<TData>[];

    if (loading) {
        return <TextLoader text={loadingText} className="mt-24" />;
    }

    return (
        <div>
            <DataTable
                columns={tableColumns}
                data={(pointLogs || []) as TData[]}
                searchField={searchField}
                searchPlaceholder={searchPlaceholder}
                showCheckbox={showCheckbox}
                onRowClick={onRowClick}
            />
        </div>
    );
}
