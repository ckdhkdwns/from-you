const joinExpressionAttributes = (
    item: Record<string, unknown>,
    updateExpressionPrefix: 'SET' | 'ADD' | 'DELETE' = 'SET',
) => {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    Object.entries(item).forEach(([key, value], index) => {
        const attributeName = `#attr${index}`;
        const attributeValue = `:val${index}`;

        const text =
            updateExpressionPrefix === 'ADD' // ADD 할 때는 등호가 없음
                ? `${attributeName} ${attributeValue}`
                : `${attributeName} = ${attributeValue}`;

        updateExpressions.push(text);
        expressionAttributeNames[attributeName] = key;
        expressionAttributeValues[attributeValue] = value;
    });

    return {
        updateExpressions,
        expressionAttributeNames,
        expressionAttributeValues,
    };
};

export default joinExpressionAttributes;
