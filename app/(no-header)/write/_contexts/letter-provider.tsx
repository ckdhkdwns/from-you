'use client';

import { createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { STEP_INFO, STEP_KEYS, StepKey } from '../_types/steps';
import { useLetterSteps } from '../_hooks/use-letter-steps';
import useLetterPrice from '../_hooks/use-letter-price';
import usePointManagement from '../_hooks/use-point-management';
import { useLetterState } from '../_hooks/use-letter-state';
import { useLetterActions } from '../_hooks/use-letter-actions';
import { LetterContextType } from '../_types/letter-context';
import { LetterPublic } from '@/models/types/letter';
import { TemplatePublic } from '@/models/types/template';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { SendTimeConfigPublic } from '@/models/types/send-time-config';
import { AddressPublic } from '@/models/types/address';
// 초기 컨텍스트 값
const createInitialContextValue = (): LetterContextType => ({
    templateConfig: {} as LetterContextType['templateConfig'],
    sendTimeConfig: {} as LetterContextType['sendTimeConfig'],
    font: {
        size: 'large',
        color: '#000000',
        family: 'Pretendard-Regular',
        align: 'left',
    },
    setFont: () => {},
    text: [],
    setText: () => {},
    photo: [],
    setPhoto: () => {},
    recipientAddress: {
        zonecode: '',
        name: '',
        address1: '',
        address2: '',
        contact: '',
        phone: '',
    } as AddressPublic,
    setRecipientAddress: () => {},
    senderAddress: {
        zonecode: '',
        name: '',
        address1: '',
        address2: '',
        contact: '',
        phone: '',
    } as AddressPublic,
    setSenderAddress: () => {},
    postTypes: '',
    setPostTypes: () => {},
    currentStep: STEP_KEYS.LETTER_CONTENT,
    currentStepIndex: 0,
    steps: STEP_INFO,
    goToNextStep: () => {},
    goToPreviousStep: () => {},
    goToStep: () => {},
    isFirstStep: true,
    isLastStep: false,
    saveDraft: async () => false,
    isLoading: false,
    isAutoSaving: false,
    letterId: null,
    isEditing: false,
    template: null,
    totalPrice: 0,
    photoPrice: 0,
    paperPrice: 0,
    postTypePrice: 0,
    initialPrice: 0,
    saveRecipientAddress: false,
    setSaveRecipientAddress: () => {},
    saveSenderAddress: false,
    setSaveSenderAddress: () => {},
    isUsingPoint: false,
    usePointAmount: 0,
    earnPointAmount: 0,
    setIsUsingPoint: () => {},
    setUsePointAmount: () => {},
    applyPoint: () => {},
    resetPoint: () => {},
    useAllPoint: () => {},
    paymentMethod: '',
    setPaymentMethod: () => {},
    tossPaymentMethod: null,
    setTossPaymentMethod: () => {},
});

export const LetterProviderContext = createContext<LetterContextType>(createInitialContextValue());

// LetterProvider에 서버에서 초기화한 파라미터들을 props로 추가
interface LetterProviderProps {
    children: React.ReactNode;

    initialLetter: LetterPublic | null;
    initialTemplate: TemplatePublic;

    templateConfig: TemplateConfigPublic;
    sendTimeConfig: SendTimeConfigPublic;
    initialStep?: StepKey;
}

export const LetterProvider = ({
    initialLetter,
    initialTemplate,
    templateConfig,
    sendTimeConfig,
    initialStep,
    children,
}: LetterProviderProps) => {
    const searchParams = useSearchParams();

    const letterState = useLetterState(
        initialLetter,
        initialTemplate,
        templateConfig,
        sendTimeConfig,
    );

    // 스텝 관리를 위한 훅 사용
    const {
        currentStep,
        currentStepIndex,
        steps,
        goToNextStep: originalGoToNextStep,
        goToPreviousStep: originalGoToPreviousStep,
        goToStep: originalGoToStep,
        isFirstStep,
        isLastStep,
    } = useLetterSteps({
        text: letterState.text,
        recipientAddress: letterState.recipientAddress as AddressPublic,
        senderAddress: letterState.senderAddress as AddressPublic,
        postTypes: letterState.postTypes,
        initialStep: initialStep,
    });

    // URL 파라미터 업데이트 함수
    const updateUrlWithStep = (step: StepKey) => {
        const params = new URLSearchParams(searchParams.toString());

        // 이미 존재하는 파라미터들 유지 (lid, tid, from 등)
        params.set('step', step);

        // URL 업데이트 (히스토리에 추가하지 않음)
        const url = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', url);
    };

    // currentStep이 변경될 때마다 URL 업데이트
    useEffect(() => {
        if (currentStep) {
            updateUrlWithStep(currentStep);
        }
    }, [currentStep]);

    // 편지 가격 계산을 위한 훅 사용
    const { photoPrice, paperPrice, postTypePrice, initialPrice, totalPrice, applyUsePoint } =
        useLetterPrice({
            template: letterState.template,
            paperCount: letterState.text.length,
            photoCount: letterState.photo.length,
            postType: letterState.postTypes,
        });

    // 포인트 관리를 위한 훅 사용
    const {
        isUsingPoint: pointManagementIsUsingPoint,
        usePointAmount: pointManagementUsePointAmount,
        earnPointAmount: pointManagementEarnPointAmount,
        setIsUsingPoint: pointManagementSetIsUsingPoint,
        setUsePointAmount: pointManagementSetUsePointAmount,
        applyPoint: pointManagementApplyPoint,
        resetPoint: pointManagementResetPoint,
        useAllPoint: pointManagementUseAllPoint,
    } = usePointManagement({
        totalPrice,
        paymentMethod: letterState.paymentMethod,
        tossPaymentMethod: letterState.tossPaymentMethod,
        applyUsePoint,
    });

    // 편지 관련 액션을 위한 훅 사용
    const { saveDraft, withAutoSave } = useLetterActions({
        letterState,
        currentStep,
    });

    // 포인트 사용 상태 동기화
    useEffect(() => {
        letterState.setIsUsingPoint(pointManagementIsUsingPoint);
    }, [pointManagementIsUsingPoint]);

    // 스텝 변경 시 자동 저장 기능을 추가한 함수들
    const goToNextStep = async () => await withAutoSave(originalGoToNextStep);
    const goToPreviousStep = async () => await withAutoSave(originalGoToPreviousStep);
    const goToStep = async (step: StepKey) => await withAutoSave(() => originalGoToStep(step));

    return (
        <LetterProviderContext.Provider
            value={{
                templateConfig: letterState.templateConfig,
                sendTimeConfig: letterState.sendTimeConfig,
                template: letterState.template,
                font: letterState.font,
                setFont: letterState.setFont,
                text: letterState.text,
                setText: letterState.setText,
                photo: letterState.photo,
                setPhoto: letterState.setPhoto,
                recipientAddress: letterState.recipientAddress as AddressPublic,
                setRecipientAddress: letterState.setRecipientAddress,
                senderAddress: letterState.senderAddress as AddressPublic,
                setSenderAddress: letterState.setSenderAddress,
                postTypes: letterState.postTypes,
                setPostTypes: letterState.setPostTypes,
                currentStep,
                currentStepIndex,
                steps,
                goToNextStep,
                goToPreviousStep,
                goToStep,
                isFirstStep,
                isLastStep,
                saveDraft,
                isLoading: letterState.isLoading,
                isAutoSaving: letterState.isAutoSaving,
                letterId: letterState.letterId,
                isEditing: letterState.isEditing,
                totalPrice,
                photoPrice,
                paperPrice,
                postTypePrice,
                initialPrice,
                saveRecipientAddress: letterState.saveRecipientAddress,
                setSaveRecipientAddress: letterState.setSaveRecipientAddress,
                saveSenderAddress: letterState.saveSenderAddress,
                setSaveSenderAddress: letterState.setSaveSenderAddress,
                isUsingPoint: pointManagementIsUsingPoint,
                usePointAmount: pointManagementUsePointAmount,
                earnPointAmount: pointManagementEarnPointAmount,
                setIsUsingPoint: pointManagementSetIsUsingPoint,
                setUsePointAmount: pointManagementSetUsePointAmount,
                applyPoint: pointManagementApplyPoint,
                resetPoint: pointManagementResetPoint,
                useAllPoint: pointManagementUseAllPoint,
                paymentMethod: letterState.paymentMethod,
                setPaymentMethod: letterState.setPaymentMethod,
                tossPaymentMethod: letterState.tossPaymentMethod,
                setTossPaymentMethod: letterState.setTossPaymentMethod,
            }}
        >
            {children}
        </LetterProviderContext.Provider>
    );
};

export const useLetter = () => {
    return useContext(LetterProviderContext);
};
