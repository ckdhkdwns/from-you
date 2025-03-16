import { getFAQs } from '@/models/actions/faq-actions';
import { FAQsProvider } from './_contexts/faqs-provider';
import { FAQDataTable } from './_components/faq-data-table';
import { FAQDialog } from './_components/faq-dialog';

export default async function FAQPage() {
    const response = await getFAQs();
    const faqData = response.success ? response.data : [];

    return (
        <FAQsProvider initialFAQs={faqData}>
            <FAQDataTable />
            <FAQDialog />
        </FAQsProvider>
    );
}
