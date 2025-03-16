/* eslint-disable react/no-unknown-property */
'use client';

import React, { useEffect } from 'react';
import { useLetter } from '../../_contexts/letter-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import { v4 as uuidv4 } from 'uuid';

// 분리된 컴포넌트들 임포트
import { usePhotoEditor } from '../photo-upload/hooks/use-photo-editor';
import PhotoCropper, { MobilePhotoCropper } from '../photo-upload/components/photo-cropper';
import PhotoList, {
    MobilePhotoList,
    PhotoDropzone,
    EmptyPhotoEditor,
} from '../photo-upload/components/photo-list';
import { PhotoItem } from '../photo-upload/types';
import { Separator } from '@/components/ui/separator';

export default function PhotoUpload() {
    const { photo, setPhoto, templateConfig } = useLetter();
    const isMobile = useIsMobile();

    // 사진 에디터 훅 사용
    const {
        photos,
        cropperOpen,
        currentImage,
        editingPhotoId,
        crop,
        zoom,
        rotation,
        hasEdits,
        desktopInitialView,
        isProcessingMultiple,
        processingIndex,
        pendingFiles,
        fileInputRef,

        setCropperOpen,
        setDesktopInitialView,

        handleDrop,
        selectPhoto,
        handleDelete,
        handleCropComplete,
        handleCropChange,
        handleZoomChange,
        handleRotateClockwise,
        handleRotateCounterClockwise,
        handleSaveCroppedImage,
        handleCancel,
        handleCancelMultipleUpload,
    } = usePhotoEditor({
        initialPhotos: photo,
        onPhotosChange: setPhoto,
        aspectRatio: templateConfig?.photoSize
            ? templateConfig.photoSize.width / templateConfig.photoSize.height
            : 1,
    });

    // useEffect를 추가하여 photos 상태 변화 감지
    useEffect(() => {
        if (photos.length !== photo.length) {
            console.log('photos 변경됨: ', photos.length, '(현재 photo:', photo.length, ')');
        }
    }, [photos, photo]);

    // 첫 번째 사진이 업로드되면 자동으로 선택
    useEffect(() => {
        if (photos.length > 0 && !currentImage && !isMobile) {
            if (desktopInitialView) {
                setDesktopInitialView(false);
            }
            selectPhoto(photos[0], isMobile);
        }
    }, [photos, currentImage, isMobile, desktopInitialView, selectPhoto, setDesktopInitialView]);

    // 파일 입력 핸들러
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            handleDrop(fileArray, isMobile);
        }
        // 같은 파일 다시 선택 가능하도록 초기화
        e.target.value = '';
    };

    // 드롭존 핸들러
    const handleDropzoneDrop = (acceptedFiles: File[]) => {
        handleDrop(acceptedFiles, isMobile);
    };

    // 사진을 선택하는 핸들러
    const handleSelectPhoto = (photoItem: PhotoItem) => {
        selectPhoto(photoItem, isMobile);
    };

    // 사진을 삭제하는 핸들러
    const handleDeletePhoto = (id: string) => {
        handleDelete(id, isMobile);
    };

    // 사진을 저장하는 핸들러
    const handleSavePhoto = async () => {
        console.log('handleSavePhoto 호출됨, isMobile:', isMobile);
        console.log('사진 저장 전:', photo);

        await handleSaveCroppedImage(isMobile);

        console.log('사진 저장 후 photos:', photos);
        // photos가 변경되면 useEffect에 의해 setPhoto가 자동으로 호출됨
    };

    // 파일 입력 트리거
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 글로벌 스타일
    const globalStyles = `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `;

    // 모바일 UI
    if (isMobile) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-4">
                <PhotoDropzone onDrop={handleDropzoneDrop} isMobile={true} />

                <div className="text-sm text-gray-450">
                    이미지 파일(.jpg, .jpeg, .png)만 업로드 가능합니다.
                </div>

                <MobilePhotoList
                    photos={photos}
                    aspectRatio={
                        templateConfig?.photoSize
                            ? templateConfig.photoSize.width / templateConfig.photoSize.height
                            : 1
                    }
                    onSelectPhoto={handleSelectPhoto}
                    onDeletePhoto={handleDeletePhoto}
                />

                <MobilePhotoCropper
                    isOpen={cropperOpen}
                    imageUrl={currentImage || ''}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspectRatio={
                        templateConfig?.photoSize
                            ? templateConfig.photoSize.width / templateConfig.photoSize.height
                            : 1
                    }
                    isMultipleProcessing={isProcessingMultiple}
                    currentIndex={processingIndex}
                    totalCount={pendingFiles.length}
                    onCropChange={handleCropChange}
                    onZoomChange={handleZoomChange}
                    onRotateClockwise={handleRotateClockwise}
                    onRotateCounterClockwise={handleRotateCounterClockwise}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancel}
                    onSave={() => {
                        // 저장 후 photo 상태가 업데이트되었는지 확인하기 위해 콘솔에 로그 출력
                        console.log('모바일 사진 저장 - 이전:', photo);
                        handleSavePhoto();
                        setTimeout(() => {
                            console.log('모바일 사진 저장 - 이후:', photo);
                        }, 100);
                    }}
                    onClose={isProcessingMultiple ? handleCancelMultipleUpload : handleCancel}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleFileSelected}
                    multiple
                />

                <style jsx global>
                    {globalStyles}
                </style>
            </div>
        );
    }

    // 데스크톱 초기 화면 (사진이 없을 때만)
    if (desktopInitialView && photos.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-4">
                <PhotoDropzone onDrop={handleDropzoneDrop} isMobile={false} />

                <div className="text-sm text-gray-450">
                    이미지 파일(.jpg, .jpeg, .png)만 업로드 가능합니다. 여러 파일을 한 번에 선택할
                    수 있습니다.
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleFileSelected}
                    multiple
                />
                {/* <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    onClick={triggerFileInput}
                >
                    사진 선택하기
                </button> */}
            </div>
        );
    }

    // 데스크톱 편집기 화면
    return (
        <div className="w-full h-full p-4 pb-0 pl-6">
            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* 왼쪽: 편집기 영역 */}
                {currentImage ? (
                    <PhotoCropper
                        imageUrl={currentImage}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspectRatio={
                            templateConfig?.photoSize
                                ? templateConfig.photoSize.width / templateConfig.photoSize.height
                                : 1
                        }
                        hasEdits={hasEdits}
                        photoSize={templateConfig?.photoSize}
                        onCropChange={handleCropChange}
                        onZoomChange={handleZoomChange}
                        onRotateClockwise={handleRotateClockwise}
                        onRotateCounterClockwise={handleRotateCounterClockwise}
                        onCropComplete={handleCropComplete}
                        onSave={handleSavePhoto}
                    />
                ) : (
                    <EmptyPhotoEditor onAddPhoto={triggerFileInput} />
                )}

                <Separator orientation="vertical" />
                {/* 오른쪽: 사진 목록 */}
                <div className="w-full md:w-2/5 h-full">
                    <PhotoList
                        photos={photos}
                        selectedPhotoId={editingPhotoId}
                        aspectRatio={
                            templateConfig?.photoSize
                                ? templateConfig.photoSize.width / templateConfig.photoSize.height
                                : 1
                        }
                        onSelectPhoto={handleSelectPhoto}
                        onDeletePhoto={handleDeletePhoto}
                        onAddPhoto={triggerFileInput}
                    />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileSelected}
                multiple
            />

            <style jsx global>
                {globalStyles}
            </style>
        </div>
    );
}
