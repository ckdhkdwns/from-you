import React from 'react';

export default function InfoTable({
    info,
    title,
}: {
    info: { label: string; value: string | React.ReactNode; hidden?: boolean }[];
    title?: string;
}) {
    return (
        <div>
            {title && <div className="text-lg font-semibold mb-4">{title}</div>}
            <div className="border-t border-primary-black flex flex-col">
                {info.map(item => {
                    if (item.hidden) return null;
                    return (
                        <div
                            key={item.label}
                            className="flex border-b border-gray-200 items-center max-h-[3.4rem]"
                        >
                            <div className="bg-gray-100 p-4 min-w-36 text-sm">{item.label}</div>
                            <div className="p-4 text-sm">{item.value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
