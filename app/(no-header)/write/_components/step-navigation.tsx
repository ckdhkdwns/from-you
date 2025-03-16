import React from 'react';
import { useLetter } from '../_contexts/letter-provider';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// 스텝 내비게이션 컴포넌트
export const StepNavigation = () => {
    const { steps, goToStep, currentStepIndex } = useLetter();
    const isMobile = useIsMobile();

    // 스텝 수 계산
    const stepsCount = Object.values(steps).length;

    // 진행 상황에 따른 프로그레스 바 너비 계산
    const progressPercentage = (currentStepIndex / (stepsCount - 1)) * 100;

    const dotSize = isMobile ? 12 : 14;
    const dotInnerSize = isMobile ? 8 : 10;

    const barHeight = isMobile ? 2 : 2;

    return (
        <div className="w-full flex justify-between items-center md:mt-8">
            {Object.values(steps).map((step, index) => (
                <div
                    key={index}
                    className={cn('flex items-center w-full', index === 0 ? 'w-1/2' : 'w-full')}
                >
                    <div
                        className={cn(
                            'w-full rounded-full flex items-center justify-center',
                            index <= currentStepIndex ? 'bg-secondary-newpink' : 'bg-gray-200',
                        )}
                        style={{ height: barHeight }}
                    />

                    <div className="relative">
                        {!isMobile && (
                            <div className="absolute bottom-6 w-max text-sm text-gray-500 left-1/2 -translate-x-1/2">
                                {step.title}
                            </div>
                        )}
                        <div
                            className={cn(
                                'rounded-full flex',
                                index <= currentStepIndex ? 'bg-secondary-newpink' : 'bg-gray-200',
                            )}
                            style={{
                                width: dotSize,
                                height: dotSize,
                                minWidth: dotSize,
                                minHeight: dotSize,
                            }}
                        >
                            <div
                                className="rounded-full bg-white m-auto"
                                style={{
                                    width: dotInnerSize,
                                    height: dotInnerSize,
                                    minWidth: dotInnerSize,
                                    minHeight: dotInnerSize,
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <div
                className="w-1/2 rounded-full bg-gray-200 flex items-center justify-center"
                style={{ height: barHeight }}
            />
        </div>
    );
};
