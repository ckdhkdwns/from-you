import 'server-only';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({});

export const getPresignedUrl = async () => {
    const command = new PutObjectCommand({
        Bucket: Resource.FromYouBucket.name,
        Key: uuidv4(),
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
};
