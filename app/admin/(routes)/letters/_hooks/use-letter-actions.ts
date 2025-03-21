'use client';

import { useCompleteLetters } from '../../../_contexts/complete-letters-provider';
import { toast } from 'sonner';
import { useConfirm } from '@/contexts/confirm-provider';
import { LetterPublic, ShippingStatus } from '@/models/types/letter';
import * as XLSX from 'xlsx';
import { PaymentStatus, postTypeMapping } from '@/constants';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import {
    updateLetterTrackingNumberAction,
    updatePaymentStatusAction,
    updateShippingStatusAction,
} from '@/models/actions/letter-actions';
import { confirmShippingComplete } from '@/models/actions/status-actions';

// 상태 텍스트 변환 유틸 함수
export const getStatusText = (status: string) => {
    if (status === 'pending') return '대기중';
    if (status === 'complete') return '완료';
    if (status === 'failed') return '실패';
    if (status === 'shipping') return '배송중';
    return status;
};

export function useLetterActions() {
    const {
        setSelectedLetter,
        setIsDialogOpen,
        deleteSelectedLetters,
        handleUpdateMultipleLetters,
        handleUpdateLetter,
    } = useCompleteLetters();
    const { confirm } = useConfirm();

    // 행 클릭 핸들러
    const handleRowClick = (letter: LetterPublic) => {
        setSelectedLetter(letter);
        setIsDialogOpen(true);
    };

    // 선택한 편지 삭제 핸들러
    const handleDeleteSelectedLetters = async (selectedRows: LetterPublic[]) => {
        if (selectedRows.length === 0) return;

        // 사용자에게 삭제 확인 요청
        const isConfirmed = await confirm({
            title: '삭제 확인',
            description: `선택한 ${selectedRows.length}개의 편지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
            confirmText: '삭제',
            cancelText: '취소',
            className: '!bg-white',
        });

        if (!isConfirmed) return;

        // 선택된 편지 ID 목록 추출
        const selectedLetterIds = selectedRows.map(row => removeTableKeyPrefix(row?.SK));

        // 컨텍스트의 deleteSelectedLetters 함수 호출
        const result = await deleteSelectedLetters(selectedLetterIds);

        if (result.success) {
            toast.success(result.message || `${selectedRows.length}개의 편지가 삭제되었습니다.`);
        } else {
            toast.error(result.error || '편지 삭제 중 오류가 발생했습니다.');
        }
    };

    // 선택한 편지 엑셀 내보내기 핸들러
    const handleExportSelectedLetters = (selectedRows: LetterPublic[]) => {
        if (selectedRows.length === 0) return;

        // 엑셀에 포함할 데이터 필드 정의
        const exportData = selectedRows.map(letter => ({
            주문번호: letter.orderId || '',
            결제금액: letter.priceInfo?.totalPrice
                ? `${letter.priceInfo.totalPrice.toLocaleString()}원`
                : '',
            편지유형: letter.postType
                ? postTypeMapping[letter.postType as keyof typeof postTypeMapping] || ''
                : '',
            결제방식: letter.paymentMethod || '',
            결제상태: getStatusText(letter.paymentStatus) || '',
            배송상태: getStatusText(letter.shippingStatus) || '',
            등록일시: letter.transferRequestedAt || letter.paymentCompletedAt,
            수신자: letter.recipientAddress?.name || '',
            수신자주소: `${letter.recipientAddress?.zonecode || ''} ${
                letter.recipientAddress?.address1 || ''
            } ${letter.recipientAddress?.address2 || ''}`,
            발신자: letter.senderAddress?.name || '',
            발신자주소: `${letter.senderAddress?.zonecode || ''} ${
                letter.senderAddress?.address1 || ''
            } ${letter.senderAddress?.address2 || ''}`,
        }));

        // 워크시트 생성
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // 워크북 생성 및 워크시트 추가
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '편지 목록');

        // 엑셀 파일 생성 및 다운로드
        const today = new Date();
        const dateString = `${today.getFullYear()}${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
        const fileName = `편지목록_${dateString}.xlsx`;

        XLSX.writeFile(workbook, fileName);
    };

    // 상태 변경을 위한 공통 함수
    const handleStatusUpdate = async ({
        selectedRows,
        status,
        statusType,
        statusText,
        updateFn,
        stateField,
    }: {
        selectedRows: LetterPublic[];
        status: string;
        statusType: '결제상태' | '배송상태';
        statusText: string;
        updateFn: (
            _userId: string,
            _letterId: string,
            _status: string,
        ) => Promise<{
            success: boolean;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data?: any;
            error?: {
                message: string;
            };
        }>;
        stateField: string;
    }) => {
        if (selectedRows.length === 0) return;

        // 사용자에게 상태 변경 확인 요청
        const isConfirmed = await confirm({
            title: `${statusType} 변경 확인`,
            description: `선택한 ${selectedRows.length}개의 편지의 ${statusType}를 '${statusText}'로 변경하시겠습니까?`,
            confirmText: '변경',
            cancelText: '취소',
            className: '!bg-white',
        });

        if (!isConfirmed) return;

        // 각 편지에 대해 상태 업데이트
        let successCount = 0;
        let failCount = 0;

        try {
            // Promise.all을 사용하여 모든 요청을 병렬로 처리
            const promises = selectedRows.map(letter =>
                updateFn(removeTableKeyPrefix(letter.PK), removeTableKeyPrefix(letter?.SK), status),
            );

            const results = await Promise.all(promises);

            // 결과 처리
            for (let i = 0; i < selectedRows.length; i++) {
                if (results[i].success) {
                    successCount++;
                } else {
                    failCount++;
                }
            }

            // 성공한 경우 로컬 상태 한번에 업데이트
            if (successCount > 0) {
                handleUpdateMultipleLetters(
                    selectedRows
                        .filter((_, i) => results[i].success)
                        .map(letter => removeTableKeyPrefix(letter?.SK)),
                    { [stateField]: status },
                );
            }
        } catch (error) {
            console.error(`${statusType} 업데이트 오류:`, error);
            toast.error(`${statusType} 업데이트 중 오류가 발생했습니다.`);
            return;
        }

        if (successCount > 0) {
            toast.success(
                `${successCount}개의 편지 ${statusType}가 '${statusText}'(으)로 변경되었습니다.`,
            );
        }

        if (failCount > 0) {
            toast.error(`${failCount}개의 편지 ${statusType} 변경에 실패했습니다.`);
        }
    };

    // 결제 상태 변경 핸들러
    const handleUpdatePaymentStatus = async (
        selectedRows: LetterPublic[],
        status: PaymentStatus,
    ) => {
        await handleStatusUpdate({
            selectedRows,
            status,
            statusType: '결제상태',
            statusText: getStatusText(status),
            updateFn: updatePaymentStatusAction,
            stateField: 'paymentStatus',
        });
    };

    // 배송 상태 변경 핸들러
    const handleUpdateShippingStatus = async (
        selectedRows: LetterPublic[],
        status: ShippingStatus,
    ) => {
        if (selectedRows.length === 0) return;

        // 배송 완료 상태인 경우 특별한 처리
        if (status === 'complete') {
            const statusText = getStatusText(status);

            // 사용자에게 상태 변경 확인 요청
            const isConfirmed = await confirm({
                title: '배송상태 변경 확인',
                description: `선택한 ${selectedRows.length}개의 편지의 배송상태를 '${statusText}'로 변경하시겠습니까?`,
                confirmText: '변경',
                cancelText: '취소',
                className: '!bg-white',
            });

            if (!isConfirmed) return;

            let successCount = 0;
            let failCount = 0;

            try {
                // Promise.all을 사용하여 모든 confirmShippingComplete 요청을 병렬로 처리
                const promises = selectedRows.map(letter =>
                    confirmShippingComplete(
                        removeTableKeyPrefix(letter?.SK),
                        removeTableKeyPrefix(letter.PK),
                    ),
                );

                const results = await Promise.all(promises);

                // 결과 처리
                const successResults = results.filter(result => result.success);
                successCount = successResults.length;
                failCount = selectedRows.length - successCount;

                // 성공한 항목들의 로컬 상태 한번에 업데이트
                if (successCount > 0) {
                    handleUpdateMultipleLetters(
                        selectedRows
                            .filter((_, i) => results[i].success)
                            .map(letter => removeTableKeyPrefix(letter?.SK)),
                        { shippingStatus: status },
                    );
                }

                // 사용자에게 결과 알림
                if (successCount > 0) {
                    toast.success(
                        `${successCount}개의 편지 배송상태가 '${statusText}'(으)로 변경되었습니다.`,
                    );
                }

                if (failCount > 0) {
                    toast.error(`${failCount}개의 편지 배송상태 변경에 실패했습니다.`);
                }

                return;
            } catch (error) {
                console.error('배송완료 처리 오류:', error);
                toast.error('배송완료 처리 중 오류가 발생했습니다.');
                return;
            }
        }

        // complete가 아닌 경우 일반 상태 업데이트 사용
        await handleStatusUpdate({
            selectedRows,
            status,
            statusType: '배송상태',
            statusText: getStatusText(status),
            updateFn: updateShippingStatusAction,
            stateField: 'shippingStatus',
        });
    };

    // 운송장 번호 업데이트 핸들러
    const handleUpdateTrackingNumber = async (letter: LetterPublic, trackingNumber: string) => {
        try {
            const result = await updateLetterTrackingNumberAction(
                removeTableKeyPrefix(letter.PK),
                removeTableKeyPrefix(letter?.SK),
                trackingNumber,
            );

            if (!result.success) {
                throw new Error(result.error.message);
            }

            // 로컬 상태 업데이트
            handleUpdateLetter(removeTableKeyPrefix(letter?.SK), {
                trackingNumber: result.data.trackingNumber,
            });

            toast.success('등기번호가 업데이트되었습니다.');
            return true;
        } catch (error) {
            toast.error('등기번호 업데이트에 실패했습니다.');
            console.error('Error updating tracking number:', error);
            return false;
        }
    };

    // 단일 편지에 대한 결제 상태 업데이트 핸들러
    const handleUpdateSinglePaymentStatus = async (letter: LetterPublic, status: PaymentStatus) => {
        try {
            const result = await updatePaymentStatusAction(
                removeTableKeyPrefix(letter.PK),
                removeTableKeyPrefix(letter?.SK),
                status,
            );

            if (!result.success) {
                throw new Error(result.error?.message || '결제상태 업데이트에 실패했습니다.');
            }

            // 로컬 상태 업데이트
            handleUpdateLetter(removeTableKeyPrefix(letter?.SK), {
                paymentStatus: status,
                paymentCompletedAt: result.data.paymentCompletedAt,
            });

            toast.success('결제상태가 업데이트되었습니다.');
            return true;
        } catch (error) {
            toast.error('결제상태 업데이트에 실패했습니다.');
            console.error('Error updating payment status:', error);
            return false;
        }
    };

    // 단일 편지에 대한 배송 상태 업데이트 핸들러
    const handleUpdateSingleShippingStatus = async (
        letter: LetterPublic,
        status: ShippingStatus,
    ) => {
        console.log('handleUpdateSingleShippingStatus', letter, status);
        // 배송 완료 상태인 경우 특별한 처리
        if (status === 'complete') {
            try {
                const result = await confirmShippingComplete(
                    removeTableKeyPrefix(letter.PK),
                    removeTableKeyPrefix(letter?.SK),
                );

                if (!result.success) {
                    throw new Error(result.error?.message || '배송완료 처리에 실패했습니다.');
                }

                // 로컬 상태 업데이트
                handleUpdateLetter(removeTableKeyPrefix(letter?.SK), {
                    shippingStatus: status,
                    shippingCompletedAt: result.data.letter.shippingCompletedAt,
                });

                return {
                    success: true,
                    data: result.data,
                };
            } catch (error) {
                toast.error('배송완료 처리에 실패했습니다.');
                console.error('Error confirming shipping complete:', error);
                return {
                    success: false,
                    error: error,
                };
            }
        }

        // complete가 아닌 경우 일반 상태 업데이트 사용
        try {
            const result = await updateShippingStatusAction(
                removeTableKeyPrefix(letter.PK),
                removeTableKeyPrefix(letter?.SK),
                status,
            );

            if (!result.success) {
                throw new Error(result.error?.message || '배송상태 업데이트에 실패했습니다.');
            }

            // 로컬 상태 업데이트
            handleUpdateLetter(removeTableKeyPrefix(letter?.SK), {
                shippingStatus: status,
            });

            toast.success('배송상태가 업데이트되었습니다.');
            return {
                success: true,
            };
        } catch (error) {
            toast.error('배송상태 업데이트에 실패했습니다.');
            console.error('Error updating shipping status:', error);
            return {
                success: false,
                error: error,
            };
        }
    };

    return {
        handleRowClick,
        handleDeleteSelectedLetters,
        handleExportSelectedLetters,
        handleUpdatePaymentStatus,
        handleUpdateShippingStatus,
        handleUpdateTrackingNumber,
        handleUpdateSinglePaymentStatus,
        handleUpdateSingleShippingStatus,
    };
}
