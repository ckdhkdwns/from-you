/**
 * 배송 관련 상수 및 매핑 정보
 */

// 배송 상태 매핑
export const SHIPPING_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
} as const;

export type ShippingStatus = (typeof SHIPPING_STATUS)[keyof typeof SHIPPING_STATUS];

export const shippingStatusMapping: Record<ShippingStatus, string> = {
  [SHIPPING_STATUS.PENDING]: "대기",
  [SHIPPING_STATUS.SUCCESS]: "성공",
  [SHIPPING_STATUS.FAILED]: "실패",
};

// 유틸리티 함수
export const getShippingStatusLabel = (status: ShippingStatus): string => {
  return shippingStatusMapping[status] || "";
}; 