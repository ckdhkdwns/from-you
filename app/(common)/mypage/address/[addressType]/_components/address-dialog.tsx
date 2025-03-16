'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import AddressInputForm from '@/components/address-input-form';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { AddressInput, AddressPublic } from '@/models/types/address';
import {
    createRecipientAddress,
    createSenderAddress,
    updateUserAddress,
} from '@/models/actions/user-actions';
import KakaoAddressDialog from '@/components/kakao-address-dialog';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

interface AddressDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    addressType: 'recipient' | 'sender';
    address?: AddressPublic; // 수정 시 기존 주소, 추가 시 undefined
}

export default function AddressDialog({
    isOpen,
    onClose,
    onSuccess,
    addressType,
    address,
}: AddressDialogProps) {
    const isEditMode = !!address;

    // 초기 주소 데이터 설정 (수정 모드면 기존 주소, 추가 모드면 빈 주소)
    const initialAddress = isEditMode
        ? address
        : {
              zonecode: '',
              name: '',
              address1: '',
              address2: '',
              contact: '',
              phone: '',
              isDefault: false,
              addressType: addressType,
          };

    const [addressData, setAddressData] = useState<AddressInput | AddressPublic>(initialAddress);

    // 주소 검색 다이얼로그 상태
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDefaultChange = (checked: boolean) => {
        setAddressData(prev => ({
            ...prev,
            isDefault: checked,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEditMode && address) {
                // 수정 모드: 원본 address 객체에서 SK 필드로부터 ID 추출
                const addressId = address.SK ? removeTableKeyPrefix(address.SK) : undefined;

                if (!addressId) {
                    throw new Error('주소 ID를 찾을 수 없습니다.');
                }

                // 수정된 데이터와 ID를 함께 전달
                await updateUserAddress({
                    ...(addressData as AddressInput),
                    id: addressId,
                });

                toast.success('주소가 수정되었습니다.');
            } else {
                // 추가 모드
                if (addressType === 'recipient') {
                    await createRecipientAddress(addressData as AddressInput);
                } else {
                    await createSenderAddress(addressData as AddressInput);
                }
                toast.success('주소가 추가되었습니다.');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(
                isEditMode ? '주소 수정 중 오류 발생:' : '주소 추가 중 오류 발생:',
                error,
            );
            toast.error(isEditMode ? '주소 수정에 실패했습니다.' : '주소 추가에 실패했습니다.');
        }
    };

    // 주소 검색 다이얼로그 열기
    const handleSearch = () => {
        setIsAddressDialogOpen(true);
    };

    // 주소 선택 처리
    const handleSelectAddress = (result: { zonecode: string; address: string }) => {
        setAddressData(prev => ({
            ...prev,
            zonecode: result.zonecode,
            address1: result.address,
        }));
        setIsAddressDialogOpen(false);
    };

    // 다이얼로그 제목 설정
    const dialogTitle = isEditMode
        ? '주소 수정'
        : addressType === 'sender'
          ? '발신 주소 추가'
          : '수신 주소 추가';

    // 버튼 텍스트 설정
    const buttonText = isEditMode ? '수정하기' : '추가하기';

    return (
        <>
            <KakaoAddressDialog
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                onSelectAddress={handleSelectAddress}
            />

            <ResponsiveDialog open={isOpen} onOpenChange={onClose} title={dialogTitle}>
                <AddressInputForm
                    editedAddress={addressData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onDefaultChange={handleDefaultChange}
                    onSearch={handleSearch}
                    checkboxId={`address-${isEditMode ? 'edit' : 'add'}`}
                    buttonText={buttonText}
                />
            </ResponsiveDialog>
        </>
    );
}
