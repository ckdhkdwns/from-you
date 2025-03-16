import { getNotices } from '@/models/actions/notice-actions';
import React from 'react';
import NoticeList from './notice-list';

export default async function page({ searchParams }: { searchParams: Promise<{ id: string }> }) {
    const { id } = await searchParams;
    const { data: notices } = await getNotices();

    return <NoticeList notices={notices} defaultOpen={id} />;
}
