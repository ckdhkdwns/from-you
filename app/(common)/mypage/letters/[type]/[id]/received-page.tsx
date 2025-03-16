import React from 'react';
import { notFound } from 'next/navigation';
import { getReceivedLetterByIdAction } from '@/models/actions/received-letter-action';
import { parseDate } from '@/lib/date';
import InfoTable from '../_components/info-table';
import PhotoViewer from './_components/photo-viewer';
import { getUserIdBySession } from '@/lib/auth';

export default async function ReceivedPage({
    params,
}: {
    params: Promise<{ id: string; type: string }>;
}) {
    const { id } = await params;
    const userId = await getUserIdBySession();
    const letterResponse = await getReceivedLetterByIdAction({
        userId,
        letterId: id,
    });

    if (!letterResponse.success || !letterResponse.data) {
        notFound();
    }

    const letter = letterResponse.data;

    const letterInfo = [
        {
            label: '보낸 사람',
            value: letter.senderName || '알 수 없음',
        },
        {
            label: '받은 날짜',
            value: parseDate(letter.createdAt),
        },
    ];

    return (
        <div className="container mx-auto px-4">
            <div className="text-lg font-semibold mb-8">받은 편지 상세</div>

            <div className="mb-8">
                <InfoTable info={letterInfo} title="편지 정보" />
            </div>

            <PhotoViewer photos={letter.photos} />
        </div>
    );
}
