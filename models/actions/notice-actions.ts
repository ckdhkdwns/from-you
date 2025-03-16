'use server';

import { Resource } from 'sst';
import { ActionResponse, withActionResponse } from '../types/response';
import { Repository } from '@/services/repository';
import {
    NoticeEntity,
    toNoticePublic,
    NoticePublic,
    NoticeKeys,
    NoticeInput,
    createNoticeEntityFromInput,
} from '../types/notice';
import { getCurrentISOTime } from '@/lib/date';

// Repository 인스턴스 생성
const noticeRepository = new Repository(Resource.FromYouTable.name);

/**
 * 공지사항 목록 조회
 */
export async function getNotices(): Promise<ActionResponse<NoticePublic[]>> {
    return withActionResponse(async () => {
        const items = await noticeRepository.queryGSI1<NoticeEntity>('NOTICE');
        return items.map(toNoticePublic);
    });
}

/**
 * 공지사항 상세 조회
 */
export async function getNoticeById(id: string): Promise<ActionResponse<NoticePublic>> {
    return withActionResponse(async () => {
        const PK = NoticeKeys.pk(id);
        const SK = NoticeKeys.sk(id);
        const notice = await noticeRepository.get<NoticeEntity>(PK, SK);

        if (!notice) {
            throw new Error('해당 공지사항을 찾을 수 없습니다.');
        }

        return toNoticePublic(notice);
    });
}

/**
 * 공지사항 생성
 */
export async function createNotice(request: NoticeInput): Promise<ActionResponse<NoticePublic>> {
    return withActionResponse(async () => {
        const id = Date.now().toString();
        const now = getCurrentISOTime();

        // NoticeInput 생성
        const noticeInput: NoticeInput = {
            title: request.title,
            content: request.content,
            isPublished: request.isPublished || false,
        };

        // 공지사항 엔티티 생성
        const noticeEntity = createNoticeEntityFromInput(noticeInput, id, now);

        // 저장
        const createdNotice = await noticeRepository.put<NoticeEntity>(
            noticeEntity as NoticeEntity,
        );

        if (!createdNotice) {
            throw new Error('공지사항 생성에 실패했습니다.');
        }

        return toNoticePublic(createdNotice);
    });
}

/**
 * 공지사항 수정
 */
export async function updateNotice(request: NoticeInput): Promise<ActionResponse<NoticePublic>> {
    return withActionResponse(async () => {
        const PK = NoticeKeys.pk(request.id);
        const SK = NoticeKeys.sk(request.id);
        const notice = await noticeRepository.get<NoticeEntity>(PK, SK);

        if (!notice) {
            throw new Error('해당 공지사항을 찾을 수 없습니다.');
        }

        // 업데이트할 필드 구성
        const updates: Partial<NoticeEntity> = {};

        if (request.title !== undefined) updates.title = request.title;
        if (request.content !== undefined) updates.content = request.content;
        if (request.isPublished !== undefined) updates.isPublished = request.isPublished;

        const updatedNotice = await noticeRepository.update<NoticeEntity>(PK, SK, updates);

        if (!updatedNotice) {
            throw new Error('공지사항 수정에 실패했습니다.');
        }

        return toNoticePublic(updatedNotice);
    });
}

/**
 * 공지사항 삭제 (단일 또는 다중)
 * @param ids 삭제할 공지사항 ID 또는 ID 배열
 */
export async function deleteNotices(
    ids: string | string[],
): Promise<ActionResponse<{ deletedIds: string[] }>> {
    return withActionResponse(async () => {
        // 단일 ID를 배열로 변환
        const idArray = Array.isArray(ids) ? ids : [ids];

        if (idArray.length === 0) {
            throw new Error('선택된 공지사항이 없습니다.');
        }

        const deletePromises = idArray.map(async id => {
            const PK = NoticeKeys.pk(id);
            const SK = NoticeKeys.sk(id);
            try {
                await noticeRepository.delete(PK, SK);
                return true;
            } catch (error) {
                console.error(`공지사항 삭제 오류 (ID: ${id}):`, error);
                return false;
            }
        });

        const results = await Promise.all(deletePromises);
        const failedIds = idArray.filter((_, index) => !results[index]);

        if (failedIds.length > 0) {
            throw new Error(`${failedIds.length}개의 공지사항 삭제에 실패했습니다.`);
        }

        return { deletedIds: idArray };
    });
}

/**
 * 공지사항 상태 변경 (단일 또는 다중)
 * @param ids 상태를 변경할 공지사항 ID 또는 ID 배열
 * @param isPublished 변경할 공개 상태
 */
export async function toggleNoticeStatus(
    ids: string | string[],
    isPublished: boolean,
): Promise<ActionResponse<{ updatedNotices: NoticePublic[] }>> {
    return withActionResponse(async () => {
        // 단일 ID를 배열로 변환
        const idArray = Array.isArray(ids) ? ids : [ids];

        if (idArray.length === 0) {
            throw new Error('선택된 공지사항이 없습니다.');
        }

        const updatePromises = idArray.map(async id => {
            const PK = NoticeKeys.pk(id);
            const SK = NoticeKeys.sk(id);
            try {
                // 업데이트할 필드 구성
                const updates: Partial<NoticeEntity> = {
                    isPublished,
                };

                const updatedNotice = await noticeRepository.update<NoticeEntity>(PK, SK, updates);
                return updatedNotice ? toNoticePublic(updatedNotice) : null;
            } catch (error) {
                console.error(`공지사항 상태 변경 오류 (ID: ${id}):`, error);
                return null;
            }
        });

        const results = await Promise.all(updatePromises);
        const updatedNotices = results.filter(Boolean) as NoticePublic[];
        const failedCount = idArray.length - updatedNotices.length;

        if (failedCount > 0) {
            throw new Error(`${failedCount}개의 공지사항 상태 변경에 실패했습니다.`);
        }

        return { updatedNotices };
    });
}
