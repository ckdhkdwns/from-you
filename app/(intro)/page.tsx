import Link from 'next/link';
import { getAllTemplates } from '@/models/actions/template-actions';
import PopularTemplateCarousel from './_components/popular-template-carousel';
import Image from 'next/image';
import EventSection from './_components/event-section';
import NoticeSection from './_components/notice-section';
import { getNotices } from '@/models/actions/notice-actions';
import SecondEventSection from './_components/second-event-section';
import { Suspense } from 'react';
import UnauthorizedToast from './_components/unauthorized-toast';

export default async function Home() {
    const { data: templates } = await getAllTemplates();
    const { data: notices } = await getNotices();

    const popularTemplates = templates.filter(template => template.isPopular);

    return (
        <div className="items-center justify-center flex flex-col pb-24 w-full md:mt-12">
            <Suspense fallback={<></>}>
                <UnauthorizedToast />
            </Suspense>
            
            <div className="w-full flex flex-col gap-8 mt-4 md:mt-12 mx-auto">
                <div className="flex flex-col w-full md:gap-6 items-center">
                    <PopularTemplateCarousel popularTemplates={popularTemplates} />
                    <Link
                        href="/templates"
                        className="flex items-center text-gray-500 gap-1 active:bg-primary-pink/20 p-4 rounded-md"
                    >
                        <div>더보기</div>
                        <Image
                            src="/icons/half-arrow-right.svg"
                            alt="half-arrow-right"
                            width={24}
                            height={24}
                        />
                    </Link>
                </div>
            </div>

            <div className="my-16 md:my-24 w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
                <EventSection />
                <SecondEventSection />
            </div>

            <NoticeSection notices={notices} />
        </div>
    );
}
