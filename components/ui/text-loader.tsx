import { cn } from "@/lib/utils";
import React from "react";
import Loader from "./loader";

export default function TextLoader({
    text,
    className,
    loaderClassName,
    textClassName,
}: {
    text: string;
    loaderClassName?: string;
    textClassName?: string;
    className?: string;
}) {
    return (
        <div className={cn("flex items-center gap-2 flex-col justify-center", className)}>
            <Loader className={cn("w-10 h-10", loaderClassName)} />
            <div
                className={cn(
                    "text-sm font-medium text-gray-400",
                    textClassName
                )}
            >
                {text}
            </div>
        </div>
    );
}
