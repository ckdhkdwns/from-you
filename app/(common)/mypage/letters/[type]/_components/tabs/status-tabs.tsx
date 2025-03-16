'use client';

import RoundedTabs from '@/components/ui/rounded-tabs';
import { useMyLetters, statusTabs } from '../../../../_contexts/my-letters-provider';

export default function StatusTabs() {
    const { filter2, setFilter2, hideStatusTabs } = useMyLetters();

    if (hideStatusTabs) return null;

    return (
        <RoundedTabs
            tabs={statusTabs}
            activeTab={filter2}
            onClick={tab => {
                setFilter2(tab);
            }}
        />
    );
}
