'use client';

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from 'react';
import { LetterPublic } from '@/models/types/letter';
import { ReviewPublic, ReviewFormData } from '@/models/types/review';
import {
    createReviewAction,
    getMyReviewsAction,
    getMyPreparedLettersAction,
} from '@/models/actions/review-actions';
import { toast } from 'sonner';
import { removeTableKeyPrefix } from '@/lib/api-utils';

interface ReviewContextType {
    selectedLetter: LetterPublic | null;
    isReviewDialogOpen: boolean;
    reviews: ReviewPublic[];
    preparedLetters: LetterPublic[];
    openReviewDialog: (_letter: LetterPublic) => void;
    closeReviewDialog: () => void;
    submitReview: (_data: ReviewFormData) => Promise<void>;
    fetchPreparedLetters: () => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

interface ReviewProviderProps {
    children: ReactNode;
    initialReviews?: ReviewPublic[];
    initialPreparedLetters?: LetterPublic[];
}

export function ReviewProvider({
    children,
    initialReviews = [],
    initialPreparedLetters = [],
}: ReviewProviderProps) {
    const [selectedLetter, setSelectedLetter] = useState<LetterPublic | null>(null);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [reviews, setReviews] = useState<ReviewPublic[]>(initialReviews);
    const [preparedLetters, setPreparedLetters] = useState<LetterPublic[]>(initialPreparedLetters);

    const openReviewDialog = (letter: LetterPublic) => {
        setSelectedLetter(letter);
        setIsReviewDialogOpen(true);
    };

    const closeReviewDialog = () => {
        setIsReviewDialogOpen(false);
        setSelectedLetter(null);
    };

    const submitReview = async (data: ReviewFormData) => {
        if (!selectedLetter) return;

        const letterId = removeTableKeyPrefix(selectedLetter?.SK);
        const {
            success,
            data: { review, earnPoint },
        } = await createReviewAction(letterId, data);

        if (!success) return;

        // 리뷰 목록에 추가
        setPreparedLetters(prev => prev.filter(letter => removeTableKeyPrefix(letter.SK) !== letterId));
        setReviews(prev => [...prev, review]);
        const earnPointText = earnPoint > 0 ? ` ${earnPoint}P 적립되었습니다.` : '';
        toast.success(`리뷰가 등록되었습니다.${earnPointText}`);
        // 다이얼로그 닫기
        closeReviewDialog();
    };

    const fetchPreparedLetters = useCallback(async () => {
        const { data: letters } = await getMyPreparedLettersAction();
        setPreparedLetters(letters);
    }, []);

    const fetchReviews = useCallback(async () => {
        const { data: reviews } = await getMyReviewsAction();
        setReviews(reviews);
    }, []);

    useEffect(() => {
        // initialData가 없을 경우에만 데이터를 패치합니다
        if (initialReviews.length === 0) {
            fetchReviews();
        }

        if (initialPreparedLetters.length === 0) {
            fetchPreparedLetters();
        }
    }, [fetchReviews, fetchPreparedLetters, initialReviews.length, initialPreparedLetters.length]);

    return (
        <ReviewContext.Provider
            value={{
                selectedLetter,
                isReviewDialogOpen,
                reviews,
                preparedLetters,
                openReviewDialog,
                closeReviewDialog,
                submitReview,
                fetchPreparedLetters,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
}

export function useReview() {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
}
