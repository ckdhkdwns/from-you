'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    PackagePlus,
    Truck,
    PackageSearch,
    PackageCheck,
    AlertCircle,
    PackageX,
} from 'lucide-react';
import { fetchTrackingInfo, TrackingInfo } from '@/models/actions/post-tracking/tracking-actions';
import { cn } from '@/lib/utils';
import TextLoader from '@/components/ui/text-loader';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrackingInfoDialogProps {
    trackingNumber: string;
    children: React.ReactNode;
}

const dlvyStatus = {
    접수: {
        color: '#4299e1', // blue
        icon: <PackagePlus size={20} />,
        bgColor: 'transparent',
        description: '우체국에서 접수되었습니다',
    },
    발송: {
        color: '#68d391', // green
        icon: <Truck size={20} />,
        bgColor: 'transparent',
        description: '배송이 시작되었습니다',
    },
    배달준비: {
        color: '#f6ad55', // orange
        icon: <PackageSearch size={20} />,
        bgColor: 'transparent',
        description: '배달지에 도착하여 배달 준비 중입니다',
    },
    배달완료: {
        color: '#805ad5', // purple
        icon: <PackageCheck size={20} />,
        bgColor: 'transparent',
        description: '배송이 완료되었습니다',
    },
};

export default function TrackingInfoDialog({ trackingNumber, children }: TrackingInfoDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isMobile = useIsMobile();
    const [sheetSide, setSheetSide] = useState<'right' | 'bottom'>('right');

    // 반응형으로 Sheet의 방향 설정
    useEffect(() => {
        setSheetSide(isMobile ? 'bottom' : 'right');
    }, [isMobile]);

    const fetchTrackingData = async () => {
        if (!trackingNumber) {
            setError('등기번호가 없습니다.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 서버 액션 호출
            const data = await fetchTrackingInfo(trackingNumber);

            if (data) {
                setTrackingData(data);
            } else {
                setError('배송 정보를 불러올 수 없습니다.');
            }
        } catch (err) {
            console.error('배송 조회 오류:', err);
            setError('배송 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && !trackingData) {
            fetchTrackingData();
        }
    };

    // 현재 배송 단계를 숫자로 변환 (진행 상태 표시에 사용)
    const getStepNumber = (status: string): number => {
        const steps = Object.keys(dlvyStatus);
        const index = steps.indexOf(status);
        return index !== -1 ? index : 0;
    };

    const formatDate = (date: string, time: string): string => {
        if (!date) return '';

        // date 형식 변환 (YYYY-MM-DD)
        const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

        // time 형식 변환 (HH:MM)
        let formattedTime = '';
        if (time) {
            formattedTime = time.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2');
        }

        return formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;
    };

    // 배송 상태 표시 컴포넌트
    const DeliveryStatusIndicator = ({ info }: { info: TrackingInfo }) => {
        // 현재 배송 단계
        const currentStep = getStepNumber(info.dlvySttus);

        return (
            <div className="mt-5 mb-8">
                <div className="relative flex items-center justify-between">
                    {/* 연결선 */}
                    <div className="absolute h-1 left-0 top-1/2 -translate-y-[0.8rem] right-0 bg-gray-100 z-0"></div>

                    {/* 단계별 상태 표시 */}
                    {Object.entries(dlvyStatus).map(([status, { icon }], index) => {
                        const isActive = index <= currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={status} className="relative z-10 flex flex-col items-center">
                                {/* 아이콘 표시 */}
                                <div
                                    className={cn(
                                        'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all mb-2',
                                        isActive
                                            ? 'bg-secondary-newpink shadow-sm shadow-secondary-newpink/20 text-white'
                                            : 'bg-gray-50 border border-gray-100 text-gray-300',
                                    )}
                                >
                                    {icon}
                                </div>

                                {/* 단계 이름 */}
                                <span
                                    className={cn(
                                        'text-[10px] sm:text-xs transition-colors',
                                        isCurrent
                                            ? 'text-black font-semibold'
                                            : isActive
                                              ? 'text-gray-700'
                                              : 'text-gray-400',
                                    )}
                                >
                                    {status}
                                </span>

                                {/* 현재 단계 설명 (현재 단계만 표시) */}
                                {isCurrent && (
                                    <div className="absolute -bottom-6 whitespace-normal sm:whitespace-nowrap text-center w-full sm:w-auto text-[10px] sm:text-xs text-secondary-newpink font-medium">
                                        {dlvyStatus[status as keyof typeof dlvyStatus].description}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // 배송 정보 요약 컴포넌트
    const DeliverySummary = ({ info }: { info: TrackingInfo }) => {
        return (
            <div className="py-4 mb-5 px-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">배송 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex flex-wrap">
                            <span className="text-gray-500 font-medium w-20 min-w-[5rem]">
                                등기번호:
                            </span>
                            <span className="font-mono font-medium text-gray-800 break-all">
                                {info.rgist}
                            </span>
                        </div>
                        <div className="flex flex-wrap">
                            <span className="text-gray-500 font-medium w-20 min-w-[5rem]">
                                보내는 분:
                            </span>
                            <span className="text-gray-800 break-all">{info.applcntNm}</span>
                        </div>
                        <div className="flex flex-wrap">
                            <span className="text-gray-500 font-medium w-20 min-w-[5rem]">
                                받는 분:
                            </span>
                            <span className="text-gray-800 break-all">{info.addrseNm}</span>
                        </div>
                        <div className="flex flex-wrap">
                            <span className="text-gray-500 font-medium w-20 min-w-[5rem]">
                                배송종류:
                            </span>
                            <span className="text-gray-800 break-all">{info.trtmntSe}</span>
                        </div>
                        {info.dlvyDe && (
                            <div className="flex flex-wrap col-span-1 sm:col-span-2">
                                <span className="text-gray-500 font-medium w-20 min-w-[5rem]">
                                    예정일시:
                                </span>
                                <span className="text-gray-800 break-all">{info.dlvyDe}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // 배송 추적 타임라인 컴포넌트
    const DeliveryTimeline = ({ items }: { items: TrackingInfo['longitudinalDomesticList'] }) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="mt-4 px-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">배송 추적 내역</h3>

                {/* 데스크탑 테이블 (md 이상 화면에서만 표시) */}
                <div className="hidden md:block overflow-hidden bg-gray-50 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                    처리 일시
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                    처리 장소
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                    처리 상태
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                    상세 내용
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {items.map((item, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                        {formatDate(item.dlvyDate, item.dlvyTime)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {item.nowLc}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="text-secondary-newpink font-semibold">
                                            {item.processSttus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {item.detailDc || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 모바일 타임라인 뷰 (md 미만 화면에서만 표시) */}
                <div className="md:hidden space-y-2">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-lg bg-gray-50 border-l-4 border-secondary-newpink/70"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-secondary-newpink font-semibold text-sm">
                                    {item.processSttus}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatDate(item.dlvyDate, item.dlvyTime)}
                                </span>
                            </div>
                            <div className="text-sm mb-1">
                                <span className="text-gray-500 font-medium mr-2">처리 장소:</span>
                                <span className="text-gray-900">{item.nowLc}</span>
                            </div>
                            {item.detailDc && (
                                <div className="text-sm">
                                    <span className="text-gray-500 font-medium mr-2">
                                        상세 내용:
                                    </span>
                                    <span className="text-gray-700">{item.detailDc}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (loading) {
            return <TextLoader text="배송 정보를 불러오는 중..." className="py-12" />;
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-red-50 p-4 rounded-full mb-4">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <p className="text-red-500 font-medium">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-5"
                        onClick={fetchTrackingData}
                    >
                        다시 시도
                    </Button>
                </div>
            );
        }

        if (!trackingData) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <PackageX className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500">배송 정보가 없습니다.</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-5"
                        onClick={fetchTrackingData}
                    >
                        다시 시도
                    </Button>
                </div>
            );
        }

        return (
            <div>
                {/* 배송 상태 표시 */}
                <DeliveryStatusIndicator info={trackingData} />

                {/* 배송 정보 요약 */}
                <DeliverySummary info={trackingData} />

                {/* 배송 추적 타임라인 */}
                <DeliveryTimeline items={trackingData.longitudinalDomesticList} />
            </div>
        );
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                side={sheetSide}
                className={cn(
                    'overflow-y-auto p-6',
                    sheetSide === 'bottom' ? 'max-h-[85vh]' : 'w-full md:min-w-[600px]',
                )}
            >
                <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center gap-2 py-1 text-gray-800">
                        <Truck size={18} className="text-secondary-newpink" />
                        <span>배송 조회</span>
                    </SheetTitle>
                </SheetHeader>

                <div>{renderContent()}</div>
            </SheetContent>
        </Sheet>
    );
}
