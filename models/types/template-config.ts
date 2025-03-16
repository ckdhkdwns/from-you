import { DynamoEntity, EntityKeyPattern } from './dynamo';

/**
 * 템플릿 설정 엔티티 키 생성 패턴
 */
export const TemplateConfigKeys: EntityKeyPattern = {
    pk: (_id: string): string => 'CONFIG#TEMPLATE_CONFIG',
    sk: (_id: string): string => 'CONFIG#TEMPLATE_CONFIG',
};

export interface TemplateConfigEntity extends DynamoEntity {
    PK: 'CONFIG#TEMPLATE_CONFIG';
    SK: 'CONFIG#TEMPLATE_CONFIG';

    paperSize: {
        width: number; // mm
        height: number; // mm
    };
    photoSize: {
        width: number; // mm
        height: number; // mm
    };
    padding: {
        top: number; // mm
        right: number; // mm
        bottom: number; // mm
        left: number; // mm
    };
    lineHeight: number; // mm
    fontSize: {
        small: number; // mm
        medium: number; // mm
        large: number; // mm
    };
    lineCount?: number;

    EntityType: 'TEMPLATE_CONFIG';
}

export type TemplateConfigPublic = Omit<
    TemplateConfigEntity,
    'EntityType' | 'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK'
>;

export const toTemplateConfigPublic = (
    templateConfig: TemplateConfigEntity,
): TemplateConfigPublic => {
    const {
        EntityType: _EntityType,
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        ...publicTemplateConfig
    } = templateConfig;
    return publicTemplateConfig;
};

/**
 * 템플릿 설정 입력을 엔티티로 변환
 */
export const createTemplateConfigEntityFromInput = (
    input: TemplateConfigPublic,
): TemplateConfigEntity => {
    return {
        EntityType: 'TEMPLATE_CONFIG',
        PK: TemplateConfigKeys.pk('template-config'),
        SK: TemplateConfigKeys.sk('template-config'),
        ...input,
    } as TemplateConfigEntity;
};
