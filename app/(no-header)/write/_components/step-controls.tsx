import { Button } from '@/components/ui/button';
import { useLetter } from '../_contexts/letter-provider';
import { STEP_KEYS } from '../_types/steps';
import { cn } from '@/lib/utils';
import SendCountdown from './send-time-countdown';
import { ChevronLeft } from 'lucide-react';

// 임시저장 버튼 컴포넌트
const SaveDraftButton = () => {
    const { saveDraft, isLoading, isAutoSaving, currentStep } = useLetter();

    // 결제 단계에선 임시저장 버튼 숨기기
    if (currentStep === STEP_KEYS.PAYMENT) return null;

    return (
        <Button
            onClick={e => {
                e.preventDefault();
                saveDraft(false);
            }}
            disabled={isLoading || isAutoSaving}
            variant="outline"
            className="flex items-center gap-2"
        >
            {isLoading || isAutoSaving ? '저장 중...' : '임시저장'}
        </Button>
    );
};

// 스텝 컨트롤 버튼 컴포넌트
export const StepControls = () => {
    const { goToPreviousStep, goToNextStep, isFirstStep, isLastStep } = useLetter();

    return (
        <div className="flex justify-between container mx-auto bg-white py-3.5 px-6 relative">
            <div className="w-full absolute -top-14 left-0">
                <SendCountdown />
            </div>
            <Button
                variant="ghost"
                onClick={goToPreviousStep}
                className={cn('!px-1')}
                disabled={isFirstStep}
            >
                <ChevronLeft className="h-4 w-4" />
                이전 단계
            </Button>

            <div className="flex items-center gap-2">
                <SaveDraftButton />

                {!isLastStep && (
                    <Button
                        onClick={goToNextStep}
                        disabled={isLastStep}
                        className="px-6 "
                        variant="lightPink"
                    >
                        다음 단계
                    </Button>
                )}
            </div>
        </div>
    );
};
