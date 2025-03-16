"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "light" } = useTheme();
    const pathname = usePathname();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-primary-white group-[.toaster]:text-foreground group-[.toaster]:shadow-lg !border-none group-[.toaster]:pointer-events-auto",
                    description: "group-[.toast]:text-muted-foreground",
                    title: "text-sm",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground ",
                    closeButton:
                        "group-[.toast]:text-muted-foreground !left-[unset] !right-3 !top-[1.4rem] !border-none !w-5 !h-5 ",
                    icon: "group-data-[type=error]:text-red-500 group-data-[type=success]:text-green-500 group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500",
                },
            }}
            position="bottom-center"

            // offset={pathname === "/write" ? 100 : 0}
            {...props}
            // offset={{ bottom: pathname === "/write" ? 100 : 0 }}
            mobileOffset={{ bottom: pathname === "/write" ? 60 : 16 }}
        />
    );
};

export { Toaster };
