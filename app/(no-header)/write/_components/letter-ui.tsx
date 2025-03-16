'use client';

import React from 'react';
import { STEP_KEYS, StepKey } from '../_types/steps';
import LetterContent from './steps/letter-content';
import { useLetter } from '../_contexts/letter-provider';
import PhotoUpload from './steps/photo-upload';
import AddressInput from './steps/address-input';
import PostTypeSelection from './steps/post-type-selection';
import Payment from './steps/payment';
import { StepNavigation } from './step-navigation';
import { StepControls } from './step-controls';
import WriteHeader from '@/components/headers/write-header';

const STEP_COMPONENTS: Record<StepKey, React.FC> = {
    [STEP_KEYS.LETTER_CONTENT]: LetterContent,
    [STEP_KEYS.PHOTO]: PhotoUpload,
    [STEP_KEYS.ADDRESS]: AddressInput,
    [STEP_KEYS.POST_TYPES]: PostTypeSelection,
    [STEP_KEYS.PAYMENT]: Payment,
};

const StepContent = () => {
    const { currentStep } = useLetter();
    const Component = STEP_COMPONENTS[currentStep];

    return (
        <div className="flex-1 overflow-y-auto overscroll-y-contain">
            <Component />
        </div>
    );
};

const LetterUI = () => {
    const { currentStep } = useLetter();

    return (
        <div className="flex flex-col h-[100dvh]">
            <WriteHeader currentStep={currentStep} />
            <StepNavigation />
            <StepContent />
            <div className="sticky bottom-0 left-0 right-0 bg-white">
                <StepControls />
            </div>
        </div>
    );
};

export default LetterUI;
