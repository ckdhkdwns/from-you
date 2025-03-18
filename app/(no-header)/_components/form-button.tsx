import { Loader2 } from 'lucide-react';
import React from 'react';

interface FormButtonProps {
    type?: 'button' | 'submit' | 'reset';
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export default function FormButton({
    type = 'submit',
    label,
    onClick,
    disabled = false,
    className = '',
}: FormButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full gap-2 flex justify-center items-center px-6 py-4 rounded-xl bg-primary-pink active:bg-primary-pink/70 disabled:opacity-50 ${className}`}
            disabled={disabled}
        >
            {/* {disabled && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />} */}
            <p className="text-lg font-medium">{label}</p>
        </button>
    );
}
