'use client';

import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import TimePicker from './time-picker';
import { SendTimeConfigPublic } from '@/models/types/send-time-config';
import { saveSendTimeConfigAction } from '@/models/actions/config-actions';
import { toast } from 'sonner';

interface SendTimeConfigProps {
    initialConfig: SendTimeConfigPublic;
    onConfigChange?: (_config: SendTimeConfigPublic) => void;
}

// 요일 키 타입 정의
type DayKey = '일' | '월' | '화' | '수' | '목' | '금' | '토';
const daysOfWeek: DayKey[] = ['일', '월', '화', '수', '목', '금', '토'];

export default function SendTimeConfigComponent({
    initialConfig,
    onConfigChange,
}: SendTimeConfigProps) {
    const [config, setConfig] = useState<SendTimeConfigPublic>(initialConfig);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setConfig(initialConfig);
    }, [initialConfig]);

    const handleCheckboxChange = (day: DayKey) => {
        const newConfig = {
            ...config,
            [day]: {
                ...config[day],
                enabled: !config[day].enabled,
            },
        };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handleTimeChange = (day: DayKey, time: string) => {
        console.log(day, time);
        const newConfig = {
            ...config,
            [day]: {
                ...config[day],
                time,
            },
        };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    };

    const handleSaveConfig = async () => {
        try {
            setIsSaving(true);
            const result = await saveSendTimeConfigAction(config);

            if (result.success) {
                toast.success('발송 시간 설정이 성공적으로 저장되었습니다.');
            } else {
                toast.error(result.error.message || '발송 시간 설정 저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('발송 시간 설정 저장 오류:', error);
            toast.error('발송 시간 설정 저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-4">
                {daysOfWeek.map(day => (
                    <div
                        key={day}
                        className={`p-4 rounded-lg border flex items-center justify-between ${
                            config[day].enabled ? 'border-primary bg-primary/5' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex items-center space-x-2 ">
                            <Checkbox
                                id={`day-${day}`}
                                checked={config[day].enabled}
                                onCheckedChange={() => handleCheckboxChange(day)}
                            />
                            <Label htmlFor={`day-${day}`} className="font-medium">
                                {day}요일
                            </Label>
                        </div>
                        <div>
                            <TimePicker
                                value={config[day].time}
                                onChange={time => handleTimeChange(day, time)}
                                disabled={!config[day].enabled}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-6">
                <Button onClick={handleSaveConfig} disabled={isSaving}>
                    {isSaving ? '저장 중...' : '설정 저장'}
                </Button>
            </div>
        </div>
    );
}
