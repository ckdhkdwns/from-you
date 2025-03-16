/* eslint-disable react/no-unknown-property */
'use client';

import React from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, X } from 'lucide-react';
import { CroppedAreaPixels } from '../types';
import { formatPhotoSize } from '../utils/image-utils';
import { Separator } from '@/components/ui/separator';

interface PhotoCropperProps {
    imageUrl: string;
    crop: { x: number; y: number };
    zoom: number;
    rotation: number;
    aspectRatio: number;
    hasEdits: boolean;
    photoSize?: { width: number; height: number };
    onCropChange: (crop: { x: number; y: number }) => void;
    onZoomChange: (zoom: number) => void;
    onRotateClockwise: () => void;
    onRotateCounterClockwise: () => void;
    onCropComplete: (croppedArea: unknown, croppedAreaPixels: unknown) => void;
    onSave: () => void;
}

export default function PhotoCropper({
    imageUrl,
    crop,
    zoom,
    rotation,
    aspectRatio,
    hasEdits,
    photoSize,
    onCropChange,
    onZoomChange,
    onRotateClockwise,
    onRotateCounterClockwise,
    onCropComplete,
    onSave,
}: PhotoCropperProps) {
    const handleZoomIn = () => {
        onZoomChange(Math.min(zoom + 0.1, 5));
    };

    const handleZoomOut = () => {
        onZoomChange(Math.max(zoom - 0.1, 0.1));
    };

    return (
        <div className="flex flex-col space-y-5 w-full">
            {/* 크로퍼 영역 */}
            <div className="relative h-[45vh] w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
                <Cropper
                    image={imageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onZoomChange={onZoomChange}
                    restrictPosition={false}
                    minZoom={0.1}
                    maxZoom={5}
                    rotation={rotation}
                    classes={{
                        containerClassName: 'rounded-lg',
                    }}
                />
            </div>

            {/* 컨트롤 영역 */}
            <div className="w-full px-2">
                {/* 상단 정보 및 컨트롤 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-slate-700">
                        <span>사진 크기:</span>
                        <span className="ml-1 text-secondary-newpink font-semibold">
                            {formatPhotoSize(photoSize)}
                        </span>
                    </div>

                    {/* 컨트롤 버튼들 */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-md hover:bg-slate-100"
                                onClick={onRotateCounterClockwise}
                                title="왼쪽으로 회전"
                            >
                                <RotateCcw className="h-4 w-4 text-slate-700" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-md hover:bg-slate-100"
                                onClick={onRotateClockwise}
                                title="오른쪽으로 회전"
                            >
                                <RotateCw className="h-4 w-4 text-slate-700" />
                            </Button>

                            <Separator orientation="vertical" className="h-6 mx-1" />

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-md hover:bg-slate-100"
                                onClick={handleZoomOut}
                                title="축소"
                            >
                                <ZoomOut className="h-4 w-4 text-slate-700" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-md hover:bg-slate-100"
                                onClick={handleZoomIn}
                                title="확대"
                            >
                                <ZoomIn className="h-4 w-4 text-slate-700" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 확대/축소 슬라이더 - 주석 해제 */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-500">확대/축소</span>
                        <span className="text-xs font-medium text-slate-500">
                            {zoom.toFixed(1)}x
                        </span>
                    </div>
                    <Slider
                        value={[zoom]}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="py-1"
                        onValueChange={values => onZoomChange(values[0])}
                    />
                </div>

                {/* 적용 버튼 */}
                <div className="flex justify-end">
                    <Button
                        variant="lightPink"
                        onClick={onSave}
                        disabled={!hasEdits}
                        className={`px-5 ${!hasEdits ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary-newpink/90'}`}
                    >
                        적용하기
                    </Button>
                </div>
            </div>
        </div>
    );
}

// 모바일용 크롭 다이얼로그 컴포넌트
export function MobilePhotoCropper({
    isOpen,
    imageUrl,
    crop,
    zoom,
    rotation,
    aspectRatio,
    isMultipleProcessing,
    currentIndex,
    totalCount,
    onCropChange,
    onZoomChange,
    onRotateClockwise,
    onRotateCounterClockwise,
    onCropComplete,
    onCancel,
    onSave,
    onClose,
}: {
    isOpen: boolean;
    imageUrl: string;
    crop: { x: number; y: number };
    zoom: number;
    rotation: number;
    aspectRatio: number;
    isMultipleProcessing: boolean;
    currentIndex: number;
    totalCount: number;
    onCropChange: (crop: { x: number; y: number }) => void;
    onZoomChange: (zoom: number) => void;
    onRotateClockwise: () => void;
    onRotateCounterClockwise: () => void;
    onCropComplete: (croppedArea: unknown, croppedAreaPixels: unknown) => void;
    onCancel: () => void;
    onSave: () => void;
    onClose: () => void;
}) {
    const handleZoomIn = () => {
        onZoomChange(Math.min(zoom + 0.1, 5));
    };

    const handleZoomOut = () => {
        onZoomChange(Math.max(zoom - 0.1, 0.1));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md flex flex-col max-h-[90dvh] overflow-hidden bg-white rounded-t-lg">
                <div className="p-4">
                    {isMultipleProcessing ? (
                        <div className="flex justify-between items-center">
                            <div className="text-sm font-medium text-slate-700">
                                사진 편집 {currentIndex + 1}/{totalCount}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-700 p-1 h-auto"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div className="text-sm font-medium text-slate-700">사진 편집</div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-700 p-1 h-auto"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-5 pt-0">
                    <div className="relative h-64 mb-5 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                        {imageUrl && (
                            <Cropper
                                image={imageUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                onCropChange={onCropChange}
                                onZoomChange={onZoomChange}
                                onCropComplete={onCropComplete}
                                rotation={rotation}
                            />
                        )}
                    </div>

                    <div className="space-y-5 px-2">
                        {/* 확대/축소 컨트롤 */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-700">확대/축소</div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 rounded-full p-0 border-slate-200"
                                        onClick={handleZoomOut}
                                    >
                                        <ZoomOut className="h-3 w-3" />
                                    </Button>
                                    <span className="text-xs font-medium text-slate-500 w-10 text-center">
                                        {zoom.toFixed(1)}x
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 rounded-full p-0 border-slate-200"
                                        onClick={handleZoomIn}
                                    >
                                        <ZoomIn className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <Slider
                                value={[zoom]}
                                min={0.1}
                                max={5}
                                step={0.1}
                                className="py-1"
                                onValueChange={values => onZoomChange(values[0])}
                            />
                        </div>
                        <Separator />
                        {/* 회전 컨트롤 */}
                        <div className="">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-slate-700">회전</div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 rounded-full p-0 border-slate-200"
                                        onClick={onRotateCounterClockwise}
                                    >
                                        <RotateCcw className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 rounded-full p-0 border-slate-200"
                                        onClick={onRotateClockwise}
                                    >
                                        <RotateCw className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    {isMultipleProcessing ? (
                        <div className="flex justify-between w-full">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                className="border-slate-200 text-slate-700"
                            >
                                건너뛰기
                            </Button>
                            <Button
                                variant="lightPink"
                                onClick={onSave}
                                className="hover:bg-secondary-newpink/90"
                            >
                                {currentIndex === totalCount - 1 ? '완료' : '다음'}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                className="border-slate-200 text-slate-700"
                            >
                                취소
                            </Button>
                            <Button
                                variant="lightPink"
                                onClick={onSave}
                                className="hover:bg-secondary-newpink/90"
                            >
                                적용하기
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
