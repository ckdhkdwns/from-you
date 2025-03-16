'use client';

import React, { useState, useMemo } from 'react';
import { usePointLog } from '../_contexts/point-log-provider';
import Loader from '@/components/ui/loader';
import PointLogItem from './point-log-item';
import RoundedTabs from '@/components/ui/rounded-tabs';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';

type TabType = 'charge' | 'use';
type PeriodType = '1week' | '1month' | '3months' | '6months' | '1year' | 'all';

function PointLogList() {
    const { pointLogs, isLoading, error } = usePointLog();
    const [activeTab, setActiveTab] = useState<TabType>('charge');
    const [period, setPeriod] = useState<PeriodType>('all');

    // 탭과 기간에 따라 포인트 로그를 필터링
    const filteredLogs = useMemo(() => {
        if (!pointLogs || pointLogs.length === 0) return [];

        // 포인트 종류별 필터링 (충전/사용)
        let filtered = pointLogs.filter(log => {
            if (activeTab === 'charge') {
                return log.changeAmount > 0; // 충전은 양수
            } else {
                return log.changeAmount < 0; // 사용은 음수
            }
        });

        // 기간별 필터링
        if (period !== 'all') {
            const now = new Date();
            const startDate = new Date();

            switch (period) {
                case '1week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case '1month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case '3months':
                    startDate.setMonth(now.getMonth() - 3);
                    break;
                case '6months':
                    startDate.setMonth(now.getMonth() - 6);
                    break;
                case '1year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            filtered = filtered.filter(log => {
                const logDate = new Date(log.createdAt);
                return logDate >= startDate && logDate <= now;
            });
        }

        return filtered;
    }, [pointLogs, activeTab, period]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (pointLogs.length === 0) {
        return <div className="p-4 text-gray-500">포인트 내역이 없습니다.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center ">
                <RoundedTabs
                    tabs={[
                        {
                            label: '충전',
                            value: 'charge',
                        },
                        {
                            label: '사용',
                            value: 'use',
                        },
                    ]}
                    activeTab={{
                        label: activeTab === 'charge' ? '충전' : '사용',
                        value: activeTab,
                    }}
                    onClick={tab => setActiveTab(tab.value as TabType)}
                />

                <Select value={period} onValueChange={value => setPeriod(value as PeriodType)}>
                    <SelectTrigger className="w-24 border-none">
                        <SelectValue placeholder="전체 기간" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체 기간</SelectItem>
                        <SelectItem value="1week">1주일</SelectItem>
                        <SelectItem value="1month">1개월</SelectItem>
                        <SelectItem value="3months">3개월</SelectItem>
                        <SelectItem value="6months">6개월</SelectItem>
                        <SelectItem value="1year">1년</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="border-t-[1.5px] border-primary-black py-4 px-2">
                총 {filteredLogs.length}건
            </div>
            <div className="pl-4 flex flex-col gap-4">
                {filteredLogs.map((log, index) => (
                    <PointLogItem key={index} log={log} />
                ))}
            </div>
        </div>
    );
}

export default PointLogList;
