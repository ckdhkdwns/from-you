'use client';

import { updateSelectedUsersBlocked, updateUserPoint } from '@/models/actions/user-actions';
import { UserPublic } from '@/models/types/user';
import { isSuccessResponse } from '@/models/types/response';
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface UsersProviderProps {
    children: React.ReactNode;
    initialUsers: UserPublic[];
}

const UsersContext = createContext<{
    users: UserPublic[];
    setUsers: (_users: UserPublic[]) => void;
    handlePointUpdate: (_user: UserPublic, _point: number) => void;
    handleBlockUser: (_selectedRows: UserPublic[], _blocked: boolean) => void;
}>({
    users: [],
    setUsers: () => {},
    handlePointUpdate: () => {},
    handleBlockUser: () => {},
});

export default function UsersProvider({ children, initialUsers }: UsersProviderProps) {
    const [users, setUsers] = useState<UserPublic[]>(initialUsers);

    const handlePointUpdate = async (user: UserPublic, point: number) => {
        try {
            const response = await updateUserPoint(user.PK, point, user.point);

            if (isSuccessResponse(response)) {
                const updatedUser = response.data;

                toast.success('포인트가 성공적으로 업데이트되었습니다.');
                setUsers(users.map(u => (u.PK === user.PK ? updatedUser : u)));
            } else {
                toast.error(response.error?.message || '포인트 업데이트 중 오류가 발생했습니다.');
            }
        } catch (error) {
            toast.error('포인트 업데이트 중 오류가 발생했습니다.');
            console.error(error);
        }
    };

    const handleBlockUser = async (selectedRows: UserPublic[], blocked: boolean) => {
        try {
            const response = await updateSelectedUsersBlocked(
                selectedRows.map(user => user.PK),
                blocked,
            );

            if (isSuccessResponse(response)) {
                toast.success(
                    `${selectedRows.length}명의 사용자가 ${
                        blocked ? '비활성화' : '활성화'
                    }되었습니다.`,
                );

                const updatedUsers = response.data;
                if (updatedUsers && Array.isArray(updatedUsers)) {
                    setUsers(prevUsers => {
                        return prevUsers.map(user => {
                            const updatedUser = updatedUsers.find(u => u.PK === user.PK);
                            return updatedUser || user;
                        });
                    });
                }
            } else {
                toast.error(
                    response.error?.message ||
                        `사용자 ${blocked ? '비활성화' : '활성화'} 중 오류가 발생했습니다.`,
                );
            }
        } catch (error) {
            toast.error('사용자 비활성화 중 오류가 발생했습니다.');
            console.error(error);
        }
    };

    return (
        <UsersContext.Provider
            value={{
                users,
                setUsers,
                handlePointUpdate,
                handleBlockUser,
            }}
        >
            {children}
        </UsersContext.Provider>
    );
}

export const useUsersContext = () => {
    return useContext(UsersContext);
};
