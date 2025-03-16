'use client';

import { PointLogPublic } from '@/models/types/point-log';
import { createContext, useContext, useState } from 'react';

export const PointLogContext = createContext<PointLogContextType>({
    pointLogs: [],
    setPointLogs: () => {},
    isLoading: false,
});

interface PointLogContextType {
    pointLogs: PointLogPublic[];
    setPointLogs: (_pointLogs: PointLogPublic[]) => void;
    isLoading: boolean;
}

interface PointLogProviderProps {
    children: React.ReactNode;
    initialPointLogs: PointLogPublic[];
}

export const PointLogProvider = ({ children, initialPointLogs }: PointLogProviderProps) => {
    const [pointLogs, setPointLogs] = useState<PointLogPublic[]>(initialPointLogs);
    const [isLoading, _setIsLoading] = useState(false);

    return (
        <PointLogContext.Provider value={{ pointLogs, setPointLogs, isLoading }}>
            {children}
        </PointLogContext.Provider>
    );
};

export const usePointLogContext = () => {
    const context = useContext(PointLogContext);
    if (!context) {
        throw new Error('usePointLogContext must be used within a PointLogProvider');
    }
    return context;
};
