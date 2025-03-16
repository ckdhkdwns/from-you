import { Separator } from '@/components/ui/separator';
import { getCurrentUser } from '@/models/actions/user-actions';
import ProfileForm from './profile-form';

export default async function ProfilePage() {
    // 서버 컴포넌트에서 사용자 데이터 가져오기
    const { data: userData, error } = await getCurrentUser();

    if (error) {
        return (
            <div className="pt-12">
                <h1 className="text-lg font-semibold mt-0 mb-2">회원 정보 수정</h1>
                <Separator className="bg-primary-black h-[2px] mb-8" />
                <div className="text-center py-8">
                    사용자 정보를 불러오는 중 오류가 발생했습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="pt-12">
            <h1 className="text-lg font-semibold mt-0 mb-2">회원 정보 수정</h1>
            <Separator className="bg-primary-black h-[2px] mb-8" />

            {/* 클라이언트 컴포넌트로 분리된 프로필 폼 */}
            <ProfileForm initialUserData={userData} />
        </div>
    );
}
