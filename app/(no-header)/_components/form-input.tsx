import React from 'react';

export default function FormInput({
    type,
    placeholder,
    value,
    onChange,
    disabled,
}: {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}) {
    return (
        <div className="p-4 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full text-base bg-transparent border-none outline-none"
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
