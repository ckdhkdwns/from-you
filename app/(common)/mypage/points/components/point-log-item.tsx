'use client';

import React from 'react';
import { PointLogPublic } from '@/models/types/point-log';
import { POINT_CHANGE_REASON } from '@/constants';

function formatTime(dateString: string) {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

interface PointLogItemProps {
    log: PointLogPublic;
}

function PointLogItem({ log }: PointLogItemProps) {
    const date = new Date(log.createdAt);
    const formattedDate = `${date.getMonth() + 1}.${date.getDate().toString().padStart(2, '0')}`;
    const isPositive = log.changeAmount > 0;

    return (
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1.5 border-b border-gray-100 pb-3 last:border-0">
            <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 pr-6 w-full">
                <div className="flex justify-start items-center flex-grow relative gap-2">
                    <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#777]">
                        {formattedDate}
                    </p>
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                        <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#333]">
                            {POINT_CHANGE_REASON[log.reason].label}
                        </p>
                    </div>
                </div>
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-0.5">
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
                        {isPositive && (
                            <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                                preserveAspectRatio="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12.7603 6.75C12.7603 6.33579 12.4245 6 12.0103 6C11.596 6 11.2603 6.33579 11.2603 6.75V11.2603H6.75C6.33579 11.2603 6 11.5961 6 12.0103C6 12.4245 6.33579 12.7603 6.75 12.7603H11.2603V17.2705C11.2603 17.6848 11.596 18.0205 12.0103 18.0205C12.4245 18.0205 12.7603 17.6848 12.7603 17.2705V12.7603H17.2705C17.6848 12.7603 18.0205 12.4245 18.0205 12.0103C18.0205 11.5961 17.6848 11.2603 17.2705 11.2603H12.7603V6.75Z"
                                    fill="#3083DC"
                                />
                            </svg>
                        )}
                        {!isPositive && (
                            <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                                preserveAspectRatio="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M17.25 12.0103C17.25 11.5961 16.9142 11.2603 16.5 11.2603H7.5C7.08579 11.2603 6.75 11.5961 6.75 12.0103C6.75 12.4245 7.08579 12.7603 7.5 12.7603H16.5C16.9142 12.7603 17.25 12.4245 17.25 12.0103Z"
                                    fill="#FF5050"
                                />
                            </svg>
                        )}
                        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5">
                            <p
                                className={`flex-grow-0 flex-shrink-0 text-base font-semibold text-left ${
                                    isPositive ? 'text-[#3083dc]' : 'text-[#FF5050]'
                                }`}
                            >
                                {log.changeAmount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <p
                        className={`flex-grow-0 flex-shrink-0 text-base font-semibold text-left ${
                            isPositive ? 'text-[#3083dc]' : 'text-[#FF5050]'
                        }`}
                    >
                        P
                    </p>
                </div>
            </div>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2 pl-[39px]">
                <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#777]">
                    {formatTime(log.createdAt)}
                </p>
                <div className="flex-grow-0 flex-shrink-0 w-px h-3 bg-[#d9d9d9]" />
                <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-left text-[#4f4f4f]">
                    {log.changeAmount > 0 ? '충전' : '사용'}
                </p>
            </div>
        </div>
    );
}

export default PointLogItem;
