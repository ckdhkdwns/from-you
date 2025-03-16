import { uploadImage } from '@/models/actions/s3/storage-actions';
import { Photo } from '@/models/types/letter';

/**
 * s3에 업로드되지 않은 파일을 업로드
 */
export const parsePhotos = async (photoList: Photo[]) => {
    const uploadPromises: Promise<Photo>[] = photoList.map(async photo => {
        if (photo.isUploaded) {
            const { id, isUploaded, url } = photo;
            return { id, isUploaded, url };
        }

        const result = await uploadImage('photos', photo.file);
        return {
            id: photo.id,
            isUploaded: true,
            url: result.url,
        };
    });

    const results = await Promise.all(uploadPromises);
    return results;
};
