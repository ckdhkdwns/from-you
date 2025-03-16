'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'react-feather';

const dateFilterOptions = [
    { label: '오늘', value: 'today' },
    { label: '1개월', value: '1Month' },
    { label: '3개월', value: '3Months' },
    { label: '6개월', value: '6Months' },
];

export default function DateFilter() {
    const [selectedDate, setSelectedDate] = useState(dateFilterOptions[0]);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    return (
        <div className="my-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Select>
                    <SelectTrigger className="border-none shadow-none w-fit gap-2 text-primary-black">
                        <SelectValue placeholder="전체 발송처리상태" />
                    </SelectTrigger>
                </Select>
                <div className="flex gap-2">
                    {dateFilterOptions.map(option => (
                        <Button
                            key={option.value}
                            className={`rounded-full py-1 px-5 text-[0.8rem] shadow-none h-7 hover:bg-transparent ${
                                selectedDate.value === option.value
                                    ? 'text-gray-500 border-primary-pink font-medium border-[1.5px]'
                                    : 'text-gray-400 border-gray-300 font-normal border-[1px]'
                            }`}
                            variant="outline"
                            onClick={() => setSelectedDate(option)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="w-fit text-left font-normal h-7 rounded-full shadow-none text-[0.8rem] text-gray-500"
                            >
                                2025-01-01
                            </Button>
                            <CalendarIcon className="ml-auto h-5 w-5" strokeWidth={1.5} />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            locale={ko}
                        />
                    </PopoverContent>
                </Popover>
                <span className="text-gray-400">-</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="w-fit text-left font-normal h-7 rounded-full shadow-none text-[0.8rem] text-gray-500"
                            >
                                2025-01-01
                            </Button>
                            <CalendarIcon className="ml-auto h-5 w-5" strokeWidth={1.5} />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            locale={ko}
                        />
                    </PopoverContent>
                </Popover>
                <Button className="rounded-full bg-primary-pink text-primary-black px-6 py-1 h-7 text-[0.8rem] hover:bg-primary-pink shadow-none">
                    조회
                </Button>
            </div>
        </div>
    );
}
