import { DynamoEntity, getISOTimestamp, EntityKeyPattern } from './dynamo';

/**
 * 주소 엔티티 키 생성 패턴
 */
export const AddressKeys: EntityKeyPattern = {
    pk: (userId: string) => `USER#${userId}`,
    sk: (addressId: string) => `ADDRESS#${addressId}`,
    gsi1pk: (userId: string) => `USER#${userId}`,
    gsi1sk: ({ addressType, timestamp }: { addressType: string; timestamp: string }) =>
        `ADDRESS#${addressType}#${timestamp}`,
    gsi2pk: (addressType: string) => `ADDRESS#${addressType}`,
    gsi2sk: ({ userId, timestamp }: { userId: string; timestamp: string }) =>
        `USER#${userId}#${timestamp}`,
};

/**
 * 클라이언트에서 주소 생성/수정 시 사용하는 입력 타입
 */
export interface AddressInput {
    category?: string;
    zonecode: string;
    name?: string;
    address1: string;
    address2: string;
    contact?: string;
    phone?: string;
    prisonerNumber?: string;
    isDefault?: boolean;
    addressType: 'sender' | 'recipient';

    // 기존 주소 수정 시 사용될 ID (새 주소는 불필요)
    id?: string;
}

export interface AddressEntity extends DynamoEntity {
    category?: string;
    zonecode: string;
    name?: string;
    address1: string;
    address2: string;
    contact?: string;
    phone?: string;
    prisonerNumber?: string;
    isDefault?: boolean;
    addressType: 'sender' | 'recipient';
    createdAt: string;
    EntityType: 'ADDRESS';
}

export type AddressPublic = Omit<
    AddressEntity,
    'GSI1PK' | 'GSI1SK' | 'GSI2PK' | 'GSI2SK' | 'EntityType'
>;

/**
 * AddressEntity를 AddressPublic으로 변환
 */
export const toAddressPublic = (address: AddressEntity): AddressPublic => {
    const {
        GSI1PK: _GSI1PK,
        GSI1SK: _GSI1SK,
        GSI2PK: _GSI2PK,
        GSI2SK: _GSI2SK,
        EntityType: _EntityType,
        ...publicAddress
    } = address;
    return publicAddress;
};

/**
 * AddressInput에서 AddressEntity 생성을 위한 유틸리티 함수
 */
export const createAddressEntityFromInput = (
    input: AddressInput,
    addressId: string,
    userId: string,
    timestamp = getISOTimestamp(),
): Partial<AddressEntity> => {
    return {
        PK: AddressKeys.pk(userId),
        SK: AddressKeys.sk(addressId),
        category: input.category,
        zonecode: input.zonecode,
        name: input.name,
        address1: input.address1,
        address2: input.address2,
        contact: input.contact,
        phone: input.phone,
        prisonerNumber: input.prisonerNumber,
        isDefault: input.isDefault || false,
        addressType: input.addressType,
        createdAt: timestamp,
        GSI1PK: AddressKeys.gsi1pk!(userId),
        GSI1SK: AddressKeys.gsi1sk!({ addressType: input.addressType, timestamp }),
        GSI2PK: AddressKeys.gsi2pk!(input.addressType),
        GSI2SK: AddressKeys.gsi2sk!({ userId, timestamp }),
        EntityType: 'ADDRESS',
    };
};
