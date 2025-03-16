'use client';

import { useReview } from '../_contexts/review-context';
import PreparedLetterList from '../_components/prepared-letter-list';

export default function PreparedPage() {
    const { preparedLetters } = useReview();

    return (
        <>
            {preparedLetters.length > 0 ? (
                <PreparedLetterList />
            ) : (
                <div className="text-center text-gray-400 py-8">
                    작성 가능한 후기가 없습니다. <br />
                    후기는 배송이 완료된 후 작성할 수 있습니다.
                </div>
            )}
        </>
    );
}
