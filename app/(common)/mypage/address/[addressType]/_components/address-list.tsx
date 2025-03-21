'use client';

import { AddressPublic } from '@/models/types/address';
import { useState } from 'react';
import { deleteUserAddress } from '@/models/actions/user-actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import AddressDialog from './address-dialog';

interface AddressListProps {
    addresses: AddressPublic[];
    addressType: 'recipient' | 'sender';
}

export default function AddressList({ addresses, addressType }: AddressListProps) {
    const [editingAddress, setEditingAddress] = useState<AddressPublic | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleEdit = (address: AddressPublic) => {
        setEditingAddress(address);
    };

    const handleDelete = async (address: AddressPublic) => {
        if (!removeTableKeyPrefix(address?.SK)) {
            toast.error('주소 ID가 없습니다.');
            return;
        }

        if (!confirm('정말로 이 주소를 삭제하시겠습니까?')) {
            return;
        }

        try {
            await deleteUserAddress(removeTableKeyPrefix(address?.SK));
            toast.success('주소가 삭제되었습니다.');
            // 페이지 새로고침
            window.location.reload();
        } catch (error) {
            console.error('주소 삭제 중 오류 발생:', error);
            toast.error('주소 삭제에 실패했습니다.');
        }
    };

    const handleAddAddress = () => {
        setIsAddDialogOpen(true);
    };

    return (
        <div>
            <div className="space-y-6 pt-4">
                {addresses.length === 0 ? (
                    <div className="w-full py-8 text-center text-gray-500">
                        등록된 주소가 없습니다. 주소를 추가해주세요.
                    </div>
                ) : (
                    addresses.map((address, index) => (
                        <div key={index} className="w-full border-b border-gray-300 pb-5 px-4">
                            <div className="flex flex-col justify-start items-start w-full gap-3">
                                <div className="flex justify-between items-center w-full pr-4">
                                    <div className="flex justify-start items-center gap-3">
                                        <p className="text-base font-medium">{address.name}</p>
                                        {address.isDefault && (
                                            <div className="flex justify-center items-center h-[26px] px-4 py-1 rounded-[100px] bg-[#f8d3d5]/10 border border-[#f8d3d5]">
                                                <p className="text-xs text-gray-500">
                                                    {addressType === 'sender'
                                                        ? '기본 발신지'
                                                        : '기본 수신지'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="text-sm text-gray-400 hover:text-gray-500"
                                            onClick={() => handleEdit(address)}
                                        >
                                            수정
                                        </button>
                                        <div className="w-px h-2.5 bg-gray-300" />
                                        <button
                                            className="text-sm text-gray-400 hover:text-gray-500"
                                            onClick={() => handleDelete(address)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start items-start self-stretch gap-1.5">
                                    <p className="w-full text-sm text-gray-450">
                                        ({address.zonecode}) {address.address1}
                                    </p>
                                    {address.address2 && (
                                        <p className="w-full text-sm text-gray-450">
                                            {address.address2}
                                        </p>
                                    )}
                                    {address.contact && (
                                        <p className="text-sm text-gray-450">{address.contact}</p>
                                    )}
                                    {address.phone && (
                                        <p className="w-full text-sm text-gray-450">
                                            {address.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <Button
                    variant="outlinePink"
                    onClick={handleAddAddress}
                    className="flex items-center gap-2 mt-2 mb-4 text-gray-500 mx-auto"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>주소 추가하기</span>
                </Button>

                {/* 통합된 AddressDialog 컴포넌트 사용 */}
                {/* 수정 모드 */}
                {editingAddress && (
                    <AddressDialog
                        address={editingAddress}
                        isOpen={!!editingAddress}
                        onClose={() => setEditingAddress(null)}
                        onSuccess={() => window.location.reload()}
                        addressType={addressType}
                    />
                )}

                {/* 추가 모드 */}
                <AddressDialog
                    isOpen={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                    onSuccess={() => window.location.reload()}
                    addressType={addressType}
                />
            </div>
        </div>
    );
}
