'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BasicInfoSection } from './basic-info-section';
import { SenderInfoSection } from './sender-info-section';
import { RecipientInfoSection } from './recipient-info-section';
import { LetterContentSection } from './letter-content-section';
import TransferInfoSection from './trasfer-info-section';
import { LetterPublic, PaymentStatus, ShippingStatus } from '@/models/types/letter';
import LetterPhotoSection from './letter-photo-section';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCompleteLetters } from '../../../../_contexts/complete-letters-provider';
import { UserPublic } from '@/models/types/user';
import { getTemplateConfigAction } from '@/models/actions/config-actions';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLetterActions } from '../../_hooks/use-letter-actions';

const PointAnnouncement = ({ user, letter }: { user: UserPublic; letter: LetterPublic }) => {
    const items = [
        { label: '사용자 ID', value: user.PK.replace('USER#', '') },
        {
            label: '지급된 포인트',
            value: `${letter?.pointInfo?.earnPointAmount.toLocaleString()} P`,
        },
        { label: '현재 포인트', value: `${user.point.toLocaleString()} P` },
    ];

    return (
        <div className="flex flex-col gap-2">
            <div>배송 완료 처리되었습니다.</div>
            {items.map(item => (
                <div key={item.label} className="flex gap-2">
                    <div className="min-w-[100px] text-xs text-gray-500">{item.label}</div>
                    <div className="text-xs">{item.value}</div>
                </div>
            ))}
        </div>
    );
};

export function LetterDetailDialog() {
    const {
        selectedLetter: letter,
        isDialogOpen: isOpen,
        setIsDialogOpen: setIsOpen,
    } = useCompleteLetters();

    const {
        handleUpdateTrackingNumber,
        handleUpdateSinglePaymentStatus,
        handleUpdateSingleShippingStatus,
    } = useLetterActions();

    const [currentLetter, setCurrentLetter] = useState<LetterPublic | null>(letter);
    const [templateConfig, setTemplateConfig] = useState<TemplateConfigPublic | null>(null);

    useEffect(() => {
        const fetchTemplateConfig = async () => {
            const config = await getTemplateConfigAction();
            if (config.success) {
                setTemplateConfig(config.data);
            }
        };
        fetchTemplateConfig();
    }, []);

    useEffect(() => {
        setCurrentLetter(letter);
    }, [letter]);

    if (!currentLetter) return null;

    const handleUpdateTrackingNumberWrapper = async (trackingNumber: string) => {
        const success = await handleUpdateTrackingNumber(currentLetter, trackingNumber);
        if (success) {
            setCurrentLetter(prev => (prev ? { ...prev, trackingNumber } : null));
        }
    };

    const handleUpdatePaymentStatusWrapper = async (status: PaymentStatus) => {
        const success = await handleUpdateSinglePaymentStatus(currentLetter, status);
        if (success) {
            setCurrentLetter(prev =>
                prev
                    ? {
                          ...prev,
                          paymentStatus: status,
                      }
                    : null,
            );
            return true;
        }
        return false;
    };

    const handleUpdateShippingStatusWrapper = async (status: ShippingStatus) => {
        const result = await handleUpdateSingleShippingStatus(currentLetter, status);

        if (result.success) {
            if (status === 'complete' && result.data) {
                setCurrentLetter(prev =>
                    prev
                        ? {
                              ...prev,
                              shippingStatus: status,
                              shippingCompletedAt: result.data.letter.shippingCompletedAt,
                          }
                        : null,
                );

                console.log('result.data', result.data);
                toast.success(
                    <PointAnnouncement
                        user={result.data.user as UserPublic}
                        letter={result.data.letter as LetterPublic}
                    />,
                    {
                        closeButton: true,
                        duration: 3000,
                        classNames: {
                            icon: 'text-green-500 mt-0.5',
                            toast: '!items-start',
                        },
                    },
                );
            } else {
                setCurrentLetter(prev =>
                    prev
                        ? {
                              ...prev,
                              shippingStatus: status,
                          }
                        : null,
                );
            }
            return true;
        }
        return false;
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-6xl overflow-y-auto !bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">편지 상세 정보</DialogTitle>
                    <DialogDescription>주문번호: {currentLetter.orderId}</DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[80vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 왼쪽 컬럼: 기본 정보, 발신자 정보, 수신자 정보 */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-md font-semibold mb-3">기본 정보</h3>
                                <BasicInfoSection
                                    letter={currentLetter}
                                    onUpdatePaymentStatus={handleUpdatePaymentStatusWrapper}
                                    onUpdateShippingStatus={handleUpdateShippingStatusWrapper}
                                    onUpdateTrackingNumber={handleUpdateTrackingNumberWrapper}
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-md font-semibold mb-3">발신자 정보</h3>
                                <SenderInfoSection letter={currentLetter} />
                            </div>

                            {/* 계좌이체 정보 섹션 */}
                            {currentLetter.paymentMethod === 'transfer' && (
                                <TransferInfoSection letter={currentLetter} />
                            )}

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-md font-semibold mb-3">수신자 정보</h3>
                                <RecipientInfoSection letter={currentLetter} />
                            </div>
                        </div>

                        {/* 오른쪽 컬럼: 편지 내용, 편지 사진 */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <LetterContentSection
                                    letter={currentLetter}
                                    templateConfig={templateConfig}
                                />
                            </div>

                            {currentLetter.photos.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <LetterPhotoSection
                                        photos={currentLetter.photos}
                                        templateConfig={templateConfig}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
