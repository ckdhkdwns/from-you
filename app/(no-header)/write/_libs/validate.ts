import { AddressPublic } from "@/models/types/address";
import { STEP_KEYS, StepKey } from "../_types/steps";

const validateLetterContent = (text: string[]) => {
    if (text.length === 0 || text[0] === "") {
        throw new Error("편지 내용을 입력해주세요.");
    }
};

const validateLetterAddress = (
    address: AddressPublic,
    type: "recipient" | "sender"
) => {
    const requiredFields = [
        { field: "address1", label: "주소" },
        { field: "name", label: "이름" },
        { field: "zonecode", label: "우편번호" },
    ];

    const prefix = type === "recipient" ? "받는 사람" : "보내는 사람";

    for (const field of requiredFields) {
        if (address[field.field as keyof AddressPublic] !== "") continue;

        throw new Error(`${prefix} ${field.label}를 입력해주세요.`);
    }
};

const validateLetterPostTypes = (postTypes: string) => {
    if (postTypes === "") {
        throw new Error("우편 유형을 선택해주세요.");
    }
};

export const validateLetterData = (
    data: {
        currentStep: StepKey;
        text: string[];
        recipientAddress: AddressPublic;
        senderAddress: AddressPublic;
        postTypes: string;
    },
    strict?: boolean
): {
    isValid: boolean;
    errorMessage?: string;
} => {
    try {
        if (data.currentStep === STEP_KEYS.LETTER_CONTENT || strict) {
            validateLetterContent(data.text);
        }
        if (data.currentStep === STEP_KEYS.ADDRESS || strict) {
            validateLetterAddress(data.recipientAddress, "recipient");
            validateLetterAddress(data.senderAddress, "sender");
        }
        if (data.currentStep === STEP_KEYS.POST_TYPES || strict) {
            validateLetterPostTypes(data.postTypes);
        }
        return {
            isValid: true,
        };
    } catch (error) {
        return {
            isValid: false,
            errorMessage: error.message,
        };
    }
};
