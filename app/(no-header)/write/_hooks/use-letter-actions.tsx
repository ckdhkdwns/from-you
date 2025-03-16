'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { saveDraftAction } from '@/models/actions/letter-actions';
import { createRecipientAddress, createSenderAddress } from '@/models/actions/user-actions';

import { STEP_KEYS, StepKey } from '../_types/steps';
import { parsePhotos } from '../_libs/parse-photos';

import { useUserData } from '@/contexts/session';
import { Font, LetterInput, Photo } from '@/models/types/letter';
import { TemplatePublic } from '@/models/types/template';
import { TemplateConfigPublic } from '@/models/types/template-config';
import { AddressPublic } from '@/models/types/address';
import { removeTableKeyPrefix } from '@/lib/remove-prefix';

// letterState 타입 정의
interface LetterStateProps {
    template: TemplatePublic;
    setTemplate: (_template: TemplatePublic) => void;
    templateConfig: TemplateConfigPublic;
    text: string[];
    setText: (_text: string[] | ((_prev: string[]) => string[])) => void;
    font: Font;
    photo: Photo[];
    recipientAddress: Partial<AddressPublic>;
    senderAddress: Partial<AddressPublic>;
    postTypes: string;
    saveRecipientAddress: boolean;
    saveSenderAddress: boolean;
    isEditing: boolean;
    setIsEditing: (_isEditing: boolean) => void;
    letterId: string | null;
    setLetterId: (_id: string | null) => void;

    isLoading: boolean;
    setIsLoading: (_isLoading: boolean) => void;
    isAutoSaving: boolean;
    setIsAutoSaving: (_isAutoSaving: boolean) => void;
    setFont: (_font: Font) => void;
    setPhoto: (_photos: Photo[]) => void;
    setRecipientAddress: (_address: Partial<AddressPublic>) => void;
    setSenderAddress: (_address: Partial<AddressPublic>) => void;
    setPostTypes: (_postTypes: string) => void;
    isUsingPoint: boolean;
    setIsUsingPoint: (_isUsingPoint: boolean) => void;
}

interface UseLetterActionsProps {
    letterState: LetterStateProps;
    currentStep: StepKey;
}

export const useLetterActions = ({ letterState, currentStep }: UseLetterActionsProps) => {
    const { userData } = useUserData();
    const router = useRouter();

    const {
        template,
        text,
        font,
        photo,
        recipientAddress,
        senderAddress,
        postTypes,
        saveRecipientAddress,
        saveSenderAddress,
        isEditing,
        setIsEditing,
        letterId,
        setLetterId,
        setIsLoading,
        setIsAutoSaving,
        setText,
    } = letterState;

    // 자동 저장 로직을 처리하는 공통 함수
    const withAutoSave = async (action: () => void) => {
        action();

        try {
            setIsAutoSaving(true);
            await saveDraft(true);
        } catch (error) {
            console.error('자동 저장 중 오류 발생:', error);
            toast.error('자동 저장에 실패했습니다.');
        } finally {
            setIsAutoSaving(false);
        }
    };

    // 편지 저장
    const saveDraft = async (isAutoSave: boolean = false): Promise<boolean> => {
        if (!userData) {
            if (!isAutoSave) {
                toast.error('로그인이 필요합니다.');
            }
            return false;
        }

        if (!isAutoSave) {
            setIsLoading(true);
        }

        const photos = await parsePhotos(photo);

        if (currentStep === STEP_KEYS.LETTER_CONTENT) {
            setText(text.filter(text => text !== ''));
        }
        try {
            // 현재 스텝이 주소 입력이고, 체크박스가 체크되어 있다면 주소 저장
            if (currentStep === STEP_KEYS.ADDRESS) {
                try {
                    if (saveRecipientAddress) {
                        // 수신자 주소 저장 - isDefault가 true인 경우 다른 수신자 주소의 isDefault는 자동으로 false로 설정됨
                        await createRecipientAddress({
                            ...recipientAddress,
                            isDefault: true,
                            addressType: 'recipient',
                            EntityType: 'ADDRESS',
                            zonecode: recipientAddress.zonecode || '',
                            address1: recipientAddress.address1 || '',
                            address2: recipientAddress.address2 || '',
                        } as AddressPublic);
                    }
                    if (saveSenderAddress) {
                        // 발신자 주소 저장 - isDefault가 true인 경우 다른 발신자 주소의 isDefault는 자동으로 false로 설정됨
                        await createSenderAddress({
                            ...senderAddress,
                            isDefault: true,
                            addressType: 'sender',
                            EntityType: 'ADDRESS',
                            zonecode: senderAddress.zonecode || '',
                            address1: senderAddress.address1 || '',
                            address2: senderAddress.address2 || '',
                        } as AddressPublic);
                    }
                } catch (error) {
                    console.error('주소 저장 중 오류 발생:', error);
                    if (!isAutoSave) {
                        toast.error('주소 저장에 실패했습니다.');
                    }
                }
            }

            const letterData: LetterInput = {
                id: removeTableKeyPrefix(letterId || ''),
                template: {
                    PK: template?.PK || '',
                    SK: template?.SK || '',
                    thumbnail: template?.thumbnail || '',
                    paperImage: template?.paperImage || '',
                    name: template?.name || '',
                },
                text,
                font,
                photos,
                recipientAddress: recipientAddress as AddressPublic,
                senderAddress: senderAddress as AddressPublic,
                postType: postTypes,
                isDraft: true,
            };

            const { success, data } = await saveDraftAction(letterData);

            if (success) {
                if (!isAutoSave) {
                    toast.success('편지가 임시저장되었습니다.', {
                        duration: 2000,
                    });
                }
                if (!isEditing) {
                    const letterId = removeTableKeyPrefix(data?.SK);
                    const templateId = removeTableKeyPrefix(template.PK);

                    setLetterId(letterId);
                    setIsEditing(true);
                    router.push(`/write?tid=${templateId}&lid=${letterId}`);
                }
                return true;
            } else {
                if (!isAutoSave) {
                    toast.error('편지 저장에 실패했습니다.');
                }
                return false;
            }
        } catch (error) {
            console.error('편지 저장 중 오류 발생:', error);
            if (!isAutoSave) {
                toast.error('편지 저장에 실패했습니다.');
            }
            return false;
        } finally {
            if (!isAutoSave) {
                setIsLoading(false);
            }
        }
    };

    // const loadDefaultAddress = async () => {
    //     if (!userData) return;

    //     const defaultRecipientAddress = addresses.recipient.find(
    //         (address) => address.isDefault
    //     );
    //     const defaultSenderAddress = addresses.sender.find(
    //         (address) => address.isDefault
    //     );

    //     if (defaultRecipientAddress) {
    //         letterState.setRecipientAddress(defaultRecipientAddress);
    //     }
    //     if (defaultSenderAddress) {
    //         letterState.setSenderAddress(defaultSenderAddress);
    //     }
    // };

    return {
        // loadTemplate,
        // loadLetterDraft,
        saveDraft,
        withAutoSave,
        // loadDefaultAddress,
    };
};
