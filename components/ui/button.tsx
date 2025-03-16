import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-secondary-newpink text-primary-foreground shadow-none hover:bg-secondary-newpink/90 font-semibold',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline:
                    'border border-input bg-transparent shadow-none hover:bg-gray-100 hover:text-accent-foreground border-gray-200',
                secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
                ghost: 'hover:bg-transparent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                pink: 'bg-secondary-newpink/90 text-primary-white hover:bg-secondary-newpink/90 active:bg-secondary-newpink/80 focus:ring-0 focus:outline-none font-semibold ',
                lightPink:
                    'bg-primary-pink text-primary-black hover:bg-primary-pink/80 active:bg-primary-pink/50 focus:ring-0 focus:outline-none font-semibold duration-0 drag-none',
                outlinePink:
                    'border-[1.5px] border-primary-pink text-primary-black bg-transparent hover:bg-primary-pink/20 active:bg-primary-pink/10 focus:ring-0 focus:outline-none font-medium',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
