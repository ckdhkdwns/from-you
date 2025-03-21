'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { usePopups } from '../_contexts/popups-provider';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

export function PopupDialog() {
    const {
        selectedPopup,
        isDialogOpen,
        setIsDialogOpen,
        createPopup,
        updatePopup,
        isActionLoading,
    } = usePopups();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');

    const isEdit = !!selectedPopup;

    useEffect(() => {
        if (selectedPopup) {
            setStartDate(format(new Date(selectedPopup.startDate), 'yyyy-MM-dd'));
            setEndDate(format(new Date(selectedPopup.endDate), 'yyyy-MM-dd'));
            setPreviewImage(selectedPopup.image);
            setImageFile(null);
        } else {
            const today = new Date();
            setStartDate(format(today, 'yyyy-MM-dd'));

            // 기본 종료일은 1주일 후
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            setEndDate(format(nextWeek, 'yyyy-MM-dd'));

            setImageFile(null);
            setPreviewImage('');
        }
    }, [selectedPopup, isDialogOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            return;
        }

        // 편집 모드에서는 이미지가 필수가 아님 (기존 이미지 유지 가능)
        // 생성 모드에서는 이미지가 필수
        if (!isEdit && !imageFile) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', '팝업');
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEdit && selectedPopup) {
                await updatePopup(selectedPopup.SK, formData);
            } else {
                await createPopup(formData);
            }

            setIsDialogOpen(false);
        } catch (error) {
            console.error('팝업 작업 오류:', error);
        }
    };

    return (
        <ResponsiveDialog
            title={isEdit ? '팝업 수정' : '새 팝업 추가'}
            description={
                isEdit
                    ? '팝업 이미지와 활성 기간을 수정할 수 있습니다.'
                    : '팝업 이미지와 활성 기간을 설정하여 새 팝업을 추가합니다.'
            }
            showFooter={true}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            className="!bg-white"
            contentClassName="!bg-white"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="image">이미지</Label>
                        <div className="relative w-full h-40 mb-2 mx-auto overflow-hidden rounded-md border">
                            {previewImage && (
                                <Image
                                    src={previewImage}
                                    alt="팝업 이미지 미리보기"
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required={!isEdit}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="startDate">시작일</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="endDate">종료일</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        취소
                    </Button>
                    <Button type="submit" disabled={isActionLoading}>
                        {isActionLoading
                            ? isEdit
                                ? '수정 중...'
                                : '생성 중...'
                            : isEdit
                              ? '수정하기'
                              : '생성하기'}
                    </Button>
                </DialogFooter>
            </form>
        </ResponsiveDialog>
    );
}
