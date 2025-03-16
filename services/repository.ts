import 'server-only';
import { dynamoClient } from '@/services/dynamo';
import {
    GetCommand,
    QueryCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    TransactWriteCommand,
    TransactGetCommand,
    TransactWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import joinExpressionAttributes from '@/lib/expression-attributes';
import { DynamoEntity } from '@/models/types/dynamo';

export type ExpressionOptions = {
    condition?: string;
    expressionNames?: Record<string, string>;
    expressionValues?: Record<string, unknown>;
};

export type TransactWriteItem = {
    Put?: {
        Item: DynamoEntity;
        TableName?: string;
        ConditionExpression?: string;
        ExpressionAttributeNames?: Record<string, string>;
        ExpressionAttributeValues?: Record<string, unknown>;
    };
    Update?: {
        Key: { PK: string; SK: string };
        TableName?: string;
        UpdateExpression: string;
        ExpressionAttributeNames?: Record<string, string>;
        ExpressionAttributeValues?: Record<string, unknown>;
        ConditionExpression?: string;
    };
    Delete?: {
        Key: { PK: string; SK: string };
        TableName?: string;
        ConditionExpression?: string;
        ExpressionAttributeNames?: Record<string, string>;
        ExpressionAttributeValues?: Record<string, unknown>;
    };
    ConditionCheck?: {
        Key: { PK: string; SK: string };
        TableName?: string;
        ConditionExpression: string;
        ExpressionAttributeNames?: Record<string, string>;
        ExpressionAttributeValues?: Record<string, unknown>;
    };
};

export type TransactGetItem = {
    Get: {
        Key: { PK: string; SK: string };
        TableName?: string;
    };
};

export type DynamoKey = { pk: string; sk: string };

/**
 * 트랜잭션 빌더 클래스 - 더 간단한 트랜잭션 작업을 위한 빌더 패턴 구현
 */
export class TransactionBuilder {
    private writeItems: TransactWriteItem[] = [];
    private keysToGet: DynamoKey[] = [];

    constructor(private _repository: Repository) {}

    /**
     * 항목 추가 메서드
     * @param item 저장할 DynamoDB 항목
     * @param options 표현식 옵션 (조건, 속성 이름, 속성 값)
     */
    putItem<T extends DynamoEntity>(item: T, options?: ExpressionOptions): TransactionBuilder {
        this.writeItems.push({
            Put: {
                Item: item,
                ...(options?.condition && {
                    ConditionExpression: options.condition,
                    ExpressionAttributeNames: options.expressionNames,
                    ExpressionAttributeValues: options.expressionValues,
                }),
            },
        });

        // 자동으로 결과를 가져올 항목으로 추가
        this.keysToGet.push({ pk: item.PK, sk: item?.SK });

        return this;
    }

    /**
     * 항목 업데이트 메서드
     * @param pk 파티션 키
     * @param sk 정렬 키
     * @param item 업데이트할 항목 데이터
     * @param updateExpressionPrefix 업데이트 표현식 접두사
     */
    updateItem<T extends Partial<DynamoEntity>>(
        pk: string,
        sk: string,
        item: T,
        updateExpressionPrefix: 'SET' | 'ADD' | 'DELETE' = 'SET',
    ): TransactionBuilder {
        const { updateExpressions, expressionAttributeNames, expressionAttributeValues } =
            joinExpressionAttributes(
                {
                    ...item,
                },
                updateExpressionPrefix,
            );

        this.writeItems.push({
            Update: {
                Key: { PK: pk, SK: sk },
                UpdateExpression: `${updateExpressionPrefix} ${updateExpressions.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
            },
        });

        // 자동으로 결과를 가져올 항목으로 추가
        this.keysToGet.push({ pk, sk });

        return this;
    }

    /**
     * 항목 삭제 메서드
     * @param pk 파티션 키
     * @param sk 정렬 키
     * @param options 표현식 옵션 (조건, 속성 이름, 속성 값)
     */
    deleteItem(pk: string, sk: string, options?: ExpressionOptions): TransactionBuilder {
        this.writeItems.push({
            Delete: {
                Key: { PK: pk, SK: sk },
                ...(options?.condition && {
                    ConditionExpression: options.condition,
                    ExpressionAttributeNames: options.expressionNames,
                    ExpressionAttributeValues: options.expressionValues,
                }),
            },
        });
        return this;
    }

    /**
     * 조건 확인 메서드
     * @param pk 파티션 키
     * @param sk 정렬 키
     * @param condition 조건 표현식
     * @param expressionNames 표현식 속성 이름
     * @param expressionValues 표현식 속성 값
     */
    checkCondition(
        pk: string,
        sk: string,
        condition: string,
        expressionNames?: Record<string, string>,
        expressionValues?: Record<string, unknown>,
    ): TransactionBuilder {
        this.writeItems.push({
            ConditionCheck: {
                Key: { PK: pk, SK: sk },
                ConditionExpression: condition,
                ExpressionAttributeNames: expressionNames,
                ExpressionAttributeValues: expressionValues,
            },
        });
        return this;
    }

    /**
     * 결과를 가져올 항목 추가 메서드
     * @param pk 파티션 키
     * @param sk 정렬 키
     */
    getResult(pk: string, sk: string): TransactionBuilder {
        this.keysToGet.push({ pk, sk });
        return this;
    }

    /**
     * 트랜잭션 실행 메서드
     */
    async execute(): Promise<TransactWriteCommandOutput> {
        return await this._repository.transactWrite(this.writeItems);
    }

    /**
     * 트랜잭션 실행 후 결과 가져오기
     */
    async executeAndGet<T extends DynamoEntity>(): Promise<T[]> {
        const results = await this._repository.transactWriteAndGet(this.writeItems, this.keysToGet);
        return results.filter(Boolean) as T[];
    }
}

/**
 * DynamoDB 레포지토리 클래스
 * 데이터베이스 작업을 위한 인터페이스 제공
 */
export class Repository {
    // eslint-disable-next-line no-unused-vars
    constructor(private tableName: string) {}

    /**
     * 단일 항목 조회
     * @param pk 파티션 키
     * @param sk 정렬 키
     */
    async get<T extends DynamoEntity>(pk: string, sk: string): Promise<T | undefined> {
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: { PK: pk, SK: sk },
            });
            const result = await dynamoClient.send(command);
            return result.Item as T | undefined;
        } catch (error) {
            console.error('DynamoDB get error:', error);
            return undefined;
        }
    }

    /**
     * 항목 저장
     * @param item 저장할 항목
     */
    async put<T extends DynamoEntity>(item: T): Promise<T | undefined> {
        try {
            await dynamoClient.send(
                new PutCommand({
                    TableName: this.tableName,
                    Item: item,
                }),
            );
            return item;
        } catch (error) {
            console.error('DynamoDB put error:', error);
            return undefined;
        }
    }

    /**
     * 항목 업데이트
     * @param pk 파티션 키
     * @param sk 정렬 키
     * @param item 업데이트할 데이터
     * @param updateExpressionPrefix 업데이트 표현식 접두사
     */
    async update<T extends DynamoEntity>(
        pk: string,
        sk: string,
        item: Partial<T>,
        updateExpressionPrefix: 'set' | 'add' | 'delete' = 'set',
    ): Promise<T | undefined> {
        try {
            const { updateExpressions, expressionAttributeNames, expressionAttributeValues } =
                joinExpressionAttributes({
                    ...item,
                    updatedAt: new Date().toISOString(),
                });

            const result = await dynamoClient.send(
                new UpdateCommand({
                    TableName: this.tableName,
                    Key: { PK: pk, SK: sk },
                    UpdateExpression: `${updateExpressionPrefix} ${updateExpressions.join(', ')}`,
                    ExpressionAttributeValues: expressionAttributeValues,
                    ExpressionAttributeNames: expressionAttributeNames,
                    ReturnValues: 'ALL_NEW',
                }),
            );

            return result.Attributes as T | undefined;
        } catch (error) {
            console.error('DynamoDB update error:', error);
            return undefined;
        }
    }

    /**
     * 쿼리 기본 메서드
     * @param params 쿼리 파라미터
     */
    private async queryBase<T extends DynamoEntity>(params: QueryCommand): Promise<T[]> {
        try {
            const result = await dynamoClient.send(params);
            return (result.Items || []) as T[];
        } catch (error) {
            console.error('DynamoDB query error:', error);
            return [];
        }
    }

    /**
     * 기본 테이블 쿼리
     * @param pk 파티션 키
     * @param skPrefix 정렬 키 접두사 (선택사항)
     * @param scanIndexForward 정렬 방향 (오름차순/내림차순)
     */
    async query<T extends DynamoEntity>(
        pk: string,
        skPrefix?: string,
        scanIndexForward?: boolean,
    ): Promise<T[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: skPrefix
                ? 'PK = :pk AND begins_with(SK, :skPrefix)'
                : 'PK = :pk',
            ExpressionAttributeValues: skPrefix
                ? { ':pk': pk, ':skPrefix': skPrefix }
                : { ':pk': pk },
            ScanIndexForward: scanIndexForward,
        });
        return this.queryBase(command);
    }

    /**
     * GSI1 인덱스 쿼리
     * @param gsi1pk GSI1 파티션 키
     * @param gsi1skPrefix GSI1 정렬 키 접두사 (선택사항)
     * @param scanIndexForward 정렬 방향 (오름차순/내림차순)
     */
    async queryGSI1<T extends DynamoEntity>(
        gsi1pk: string,
        gsi1skPrefix?: string,
        scanIndexForward?: boolean,
    ): Promise<T[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            IndexName: 'GSI1',
            KeyConditionExpression: gsi1skPrefix
                ? 'GSI1PK = :gsi1pk AND begins_with(GSI1SK, :gsi1skPrefix)'
                : 'GSI1PK = :gsi1pk',
            ExpressionAttributeValues: gsi1skPrefix
                ? { ':gsi1pk': gsi1pk, ':gsi1skPrefix': gsi1skPrefix }
                : { ':gsi1pk': gsi1pk },
            ScanIndexForward: scanIndexForward,
        });
        return this.queryBase(command);
    }

    /**
     * GSI2 인덱스 쿼리
     * @param gsi2pk GSI2 파티션 키
     * @param gsi2skPrefix GSI2 정렬 키 접두사 (선택사항)
     * @param scanIndexForward 정렬 방향 (오름차순/내림차순)
     */
    async queryGSI2<T extends DynamoEntity>(
        gsi2pk: string,
        gsi2skPrefix?: string,
        scanIndexForward?: boolean,
    ): Promise<T[]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            IndexName: 'GSI2',
            KeyConditionExpression: gsi2skPrefix
                ? 'GSI2PK = :gsi2pk AND begins_with(GSI2SK, :gsi2skPrefix)'
                : 'GSI2PK = :gsi2pk',
            ExpressionAttributeValues: gsi2skPrefix
                ? { ':gsi2pk': gsi2pk, ':gsi2skPrefix': gsi2skPrefix }
                : { ':gsi2pk': gsi2pk },
            ScanIndexForward: scanIndexForward,
        });
        return this.queryBase(command);
    }

    /**
     * 항목 삭제
     * @param pk 파티션 키
     * @param sk 정렬 키
     */
    async delete(pk: string, sk: string): Promise<boolean> {
        try {
            const command = new DeleteCommand({
                TableName: this.tableName,
                Key: { PK: pk, SK: sk },
            });
            const result = await dynamoClient.send(command);
            return result.$metadata.httpStatusCode === 200;
        } catch (error) {
            console.error('DynamoDB delete error:', error);
            return false;
        }
    }

    /**
     * 커스텀 업데이트 표현식 실행
     * @param pk 파티션 키
     * @param sk 정렬 키
     * @param updateExpression 업데이트 표현식
     * @param expressionAttributeNames 표현식 속성 이름
     * @param expressionAttributeValues 표현식 속성 값
     */
    async updateExpression(
        pk: string,
        sk: string,
        updateExpression: string,
        expressionAttributeNames: Record<string, string>,
        expressionAttributeValues: Record<string, unknown>,
    ): Promise<DynamoEntity | false> {
        try {
            const result = await dynamoClient.send(
                new UpdateCommand({
                    TableName: this.tableName,
                    Key: { PK: pk, SK: sk },
                    UpdateExpression: updateExpression,
                    ExpressionAttributeNames: expressionAttributeNames,
                    ExpressionAttributeValues: expressionAttributeValues,
                    ReturnValues: 'ALL_NEW',
                }),
            );
            return result.Attributes as DynamoEntity;
        } catch (error) {
            console.error('Update expression error:', error);
            return false;
        }
    }

    /**
     * 트랜잭션 쓰기 메서드
     * @param transactItems 트랜잭션 항목 배열
     */
    async transactWrite(transactItems: TransactWriteItem[]): Promise<TransactWriteCommandOutput> {
        try {
            const formattedItems = transactItems.map(item => {
                // 각 작업 타입 확인 (Put, Update, Delete 등)
                const operationType = Object.keys(item)[0] as keyof TransactWriteItem;

                // 해당 작업 내부에 TableName 추가
                return {
                    [operationType]: {
                        ...item[operationType],
                        TableName: this.tableName,
                    },
                };
            });

            const command = new TransactWriteCommand({
                TransactItems: formattedItems,
            });

            return await dynamoClient.send(command);
        } catch (error) {
            console.error('TransactWrite error:', error);
            throw error; // 트랜잭션 실패는 중요하므로 에러 다시 던지기
        }
    }

    /**
     * 트랜잭션 읽기 메서드
     * @param transactItems 트랜잭션 읽기 항목 배열
     */
    async transactGet(transactItems: TransactGetItem[]): Promise<(DynamoEntity | undefined)[]> {
        try {
            const formattedItems = transactItems.map(item => {
                return {
                    Get: {
                        ...item.Get,
                        TableName: this.tableName,
                    },
                };
            });

            const command = new TransactGetCommand({
                TransactItems: formattedItems,
            });

            const result = await dynamoClient.send(command);
            return (result.Responses || []).map(
                response => response.Item as DynamoEntity | undefined,
            );
        } catch (error) {
            console.error('TransactGet error:', error);
            return [];
        }
    }

    /**
     * 트랜잭션 쓰기 후 지정된 항목들을 조회하는 메서드
     * @param transactItems 트랜잭션 쓰기 항목 배열
     * @param keysToGet 조회할 키 배열
     */
    async transactWriteAndGet(
        transactItems: TransactWriteItem[],
        keysToGet: DynamoKey[],
    ): Promise<(DynamoEntity | undefined)[]> {
        try {
            // 트랜잭션 실행
            await this.transactWrite(transactItems);

            // 지정된 키로 항목들 조회
            const results = await Promise.all(keysToGet.map(key => this.get(key.pk, key.sk)));

            return results;
        } catch (error) {
            console.error('TransactWriteAndGet error:', error);
            throw error;
        }
    }

    /**
     * 트랜잭션 빌더 생성 메서드 - 체이닝 방식으로 트랜잭션 작업을 구성할 수 있음
     */
    transaction(): TransactionBuilder {
        return new TransactionBuilder(this);
    }
}
