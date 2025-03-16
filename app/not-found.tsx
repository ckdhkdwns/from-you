import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold">아직 준비중인 페이지입니다.</h2>
            <p className="text-gray-500">조금만 기다려주세요!</p>
            <Link href="/" className="text-blue-500 mt-4">
                홈으로 돌아가기
            </Link>
        </div>
    );
}
