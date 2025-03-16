import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react';
import { useLetter } from '../../_contexts/letter-provider';

interface PointInfoProps {
    isUsingPoint: boolean;
    usePointAmount: number;
    earnPointAmount: number;
    onTogglePointUse: (_use: boolean) => void;
    onApplyPoint: (_amount: number) => void;
    onResetPoint: () => void;
    onUseAllPoint: () => void;
    userPoint: number;
}

export default function PointInfo({
    isUsingPoint,
    usePointAmount,
    onResetPoint,
    userPoint,
}: PointInfoProps) {
    const [_inputAmount, setInputAmount] = useState<string>(
        usePointAmount ? usePointAmount.toString() : '',
    );
    const { totalPrice, applyPoint } = useLetter();
    const pointAvailable = userPoint >= 1000;

    const handleTogglePointUse = (checked: boolean) => {
        if (!checked) {
            setInputAmount('');
            onResetPoint();
        } else {
            const point = Math.min(totalPrice, userPoint);
            console.log(point);
            applyPoint(point);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">포인트 정보</div>
            <div className="w-full h-[1px] bg-primary-black" />

            <div className="flex items-center gap-2 pt-2">
                <Checkbox
                    id="use-point"
                    checked={isUsingPoint}
                    onCheckedChange={handleTogglePointUse}
                    disabled={!pointAvailable}
                />
                <label className="text-sm font-normal text-gray-450" htmlFor="use-point">
                    보유 포인트
                </label>
                <div className="text-sm font-medium flex items-center gap-0.5">
                    <div>{userPoint.toLocaleString()}</div>
                    <div className="text-sm font-normal text-gray-450">P</div>
                </div>
                {!pointAvailable && (
                    <div className="text-sm text-gray-450 font-normal ml-4">
                        1,000 포인트부터 사용 가능합니다.
                    </div>
                )}
            </div>
            {/* 
            {isUsingPoint && pointAvailable && (
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        placeholder="사용할 포인트"
                        max={userPoint}
                    />
                    <Button onClick={onUseAllPoint} variant="outline">
                        전액사용
                    </Button>
                    <Button onClick={handleApplyPoints} variant="secondary">
                        적용
                    </Button>
                </div>
            )} */}
        </div>
    );
}
