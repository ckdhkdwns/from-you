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
import { useFAQs } from '../_contexts/faqs-provider';
import { FaqInput } from '@/models/types/faq';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FAQ_CATEGORIES, FAQCategory } from '@/constants/data/faq-categories';

const formSchema = z.object({
    question: z.string().min(1, '질문을 입력해주세요'),
    answer: z.string().min(1, '답변을 입력해주세요'),
    category: z.enum(FAQ_CATEGORIES, {
        errorMap: () => ({ message: '카테고리를 선택해주세요' }),
    }),
    order: z.coerce.number().int().min(0, '순서는 0 이상이어야 합니다'),
    isPublished: z.boolean().default(true),
});

export function FAQDialog() {
    const {
        selectedFAQ,
        isDialogOpen,
        setIsDialogOpen,
        createFAQ,
        updateFAQ,
        isActionLoading,
    } = useFAQs();

    const isEdit = !!selectedFAQ;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: '',
            answer: '',
            category: '우편' as FAQCategory,
            order: 0,
            isPublished: true,
        },
    });

    useEffect(() => {
        if (selectedFAQ) {
            form.setValue('question', selectedFAQ.question);
            form.setValue('answer', selectedFAQ.answer);
            form.setValue('category', selectedFAQ.category as FAQCategory);
            form.setValue('order', selectedFAQ.order);
            form.setValue('isPublished', selectedFAQ.isPublished);
        } else {
            form.reset({
                question: '',
                answer: '',
                category: FAQ_CATEGORIES[0],
                order: 0,
                isPublished: true,
            });
        }
    }, [selectedFAQ, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const faqInput: FaqInput = {
                question: values.question,
                answer: values.answer,
                category: values.category,
                order: values.order,
                isPublished: values.isPublished
            };
            
            if (isEdit && selectedFAQ) {
                const id = removeTableKeyPrefix(selectedFAQ.SK);
                await updateFAQ(id, faqInput);
            } else {
                await createFAQ(faqInput);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error('FAQ 작업 오류:', error);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !bg-white">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'FAQ 수정' : '새 FAQ 작성'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>질문</FormLabel>
                                    <FormControl>
                                        <Input placeholder="질문을 입력하세요" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>답변</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="답변을 입력하세요"
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>카테고리</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="카테고리 선택" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {FAQ_CATEGORIES.map(category => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>순서</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="순서를 입력하세요"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>공개 여부</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            FAQ를 즉시 공개할지 여부를 설정합니다.
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
