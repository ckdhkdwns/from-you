import { getActivePopupsAction } from '@/models/actions/popup-actions';
import { ClientPopupDisplay } from './client-popup-display';

export async function PopupDisplay() {
    // 서버 컴포넌트에서 데이터 가져오기
    const { success, data: activePopups } = await getActivePopupsAction();

    // 활성화된 팝업이 없으면 null 반환
    if (!success || !activePopups || activePopups.length === 0) {
        return null;
    }

    // 클라이언트 컴포넌트로 팝업 데이터 전달
    return <ClientPopupDisplay popups={activePopups} />;
}
