'use client';

import { useEffect } from 'react';

interface BodyClassModifierProps {
  htmlClassName?: string;
  bodyClassName?: string;
}

export default function BodyClassModifier({ 
  htmlClassName, 
  bodyClassName 
}: BodyClassModifierProps) {
  useEffect(() => {
    // HTML 요소에 클래스 추가
    if (htmlClassName) {
      document.documentElement.classList.add(...htmlClassName.split(' '));
    }
    
    // Body 요소에 클래스 추가
    if (bodyClassName) {
      document.body.classList.add(...bodyClassName.split(' '));
    }

    // 컴포넌트 언마운트 시 클래스 제거
    return () => {
      if (htmlClassName) {
        document.documentElement.classList.remove(...htmlClassName.split(' '));
      }
      
      if (bodyClassName) {
        document.body.classList.remove(...bodyClassName.split(' '));
      }
    };
  }, [htmlClassName, bodyClassName]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
} 