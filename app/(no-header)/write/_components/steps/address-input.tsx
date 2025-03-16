'use client';

import React, { useState, useEffect } from 'react';
import { useLetter } from '../../_contexts/letter-provider';

import { Card, CardContent } from '@/components/ui/card';
import KakaoAddressDialog from '@/components/kakao-address-dialog';
import FacilityDialog from '@/components/facility-dialog';
import MilitaryDialog from '@/components/military-dialog';
import { AddressPublic } from '@/models/types/address';
import AddressInputForm from '@/components/address-input-form';
import AddressDialog from '../address-dialog';
import AddressButton from './address-button';

export default function AddressInput() {
    const {
        recipientAddress,
        setRecipientAddress,
        senderAddress,
        setSenderAddress,

        setSaveRecipientAddress,
        setSaveSenderAddress,
    } = useLetter();

    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
    const [isMilitaryDialogOpen, setIsMilitaryDialogOpen] = useState(false);
    const [addressType, setAddressType] = useState<'recipient' | 'sender'>('recipient');
    const [showPrisonerNumberField, setShowPrisonerNumberField] = useState(false);
    const [isSavedAddressDialogOpen, setIsSavedAddressDialogOpen] = useState(false);
    const [savedAddressType, setSavedAddressType] = useState<'recipient' | 'sender'>('recipient');

    // 유효성 검사 상태
    const [errors, setErrors] = useState({
        recipientName: false,
        recipientZonecode: false,
        recipientAddress1: false,
        prisonerNumber: false,
        senderName: false,
        senderZonecode: false,
        senderAddress1: false,
    });

    // 교정시설 선택 여부 확인
    useEffect(() => {
        // 카테고리가 있고, 카테고리에 "교정" 또는 "구치" 등의 단어가 포함되어 있으면 교정시설로 간주
        const isFacility =
            recipientAddress.category &&
            (recipientAddress.category.includes('서울') ||
                recipientAddress.category.includes('경기') ||
                recipientAddress.category.includes('강원') ||
                recipientAddress.category.includes('대구') ||
                recipientAddress.category.includes('부산') ||
                recipientAddress.category.includes('경상') ||
                recipientAddress.category.includes('대전') ||
                recipientAddress.category.includes('충청') ||
                recipientAddress.category.includes('광주') ||
                recipientAddress.category.includes('전라') ||
                recipientAddress.category.includes('제주'));

        setShowPrisonerNumberField(isFacility);
    }, [recipientAddress.category]);

    // 주소 검색 다이얼로그 열기
    const openAddressDialog = (type: 'recipient' | 'sender') => {
        setAddressType(type);
        setIsAddressDialogOpen(true);
    };

    // 시설 선택 다이얼로그 열기
    const openFacilityDialog = (type: 'recipient' | 'sender') => {
        setAddressType(type);
        setIsFacilityDialogOpen(true);
    };

    // 군부대 선택 다이얼로그 열기
    const openMilitaryDialog = (type: 'recipient' | 'sender') => {
        setAddressType(type);
        setIsMilitaryDialogOpen(true);
    };

    // 주소 선택 처리
    const handleSelectAddress = (result: { zonecode: string; address: string }) => {
        if (addressType === 'recipient') {
            setRecipientAddress({
                ...recipientAddress,
                zonecode: result.zonecode,
                address1: result.address,
                category: '', // 카테고리 초기화
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                recipientZonecode: false,
                recipientAddress1: false,
            });
        } else {
            setSenderAddress({
                ...senderAddress,
                zonecode: result.zonecode,
                address1: result.address,
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                senderZonecode: false,
                senderAddress1: false,
            });
        }
    };

    // 시설 선택 처리
    const handleSelectFacility = (facility: AddressPublic) => {
        if (addressType === 'recipient') {
            setRecipientAddress({
                ...recipientAddress,
                name: facility.name,
                zonecode: facility.zonecode,
                address1: facility.address1,
                address2: facility.address2,
                contact: facility.contact,
                phone: facility.phone,
                category: facility.category,
                prisonerNumber: '', // 수용자 번호 초기화
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                recipientName: false,
                recipientZonecode: false,
                recipientAddress1: false,
            });
        } else {
            setSenderAddress({
                ...senderAddress,
                name: facility.name,
                zonecode: facility.zonecode,
                address1: facility.address1,
                address2: facility.address2,
                contact: facility.contact,
                phone: facility.phone,
                category: facility.category,
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                senderName: false,
                senderZonecode: false,
                senderAddress1: false,
            });
        }
    };

    // 군부대 선택 처리
    const handleSelectMilitary = (military: AddressPublic) => {
        if (addressType === 'recipient') {
            setRecipientAddress({
                ...recipientAddress,
                name: military.name,
                zonecode: military.zonecode,
                address1: military.address1,
                address2: military.address2,
                contact: military.contact,
                phone: military.phone,
                category: military.category,
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                recipientName: false,
                recipientZonecode: false,
                recipientAddress1: false,
            });
        } else {
            setSenderAddress({
                ...senderAddress,
                name: military.name,
                zonecode: military.zonecode,
                address1: military.address1,
                address2: military.address2,
                contact: military.contact,
                phone: military.phone,
                category: military.category,
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                senderName: false,
                senderZonecode: false,
                senderAddress1: false,
            });
        }
    };

    // 입력 필드 변경 처리
    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRecipientAddress({
            ...recipientAddress,
            [name]: value,
        });

        // 입력 시 해당 필드의 오류 상태 초기화
        if (name === 'name') {
            setErrors({ ...errors, recipientName: false });
        } else if (name === 'prisonerNumber') {
            setErrors({ ...errors, prisonerNumber: false });
        }
    };

    const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSenderAddress({
            ...senderAddress,
            [name]: value,
        });

        // 입력 시 해당 필드의 오류 상태 초기화
        if (name === 'name') {
            setErrors({ ...errors, senderName: false });
        }
    };

    const handleSelectSavedAddress = (address: AddressPublic) => {
        if (savedAddressType === 'recipient') {
            setRecipientAddress({
                ...recipientAddress,
                ...address,
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                recipientName: false,
                recipientZonecode: false,
                recipientAddress1: false,
            });
        } else {
            setSenderAddress({
                ...senderAddress,
                ...address,
            });
            // 유효성 검사 오류 초기화
            setErrors({
                ...errors,
                senderName: false,
                senderZonecode: false,
                senderAddress1: false,
            });
        }
    };

    return (
        <div className="">
            <KakaoAddressDialog
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                onSelectAddress={handleSelectAddress}
            />

            <FacilityDialog
                isOpen={isFacilityDialogOpen}
                onClose={() => setIsFacilityDialogOpen(false)}
                onSelectFacility={handleSelectFacility}
            />

            <MilitaryDialog
                isOpen={isMilitaryDialogOpen}
                onClose={() => setIsMilitaryDialogOpen(false)}
                onSelectMilitary={handleSelectMilitary}
            />

            <AddressDialog
                isOpen={isSavedAddressDialogOpen}
                onClose={() => setIsSavedAddressDialogOpen(false)}
                onSelectAddress={handleSelectSavedAddress}
                type={savedAddressType}
            />

            <div className="flex flex-col gap-8 px-6 md:px-0 py-4 pb-8 4 md:py-16 max-w-3xl mx-auto mt-4">
                <div className="flex flex-col md:flex-row items-start gap-2">
                    <div className="flex flex-col justify-between items-start pt-2 min-w-[200px]">
                        <div className="text-lg font-semibold">보내는 사람</div>
                        <div className="flex flex-col gap-0 items-start mt-2">
                            <AddressButton
                                label="저장된 주소 불러오기"
                                onClick={() => {
                                    setSavedAddressType('sender');
                                    setIsSavedAddressDialogOpen(true);
                                }}
                            />
                        </div>
                    </div>
                    <Card
                        className="border-none rounded-none shadow-none bg-transparent p-1.5 max-w-xl mx-auto w-full"
                        style={{
                            backgroundImage: 'url(/envelope.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="bg-white pt-6">
                            <CardContent className="space-y-4">
                                <AddressInputForm
                                    checkboxId="sender"
                                    editedAddress={senderAddress}
                                    onChange={handleSenderChange}
                                    onDefaultChange={checked => setSaveSenderAddress(checked)}
                                    onSearch={() => openAddressDialog('sender')}
                                />
                            </CardContent>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col md:flex-row items-start gap-2">
                    <div className="flex flex-col justify-between items-start pt-2 min-w-[200px]">
                        <div className="text-lg font-semibold">받는 사람</div>
                        <div className="flex flex-col gap-0 items-start mt-2">
                            <AddressButton
                                label="저장된 주소 불러오기"
                                onClick={() => {
                                    setSavedAddressType('recipient');
                                    setIsSavedAddressDialogOpen(true);
                                }}
                            />
                            <AddressButton
                                label="교정시설"
                                onClick={() => openFacilityDialog('recipient')}
                            />
                            <AddressButton
                                label="군부대"
                                onClick={() => openMilitaryDialog('recipient')}
                            />
                        </div>
                    </div>
                    <Card
                        className="border-none rounded-none shadow-none bg-transparent p-1.5 max-w-xl mx-auto w-full"
                        style={{
                            backgroundImage: 'url(/envelope.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="bg-white pt-6">
                            <CardContent className="space-y-4">
                                <AddressInputForm
                                    checkboxId="recipient"
                                    editedAddress={recipientAddress}
                                    onChange={handleRecipientChange}
                                    onDefaultChange={checked => setSaveRecipientAddress(checked)}
                                    onSearch={() => openAddressDialog('recipient')}
                                    showPrisonerNumberField={showPrisonerNumberField}
                                />
                            </CardContent>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
