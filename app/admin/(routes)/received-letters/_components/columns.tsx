import { parseDateToRelative } from '@/lib/date';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { ReceivedLetterPublic } from '@/models/types/received-letter';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<ReceivedLetterPublic>[] = [
    {
        header: '받는 사람 ID',
        accessorKey: 'user',
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? removeTableKeyPrefix(user.PK) : '-';
        },
    },
    {
        header: '받는 사람 이름',
        accessorKey: 'user.name',
        cell: ({ row }) => {
            const user = row.original.user;
            return user ? user.name : '-';
        },
    },
    {
        header: '보내는 사람 이름',
        accessorKey: 'senderName',
    },
    {
        header: '등록일시',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
            const date = row.original.createdAt;
            return date ? parseDateToRelative(date) : '-';
        },
    },
];
