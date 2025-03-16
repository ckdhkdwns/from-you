import { Badge } from "@/components/ui/badge";
import { Mail, Apple, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const methodConfig = {
    email: {
        label: "이메일",
        icon: Mail,
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    kakao: {
        label: "카카오",
        icon: MessageCircle,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    naver: {
        label: "네이버",
        icon: MessageCircle,
        className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    apple: {
        label: "애플",
        icon: Apple,
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
} as const;

export default function ProviderBadge({
    provider,
    className,
}: {
    provider: string;
    className?: string;
}) {
    const config = methodConfig[provider];
    const Icon = config.icon;

    return (
        <Badge
            variant="secondary"
            className={cn("gap-1 font-normal", config.className, className)}
        >
            <Icon className="h-3 w-3" />
            {config.label}
        </Badge>
    );
}
