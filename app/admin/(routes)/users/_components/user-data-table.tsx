'use client';

import { useState } from 'react';
import { DataTable } from '@/app/admin/_components/data-table';
import { columns } from './columns';
import { UserPublic } from '@/models/types/user';
import { UserDialog } from './user-dialog';
import { useUsersContext } from '../_contexts/users-provider';

export default function UserDataTable() {
    const { users, handleBlockUser } = useUsersContext();
    const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (row: UserPublic) => {
        setSelectedUser(row);
        setIsDialogOpen(true);
    };

    return (
        <>
            <DataTable
                columns={columns}
                data={users}
                onRowClick={handleRowClick}
                searchField={['name', 'email', 'userId']}
                searchPlaceholder="사용자 검색..."
                selectionActions={[
                    {
                        label: '사용자 차단',
                        onClick: (selectedRows: UserPublic[]) => {
                            handleBlockUser(selectedRows, true);
                        },
                        type: 'button',
                    },
                    {
                        label: '사용자 활성화',
                        onClick: (selectedRows: UserPublic[]) => {
                            handleBlockUser(selectedRows, false);
                        },
                        type: 'button',
                    },
                ]}
            />

            {selectedUser && (
                <UserDialog
                    user={selectedUser}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            )}
        </>
    );
}
