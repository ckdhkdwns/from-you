import PointLogDataTable from './_components/point-log-data-table';
import { PointLogProvider } from './_contexts/point-log-provider';
import { getAllPointLogsAction } from '@/models/actions/point-action';

export default async function PointLogsPage() {
    const { data: pointLogs, success } = await getAllPointLogsAction();

    return (
        <PointLogProvider initialPointLogs={success ? pointLogs : []}>
            <PointLogDataTable />
        </PointLogProvider>
    );
}
