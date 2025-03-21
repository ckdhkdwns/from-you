'use server';

import { Resource } from 'sst';
import bcrypt from 'bcryptjs';
import { getUserIdBySession } from '@/lib/auth';
import {
    AddressEntity,
    AddressInput,
    AddressPublic,
    toAddressPublic,
    createAddressEntityFromInput,
    AddressKeys,
} from '../types/address';
import {
    UserEntity,
    UserInput,
    UserPublic,
    Provider,
    UserRole,
    toUserPublic,
    createUserEntityFromInput,
    UserKeys,
} from '../types/user';
import { ActionResponse, withActionResponse } from '../types/response';
import { POINT_CHANGE_REASON } from '@/constants/data/point-change-reason';
import { logPointAction } from './point-action';
import { Repository } from '@/services/repository';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { removeTableKeyPrefix } from '@/lib/api-utils';
import { getCurrentISOTime } from '@/lib/date';

// 테이블 이름
const TABLE_NAME = Resource.FromYouTable.name;

// Repository 인스턴스 생성
const userRepository = new Repository(TABLE_NAME);

/**
 * 현재 사용자가 관리자인지 확인
 */
export async function checkIsAdmin(): Promise<ActionResponse<boolean>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        const PK = UserKeys.pk(userId);
        const SK = UserKeys.sk(userId);
        const user = await userRepository.get<UserEntity>(PK, SK);

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        return user.role === 'admin';
    });
}

/**
 * 현재 사용자의 역할 확인
 */
export async function checkUserRole(): Promise<ActionResponse<UserRole>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        const PK = UserKeys.pk(userId);
        const SK = UserKeys.sk(userId);
        const user = await userRepository.get<UserEntity>(PK, SK);

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        return user.role || 'user';
    });
}


/**
 * 이메일과 비밀번호로 사용자 인증
 */
export async function verifyCredentials(
    email: string,
    password: string,
): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        const PK = UserKeys.pk(email);
        const SK = UserKeys.sk(email);
        const user = await userRepository.get<UserEntity>(PK, SK);

        if (!user) {
            throw new Error('등록되지 않은 이메일입니다.');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }

        return toUserPublic(user);
    });
}


/**
 * 소셜 로그인 처리
 */
export async function handleSocialLogin(
    provider: Provider,
    providerId: string,
    email?: string | null,
    name?: string | null,
): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        const PK = UserKeys.pk(providerId);
        const SK = UserKeys.sk(providerId);

        // 기존 사용자 확인
        const existingUser = await userRepository.get<UserEntity>(PK, SK);

        if (existingUser) {
            return toUserPublic(existingUser);
        }

        const aliases = {
            kakao: '카카오',
            naver: '네이버',
            apple: '애플',
        };

        // 새 사용자 생성
        const input: UserInput = {
            email: email || `${providerId}@${provider}.fromyou`,
            name: name || `${aliases[provider]} 사용자`,
            provider: provider,
            role: 'user', // 기본 역할 설정
        };

        // 새 엔티티 생성 및 저장
        const entity = createUserEntityFromInput(input, providerId, getCurrentISOTime());
        await userRepository.put(entity as UserEntity);

        return toUserPublic(entity as UserEntity);
    });
}

/**
 * 이메일 회원가입
 */
export async function createEmailUser(
    email: string,
    password: string,
    name: string,
    role: UserRole = 'user', // 기본 역할 추가
    phone?: string, // 전화번호 추가 (선택사항)
): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        // 유효성 검사
        if (!email || !password || !name) {
            throw new Error('모든 필드를 입력해주세요.');
        }

        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('유효한 이메일 주소를 입력해주세요.');
        }

        // 비밀번호 강도 검사 (영문/숫자/특수문자 3가지 조합, 10~20자)
        const passwordRegex =
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,20}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('비밀번호는 영문, 숫자, 특수문자 3가지 조합으로 10~20자여야 합니다.');
        }

        // 전화번호 형식 검사
        const phoneRegex = /^\d{10,11}$/;
        if (phone && !phoneRegex.test(phone)) {
            throw new Error('유효한 전화번호를 입력해주세요.');
        }

        // 기존 사용자 검사
        const PK = UserKeys.pk(email);
        const SK = UserKeys.sk(email);
        const existingUser = await userRepository.get<UserEntity>(PK, SK);

        if (existingUser) {
            throw new Error('이미 등록된 이메일입니다.');
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 12);

        // 사용자 입력 생성
        const input: UserInput = {
            email,
            name,
            password: hashedPassword,
            provider: 'email',
            role,
            phone,
            point: phone ? 2000 : 0,
        };

        // 새 엔티티 생성 및 저장
        const entity = createUserEntityFromInput(input, email, getCurrentISOTime());
        await userRepository.put(entity as UserEntity);

        return toUserPublic(entity as UserEntity);
    });
}

