'use server';

import axios from 'axios';

export interface TrackingInfo {
    addrseNm: string;
    applcntNm: string;
    dlvyDe: string;
    rgist: number;
    pstmtrKnd: string;
    dlvySttus: string;
    trtmntSe: string;
    longitudinalDomesticList: {
        dlvyDate: string;
        processSttus: string;
        detailDc: string;
        dlvyTime: string;
        nowLc: string;
    }[];
}

export async function fetchTrackingInfo(trackingNumber: string): Promise<TrackingInfo | null> {
    try {
        const response = await axios.get(
            `http://openapi.epost.go.kr/trace/retrieveLongitudinalService/retrieveLongitudinalService/getLongitudinalDomesticList?rgist=${trackingNumber}&serviceKey=${process.env.POST_TRACKING_API_KEY}`,
        );

        try {
            const apiResponse = response.data?.LongitudinalDomesticListResponse as TrackingInfo;

            if (
                !apiResponse ||
                !apiResponse.longitudinalDomesticList ||
                !apiResponse.longitudinalDomesticList
            ) {
                throw new Error('유효하지 않은 응답 형식');
            }

            return apiResponse;
        } catch (parseError) {
            console.error('응답 처리 오류:', parseError);
        }
    } catch (error) {
        console.error('배송 조회 API 오류:', error);
        return null;
    }
}
