import React from 'react';
import { getFAQs } from '@/models/actions/faq-actions';
import { FAQsProvider } from './_contexts/faqs-provider';
import { FAQDialog } from './_components/faq-dialog';
import FAQDataTable from './_components/faq-data-table';

export default async function FAQPage() {
    const response = await getFAQs();
    const faqData = response.success ? response.data : [];

    return (
        <FAQsProvider initialFAQs={faqData}>
            <FAQDialog />
            <FAQDataTable />
        </FAQsProvider>
    );
}
