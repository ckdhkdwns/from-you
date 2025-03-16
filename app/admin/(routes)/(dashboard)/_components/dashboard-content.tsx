'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from '@/components/admin/overview';
import { LettersByPostage } from '@/components/admin/letters-by-postage';
import { useStatistics } from '../_contexts/statistics-provider';
import { DateRangePicker } from '@/components/admin/date-range-picker';
import { StatsCalendar } from './stats-calendar';
import Loader from '@/components/ui/loader';

export function DashboardContent() {
    const {
        letters,
        users,
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        isLoading,
        refreshData,
    } = useStatistics();

    // 탭이나 날짜가 변경될 때 데이터 새로고침
    useEffect(() => {
        refreshData();
    }, [selectedDate, activeTab]);

    // 탭 변경 시 날짜 초기화
    const handleTabChange = (value: string) => {
        if (value !== activeTab) {
            setActiveTab(value as 'daily' | 'monthly' | 'calendar');
            // 날짜를 오늘로 초기화
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
        }
    };

    // 결제금액 계산
    const totalPayment = letters.reduce((sum, letter) => {
        // price 필드가 있는 경우에만 계산에 포함
        if ('priceInfo' in letter && typeof letter.priceInfo?.totalPrice === 'number') {
            return sum + letter.priceInfo?.totalPrice;
        }
        return sum;
    }, 0);

    // 편지 발송 수
    const totalLetters = letters.length;

    // 가입자 수
    const totalUsers = users.length;

    return (
        <div>
            <Tabs
                defaultValue="daily"
                className="space-y-4"
                value={activeTab}
                onValueChange={handleTabChange}
            >
                <div className="flex items-center gap-2">
                    <TabsList>
                        <TabsTrigger value="daily">일별</TabsTrigger>
                        <TabsTrigger value="monthly">월별</TabsTrigger>
                        <TabsTrigger value="calendar">캘린더</TabsTrigger>
                    </TabsList>
                    <DateRangePicker key="date-picker" />
                    {isLoading && <Loader />}
                </div>

                <TabsContent value="daily" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">총 결제금액</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₩{totalPayment.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {/* 여기에 전일 대비 증감률을 표시할 수 있습니다 */}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">신규 가입자</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{totalUsers}명</div>
                                <p className="text-xs text-muted-foreground">
                                    {/* 여기에 전일 대비 증감률을 표시할 수 있습니다 */}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">편지 발송수</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalLetters}건</div>
                                <p className="text-xs text-muted-foreground">
                                    {/* 여기에 전일 대비 증감률을 표시할 수 있습니다 */}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>개요</CardTitle>
                                <CardDescription>일별 결제금액 및 가입자 추이</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>우표금액별 편지 발송수</CardTitle>
                                <CardDescription>일별 우표금액별 편지 발송 현황</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LettersByPostage />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    월간 총 결제금액
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    ₩{totalPayment.toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {/* 여기에 전월 대비 증감률을 표시할 수 있습니다 */}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    월간 신규 가입자
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{totalUsers}명</div>
                                <p className="text-xs text-muted-foreground">
                                    {/* 여기에 전월 대비 증감률을 표시할 수 있습니다 */}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    월간 편지 발송수
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalLetters}건</div>
                                <p className="text-xs text-muted-foreground">
                                    {/* 여기에 전월 대비 증감률을 표시할 수 있습니다 */}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>월간 개요</CardTitle>
                                <CardDescription>월별 결제금액 및 가입자 추이</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview isMonthly />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>월간 우표금액별 편지 발송수</CardTitle>
                                <CardDescription>월별 우표금액별 편지 발송 현황</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LettersByPostage />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="calendar" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1">
                        <StatsCalendar />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
