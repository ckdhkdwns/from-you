import React from 'react';
import { getTemplateById } from '@/models/actions/template-actions';
import { getLetterAction } from '@/models/actions/letter-actions';
import { getSendTimeConfigAction, getTemplateConfigAction } from '@/models/actions/config-actions';
import { LetterPublic } from '@/models/types/letter';
import { LetterProvider } from './_contexts/letter-provider';
import LetterUI from './_components/letter-ui';
import { STEP_KEYS, StepKey } from './_types/steps';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/models/actions/user-actions';

const WritePage = async ({
    searchParams,
}: {
    searchParams: Promise<{
        lid?: string;
        tid?: string;
        from?: string;
        step?: string;
    }>;
}) => {
    const { lid, tid, step } = await searchParams;

    const { data: user } = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const { data: sendTimeConfig } = await getSendTimeConfigAction();
    const { data: templateConfig } = await getTemplateConfigAction();
    const { data: template } = await getTemplateById(tid);

    let letter: LetterPublic | null = null;

    if (lid) {
        const { data: letterData, error } = await getLetterAction(lid);

        // 이미 결제된 편지인 경우 마이페이지로 리다이렉트
        if (error && error.message === '이미 결제된 편지입니다.') {
            redirect(`/mypage/letters/sent?error=already-paid`);
        }

        letter = letterData;
    }

    // step 파라미터가 유효한 StepKey인지 확인
    const initialStep =
        step && Object.values(STEP_KEYS).includes(step as StepKey) ? (step as StepKey) : undefined;

    return (
        <LetterProvider
            initialLetter={letter}
            initialTemplate={template}
            templateConfig={templateConfig}
            sendTimeConfig={sendTimeConfig}
            initialStep={initialStep}
        >
            <LetterUI />
        </LetterProvider>
    );
};

export default WritePage;