/**
 * 주소 생성 공통 함수
 */
async function createAddress(
    addressInput: AddressInput,
    addressType: 'sender' | 'recipient',
): Promise<ActionResponse<AddressPublic>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const addressId = uuidv4();

        // AddressInput 확장
        const fullInput: AddressInput = {
            ...addressInput,
            addressType,
        };

        // isDefault가 true인 경우, 동일 타입의 다른 주소들의 isDefault를 false로 설정
        if (fullInput.isDefault) {
            // 사용자의 모든 주소 검색
            const userAddresses = await userRepository.query(UserKeys.pk(userId), 'ADDRESS#');

            // 동일한, 타입의 주소들 중에서 isDefault가 true인 주소들 필터링
            const defaultAddresses = userAddresses
                .map(item => item as AddressEntity)
                .filter(addr => addr.addressType === addressType && addr.isDefault === true);

            // 기존 기본 주소들의 isDefault를 false로 변경
            for (const addr of defaultAddresses) {
                const updatedAddr = {
                    ...addr,
                    isDefault: false,
                };
                await userRepository.put(updatedAddr as AddressEntity);
            }
        }

        // 새 엔티티 생성 및 저장
        const entity = createAddressEntityFromInput(
            fullInput,
            addressId,
            userId,
            getCurrentISOTime(),
        );
        await userRepository.put(entity as AddressEntity);

        return toAddressPublic(entity as AddressEntity);
    });
}

/**
 * 발신자 주소 생성
 */
export async function createSenderAddress(
    addressInput: AddressInput,
): Promise<ActionResponse<AddressPublic>> {
    return createAddress(addressInput, 'sender');
}

/**
 * 수신자 주소 생성
 */
export async function createRecipientAddress(
    addressInput: AddressInput,
): Promise<ActionResponse<AddressPublic>> {
    return createAddress(addressInput, 'recipient');
}

/**
 * 모든 사용자 조회
 */
export async function getAllUsersAction(): Promise<ActionResponse<UserPublic[]>> {
    return withActionResponse(async () => {
        const result = await userRepository.queryGSI1('USER');
        return result.map(toUserPublic);
    });
}

/**
 * 현재 세션의 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        const PK = UserKeys.pk(userId);
        const SK = UserKeys.sk(userId);
        const user = await userRepository.get<UserEntity>(PK, SK);

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        return toUserPublic(user);
    });
}

/**
 * 사용자 주소 목록 조회
 */
export async function getUserAddresses(
    type: 'recipient' | 'sender',
): Promise<ActionResponse<AddressPublic[]>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();

        // 사용자 ID로 주소 목록 조회
        const result = await userRepository.query(UserKeys.pk(userId), 'ADDRESS#');

        // 주소 타입으로 필터링하고 공개 형식으로 변환
        return result
            .map(item => item as AddressEntity)
            .filter(address => address.addressType === type)
            .map(toAddressPublic);
    });
}

/**
 * 사용자 주소 업데이트
 */
