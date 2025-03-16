import React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { PaymentStatus, ShippingStatus } from "@/models/types/letter";

const statusConfig = {
    pending: {
        label: "대기",
        icon: "clock",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    complete: {
        label: "완료",
        icon: "check",
        className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    failed: {
        label: "실패",
        icon: "x",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    shipping: {
        label: "배송 중",
        icon: "shipping",
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
};

export default function StatusBadge({
    status,
}: {
    status: PaymentStatus | ShippingStatus;
}) {
    const config = statusConfig[status];

    if (!config) {
        return null;
    }

    return (
        <Badge
            variant="secondary"
            className={cn("gap-1 font-medium", config.className)}
        >
            {config.label}
        </Badge>
    );
}
