export const verifyTossPaymentWithAPI = async ({
    orderId,
    amount,
    paymentKey,
}: {
    orderId: string;
    amount: string;
    paymentKey: string;
}) => {
    try {
        const encryptedSecretKey =
            'Basic ' +
            Buffer.from(process.env.TOSSPAY_SECRET_KEY + ':').toString(
                'base64',
            );
        // 토스페이 API 호출
        const response = await fetch(
            `${process.env.TOSSPAY_API_URL}/payments/confirm`,
            {
                method: 'POST',
                body: JSON.stringify({ orderId, amount, paymentKey }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: encryptedSecretKey,
                },
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const data = await response.json();

        if (data.status !== 'DONE') {
            throw new Error('결제 실패');
        }

        return data;
    } catch (error) {
        console.error(error);
        return false;
    }
};
