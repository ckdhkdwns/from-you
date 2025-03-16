import {
    Users,
    Mail,
    Palette,
    Clock,
    Bell,
    MessageSquare,
    BellRing,
    CreditCard,
    File,
    Home,
} from 'lucide-react';

type AdminMenuItem = {
    title: string;
    description?: string;
    url: string;
    icon?: React.ReactNode;
    groupName?: string;
};

type AdminMenuGroup = {
    groupName: string;
    items: AdminMenuItem[];
    hideGroupName?: boolean;
};

export const adminMenuGroups: AdminMenuGroup[] = [
    {
        groupName: '대시보드',
        items: [
            {
                title: '대시보드',
                url: '/admin',
                icon: <Home size={14} className="-translate-x-0.5" />,
            },
        ],
        hideGroupName: true,
    },
    {
        groupName: '사용자 및 콘텐츠',
        items: [
            {
                title: '사용자 관리',
                description: '가입되어 있는 사용자 목록입니다.',
                url: '/admin/users',
                icon: <Users size={14} className="-translate-x-0.5" />,
            },
            {
                title: '작성된 편지',
                description: '사용자가 작성한 편지 목록입니다.',
                url: '/admin/letters',
                icon: <Mail size={14} className="-translate-x-0.5" />,
            },
            {
                title: '받은 편지',
                description: '받은 편지 목록입니다.',
                url: '/admin/received-letters',
                icon: <Mail size={14} className="-translate-x-0.5" />,
            },

            {
                title: '리뷰',
                url: '/admin/review',
                icon: <MessageSquare size={14} className="-translate-x-0.5" />,
            },
        ],
    },
    {
        groupName: '디자인 및 설정',
        items: [
            {
                title: '편지 디자인',
                description: '편지 디자인 목록입니다.',
                url: '/admin/templates',
                icon: <Palette size={14} className="-translate-x-0.5" />,
            },
            {
                title: '편지지 / 사진 규격',
                description: '편지 작성시 편지지 비율을 설정합니다.',
                url: '/admin/template-config',
                icon: <File size={14} className="-translate-x-0.5" />,
            },
            {
                title: '발송 시간',
                description: '편지가 발송되는 시간을 설정합니다.',
                url: '/admin/send-time',
                icon: <Clock size={14} className="-translate-x-0.5" />,
            },
        ],
    },
    {
        groupName: '알림 및 공지',
        items: [
            {
                title: '공지사항',
                description: '프롬유 공지사항 목록입니다.',
                url: '/admin/notice',
                icon: <Bell size={14} className="-translate-x-0.5" />,
            },
            {
                title: '자주 묻는 질문',
                description: '프롬유 자주 묻는 질문 목록입니다.',
                url: '/admin/faq',
                icon: <BellRing size={14} className="-translate-x-0.5" />,
            },
            {
                title: '팝업',
                description: '프롬유 팝업 목록입니다.',
                url: '/admin/popup',
                icon: <BellRing size={14} className="-translate-x-0.5" />,
            },
        ],
    },
    {
        groupName: '결제 및 포인트',
        items: [
            {
                title: '포인트',
                url: '/admin/point-logs',
                icon: <CreditCard size={14} className="-translate-x-0.5" />,
            },
        ],
    },
];

const subPages: AdminMenuItem[] = [
    {
        title: '공지사항 작성',
        url: '/admin/notice/new',
    },
    {
        title: '공지사항 수정',
        url: '/admin/notice/edit',
    },
    {
        title: '자주 묻는 질문 작성',
        url: '/admin/faq/new',
    },
    {
        title: '자주 묻는 질문 수정',
        url: '/admin/faq/edit',
    },
];

// 기존 형식과의 호환성을 위해 평면화된 메뉴 아이템 배열도 제공
export const adminMenuItems = subPages.concat(
    adminMenuGroups.flatMap((group: AdminMenuGroup) => {
        return group.items.map((item: AdminMenuItem) => {
            return {
                ...item,
                groupName: group.groupName,
            };
        });
    }),
);
