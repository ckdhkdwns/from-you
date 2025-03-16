import React from 'react';
import { getLetterByIdAction } from '@/models/actions/letter-actions';
import { getStatusText } from '../_libs/get-status-text';
import Receipt from '../_components/receipt';
import InfoTable from '../_components/info-table';
import { parseDate } from '@/lib/date';

import ReceivedPage from './received-page';
import AccountAlertToast from './_components/account-alert-toast';
import { Button } from '@/components/ui/button';
import TrackingInfoDialog from '../_components/tracking-info-dialog';
import PreviewLetterContent from '../_components/preview-letter-content';
import PreviewPhoto from '../_components/preview-photo';
import { paymentMethodConfig } from '@/constants';
import { getTemplateConfigAction } from '@/models/actions/config-actions';

export default async function page({ params }: { params: Promise<{ type: string; id: string }> }) {
    const { type, id } = await params;

    if (type === 'received') {
        return <ReceivedPage params={params} />;
    }

    const {
        success: letterSuccess,
        data: letter,
        error: letterError,
    } = await getLetterByIdAction(id);

    if (!letterSuccess) {
        return <div>{letterError.message}</div>;
    }

    const {
        success: templateConfigSuccess,
        data: templateConfig,
        error: templateConfigError,
    } = await getTemplateConfigAction();

    if (!templateConfigSuccess) {
        return <div>{templateConfigError.message}</div>;
    }

    const getDisplayDate = () => {
        if (letter.isDraft) return letter.updatedAt;
        if (letter.paymentMethod === 'transfer') return letter.transferRequestedAt;
        if (letter.paymentMethod === 'point') return letter.paymentCompletedAt;
        return letter.paymentCompletedAt;
    };

    const displayDate = getDisplayDate();

    console.log(letter);
    const orderInfo = [
        {
            label: '주문번호',
            value: letter.orderId || '주문번호 없음',
        },
        {
            label: '주문일자',
            value: parseDate(displayDate),
        },
        { label: '주문자', value: letter.PK?.replace('USER#', '') },
        {
            label: '주문상태',
            value: getStatusText({
                paymentStatus: letter.paymentStatus,
                shippingStatus: letter.shippingStatus,
            }),
        },
        {
            label: '결제 방법',
            value: paymentMethodConfig[letter.paymentMethod].label,
        },
        {
            label: '입금자명',
            value: letter.transferInfo?.depositorName,
            hidden: letter.paymentMethod !== 'transfer',
        },
        {
            label: '현금영수증',
            value: `${letter?.transferInfo?.cashReceiptType === 'business' ? '법인' : '개인'} ${letter.transferInfo?.cashReceiptNumber}`,
            hidden: letter?.transferInfo?.cashReceiptType === 'none',
        },

        {
            label: '등기번호',
            value: (
                <div className="flex items-center gap-2 w-full">
                    <div className="">{letter.trackingNumber}</div>
                    <TrackingInfoDialog trackingNumber={letter.trackingNumber}>
                        <Button variant="outlinePink" size="sm">
                            배송 조회하기
                        </Button>
                    </TrackingInfoDialog>
                </div>
            ),
            hidden: !letter.trackingNumber,
        },

        {
            label: '결제 완료 일시',
            value: parseDate(letter.paymentCompletedAt),
            hidden: !letter.paymentCompletedAt,
        },
        {
            label: '배송 완료 일시',
            value: parseDate(letter.shippingCompletedAt),
            hidden: !letter.shippingCompletedAt,
        },
    ];

    const senderInfo = [
        { label: '주문자', value: letter.senderAddress.name },
        { label: '우편번호', value: letter.senderAddress.zonecode },
        { label: '주소', value: letter.senderAddress.address1 },
        {
            label: '연락처',
            value: letter.senderAddress.contact,
            hidden: !letter.senderAddress.contact,
        },
        {
            label: '휴대폰',
            value: letter.senderAddress.phone,
            hidden: !letter.senderAddress.phone,
        },
    ];

    const receiverInfo = [
        { label: '수령인', value: letter.recipientAddress.name },
        { label: '우편번호', value: letter.recipientAddress.zonecode },
        { label: '주소', value: letter.recipientAddress.address1 },
        {
            label: '연락처',
            value: letter.recipientAddress.contact,
            hidden: !letter.recipientAddress.contact,
        },
        {
            label: '휴대폰',
            value: letter.recipientAddress.phone,
            hidden: !letter.recipientAddress.phone,
        },
    ];

    return (
        <div className="mb-8 flex flex-col w-full">
            <div className="text-xl font-semibold mb-8">발송 상세조회</div>
            <div className="flex flex-col gap-8 w-full">
                <InfoTable info={orderInfo} title="주문 정보" />
                <InfoTable info={senderInfo} title="주문자 정보" />
                <InfoTable info={receiverInfo} title="수신자 정보" />
                <div className="w-full flex flex-col">
                    <div className="flex justify-between items-center">
                        <div className="mb-3 text-lg font-semibold">작성된 편지</div>
                        <div>총 {letter.text.length}장</div>
                    </div>

                    <div className="border-t border-primary-black py-6 px-3">
                        <PreviewLetterContent
                            letter={letter}
                            paperImage={letter.template.paperImage}
                            templateConfig={templateConfig}
                        />
                    </div>
                </div>
                {letter.photos.length > 0 && (
                    <div className="w-full">
                        <div className="flex justify-between items-center">
                            <div className="mb-3 text-lg font-semibold">첨부된 사진</div>
                            <div>총 {letter.photos.length}장</div>
                        </div>
                        <div className="border-t border-primary-black py-6 px-3">
                            <PreviewPhoto
                                photos={letter.photos}
                                aspectRatio={
                                    templateConfig.photoSize.width / templateConfig.photoSize.height
                                }
                            />
                        </div>
                    </div>
                )}
                <div>
                    <div className="mb-3 text-lg font-semibold">결제 정보</div>
                    <div className="border-t border-primary-black py-6 px-3">
                        <Receipt
                            priceInfo={letter.priceInfo}
                            pointInfo={letter.pointInfo}
                            paymentMethod={letter.paymentMethod}
                            paymentStatus={letter.paymentStatus}
                        />
                    </div>
                </div>
            </div>
            {letter.paymentMethod === 'transfer' && <AccountAlertToast letter={letter} />}
        </div>
    );
}
