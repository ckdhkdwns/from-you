import { Badge } from "@/components/ui/badge";
import { paymentMethodConfig } from "@/constants";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/models/types/letter";

export default function PaymentMethodBadge({
    paymentMethod,
    className,
}: {
    paymentMethod: PaymentMethod;
    className?: string;
}) {
    const config = paymentMethodConfig[paymentMethod];

    return (
        <Badge variant="outline" className={cn("gap-1 font-normal", className)}>
            {config?.label || paymentMethod}
        </Badge>
    );
}
