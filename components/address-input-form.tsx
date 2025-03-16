import React from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import UnderlineInput from './ui/underline-input';
import { AddressInput, AddressPublic } from '@/models/types/address';

interface AddressInputFormProps {
    editedAddress: AddressInput | AddressPublic;
    onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
    onDefaultChange: (_checked: boolean) => void;
    onSubmit?: () => void;
    onSearch?: () => void;
    showPrisonerNumberField?: boolean;
    checkboxId?: string;
    buttonText?: string;
}

export default function AddressInputForm({
    editedAddress,
    onChange,
    onDefaultChange,
    onSubmit,
    onSearch,
    showPrisonerNumberField = false,
    checkboxId,
    buttonText = '수정하기',
}: AddressInputFormProps) {
    return (
        <div className="space-y-4">
            <UnderlineInput
                label="이름"
                id="name"
                name="name"
                value={editedAddress.name}
                onChange={onChange}
            />

            <div className="flex items-end gap-2">
                <UnderlineInput
                    label="주소"
                    id="zonecode"
                    name="zonecode"
                    value={editedAddress.zonecode}
                    onChange={onChange}
                    readOnly
                    className="w-full"
                />
                <Button variant="outlinePink" onClick={onSearch}>
                    주소 검색
                </Button>
            </div>

            <UnderlineInput
                id="address1"
                name="address1"
                value={editedAddress.address1}
                onChange={onChange}
                readOnly
            />

            <UnderlineInput
                id="address2"
                name="address2"
                value={editedAddress.address2}
                onChange={onChange}
            />

            {showPrisonerNumberField && (
                <UnderlineInput
                    id="prisonerNumber"
                    label="수용자 번호"
                    name="prisonerNumber"
                    value={editedAddress.prisonerNumber || ''}
                    onChange={onChange}
                />
            )}
            <UnderlineInput
                label="연락처"
                id="contact"
                name="contact"
                value={editedAddress.contact}
                onChange={onChange}
            />

            <UnderlineInput
                label="전화번호"
                id="phone"
                name="phone"
                value={editedAddress.phone}
                onChange={onChange}
            />

            <div className="flex items-center gap-2 pt-2">
                <Checkbox
                    id={`${checkboxId}-isDefault`}
                    defaultChecked={editedAddress.isDefault}
                    onCheckedChange={onDefaultChange}
                    className="text-gray-400 shadow-none border-gray-200 w-4 h-4"
                />
                <Label htmlFor={`${checkboxId}-isDefault`} className="text-gray-400 cursor-pointer">
                    기본 배송지로 설정
                </Label>
            </div>
            {onSubmit && (
                <div className="flex pt-4">
                    <Button onClick={onSubmit} className="w-full h-12">
                        {buttonText}
                    </Button>
                </div>
            )}
        </div>
    );
}
