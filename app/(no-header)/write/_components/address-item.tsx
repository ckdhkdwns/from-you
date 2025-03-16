import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AddressPublic } from '@/models/types/address';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

export default function AddressItem({
    address,
    onSelectAddress,
}: {
    address: AddressPublic;
    onSelectAddress: (_address: AddressPublic) => void;
}) {
    return (
        <div
            className="flex flex-col justify-start items-start  relative gap-6 cursor-pointer"
            onClick={() => {
                onSelectAddress(address);
            }}
        >
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[314px] gap-3">
                <div className="flex justify-start items-center  gap-3 pr-4">
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-3">
                        <RadioGroup>
                            <RadioGroupItem
                                value={removeTableKeyPrefix(address.SK)}
                                checked={address.isDefault}
                            />
                        </RadioGroup>
                        <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#333]">
                            {address.name}
                        </p>
                        {address.isDefault && (
                            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-[26px] relative gap-2.5 px-4 py-1 rounded-[100px] bg-[#f8d3d5]/10 border border-[#f8d3d5]">
                                <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-[#4f4f4f]">
                                    기본 발신지
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start  relative gap-1.5">
                    <p className=" w-[314px] text-sm text-left text-[#777]">
                        ({address.zonecode}) {address.address1}
                    </p>
                    <p className=" w-[314px] text-sm text-left text-[#777]">{address.address2}</p>
                    <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#777]">
                        {address.contact}
                    </p>
                    <p className=" w-[314px] text-sm text-left text-[#777]">{address.phone}</p>
                </div>
            </div>
            <div className=" h-px border border-[#e0e0e0]/60" />
        </div>
    );
}
