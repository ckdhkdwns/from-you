import React from 'react';
import { getAllTemplates } from '@/models/actions/template-actions';
import TemplatesPage from './_components/templates-page';

export default async function Page() {
    const { data: templates } = await getAllTemplates();
    return <TemplatesPage templates={templates} />;
}
