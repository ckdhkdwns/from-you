'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PopupPublic } from '@/models/types/popup';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Image from 'next/image';
import { updatePopupAction } from '@/models/actions/popup-actions';
import { usePopups } from '../_contexts/popups-provider';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface PopupDialogProps {
    popup: PopupPublic;
    open: boolean;
    onOpenChange: (_open: boolean) => void;
}

export function PopupDialog({ popup, open, onOpenChange }: PopupDialogProps) {
    const { refreshPopups } = usePopups();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startDate, setStartDate] = useState(format(new Date(popup.startDate), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(popup.endDate), 'yyyy-MM-dd'));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>(popup.image);

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

    const extractPopupId = (popup: PopupPublic): string => {
        return popup?.SK.replace('POPUP#', '');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', '팝업');
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const popupId = extractPopupId(popup);
            const { success, error } = await updatePopupAction(popupId, formData);

            if (success) {
                toast.success('팝업이 성공적으로 수정되었습니다.');
                onOpenChange(false);
                refreshPopups();
            } else {
                toast.error(error?.message || '팝업 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('팝업 수정 오류:', error);
            toast.error('팝업 수정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ResponsiveDialog
            title="팝업 수정"
            description="팝업 이미지와 활성 기간을 수정할 수 있습니다."
            showFooter={true}
            open={open}
            onOpenChange={onOpenChange}
            className="!bg-white"
            contentClassName="!bg-white"
        >
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="image">이미지</Label>
                        <div className="relative w-full h-40 mb-2 mx-auto overflow-hidden rounded-md border">
                            <Image
                                src={previewImage}
                                alt="팝업 이미지 미리보기"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
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
                        {isSubmitting ? '저장 중...' : '저장하기'}
                    </Button>
                </DialogFooter>
            </form>
        </ResponsiveDialog>
    );
}
