export const removeTableKeyPrefix = (str: string) => {
    try {
        if (str.includes('#')) {
            const result = str.split('#')[1];
            return result;
        } else {
            return str;
        }
    } catch {
        // console.error("removeTableKeyPrefix 오류:", error);
        return '';
    }
};
