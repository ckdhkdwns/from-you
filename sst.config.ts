/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'from-you',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            protect: ['production'].includes(input?.stage),
            home: 'aws',
        };
    },
    async run() {
        const table = new sst.aws.Dynamo('FromYouTable', {
            fields: {
                PK: 'string',
                SK: 'string',
                GSI1PK: 'string',
                GSI1SK: 'string',
                GSI2PK: 'string',
                GSI2SK: 'string',
                GSI3PK: 'string',
                GSI3SK: 'string',
            },
            primaryIndex: {
                hashKey: 'PK',
                rangeKey: 'SK',
            },
            globalIndexes: {
                GSI1: {
                    hashKey: 'GSI1PK',
                    rangeKey: 'GSI1SK',
                },
                GSI2: {
                    hashKey: 'GSI2PK',
                    rangeKey: 'GSI2SK',
                },
                GSI3: {
                    hashKey: 'GSI3PK',
                    rangeKey: 'GSI3SK',
                },
            },
        });

        const bucket = new sst.aws.Bucket('FromYouBucket', {
            access: 'public',
        });

        const nextApp = new sst.aws.Nextjs('FromYou', {
            link: [table, bucket],
            environment: {
                NEXT_PUBLIC_ACM_CERTIFICATE_ARN: process.env.NEXT_PUBLIC_ACM_CERTIFICATE_ARN || '',
            },
            domain: {
                name: 'fromyou.co.kr',
                dns: false,
                cert: process.env.NEXT_PUBLIC_ACM_CERTIFICATE_ARN || '',
            },
        });
    },
});
