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
import { uploadImage } from '@/models/actions/s3/storage-actions';
import { toast } from 'sonner';
import { TemplatePublic, TemplateEntity, TemplateInput } from '@/models/types/template';
import { createTemplate, updateTemplate } from '@/models/actions/template-actions';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
    name: z.string().min(1, '이름을 입력해주세요'),
    description: z.string().min(1, '설명을 입력해주세요'),
    category: z.string().min(1, '카테고리를 입력해주세요'),
    initialQuantity: z.object({
        paper: z.coerce.number().min(0),
        photo: z.coerce.number().min(0),
    }),
    initialPrice: z.coerce.number().min(0),
    maxQuantity: z.object({
        paper: z.coerce.number().min(0),
    }),
    additionalUnitPrice: z.object({
        paper: z.coerce.number().min(0),
        photo: z.coerce.number().min(0),
    }),
    discountedPrice: z.coerce.number().min(0),
    isPopular: z.boolean(),
    paperImage: z.string().min(1, '편지지 이미지 URL을 입력해주세요'),
    thumbnail: z.string().min(1, '썸네일 이미지 URL을 입력해주세요'),
});

interface TemplateDialogProps {
    template?: TemplatePublic;
    open?: boolean;
    onOpenChange?: (_open: boolean) => void;
    trigger?: React.ReactNode;
    onTemplateAdd?: (_template: TemplatePublic) => void;
    onTemplateUpdate?: (_id: string, _updatedTemplate: Partial<TemplatePublic>) => void;
}

