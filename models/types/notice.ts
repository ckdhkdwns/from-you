import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';

/**
 * 공지사항 엔티티 키 생성 패턴
 */
export const NoticeKeys: EntityKeyPattern = {
    pk: (noticeId: string) => `NOTICE#${noticeId}`,
    sk: (noticeId: string) => `NOTICE#${noticeId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'NOTICE',
    gsi1sk: (timestamp: string) => timestamp,
};

/**
 * 클라이언트에서 공지사항 생성/수정 시 사용하는 입력 타입
 */
export interface NoticeInput {
    title: string;
    content: string;
    isPublished: boolean;

    // 기존 공지사항 수정 시 사용될 ID (새 공지사항은 불필요)
    id?: string;
}

/**
 * 공지사항 엔티티 타입 정의
 */
export interface NoticeEntity extends DynamoEntity {
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    EntityType: 'NOTICE';
}

/**
 * 공개 공지사항 타입
 */
export type NoticePublic = Omit<
    NoticeEntity,
    'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'
>;

/**
 * 공지사항 엔티티를 공개 타입으로 변환
 */
export const toNoticePublic = (notice: NoticeEntity): NoticePublic => {
    const {
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        EntityType: _EntityType,
        ...publicNotice
    } = notice;
    return publicNotice;
};
/**
 * 공지사항 입력을 엔티티로 변환
 */
export const createNoticeEntityFromInput = (
    input: NoticeInput,
    noticeId: string,
    timestamp = getISOTimestamp(),
): Partial<NoticeEntity> => {
    return {
        PK: NoticeKeys.pk(noticeId),
        SK: NoticeKeys.sk(noticeId),
        title: input.title,
        content: input.content,
        isPublished: input.isPublished,
        createdAt: timestamp,
        GSI1PK: NoticeKeys.gsi1pk!(null),
        GSI1SK: NoticeKeys.gsi1sk!(timestamp),
        EntityType: 'NOTICE',
    };
};
