'use server';

import { Resource } from 'sst';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-northeast-2',
});

interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * 이미지 파일을 S3에 업로드하기 위한 서명된 URL을 생성합니다.
 */
export async function generatePresignedUrl(
    folder: 'templates' | 'letters' | 'photos',
    fileType: string,
): Promise<string> {
    const fileExtension = fileType.split('/')[1];
    const randomFileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;
    const key = `${folder}/${randomFileName}`;

    const command = new PutObjectCommand({
        Bucket: Resource.FromYouBucket.name,
        Key: key,
        ContentType: fileType,
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 5, // URL은 5분간 유효
        });
        return signedUrl;
    } catch (error) {
        console.error('Failed to generate presigned URL:', error);
        throw new Error('파일 업로드 URL 생성에 실패했습니다.');
    }
}

/**
 * 이미지를 S3에 업로드합니다.
 */
export async function uploadImage(
    folder: 'templates' | 'letters' | 'photos',
    file: File,
): Promise<UploadResult> {
    try {
        // 서명된 URL 생성
        const signedUrl = await generatePresignedUrl(folder, file.type);

        // 클라이언트 사이드에서 파일 업로드
        const response = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file?.type || 'image/jpeg',
            },
        });

        if (!response.ok) {
            throw new Error('파일 업로드에 실패했습니다.');
        }

        const publicUrl = signedUrl.split('?')[0];

        return {
            success: true,
            url: publicUrl,
        };
    } catch (error) {
        console.error('Image upload error:', error);
        return {
            success: false,
            error: '이미지 업로드 중 오류가 발생했습니다.',
        };
    }
}
