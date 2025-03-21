'use server';

import { v4 as uuidv4 } from 'uuid';
import {
    PopupEntity,
    PopupPublic,
    toPopupPublic,
    PopupInput,
    createPopupEntityFromInput,
    PopupKeys,
} from '../types/popup';
import { parsePhotos } from '@/app/(no-header)/write/_libs/parse-photos';
import { Repository } from '@/services/repository';
import { Resource } from 'sst';
import { ActionResponse, withActionResponse } from '../types/response';
import { getCurrentISOTime } from '@/lib/date';
import { TableKey } from '../types/dynamo';
import { ensureArray, ensureEntityKey } from '@/lib/api-utils';

// Repository 인스턴스 생성
const popupRepository = new Repository(Resource.FromYouTable.name);

/**
 * 팝업 이미지 업로드 및 생성
 */
export async function createPopupAction(formData: FormData): Promise<ActionResponse<PopupPublic>> {
    return withActionResponse(async () => {
        const title = formData.get('title') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const imageFile = formData.get('image') as File;

        if (!title || !startDate || !endDate || !imageFile) {
            throw new Error('모든 필드를 입력해주세요.');
        }

        // 이미지 업로드
        const photoResult = await parsePhotos([
            {
                id: uuidv4(),
                url: '',
                isUploaded: false,
                file: imageFile,
            },
        ]);

        if (!photoResult[0].url) {
            throw new Error('이미지 업로드에 실패했습니다.');
        }

        const popupId = uuidv4();
        const now = getCurrentISOTime();

        // PopupInput 생성
        const popupInput: PopupInput = {
            image: photoResult[0].url,
            startDate,
            endDate,
        };

        // 팝업 엔티티 생성
        const popupEntity = createPopupEntityFromInput(popupInput, popupId, now);

        // Repository를 사용하여 저장
        await popupRepository.put(popupEntity as PopupEntity);

        return toPopupPublic(popupEntity as PopupEntity);
    });
}

/**
 * 모든 팝업 조회
 */
export async function getAllPopupsAction(): Promise<ActionResponse<PopupPublic[]>> {
    return withActionResponse(async () => {
        const result = await popupRepository.queryGSI1<PopupEntity>('POPUP');
        return result.map(toPopupPublic);
    });
}

/**
 * 활성화된 팝업 조회 (현재 날짜가 startDate와 endDate 사이에 있는 팝업)
 */
export async function getActivePopupsAction(): Promise<ActionResponse<PopupPublic[]>> {
    return withActionResponse(async () => {
        const popupsResponse = await getAllPopupsAction();
        const popups = popupsResponse.data;

        const now = new Date();
        const activePopups = popups.filter(popup => {
            const startDate = new Date(popup.startDate);
            const endDate = new Date(popup.endDate);
            return startDate <= now && now <= endDate;
        });

        return activePopups;
    });
}

/**
 * 팝업 상세 조회
 */
export async function getPopupByIdAction(popupId: string): Promise<ActionResponse<PopupPublic>> {
    return withActionResponse(async () => {
        const PK = PopupKeys.pk(popupId);
        const SK = PopupKeys.sk(popupId);
        const result = await popupRepository.get<PopupEntity>(PK, SK);

        if (!result) {
            throw new Error('해당 팝업을 찾을 수 없습니다.');
        }

        return toPopupPublic(result);
    });
}

/**
 * 팝업 수정
 */
