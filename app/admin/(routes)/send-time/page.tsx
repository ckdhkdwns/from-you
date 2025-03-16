import React from 'react';
import SendTimeConfigComponent from './_components/send-time-config';
import { SendTimeConfigPublic } from '@/models/types/send-time-config';
import { getSendTimeConfigAction } from '@/models/actions/config-actions';

export default async function SendTimePage() {
    let config: SendTimeConfigPublic = {
        PK: 'CONFIG#SEND_TIME_CONFIG' as const,
        SK: 'CONFIG#SEND_TIME_CONFIG' as const,
        일: { enabled: false, time: '12:00' },
        월: { enabled: false, time: '12:00' },
        화: { enabled: false, time: '12:00' },
        수: { enabled: false, time: '12:00' },
        목: { enabled: false, time: '12:00' },
        금: { enabled: false, time: '12:00' },
        토: { enabled: false, time: '12:00' },
    };

    try {
        const result = await getSendTimeConfigAction();
        if (result.success && result.data) {
            config = result.data;
        }
    } catch (error) {
        console.error('설정 로드 오류:', error);
        throw new Error('발송 시간 설정을 불러오는 중 오류가 발생했습니다.');
    }

    return (
        <div className="max-w-3xl">
            <SendTimeConfigComponent initialConfig={config} />
        </div>
    );
}
