import { DynamoEntity, EntityKeyPattern } from './dynamo';
import { Photo } from './letter';
import { UserEntity } from './user';

/**
 * 받은 편지 엔티티 키 생성 패턴
 */
export const ReceivedLetterKeys: EntityKeyPattern = {
    pk: (userId: string) => `USER#${userId}`,
    sk: (letterId: string) => `RECEIVED_LETTER#${letterId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'RECEIVED_LETTER',
    gsi1sk: (timestamp: string) => timestamp,
};

/**
 * 클라이언트에서 받은 편지 생성/수정 시 사용하는 입력 타입
 */
export interface ReceivedLetterInput {
    senderName: string;
    photos: Photo[];
    user?: Partial<UserEntity>;

    // 기존 편지 수정 시 사용될 ID (새 편지는 불필요)
    id?: string;
}

export interface ReceivedLetterEntity extends DynamoEntity {
    user: Partial<UserEntity>;
    senderName: string;
    photos: Photo[];
    createdAt: string;

    EntityType: 'RECEIVED_LETTER';
    GSI1PK: string; // "RECEIVED_LETTER"
    GSI1SK: string; // createdAt
}

export type ReceivedLetterPublic = Omit<
    ReceivedLetterEntity,
    'EntityType' | 'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK'
>;

export const toReceivedLetterPublic = (letter: ReceivedLetterEntity): ReceivedLetterPublic => {
    const {
        EntityType: _EntityType,
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        ...publicLetter
    } = letter;
    return publicLetter;
};

/**
 * ReceivedLetterInput에서 ReceivedLetterEntity 생성을 위한 유틸리티 함수
 */
export const createReceivedLetterEntityFromInput = (
    input: ReceivedLetterInput,
    user: UserEntity,
    letterId: string,
    now: string,
    parsedPhotos?: Photo[],
): Partial<ReceivedLetterEntity> => {
    return {
        PK: ReceivedLetterKeys.pk(user.PK),
        SK: ReceivedLetterKeys.sk(letterId),
        user: user,
        senderName: input.senderName,
        photos: parsedPhotos || input.photos,
        createdAt: now,
        GSI1PK: ReceivedLetterKeys.gsi1pk!(null),
        GSI1SK: ReceivedLetterKeys.gsi1sk!(now),
        EntityType: 'RECEIVED_LETTER',
    };
};
