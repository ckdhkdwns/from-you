'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useStatistics } from '@/app/admin/(routes)/(dashboard)/_contexts/statistics-provider';

export function DateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const { selectedDate, setSelectedDate, activeTab } = useStatistics();

    // 초기 날짜 설정
    const initialDate = new Date(selectedDate);

    const [date, setDate] = React.useState<Date | undefined>(initialDate);
    const [month, setMonth] = React.useState<string>(format(initialDate, 'yyyy-MM'));

    React.useEffect(() => {
        setDate(initialDate);
        setMonth(format(initialDate, 'yyyy-MM'));
    }, [selectedDate]);

    // 날짜 변경 처리
    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);

        if (newDate) {
            const dateStr = format(newDate, 'yyyy-MM-dd');
            setSelectedDate(dateStr);
        }
    };

    // 월 변경 처리
    const handleMonthChange = (value: string) => {
        setMonth(value);
        setSelectedDate(`${value}-01`); // 해당 월의 1일로 설정
    };

    // 월 목록 생성 (현재 연도에서 5년 전부터 현재까지)
    const currentYear = new Date().getFullYear();
    const months = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
        for (let month = 12; month >= 1; month--) {
            // 현재 날짜 이후의 월은 제외
            if (year === currentYear && month > new Date().getMonth() + 1) continue;

            const monthValue = `${year}-${month.toString().padStart(2, '0')}`;
            const monthLabel = `${year}년 ${month}월`;
            months.push({ value: monthValue, label: monthLabel });
        }
    }

    return (
        <div className={cn('grid gap-2', className)}>
            {activeTab === 'daily' ? (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={'outline'}
                            className={cn(
                                'w-[200px] justify-start text-left font-normal',
                                !date && 'text-muted-foreground',
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP', { locale: ko }) : <span>날짜 선택</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="single"
                            defaultMonth={date}
                            selected={date}
                            onSelect={handleDateChange}
                            locale={ko}
                        />
                    </PopoverContent>
                </Popover>
            ) : (
                <Select value={month} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-[200px]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="월 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map(month => (
                            <SelectItem key={month.value} value={month.value}>
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}
