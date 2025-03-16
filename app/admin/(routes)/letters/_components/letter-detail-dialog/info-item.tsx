'use client';

interface InfoItemProps {
    label: string;
    value: React.ReactNode;
}

export function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-0">
            <div className="text-sm font-medium text-gray-600 mb-1 sm:mb-0 sm:w-1/3">{label}</div>
            <div className="text-sm text-gray-800 sm:text-right w-fit">{value}</div>
        </div>
    );
}
