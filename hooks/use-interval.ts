'use client';

import { useEffect, useRef } from 'react';

/**
 * 지정된 간격으로 콜백 함수를 실행하는 커스텀 훅
 * @param callback 실행할 콜백 함수
 * @param delay 실행 간격 (밀리초). null이면 타이머가 일시 중지됨
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>(callback);

    // 콜백 함수가 변경될 때마다 ref 업데이트
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // 인터벌 설정
    useEffect(() => {
        // delay가 null이면 타이머를 설정하지 않음
        if (delay === null) return;

        const tick = () => {
            savedCallback.current?.();
        };

        const id = setInterval(tick, delay);

        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(id);
    }, [delay]);
}
