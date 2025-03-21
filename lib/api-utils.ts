import { DynamoEntity, EntityKeyPattern, TableKey } from '@/models/types/dynamo';
import { ActionResponse } from '@/models/types/response';
import { toast } from 'sonner';

/**
 * 테이블 키 접두사를 제거하는 유틸리티 함수
 */
export const removeTableKeyPrefix = (str: string) => {
    try {
        if (str.includes('#')) {
            const result = str.split('#')[1];
            return result;
        } else {
            return str;
        }
    } catch {
        return '';
    }
};

/**
 * 단일 데이터나 배열을 항상 배열로 변환하는 유틸리티 함수
 */
export function ensureArray<T>(data: T | T[]): T[] {
    return Array.isArray(data) ? data : [data];
}

/**
 * 엔티티 키 패턴을 통해 테이블 키를 생성하는 유틸리티 함수
 */
export function ensureEntityKey<T extends Partial<DynamoEntity>>(
    data: T,
    keyPattern: EntityKeyPattern,
): TableKey {
    return {
        PK: keyPattern.pk(removeTableKeyPrefix(data.PK)),
        SK: keyPattern.sk(removeTableKeyPrefix(data.SK)),
    };
}

/**
 * API 호출 처리를 위한 유틸리티 함수
 * 성공/실패 처리와 오류 표시를 일관되게 처리합니다.
 */
export async function apiHandler<T>(
    apiCall: () => Promise<ActionResponse<T>>,
    onSuccess?: (data: T) => void,
    message: {
        success: string | null;
        error: string | null;
    } = {
        success: '작업이 성공했습니다.',
        error: '작업 중 오류가 발생했습니다.',
    },
): Promise<T | null> {
    try {
        const result = await apiCall();
        if (result.success && result.data) {
            if (onSuccess) {
                onSuccess(result.data);
                if (message.success) toast.success(message.success);
            }
            return result.data;
        } else {
            if (message.error) toast.error(message.error);
            return null;
        }
    } catch (error) {
        console.error(message.error, error);
        if (message.error) toast.error(message.error);
        return null;
    }
}

/**
 * 로딩 상태 처리를 위한 유틸리티 함수
 * 비동기 작업 수행 중 로딩 상태를 관리합니다.
 */
export async function withLoading<T>(
    setIsLoading: (isLoading: boolean) => void,
    callback: () => Promise<T>,
): Promise<T> {
    try {
        setIsLoading(true);
        return await callback();
    } finally {
        setIsLoading(false);
    }
}

/**
 * 일괄 작업 처리를 위한 유틸리티 함수
 * 선택된 여러 항목에 대한 작업을 수행합니다.
 */
export function processBatchItems<T extends Partial<DynamoEntity>, R extends ActionResponse<any>>(
    items: T | T[],
    processor: (keys: TableKey[]) => Promise<R>,
): {
    keys: TableKey[];
    isSingle: boolean;
    process: () => Promise<R>;
} {
    const itemArray = ensureArray(items);
    const keys = itemArray.map(item => {
        return {
            PK: item.PK,
            SK: item.SK,
        };
    });
    const isSingle = keys.length === 1;

    return {
        keys,
        isSingle,
        process: () => processor(keys),
    };
}

/**
 *
 */
