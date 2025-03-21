import UserDataTable from './_components/user-data-table';
import UsersProvider from './_contexts/users-provider';
import { UserDialog } from './_components/user-dialog';
import { getAllUsersAction } from '@/models/actions/user-actions';

export default async function UsersPage() {
    const { data: users } = await getAllUsersAction();

    return (
        <UsersProvider initialUsers={users}>
            <UserDataTable />
            <UserDialog />
        </UsersProvider>
    );
}
