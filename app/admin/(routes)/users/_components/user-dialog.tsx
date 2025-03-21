'use client';

import { useEffect, useState } from 'react';
import { UserPublic } from '@/models/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseDate } from '@/lib/date';
import { useUsersContext } from '../_contexts/users-provider';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import { getLettersByUserIdAction } from '@/models/actions/letter-actions';
import { getUserPointLogsAction } from '@/models/actions/point-action';
import { LetterPublic } from '@/models/types/letter';
import { PointLogPublic } from '@/models/types/point-log';
import LetterDataTable from '../../letters/_components/letter-data-table';
import PointLogDataTable from '../../point-logs/_components/point-log-data-table';
import { columns as pointLogColumns } from '../../point-logs/_components/columns';
import ProviderBadge from '@/components/ui/provider-badge';
import { Separator } from '@/components/ui/separator';
import TextLoader from '@/components/ui/text-loader';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface UserDialogProps {
    user: UserPublic;
    open: boolean;
    onOpenChange: (_open: boolean) => void;
}

export function UserDialog({ user, open, onOpenChange }: UserDialogProps) {
    const [pointValue, setPointValue] = useState(user.point.toString());
    const [isLoading, _setIsLoading] = useState(false);
    const [letters, setLetters] = useState<LetterPublic[]>([]);
    const [isLettersLoading, setIsLettersLoading] = useState(false);
    const [pointLogs, setPointLogs] = useState<PointLogPublic[]>([]);
    const [isPointLogsLoading, setIsPointLogsLoading] = useState(false);
    const { handlePointUpdate } = useUsersContext();

    const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPointValue(e.target.value);
    };

    useEffect(() => {
        setPointValue(user.point.toString());
    }, [user]);

    const loadUserLetters = async (userId: string) => {
        setIsLettersLoading(true);
        try {
            const response = await getLettersByUserIdAction(userId);
            if (response.success) {
                setLetters(response.data);
            } else {
                console.error('편지 목록을 불러오는데 실패했습니다:', response.error);
            }
        } catch (error) {
            console.error('편지 목록을 불러오는데 실패했습니다:', error);
        } finally {
            setIsLettersLoading(false);
        }
    };

    const loadUserPointLogs = async (userId: string) => {
        setIsPointLogsLoading(true);
        try {
            const response = await getUserPointLogsAction(userId);
            if (response.success) {
                setPointLogs(response.data);
            } else {
                console.error('포인트 내역을 불러오는데 실패했습니다:', response.error);
            }
        } catch (error) {
            console.error('포인트 내역을 불러오는데 실패했습니다:', error);
        } finally {
            setIsPointLogsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadUserLetters(removeTableKeyPrefix(user.PK));
            loadUserPointLogs(removeTableKeyPrefix(user.PK));
        }
    }, [user]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto !bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">유저 정보</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* 기본 정보 섹션 */}
                    <div>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex flex-col">
                                        <Label className="text-gray-450 mb-1">ID</Label>
                                        <div className="text-base">
                                            {removeTableKeyPrefix(user.PK)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <Label className="text-gray-450 mb-1">이름</Label>
                                        <div className="text-base">{user.name}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-col">
                                        <Label className="text-gray-450 mb-1">가입 방법</Label>
                                        <div className="text-base">
                                            <ProviderBadge provider={user.provider} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <Label className="text-gray-450 mb-1">가입일</Label>
                                        <div className="text-base">{parseDate(user.createdAt)}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <Label className="text-gray-450 mb-1">전화번호</Label>
                                    <div className="text-base">
                                        {user?.phone || '등록되지 않음'}
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <div className="flex-1 mr-2">
                                        <Label htmlFor="point" className="text-gray-450 mb-1 block">
                                            포인트
                                        </Label>
                                        <Input
                                            id="point"
                                            type="number"
                                            value={pointValue}
                                            onChange={handlePointChange}
                                            className="text-base"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => handlePointUpdate(user, Number(pointValue))}
                                        disabled={isLoading || Number(pointValue) === user.point}
                                        className="h-10"
                                    >
                                        {isLoading ? '업데이트 중...' : '적용'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator />

                    {/* 아코디언으로 변경된 포인트 내역과 편지 목록 섹션 */}
                    <Accordion type="single" collapsible className="w-full">
                        {/* 포인트 내역 섹션 */}
                        <AccordionItem value="pointLogs">
                            <AccordionTrigger className="text-base font-medium">
                                포인트 내역
                            </AccordionTrigger>
                            <AccordionContent>
                                {isPointLogsLoading ? (
                                    <TextLoader text="포인트 내역을 불러오는 중..." />
                                ) : pointLogs.length === 0 ? (
                                    <div className="text-center py-4 text-gray-450 text-sm">
                                        포인트 사용 내역이 없습니다.
                                    </div>
                                ) : (
                                    <div>
                                        <PointLogDataTable
                                            data={pointLogs}
                                            isLoading={false}
                                            customColumns={pointLogColumns}
                                            showCheckbox={false}
                                            searchField={[]}
                                            loadingText="포인트 내역을 불러오는 중..."
                                        />
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>

                        {/* 작성한 편지 섹션 */}
                        <AccordionItem value="letters">
                            <AccordionTrigger className="text-base font-medium">
                                작성한 편지
                            </AccordionTrigger>
                            <AccordionContent>
                                {isLettersLoading ? (
                                    <TextLoader text="편지 목록을 불러오는 중..." />
                                ) : letters.length === 0 ? (
                                    <div className="text-center py-4 text-gray-450 text-sm">
                                        작성한 편지가 없습니다.
                                    </div>
                                ) : (
                                    <LetterDataTable
                                        data={letters}
                                        isLoading={false}
                                        showDetailDialog={true}
                                        showActionsToolbar={false}
                                        showCheckbox={false}
                                        showNotificationReset={false}
                                        loadingText="편지 목록을 불러오는 중..."
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    );
}
