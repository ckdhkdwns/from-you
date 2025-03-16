'use client';

import DaumPostcode from 'react-daum-postcode';
import { ResponsiveDialog } from './ui/responsive-dialog';

interface KakaoAddressDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress: (_result: { zonecode: string; address: string }) => void;
}

export default function KakaoAddressDialog({
    isOpen,
    onClose,
    onSelectAddress,
}: KakaoAddressDialogProps) {
    // 주소 선택 완료 핸들러
    const handleComplete = (data: {
        zonecode: string;
        roadAddress: string;
        jibunAddress: string;
    }) => {
        // 사용자가 선택한 주소 데이터 전달
        onSelectAddress({
            zonecode: data.zonecode,
            address: data.roadAddress || data.jibunAddress,
        });

        // 다이얼로그 닫기
        onClose();
    };

    const dialogContent = (
        <div className="border-t border-primary-black h-[80vh] md:h-[60vh] -mt-6 md:mt-0">
            <DaumPostcode
                onComplete={handleComplete}
                style={{ height: '100%', width: '100%' }}
                autoClose={false}
                animation={false}
            />
        </div>
    );

    return (
        <ResponsiveDialog
            open={isOpen}
            onOpenChange={onClose}
            title={
                <div className="h-0 md:h-12 hidden md:flex items-center justify-center text-lg">
                    주소 검색
                </div>
            }
            contentClassName=" sm:max-w-[600px] max-h-[80vh] h-fit min-h-[60vh] overflow-hidden p-0 !bg-primary-white gap-0"
        >
            {dialogContent}
        </ResponsiveDialog>
    );
}