export function TemplateDialog({
    template,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    onTemplateAdd,
    onTemplateUpdate,
}: TemplateDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{
        paperImage?: File;
        thumbnail?: File;
    }>({});
    const isEdit = !!template;
    const onOpenChange = controlledOnOpenChange || setOpen;
    const isOpen = controlledOpen !== undefined ? controlledOpen : open;

    const defaultValues = {
        name: '',
        description: '',
        category: '',
        initialQuantity: { paper: 0, photo: 0 },
        initialPrice: 0,
        maxQuantity: { paper: 0 },
        additionalUnitPrice: { paper: 0, photo: 0 },
        discountedPrice: 0,
        isPopular: false,
        paperImage: '',
        thumbnail: '',
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: template
            ? {
                  ...defaultValues,
                  ...template,
              }
            : defaultValues,
    });

    useEffect(() => {
        if (template) {
            form.reset({
                ...defaultValues,
                ...template,
            });
        }
    }, [template, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);

            // 이미지 업로드 처리
            for (const field of ['paperImage', 'thumbnail'] as const) {
                if (selectedFiles[field]) {
                    const result = await uploadImage('templates', selectedFiles[field]!);
                    if (result.success && result.url) {
                        values[field] = result.url;
                    } else {
                        toast.error(
                            field === 'paperImage'
                                ? '편지지 이미지 업로드에 실패했습니다.'
                                : '썸네일 업로드에 실패했습니다.',
                        );
                        return;
                    }
                }
            }

            // 템플릿 생성 또는 수정
            const result =
                isEdit && template
                    ? await updateTemplate({ ...values, id: template.PK } as TemplateInput)
                    : await createTemplate({ ...values, EntityType: 'TEMPLATE' } as TemplateEntity);

            if (result.success) {
                toast.success(isEdit ? '템플릿이 수정되었습니다.' : '템플릿이 생성되었습니다.');

                // 콜백 처리
                if (isEdit && template && result.data) {
                    onTemplateUpdate?.(template.PK, result.data);
                } else if (result.data) {
                    onTemplateAdd?.(result.data);
                }

                form.reset();
                setSelectedFiles({});
                onOpenChange(false);
            } else {
                toast.error(result.error.message);
            }
        } catch (error) {
            console.error('Template operation error:', error);
            toast.error(
                isEdit
                    ? '템플릿 수정 중 오류가 발생했습니다.'
                    : '템플릿 생성 중 오류가 발생했습니다.',
            );
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileSelect = (file: File, field: 'paperImage' | 'thumbnail') => {
        setSelectedFiles(prev => ({ ...prev, [field]: file }));
        const reader = new FileReader();
        reader.onload = e => form.setValue(field, e.target?.result as string);
        reader.readAsDataURL(file);
    };

    // 숫자 입력 필드 공통 핸들러
    const handleNumberInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange: (value: number | '') => void,
    ) => {
        const value = e.target.value === '' ? '' : Number(e.target.value);
        onChange(value);
    };

    // 이미지 필드 렌더링 함수
    const renderImageField = (name: 'paperImage' | 'thumbnail', label: string) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field: { value } }) => (
                <FormItem className="space-y-4">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="space-y-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file, name);
                                }}
                            />
                            {value && (
                                <div className="mt-2">
                                    <img
                                        src={value}
                                        alt="Preview"
                                        className={`max-w-full h-auto border rounded-md ${name === 'thumbnail' ? 'aspect-square object-cover' : ''}`}
                                    />
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto !bg-white">
                <DialogHeader>
                    <DialogTitle>{isEdit ? '편지지 수정' : '새 편지지 추가'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* 기본 정보 섹션 */}
                        <div className="space-y-4">
                            <div className="text-lg font-semibold">기본 정보</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>이름</FormLabel>
                                            <FormControl>
                                                <Input placeholder="편지지 이름" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>카테고리</FormLabel>
                                            <FormControl>
                                                <Input placeholder="카테고리" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>설명</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="편지지 설명"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* 편지지 설정 섹션 */}
                        <div className="space-y-4">
                            <div className="text-lg font-semibold">편지지 설정</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="initialQuantity.paper"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>기본 편지지 수량</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e =>
                                                        handleNumberInput(e, field.onChange)
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxQuantity.paper"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>최대 편지지 수량</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e =>
                                                        handleNumberInput(e, field.onChange)
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="additionalUnitPrice.paper"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>추가 편지지 가격</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e =>
                                                        handleNumberInput(e, field.onChange)
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* 사진 설정 섹션 */}
                        <div className="space-y-4">
                            <div className="text-lg font-semibold">사진 설정</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="initialQuantity.photo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>기본 사진 수량</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e =>
                                                        handleNumberInput(e, field.onChange)
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="additionalUnitPrice.photo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>추가 사진 가격</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e =>
                                                        handleNumberInput(e, field.onChange)
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* 가격 설정 섹션 */}
                        <div className="space-y-4">
                            <div className="text-lg font-semibold">가격 설정</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="initialPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>기본 가격</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e => {
                                                        const value =
                                                            e.target.value === ''
                                                                ? ''
                                                                : Number(e.target.value);
                                                        field.onChange(value);

                                                        // 할인 가격 자동 조정
                                                        const currentDiscountedPrice =
                                                            form.getValues('discountedPrice');
                                                        if (
                                                            typeof value === 'number' &&
                                                            currentDiscountedPrice > value
                                                        ) {
                                                            form.setValue('discountedPrice', value);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="discountedPrice"
                                    render={({ field }) => {
                                        const initialPrice = form.watch('initialPrice');
                                        const discount =
                                            typeof initialPrice === 'number' && initialPrice > 0
                                                ? Math.round(
                                                      ((initialPrice -
                                                          (typeof field.value === 'number'
                                                              ? field.value
                                                              : 0)) /
                                                          initialPrice) *
                                                          100,
                                                  )
                                                : 0;

                                        return (
                                            <FormItem>
                                                <FormLabel>할인 가격</FormLabel>
                                                <div className="space-y-2">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            max={
                                                                typeof initialPrice === 'number'
                                                                    ? initialPrice
                                                                    : undefined
                                                            }
                                                            onChange={e => {
                                                                const value =
                                                                    e.target.value === ''
                                                                        ? ''
                                                                        : Number(e.target.value);
                                                                if (
                                                                    typeof value !== 'number' ||
                                                                    typeof initialPrice !==
                                                                        'number' ||
                                                                    value <= initialPrice
                                                                ) {
                                                                    field.onChange(value);
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    {typeof initialPrice === 'number' &&
                                                        initialPrice > 0 && (
                                                            <div className="text-sm text-muted-foreground">
                                                                할인율: {discount}%
                                                            </div>
                                                        )}
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-lg font-semibold">추가 설정</div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderImageField('thumbnail', '썸네일 이미지')}
                                {renderImageField('paperImage', '편지지 이미지')}
                            </div>
                        </div>
                        <Separator />

                        {/* 추가 설정 섹션 */}
                        <div className="space-y-4">
                            <div className="text-lg font-semibold">추가 설정</div>
                            <FormField
                                control={form.control}
                                name="isPopular"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">인기 상품</FormLabel>
                                            <div className="text-sm text-muted-foreground">
                                                이 템플릿을 인기 상품으로 표시합니다
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
                        </div>

                        <Button
                            type="submit"
                            className="w-full sticky bottom-0"
                            disabled={isLoading}
                        >
                            {isLoading ? '처리중...' : '저장'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
