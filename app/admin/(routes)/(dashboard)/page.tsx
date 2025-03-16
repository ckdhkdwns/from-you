import { getLettersByDateAction } from "@/models/actions/letter-actions";
import { getUsersByDateAction } from "@/models/actions/user-actions";
import { StatisticsProvider } from "./_contexts/statistics-provider";
import { DashboardContent } from "./_components/dashboard-content";

export default async function AdminDashboard() {
    const today = new Date().toISOString().split("T")[0];

    const [lettersResponse, usersResponse] = await Promise.all([
        getLettersByDateAction(today),
        getUsersByDateAction(today),
    ]);

    const initialLetters = lettersResponse.success ? lettersResponse.data : [];
    const initialUsers = usersResponse.success ? usersResponse.data : [];

    return (
        <div className="flex flex-col">
            <StatisticsProvider
                initialLetters={initialLetters}
                initialUsers={initialUsers}
            >
                <DashboardContent />
            </StatisticsProvider>
        </div>
    );
}
