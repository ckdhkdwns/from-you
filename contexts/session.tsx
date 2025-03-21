'use client';

import { Session } from 'next-auth';
import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, getUserAddresses } from '@/models/actions/user-actions';
import { AddressPublic } from '@/models/types/address';
import { Provider } from '@/models/types/user';
import { UserPublic } from '@/models/types/user';

type UserData = {
    id: string;
    name: string;
    provider: Provider;
    point: number;
    createdAt: string;
};

type UserContextType = {
    userData: UserData | null;
    isLoading: boolean;
    error: Error | null;
    refreshUserData: () => Promise<void>;
    addresses: {
        recipient: AddressPublic[];
        sender: AddressPublic[];
    };
};

const UserContext = createContext<UserContextType>({
    userData: null,
    isLoading: false,
    error: null,
    refreshUserData: async () => {},
    addresses: {
        recipient: [],
        sender: [],
    },
});

export const useUserData = () => useContext(UserContext);

function UserDataProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [addresses, setAddresses] = useState<{
        recipient: AddressPublic[];
        sender: AddressPublic[];
    }>({
        recipient: [],
        sender: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserData = async () => {
        if (!session?.user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const { data: userResponse, success } = await getCurrentUser();

            if (!success) {
                return;
            }

            // 타입 변환을 통해 UserPublic을 UserData로 변환
            const userData: UserData = {
                id: userResponse.email, // 또는 적절한 ID 필드
                name: userResponse.name,
                provider: userResponse.provider,
                point: userResponse.point,
                createdAt: userResponse.createdAt,
            };

            setUserData(userData);

            const recipientAddressesResponse = await getUserAddresses('recipient');
            const senderAddressesResponse = await getUserAddresses('sender');

            setAddresses({
                recipient: recipientAddressesResponse.data,
                sender: senderAddressesResponse.data,
            });
        } catch (err) {
            console.error('사용자 데이터 로드 실패:', err);
            setError(
                err instanceof Error
                    ? err
                    : new Error('사용자 데이터를 가져오는 중 오류가 발생했습니다.'),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUserData = async () => {
        await fetchUserData();
    };

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            if (session.user.name && session.user.provider) {
                const sessionUserData: UserData = {
                    id: session.user.id,
                    name: session.user.name,
                    provider: session.user.provider,
                    point: session.user.point || 0,
                    createdAt: session.user.createdAt || new Date().toISOString(),
                };
                setUserData(sessionUserData);
            }

            // 추가 데이터 가져오기
            fetchUserData();
        } else if (status === 'unauthenticated') {
            setUserData(null);
            setAddresses({ recipient: [], sender: [] });
        }
    }, [session, status]);

    return (
        <UserContext.Provider
            value={{
                userData,
                isLoading,
                error,
                refreshUserData: fetchUserData,
                addresses,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

type AuthSessionProps = {
    session?: Session | null;
    children: ReactNode;
};

const AuthSession = ({ session, children }: AuthSessionProps) => {
    return (
        <SessionProvider session={session}>
            <UserDataProvider>{children}</UserDataProvider>
        </SessionProvider>
    );
};

export default AuthSession;
