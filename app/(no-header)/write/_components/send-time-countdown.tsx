'use client';

import React, { useState, useEffect } from 'react';
import { useLetter } from '../_contexts/letter-provider';
import { useInterval } from '@/hooks/use-interval';
import { TimeSchedule } from '@/models/types/send-time-config';

export default function SendCountdown() {
    const { sendTimeConfig } = useLetter();
    const [timeRemaining, setTimeRemaining] = useState<{
        days: number;
        hours: number;
        minutes: number;
    } | null>(null);

    // 남은 시간 계산 함수
    const calculateTimeRemaining = () => {
        if (!sendTimeConfig) return null;

        const now = new Date();
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
        const todaySchedule = sendTimeConfig[
            dayOfWeek as keyof typeof sendTimeConfig
        ] as TimeSchedule;

        // 오늘 발송이 비활성화되어 있으면 다음 활성화된 요일 찾기
        if (!todaySchedule.enabled) {
            let nextDay = now.getDay();
            let daysChecked = 0;
            let foundEnabledDay = false;

            while (!foundEnabledDay && daysChecked < 7) {
                nextDay = (nextDay + 1) % 7;
                daysChecked++;

                const nextDayName = ['일', '월', '화', '수', '목', '금', '토'][nextDay];
                const nextDaySchedule = sendTimeConfig[
                    nextDayName as keyof typeof sendTimeConfig
                ] as TimeSchedule;

                if (nextDaySchedule.enabled) {
                    foundEnabledDay = true;

                    // 다음 발송일까지 남은 시간 계산
                    const targetDate = new Date(now);
                    targetDate.setDate(now.getDate() + daysChecked);

                    const [targetHours, targetMinutes] = nextDaySchedule.time
                        .split(':')
                        .map(Number);
                    targetDate.setHours(targetHours, targetMinutes, 0, 0);

                    const diffMs = targetDate.getTime() - now.getTime();
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const diffHours = Math.floor(
                        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                    );
                    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                    return { days: diffDays, hours: diffHours, minutes: diffMinutes };
                }
            }

            return null; // 모든 요일이 비활성화된 경우
        }

        // 오늘 발송 시간 계산
        const [targetHours, targetMinutes] = todaySchedule.time.split(':').map(Number);
        const targetTime = new Date(now);
        targetTime.setHours(targetHours, targetMinutes, 0, 0);

        // 이미 오늘의 발송 시간이 지났으면 다음 날로 계산
        if (now > targetTime) {
            let nextDay = now.getDay();
            let daysChecked = 0;
            let foundEnabledDay = false;

            while (!foundEnabledDay && daysChecked < 7) {
                nextDay = (nextDay + 1) % 7;
                daysChecked++;

                const nextDayName = ['일', '월', '화', '수', '목', '금', '토'][nextDay];
                const nextDaySchedule = sendTimeConfig[
                    nextDayName as keyof typeof sendTimeConfig
                ] as TimeSchedule;

                if (nextDaySchedule.enabled) {
                    foundEnabledDay = true;

                    const targetDate = new Date(now);
                    targetDate.setDate(now.getDate() + daysChecked);

                    const [nextHours, nextMinutes] = nextDaySchedule.time.split(':').map(Number);
                    targetDate.setHours(nextHours, nextMinutes, 0, 0);

                    const diffMs = targetDate.getTime() - now.getTime();
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const diffHours = Math.floor(
                        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                    );
                    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                    return { days: diffDays, hours: diffHours, minutes: diffMinutes };
                }
            }

            return null;
        } else {
            // 오늘 발송 시간까지 남은 시간 계산
            const diffMs = targetTime.getTime() - now.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            return { days: diffDays, hours: diffHours, minutes: diffMinutes };
        }
    };

    // 초기 남은 시간 계산
    useEffect(() => {
        if (sendTimeConfig) {
            setTimeRemaining(calculateTimeRemaining());
        }
    }, [sendTimeConfig]);

    // 1분마다 남은 시간 업데이트
    useInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
    }, 60000); // 60000ms = 1분

    if (!timeRemaining) return null;

    return (
        <div className="flex justify-center items-center h-14 relative gap-2.5 py-2.5 bg-[#eaece1]/60">
            <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#276342]">
                발송까지 {timeRemaining.days > 0 ? `${timeRemaining.days}일` : ''}{' '}
                {timeRemaining.hours > 0 || timeRemaining.days === 0
                    ? `${timeRemaining.hours}시간`
                    : ''}{' '}
                {timeRemaining.minutes > 0 ||
                (timeRemaining.days === 0 && timeRemaining.hours === 0)
                    ? `${timeRemaining.minutes}분`
                    : ''}
            </p>
        </div>
    );
}
