'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PopupPublic } from '@/models/types/popup';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 형식화 유틸리티 함수
const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), 'yyyy년 MM월 dd일', {
            locale: ko,
        });
    } catch {
        return dateString;
    }
};

// 팝업 활성 상태 확인 유틸리티 함수
const isActive = (popup: PopupPublic) => {
    const now = new Date();
    const startDate = new Date(popup.startDate);
    const endDate = new Date(popup.endDate);
    return startDate <= now && now <= endDate;
};

export const columns: ColumnDef<PopupPublic>[] = [
    {
        accessorKey: 'image',
        header: '이미지',
        cell: ({ row }) => (
            <div className="relative w-20 h-20 overflow-hidden rounded-md mx-auto">
                <Image src={row.original.image} alt="팝업 이미지" fill className="object-cover" />
            </div>
        ),
    },
    {
        accessorKey: 'startDate',
        header: '시작일',
        cell: ({ row }) => formatDate(row.original.startDate),
    },
    {
        accessorKey: 'endDate',
        header: '종료일',
        cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
        accessorKey: 'status',
        header: '상태',
        cell: ({ row }) => (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive(row.original)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
            >
                {isActive(row.original) ? '활성' : '비활성'}
            </span>
        ),
    },
];
