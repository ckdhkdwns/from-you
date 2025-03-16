"use client";

import Link from "next/link";

type MenuItem = {
    title: string;
    subtitle?: string;
    href: string;
};

type MenuSection = {
    title: string;
    items: MenuItem[];
};

const menuSections: MenuSection[] = [
    {
        title: "나의 정보",
        items: [
            { title: "회원 정보 수정", href: "/mypage/profile" },
            { title: "포인트", href: "/mypage/points" },
        ],
    },
    {
        title: "참여 내역",
        items: [
            { title: "작성 가능 후기", href: "/mypage/reviews/prepared" },
            { title: "작성한 후기", href: "/mypage/reviews/writed" },
        ],
    },
    {
        title: "주소 관리",
        items: [
            { title: "발신 주소", href: "/mypage/address/sender" },
            { title: "수신 주소", href: "/mypage/address/recipient" },
        ],
    },
    {
        title: "편지 내역",
        items: [
            { title: "보낸 편지함", href: "/mypage/letters/sent" },
            { title: "받은 편지함", href: "/mypage/letters/received" },
            { title: "임시 저장함", href: "/mypage/letters/draft" },
        ],
    },
];

export default function Sidebar() {
    return (
        <nav className="w-full md:min-w-48 md:w-48 mt-12 md:ml-2">
            <div className="sticky top-[7.3rem]">
                <Link href="/mypage" className="hidden md:block">
                    <h1 className="text-xl font-semibold mb-6">My Account</h1>
                </Link>

                <div className="space-y-8">
                    {menuSections.map((section) => (
                        <div key={section.title} className="">
                            <h2 className="text-xl font-semibold mb-4">
                                {section.title}
                            </h2>
                            <ul className="space-y-3">
                                {section.items.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`block ${"text-gray-400 font-medium hover:text-gray-900"}`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
}
