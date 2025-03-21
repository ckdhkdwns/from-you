'use client';

import { updateSelectedUsersBlocked, updateUserPoint } from '@/models/actions/user-actions';
import { UserPublic } from '@/models/types/user';
import React, { createContext, useContext, useState } from 'react';
import { apiHandler } from '@/lib/api-utils';

interface UsersProviderProps {
    children: React.ReactNode;
    initialUsers: UserPublic[];
}

const UsersContext = createContext<{
    users: UserPublic[];
    setUsers: (_users: UserPublic[]) => void;
    handlePointUpdate: (_user: UserPublic, _point: number) => void;
    handleBlockUser: (_selectedRows: UserPublic[], _blocked: boolean) => void;
    selectedUser: UserPublic | null;
    isDialogOpen: boolean;
    setSelectedUser: (_user: UserPublic | null) => void;
    setIsDialogOpen: (_open: boolean) => void;
    openUserDialog: (_user: UserPublic) => void;
}>({
    users: [],
    setUsers: () => {},
    handlePointUpdate: () => {},
    handleBlockUser: () => {},
    selectedUser: null,
    isDialogOpen: false,
    setSelectedUser: () => {},
    setIsDialogOpen: () => {},
    openUserDialog: () => {},
});

export default function UsersProvider({ children, initialUsers }: UsersProviderProps) {
    const [users, setUsers] = useState<UserPublic[]>(initialUsers);
    const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openUserDialog = (user: UserPublic) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handlePointUpdate = (user: UserPublic, point: number) => 
        apiHandler(
            () => updateUserPoint(user.PK, point, user.point),
            updatedUser => setUsers(users.map(u => u.PK === user.PK ? updatedUser : u)),
            {
                success: '포인트가 성공적으로 업데이트되었습니다.',
                error: '포인트 업데이트 중 오류가 발생했습니다.'
            }
        );

    const handleBlockUser = (selectedRows: UserPublic[], blocked: boolean) => 
        apiHandler(
            () => updateSelectedUsersBlocked(
                selectedRows.map(user => user.PK),
                blocked
            ),
            updatedUsers => {
                if (!Array.isArray(updatedUsers)) return;
                
                const updatedMap = new Map(updatedUsers.map(user => [user.PK, user]));
                
                setUsers(prevUsers => prevUsers.map(
                    user => updatedMap.get(user.PK) || user
                ));
            },
            {
                success: `${selectedRows.length}명의 사용자가 ${blocked ? '비활성화' : '활성화'}되었습니다.`,
                error: `사용자 ${blocked ? '비활성화' : '활성화'} 중 오류가 발생했습니다.`
            }
        );

    return (
        <UsersContext.Provider
            value={{
                users,
                setUsers,
                handlePointUpdate,
                handleBlockUser,
                selectedUser,
                isDialogOpen,
                setSelectedUser,
                setIsDialogOpen,
                openUserDialog,
            }}
        >
            {children}
        </UsersContext.Provider>
    );
}

export const useUsersContext = () => useContext(UsersContext);
