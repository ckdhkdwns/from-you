'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useRef } from 'react';

interface ResponsiveDialogProps
    extends Omit<React.ComponentPropsWithoutRef<typeof Dialog>, 'onOpenChange'> {
    breakpoint?: string;
    triggerContent?: React.ReactNode;
    title?: React.ReactNode | null;
    description?: React.ReactNode | string | null;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    showFooter?: boolean;
    footerContent?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (_open: boolean) => void;
    defaultOpen?: boolean;
}

export function ResponsiveDialog({
    triggerContent,
    title,
    description,
    children,
    className,
    contentClassName,
    showFooter = false,
    footerContent,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    defaultOpen,
    ...props
}: ResponsiveDialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(defaultOpen || false);

    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const setOpen = setControlledOpen || setUncontrolledOpen;

    const isMobile = useIsMobile();

    const formContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (formContainerRef.current) {
                formContainerRef.current.style.setProperty('bottom', `env(safe-area-inset-bottom)`);
            }
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
            handleResize(); // Initial call in case the keyboard is already open
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    if (!isMobile) {
        return (
            <Dialog open={open} onOpenChange={setOpen} {...props}>
                {triggerContent && <DialogTrigger asChild>{triggerContent}</DialogTrigger>}
                <DialogContent className={cn('sm:max-w-[425px]', contentClassName)}>
                    <DialogHeader className="w-full h-fit">
                        {title && (
                            <DialogTitle className="text-xl text-center">{title}</DialogTitle>
                        )}
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>

                    <div className={cn('w-full', className)}>{children}</div>
                    {showFooter && (
                        <div className="pt-2">
                            {footerContent || (
                                <button className="w-full rounded-md bg-gray-100 py-2 font-medium">
                                    닫기
                                </button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer
            open={open}
            onOpenChange={setOpen}
            {...props}
            handleOnly={true}
            repositionInputs={false}
        >
            {triggerContent && <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>}
            <DrawerContent className={contentClassName}>
                <DrawerHeader className="text-center w-full">
                    {title && <DrawerTitle>{title}</DrawerTitle>}
                    {description && <DrawerDescription>{description}</DrawerDescription>}
                </DrawerHeader>
                <div className={cn('px-4 w-full h-full pb-4', className)}>{children}</div>
                {showFooter && (
                    <DrawerFooter className="pt-2">
                        {footerContent || (
                            <DrawerClose asChild>
                                <button className="w-full rounded-md bg-gray-100 py-2 font-medium">
                                    닫기
                                </button>
                            </DrawerClose>
                        )}
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}
