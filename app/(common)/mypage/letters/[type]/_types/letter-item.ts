export interface LetterItem {
    id: string;
    date: string;
}

export interface SentLetterItem extends LetterItem {
    price: number;
    letterCount: number;
    photoCount: number;
    letterType: string;
}
