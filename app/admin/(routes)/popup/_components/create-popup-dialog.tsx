'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { createPopupAction } from '@/models/actions/popup-actions';
import { usePopups } from '../_contexts/popups-provider';

interface CreatePopupDialogProps {
    open: boolean;
    onOpenChange: (_open: boolean) => void;
}

export function CreatePopupDialog({ open, onOpenChange }: CreatePopupDialogProps) {
    const { refreshPopups } = usePopups();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

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

        if (!imageFile) {
            toast.error('이미지를 업로드해주세요.');
            return;
        }

        if (!startDate || !endDate) {
            toast.error('시작일과 종료일을 모두 설정해주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', '팝업');
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('image', imageFile);

            const { success, error } = await createPopupAction(formData);

            if (success) {
                toast.success('팝업이 성공적으로 생성되었습니다.');
                onOpenChange(false);
                // 폼 초기화
                setStartDate('');
                setEndDate('');
                setImageFile(null);
                setPreviewImage(null);
                // 팝업 목록 새로고침
                refreshPopups();
            } else {
                toast.error(error?.message || '팝업 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('팝업 생성 오류:', error);
            toast.error('팝업 생성 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>새 팝업 추가</DialogTitle>
                    <DialogDescription>
                        팝업 이미지와 활성 기간을 설정하여 새 팝업을 추가할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="image">이미지</Label>
                            {previewImage && (
                                <div className="relative w-full h-40 mb-2 mx-auto overflow-hidden rounded-md border">
                                    <Image
                                        src={previewImage}
                                        alt="팝업 이미지 미리보기"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '생성 중...' : '생성하기'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
