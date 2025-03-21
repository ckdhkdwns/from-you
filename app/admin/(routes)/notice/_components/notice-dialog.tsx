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
import { useState, useEffect } from 'react';
import { useNotices } from '../_contexts/notices-provider';
import { NoticeInput } from '@/models/types/notice';
import { removeTableKeyPrefix } from '@/lib/api-utils';

const formSchema = z.object({
    title: z.string().min(1, '제목을 입력해주세요'),
    content: z.string().min(1, '내용을 입력해주세요'),
    isPublished: z.boolean().default(true),
});

export function NoticeDialog() {
    const { selectedNotice, isDialogOpen, setIsDialogOpen, createNotice, updateNotice, isActionLoading } =
        useNotices();

    const isEdit = !!selectedNotice;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
            isPublished: true,
        },
    });

    useEffect(() => {
        if (selectedNotice) {
            form.reset({
                title: selectedNotice.title,
                content: selectedNotice.content,
                isPublished: selectedNotice.isPublished,
            });
        } else {
            form.reset({
                title: '',
                content: '',
                isPublished: true,
            });
        }
    }, [selectedNotice, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const noticeData: NoticeInput = {
                title: values.title,
                content: values.content,
                isPublished: values.isPublished,
            };

            if (isEdit && selectedNotice) {
                const id = removeTableKeyPrefix(selectedNotice.PK);
                await updateNotice(id, noticeData);
            } else {
                await createNotice(noticeData);
            }

            form.reset();
            setIsDialogOpen(false);
        } catch (error) {
            console.error('공지사항 작업 오류:', error);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                onClick={() => setIsDialogOpen(false)}
                            >
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
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