export async function updatePopupAction(
    popupId: string,
    formData: FormData,
): Promise<ActionResponse<PopupPublic>> {
    return withActionResponse(async () => {
        // 기존 팝업 조회
        const existingPopupResponse = await getPopupByIdAction(popupId);
        const existingPopup = existingPopupResponse.data;

        const title = formData.get('title') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        const imageFile = formData.get('image') as File | null;

        if (!title || !startDate || !endDate) {
            throw new Error('필수 필드를 입력해주세요.');
        }

        let imageUrl = existingPopup.image;

        // 새 이미지가 있으면 업로드
        if (imageFile) {
            const photoResult = await parsePhotos([
                {
                    id: uuidv4(),
                    url: '',
                    isUploaded: false,
                    file: imageFile,
                },
            ]);

            if (!photoResult[0].url) {
                throw new Error('이미지 업로드에 실패했습니다.');
            }

            imageUrl = photoResult[0].url;
        }

        // PopupInput 생성
        const popupInput: PopupInput = {
            image: imageUrl,
            startDate,
            endDate,
        };

        // 팝업 엔티티 생성 (기존 createdAt 유지)
        const updatedEntity = {
            ...createPopupEntityFromInput(popupInput, popupId, existingPopup.createdAt),
            // 추가 필드 업데이트
            updatedAt: getCurrentISOTime(),
        };

        // Repository를 사용하여 업데이트
        await popupRepository.put(updatedEntity as PopupEntity);

        return toPopupPublic(updatedEntity as PopupEntity);
    });
}

/**
 * 팝업 삭제 (단일)
 */
export async function deletePopupAction(popupId: string): Promise<ActionResponse<void>> {
    return withActionResponse(async () => {
        const PK = PopupKeys.pk(popupId);
        const SK = PopupKeys.sk(popupId);
        await popupRepository.delete(PK, SK);
    });
}

/**
 * 팝업 삭제 (단일 또는 다중)
 * @param keys 삭제할 팝업 키 또는 키 배열
 */
export async function deletePopups(
    keys: TableKey | TableKey[],
): Promise<ActionResponse<{ deletedIds: string[] }>> {
    return withActionResponse(async () => {
        const keyArray = ensureArray(keys).map(key => ensureEntityKey(key, PopupKeys));

        if (keyArray.length === 0) {
            throw new Error('선택된 팝업이 없습니다.');
        }

        const deletePromises = keyArray.map(async key => {
            try {
                await popupRepository.delete(key.PK, key.SK);
                return true;
            } catch (error) {
                console.error(`팝업 삭제 오류 (ID: ${key.PK}):`, error);
                return false;
            }
        });

        const results = await Promise.all(deletePromises);
        const failedIds = keyArray.filter((_, index) => !results[index]);

        if (failedIds.length > 0) {
            throw new Error(`${failedIds.length}개의 팝업 삭제에 실패했습니다.`);
        }

        return { deletedIds: keyArray.map(key => key.PK) };
    });
}

/**
 * 팝업 상태 변경 (단일 또는 다중)
 * 참고: 현재 PopupEntity에 활성화 상태 필드가 없어 기능이 준비되지 않았습니다.
 * 추후 활성화 상태 관리 기능 추가 시 구현 예정
 */
/*
export async function togglePopupsStatus(
    keys: TableKey | TableKey[],
    isActive: boolean,
): Promise<ActionResponse<{ updatedPopups: PopupPublic[] }>> {
    return withActionResponse(async () => {
        // 단일 키를 배열로 변환
        const keyArray = ensureArray(keys).map(key => ensureEntityKey(key, PopupKeys));

        if (keyArray.length === 0) {
            throw new Error('선택된 팝업이 없습니다.');
        }

        const updatePromises = keyArray.map(async key => {
            try {
                // 업데이트할 필드 구성
                const updates: Partial<PopupEntity> = {
                    // 필드 이름 수정 필요
                    // isActive, 
                };

                const updatedPopup = await popupRepository.update<PopupEntity>(
                    key.PK,
                    key.SK,
                    updates,
                );
                return updatedPopup ? toPopupPublic(updatedPopup) : null;
            } catch (error) {
                console.error(`팝업 상태 변경 오류 (ID: ${key.PK}):`, error);
                return null;
            }
        });

        const results = await Promise.all(updatePromises);
        const updatedPopups = results.filter(Boolean) as PopupPublic[];
        const failedCount = keyArray.length - updatedPopups.length;

        if (failedCount > 0) {
            throw new Error(`${failedCount}개의 팝업 상태 변경에 실패했습니다.`);
        }

        return { updatedPopups };
    });
}
*/
