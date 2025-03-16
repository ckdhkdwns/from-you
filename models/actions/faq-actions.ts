'use server';

import { Resource } from 'sst';
import { Repository } from '@/services/repository';
import { ActionResponse, withActionResponse } from '../types/response';
import {
    FaqEntity,
    toFaqPublic,
    FaqPublic,
    FaqInput,
    FaqKeys,
    createFaqEntityFromInput,
} from '../types/faq';
import { getCurrentISOTime } from '@/lib/date';

// Repository 인스턴스 생성
const faqRepository = new Repository(Resource.FromYouTable.name);

/**
 * FAQ 목록 조회
 */
export async function getFAQs(): Promise<ActionResponse<FaqPublic[]>> {
    return withActionResponse(async () => {
        const items = await faqRepository.queryGSI1<FaqEntity>('FAQ');
        return items.map(toFaqPublic);
    });
}

/**
 * FAQ 상세 조회
 */
export async function getFAQById(id: string): Promise<ActionResponse<FaqPublic>> {
    return withActionResponse(async () => {
        const PK = FaqKeys.pk(id);
        const SK = FaqKeys.sk(id);
        const faq = await faqRepository.get<FaqEntity>(PK, SK);

        if (!faq) {
            throw new Error('해당 FAQ를 찾을 수 없습니다.');
        }

        return toFaqPublic(faq);
    });
}

/**
 * 카테고리별 FAQ 조회
 */
export async function getFAQsByCategory(category: string): Promise<ActionResponse<FaqPublic[]>> {
    return withActionResponse(async () => {
        const items = await faqRepository.queryGSI1<FaqEntity>(`FAQ#CATEGORY#${category}`);
        return items.map(toFaqPublic);
    });
}

/**
 * FAQ 생성
 */
export async function createFAQ(request: FaqInput): Promise<ActionResponse<FaqPublic>> {
    return withActionResponse(async () => {
        const id = Date.now().toString();
        const now = getCurrentISOTime();

        // FAQ 엔티티 생성
        const faqEntity = createFaqEntityFromInput(request, id, now);

        const createdFaq = await faqRepository.put<FaqEntity>(faqEntity as FaqEntity);
        if (!createdFaq) {
            throw new Error('FAQ 생성에 실패했습니다.');
        }

        return toFaqPublic(createdFaq);
    });
}

/**
 * FAQ 수정
 */
export async function updateFAQ(request: FaqInput): Promise<ActionResponse<FaqPublic>> {
    return withActionResponse(async () => {
        const PK = FaqKeys.pk(request.id);
        const SK = FaqKeys.sk(request.id);
        const faq = await faqRepository.get<FaqEntity>(PK, SK);

        if (!faq) {
            throw new Error('해당 FAQ를 찾을 수 없습니다.');
        }

        // 업데이트할 필드 구성
        const updates: Partial<FaqEntity> = {};

        if (request.question !== undefined) updates.question = request.question;
        if (request.answer !== undefined) updates.answer = request.answer;
        if (request.category !== undefined) updates.category = request.category;
        if (request.order !== undefined) updates.order = request.order;
        if (request.isPublished !== undefined) updates.isPublished = request.isPublished;

        const updatedFaq = await faqRepository.update<FaqEntity>(PK, SK, updates);

        if (!updatedFaq) {
            throw new Error('FAQ 수정에 실패했습니다.');
        }

        return toFaqPublic(updatedFaq);
    });
}

/**
 * FAQ 삭제 (단일 또는 다중)
 * @param ids 삭제할 FAQ ID 또는 ID 배열
 */
export async function deleteFAQs(
    ids: string | string[],
): Promise<ActionResponse<{ deletedIds: string[] }>> {
    return withActionResponse(async () => {
        // 단일 ID를 배열로 변환
        const idArray = Array.isArray(ids) ? ids : [ids];

        if (idArray.length === 0) {
            throw new Error('선택된 FAQ가 없습니다.');
        }

        const deletePromises = idArray.map(async id => {
            const PK = FaqKeys.pk(id);
            const SK = FaqKeys.sk(id);
            try {
                await faqRepository.delete(PK, SK);
                return true;
            } catch (error) {
                console.error(`FAQ 삭제 오류 (ID: ${id}):`, error);
                return false;
            }
        });

        const results = await Promise.all(deletePromises);
        const failedIds = idArray.filter((_, index) => !results[index]);

        if (failedIds.length > 0) {
            throw new Error(`${failedIds.length}개의 FAQ 삭제에 실패했습니다.`);
        }

        return { deletedIds: idArray };
    });
}

/**
 * FAQ 상태 변경 (단일 또는 다중)
 * @param ids 상태를 변경할 FAQ ID 또는 ID 배열
 * @param isPublished 변경할 공개 상태
 */
export async function toggleFAQStatus(
    ids: string | string[],
    isPublished: boolean,
): Promise<ActionResponse<{ updatedFaqs: FaqPublic[] }>> {
    return withActionResponse(async () => {
        // 단일 ID를 배열로 변환
        const idArray = Array.isArray(ids) ? ids : [ids];

        if (idArray.length === 0) {
            throw new Error('선택된 FAQ가 없습니다.');
        }

        const updatePromises = idArray.map(async id => {
            const PK = FaqKeys.pk(id);
            const SK = FaqKeys.sk(id);
            try {
                // 업데이트할 필드 구성
                const updates: Partial<FaqEntity> = {
                    isPublished,
                };

                const updatedFaq = await faqRepository.update<FaqEntity>(PK, SK, updates);
                return updatedFaq ? toFaqPublic(updatedFaq) : null;
            } catch (error) {
                console.error(`FAQ 상태 변경 오류 (ID: ${id}):`, error);
                return null;
            }
        });

        const results = await Promise.all(updatePromises);
        const updatedFaqs = results.filter(Boolean) as FaqPublic[];
        const failedCount = idArray.length - updatedFaqs.length;

        if (failedCount > 0) {
            throw new Error(`${failedCount}개의 FAQ 상태 변경에 실패했습니다.`);
        }

        return { updatedFaqs };
    });
}
