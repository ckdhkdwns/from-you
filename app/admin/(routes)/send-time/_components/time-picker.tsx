'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface TimePickerProps {
    value?: string;
    onChange?: (_value: string) => void;
    disabled?: boolean;
}

export default function TimePicker({
    value = '12:00',
    onChange,
    disabled = false,
}: TimePickerProps) {
    const [hours, setHours] = useState('12');
    const [minutes, setMinutes] = useState('00');

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':');
            setHours(h);
            setMinutes(m);
        }
    }, [value]);

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newHours = e.target.value;

        // 숫자만 입력 가능
        newHours = newHours.replace(/[^0-9]/g, '');

        if (parseInt(newHours) > 23) {
            newHours = '23';
        }

        setHours(newHours);
        onChange?.(`${newHours}:${minutes}`);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newMinutes = e.target.value;

        // 숫자만 입력 가능
        newMinutes = newMinutes.replace(/[^0-9]/g, '');

        if (parseInt(newMinutes) > 59) {
            newMinutes = '59';
        }

        setMinutes(newMinutes);
        onChange?.(`${hours}:${newMinutes}`);
    };

    return (
        <div className="flex items-center space-x-1">
            <Input
                type="text"
                value={hours}
                onChange={handleHoursChange}
                disabled={disabled}
                className="w-12 text-center"
                maxLength={2}
            />
            <span className="text-lg">:</span>
            <Input
                type="text"
                value={minutes}
                onChange={handleMinutesChange}
                disabled={disabled}
                className="w-12 text-center"
                maxLength={2}
            />
        </div>
    );
}
