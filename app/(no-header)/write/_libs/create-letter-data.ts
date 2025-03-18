import { LetterInput, Photo, Font } from '@/models/types/letter';
import { parsePhotos } from './parse-photos';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { AddressPublic } from '@/models/types/address';

export async function createLetterData({
    letterId,
    template,
    text,
    font,
    photo,
    recipientAddress,
    senderAddress,
    selectedPostType,
    paperPrice,
    photoPrice,
    postTypePrice,
    initialPrice,
    totalPrice,
    isUsingPoint,
    usePointAmount,
    earnPointAmount,
}: {
    letterId: string;
    template: any; // 템플릿 타입은 필요에 따라 수정
    text: string | string[];
    font: Font;
    photo: Photo[];
    recipientAddress: AddressPublic;
    senderAddress: AddressPublic;
    selectedPostType: string;
    paperPrice: number;
    photoPrice: number;
    postTypePrice: number;
    initialPrice: number;
    totalPrice: number;
    isUsingPoint: boolean;
    usePointAmount: number;
    earnPointAmount: number;
}): Promise<LetterInput> {
    const photos = await parsePhotos(photo);
    
    // text가 문자열인 경우 배열로 변환
    const textArray = Array.isArray(text) ? text : [text];

    // 템플릿 객체 형태 수정 (LetterInput 타입에 맞춤)
    const templateData = {
        PK: template?.PK || '',
        SK: template?.SK || '',
        name: template?.name || '',
        thumbnail: template?.thumbnail || '',
        paperImage: template?.paperImage || '',
    };

    return {
        id: removeTableKeyPrefix(letterId),

        template: templateData,
        text: textArray,
        font: font,
        photos: photos,
        recipientAddress: recipientAddress,
        senderAddress: senderAddress,
        postType: selectedPostType,
        // 가격 정보 구조
        priceInfo: {
            paperPrice,
            photoPrice,
            postTypePrice,
            initialPrice,
            totalPrice,
        },
        pointInfo: {
            isUsingPoint,
            usePointAmount,
            earnPointAmount,
        },
    };
} 