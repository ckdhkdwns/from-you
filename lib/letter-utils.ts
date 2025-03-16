/**
 * 편지 관련 유틸리티 함수들을 정의
 */

/**
 * 우편 유형에 따른 가격 계산
 */
export const calculatePrice = (postType: string): number => {
  const prices: Record<string, number> = {
    "72": 1000, // 일반우편
    "79": 2500, // 준등기우편
    "76": 3000, // 등기우편
    "78": 4000, // A등기(익일특급)
  };

  return prices[postType] || 0;
};

/**
 * 우편 유형 이름 가져오기
 */
export const getPostTypeName = (postType: string): string => {
  const names: Record<string, string> = {
    "72": "일반우편",
    "79": "준등기우편",
    "76": "등기우편",
    "78": "익일특급",
  };

  return names[postType] || "선택되지 않음";
};

/**
 * 편지 상태에 대한 표시 이름
 */
export const getLetterStatusName = (status: string): string => {
  const statusNames: Record<string, string> = {
    'draft': '임시저장',
    'completed': '작성완료',
    'paid': '결제완료',
    'sent': '발송완료',
    'delivered': '배달완료',
  };

  return statusNames[status] || '미정의 상태';
}; 