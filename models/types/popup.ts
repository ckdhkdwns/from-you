import { DynamoEntity, EntityKeyPattern, getISOTimestamp } from './dynamo';

/**
 * 팝업 엔티티 키 생성 패턴
 */
export const PopupKeys: EntityKeyPattern = {
    pk: (popupId: string) => `POPUP#${popupId}`,
    sk: (popupId: string) => `POPUP#${popupId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsi1pk: (_: any = null) => 'POPUP',
    gsi1sk: (timestamp: string) => timestamp,
};

/**
 * 클라이언트에서 팝업 생성/수정 시 사용하는 입력 타입
 */
export interface PopupInput {
    image: string;
    startDate: string;
    endDate: string;

    // 기존 팝업 수정 시 사용될 ID (새 팝업은 불필요)
    id?: string;
}

/**
 * 팝업 엔티티 타입
 */
export interface PopupEntity extends DynamoEntity {
    image: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    EntityType: 'POPUP';
}

/**
 * 공개 팝업 타입
 */
export type PopupPublic = Omit<
    PopupEntity,
    'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'
>;

/**
 * 팝업 엔티티를 공개 타입으로 변환
 */
export const toPopupPublic = (popup: PopupEntity): PopupPublic => {
    const {
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        EntityType: _EntityType,
        ...publicPopup
    } = popup;
    return publicPopup;
};
/**
 * 팝업 입력을 엔티티로 변환
 */
export const createPopupEntityFromInput = (
    input: PopupInput,
    popupId: string,
    timestamp = getISOTimestamp(),
): Partial<PopupEntity> => {
    return {
        PK: PopupKeys.pk(popupId),
        SK: PopupKeys.sk(popupId),
        image: input.image,
        startDate: input.startDate,
        endDate: input.endDate,
        createdAt: timestamp,
        GSI1PK: PopupKeys.gsi1pk!(null),
        GSI1SK: PopupKeys.gsi1sk!(timestamp),
        EntityType: 'POPUP',
    };
};
