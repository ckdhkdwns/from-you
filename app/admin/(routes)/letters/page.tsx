import { getCompleteLettersAction } from '@/models/actions/letter-actions';
import CompleteLettersProvider from '../../_contexts/complete-letters-provider';
import LetterDataTable from './_components/letter-data-table';

export default async function LettersPage() {
    const { data: letters } = await getCompleteLettersAction();

    return (
        <CompleteLettersProvider initialLetters={letters || []}>
            <LetterDataTable />
        </CompleteLettersProvider>
    );
}
