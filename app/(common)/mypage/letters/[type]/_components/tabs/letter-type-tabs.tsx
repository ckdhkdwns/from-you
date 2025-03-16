'use client';

import LinearTabs from '@/components/ui/linear-tabs';
import { useMyLetters, letterTypeTabs } from '@/app/(common)/mypage/_contexts/my-letters-provider';

export default function LetterTypeTabs() {
    const { filter1 } = useMyLetters();

    return <LinearTabs tabs={letterTypeTabs} activeTab={filter1} />;
}
