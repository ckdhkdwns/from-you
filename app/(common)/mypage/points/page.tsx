import React from 'react';
import { PointLogProvider } from './_contexts/point-log-provider';
import PointLogList from './components/point-log-list';
import { getMyPointLogsAction } from '@/models/actions/point-action';

export default async function Page() {
    const response = await getMyPointLogsAction();

    const initialPointLogs = response.success
        ? [...response.data].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
        : [];

    return (
        <PointLogProvider initialPointLogs={initialPointLogs}>
            <div className="pt-12">
                <h1 className="text-lg font-semibold mt-0 mb-2">포인트 내역</h1>
                <PointLogList />
            </div>
        </PointLogProvider>
    );
}
