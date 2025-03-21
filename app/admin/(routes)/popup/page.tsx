import React from 'react';
import { getAllPopupsAction } from '@/models/actions/popup-actions';
import { PopupsProvider } from './_contexts/popups-provider';
import PopupDataTable from './_components/popup-data-table';
import { PopupDialog } from './_components/popup-dialog';

export default async function PopupPage() {
    const { data: popups } = await getAllPopupsAction();

    return (
        <PopupsProvider initialPopups={popups || []}>
            <PopupDialog />
            <PopupDataTable />
        </PopupsProvider>
    );
}
