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
import { toast } from 'sonner';

import { createFAQ, updateFAQ } from '@/models/actions/faq-actions';
import { useFAQs } from '../_contexts/faqs-provider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FaqPublic, FaqInput } from '@/models/types/faq';
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

interface FAQDialogProps {
    faq?: FaqPublic;
    open?: boolean;
    onOpenChange?: (_open: boolean) => void;
}

export function FAQDialog({
    faq,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
}: FAQDialogProps = {}) {
    const {
        addFAQ,
        updateFAQInList,
        isDialogOpen,
        setIsDialogOpen,
        selectedFAQ,
        setSelectedFAQ,
        isLoading,
    } = useFAQs();
    const [localLoading, setLocalLoading] = useState(false);

    const open = externalOpen !== undefined ? externalOpen : isDialogOpen;
    const onOpenChange = externalOnOpenChange || setIsDialogOpen;

    const activeFAQ = faq || selectedFAQ;
    const loading = isLoading || localLoading;

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
        if (!newOpen) {
            if (!faq && !externalOpen) {
                setSelectedFAQ(undefined);
            }
        }
    };

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
        if (activeFAQ) {
            form.setValue('question', activeFAQ.question);
            form.setValue('answer', activeFAQ.answer);
            form.setValue('category', activeFAQ.category as FAQCategory);
            form.setValue('order', activeFAQ.order);
            form.setValue('isPublished', activeFAQ.isPublished);
        } else {
            form.reset({
                question: '',
                answer: '',
                category: FAQ_CATEGORIES[0],
                order: 0,
                isPublished: true,
            });
        }
    }, [activeFAQ, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLocalLoading(true);

        try {
            let result;
            if (activeFAQ) {
                const updateRequest = {
                    id: activeFAQ?.SK,
                    ...values,
                };
                result = await updateFAQ(updateRequest as FaqInput);
            } else {
                const createRequest = {
                    question: values.question,
                    answer: values.answer,
                    category: values.category,
                    order: values.order,
                    isPublished: values.isPublished,
                };
                result = await createFAQ(createRequest);
            }

            if (result.success) {
                toast.success(activeFAQ ? 'FAQ가 수정되었습니다.' : 'FAQ가 생성되었습니다.');

                if (result.data) {
                    if (activeFAQ) {
                        updateFAQInList(activeFAQ?.SK, result.data);
                    } else {
                        addFAQ(result.data);
                    }
                }

                form.reset();
                handleOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('FAQ operation error:', error);
            toast.error(
                activeFAQ ? 'FAQ 수정 중 오류가 발생했습니다.' : 'FAQ 생성 중 오류가 발생했습니다.',
            );
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto !bg-white">
                <DialogHeader>
                    <DialogTitle>{activeFAQ ? 'FAQ 수정' : '새 FAQ 작성'}</DialogTitle>
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
                                onClick={() => handleOpenChange(false)}
                            >
                                취소
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? '처리 중...' : '저장하기'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
