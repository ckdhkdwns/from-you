'use client';

import React, { useRef } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash, CropIcon, Plus, Upload } from 'lucide-react';
import Dropzone, { DropzoneState } from 'shadcn-dropzone';
import { cn } from '@/lib/utils';
import { PhotoItem } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PhotoListProps {
    photos: PhotoItem[];
    selectedPhotoId: string | null;
    aspectRatio?: number;
    onSelectPhoto: (photo: PhotoItem) => void;
    onDeletePhoto: (id: string) => void;
    onAddPhoto: () => void;
}

export default function PhotoList({
    photos,
    selectedPhotoId,
    aspectRatio = 1,
    onSelectPhoto,
    onDeletePhoto,
    onAddPhoto,
}: PhotoListProps) {
    return (
        <div className="w-full flex flex-col items-start justify-start h-full">
            <div className="flex items-center justify-between w-full bg-primary-ivory pb-2 pr-2">
                <div className="font-medium text-gray-450">
                    사진: <span className="!text-primary-black">{photos.length}</span>장
                </div>
                <Button
                    variant="outlinePink"
                    size="sm"
                    onClick={onAddPhoto}
                    className="flex items-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    <span>사진 추가</span>
                </Button>
            </div>
            <ScrollArea className="h-full w-full pr-2 pb-4" type="always">
                <div className="grid grid-cols-2 auto-rows-max gap-3 w-full">
                    {photos.map(photoItem => (
                        <div
                            key={photoItem.id}
                            className={cn(
                                'w-full relative group rounded-md overflow-hidden border cursor-pointer flex',
                                selectedPhotoId === photoItem.id
                                    ? 'border-secondary-newpink'
                                    : 'border-gray-200',
                            )}
                            style={{ aspectRatio }}
                            onClick={() => onSelectPhoto(photoItem)}
                        >
                            <NextImage
                                src={photoItem.url}
                                alt="업로드된 사진"
                                className="object-cover flex h-max"
                                fill
                                style={{ aspectRatio }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end gap-2 p-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 bg-white/80 hover:bg-white"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDeletePhoto(photoItem.id);
                                    }}
                                >
                                    <Trash className="h-4 w-4 text-black" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

// 모바일 사진 목록
export function MobilePhotoList({
    photos,
    aspectRatio = 1,
    onSelectPhoto,
    onDeletePhoto,
}: Omit<PhotoListProps, 'selectedPhotoId' | 'onAddPhoto'>) {
    if (photos.length === 0) return null;

    return (
        <div className="w-full flex flex-col items-start justify-center gap-2 max-w-xl">
            <div className="font-medium text-gray-450">
                추가된 사진: <span className="!text-primary-black">{photos.length}</span>장
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide w-full">
                {photos.map(photoItem => (
                    <div
                        key={photoItem.id}
                        className="relative group rounded-md overflow-hidden border border-gray-200 min-w-[40%] snap-center flex-shrink-0"
                        style={{ aspectRatio }}
                    >
                        <NextImage
                            src={photoItem.url}
                            alt="업로드된 사진"
                            className="object-cover cursor-pointer"
                            fill
                            onClick={() => onSelectPhoto(photoItem)}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 bg-white/80 hover:bg-white"
                                onClick={() => onSelectPhoto(photoItem)}
                            >
                                <CropIcon className="h-4 w-4 text-black" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 bg-white/80 hover:bg-white"
                                onClick={() => onDeletePhoto(photoItem.id)}
                            >
                                <Trash className="h-4 w-4 text-black" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 드롭존 컴포넌트
interface PhotoDropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    isMobile?: boolean;
}

export function PhotoDropzone({ onDrop, isMobile = false }: PhotoDropzoneProps) {
    return (
        <Dropzone
            onDrop={onDrop}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
            dropZoneClassName="max-w-xl w-full h-64 border-secondary-newpink"
            containerClassName="w-full flex justify-center items-center"
        >
            {(dropzone: DropzoneState) => (
                <div className="flex flex-col items-center justify-center gap-1">
                    {dropzone.isDragAccept ? (
                        <div className="text-sm font-medium">여기에 사진을 드래그해주세요!</div>
                    ) : (
                        <div className="flex items-center flex-col gap-1.5">
                            <div className="flex items-center flex-row gap-0.5 font-medium text-gray-500">
                                {isMobile ? '사진 선택하기' : '클릭하거나 사진을 드래그해주세요'}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Dropzone>
    );
}

// 빈 편집기 컴포넌트
export function EmptyPhotoEditor({ onAddPhoto }: { onAddPhoto: () => void }) {
    return (
        <div className="w-full md:w-3/5 flex items-center justify-center p-4 bg-gray-50 rounded-md">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <Upload className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">사진을 선택하거나 새 사진을 추가하세요</p>
                <Button variant="outline" onClick={onAddPhoto}>
                    새 사진 추가하기
                </Button>
            </div>
        </div>
    );
}

// 파일 입력 컴포넌트
export function FileInput({
    onFileSelected,
    multiple = true,
}: {
    onFileSelected: (files: File[]) => void;
    multiple?: boolean;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            onFileSelected(fileArray);
        }
        // 같은 파일 다시 선택 가능하도록 초기화
        e.target.value = '';
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
                multiple={multiple}
            />
            <Button variant="outline" onClick={triggerFileInput}>
                사진 선택하기
            </Button>
        </>
    );
}
