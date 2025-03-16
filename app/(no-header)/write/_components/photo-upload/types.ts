// 사진 관련 타입 정의
export interface PhotoItem {
    id: string;
    url: string;
    isUploaded: boolean;
    file?: File;
}

export type CroppedAreaPixels = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type CropState = {
    crop: { x: number; y: number };
    zoom: number;
    rotation: number;
};

export type EditValues = {
    crop?: { x: number; y: number };
    zoom?: number;
    rotation?: number;
};

export type PhotoSize = {
    width: number;
    height: number;
};

export type TemplateConfig = {
    photoSize?: PhotoSize;
};
