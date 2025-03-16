"use client";

import { useState, useMemo } from "react";
import { ko } from "date-fns/locale";
import { useStatistics } from "../_contexts/statistics-provider";
import {
    addMonths,
    endOfMonth,
    format,
    startOfMonth,
    isSameDay,
} from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DayWithDataProps {
    date: Date;
    letters: number;
    users: number;
    payment: number;
}

function DayWithData({ date, letters, users, payment }: DayWithDataProps) {
    const hasData = letters > 0 || users > 0 || payment > 0;

    return (
        <div className="flex flex-col items-center h-full w-full">
            <span className="text-sm text-left w-full">{date.getDate()}</span>

            {hasData && (
                <div className="flex flex-col gap-1 mt-1 w-full">
                    {letters > 0 && (
                        <Badge
                            variant="outline"
                            className="bg-blue-50 text-[10px] h-4 w-full flex justify-center"
                        >
                            {letters}건
                        </Badge>
                    )}
                    {users > 0 && (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-[10px] h-4 w-full flex justify-center"
                        >
                            {users}명
                        </Badge>
                    )}
                    {payment > 0 && (
                        <Badge
                            variant="outline"
                            className="bg-amber-50 text-[10px] h-4 w-full flex justify-center"
                        >
                            ₩{payment.toLocaleString()}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}

export function StatsCalendar() {
    const { letters, users } = useStatistics();
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // 특정 날짜의 데이터 필터링 함수
    const getDataForDate = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");

        const dayLetters = letters.filter(
            (letter) => letter.createdAt && letter.createdAt.startsWith(dateStr)
        );

        const dayUsers = users.filter(
            (user) => user.createdAt && user.createdAt.startsWith(dateStr)
        );

        const dayPayment = dayLetters.reduce((sum, letter) => {
            if ("price" in letter && typeof letter.price === "number") {
                return sum + letter.price;
            }
            return sum;
        }, 0);

        return {
            letters: dayLetters.length,
            users: dayUsers.length,
            payment: dayPayment,
        };
    };

    // 날짜별 데이터 캐싱
    const dateData = useMemo(() => {
        const data: Record<
            string,
            { letters: number; users: number; payment: number }
        > = {};

        // 현재 보고 있는 달의 시작과 끝
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);

        // 현재 달의 모든 날짜에 대한 데이터 미리 계산
        let currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = format(currentDate, "yyyy-MM-dd");
            data[dateStr] = getDataForDate(currentDate);
            // 다음 날짜로 이동
            currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }

        return data;
    }, [letters, users, currentMonth]);

    // 이전/다음 달 버튼 처리
    const handlePrevMonth = () =>
        setCurrentMonth((prevMonth) => addMonths(prevMonth, -1));
    const handleNextMonth = () =>
        setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));

    return (
        <div className="col-span-full">
            <div className="flex items-center justify-between">
                <div className="flex space-x-2 items-center gap-2">
                    <Button
                        onClick={handlePrevMonth}
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">이전 달</span>
                    </Button>
                    <div className="text-sm font-medium">
                        {format(currentMonth, "yyyy년 MM월", {
                            locale: ko,
                        })}
                    </div>
                    <Button
                        onClick={handleNextMonth}
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">다음 달</span>
                    </Button>
                </div>
            </div>

            <div className="p-3">
                <div className="grid grid-cols-7 mb-2 ">
                    {["일", "월", "화", "수", "목", "금", "토"].map(
                        (day, i) => (
                            <div
                                key={i}
                                className="text-center text-sm font-medium text-muted-foreground"
                            >
                                {day}
                            </div>
                        )
                    )}
                </div>

                <div className="grid grid-cols-7 border-b border-r">
                    {/* 날짜들 생성 */}
                    {(() => {
                        const days = [];
                        const monthStart = startOfMonth(currentMonth);
                        const monthEnd = endOfMonth(currentMonth);

                        // 이전 달의 날짜들로 첫 주 채우기
                        const startDay = monthStart.getDay();
                        for (let i = 0; i < startDay; i++) {
                            const prevDay = new Date(monthStart);
                            prevDay.setDate(prevDay.getDate() - (startDay - i));
                            days.push(
                                <div
                                    key={`prev-${i}`}
                                    className="h-24 p-1 border-t border-l text-gray-300"
                                >
                                    {prevDay.getDate()}
                                </div>
                            );
                        }

                        // 현재 달의 날짜들
                        for (let day = 1; day <= monthEnd.getDate(); day++) {
                            const date = new Date(
                                currentMonth.getFullYear(),
                                currentMonth.getMonth(),
                                day
                            );
                            const dateStr = format(date, "yyyy-MM-dd");
                            const data = dateData[dateStr] || {
                                letters: 0,
                                users: 0,
                                payment: 0,
                            };

                            days.push(
                                <TooltipProvider key={dateStr}>
                                    <Tooltip delayDuration={50}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={cn(
                                                    "h-24 p-1 border-t border-l relative",
                                                    isSameDay(
                                                        date,
                                                        new Date()
                                                    ) && "bg-gray-50"
                                                )}
                                            >
                                                <DayWithData
                                                    date={date}
                                                    letters={data.letters}
                                                    users={data.users}
                                                    payment={data.payment}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="p-2 w-52">
                                            <div className="space-y-1 text-sm">
                                                <p className="font-semibold">
                                                    {format(
                                                        date,
                                                        "yyyy년 MM월 dd일",
                                                        { locale: ko }
                                                    )}
                                                </p>
                                                <p>
                                                    편지 발송: {data.letters}건
                                                </p>
                                                <p>신규 가입: {data.users}명</p>
                                                <p>
                                                    총 결제액: ₩
                                                    {data.payment.toLocaleString()}
                                                </p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            );
                        }

                        // 다음 달의 날짜들로 마지막 주 채우기
                        const endDay = monthEnd.getDay();
                        for (let i = endDay; i < 6; i++) {
                            const nextDay = new Date(monthEnd);
                            nextDay.setDate(
                                nextDay.getDate() + (i - endDay + 1)
                            );
                            days.push(
                                <div
                                    key={`next-${i}`}
                                    className="h-24 p-1 border-t border-l text-gray-300"
                                >
                                    {nextDay.getDate()}
                                </div>
                            );
                        }

                        return days;
                    })()}
                </div>
            </div>

            <div className="mt-4 flex justify-center gap-4">
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-50 border border-blue-200 rounded-full"></span>
                    <span className="text-xs">편지 발송</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-50 border border-green-200 rounded-full"></span>
                    <span className="text-xs">신규 가입</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-50 border border-amber-200 rounded-full"></span>
                    <span className="text-xs">결제 금액</span>
                </div>
            </div>
        </div>
    );
}
