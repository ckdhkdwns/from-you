import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import React from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCw, RotateCcw, ZoomIn, ZoomOut, X } from 'lucide-react';

interface PhotoCropperDialogProps {
    cropperOpen: boolean;
    setCropperOpen: (_open: boolean) => void;
    currentImage: string | null;
    crop: { x: number; y: number };
    setCrop: (_crop: { x: number; y: number }) => void;
    zoom: number;
    setZoom: (_zoom: number) => void;
    rotation: number;
    handleRotate: () => void;
    aspectRatio: number;
    handleCropComplete: (_croppedArea: unknown, _croppedAreaPixels: unknown) => void;
    handleSaveCroppedImage: () => Promise<void>;
    templateConfig?: {
        photoSize?: {
            width: number;
            height: number;
        };
    };
}

export default function PhotoCropperDialog({
    cropperOpen,
    setCropperOpen,
    currentImage,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    aspectRatio,
    handleCropComplete,
    handleSaveCroppedImage,
    templateConfig,
}: PhotoCropperDialogProps) {
    const handleRotateClockwise = () => {
        // 시계 방향 회전 (90도)
        document.dispatchEvent(new CustomEvent('rotate-image', { detail: { direction: 'cw' } }));
    };

    const handleRotateCounterClockwise = () => {
        // 반시계 방향 회전 (-90도)
        document.dispatchEvent(new CustomEvent('rotate-image', { detail: { direction: 'ccw' } }));
    };

    const handleZoomIn = () => {
        setZoom(Math.min(zoom + 0.1, 5));
    };

    const handleZoomOut = () => {
        setZoom(Math.max(zoom - 0.1, 0.1));
    };

    // 사진 크기 표시
    const formatPhotoSize = () => {
        if (templateConfig?.photoSize) {
            const { width, height } = templateConfig.photoSize;
            return `${width / 10}cm × ${height / 10}cm`;
        }
        return '표준 크기';
    };

    return (
        <ResponsiveDialog
            open={cropperOpen}
            onOpenChange={setCropperOpen}
            title={
                <div className="flex items-center gap-2 justify-center relative">
                    <div>사진 편집하기</div>

                    <X className="w-4 h-4 absolute right-2" onClick={() => setCropperOpen(false)} />
                </div>
            }
            contentClassName="max-w-md w-full md:max-w-2xl !bg-white"
        >
            <div className="relative h-[40dvh] md:h-[50dvh] w-full rounded-md overflow-hidden bg-gray-50 mb-6">
                {currentImage && (
                    <Cropper
                        image={currentImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={handleCropComplete}
                        onZoomChange={setZoom}
                        restrictPosition={false}
                        minZoom={0.1}
                        maxZoom={5}
                        rotation={rotation}
                        classes={{
                            containerClassName: 'rounded-md',
                        }}
                    />
                )}
            </div>

            {/* 사진 정보 및 컨트롤 영역 */}
            <div className="space-y-6 px-1">
                {/* 사진 크기 정보 */}
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-700">
                        <span className="mr-1">사진 크기:</span>
                        <span className="text-secondary-newpink font-semibold">
                            {formatPhotoSize()}
                        </span>
                    </div>
                </div>

                {/* 회전 컨트롤 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700">회전</div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-full"
                                onClick={handleRotateCounterClockwise}
                                title="왼쪽으로 회전"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-full"
                                onClick={handleRotateClockwise}
                                title="오른쪽으로 회전"
                            >
                                <RotateCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 확대/축소 컨트롤 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700">확대/축소</div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-full"
                                onClick={handleZoomOut}
                                title="축소"
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 rounded-full"
                                onClick={handleZoomIn}
                                title="확대"
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* 줌 슬라이더 */}
                    <Slider
                        value={[zoom]}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="py-1"
                        onValueChange={values => setZoom(values[0])}
                    />
                </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex justify-end mt-8">
                <Button
                    variant="lightPink"
                    className="max-md:w-full max-md:h-12"
                    onClick={handleSaveCroppedImage}
                >
                    적용하기
                </Button>
            </div>
        </ResponsiveDialog>
    );
}