export async function updateUserAddress(
    addressInput: AddressInput,
): Promise<ActionResponse<AddressPublic>> {
    return withActionResponse(async () => {
        if (!addressInput.id) {
            throw new Error('주소 ID가 필요합니다.');
        }

        const userId = await getUserIdBySession();
        const PK = UserKeys.pk(userId);
        const SK = AddressKeys.sk(addressInput.id);

        // 기존 주소 조회
        const existingAddress = await userRepository.get<AddressEntity>(PK, SK);

        if (!existingAddress) {
            throw new Error('주소를 찾을 수 없습니다.');
        }

        // isDefault가 true로 변경되는 경우, 동일 타입의 다른 주소들의 isDefault를 false로 설정
        if (addressInput.isDefault && !existingAddress.isDefault) {
            // 사용자의 모든 주소 검색
            const userAddresses = await userRepository.query(UserKeys.pk(userId), 'ADDRESS#');

            // 동일한 타입의 주소들 중에서 isDefault가 true인 주소들 필터링
            const defaultAddresses = userAddresses
                .map(item => item as AddressEntity)
                .filter(
                    addr =>
                        addr.addressType === existingAddress.addressType &&
                        addr.isDefault === true &&
                        addr?.SK !== SK, // 현재 수정 중인 주소는 제외
                );

            // 기존 기본 주소들의 isDefault를 false로 변경
            for (const addr of defaultAddresses) {
                const updatedAddr = {
                    ...addr,
                    isDefault: false,
                };
                await userRepository.put(updatedAddr as AddressEntity);
            }
        }

        // 업데이트된 주소 엔티티 생성
        const updatedEntity = {
            ...existingAddress,
            ...createAddressEntityFromInput(
                addressInput,
                addressInput.id,
                userId,
                existingAddress.createdAt,
            ),
        };

        // 저장 및 반환
        await userRepository.put(updatedEntity as AddressEntity);
        return toAddressPublic(updatedEntity as AddressEntity);
    });
}

/**
 * 사용자 주소 삭제
 */
export async function deleteUserAddress(addressId: string): Promise<ActionResponse<void>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const PK = UserKeys.pk(userId);
        const SK = AddressKeys.sk(addressId);

        await userRepository.delete(PK, SK);
    });
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(
    userInput: Partial<UserInput>,
): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const PK = UserKeys.pk(userId);
        const SK = UserKeys.sk(userId);

        // 기존 사용자 정보 조회
        const existingUser = await userRepository.get<UserEntity>(PK, SK);

        if (!existingUser) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        // 업데이트할 사용자 엔티티 생성
        const updatedEntity = {
            ...existingUser,
            ...createUserEntityFromInput(
                {
                    ...existingUser,
                    ...userInput,
                    provider: existingUser.provider, // 제공자는 변경 불가
                },
                userId,
                existingUser.createdAt,
            ),
        };

        // 저장 및 반환
        await userRepository.put(updatedEntity as UserEntity);
        return toUserPublic(updatedEntity as UserEntity);
    });
}

/**
 * 비밀번호 찾기
 */
export async function findPassword(email: string): Promise<ActionResponse<{ message: string }>> {
    return withActionResponse(async () => {
        // 사용자 조회
        const PK = UserKeys.pk(email);
        const SK = UserKeys.sk(email);
        const user = await userRepository.get<UserEntity>(PK, SK);

        if (!user) {
            throw new Error('등록되지 않은 이메일입니다.');
        }

        if (user.provider !== 'email') {
            throw new Error(
                `${user.provider} 로그인 사용자입니다. ${user.provider}로 로그인해주세요.`,
            );
        }

        // 임시 비밀번호 생성 (8자리 랜덤 문자열)
        const tempPassword = Math.random().toString(36).slice(-8);

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        // 사용자 비밀번호 업데이트
        const updatedUser = {
            ...user,
            password: hashedPassword,
        };
        await userRepository.put(updatedUser);

        // 이메일 전송
        await sendPasswordResetEmail(email, tempPassword);

        return { message: '임시 비밀번호가 이메일로 전송되었습니다.' };
    });
}

// 이메일 전송 함수
async function sendPasswordResetEmail(email: string, tempPassword: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '[FromYou] 임시 비밀번호 안내',
        html: `
            <div style="font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333; text-align: center;">임시 비밀번호 안내</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #666;">안녕하세요, FromYou 서비스를 이용해 주셔서 감사합니다.</p>
                <p style="font-size: 16px; line-height: 1.6; color: #666;">요청하신 임시 비밀번호는 아래와 같습니다.</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <p style="font-size: 18px; font-weight: bold; color: #333; margin: 0;">${tempPassword}</p>
                </div>
                <p style="font-size: 16px; line-height: 1.6; color: #666;">로그인 후 반드시 비밀번호를 변경해 주세요.</p>
                <p style="font-size: 14px; color: #999; margin-top: 30px; text-align: center;">본 메일은 발신 전용이므로 회신되지 않습니다.</p>
            </div>
        `,
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);
}

