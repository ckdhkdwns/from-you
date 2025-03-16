import { useState, useCallback, useEffect } from 'react';
import { STEP_KEYS, StepKey, letterSequence, STEP_INFO, STEP_STATUS } from '../_types/steps';
import { AddressPublic } from '@/models/types/address';
import { validateLetterData } from '../_libs/validate';
import { toast } from 'sonner';

interface UseLetterStepsReturn {
    currentStep: StepKey;
    currentStepIndex: number;
    steps: typeof STEP_INFO;
    isFirstStep: boolean;
    isLastStep: boolean;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (_step: StepKey) => void;
    updateStepStatus: (_step: StepKey, _status: string) => void;
}

export const useLetterSteps = ({
    text,
    recipientAddress,
    senderAddress,
    postTypes,
    initialStep,
}: {
    text: string[];
    recipientAddress: AddressPublic;
    senderAddress: AddressPublic;
    postTypes: string;
    initialStep?: StepKey;
}): UseLetterStepsReturn => {
    const [currentStep, setCurrentStep] = useState<StepKey>(
        initialStep || STEP_KEYS.LETTER_CONTENT,
    );
    const [steps, setSteps] = useState(STEP_INFO);

    // 초기 스텝이 설정된 경우 해당 스텝의 상태를 진행중으로 변경
    useEffect(() => {
        if (initialStep) {
            setSteps(prev => ({
                ...prev,
                [initialStep]: {
                    ...prev[initialStep],
                    subtitle: STEP_STATUS.IN_PROGRESS,
                },
            }));
        }
    }, [initialStep]);

    const currentStepIndex = letterSequence.indexOf(currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === letterSequence.length - 1;

    const goToNextStep = useCallback(() => {
        if (isLastStep) {
            return;
        }

        const { isValid, errorMessage } = validateLetterData({
            currentStep: letterSequence[currentStepIndex],
            text,
            recipientAddress,
            senderAddress,
            postTypes,
        });

        if (!isValid) {
            toast.warning(errorMessage);
            return;
        }

        const nextStep = letterSequence[currentStepIndex + 1];
        setCurrentStep(nextStep);

        // 다음 스텝의 상태를 진행중으로 변경
        setSteps(prev => ({
            ...prev,
            [nextStep]: {
                ...prev[nextStep],
                subtitle: STEP_STATUS.IN_PROGRESS,
            },
        }));
    }, [currentStepIndex, isLastStep, text, recipientAddress, senderAddress, postTypes]);

    const goToPreviousStep = useCallback(() => {
        if (isFirstStep) {
            return;
        }

        setCurrentStep(letterSequence[currentStepIndex - 1]);
    }, [currentStepIndex, isFirstStep]);

    const goToStep = useCallback(
        (step: StepKey) => {
            const targetStepIndex = letterSequence.indexOf(step);

            if (targetStepIndex === -1) {
                return;
            }

            if (targetStepIndex > currentStepIndex) {
                const { isValid, errorMessage } = validateLetterData({
                    currentStep: letterSequence[currentStepIndex],
                    text,
                    recipientAddress,
                    senderAddress,
                    postTypes,
                });

                if (!isValid) {
                    toast.warning(errorMessage, {
                        classNames: {
                            toast: '!bottom-32',
                        },
                        className: '!bottom-32',
                    });
                    return;
                }
            }

            setCurrentStep(step);

            // 선택한 스텝의 상태를 진행중으로 변경
            setSteps(prev => ({
                ...prev,
                [step]: {
                    ...prev[step],
                    subtitle: STEP_STATUS.IN_PROGRESS,
                },
            }));
        },
        [currentStepIndex, text, recipientAddress, senderAddress, postTypes],
    );

    const updateStepStatus = useCallback((step: StepKey, status: string) => {
        setSteps(prev => ({
            ...prev,
            [step]: {
                ...prev[step],
                subtitle: status,
            },
        }));
    }, []);

    return {
        currentStep,
        currentStepIndex,
        steps,
        isFirstStep,
        isLastStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        updateStepStatus,
    };
};
