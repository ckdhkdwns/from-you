import { DynamoEntity, EntityKeyPattern } from './dynamo';

/**
 * 발송 시간 설정 엔티티 키 생성 패턴
 */
export const SendTimeConfigKeys: EntityKeyPattern = {
    pk: (_id: string): string => 'CONFIG#SEND_TIME_CONFIG',
    sk: (_id: string): string => 'CONFIG#SEND_TIME_CONFIG',
};

export interface TimeSchedule {
    enabled: boolean;
    time: string; // "HH:mm" 형식
}

export interface SendTimeConfigEntity extends DynamoEntity {
    PK: 'CONFIG#SEND_TIME_CONFIG';
    SK: 'CONFIG#SEND_TIME_CONFIG';

    일: TimeSchedule;
    월: TimeSchedule;
    화: TimeSchedule;
    수: TimeSchedule;
    목: TimeSchedule;
    금: TimeSchedule;
    토: TimeSchedule;

    EntityType: 'SEND_TIME_CONFIG';
}

export type SendTimeConfigPublic = Omit<
    SendTimeConfigEntity,
    'EntityType' | 'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK'
>;

export const toSendTimeConfigPublic = (
    sendTimeConfig: SendTimeConfigEntity,
): SendTimeConfigPublic => {
    const {
        EntityType: _EntityType,
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        ...publicSendTimeConfig
    } = sendTimeConfig;
    return publicSendTimeConfig;
};

/**
 * 발송 시간 설정 입력을 엔티티로 변환
 */
export const createSendTimeConfigEntityFromInput = (
    input: SendTimeConfigPublic,
): SendTimeConfigEntity => {
    return {
        EntityType: 'SEND_TIME_CONFIG',
        PK: SendTimeConfigKeys.pk('send-time-config'),
        SK: SendTimeConfigKeys.sk('send-time-config'),
        ...input,
    } as SendTimeConfigEntity;
};
