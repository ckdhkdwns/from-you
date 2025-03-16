export type ActionResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details?: any;
    };
    validationErrors?: Record<string, string>;
    status?: number;
};

/**
 * 성공 응답을 생성하는 유틸리티 함수
 */
export function createSuccessResponse<T>(data: T, status = 200): ActionResponse<T> {
    return {
        success: true,
        data,
        status,
    };
}

/**
 * 오류 응답을 생성하는 유틸리티 함수
 */
export function createErrorResponse(
    message: string,
    code = 'ERROR',
    status = 400,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any,
): ActionResponse<never> {
    return {
        success: false,
        error: {
            code,
            message,
            details,
        },
        status,
    };
}

/**
 * 유효성 검증 오류 응답을 생성하는 유틸리티 함수
 */
export function createValidationErrorResponse(
    validationErrors: Record<string, string>,
    message = '입력 값이 유효하지 않습니다.',
    status = 422,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any,
): ActionResponse<never> {
    return {
        success: false,
        error: {
            code: 'VALIDATION_ERROR',
            message,
            details,
        },
        validationErrors,
        status,
    };
}

/**
 * Server Action을 감싸서 일관된 응답 형식을 제공하는 유틸리티 함수
 */
export async function withActionResponse<T>(fn: () => Promise<T>): Promise<ActionResponse<T>> {
    try {
        const result = await fn();
        return createSuccessResponse(result);
    } catch (error) {
        if (error instanceof Error) {
            return createErrorResponse(error.message);
        }

        return createErrorResponse('알 수 없는 오류가 발생했습니다.');
    }
}

/**
 * 성공 응답인지 확인하는 타입 가드
 */
export function isSuccessResponse<T>(
    response: ActionResponse<T>,
): response is ActionResponse<T> & { success: true; data: T } {
    return response.success === true;
}

/**
 * 오류 응답인지 확인하는 타입 가드
 */
export function isErrorResponse<T>(response: ActionResponse<T>): response is ActionResponse<T> & {
    success: false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: { code: string; message: string; details?: any };
} {
    return response.success === false && !!response.error;
}

/**
 * 유효성 검증 오류 응답인지 확인하는 타입 가드
 */
export function isValidationErrorResponse<T>(
    response: ActionResponse<T>,
): response is ActionResponse<T> & {
    success: false;
    validationErrors: Record<string, string>;
} {
    return response.success === false && !!response.validationErrors;
}
