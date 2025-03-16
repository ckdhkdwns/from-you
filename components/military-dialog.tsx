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

import { Search } from 'lucide-react';
import { AddressPublic } from '@/models/types/address';
import { ScrollArea } from './ui/scroll-area';
import RoundedTabs from './ui/rounded-tabs';
import { MILITARY_ADDRESSES, MILITARY_CATEGORY_MAP } from '@/constants';
import { ResponsiveDialog } from './ui/responsive-dialog';

interface MilitaryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectMilitary: (_military: AddressPublic) => void;
}

export default function MilitaryDialog({ isOpen, onClose, onSelectMilitary }: MilitaryDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('전체');

    // 군종 카테고리 추출 및 중복 제거
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(MILITARY_ADDRESSES.map(military => military.category)),
        );
        return ['전체', ...uniqueCategories];
    }, []);

    // 군종 탭 생성
    const categoryTabs = useMemo(() => {
        return categories.map(category => ({
            label: category === '전체' ? '전체' : MILITARY_CATEGORY_MAP[category] || category,
            value: category,
        }));
    }, [categories]);

    // 검색어와 선택된 군종에 따라 군부대 필터링
    const filteredMilitaries = useMemo(() => {
        const term = searchTerm.toLowerCase();

        return MILITARY_ADDRESSES.filter(military => {
            // 검색어 필터링
            const matchesSearch =
                military.name.toLowerCase().includes(term) ||
                military.category.toLowerCase().includes(term) ||
                military.address1.toLowerCase().includes(term);

            // 군종 필터링
            const matchesCategory =
                activeCategory === '전체' || military.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    // 군부대 선택 핸들러
    const handleSelectMilitary = (military: AddressPublic) => {
        onSelectMilitary(military);
        onClose();
    };

    // 군종 탭 선택 핸들러
    const handleCategoryTabClick = (tab: { label: string; value: string }) => {
        setActiveCategory(tab.value);
    };

    const dialogContent = (
        <>
            <div className="flex items-center space-x-2 my-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                    <input
                        placeholder="부대명 또는 군종으로 검색"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="text-sm bg-transparent w-full pl-12 pr-2.5 py-2.5 border-b border-[#E5E5E5] focus:outline-none focus:ring-0 rounded-none"
                    />
                </div>
            </div>

            <div className="mb-4 overflow-x-auto">
                <RoundedTabs
                    tabs={categoryTabs}
                    activeTab={{
                        label:
                            activeCategory === '전체'
                                ? '전체'
                                : MILITARY_CATEGORY_MAP[activeCategory] || activeCategory,
                        value: activeCategory,
                    }}
                    onClick={handleCategoryTabClick}
                />
            </div>

            <ScrollArea className="h-[50dvh] md:h-[50vh]">
                <div className="pb-4">
                    {/* 데스크탑 화면에서만 보이는 테이블 */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>부대명</TableHead>
                                    <TableHead>군종</TableHead>
                                    <TableHead>주소</TableHead>
                                    <TableHead className="w-[100px] text-right">선택</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMilitaries.length > 0 ? (
                                    filteredMilitaries.map((military, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {military.name}
                                            </TableCell>
                                            <TableCell>
                                                {MILITARY_CATEGORY_MAP[military.category]}
                                            </TableCell>
                                            <TableCell className="max-w-[250px] truncate">
                                                {military.address1}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleSelectMilitary(
                                                            military as AddressPublic,
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
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            검색 결과가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* 모바일 화면에서 보이는 카드 형태 */}
                    <div className="md:hidden">
                        {filteredMilitaries.length > 0 ? (
                            filteredMilitaries.map((military, index) => (
                                <div
                                    key={index}
                                    className="border-t px-6 pt-6 pb-2.5 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectMilitary(military as AddressPublic)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-base">{military.name}</div>
                                        <div className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                                            {MILITARY_CATEGORY_MAP[military.category]}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3 truncate">
                                        {military.address1}
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
            title="군부대 선택"
            contentClassName="w-full sm:max-w-[700px] max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col pb-0"
        >
            {dialogContent}
        </ResponsiveDialog>
    );
}
