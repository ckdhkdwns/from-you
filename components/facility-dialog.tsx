'use client';

import { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FACILITY_ADDRESSES } from '@/constants/data/facility';
import { Search } from 'lucide-react';
import { AddressPublic } from '@/models/types/address';
import { ScrollArea } from './ui/scroll-area';
import RoundedTabs from './ui/rounded-tabs';
import { ResponsiveDialog } from './ui/responsive-dialog';

interface FacilityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectFacility: (_facility: AddressPublic) => void;
}

export default function FacilityDialog({ isOpen, onClose, onSelectFacility }: FacilityDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRegion, setActiveRegion] = useState<string>('전체');

    // 지역 카테고리 추출 및 중복 제거
    const regions = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(FACILITY_ADDRESSES.map(facility => facility.category)),
        );
        return ['전체', ...uniqueCategories];
    }, []);

    // 지역 탭 생성
    const regionTabs = useMemo(() => {
        return regions.map(region => ({
            label: region,
            value: region,
        }));
    }, [regions]);

    // 검색어와 선택된 지역에 따라 시설 필터링
    const filteredFacilities = useMemo(() => {
        const term = searchTerm.toLowerCase();

        return FACILITY_ADDRESSES.filter(facility => {
            // 검색어 필터링
            const matchesSearch =
                facility.name.toLowerCase().includes(term) ||
                facility.category.toLowerCase().includes(term) ||
                facility.address1.toLowerCase().includes(term);

            // 지역 필터링
            const matchesRegion = activeRegion === '전체' || facility.category === activeRegion;

            return matchesSearch && matchesRegion;
        });
    }, [searchTerm, activeRegion]);

    // 시설 선택 핸들러
    const handleSelectFacility = (facility: AddressPublic) => {
        onSelectFacility(facility);
        onClose();
    };

    // 지역 탭 선택 핸들러
    const handleRegionTabClick = (tab: { label: string; value: string }) => {
        setActiveRegion(tab.value);
    };

    const dialogContent = (
        <>
            <div className="flex items-center space-x-2 my-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                    <input
                        placeholder="시설명 또는 지역으로 검색"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="text-sm bg-transparent w-full pl-12 pr-2.5 py-2.5  border-b border-[#E5E5E5] focus:outline-none focus:ring-0 rounded-none"
                    />
                </div>
            </div>

            <div className="mb-4 overflow-x-auto">
                <RoundedTabs
                    tabs={regionTabs}
                    activeTab={{
                        label: activeRegion,
                        value: activeRegion,
                    }}
                    onClick={handleRegionTabClick}
                />
            </div>

            <ScrollArea className="h-[50dvh] md:h-[50vh]">
                <div className="pb-4">
                    {/* 데스크탑 화면에서만 보이는 테이블 */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>시설명</TableHead>
                                    <TableHead>지역</TableHead>
                                    <TableHead>주소</TableHead>
                                    <TableHead className="w-[100px] text-right">선택</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFacilities.length > 0 ? (
                                    filteredFacilities.map((facility, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {facility.name}
                                            </TableCell>
                                            <TableCell>{facility.category}</TableCell>
                                            <TableCell className="max-w-[250px] truncate">
                                                {facility.address1}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleSelectFacility(
                                                            facility as AddressPublic,
                                                        )
                                                    }
                                                >
                                                    선택
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-gray-400"
                                        >
                                            검색 결과가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* 모바일 화면에서 보이는 카드 형태 */}
                    <div className="md:hidden">
                        {filteredFacilities.length > 0 ? (
                            filteredFacilities.map((facility, index) => (
                                <div
                                    key={index}
                                    className="border-t px-6 pt-6 pb-2.5 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectFacility(facility as AddressPublic)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-base">{facility.name}</div>
                                        <div className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                                            {facility.category}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3 truncate">
                                        {facility.address1}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </>
    );

    return (
        <ResponsiveDialog
            open={isOpen}
            onOpenChange={onClose}
            title="교정시설 선택"
            contentClassName="w-full sm:max-w-[700px] max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col pb-0"
        >
            {dialogContent}
        </ResponsiveDialog>
    );
}
