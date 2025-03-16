'use client';

import React from 'react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useUserData } from '@/contexts/session';
import { AddressPublic } from '@/models/types/address';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddressItem from './address-item';

// AddressPublic에 id 속성을 추가한 확장 인터페이스
interface AddressWithId extends AddressPublic {
    id: string;
}

interface AddressDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAddress: (_address: AddressWithId) => void;
    type: 'recipient' | 'sender';
}

export default function AddressDialog({
    isOpen,
    onClose,
    onSelectAddress,
    type,
}: AddressDialogProps) {
    const { addresses } = useUserData();
    const savedAddresses = addresses[type] as AddressWithId[];

    const handleSelectAddress = (address: AddressWithId) => {
        onSelectAddress(address);
        onClose();
    };

    return (
        <ResponsiveDialog
            open={isOpen}
            onOpenChange={onClose}
            title="주소지 목록"
            contentClassName="sm:max-w-[425px]"
        >
            <ScrollArea className="h-[300px]">
                {savedAddresses.length > 0 ? (
                    <div className="space-y-2">
                        {savedAddresses.map((address, index) => (
                            <AddressItem
                                key={index}
                                address={address}
                                onSelectAddress={handleSelectAddress}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-[300px]">
                        <span className="text-gray-400 text-sm py-8 my-auto">
                            저장된 주소가 없습니다.
                        </span>
                    </div>
                )}
            </ScrollArea>
        </ResponsiveDialog>
    );
}
