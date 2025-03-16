'use server';

import { Resource } from 'sst';
import { Repository } from '@/services/repository';
import { ActionResponse, withActionResponse } from '../types/response';
import {
    TemplateConfigEntity,
    TemplateConfigPublic,
    toTemplateConfigPublic,
    TemplateConfigKeys,
    createTemplateConfigEntityFromInput,
} from '../types/template-config';
import {
    SendTimeConfigEntity,
    SendTimeConfigPublic,
    toSendTimeConfigPublic,
    SendTimeConfigKeys,
    createSendTimeConfigEntityFromInput,
} from '../types/send-time-config';

// Repository 인스턴스 생성
const configRepository = new Repository(Resource.FromYouTable.name);

/**
 * 템플릿 설정 조회
 */
export async function getTemplateConfigAction(): Promise<
    ActionResponse<TemplateConfigPublic>
> {
    return withActionResponse(async () => {
        const config = await configRepository.get<TemplateConfigEntity>(
            TemplateConfigKeys.pk('template-config'),
            TemplateConfigKeys?.sk('template-config'),
        );

        if (!config) {
            throw new Error('템플릿 설정을 찾을 수 없습니다.');
        }

        return toTemplateConfigPublic(config);
    });
}

/**
 * 템플릿 설정 저장
 */
export async function saveTemplateConfigAction(
    data: TemplateConfigPublic,
): Promise<ActionResponse<TemplateConfigPublic>> {
    return withActionResponse(async () => {
        // 설정 엔티티 생성
        const configEntity = createTemplateConfigEntityFromInput(data);

        const savedConfig = await configRepository.put<TemplateConfigEntity>(
            configEntity,
        );

        return toTemplateConfigPublic(savedConfig);
    });
}

/**
 * 발송 시간 설정 조회
 */
export async function getSendTimeConfigAction(): Promise<
    ActionResponse<SendTimeConfigPublic>
> {
    return withActionResponse(async () => {
        const config = await configRepository.get<SendTimeConfigEntity>(
            SendTimeConfigKeys.pk('send-time-config'),
            SendTimeConfigKeys.sk('send-time-config'),
        );

        if (!config) {
            throw new Error('발송 시간 설정을 찾을 수 없습니다.');
        }

        return toSendTimeConfigPublic(config);
    });
}

/**
 * 발송 시간 설정 저장
 */
export async function saveSendTimeConfigAction(
    data: SendTimeConfigPublic,
): Promise<ActionResponse<SendTimeConfigPublic>> {
    return withActionResponse(async () => {
        // 설정 엔티티 생성
        const configEntity = createSendTimeConfigEntityFromInput(data);

        const savedConfig = await configRepository.put<SendTimeConfigEntity>(
            configEntity,
        );

        return toSendTimeConfigPublic(savedConfig);
    });
}
