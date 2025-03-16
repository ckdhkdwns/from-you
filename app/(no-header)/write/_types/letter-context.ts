import { AddressPublic } from '@/models/types/address';
import { TemplatePublic } from '@/models/types/template';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { STEP_INFO, StepKey } from './steps';

import { SendTimeConfigPublic } from '@/models/types/send-time-config';
import { Font, Photo } from '@/models/types/letter';

export interface LetterContextType {
    // 템플릿 관련
    templateConfig: TemplateConfigPublic;
    sendTimeConfig: SendTimeConfigPublic;
    template: TemplatePublic | null;

    // 폰트 관련
    font: Font;
    setFont: (_font: Font) => void;

    // 내용 관련
    text: string[];
    setText: (_text: string[] | ((_prev: string[]) => string[])) => void;
    photo: Photo[];
    setPhoto: (_photo: Photo[]) => void;

    // 주소 관련
    recipientAddress: AddressPublic;
    setRecipientAddress: (_address: AddressPublic) => void;
    senderAddress: AddressPublic;
    setSenderAddress: (_address: AddressPublic) => void;
    postTypes: string;
    setPostTypes: (_postTypes: string) => void;
    saveRecipientAddress: boolean;
    setSaveRecipientAddress: (_save: boolean) => void;
    saveSenderAddress: boolean;
    setSaveSenderAddress: (_save: boolean) => void;

    // 스텝 관련
    currentStep: StepKey;
    currentStepIndex: number;
    steps: typeof STEP_INFO;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (_step: StepKey) => void;
    isFirstStep: boolean;
    isLastStep: boolean;

    // 저장 관련
    saveDraft: (_isAutoSave?: boolean) => Promise<boolean>;
    isLoading: boolean;
    isAutoSaving: boolean;
    letterId: string | null;
    isEditing: boolean;

    // 가격 관련
    totalPrice: number;
    photoPrice: number;
    paperPrice: number;
    postTypePrice: number;
    initialPrice: number;

    // 포인트 관련
    isUsingPoint: boolean;
    usePointAmount: number;
    earnPointAmount: number;
    setIsUsingPoint: (_use: boolean) => void;
    setUsePointAmount: (_amount: number) => void;
    applyPoint: (_amount: number) => void;
    resetPoint: () => void;
    useAllPoint: (_availablePoint: number) => void;

    // 결제 관련
    paymentMethod: string;
    setPaymentMethod: (_method: string) => void;
    tossPaymentMethod: string | null;
    setTossPaymentMethod: (_method: string | null) => void;
}