/**
 * 회원 탈퇴
 */
export async function withdrawUser(): Promise<ActionResponse<{ message: string }>> {
    return withActionResponse(async () => {
        const userId = await getUserIdBySession();
        const PK = UserKeys.pk(userId);
        const SK = UserKeys.sk(userId);

        await userRepository.delete(PK, SK);
        return { message: '회원 탈퇴가 완료되었습니다.' };
    });
}

/**
 * 사용자 포인트 업데이트
 */
export async function updateUserPoint(
    userId: string,
    newPoint: number,
    oldPoint: number,
): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        const normalizedId = removeTableKeyPrefix(userId);
        const PK = UserKeys.pk(normalizedId);
        const SK = UserKeys.sk(normalizedId);

        // 기존 사용자 정보 조회
        const existingUser = await userRepository.get<UserEntity>(PK, SK);

        if (!existingUser) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        // 포인트 업데이트
        const updatedUser = {
            ...existingUser,
            point: newPoint,
        };

        await userRepository.put(updatedUser);

        // 포인트 로그 기록
        await logPointAction(newPoint - oldPoint, POINT_CHANGE_REASON.ADMIN_ADJUST.value, userId);

        return toUserPublic(updatedUser);
    });
}

/**
 * 날짜별 사용자 조회
 */
export async function getUsersByDateAction(date: string): Promise<ActionResponse<UserPublic[]>> {
    return withActionResponse(async () => {
        const result = await userRepository.queryGSI1('USER', date);
        return result.map(toUserPublic);
    });
}

/**
 * 사용자 차단 상태 업데이트
 */
export async function updateUserBlocked(
    userId: string,
    blocked: boolean,
): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        const normalizedId = removeTableKeyPrefix(userId);
        const PK = UserKeys.pk(normalizedId);
        const SK = UserKeys.sk(normalizedId);

        // 기존 사용자 정보 조회
        const existingUser = await userRepository.get<UserEntity>(PK, SK);

        if (!existingUser) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        // 차단 상태 업데이트
        const updatedUser = {
            ...existingUser,
            blocked,
        };

        await userRepository.put(updatedUser);
        return toUserPublic(updatedUser);
    });
}

/**
 * 사용자 역할 업데이트
 */
export async function updateUserRole(
    userId: string,
    role: UserRole,
): Promise<ActionResponse<UserPublic>> {
    return withActionResponse(async () => {
        // 관리자 권한 확인
        const { data: isAdmin } = await checkIsAdmin();
        if (!isAdmin) {
            throw new Error('관리자 권한이 필요합니다.');
        }

        const normalizedId = removeTableKeyPrefix(userId);
        const PK = UserKeys.pk(normalizedId);
        const SK = UserKeys.sk(normalizedId);

        // 기존 사용자 정보 조회
        const existingUser = await userRepository.get<UserEntity>(PK, SK);

        if (!existingUser) {
            throw new Error('사용자를 찾을 수 없습니다.');
        }

        // 역할 업데이트
        const updatedUser = {
            ...existingUser,
            role,
        };

        await userRepository.put(updatedUser);
        return toUserPublic(updatedUser);
    });
}

/**
 * 선택된 사용자들의 차단 상태 일괄 업데이트
 */
export async function updateSelectedUsersBlocked(
    ids: string | string[],
    blocked: boolean,
): Promise<ActionResponse<UserPublic[]>> {
    return withActionResponse(async () => {
        const idArray = Array.isArray(ids) ? ids : [ids];
        const updatedUsers: UserPublic[] = [];

        // 병렬로 처리
        const promises = idArray.map(async id => {
            const PK = UserKeys.pk(id);
            const SK = UserKeys.sk(id);

            // 기존 사용자 정보 조회
            const existingUser = await userRepository.get<UserEntity>(PK, SK);

            if (existingUser) {
                // 차단 상태 업데이트
                const updatedUser = {
                    ...existingUser,
                    blocked,
                };

                await userRepository.put(updatedUser);
                updatedUsers.push(toUserPublic(updatedUser));
            }
        });

        await Promise.all(promises);
        return updatedUsers;
    });
}
