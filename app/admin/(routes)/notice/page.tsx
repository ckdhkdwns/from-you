import React from 'react';
import { getNotices } from '@/models/actions/notice-actions';
import NoticeDataTable from './_components/notice-data-table';
import { NoticesProvider } from './_contexts/notices-provider';

export default async function NoticePage() {
    const { data: notices } = await getNotices();

    return (
        <NoticesProvider initialNotices={notices}>
            <NoticeDataTable />
        </NoticesProvider>
    );
}
