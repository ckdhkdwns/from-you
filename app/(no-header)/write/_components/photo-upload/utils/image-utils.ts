import { CroppedAreaPixels } from '../types';

// 이미지 생성 함수
export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = document.createElement('img');
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', error => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        if (url.indexOf('blob:') !== -1) {
            image.src = url;
        } else {
            image.src = url + '?timestamp=' + new Date().getTime();
        }
    });

// 잘린 이미지 생성 함수
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: CroppedAreaPixels,
    rotation = 0,
): Promise<Blob> {
    const image = (await createImage(imageSrc)) as HTMLImageElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas context is not available');
    }

    // 회전을 고려한 캔버스 설정
    const maxSize = Math.max(pixelCrop.width, pixelCrop.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // 안전 영역을 설정하여 회전시 이미지가 잘리지 않게 함
    canvas.width = safeArea;
    canvas.height = safeArea;

    // 캔버스 중앙을 기준으로 회전
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // 배경을 투명하게 설정
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, safeArea, safeArea);

    // 이미지 중앙에 그리기
    const xCenter = safeArea / 2;
    const yCenter = safeArea / 2;

    // 이미지 그리기
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        xCenter - pixelCrop.width / 2,
        yCenter - pixelCrop.height / 2,
        pixelCrop.width,
        pixelCrop.height,
    );

    // 결과 캔버스 생성 (최종 크기로 조정)
    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = pixelCrop.width;
    resultCanvas.height = pixelCrop.height;
    const resultCtx = resultCanvas.getContext('2d');

    if (!resultCtx) {
        throw new Error('Result canvas context is not available');
    }

    // 결과 캔버스에 회전된 이미지 그리기
    resultCtx.drawImage(
        canvas,
        safeArea / 2 - pixelCrop.width / 2,
        safeArea / 2 - pixelCrop.height / 2,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    );

    // 캔버스를 blob으로 변환
    return new Promise((resolve, reject) => {
        resultCanvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg');
    });
}

// 사진 크기 포맷 함수
export const formatPhotoSize = (photoSize?: { width: number; height: number }) => {
    if (photoSize) {
        const { width, height } = photoSize;
        return `${width / 10}cm × ${height / 10}cm`;
    }
    return '표준 크기';
};
