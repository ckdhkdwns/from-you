'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CropState, CroppedAreaPixels, PhotoItem, EditValues } from '../types';
import { getCroppedImg } from '../utils/image-utils';

interface UsePhotoEditorProps {
    initialPhotos: PhotoItem[];
    onPhotosChange: (photos: PhotoItem[]) => void;
    aspectRatio?: number;
}

export function usePhotoEditor({
    initialPhotos = [],
    onPhotosChange,
    aspectRatio = 1,
}: UsePhotoEditorProps) {
    // 상태 관리
    const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
    const [cropperOpen, setCropperOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
    const [tempFile, setTempFile] = useState<File | null>(null);
    const [desktopInitialView, setDesktopInitialView] = useState(true);
    const [hasEdits, setHasEdits] = useState(false);

    // 여러 이미지 처리를 위한 상태
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [processingIndex, setProcessingIndex] = useState(-1);
    const [isProcessingMultiple, setIsProcessingMultiple] = useState(false);
    const [newlyAddedPhotos, setNewlyAddedPhotos] = useState<PhotoItem[]>([]);

    // 참조 값
    const initialCropRef = useRef({ x: 0, y: 0 });
    const initialZoomRef = useRef(1);
    const initialRotationRef = useRef(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 포토 상태 변경시 콜백 호출
    useEffect(() => {
        console.log('usePhotoEditor - photos 변경됨:', photos.length);
        onPhotosChange(photos);
    }, [photos, onPhotosChange]);

    // 상태 리셋 함수들
    const resetCropState = (): CropState => {
        return {
            crop: { x: 0, y: 0 },
            zoom: 1,
            rotation: 0,
        };
    };

    const updateInitialRefs = (state: CropState) => {
        initialCropRef.current = state.crop;
        initialZoomRef.current = state.zoom;
        initialRotationRef.current = state.rotation;
    };

    const applyAndResetCropState = () => {
        const newState = resetCropState();
        setCrop(newState.crop);
        setZoom(newState.zoom);
        setRotation(newState.rotation);
        updateInitialRefs(newState);
        setHasEdits(false);
    };

    // 편집 상태 확인 함수
    const checkEdits = (values: EditValues = {}) => {
        const currentCrop = values.crop || crop;
        const currentZoom = values.zoom || zoom;
        const currentRotation = values.rotation || rotation;

        const hasCropChanged =
            currentCrop.x !== initialCropRef.current.x ||
            currentCrop.y !== initialCropRef.current.y;
        const hasZoomChanged = currentZoom !== initialZoomRef.current;
        const hasRotationChanged = currentRotation !== initialRotationRef.current;

        setHasEdits(hasCropChanged || hasZoomChanged || hasRotationChanged);
    };

    // 파일 처리 함수들
    const handleDrop = (acceptedFiles: File[], isMobile: boolean) => {
        if (acceptedFiles.length === 0) return;

        if (!isMobile) {
            // 데스크톱에서 바로 사진 추가
            handleDesktopUpload(acceptedFiles);
        } else {
            // 모바일에서는 큐에 파일 추가하고 처리 시작
            setPendingFiles(acceptedFiles);
            setProcessingIndex(0);
            setIsProcessingMultiple(true);
            setNewlyAddedPhotos([]);

            // 첫 번째 파일 처리 시작
            const imageUrl = URL.createObjectURL(acceptedFiles[0]);
            openCropper(imageUrl, acceptedFiles[0]);
        }
    };

    // 데스크톱 파일 업로드 처리
    const handleDesktopUpload = (files: File[]) => {
        setDesktopInitialView(false);

        // 새 사진들 생성 및 추가
        const newPhotos = files.map(file => {
            const imageUrl = URL.createObjectURL(file);
            return {
                id: uuidv4(),
                url: imageUrl,
                isUploaded: false,
                file: file,
            };
        });

        setPhotos(prev => [...prev, ...newPhotos]);

        // 첫 번째 새 사진 선택
        if (newPhotos.length > 0) {
            setCurrentImage(newPhotos[0].url);
            setEditingPhotoId(newPhotos[0].id);
            setTempFile(newPhotos[0].file);

            // 처음 로드 시에만 초기화
            if (crop.x === 0 && crop.y === 0 && zoom === 1 && rotation === 0) {
                const initialState = resetCropState();
                setCrop(initialState.crop);
                setZoom(initialState.zoom);
                setRotation(initialState.rotation);
                updateInitialRefs(initialState);
            }
            setHasEdits(false);
        }
    };

    // 다음 파일 처리로 이동
    const moveToNextFile = () => {
        const nextIndex = processingIndex + 1;
        if (nextIndex < pendingFiles.length) {
            setProcessingIndex(nextIndex);
            const imageUrl = URL.createObjectURL(pendingFiles[nextIndex]);
            openCropper(imageUrl, pendingFiles[nextIndex]);
        } else {
            // 모든 파일 처리 완료
            finishMultipleProcessing();
        }
    };

    // 여러 파일 처리 완료
    const finishMultipleProcessing = () => {
        setCropperOpen(false);
        setCurrentImage(null);
        setEditingPhotoId(null);
        setTempFile(null);
        applyAndResetCropState();
        setIsProcessingMultiple(false);
        setPendingFiles([]);
        setProcessingIndex(-1);

        // 모든 새로 추가된 사진들을 포토 목록에 추가
        if (newlyAddedPhotos.length > 0) {
            setPhotos(prev => [...prev, ...newlyAddedPhotos]);
            setNewlyAddedPhotos([]);
        }
    };

    // 사진 편집 관련 함수들
    const openCropper = (imageUrl: string, file?: File, id?: string) => {
        setCurrentImage(imageUrl);
        if (file) setTempFile(file);
        if (id) setEditingPhotoId(id);

        setCropperOpen(true);

        // crop 영역이 초기화되지 않도록 초기화 로직 제거
        // 처음 불러올 때만 초기 설정
        if (crop.x === 0 && crop.y === 0 && zoom === 1 && rotation === 0) {
            const initialState = resetCropState();
            setCrop(initialState.crop);
            setZoom(initialState.zoom);
            setRotation(initialState.rotation);
            updateInitialRefs(initialState);
        }

        setHasEdits(false);
    };

    const selectPhoto = (photoItem: PhotoItem, isMobile: boolean) => {
        if (isMobile) {
            openCropper(photoItem.url, photoItem.file, photoItem.id);
        } else {
            setCurrentImage(photoItem.url);
            setEditingPhotoId(photoItem.id);
            if (photoItem.file) setTempFile(photoItem.file);

            // 처음 로드 시에만 초기화
            if (crop.x === 0 && crop.y === 0 && zoom === 1 && rotation === 0) {
                const initialState = resetCropState();
                setCrop(initialState.crop);
                setZoom(initialState.zoom);
                setRotation(initialState.rotation);
                updateInitialRefs(initialState);
            }

            setHasEdits(false);
        }
    };

    const handleDelete = (id: string, isMobile: boolean) => {
        setPhotos(prev => prev.filter(photo => photo.id !== id));

        // 현재 편집 중인 사진이 삭제되었을 경우
        if (editingPhotoId === id) {
            if (photos.length > 1) {
                // 다른 사진이 있으면 첫 번째 사진을 선택
                const remainingPhotos = photos.filter(photo => photo.id !== id);
                if (remainingPhotos.length > 0) {
                    selectPhoto(remainingPhotos[0], isMobile);
                }
            } else if (!isMobile) {
                // 데스크톱에서 사진이 없으면 초기 화면 표시
                setDesktopInitialView(true);
                setCurrentImage(null);
                setEditingPhotoId(null);
                setTempFile(null);
                applyAndResetCropState();
            }
        }
    };

    // 크롭 이벤트 핸들러
    const handleCropComplete = (croppedArea: unknown, croppedAreaPixels: unknown) => {
        setCroppedAreaPixels(croppedAreaPixels as CroppedAreaPixels);
    };

    const handleCropChange = (newCrop: { x: number; y: number }) => {
        setCrop(newCrop);
        checkEdits({ crop: newCrop });
    };

    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
        checkEdits({ zoom: newZoom });
    };

    const handleRotateClockwise = () => {
        setRotation(prev => {
            const newRotation = (prev + 90) % 360;
            checkEdits({ rotation: newRotation });
            return newRotation;
        });
    };

    const handleRotateCounterClockwise = () => {
        setRotation(prev => {
            const newRotation = (prev - 90) % 360;
            checkEdits({ rotation: newRotation });
            return newRotation;
        });
    };

    // 이미지 저장/취소 핸들러
    const handleSaveCroppedImage = async (isMobile: boolean) => {
        if (!currentImage || !croppedAreaPixels) {
            console.log('이미지 자르기 오류: currentImage 또는 croppedAreaPixels가 없음', {
                currentImage,
                croppedAreaPixels,
            });
            return;
        }

        try {
            console.log('이미지 자르기 시작', {
                isMobile,
                editingPhotoId,
                isProcessingMultiple,
                currentImage: currentImage.substring(0, 30) + '...',
            });

            const croppedBlob = await getCroppedImg(currentImage, croppedAreaPixels, rotation);
            console.log('이미지 자르기 완료: Blob 생성됨', croppedBlob.size);

            const croppedFile = new File(
                [croppedBlob],
                tempFile ? tempFile.name : 'cropped-image.jpg',
                { type: 'image/jpeg' },
            );

            const croppedUrl = URL.createObjectURL(croppedBlob);
            console.log('자른 이미지 URL 생성됨:', croppedUrl.substring(0, 30) + '...');

            if (isProcessingMultiple && isMobile) {
                // 멀티 프로세싱 모드에서는 새 사진 배열에 추가
                const newPhoto = {
                    id: uuidv4(),
                    url: croppedUrl,
                    isUploaded: false,
                    file: croppedFile,
                };
                setNewlyAddedPhotos(prev => [...prev, newPhoto]);
                console.log('멀티 프로세싱 모드: 새 사진 추가됨', newPhoto.id);

                // 다음 파일로 이동
                moveToNextFile();
            } else if (editingPhotoId) {
                // 기존 사진 편집
                console.log('기존 사진 편집 시작:', editingPhotoId);
                setPhotos(prev => {
                    const updated = prev.map(item =>
                        item.id === editingPhotoId
                            ? {
                                  ...item,
                                  url: croppedUrl,
                                  file: croppedFile,
                              }
                            : item,
                    );
                    console.log(
                        '사진 업데이트 완료. 변경 전:',
                        prev.length,
                        '변경 후:',
                        updated.length,
                    );
                    return updated;
                });

                if (isMobile) {
                    console.log('모바일 모드에서 크로퍼 닫기');
                    setCropperOpen(false);
                    setCurrentImage(null);
                    setEditingPhotoId(null);
                }
            } else {
                // 새 사진 추가
                const newPhoto = {
                    id: uuidv4(),
                    url: croppedUrl,
                    isUploaded: false,
                    file: croppedFile,
                };
                console.log('새 사진 추가:', newPhoto.id);

                setPhotos(prev => {
                    const updated = [...prev, newPhoto];
                    console.log(
                        '사진 배열 업데이트 완료. 변경 전:',
                        prev.length,
                        '변경 후:',
                        updated.length,
                    );
                    return updated;
                });

                // 모바일이 아니면 새 사진 선택
                if (!isMobile) {
                    setCurrentImage(croppedUrl);
                    setEditingPhotoId(newPhoto.id);
                    setTempFile(croppedFile);
                } else {
                    console.log('모바일 모드에서 크로퍼 닫기 (새 사진)');
                    setCropperOpen(false);
                    setCurrentImage(null);
                    setEditingPhotoId(null);
                }
            }

            applyAndResetCropState();

            // 모바일 모드에서만 추가 초기화
            if (isMobile && !isProcessingMultiple) {
                setTempFile(null);
            }
        } catch (error) {
            console.error('이미지 자르기 오류:', error);
        }
    };

    const handleCancel = () => {
        if (isProcessingMultiple) {
            // 여러 파일 처리 중에는 현재 파일 건너뛰기
            moveToNextFile();
        } else {
            setCropperOpen(false);
            setCurrentImage(null);
            setEditingPhotoId(null);
            setTempFile(null);
            applyAndResetCropState();
        }
    };

    // 여러 파일 업로드 취소
    const handleCancelMultipleUpload = () => {
        setCropperOpen(false);
        setCurrentImage(null);
        setEditingPhotoId(null);
        setTempFile(null);
        applyAndResetCropState();
        setIsProcessingMultiple(false);
        setPendingFiles([]);
        setProcessingIndex(-1);
        setNewlyAddedPhotos([]);
    };

    return {
        // 상태
        photos,
        cropperOpen,
        currentImage,
        editingPhotoId,
        crop,
        zoom,
        rotation,
        tempFile,
        desktopInitialView,
        hasEdits,
        pendingFiles,
        processingIndex,
        isProcessingMultiple,
        newlyAddedPhotos,
        fileInputRef,

        // 설정 함수
        setCropperOpen,
        setDesktopInitialView,

        // 이벤트 핸들러
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
    };
}
