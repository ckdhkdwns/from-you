'use client';

import { createContext, useContext, useState } from 'react';
import { getLettersByDateAction } from '@/models/actions/letter-actions';
import { LetterPublic } from '@/models/types/letter';
import { UserPublic } from '@/models/types/user';
import { getUsersByDateAction } from '@/models/actions/user-actions';

export type ActiveTabType = 'daily' | 'monthly' | 'calendar';

interface StatisticsContextType {
    letters: LetterPublic[];
    users: UserPublic[];
    activeTab: ActiveTabType;
    selectedDate: string;
    setActiveTab: (_tab: ActiveTabType) => void;
    setSelectedDate: (_date: string) => void;
    isLoading: boolean;
    refreshData: () => Promise<void>;
}

interface StatisticsProviderProps {
    children: React.ReactNode;
    initialLetters?: LetterPublic[];
    initialUsers?: UserPublic[];
}

const StatisticsContext = createContext<StatisticsContextType>({
    letters: [],
    users: [],
    activeTab: 'daily',
    selectedDate: new Date().toISOString().split('T')[0],
    setActiveTab: () => {},
    setSelectedDate: () => {},
    isLoading: false,
    refreshData: async () => {},
});

export const StatisticsProvider = ({
    children,
    initialLetters = [],
    initialUsers = [],
}: StatisticsProviderProps) => {
    const [activeTab, setActiveTab] = useState<ActiveTabType>('daily');
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0],
    );
    const [letters, setLetters] = useState<LetterPublic[]>(initialLetters);
    const [users, setUsers] = useState<UserPublic[]>(initialUsers);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLetters = async () => {
        // 캘린더 탭에서는 월별 데이터를 가져옵니다
        const isMonthView = activeTab === 'monthly' || activeTab === 'calendar';
        const dateParam = isMonthView
            ? selectedDate.substring(0, 7) // YYYY-MM 형식으로 전달
            : selectedDate; // YYYY-MM-DD 형식으로 전달

        const response = await getLettersByDateAction(dateParam);
        if (response.success) {
            setLetters(response.data);
        }
    };

    const fetchUsers = async () => {
        // 캘린더 탭에서는 월별 데이터를 가져옵니다
        const isMonthView = activeTab === 'monthly' || activeTab === 'calendar';
        const dateParam = isMonthView
            ? selectedDate.substring(0, 7) // YYYY-MM 형식으로 전달
            : selectedDate; // YYYY-MM-DD 형식으로 전달

        const response = await getUsersByDateAction(dateParam);
        if (response.success) {
            setUsers(response.data);
        }
    };

    const refreshData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchLetters(), fetchUsers()]);
        } finally {
            setIsLoading(false);
        }
    };

    // 탭이나 날짜 변경 시 handleDateChange에서 수동으로 refreshData 호출이 필요합니다

    return (
        <StatisticsContext.Provider
            value={{
                letters,
                users,
                activeTab,
                selectedDate,
                setActiveTab,
                setSelectedDate,
                isLoading,
                refreshData,
            }}
        >
            {children}
        </StatisticsContext.Provider>
    );
};

export const useStatistics = () => {
    const context = useContext(StatisticsContext);
    if (!context) {
        throw new Error('useStatistics must be used within a StatisticsProvider');
    }
    return context;
};
