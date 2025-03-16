'use server';

import { Resource } from 'sst';
import {
    TemplateEntity,
    TemplateInput,
    TemplatePublic,
    createTemplateEntityFromInput,
    toTemplatePublic,
    TemplateKeys,
} from '../types/template';
import { ActionResponse, withActionResponse } from '../types/response';
import { Repository } from '@/services/repository';
import { v4 as uuidv4 } from 'uuid';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';
import { getCurrentISOTime } from '@/lib/date';

// Repository 인스턴스 생성
const templateRepository = new Repository(Resource.FromYouTable.name);

/**
 * 템플릿 생성
 */
export async function createTemplate(
    templateInput: TemplateInput,
): Promise<ActionResponse<TemplatePublic>> {
    return withActionResponse(async () => {
        const id = uuidv4();
        const now = getCurrentISOTime();

        // TemplateInput을 TemplateEntity로 변환
        const templateItem = createTemplateEntityFromInput(templateInput, id, now);

        // 저장
        await templateRepository.put<TemplateEntity>(templateItem as TemplateEntity);

        return toTemplatePublic(templateItem as TemplateEntity);
    });
}

/**
 * 모든 템플릿 조회
 */
export async function getAllTemplates(): Promise<ActionResponse<TemplatePublic[]>> {
    return withActionResponse(async () => {
        const items = await templateRepository.queryGSI1<TemplateEntity>('TEMPLATE');

        return items.map(toTemplatePublic);
    });
}

/**
 * ID로 템플릿 조회
 */
export async function getTemplateById(id: string): Promise<ActionResponse<TemplatePublic>> {
    return withActionResponse(async () => {
        // 템플릿 ID에서 접두사 제거
        const templateId = removeTableKeyPrefix(id);
        const PK = TemplateKeys.pk(templateId);
        const SK = TemplateKeys.sk(templateId);
        const item = await templateRepository.get<TemplateEntity>(PK, SK);

        if (!item) {
            throw new Error('템플릿을 찾을 수 없습니다.');
        }
        return toTemplatePublic(item);
    });
}

/**
 * 템플릿 업데이트
 */
export async function updateTemplate(
    templateInput: TemplateInput,
): Promise<ActionResponse<TemplatePublic>> {
    return withActionResponse(async () => {
        if (!templateInput.id) {
            throw new Error('템플릿 ID가 필요합니다.');
        }

        // 템플릿 ID에서 접두사 제거
        const templateId = removeTableKeyPrefix(templateInput.id);

        const PK = TemplateKeys.pk(templateId);
        const SK = TemplateKeys.sk(templateId);

        const existingItem = await templateRepository.get<TemplateEntity>(PK, SK);

        if (!existingItem) {
            throw new Error('템플릿을 찾을 수 없습니다.');
        }

        // 엔티티 업데이트
        const now = getCurrentISOTime();
        const updatedEntity = {
            ...existingItem,
            ...createTemplateEntityFromInput(templateInput, templateId, existingItem.createdAt),
            lastModified: now,
        };

        // 저장
        await templateRepository.put(updatedEntity);

        return toTemplatePublic(updatedEntity);
    });
}

/**
 * 템플릿 삭제
 * 단일 ID 또는 ID 배열을 받아 해당 템플릿들을 삭제합니다.
 */
export async function deleteTemplate(ids: string | string[]): Promise<ActionResponse<void>> {
    return withActionResponse(async () => {
        // 단일 ID를 배열로 변환
        const idArray = Array.isArray(ids) ? ids : [ids];

        const promises = idArray.map(id => {
            // 템플릿 ID에서 접두사 제거
            const templateId = removeTableKeyPrefix(id);

            const PK = TemplateKeys.pk(templateId);
            const SK = TemplateKeys.sk(templateId);

            return templateRepository.delete(PK, SK);
        });
        await Promise.all(promises);
    });
}

/**
 * 랜덤 템플릿 조회
 */
export async function getRandomTemplateAction(): Promise<ActionResponse<TemplatePublic>> {
    return withActionResponse(async () => {
        const items = await templateRepository.queryGSI1<TemplateEntity>('TEMPLATE');

        if (items.length === 0) {
            throw new Error('템플릿을 찾을 수 없습니다.');
        }

        const randomIndex = Math.floor(Math.random() * items.length);
        const randomItem = items[randomIndex];

        return toTemplatePublic(randomItem);
    });
}
