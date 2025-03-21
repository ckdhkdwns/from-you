import React from 'react';
import { getNotices } from '@/models/actions/notice-actions';
import { NoticesProvider } from './_contexts/notices-provider';
import { NoticeDialog } from './_components/notice-dialog';
import NoticeDataTable from './_components/notice-data-table';

export default async function NoticePage() {
    const { data: notices } = await getNotices();

    return (
        <NoticesProvider initialNotices={notices}>
            <NoticeDialog />
            <NoticeDataTable />
        </NoticesProvider>
    );
}
