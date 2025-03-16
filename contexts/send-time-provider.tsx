'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SendTimeConfigPublic } from '@/models/types/send-time-config';
import { saveSendTimeConfigAction } from '@/models/actions/config-actions';

interface SendTimeContextType {
    sendTimeConfig: SendTimeConfigPublic;
    updateSendTimeConfig: (config: SendTimeConfigPublic) => void;
    updateDaySchedule: (day: keyof SendTimeConfigPublic, enabled: boolean, time: string) => void;
    saveSendTimeConfig: () => Promise<void>;
    isSaving: boolean;
    error: string | null;
}

const SendTimeContext = createContext<SendTimeContextType | undefined>(undefined);

interface SendTimeProviderProps {
    children: ReactNode;
    initialSendTimeConfig: SendTimeConfigPublic;
}

export function SendTimeProvider({ children, initialSendTimeConfig }: SendTimeProviderProps) {
    const [sendTimeConfig, setSendTimeConfig] =
        useState<SendTimeConfigPublic>(initialSendTimeConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateSendTimeConfig = (config: SendTimeConfigPublic) => {
        setSendTimeConfig(config);
    };

    const updateDaySchedule = (day: keyof SendTimeConfigPublic, enabled: boolean, time: string) => {
        if (
            day === '일' ||
            day === '월' ||
            day === '화' ||
            day === '수' ||
            day === '목' ||
            day === '금' ||
            day === '토'
        ) {
            setSendTimeConfig(prev => ({
                ...prev,
                [day]: {
                    enabled,
                    time,
                },
            }));
        }
    };

    const saveSendTimeConfig = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await saveSendTimeConfigAction(sendTimeConfig);

            if (response.error) {
                setError(response.error.message || '알 수 없는 오류가 발생했습니다.');
            } else if (response.data) {
                setSendTimeConfig(response.data);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : '발송 시간 설정 저장 중 오류가 발생했습니다.',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const value = {
        sendTimeConfig,
        updateSendTimeConfig,
        updateDaySchedule,
        saveSendTimeConfig,
        isSaving,
        error,
    };

    return <SendTimeContext.Provider value={value}>{children}</SendTimeContext.Provider>;
}

export function useSendTime() {
    const context = useContext(SendTimeContext);

    if (context === undefined) {
        throw new Error('useSendTime은 SendTimeProvider 내부에서만 사용할 수 있습니다.');
    }

    return context;
}
