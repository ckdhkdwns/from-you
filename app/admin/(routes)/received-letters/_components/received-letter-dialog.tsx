'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { X, Search, User as UserIcon } from 'lucide-react';
import { getAllUsersAction } from '@/models/actions/user-actions';
import { UserPublic } from '@/models/types/user';
import { useReceivedLetter } from '../_contexts/received-letter-provider';
import { v4 as uuidv4 } from 'uuid';
import { ReceivedLetterPublic } from '@/models/types/received-letter';
import { toast } from 'sonner';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { parsePhotos } from '@/app/(no-header)/write/_libs/parse-photos';
import { Photo } from '@/models/types/letter';

interface ReceivedLetterDialogProps {
    selectedLetter?: ReceivedLetterPublic | null;
    onOpenChange?: (_open: boolean) => void;
    open?: boolean;
}

export default function ReceivedLetterDialog({
    selectedLetter = null,
    onOpenChange,
    open,
}: ReceivedLetterDialogProps) {
    const [name, setName] = useState('');
    const [senderName, setSenderName] = useState('');
    const [images, setImages] = useState<Photo[]>([]);
    const [users, setUsers] = useState<UserPublic[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserPublic[]>([]);
    const [showUserList, setShowUserList] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const { handleCreateReceivedLetter, handleUpdateReceivedLetter, handleDeleteReceivedLetter } =
        useReceivedLetter();

    useEffect(() => {
        if (!open) return;

        if (selectedLetter) {
            setName(selectedLetter.user?.name || '');

            // 이미지 설정
            if (selectedLetter.photos && selectedLetter.photos.length > 0) {
                setImages(selectedLetter.photos);
            } else {
                setImages([]);
            }

            setSenderName(selectedLetter.senderName || '');
        } else {
            // 새 편지 추가 모드로 초기화
            resetForm();
        }
    }, [selectedLetter, open]);

    // 사용자 목록 가져오기
    useEffect(() => {
        if (!open) return;

        const fetchUsers = async () => {
            try {
                const { data: allUsers } = await getAllUsersAction();
                setUsers(allUsers);

                // 선택된 편지가 있고 user가 있으면 해당 사용자 찾기
                if (selectedLetter?.user) {
                    const user = allUsers.find(
                        u =>
                            u.PK?.replace('USER#', '') ===
                            removeTableKeyPrefix(selectedLetter.user.PK),
                    );
                    if (user) {
                        setSelectedUser(user);
                    }
                }
            } catch (error) {
                console.error('사용자 목록을 가져오는 중 오류 발생:', error);
            }
        };

        fetchUsers();
    }, [selectedLetter?.user, open]);

    // 검색어에 따라 사용자 필터링
    useEffect(() => {
        if (name) {
            const filtered = users.filter(
                user =>
                    user.name.toLowerCase().includes(name.toLowerCase()) ||
                    user.email.toLowerCase().includes(name.toLowerCase()) ||
                    user.PK?.toLowerCase().includes(name.toLowerCase()),
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers([]);
        }
    }, [name, users]);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowUserList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const resetForm = () => {
        setName('');
        setImages([]);
        setSelectedUser(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(file => ({
                url: URL.createObjectURL(file),
                file,
                id: uuidv4(),
                isUploaded: false,
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleUserSelect = (user: UserPublic) => {
        setSelectedUser(user);
        setName(user.name);
        setShowUserList(false);
    };

    const validateForm = () => {
        if (!selectedUser) {
            toast.warning('받는사람을 선택해주세요.');
            return false;
        }
        if (!senderName) {
            toast.warning('보내는 사람을 입력해주세요.');
            return false;
        }
        if (images.length === 0) {
            toast.warning('사진을 추가해주세요.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (selectedLetter) {
            // 편집 모드: 기존 편지 업데이트
            const updatedPhotos = await parsePhotos(images);

            const letterId = selectedLetter?.SK.replace('RECEIVED_LETTER#', '');

            await handleUpdateReceivedLetter({
                id: letterId,
                user: {
                    PK: selectedUser?.PK,
                    name: selectedUser?.name,
                },
                photos: updatedPhotos,
                senderName: senderName,
            });
        } else {
            // 새 편지 추가 모드
            const photos = images.map(image => ({
                id: image.id || uuidv4(),
                url: image.url,

                isUploaded: false,
            }));

            await handleCreateReceivedLetter({
                id: uuidv4(),
                user: {
                    PK: selectedUser?.PK,
                    name: selectedUser?.name,
                },
                photos,
                senderName: senderName,
            });
        }

        onOpenChange?.(false);
        resetForm();
    };

    const handleDelete = async () => {
        if (selectedLetter) {
            const letterId = selectedLetter?.SK.replace('RECEIVED_LETTER#', '');
            await handleDeleteReceivedLetter(letterId);
            onOpenChange?.(false);
            resetForm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] !bg-white">
                <DialogHeader>
                    <DialogTitle>{selectedLetter ? '편지 수정' : '새 편지 추가'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            받는사람
                        </Label>
                        <div className="col-span-3 relative" ref={searchRef}>
                            <div className="flex items-center relative">
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={e => {
                                        setName(e.target.value);
                                        if (e.target.value) {
                                            setShowUserList(true);
                                        } else {
                                            setShowUserList(false);
                                        }
                                    }}
                                    className="pr-10"
                                    placeholder="사용자 이름을 입력하세요"
                                    onFocus={() => {
                                        if (name && filteredUsers.length > 0) {
                                            setShowUserList(true);
                                        }
                                    }}
                                />
                                <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
                            </div>

                            {showUserList && filteredUsers.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border">
                                    <ScrollArea className="max-h-60">
                                        <div className="py-1">
                                            {filteredUsers.map(user => (
                                                <div
                                                    key={user.PK}
                                                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleUserSelect(user)}
                                                >
                                                    <UserIcon className="h-4 w-4 mr-2" />
                                                    <div>
                                                        <div>{user.name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {selectedUser && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    선택된 사용자: {selectedUser.name} ({selectedUser.email})
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            보내는 사람
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="senderName"
                                value={senderName}
                                onChange={e => setSenderName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="images" className="text-right">
                            사진
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="mb-2"
                            />
                            {images.length > 0 && (
                                <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        {images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative rounded-md overflow-hidden h-[100px] flex items-center justify-center"
                                            >
                                                <Image
                                                    src={image.url}
                                                    alt={`업로드된 이미지 ${index + 1}`}
                                                    fill
                                                    style={{
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 z-10"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex justify-between">
                    {selectedLetter && (
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            type="button"
                            className="mr-auto"
                        >
                            삭제
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange?.(false)}
                            type="button"
                        >
                            취소
                        </Button>
                        <Button onClick={handleSubmit} type="button">
                            {selectedLetter ? '수정' : '추가'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
