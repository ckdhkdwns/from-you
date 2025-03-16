"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { PointLogPublic } from "@/models/types/point-log";
import { getMyPointLogsAction } from "@/models/actions/point-action";

interface PointLogContextType {
    pointLogs: PointLogPublic[];
    isLoading: boolean;
    error: string | null;
    refreshPointLogs: () => Promise<void>;
}

const PointLogContext = createContext<PointLogContextType | undefined>(
    undefined
);

export function usePointLog() {
    const context = useContext(PointLogContext);
    if (context === undefined) {
        throw new Error("usePointLog must be used within a PointLogProvider");
    }
    return context;
}

interface PointLogProviderProps {
    children: ReactNode;
    initialPointLogs?: PointLogPublic[];
}

export function PointLogProvider({ children, initialPointLogs = [] }: PointLogProviderProps) {
    const [pointLogs, setPointLogs] = useState<PointLogPublic[]>(initialPointLogs);
    const [isLoading, setIsLoading] = useState<boolean>(initialPointLogs.length === 0);
    const [error, setError] = useState<string | null>(null);

    const fetchPointLogs = async () => {
        // 초기 데이터가 있으면 fetch하지 않음
        if (initialPointLogs.length > 0 && pointLogs.length === initialPointLogs.length) {
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            const response = await getMyPointLogsAction();

            if (response.success) {
                // 날짜 기준으로 내림차순 정렬 (최신순)
                const sortedLogs = [...response.data].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                setPointLogs(sortedLogs);
            } else {
                setError("포인트 내역을 불러오는데 실패했습니다.");
            }
        } catch (err) {
            setError("포인트 내역을 불러오는 중 오류가 발생했습니다.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (initialPointLogs.length === 0) {
            fetchPointLogs();
        }
    }, []);

    const refreshPointLogs = async () => {
        await fetchPointLogs();
    };

    const value = {
        pointLogs,
        isLoading,
        error,
        refreshPointLogs,
    };

    return (
        <PointLogContext.Provider value={value}>
            {children}
        </PointLogContext.Provider>
    );
}
