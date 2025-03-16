'use client';

import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface ConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    className?: string;
}

interface ConfirmContextType {
    confirm: (options?: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

interface ConfirmProviderProps {
    children: ReactNode;
}

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({
        title: '확인',
        description: '계속 진행하시겠습니까?',
        confirmText: '확인',
        cancelText: '취소',
        className: '',
    });

    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => () => {});

    const confirm = useCallback(
        (customOptions?: ConfirmOptions): Promise<boolean> => {
            const mergedOptions = { ...options, ...customOptions };
            setOptions(mergedOptions);
            setIsOpen(true);

            return new Promise<boolean>(resolve => {
                setResolvePromise(() => resolve);
            });
        },
        [options],
    );

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        resolvePromise(true);
    }, [resolvePromise]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        resolvePromise(false);
    }, [resolvePromise]);

    const footerContent = (
        <div className="flex gap-2 w-full">
            <Button
                variant="outline"
                size="lg"
                className="flex-1 max-md:h-12 max-md:text-base"
                onClick={handleCancel}
            >
                {options.cancelText}
            </Button>
            <Button
                variant="default"
                size="lg"
                className="flex-1 max-md:h-12 max-md:text-base"
                onClick={handleConfirm}
            >
                {options.confirmText}
            </Button>
        </div>
    );

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ResponsiveDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                title={options.title}
                contentClassName={options.className}
                showFooter={true}
                footerContent={footerContent}
            >
                <div className="text-sm text-gray-500 font-normal text-center">
                    {options.description}
                </div>
            </ResponsiveDialog>
        </ConfirmContext.Provider>
    );
};

export const useConfirm = (): ConfirmContextType => {
    const context = useContext(ConfirmContext);

    if (context === undefined) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }

    return context;
};
