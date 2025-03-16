'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { createNotice, updateNotice } from '@/models/actions/notice-actions';
import { useNotices } from '../_contexts/notices-provider';
import { NoticeInput, NoticePublic } from '@/models/types/notice';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

const formSchema = z.object({
    title: z.string().min(1, '제목을 입력해주세요'),
    content: z.string().min(1, '내용을 입력해주세요'),
    isPublished: z.boolean().default(true),
});

interface NoticeDialogProps {
    notice?: NoticePublic;
    open?: boolean;
    onOpenChange?: (_open: boolean) => void;
}

export function NoticeDialog({
    notice,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
}: NoticeDialogProps) {
    const { addNotice, updateNoticeInList } = useNotices();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const isEdit = !!notice;
    const onOpenChange = controlledOnOpenChange || setOpen;
    const isOpen = controlledOpen !== undefined ? controlledOpen : open;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
            isPublished: true,
        },
    });

    useEffect(() => {
        if (notice) {
            form.reset({
                title: notice.title,
                content: notice.content,
                isPublished: notice.isPublished,
            });
        } else {
            form.reset({
                title: '',
                content: '',
                isPublished: true,
            });
        }
    }, [notice, form.reset]);

    const onSubmit = useCallback(
        async (values: z.infer<typeof formSchema>) => {
            try {
                setIsLoading(true);

                let result;
                if (isEdit && notice) {
                    const updateRequest: NoticeInput = {
                        id: removeTableKeyPrefix(notice.PK),
                        title: values.title,
                        content: values.content,
                        isPublished: values.isPublished,
                    };
                    result = await updateNotice(updateRequest);
                } else {
                    const createRequest: NoticeInput = {
                        title: values.title,
                        content: values.content,
                        isPublished: values.isPublished,
                    };
                    result = await createNotice(createRequest);
                }

                if (result.success) {
                    toast.success(
                        isEdit ? '공지사항이 수정되었습니다.' : '공지사항이 생성되었습니다.',
                    );

                    if (result.data) {
                        if (isEdit && notice) {
                            updateNoticeInList(removeTableKeyPrefix(notice.PK), result.data);
                        } else {
                            addNotice(result.data);
                        }
                    }

                    form.reset();
                    onOpenChange(false);
                } else {
                    toast.error(result.error);
                }
            } catch (error) {
                console.error('Notice operation error:', error);
                toast.error(
                    isEdit
                        ? '공지사항 수정 중 오류가 발생했습니다.'
                        : '공지사항 생성 중 오류가 발생했습니다.',
                );
            } finally {
                setIsLoading(false);
            }
        },
        [isEdit, notice, form, onOpenChange, addNotice, updateNoticeInList],
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !bg-white">
                <DialogHeader>
                    <DialogTitle>{isEdit ? '공지사항 수정' : '새 공지사항 작성'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>제목</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="공지사항 제목을 입력하세요"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>내용</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="공지사항 내용을 입력하세요"
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>공개 여부</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            공지사항을 즉시 공개할지 여부를 설정합니다.
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                취소
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? isEdit
                                        ? '수정 중...'
                                        : '생성 중...'
                                    : isEdit
                                      ? '수정하기'
                                      : '생성하기'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
